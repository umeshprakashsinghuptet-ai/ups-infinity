# UPS CREATOR STUDIO V11 INFINITY — Unified Build

Developed by Umesh Prakash Singh.

## Repository structure
- `public/index.html`, `public/styles.css`, `public/app.js`: frontend.
- `server/index.js`: Express + FFmpeg render API.
- `package.json`: Render install/start commands.
- `legacy-reference/`: retained original reference HTML; do not delete.

## Render deployment
- Root Directory: blank (repository root)
- Build Command: `npm install`
- Start Command: `npm start`
- Node: 20+

## What works locally
- Responsive unified dashboard and guided BACK/SAVE/NEXT dock.
- Existing V10.5 workflow, timeline planner, multi-track local preview and FFmpeg render route retained.
- Brand profile selector and local profile settings.
- GK Study FAQ question bank: create/edit/delete, local search, CSV/JSON import/export, practice sheet export.
- Keyframe sequence planner: prompt sequence and downloadable PNG/SVG local preview cards; ZIP if JSZip is available.
- Storyboard and prompt planning retained.

## Important capability boundaries
- Keyframe PNG/SVG are local designed preview cards, not AI-generated photorealistic images. True image generation needs a connected image provider/API.
- GK practice drafts are not official exam questions. Official NTA content requires public/authorized source files, parsing, provenance and answer-key verification. No login-only paper/response sheet is bypassed.
- MP4 rendering requires FFmpeg available on the Render host. The included ffmpeg-static dependency may not work on every host/architecture; verify `/api/health` and run a test render.
- The renderer expects source media filenames referenced by timeline clips to be uploaded in the render media selection.
- Cloud authentication, cloud asset storage, subscriptions, voice synthesis, lip-sync, AI video generation and trend APIs are not represented as completed.

## QA
Run `npm run check`. Then deploy and test `/`, `/api/health`, `/api/capabilities`, multi-track preview and a short MP4 test with sample media. Android Chrome and desktop manual testing is still required on the live deployment.


## नया Visual & Reference Lab
Dashboard में Visual & Reference Lab खोलें। सामान्य भाषा में brief, category, topic, ratio, duration और visual style चुनकर Build Visual Plan दबाएँ। हर frame का planning card और prompt मिलेगा। Green Copy बटन से कॉपी करें।
Reference URL के साथ उपलब्ध transcript paste करें या audio/video upload करके preview करें। यह release URL से अपने-आप video download या speech transcription का दावा नहीं करता।
