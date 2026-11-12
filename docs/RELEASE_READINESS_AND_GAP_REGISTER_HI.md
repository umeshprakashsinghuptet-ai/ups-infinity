# UPS INFINITY — Release Readiness & Gap Register

## इस ZIP में मौजूद आधार
- Frontend dashboard/PWA, styles, application scripts और public config template.
- Express backend starter, health/capability endpoints, RSS discovery, optional Gemini text endpoint, auth/project/series starter routes.
- Render blueprint, GitHub Pages deployment workflow, source-QA workflow और ZIP auto-extract workflow.
- Architecture registry, feature status, requirements, production sequence, UI/UX और QA documentation.
- Automated source tests और JavaScript syntax checker.

## अभी प्रमाणित नहीं / Live चरण में आवश्यक
1. Backend npm dependencies install करके server boot और `/api/health` smoke test.
2. `backend/package-lock.json` generation on a connected Node 20 environment; do not invent lock integrity metadata.
3. Move auth/projects/series from local JSON to managed database; implement migrations, RLS, account recovery, email verification, admin authorization and isolation tests.
4. Production-grade session lifecycle, token revocation/refresh, audit logging, rate-limit review, backup/restore and monitoring.
5. Gemini/Brave credentials, quota, timeout, abuse controls and output QA.
6. Real image/video generation provider adapter; Sora availability/API access must be confirmed before claiming integration.
7. TTS, lip-sync, media upload/storage, FFmpeg worker, render queue, MP4 validation and cleanup.
8. Social platform OAuth/app review/publishing/analytics.
9. Razorpay order creation, signature verification, webhook idempotency, refund flow and server-side entitlement enforcement.
10. Android packaging/signing, PWA installability and real Android Chrome/Desktop E2E.

## GitHub upload sequence
- Back up the existing repository.
- Bootstrap `.github/workflows/auto-extract-upload.yml` once using GitHub's Create new file. The same file is included in this ZIP, but a workflow cannot run for the ZIP upload until GitHub has the workflow on the default branch.
- Ensure default branch is `main` and Actions workflow permissions allow read/write contents.
- Upload `UPS_INFINITY_PROJECT.zip` to repository root and commit. Workflow safely validates the expected top-level directory, extracts the project contents to repo root and removes the uploaded ZIP.
- Pages workflow publishes `frontend/`; Render runs `backend/` separately.

## Acceptance rule
A source test passing is not evidence of a live provider integration. Mark a feature LIVE only after a successful deployed end-to-end test with valid credentials and recorded output. Keep failures and blocked checks in the release report; never convert NOT TESTED into PASS.
