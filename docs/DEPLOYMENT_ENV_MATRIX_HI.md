# UPS INFINITY — Deployment & Environment File Matrix

## Files and purpose

| File | Purpose | Public repository? |
|---|---|---|
| `.env.example` | Root-level pointer/example | Yes; contains placeholders only |
| `backend/.env.example` | Backend environment template | Yes; placeholders only |
| `backend/.env` | Local backend secrets | No; ignored by `.gitignore` |
| `frontend/config.example.js` | Public frontend configuration template | Yes |
| `frontend/config.js` | Public Supabase URL/public anon key/backend URL | Yes only when values are public-safe; never put service-role or provider secrets here |
| `render.yaml` | Render backend deployment blueprint | Yes; secret values use `sync: false` or generated secret |
| `.github/workflows/main.yml` | Source QA workflow | Yes |
| `.github/workflows/static.yml` | GitHub Pages frontend deployment | Yes |
| `.github/workflows/auto-extract-upload.yml` | ZIP auto-extraction workflow | Yes |

## Required local setup

1. Install Node.js 20 or newer.
2. Run `npm test` and `npm run check` from repository root.
3. For backend local run: `cd backend`, copy `.env.example` to `.env`, set a unique `JWT_SECRET`, run `npm install`, then `npm start`.
4. The API health endpoint is `/api/health`.
5. The JSON file store is single-instance storage. For real multi-user production, migrate to a managed database and validate row-level security, backups, and account recovery before launch.

## Deployment boundary

- GitHub Pages hosts only `frontend/`; it does not run Express.
- Render (or another Node host) runs `backend/` separately.
- `ALLOWED_ORIGINS` must contain the exact frontend origin (scheme + host, no path).
- `DATA_DIR` must point to persistent storage on the backend host. The included Render blueprint declares a disk.
- `JWT_SECRET` must be generated uniquely by the host; never commit it.
- Gemini and Brave keys are backend-only secrets.
- Supabase publishable/anon key is intended for browser use, but security depends on correctly configured RLS policies. Never use service-role keys in frontend code.
- Razorpay variables are placeholders for future integration. Checkout/webhooks are not implemented and must not be treated as payment-ready.
- `FFMPEG_PATH` is only a configuration placeholder; the current package does not implement the full MP4 render worker.

## Reproducibility note

The backend package declares semver dependency ranges. A package lockfile could not be regenerated in this offline build environment because npm registry metadata was unavailable. On the first connected build machine, run `cd backend && npm install` and commit the generated `backend/package-lock.json`; then change deployment build command to `npm ci` for reproducible installs.
