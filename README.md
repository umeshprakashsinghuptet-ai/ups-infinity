# UPS INFINITY — AI Creator & Production Hub

See `docs/PRODUCTION_COMPLETION_PLAN_HI.md` for deployment steps, included modules and honest release limitations.

## Quick checks
- `npm test`
- `npm run check`

## Backend
- `cd backend && npm install`
- Configure private environment variables using `.env.example`
- `npm start`

The backend's JSON persistence adapter is for a single-instance evaluation/development deployment, not a horizontally scaled paid SaaS database.
