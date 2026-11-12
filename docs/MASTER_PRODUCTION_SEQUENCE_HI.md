# UPS INFINITY — Master AI Smart Production Sequence

यह canonical क्रम है। AUTO-PILOT इसे बिना अनावश्यक सवालों के चलाए; उपयोगकर्ता के दिए उत्तर दोबारा न पूछे। हर चरण का output अगले चरण को context के रूप में मिले।

## 0. Session & project context
- Existing project/history, user-selected mode, language, saved preferences और उपलब्ध assets पढ़ें।
- Duplicate topic/brief चेतावनी दें; पुराने content को चुपचाप overwrite न करें।

## 1. Intent & output detection
- Output: poster/image, video/reel, story/script, education pack, complete content pack, audio, storyboard या custom.
- Category, subject, audience, purpose, platform और language detect करें।
- यदि स्पष्ट नहीं हो तभी एक सबसे उपयोगी सवाल पूछें।

## 2. Smart Search & trend discovery
- Search query बनाएं; configured RSS/search sources से results लाएं।
- Result में title, source, published date, URL और retrieval time रखें।
- Trend score/search volume तभी दिखाएं जब provider सचमुच देता हो। RSS signal को verified trend न बताएं।
- User manually topic दे तो वही override है। Selected result topic को सीधे wizard में भेजे।

## 3. Research & accuracy
- Current affairs/facts के लिए primary/authoritative sources प्राथमिकता दें।
- Claims, dates, names, numbers और answer keys verify करें।
- Source न मिले तो claim को unverified बताएं; तथ्य न गढ़ें। GK default चार MCQ, A-D options; answer अलग रखें।

## 4. Creative direction
- Hook, concept, audience promise, narrative structure, script/dialogue, CTA और caption तैयार करें।
- Duration के अनुरूप बोलने योग्य शब्द रखें; कहानी/निष्कर्ष truncate न करें।
- Poster/static output के लिए अनावश्यक video storyboard न बनाएं।

## 5. Visual Quality Master routing
- IMAGE: ultra-photorealistic RAW-DSLR-inspired stills/posters.
- VIDEO: ultra-realistic cinematic photorealism and plausible motion.
- 3D: technical/scientific/product visualization where it helps.
- HYBRID: combine photorealism, 3D/CGI, animation and VFX only when useful.
- Lighting, Detail, Video Motion, Identity Preservation and Temporal Consistency locks apply.
- Provider capability limits must be checked before promising resolution, duration, FPS or fidelity.

## 6. Identity, characters & continuity
- Reference images are identity references only unless user says otherwise.
- Preserve face identity and natural features; do not beautify, de-age or redesign.
- Keep recurring characters, outfit, props, location, light and screen direction consistent within the project.

## 7. Storyboard / frame plan (only when needed)
- Split by meaningful story beats, not arbitrary frame count.
- Each frame: duration, visual action, dialogue, camera, image prompt, video prompt, transition and continuity note.
- Every visual must correspond to the spoken dialogue/action.

## 8. Voice, audio & captions (only when needed)
- Voice tone/emotion, pronunciation, pacing, music/SFX, subtitle timing and safe-zone notes.
- Lip-sync and TTS are provider-dependent; do not mark passed without rendered-media review.

## 9. Editing & delivery plan
- Timeline tracks, trim/cut/transition, aspect ratio, resolution and export format.
- MP4 render requires a working render service and actual media assets.
- Generate provider-specific prompts; for YT Create enforce the 900-character cap per prompt when requested.

## 10. QA gates
- Intent/category fit; source/fact check; script completeness; language; identity; continuity; visual style; motion; audio; subtitle; duration; platform safe area; copyright/safety; provider capability; file integrity.
- Report each check as PASS / FAIL / NOT TESTED with evidence.

## 11. Save, export & learn
- Save locally; cloud save only after Supabase is configured and user authenticated.
- Export brief/prompts/storyboard/captions as available. A/B learning only from actual performance data.
- Do not publish or spend credits without explicit user action.

## Status discipline
- IMPLEMENTED means code exists. LOCAL TESTED means automated/local checks pass. LIVE TEST REQUIRED means deployment/provider/device validation remains. NOT IMPLEMENTED means no working implementation exists.
