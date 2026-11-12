# UPS INFINITY — AI Creator & Production Hub

**Developer:** Umesh Prakash Singh  
**Repository suggestion:** `ups-infinity-ai-production-hub`  
**ZIP name:** `UPS_INFINITY_AI_CREATOR_PRODUCTION_HUB.zip`

यह नया clean integration build है। पुराने प्रोजेक्टों से उपयोगी आधार लिया गया है; पुराने ZIP सुरक्षित रखें।

## चलाने का तरीका
1. Node.js 20+ इंस्टॉल करें।
2. इस फोल्डर में `npm install` चलाएँ (backend dependencies के लिए `cd backend && npm install`)।
3. `frontend/config.example.js` की कॉपी `config.js` बनाएँ और केवल सार्वजनिक Supabase URL/anon key तथा backend URL भरें। Service-role key या AI secret कभी frontend/GitHub में न रखें।
4. Backend में `.env.example` की कॉपी `.env` बनाकर आवश्यक secrets केवल सर्वर पर रखें।
5. `npm run check` और `npm test` चलाएँ।
6. Frontend को HTTPS hosting और backend को अलग Node hosting पर deploy करें। GitHub Pages केवल static frontend चलाता है; Express backend वहाँ नहीं चलता।

## वर्तमान ईमानदार स्थिति
- Dashboard, guided brief, project local storage, visual-quality prompt routing: code present.
- Web Series Studio: नया local series-bible और episode planner जोड़ा गया; यह अभी planning tool है, स्वतः पूरी script/video renderer नहीं।
- AI text, Supabase, RSS: backend/configuration और credentials पर निर्भर।
- Live image/video/TTS/lip-sync, FFmpeg MP4 render, social publishing और signed APK: इस build में certified live features नहीं हैं।
- Architecture registry: 12 engines, 100 modules, 100 commands, 50 locks, 20 QA departments, 4 visual masters, 3 modes और 10 initial profiles। Registry में दर्ज होना implementation का प्रमाण नहीं है।

## सुरक्षा
SQL migration चलाने से पहले database backup लें। Supabase RLS अलग-अलग accounts से जाँचें। Provider keys server-side रखें। APK signing key निजी रखें।


## Phase 1–4 QA स्थिति
विस्तृत स्थिति के लिए `docs/PHASE_1_TO_4_INTERNAL_QA_HI.md` देखें। Source-level PASS को Live Provider या Device PASS न समझें।
