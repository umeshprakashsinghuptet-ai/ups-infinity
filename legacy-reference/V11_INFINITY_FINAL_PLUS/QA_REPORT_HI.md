# UPS CREATOR STUDIO — V11 Infinity Final Plus QA

## Included
- Unified V11 dashboard and existing profile, GK/MCQ, keyframe, storyboard, continuity, editor planner and release QA modules retained.
- Visual & Reference Lab: conversational brief fields, ratio/duration/style controls, scene-by-scene storyboard planning cards, per-frame prompt copy, compact prompt capped at 900 characters.
- Reference workflow accepts a URL and/or uploaded audio/video preview plus pasted transcript; transcript is segmented into dialogue and suggested replacement-frame notes.
- Green copy controls for master prompt, compact prompt, frame prompt and Hindi script.
- Architecture configuration file retained: 12 core engines, 100 modules and 25 locks.

## Local checks to run
- `npm install`
- `npm run check`
- `npm test`

## Honest limitations (not certified as working)
- URL input is not a downloader/transcriber. Platform URL access and captions depend on permissions and availability.
- Uploaded media preview works in browser; automatic speech-to-text and full video frame extraction are not integrated.
- Storyboard visual cards are planning previews, not generated image assets.
- Actual AI image/video generation, TTS, lip-sync and cloud auth/storage need provider integrations.
- FFmpeg availability and MP4 rendering must be checked on the deployed host.
- Android Chrome and desktop end-to-end manual tests remain required.
