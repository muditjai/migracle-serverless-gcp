# Migracle - Cloud Cost Savings, Outcome-Based

Website for Migracle, an AI-native professional services company that helps companies **extend their cloud runway**. This document is the single source of truth for the project - it covers what Migracle does, how the site is built, and the rules every agent and contributor must follow.

**Live site**: https://migracle.com

---

## What Migracle Does

Migracle helps you **reduce your cloud bill** by extending your cloud runway through one (or a combination) of three approaches:

1. **Optimize your existing cloud stack and AI usage**
   We implement optimization across the whole stack - covering application logic, architecture, data pipelines, AI usage, and infrastructure (containers, storage, data warehouses, token spend, and the rest of your bill). We validate every change to confirm complete functional and SLA parity versus your pre-change state, while ensuring the cost is lower.

2. **Migrate to another cloud to use startup credits (or get a better rate)**
   If you have access to startup cloud credits (typical range **$100k-$350k**), we migrate your stack to that provider so you can deploy against fresh credits. If startup credits aren't applicable but you've found a better rate at another cloud provider (e.g. AWS → GCP), we run the migration end-to-end anyway.

3. **Both**
   Many customers combine 1 and 2 - optimize the current stack first, then move it to the cheaper provider - to compound the savings.

## Where We Fit

Migracle sits in two categories of cloud spend that already have plenty of vendors - and replaces what those vendors would have done together, but as one outcome-based engagement.

### Optimization vs existing FinOps & infra tools

The market for cloud cost tools today splits into two distinct types. **Migracle does the work** in a way that neither type can:

| Existing category | What they do | Examples |
|---|---|---|
| **Type 1 - FinOps / observability platforms** (org-wide cost observation, tagging, alerting, recommendations) | Tell you where the waste is. Stop at the dashboard / recommendation. Your team still owns the fixes. | Flexera, CloudZero, Vantage |
| **Type 2 - Autonomous infra optimizers** (autonomous optimization of a specific infrastructure slice) | Act on a single slice - most often Kubernetes - and leave the rest of the bill and stack untouched. | Cast.ai, ScaleOps, Zesty |

**Migracle covers the gap between those two.** We don't stop at the dashboard and we don't stop at Kubernetes. We implement optimization across application logic, architecture, data pipelines, AI usage, and infrastructure - the **entire stack, end-to-end** - validate functional and SLA parity before and after, and deliver a lower total cost. You don't get a list of action items; you get the changes shipped.

### Migration vs in-house and cloud SIs

For migration, the typical options today are either doing it in-house or hiring a cloud partner SI:

| Existing option | What they look like | Where Migracle differs |
|---|---|---|
| **In-house** (your own eng team plans and runs the migration) | 2-3 quarters of dedicated eng time; salary + opportunity cost; you manage the project. | We take it off your plate end-to-end. |
| **Cloud partner SIs** (large consultancies that migrate you) | Time-and-materials or multi-year retainer. Heavy eng involvement on your side. You pay regardless of outcome. | Examples: DoIT, Accenture, SADA, Kyndryl. Migracle is **outcome-based, AI-native, milestone 1-time payment** - and we aim for **4-5 meetings** with your team, not 2-3 quarters of staff-augmentation. |

## How We Deliver

We are an **outcome-based, AI-native service**: - **Milestone-based, one-time payment.** No long-term contract, no recurring retainer. - **Target ROI:** 5-10× in year 1. - **Minimal eng team involvement.** We aim for **4-5 meetings** with your team across the engagement; everything else is run by our agents. - **Parity guaranteed.** After every optimization or migration, the final product functionality and SLAs are verified at complete parity to your pre-change state. This is built into our delivery process via extensive testing at each layer of the cloud stack.

---

