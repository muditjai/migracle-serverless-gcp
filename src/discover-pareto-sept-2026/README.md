# discover-pareto-sept-2026

Feedback-only survey app for discoverpareto.com.

## Structure

- `frontend/` - React + Vite survey UI
- `backend/` - Express + TypeScript API with MongoDB persistence

## Survey

The form asks:

1. Would you join a community with this focus? Select up to 3.
2. Are you a member of any such community already?
3. Optional email

## Development

```bash
cd src/discover-pareto-sept-2026
npm install
npm run dev:backend
npm run dev:frontend
```

### Environment

Backend:

- `PORT`
- `MONGODB_URI`
- `MONGODB_DB_NAME`

Frontend:

- `VITE_API_BASE_URL`
- `VITE_POSTHOG_KEY`
- `VITE_POSTHOG_HOST`

