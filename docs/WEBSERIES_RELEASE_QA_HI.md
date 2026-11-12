# Web Series Studio — Release QA

तैयार की गई सुविधाएँ:
- AUTO / MANUAL / HYBRID modes
- One-click AUTO-FILL और नया विषय सुझाव
- Series title, genre, premise, episode count, duration, language, audience
- 2–30 episodes और 1–90 minute duration validation/clamping
- Series Bible और continuity rules
- Episode-wise purpose, learning objective, 7 story beats, continuity note और ending
- Browser localStorage में अधिकतम 50 recent plans
- JSON copy, JSON download, TXT plan download, episode script-outline TXT download
- Clear form/reset control
- Mobile responsive controls

Automated QA: npm test — 10/10 PASS.
Syntax QA: frontend/app.js, web-series-engine.js, visual-quality-engine.js, backend/server.js, backend/pipeline-config.js — node --check PASS.

सीमाएँ: AUTO-FILL curated offline topic bank से चलता है; live Google Trends, web research/fact verification या LLM generation नहीं। Script button episode-wise structured outline देता है, पूर्ण dialogue screenplay नहीं। वास्तविक AI script विस्तार, media generation, TTS/lip-sync और MP4 render के लिए secured backend providers और अलग E2E tests जरूरी हैं।