## Repo Layout

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
├── gcp-functions/             # Node.js 22 Cloud Functions
│   ├── contact-handler/       # POST /contactHandler
│   └── subscribe-handler/     # POST /subscribeHandler
├── deploy-gcp.sh              # Deploys to Cloud Run (test) and (prod)
├── README.md                  # Symlink → spec/README.md (this file)
├── AGENTS.md                  # Symlink → spec/README.md (this file)
└── spec/                      # ALL project documentation lives here
    ├── README.md              #   ← You are here (GitHub renders this)
    ├── CODING_STANDARDS.md    # Style, conventions, and deployment workflow
    ├── ARCHITECTURE.md        # System architecture details
    ├── COST_ESTIMATION.md     # GCP cost breakdown
    └── DNS_SETUP.md           # Namecheap DNS configuration
```

## Tech Stack - **Frontend**: React 19, Tailwind CSS 3, Webpack (static site) - **Backend**: Node.js 22 Cloud Functions - **Database**: Firestore (single `leads` collection) - **Email**: Zoho SMTP via Nodemailer - **Deployment**: GCP Cloud Run (test container first, manual promotion to prod)

## Where to Find Things

Before making changes, read the relevant doc in this folder:

| Doc | When to read |
|-----|--------------|
| [`CODING_STANDARDS.md`](./CODING_STANDARDS.md) | Before writing or reviewing any code; includes Git + deployment workflow |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | When changing infrastructure, functions, Cloud Run services, or data models |
| [`COST_ESTIMATION.md`](./COST_ESTIMATION.md) | When proposing changes that affect GCP spend |
| [`DNS_SETUP.md`](./DNS_SETUP.md) | When modifying domain or load balancer config |

---

## For Agents (and Contributors)

The rest of this document is the operating handbook. Humans can skim; agents must follow.

### Core Rules

1. **Read before writing.** Open the doc that matches the area you're touching. The `spec/` folder is the single source of truth.
2. **Match existing conventions.** Follow [`CODING_STANDARDS.md`](./CODING_STANDARDS.md). When in doubt, mirror the surrounding code.
3. **Don't change infrastructure contracts casually.** API endpoint URLs, request/response shapes, and the `leads` Firestore schema are referenced from the live site. Update [`README.md`](./README.md) (this file) and [`ARCHITECTURE.md`](./ARCHITECTURE.md) in the same change.
4. **Secrets stay out of git.** Never commit `.env*` files. Document any new env vars in the relevant function's README or in [`ARCHITECTURE.md`](./ARCHITECTURE.md).
5. **Prefer small, surgical changes.** This is a production marketing site with live forms. Avoid sweeping refactors unless asked.
6. **No new dependencies without justification.** The stack is intentionally lean (React + Tailwind + Webpack on the frontend, bare Node 22 in the functions).
7. **Commit + push to `main` after every change.** Don't batch unrelated edits into one mega-commit, and don't leave changes sitting in the working tree.
8. **Always go via test → prod.** All code changes must first be deployed to the **test container on GCP Cloud Run**, eyeballed by the owner, and only then promoted to **prod**. Promotion to prod is **manual** and is performed by the owner, never automated by an agent.

### Design Rules

1. **Keep the design roughly the same.** Reuse the existing layout, sections, components, and overall visual structure. Color schemes and image styles should also be kept roughly the same.
2. **Ask before making substantial design changes.** If a change is more than a copy tweak, color tweak, or minor styling fix, surface it and get explicit approval before implementing. Substantial changes include: new sections, new layouts, new component types, large visual overhauls, changes to the navigation structure, new iconography, or replacing existing imagery.

### Common Tasks

#### Add a new React component - Place under `frontend/src/components/` - Match the style of existing components (functional, default-export, Tailwind utility classes) - Don't introduce a new UI library

#### Add a new Cloud Function - Create `gcp-functions/<name>-handler/` with `index.js` and `package.json` - Update [`ARCHITECTURE.md`](./ARCHITECTURE.md) and the API Endpoints table further down in this file - Add the deployment command to `deploy-gcp.sh` if it should ship with the standard deploy

#### Change styling - Edit `frontend/src/tailwind.css` and/or component-level classes - Run `npm run build` in `frontend/` before declaring done - Keep color schemes and image styles roughly the same; ask first if the change is substantial

#### Update copy / messaging - Reflect Migracle's current positioning (cloud cost savings / runway extension; outcome-based, AI-native service; milestone-based one-time payment; 5-10× ROI; 4-5 meetings; parity guarantee) - The canonical wording lives at the top of this file - Update both the visible copy (components / `index.html` meta tags) **and** the relevant spec doc in the same change

#### Investigate a deploy issue - Check `deploy-gcp.sh` and the relevant doc in [`ARCHITECTURE.md`](./ARCHITECTURE.md) - For DNS issues, see [`DNS_SETUP.md`](./DNS_SETUP.md)

### Deployment Workflow (mandatory)

Every change goes through a **test → prod** flow on GCP Cloud Run. Agents never deploy directly to prod.

#### Step 1 - Make the change
Edit files. Run local checks (`npm run build` for the frontend, dry-runs where applicable) before committing.

#### Step 2 - Commit
```bash
git add -A
git commit -m "Imperative-mood summary of the change"
```

Keep commits small and focused. One logical change per commit.

#### Step 3 - Push to `main`
```bash
git push origin main
```

#### Step 4 - Deploy to the test container on Cloud Run
See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the exact service name and gcloud command. The convention: - Frontend → **test** Cloud Run service (or test Cloud Storage bucket `gs://migracle-gcp-2-website-test/` fronted by the same setup) - Cloud Functions → **test**-prefixed function name

