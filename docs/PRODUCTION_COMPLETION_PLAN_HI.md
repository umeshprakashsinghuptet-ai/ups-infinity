# UPS INFINITY — Production Completion & Honest Release Gate

## Included in this build
- Existing frontend/dashboard and Universal Content Library retained.
- Web Series planner and 10-second sequential part data model.
- Backend JSON persistence adapter for local single-instance use.
- Email/password registration and login using Node scrypt; signed sessions require JWT_SECRET.
- Authenticated user-scoped projects and series APIs.
- 6–12 digit app passcode enrollment/verification endpoint (requires authenticated session).
- Admin overview endpoint (admin role must be provisioned securely by operator).
- Live Search and Gemini routes retained; provider keys remain server-side.
- Billing capability is fail-closed: reports disabled without keys and explicitly refuses to create orders until a real verified checkout adapter is implemented.

## Not certified / still requires deployment-specific implementation
- Production-grade database: JSON storage is single-instance only. For multi-user commercial deployment, migrate to PostgreSQL/Supabase with RLS, migrations, backups and restore tests.
- Google OAuth: not wired; configure an OAuth provider and callback flow.
- Email verification, password reset, MFA, brute-force lockout and account recovery.
- Razorpay checkout, signed webhook verification, refunds, invoices, tax and subscription lifecycle. No payment can be taken in this build.
- Device-native biometric/OS passcode: web passcode API is not equivalent to Android app-level secure lock.
- Actual image/video generation, TTS, lip-sync, FFmpeg rendering worker, queue, storage and export pipeline.
- APK signing, Play Store compliance and production mobile device testing.
- Live E2E tests with real provider keys and deployed server.

## Required server setup
1. Install Node.js 20+.
2. Copy `.env.example` to backend `.env` and set a cryptographically random JWT_SECRET (32+ random bytes).
3. Set ALLOWED_ORIGINS to the exact deployed frontend origin.
4. Set DATA_DIR to a persistent private writable directory, outside public web root.
5. In backend folder run `npm install`, then `npm start`.
6. Keep backend data directory private; enable HTTPS, server backups and monitoring.
7. Add provider keys only as server environment variables.

## Release policy
Passing automated tests does not certify all features. Do not market as fully operational SaaS or accept payment until all not-certified items above pass deployment E2E and security review.
