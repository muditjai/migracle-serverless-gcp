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

## Git

- Commit messages in imperative mood ("Add contact form validation", not "Added…")
- One logical change per commit
- Don't commit `.env*`, build outputs, or `node_modules/`
- Reference the relevant doc in `spec/` when a change affects documented behavior

## Things That Are Non-Negotiable

- **No secrets in git.** Not even in examples — use placeholders like `<YOUR_EMAIL>`.
- **No new top-level files** without updating `spec/` docs to match.
- **No TypeScript.** This codebase is intentionally JS.
- **No `console.log` in production handlers.** Use `console.error` for real errors, or remove the log.