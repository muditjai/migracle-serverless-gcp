# AGENTS.md

This file contains instructions for AI coding agents working on the Migracle project.

> **Note for agents**: The full agent brief lives in [`spec/AGENTS.md`](./AGENTS.md). The root `AGENTS.md` is a thin pointer so that any agent tooling scanning the repo root will find and load this file.

---

## Project Summary

Migracle is an **AI-native professional services** company that helps companies **extend their cloud runway** and **reduce their cloud bill**. Customers can pick whichever fits — or combine them:

1. **Optimize the existing cloud stack and AI usage** end-to-end — containers, token spend, storage, data warehouses, application logic, and architecture. We **implement the fixes**, not just point at the waste.
2. **Migrate to another cloud** to use startup cloud credits (typical range **$100k–$350k**), or to take advantage of a better rate at another provider (e.g. AWS → GCP). Full end-to-end migration.
3. **Both** — optimize first, then migrate, to compound the savings.

### Where we fit vs the existing market

**Optimization.** Today there are two distinct FinOps / infra-tool categories, and Migracle sits in the gap between them:

- **Type 1 — FinOps / observability platforms** (org-wide cost observation, tagging, alerting, recommendations). Examples: Flexera, CloudZero, Vantage. They tell you *where* the waste is; your team still owns the fixes.
- **Type 2 — Autonomous infra optimizers** (autonomous optimization of a specific infrastructure slice, most often Kubernetes). Examples: Cast.ai, ScaleOps, Zesty. They act on one slice of the stack and leave the rest of the bill untouched.

Migracle does the work across the entire stack end-to-end and ships the changes — not a dashboard and not a single-infra slice.

**Migration.** The typical options today are doing it in-house or hiring a cloud partner SI. Examples of those SIs: DoIT, Accenture, SADA, Kyndryl. They typically work on time-and-materials or multi-year retainer with heavy eng involvement on your side and payment regardless of outcome. Migracle is **outcome-based, AI-native**, milestone 1-time payment, and targets **4–5 meetings** with your team — not 2–3 quarters of staff augmentation.

### Delivery model

We deliver as an **outcome-based, AI-native service**:

- Milestone-based, **one-time payment** — no long-term contract, no recurring retainer.
- **Target ROI: 5–10× in year 1**.
- **Minimal eng team involvement**: aim for **4–5 meetings** with the customer's team across the engagement; everything else is run by our agents.
- **Parity guaranteed**: final product functionality and SLAs delivered at complete parity to current state after optimization/migration. Made possible by extensive testing and verification at each layer of the cloud stack.

## Where to Find Things

Before making changes, read the relevant doc in this folder:

| Doc | When to read |
|-----|--------------|
| [`README.md`](./README.md) | Project overview, deployment workflow, API endpoints |
| [`CODING_STANDARDS.md`](./CODING_STANDARDS.md) | Before writing or reviewing any code; includes Git + deployment workflow |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | When changing infrastructure, functions, Cloud Run services, or data models |
| [`COST_ESTIMATION.md`](./COST_ESTIMATION.md) | When proposing changes that affect GCP spend |
| [`DNS_SETUP.md`](./DNS_SETUP.md) | When modifying domain or load balancer config |

## Repo Layout (high level)

```
migracle-serverless/
├── frontend/                  # React 19 + Tailwind static site (Webpack build)
│   ├── src/components/        # React components (Hero, Header, Footer, etc.)
│   ├── src/index.js           # React entry point
│   └── src/tailwind.css       # Tailwind input
├── gcp-functions/             # Node.js 22 Cloud Functions
│   ├── contact-handler/       # POST /contactHandler
│   └── subscribe-handler/     # POST /subscribeHandler
├── deploy-gcp.sh              # Deploys to Cloud Run (test) and (prod)
├── README.md                  # Symlink → spec/README.md
├── AGENTS.md                  # Symlink → spec/AGENTS.md (this file)
└── spec/                      # ALL project documentation lives here
```

## Core Rules for Agents

