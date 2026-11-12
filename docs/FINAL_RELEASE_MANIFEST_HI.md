# Final Release Manifest — UPS INFINITY

**Upload filename:** `UPS_INFINITY_PROJECT.zip` (already exact; do not rename)

## Main folders
- `frontend/` — GitHub Pages static app/PWA.
- `backend/` — Express API starter for separate Render deployment.
- `config/` — architecture registry.
- `docs/` — requirements, feature status, deployment, QA and gap registers.
- `tests/` — automated source/contract tests.
- `scripts/` — syntax and release preflight checks.
- `.github/workflows/` — source QA, Pages deployment, ZIP extraction and backend runtime smoke workflows.
- `legacy-reference/` — retained V11 reference source and historical tests.
- `android/` — Android packaging guidance; not a built APK.

## Commands
From the project root:
- `npm test`
- `npm run check`
- `npm run preflight`

Backend local setup:
- `cd backend`
- Copy `.env.example` to `.env` and set a unique `JWT_SECRET`.
- `npm install`
- `npm start`
- Check `http://localhost:8787/api/health`

## GitHub first-time ZIP import
The ZIP includes `.github/workflows/auto-extract-upload.yml` and `.github/scripts/extract_upload.py`. However, GitHub must already know the workflow before it can react to the ZIP push. Therefore bootstrap that workflow once using GitHub's Create new file at `.github/workflows/auto-extract-upload.yml`, commit it, then upload this ZIP to the repository root. Workflow permissions must allow repository content writes.

## No false certification
Source QA pass means only the listed local checks passed. It does not mean external providers, production database, payments, media rendering, social publishing or device tests are complete. See `RELEASE_READINESS_AND_GAP_REGISTER_HI.md`.
