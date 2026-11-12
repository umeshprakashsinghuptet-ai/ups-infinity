# Security policy — UPS INFINITY

## Secrets
- Never commit `.env`, provider API keys, Supabase service-role keys, Razorpay secrets, signing keys, or database credentials.
- Keep Gemini/Brave/payment secrets on the backend host only.
- The browser may contain only a Supabase URL and public anon/publishable key; enforce RLS before exposing user data.
- Rotate any credential that was accidentally committed. Deleting a file in a later commit does not remove it from Git history.

## Current security boundary
- The included API uses a local JSON file store and a custom JWT/password implementation for a development baseline. It is single-instance storage, not a substitute for a managed production identity/database platform.
- Do not use this starter as a production multi-tenant SaaS until managed DB migrations, RLS, account recovery, email verification, admin authorization, backups, restore drills, and independent security review pass.
- Billing endpoints deliberately do not create orders. Do not accept payments until provider checkout, signature verification, webhook idempotency, refunds, and entitlement enforcement are implemented and tested.

## Reporting
Do not publish secrets or personal data in an issue. Report a minimal reproducible security concern to the repository maintainer privately.
