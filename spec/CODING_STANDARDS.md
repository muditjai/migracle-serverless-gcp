# Coding Standards

Style and conventions for the Migracle codebase. **All agents and contributors must follow these.**

## Languages

- **JavaScript** (ES2022) – used everywhere; no TypeScript
- **Node.js 22** for Cloud Functions
- **Bash** for scripts (`deploy-gcp.sh`)
- **HTML / CSS** (Tailwind utility-first) for the static site

## JavaScript Style

### General
- 2-space indentation, no tabs
- Single quotes for strings; backticks only for interpolation/multi-line
- Always use semicolons
- Prefer `const`; use `let` only when reassignment is required; never `var`
- Use arrow functions for callbacks and short functions; named functions for top-level exports

### Modules
- ES Modules (`import` / `export`) in the frontend (Webpack handles it)
- CommonJS (`require` / `module.exports`) in Cloud Functions (matches the GCP runtime default)
- One component per file; default-export the component, named-export helpers

### Naming
- `PascalCase` for React components and files (`Hero.js`, `ContactModal.js`)
- `camelCase` for variables, functions, and instances
- `UPPER_SNAKE_CASE` for module-level constants and environment variable names
- Boolean variables prefixed with `is`, `has`, `should` (e.g. `isLoading`, `hasError`)

### Async
- Always `async`/`await`; avoid raw `.then()` chains
- Wrap awaited calls in `try`/`catch` for user-facing paths (forms, API handlers)
- Always validate user input on the server side, even if the client validates too

### Error handling
- Cloud Functions should return structured JSON: `{ ok: false, error: '<message>' }` with an appropriate HTTP status code
- Never leak stack traces or internal error details to clients
- Log full errors server-side via `console.error` with a clear prefix (e.g. `[contact-handler]`)

## React (frontend)

### Component shape
- Functional components only; no class components
- One component per file, default-exported
- Co-locate small, component-specific subcomponents in the same file; extract to a new file only when reused

```jsx
// Hero.js
import React from 'react';

const Hero = () => {
  return (
    <section className="...">
      ...
    </section>
  );
};

export default Hero;
```

### Hooks
- Follow the Rules of Hooks (top-level only, never conditional)
- Custom hooks live in `frontend/src/hooks/` (if/when added) and are prefixed `use*`

### Styling
- Tailwind utility classes only; no inline `style={}` objects unless dynamic
- Avoid `@apply` in CSS; keep utility classes in JSX
- Reuse the same spacing/color tokens already in use; don't introduce new design tokens casually

### State
- Prefer local `useState` for component-local UI state
- Lift state up only when needed; avoid premature global state

## Cloud Functions

### File layout
```
gcp-functions/<handler-name>/
├── index.js        # exports.handler = async (req, res) => { ... }
└── package.json    # name, dependencies
```

### Handler shape
- Validate `req.method`; reject non-POST with `405`
- Parse and validate the JSON body; reject malformed input with `400`
- Set CORS headers explicitly (`Access-Control-Allow-Origin`, etc.)
- Use `cors` only if multiple origins are needed; for a single-origin public API, set the headers directly

### Firestore
- Collection: `leads`
- Document shape: `{ name?, email, source, createdAt: <server timestamp> }`
- `source` is one of: `contact_form`, `subscription_form`, (add new values explicitly when added)
- Use `FieldValue.serverTimestamp()` for `createdAt`; do not trust client clocks

### Email (Nodemailer / Zoho)
- Read creds from env: `EMAIL_USER`, `EMAIL_PASS`
- Use `process.env` directly inside the handler (cold starts are fine)
- Send notifications to `mudit@migracle.com`
- Don't include user-supplied content directly in the email body without escaping

## Bash / Scripts

- `#!/usr/bin/env bash` and `set -euo pipefail` at the top of any new script
- Quote all variables: `"$VAR"` not `$VAR`
- Print each major step with `echo` so deploy logs are readable
- Confirm destructive operations (`--quiet` flags off where reasonable)

## Design Preservation

This is a production marketing site. **Keep the design roughly the same.** Color schemes, image styles, layout, sections, and component structure should be preserved.

- **Reuse existing layouts and components.** New sections should mirror the visual style of what's already on the page.
- **Reuse existing color/typography tokens.** Don't introduce new palettes or font stacks casually.
- **Reuse existing image styling.** Crop, filter, framing, and aspect ratios of existing assets are intentional.

**Before making any substantial design change, ask the owner for explicit approval.** Substantial changes include (but are not limited to):
- Adding or removing a top-level section
- Changing the overall page layout (e.g. 1-column → 2-column, full reorganization)
- Introducing a new component type or visual pattern not already in the site
- Replacing existing imagery, iconography, or illustration style
- Adding a new navigation bar / restructuring the header
- Large visual overhauls (e.g. a redesign of the hero)

Small, surgical changes (a copy tweak, a single-class color adjustment, a minor spacing fix) can be made without asking.

## Git

- Commit messages in imperative mood ("Add contact form validation", not "Added…")
- One logical change per commit
- Don't commit `.env*`, build outputs, or `node_modules/`
- Reference the relevant doc in `spec/` when a change affects documented behavior
- **Commit + push to `main` after every change.** Don't batch unrelated edits into one mega-commit.
- Don't leave uncommitted changes sitting in the working tree at the end of a task.

## Git + Deployment Workflow (mandatory)

Every change goes through a **test → prod** flow on GCP Cloud Run. Agents never deploy directly to prod.

### Step 1 — Make the change
Edit files. Run local checks (`npm run build` for the frontend, dry-runs where applicable) before committing.

### Step 2 — Commit
```bash
git add -A
git commit -m "Imperative-mood summary of the change"
```

Keep commits small and focused. One logical change per commit.

### Step 3 — Push to `main`
```bash
git push origin main
```

### Step 4 — Deploy to the **test** container on Cloud Run
See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the exact service name and gcloud command. The convention:
- Frontend → **test** Cloud Run service (or test Cloud Storage bucket fronted by the same setup)
- Cloud Functions → **test**-prefixed function name

Example (frontend test container):
```bash
gcloud run deploy migracle-test \
  --source ./frontend \
  --region us-central1 \
  --allow-unauthenticated
```

### Step 5 — Open the test URL and verify
Visit the test URL the deploy script prints. Eyeball the change. If something's off, fix it locally and repeat steps 2–5.

### Step 6 — Stop. Ask the owner to promote to prod.
Agents **must not** deploy to prod themselves. Tell the owner that the test deployment is ready and wait for them to promote. The owner may re-deploy the same image / re-tag the revision onto the **prod** Cloud Run service.

---

**Agents: if you're asked to "deploy", you deploy to test and hand off. Promotion to prod is always manual.**

## Things That Are Non-Negotiable

- **No secrets in git.** Not even in examples — use placeholders like `<YOUR_EMAIL>`.
- **No new top-level files** without updating `spec/` docs to match.
- **No TypeScript.** This codebase is intentionally JS.
- **No `console.log` in production handlers.** Use `console.error` for real errors, or remove the log.
- **No direct prod deploys.** Always via test → owner review → prod.
- **No substantial design changes without owner approval.** Keep visual style roughly the same.
- **No uncommitted changes at the end of a task.** Always commit + push.