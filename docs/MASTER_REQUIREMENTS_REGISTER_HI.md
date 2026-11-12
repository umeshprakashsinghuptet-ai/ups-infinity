# UPS INFINITY — Master Requirements Register

## उद्देश्य
एक unified AI creative, education और business production workspace बनाना। Desktop-first responsive web app, Android Chrome support और बाद में उसी frontend से Android APK। गुणवत्ता लक्ष्य 90%+ readiness और 100/100 के निकट; कोई भी external integration live test के बिना PASS नहीं मानी जाएगी।

## Master architecture (fixed counts)
- Exactly 12 Core Engines: Content Intelligence; Research & Accuracy; Story & Script; Identity & Continuity; Image & Poster; Video & Cinematic; Voice & Audio; Frame & Storyboard; Editing & Timeline; Quality, Export & Delivery; Live Trend Intelligence; A/B Experiment & Performance Learning.
- Exactly 100 Core Modules: canonical names in `server/pipeline-config.js`.
- Exactly 50 Master Locks: canonical names in `server/pipeline-config.js`.
- Engines/modules/locks are architecture definitions, not proof every provider-dependent capability is implemented.

## Visual Quality Master Engine
- Four independent masters: IMAGE = ultra-photorealistic RAW DSLR; VIDEO = ultra-realistic cinematic photorealism; 3D = ultra-realistic 3D/CGI; HYBRID = photorealistic + cinematic 3D + VFX only when appropriate.
- AUTO QUALITY ROUTING selects by category, subject, scene, output format and purpose. Never force HYBRID/3D on every task.
- Lighting: natural exposure, realistic shadows, balanced highlights; avoid artificial glow, excessive brightness and oversaturation.
- Detail: natural textures, realistic materials, fine details, depth and professional composition.
- Motion: natural movement, realistic physics, smooth camera motion, frame consistency; guard against flicker/distortion.
- IDENTITY PRESERVATION LOCK: retain actual identity and natural facial features; no redesign, de-aging or artificial beautification.
- TEMPORAL CONSISTENCY LOCK: maintain characters, wardrobe, props, environment, lighting and frame continuity.
- Target: realistic + cinematic + natural + consistent + premium. Actual image/video quality is provider-dependent and requires visual review.

## Creative workflow
- AUTO / HYBRID / MANUAL modes and Director-style guided workflow.
- Ask one question at a time only when required; reuse known answers; infer safe defaults and explain assumptions.
- Flow: format → category → activity/subject → topic → purpose/audience → dialogue/narration → only relevant production settings.
- AUTO may suggest fresh topics only when a live/search source is connected. Never fabricate trending status, search volume, facts or sources.
- Manual topic overrides AUTO suggestions. Clicking a search result should pass the selected topic into the workflow.
- Generate a complete brief: concept, verified research where applicable, hook, coherent script/dialogue, CTA, storyboard, frame/scene prompts, voice/audio notes, captions, platform formatting and QA checklist.
- Do not force a video storyboard for static poster requests. Match workflow to output type.

## Category coverage
GK/MCQ; current affairs/news; education/teaching; motivation; dialogue/shayari; storytelling; facts/science/history; travel/vlog; podcast/interview; business/interior; personal branding; poster/image; video/reel; and extensible custom categories.
- GK default: four MCQs, A–D options, answer separate; do not reveal answer in a quiz creative unless explicitly requested.
- Current affairs: date-stamped reliable sources and fact verification; mark unverified claims.
- User reference photos: identity reference only; do not copy reference clothing/pose/background unless explicitly requested. New outfit may be context-specific but consistent within the same video.
- Dialogue must fit requested duration and scene count; never truncate the conclusion to claim exact duration.
- 900-character compact prompt is required when a target provider has that limit; keep a full master prompt separately.

## User, project and account protection
- Preserve existing repository, users, database and assets. Backup before replacing files or running SQL.
- Supabase Auth + RLS: each user can access only their own records; role escalation blocked server-side; never trust client-provided admin role.
- Supabase public anon key may be used client-side only with strict RLS; service-role key and all AI provider secrets stay server-side.
- Do not run destructive SQL automatically. Review migrations and take backup first.
- Keep project history and avoid duplicate topics/outputs where history is available.

## Packages / subscriptions (requirements, not yet certified live)
- Package choices: Daily, Single Study, Full Study.
- User selects package; display configured price and duration; admin verifies payment; approval activates entitlement; expiry disables it.
- Keep separate purchase/entitlement records and enforce package-specific permissions; no cross-package access.
- Payment gateway/UPI confirmation must not be trusted from a client-side success message alone. Admin/server verifies transaction reference before activation.

## Deployment and platform
- GitHub Pages serves static frontend only. Node/Express backend deploys separately.
- Node.js >=20; configure CORS allowlist, HTTPS, rate limits, upload validation and server-side secrets.
- Android APK is a later Capacitor + Android Studio build after web app validation; no APK build/signing is claimed in this package.
- Desktop-first responsive layout must be manually tested on desktop and Android Chrome.

## Status vocabulary
- IMPLEMENTED: code exists.
- LOCAL TESTED: automated/local test passed.
- LIVE TEST REQUIRED: needs deployed backend, real account, API credentials, provider or device test.
- NOT IMPLEMENTED: capability is not present yet.
- BLOCKED: requires credentials, permissions, external provider or user decision.

## Release acceptance
1. `npm run check` and `npm test` pass.
2. No duplicate imports, broken script references, missing required assets or invalid ZIP entries.
3. Backend `/api/health` and `/api/capabilities` verified after deployment.
4. Supabase signup/login/session/recovery/RLS tested with separate user accounts.
5. Search freshness/source metadata checked against live source; unavailable source clearly reported.
6. Prompt output reviewed for category routing, duration, identity and temporal locks.
7. Real provider image/video/TTS/lip-sync/render tests run only after credentials and permissions exist.
8. Desktop and Android Chrome manual test; then APK build/signing test.
