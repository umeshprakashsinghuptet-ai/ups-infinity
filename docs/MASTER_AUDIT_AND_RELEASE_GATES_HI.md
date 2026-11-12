# UPS INFINITY — Master Audit & Release Gates

## मर्ज नीति
- `upsstudio-main (1).zip` को clean base चुना गया क्योंकि इसमें frontend/backend/PWA/docs और legacy V11 references एक साथ थे।
- `upscreatorstudio-main` से requirements, Supabase SQL, regional topic bank और documentation संदर्भ के रूप में सुरक्षित रखें; blind overwrite न करें।
- Image Generator project से rendering/pipeline references रखें; वास्तविक FFmpeg end-to-end परीक्षण के बिना इसे live renderer न कहें।
- `app.js` update ZIP को blind replace न करें; API, event wiring और regression diff के बाद ही cherry-pick करें।
- Single HTML और Test Center को legacy QA/reference रखें; वे मुख्य production app का विकल्प नहीं हैं।

## सुधारे गए मुद्दे
1. Root `npm run check` में गलत `server/pipeline-config.js` path को `backend/pipeline-config.js` किया।
2. Backend `safeText` control-character regex को सही किया ताकि सामान्य अक्षर/अंक sanitize होकर न मिटें।
3. 25 master locks को 50 तक बढ़ाया; architecture registry में 100 commands, 20 QA groups और 10 initial profiles दर्ज किए।
4. Web Series Studio जोड़ा: series premise, genre, audience, episode count, duration, continuity rules, episode beats, cliffhanger, local save, copy और JSON export।

## अभी प्रमाणित न हुए फीचर
- Gemini/API credentials, quota और generated output quality
- Supabase signup/login/recovery/RLS isolation और cloud save
- Real image/video generation, voice/TTS/lip-sync
- FFmpeg render queue और playable MP4 export
- Social OAuth publishing/analytics
- Android APK/AAB build, signing और Play Store compliance
- Android Chrome और desktop visual/manual acceptance

## Release gates
- [ ] `npm run check` PASS
- [ ] `npm test` PASS
- [ ] Backend `/api/health` और `/api/capabilities` live verified
- [ ] Two-user Supabase RLS isolation PASS
- [ ] Provider image/video/audio generation end-to-end PASS
- [ ] MP4 opens and audio/subtitle sync verified
- [ ] Android Chrome + desktop manual QA PASS
- [ ] APK signed, installed and tested
- [ ] Privacy, terms, data retention and backup policy reviewed

**Rating policy:** इस package को 100/100 घोषित नहीं किया जा सकता जब तक सभी लागू release gates evidence के साथ PASS न हों।