1. **Read before writing.** Open the doc that matches the area you're touching. The `spec/` folder is the single source of truth.
2. **Match existing conventions.** Follow [`CODING_STANDARDS.md`](./CODING_STANDARDS.md). When in doubt, mirror the surrounding code.
3. **Don't change infrastructure contracts casually.** API endpoint URLs, request/response shapes, and the `leads` Firestore schema are referenced from the live site. Update [`README.md`](./README.md) and [`ARCHITECTURE.md`](./ARCHITECTURE.md) in the same change.
4. **Secrets stay out of git.** Never commit `.env*` files. Document any new env vars in the relevant function's README or in [`ARCHITECTURE.md`](./ARCHITECTURE.md).
5. **Prefer small, surgical changes.** This is a production marketing site with live forms. Avoid sweeping refactors unless asked.
6. **No new dependencies without justification.** The stack is intentionally lean (React + Tailwind + Webpack on the frontend, bare Node 22 in the functions).
7. **Commit + push to `main` after every change.** Don't batch unrelated edits into one mega-commit, and don't leave changes sitting in the working tree.
8. **Always go via test → prod.** All code changes must first be deployed to the **test container on GCP Cloud Run**, eyeballed by the owner, and only then promoted to **prod**. Promotion to prod is **manual** and is performed by the owner, never automated by an agent.

## Design Rules

1. **Keep the design roughly the same.** Reuse the existing layout, sections, components, and overall visual structure. Color schemes and image styles should also be kept roughly the same.
2. **Ask before making substantial design changes.** If a change is more than a copy tweak, color tweak, or minor styling fix, surface it and get explicit approval before implementing. Substantial changes include: new sections, new layouts, new component types, large visual overhauls, changes to the navigation structure, new iconography, or replacing existing imagery.

## Common Tasks

### Add a new React component
- Place under `frontend/src/components/`
- Match the style of existing components (functional, default-export, Tailwind utility classes)
- Don't introduce a new UI library

### Add a new Cloud Function
- Create `gcp-functions/<name>-handler/` with `index.js` and `package.json`
- Update [`ARCHITECTURE.md`](./ARCHITECTURE.md) and the API endpoints table in [`README.md`](./README.md)
- Add the deployment command to `deploy-gcp.sh` if it should ship with the standard deploy

### Change styling
- Edit `frontend/src/tailwind.css` and/or component-level classes
- Run `npm run build` in `frontend/` before declaring done
- Keep color schemes and image styles roughly the same; ask first if the change is substantial

### Update copy / messaging
- Reflect Migracle's current positioning (cloud cost savings / runway extension; outcome-based, AI-native service; milestone-based one-time payment; 5–10× ROI; 4–5 meetings; parity guarantee)
- See [`README.md`](./README.md) for the canonical wording
- Update both the visible copy (components / `index.html` meta tags) **and** the relevant spec doc in the same change

### Investigate a deploy issue
- Check `deploy-gcp.sh` and the relevant doc in [`ARCHITECTURE.md`](./ARCHITECTURE.md)
- For DNS issues, see [`DNS_SETUP.md`](./DNS_SETUP.md)

## Deployment Workflow (mandatory)

The full step-by-step lives in [`CODING_STANDARDS.md`](./CODING_STANDARDS.md#git--deployment-workflow), but the gist is:

1. Make your change.
2. `git commit` with a clear imperative-mood message.
3. `git push` to `main`.
4. Deploy to the **test** Cloud Run service via `deploy-gcp.sh` (or the relevant gcloud command from `ARCHITECTURE.md`).
5. Open the test URL and verify the change with the owner.
6. Owner manually promotes to the **prod** Cloud Run service.

Agents **never** deploy directly to prod. If you're asked to "deploy", you deploy to **test** and then ask the owner to promote.

## Things to Avoid

- Editing generated files (`frontend/dist/*`)
- Adding new top-level config files unless absolutely necessary
- Introducing TypeScript (this repo is JS-only by convention)
- Hardcoding environment-specific values (regions, project IDs, domains) anywhere outside of `deploy-gcp.sh` and [`DNS_SETUP.md`](./DNS_SETUP.md)
- Substantial design changes without explicit approval from the owner
- Deploying directly to prod (test → owner review → prod is the only path)
- Leaving uncommitted changes in the working tree at the end of a task