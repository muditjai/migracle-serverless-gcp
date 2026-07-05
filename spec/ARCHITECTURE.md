# Architecture

Detailed system architecture for the Migracle serverless deployment on Google Cloud Platform.

## High-Level Diagram

```
                          ┌──────────────────────────┐
                          │   migracle.com (Namecheap│
                          │   DNS → 34.8.48.9)        │
                          └─────────────┬────────────┘
                                        │
                          ┌─────────────▼────────────┐
                          │   GCP Cloud Load Balancer │
                          │   (global, HTTPS, CDN)    │
                          └─────────────┬────────────┘
                                        │
                ┌───────────────────────┴────────────────────────┐
                │                                                │
       ┌────────▼────────┐                              ┌─────────▼─────────┐
       │ Cloud Storage   │                              │ Cloud Functions   │
       │ (static site)   │                              │ (Node.js 22)      │
       │ public website  │                              │                   │
       └─────────────────┘                              │  /contactHandler  │
                                                        │  /subscribeHandler│
                                                        └─────────┬─────────┘
                                                                  │
                                                        ┌─────────▼─────────┐
                                                        │   Firestore       │
                                                        │   (leads coll.)   │
                                                        └─────────┬─────────┘
                                                                  │
                                                                  │ (notify)
                                                                  ▼
                                                        ┌───────────────────┐
                                                        │  Zoho SMTP        │
                                                        │  mudit@migracle.com│
                                                        └───────────────────┘
```

## Components

### 1. Cloud Storage (static frontend)
- **Bucket**: hosts `index.html`, JS bundle, CSS, and image assets
- **Public read** is enabled at the bucket level
- **Website hosting** is configured on the bucket; the load balancer fronts it

### 2. Cloud Load Balancer
- **Global external HTTP(S) load balancer**
- Terminates SSL with a Google-managed certificate for `migracle.com` and `www.migracle.com`
- Forwards traffic to the Cloud Storage backend bucket
- CDN enabled; first 10GB egress per month is free
- Static IP: `34.8.48.9`

### 3. Cloud Functions (Node.js 22)
- **Region**: `us-central1`
- **Runtime**: `nodejs22`
- **Memory**: 256MB per function
- **Trigger**: HTTP (anonymous, public)
- Functions:
  - `contactHandler` – `POST /contactHandler`
  - `subscribeHandler` – `POST /subscribeHandler`

### 4. Firestore
- **Mode**: Native (not Datastore mode)
- **Single collection**: `leads`
- **Document shape**:
  ```json
  {
    "name": "John Doe",            // optional (contact_form only)
    "email": "john@example.com",   // required
    "source": "contact_form" | "subscription_form",
    "createdAt": "<serverTimestamp>",
    "userAgent": "<string>",        // optional, helpful for spam triage
    "ip": "<string>"                // optional, from req headers
  }
  ```
- Free tier easily covers current volume; see [`COST_ESTIMATION.md`](./COST_ESTIMATION.md)

### 5. Email (Zoho SMTP via Nodemailer)
- Configured with `EMAIL_USER` and `EMAIL_PASS` env vars on each function
- Sends a notification to `mudit@migracle.com` on each successful lead capture
- Subject line prefixes: `[Contact]` for contact form, `[Subscribe]` for subscription

## Frontend Build

- **Bundler**: Webpack 5
- **CSS**: Tailwind CSS 3 (PostCSS pipeline)
- **Framework**: React 19 (no SSR; this is a static site)
- **Entry**: `frontend/src/index.js` → renders `<App />` into `#root`
- **Output**: `frontend/dist/` is uploaded to Cloud Storage by `deploy-gcp.sh`

## API Contracts

### POST `/contactHandler`

Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Optional message"
}
```

Responses:
- `200 { "ok": true }` on success
- `400 { "ok": false, "error": "<reason>" }` on bad input
- `405 { "ok": false, "error": "Method not allowed" }` on non-POST
- `500 { "ok": false, "error": "Internal error" }` on server error

Validation:
- `email` required, must match a basic RFC 5322 regex
- `name` optional, max 200 chars
- `message` optional, max 5000 chars

### POST `/subscribeHandler`

Request:
```json
{
  "email": "john@example.com"
}
```

Same response shape and status codes as contact handler. `email` is required.

## Security

- **CORS**: Both functions set `Access-Control-Allow-Origin` to the production domain. Tighten if you add more origins.
- **Rate limiting**: Currently handled by GCP's default per-function quotas. Consider Cloud Armor if abuse appears.
- **Spam mitigation**: `honeypot` field is checked server-side; submissions with a non-empty honeypot are silently dropped (no DB write, no email).
- **Secrets**: Only in function env vars. Never committed.

## Observability

- **Logs**: Cloud Logging → `projects/migracle-gcp-2/logs/cloudfunctions*`
- **Errors**: All caught errors log a prefixed line (`[contact-handler] …`) for grep-ability
- **Metrics**: Cloud Monitoring auto-collects invocations, duration, and error rate
- **Alerts**: Recommended (not yet configured):
  - Error rate > 5% over 5 min
  - p95 latency > 2s
  - Daily lead volume < 1 (likely a regression)

## Deployment (`deploy-gcp.sh`)

The deploy script handles:
1. Building the frontend (`npm run build`)
2. Syncing `frontend/dist/` to the Cloud Storage bucket
3. Deploying each function in `gcp-functions/` with `--source` and `--runtime=nodejs22`

Run:
```bash
./deploy-gcp.sh             # frontend + functions
./deploy-gcp.sh frontend    # frontend only
./deploy-gcp.sh functions   # functions only
```

## Environment Variables

| Var | Where | Purpose |
|-----|-------|---------|
| `EMAIL_USER` | `contactHandler`, `subscribeHandler` | Zoho SMTP user |
| `EMAIL_PASS` | `contactHandler`, `subscribeHandler` | Zoho SMTP app password |
| `GCP_PROJECT_ID` | used in deploy script | Defaults to `migracle-gcp-2` |

Set via:
```bash
gcloud functions deploy contactHandler \
  --region=us-central1 \
  --runtime=nodejs22 \
  --update-env-vars EMAIL_USER=<user>,EMAIL_PASS=<pass>
```

## Future / Nice-to-have

- Add a Cloud Armor policy for bot protection
- Move lead capture to a queue + Worker function if volume grows
- Add a `respondedAt` field on `leads` so the team can mark follow-ups
- Multi-region failover for the load balancer