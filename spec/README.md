# Migracle — Cloud Cost Savings, Outcome-Based

Website for Migracle, an AI-native professional services company that helps companies **extend their cloud runway**. We do this in three ways, and you can pick whichever fits — or combine them.

**Live site**: https://migracle.com

## What Migracle Does

Migracle helps you **reduce your cloud bill** by extending your cloud runway through one (or a combination) of three approaches:

1. **Optimize your existing cloud stack and AI usage**
   End-to-end optimization across containers, token spend, storage, data warehouses, and the rest of your bill. Unlike other FinOps and infra-optimization products that stop at the dashboard, we optimize the **entire stack end-to-end** — infrastructure, application logic, and architecture — to cut real cost.

2. **Migrate to another cloud to use startup credits (or get a better rate)**
   If you have access to startup cloud credits (typical range **$100k–$350k**), we migrate your stack to that provider so you can deploy against fresh credits. If startup credits aren't applicable but you've found a better rate at another cloud provider (e.g. AWS → GCP), we run the migration end-to-end anyway.

3. **Both**
   Many customers combine 1 and 2 — optimize the current stack first, then move it to the cheaper provider — to compound the savings.

## How We Deliver

We are an **outcome-based, AI-native service**:

- **Milestone-based, one-time payment.** No long-term contract, no recurring retainer.
- **Target ROI:** 5–10× in year 1.
- **Minimal eng team involvement.** We aim for **4–5 meetings** with your team across the engagement; everything else is run by our agents.
- **Parity guaranteed.** Final product functionality and SLAs are delivered at complete parity to your current state after optimization/migration. This is made possible by extensive testing and verification at each layer of the cloud stack.

## Project Structure

```
migracle-serverless/
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── index.js           # React entry point
│   │   └── tailwind.css       # Tailwind input
│   ├── dist/                  # Built assets
│   ├── assets/                # Images
│   ├── index.html
│   ├── styles.css
│   ├── tailwind.config.js
│   ├── webpack.config.js
│   └── package.json
├── gcp-functions/
│   ├── contact-handler/       # Contact form API
│   └── subscribe-handler/     # Subscription API
├── deploy-gcp.sh              # Deployment script (test + prod targets)
└── spec/                      # All project documentation (this folder)
    ├── README.md              #   ← You are here (GitHub renders this)
    ├── AGENTS.md              # Agent-facing instructions
    ├── CODING_STANDARDS.md    # Style, conventions, and deployment workflow
    ├── ARCHITECTURE.md        # System architecture details
    ├── COST_ESTIMATION.md     # GCP cost breakdown
    └── DNS_SETUP.md           # Namecheap DNS configuration
```

## Tech Stack

- **Frontend**: React 19, Tailwind CSS 3, Webpack (static site)
- **Backend**: Node.js 22 Cloud Functions
- **Database**: Firestore (single `leads` collection)
- **Email**: Zoho SMTP via Nodemailer
- **Deployment**: GCP Cloud Run (test container first, manual promotion to prod)

## Documentation

All project documentation lives in the [`spec/`](./spec/) folder:

- [`spec/README.md`](./spec/README.md) – This file (project overview)
- [`spec/AGENTS.md`](./spec/AGENTS.md) – Instructions for AI coding agents
- [`spec/CODING_STANDARDS.md`](./spec/CODING_STANDARDS.md) – Code style, conventions, and the Git/deploy workflow
- [`spec/ARCHITECTURE.md`](./spec/ARCHITECTURE.md) – Detailed system architecture (including the test → prod Cloud Run topology)
- [`spec/COST_ESTIMATION.md`](./spec/COST_ESTIMATION.md) – GCP cost breakdown for hosting this site
- [`spec/DNS_SETUP.md`](./spec/DNS_SETUP.md) – Namecheap DNS configuration

## Deployment Workflow (read this before deploying)

We follow a strict **test → prod** workflow on GCP Cloud Run. Every change is shipped to a test container first, reviewed, and only then promoted to prod.

1. **Commit + push to `main`** after each change.
   - One logical change per commit.
   - Reference the relevant doc in `spec/` if the change affects documented behavior.
2. **Deploy to the test container on Cloud Run** (see [`ARCHITECTURE.md`](./ARCHITECTURE.md) for service names).
   - Build the frontend, run any backend unit tests, and ship to the **test** Cloud Run service.
   - Open the test URL and verify the change looks/behaves as expected.
3. **Promote to prod** only after you've eyeballed the test deployment.
   - Promotion is **manual** — re-tag or re-deploy the same artifact to the **prod** Cloud Run service.

Never push a change directly to prod. Always go via test → review → prod.

See [`CODING_STANDARDS.md`](./CODING_STANDARDS.md#git--deployment-workflow) for the exact commands.

## Environment Variables

Cloud Functions require:
- `EMAIL_USER`: Zoho email address
- `EMAIL_PASS`: Zoho app password

Set via:
```bash
gcloud functions deploy contactHandler --region=us-central1 \
  --update-env-vars EMAIL_USER=your-email,EMAIL_PASS=your-password
```

## API Endpoints

### Contact Form
```bash
POST https://us-central1-migracle-gcp-2.cloudfunctions.net/contactHandler
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Optional message"  # message is optional
}
```

### Email Subscription
```bash
POST https://us-central1-migracle-gcp-2.cloudfunctions.net/subscribeHandler
Content-Type: application/json

{
  "email": "john@example.com"
}
```

Both endpoints:
- Store data in `leads` collection with `source` field (`contact_form` or `subscription_form`)
- Send email notification to mudit@migracle.com

## Local Development

```bash
cd frontend
npm install
npm run build      # Build CSS and JS
python3 -m http.server 3000   # Serve locally
```

## DNS Setup

See [`spec/DNS_SETUP.md`](./spec/DNS_SETUP.md) for domain configuration.