Example (frontend test container):
```bash
gcloud run deploy migracle-site-test \
  --source ./frontend \
  --region us-central1 \
  --allow-unauthenticated
```

*Note on static assets deployment*: When uploading static assets/images to the GCS website buckets (test or prod), always set the Cache-Control header to `no-cache, max-age=0` to ensure that browsers do not serve cached, stale versions of newly generated images:
```bash
gsutil setmeta -h "Cache-Control:no-cache, max-age=0" gs://migracle-gcp-2-website-test/assets/images/*.jpg
```

#### Step 5 - Open the test URL and verify
Visit the test URL the deploy script prints. Eyeball the change. If something's off, fix it locally and repeat steps 2-5.

#### Step 6 - Stop. Ask the owner to promote to prod.
Agents **must not** deploy to prod themselves. Tell the owner that the test deployment is ready and wait for them to promote. The owner may re-deploy the same image / re-tag the revision onto the **prod** Cloud Run service.

> **Agents: if you're asked to "deploy", you deploy to test and hand off. Promotion to prod is always manual.**

### Things to Avoid - Editing generated files (`frontend/dist/*`) - Adding new top-level config files unless absolutely necessary - Introducing TypeScript (this repo is JS-only by convention) - Hardcoding environment-specific values (regions, project IDs, domains) anywhere outside of `deploy-gcp.sh` and [`DNS_SETUP.md`](./DNS_SETUP.md) - Substantial design changes without explicit approval from the owner - Deploying directly to prod (test → owner review → prod is the only path) - Leaving uncommitted changes in the working tree at the end of a task - Splitting this doc - `README.md` is the single source for both humans and agents

---

## Environment Variables

Cloud Functions require: - `EMAIL_USER`: Zoho email address - `EMAIL_PASS`: Zoho app password

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

Both endpoints: - Store data in `leads` collection with `source` field (`contact_form` or `subscription_form`) - Send email notification to mudit@migracle.com

## Local Development

```bash
cd frontend
npm install
npm run build      # Build CSS and JS
python3 -m http.server 3000   # Serve locally
```

## DNS Setup

See [`spec/DNS_SETUP.md`](./spec/DNS_SETUP.md) for domain configuration.