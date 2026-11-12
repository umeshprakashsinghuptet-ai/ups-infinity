# Development checks

1. Use Node.js 20 or newer (`.nvmrc`).
2. From repository root run `npm test`, `npm run check`, and `npm run preflight`.
3. For backend runtime work: `cd backend`, copy `.env.example` to `.env`, set a unique `JWT_SECRET`, run `npm install`, then `npm start`.
4. Keep secrets out of source control. Add tests for every behavior change.
5. Do not mark provider-backed features complete until an end-to-end test with a real configured provider succeeds.
