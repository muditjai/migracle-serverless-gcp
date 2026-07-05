# AGENTS.md

This file contains instructions for AI coding agents working on the Migracle project.

> **Note for agents**: The full agent brief lives in [`spec/AGENTS.md`](./AGENTS.md). The root `AGENTS.md` is a thin pointer so that any agent tooling scanning the repo root will find and load this file.

---

## Project Summary

Migracle provides professional services that help Enterprise Software Vendors (ISVs) expand to new cloud regions and cloud providers. Internally backed by AI agents, Migracle replicates infrastructure in 1-2 months instead of 2-3 quarters by:

1. **Mapping resources** – inventorying existing cloud infrastructure
2. **Modularizing Terraform** – breaking monolithic IaC into reusable modules
3. **Abstracting hardcodings** – replacing region/provider-specific values with variables
4. **Running comprehensive testing** – validating parity across environments
5. **Setting up CI/CD and monitoring** – automating deployment and observability

## Where to Find Things

Before making changes, read the relevant doc in this folder:

| Doc | When to read |
|-----|--------------|
| [`README.md`](./README.md) | Project overview, API endpoints, deployment |
| [`CODING_STANDARDS.md`](./CODING_STANDARDS.md) | Before writing or reviewing any code |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | When changing infrastructure, functions, or data models |
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
├── deploy-gcp.sh              # One-shot deploy script
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

### Investigate a deploy issue
- Check `deploy-gcp.sh` and the relevant doc in [`ARCHITECTURE.md`](./ARCHITECTURE.md)
- For DNS issues, see [`DNS_SETUP.md`](./DNS_SETUP.md)

## Things to Avoid

- Editing generated files (`frontend/dist/*`)
- Adding new top-level config files unless absolutely necessary
- Introducing TypeScript (this repo is JS-only by convention)
- Hardcoding environment-specific values (regions, project IDs, domains) anywhere outside of `deploy-gcp.sh` and [`DNS_SETUP.md`](./DNS_SETUP.md)