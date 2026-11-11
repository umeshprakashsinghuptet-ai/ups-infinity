/* UPS Creator Studio frontend. External services are optional until configured. */
(() => {
'use strict';
const cfg = window.UPS_CONFIG || {};
const API = (cfg.API_BASE_URL || '').replace(/\/$/, '');
const hasSupabase = !!(window.supabase && cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY &&
  !cfg.SUPABASE_URL.includes('YOUR-PROJECT') && !cfg.SUPABASE_ANON_KEY.includes('YOUR_'));
const sb = hasSupabase ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
let mode = 'HYBRID', qStep = 0, answers = {}, selected = {}, currentUser = null;
const steps = [
 {key:'format',title:'आप क्या बनाना चाहते हैं?',hint:'एक मुख्य आउटपुट चुनें।',options:['Complete Content Package','Video / Reel','Poster / Image','Story / Script','Education Material','Business Advertisement','AUTO — आप तय करें']},
 {key:'category',title:'किस कैटेगरी का कंटेंट चाहिए?',hint:'विषय के आधार पर AI कैटेगरी पहचान सकता है।',options:['GK / Quiz','Current Affairs / Daily News','Education','Motivation','Shayari / Dialogue','Storytelling','Vlog / Travel','Podcast','Interior / Business','Personal Branding','Other / AUTO']},
 {key:'platform',title:'किस प्लेटफॉर्म के लिए?',hint:'एक से अधिक प्लेटफॉर्म चुन सकते हैं।',options:['Facebook','Instagram','YouTube','WhatsApp','Multiple Platforms','AUTO']},
 {key:'ratio',title:'कौन-सा फॉर्मेट चाहिए?',hint:'AUTO में प्लेटफॉर्म के अनुसार सुझाव मिलेगा।',options:['9:16 Vertical','16:9 Landscape','1:1 Square','4:5 Portrait','AUTO']},
 {key:'duration',title:'कितनी अवधि चाहिए?',hint:'लिखित सामग्री/पोस्टर में यह चरण छोड़ा जा सकता है।',options:['10 Seconds','20 Seconds','30 Seconds','60 Seconds','Custom / AUTO']},
 {key:'topic',title:'आपका विषय या निर्देश क्या है?',hint:'अपना विषय लिखें या AUTO में AI से सुझाव माँगें।',input:true}
];
const names={home:'आपका AI Studio तैयार है।',autopilot:'AI Auto-Pilot',search:'Smart Trend Search',content:'Content Studio',series:'Web Series Studio',poster:'Poster & Image Studio',video:'Video Studio',education:'Education Workspace',media:'GK & Media Workspace',business:'Interior Business Workspace',personal:'Personal Branding Workspace',projects:'Projects Library',settings:'Settings & Integrations'};
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000)}
function escapeHtml(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function openPage(p){if(!names[p])return;$$('.page').forEach(x=>x.classList.remove('active'));$('#page-'+p)?.classList.add('active');$$('[data-page]').forEach(x=>x.classList.toggle('active',x.dataset.page===p));$('#pageTitle').textContent=names[p];$('#sidebar').classList.remove('open');if(p==='projects')renderProjects();if(p==='settings')checkServices()}
function getProjects(){try{return JSON.parse(localStorage.getItem('ups_projects')||'[]')}catch{return []}}
function saveLocal(project){const all=getProjects();all.unshift(project);localStorage.setItem('ups_projects',JSON.stringify(all.slice(0,100)))}
function buildBrief(){
 const topic=answers.topic||'AI द्वारा चुना गया नया और उपयुक्त विषय';
 const cat=answers.category||'AUTO';
 const visual=window.UPS_VISUAL_QUALITY?.build({category:cat,subject:topic,format:answers.format,purpose:answers.purpose});
 return `UPS CREATOR STUDIO — MASTER PRODUCTION BRIEF\n\nMODE: ${mode}\nOUTPUT: ${answers.format||'Complete Content Package'}\nCATEGORY: ${cat}\nPLATFORM: ${answers.platform||'AUTO'}\nASPECT RATIO: ${answers.ratio||'AUTO'}\nDURATION: ${answers.duration||'AUTO'}\nTOPIC / INSTRUCTION: ${topic}\n\nVISUAL QUALITY MASTER ENGINE\n- AUTO SELECTED MASTER: ${visual?.selectedMaster||'VIDEO'} (${visual?.qualityTarget||'ULTRA-REALISTIC CINEMATIC PHOTOREALISM'}).\n- AUTO ROUTING: choose IMAGE, VIDEO, 3D or HYBRID according to category, subject, scene and production purpose.\n- IMAGE: ultra-photorealistic RAW DSLR quality. VIDEO: ultra-realistic cinematic photorealism. 3D: ultra-realistic 3D/CGI. HYBRID: photorealistic + cinematic 3D + VFX only when useful.\n- LIGHTING LOCK: natural exposure, realistic shadows, balanced highlights; no artificial glow, excessive brightness or oversaturation.\n- DETAIL LOCK: natural textures, realistic materials, fine details, depth and professional composition.\n- VIDEO MOTION LOCK: natural movement, realistic physics, smooth camera motion, frame consistency; no flicker or distortion.\n- IDENTITY PRESERVATION LOCK: preserve reference identity and natural facial features; no redesign or artificial beautification.\n- TEMPORAL CONSISTENCY LOCK: preserve character, wardrobe, props, environment, lighting and frame continuity.\n- Quality target: realistic, cinematic, natural, consistent and premium. Model capability and actual output must be verified.\n\nDIRECTOR INSTRUCTIONS\n1. Understand the user's objective and audience; do not ask for information already supplied.\n2. For current affairs/news, retrieve dated reliable sources, verify facts and show source links. Never invent live trends or trend scores.\n3. Create a strong hook, complete coherent script and natural Hindi/English dialogue as requested.\n4. Keep every visual aligned with the actual dialogue and story beats.\n5. IMAGE QUALITY: ultra-photorealistic RAW-DSLR-inspired look, natural skin texture, realistic materials, balanced exposure, natural lighting and shadows; avoid plastic skin, excessive glow, oversaturation and artificial sharpness.\n6. VIDEO QUALITY: ultra-realistic cinematic photorealism, natural human motion, plausible physics, stable identity, consistent wardrobe within the same video, coherent camera movement and controlled flicker/distortion.\n7. If reference photos are supplied, use them for identity only. Do not copy their clothing, pose, background, lighting or composition unless explicitly requested. Do not alter the person's identity or age.\n8. Choose 2D, 3D, photorealism or hybrid VFX according to the category; do not force photorealism onto animation.\n9. Generate platform-specific poster/image prompts, scene-wise video prompts, voice/audio instructions, captions and hashtags.\n10. For YouTube Create prompts, keep each individual prompt within 900 characters. Count characters before delivery.\n11. Respect platform policies, copyright, safe areas, aspect ratio and factual accuracy.\n12. Finish with a QA checklist and clearly state which outputs are prompts versus actually rendered media.\n\nPRODUCTION STATUS: Brief generated. Image/video rendering, live research and publishing require connected and tested provider integrations.`;
}
function openWizard(prefill={}){
 answers={...prefill};selected={};qStep=0;$('#wizardModal').classList.add('show');renderStep();
}
function renderStep(){
 const s=steps[qStep];$('#wizardTitle').textContent=s.title;$('#stepMeta').textContent=`STEP ${qStep+1} OF ${steps.length} · ${mode} MODE`;$('#wizardHint').textContent=s.hint;
 const wrap=$('#wizardOptions');wrap.innerHTML='';const input=$('#wizardInput');input.hidden=!s.input;input.value=answers[s.key]||'';
 if(s.options)s.options.forEach(v=>{const b=document.createElement('button');b.className='wizard-option'+(answers[s.key]===v?' selected':'');b.textContent=v;b.onclick=()=>{answers[s.key]=v;renderStep()};wrap.appendChild(b)});
 $('#wizardBack').textContent=qStep===0?'रद्द करें':'← पीछे';$('#wizardNext').textContent=qStep===steps.length-1?'ब्रीफ तैयार करें':'आगे बढ़ें →';
}
function showBrief(){
 const brief=buildBrief();
 const project={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),title:(answers.topic||answers.category||'New Creative Project').slice(0,80),created_at:new Date().toISOString(),mode,answers,brief};
 saveLocal(project);
 $('#wizardModal').classList.remove('show');
 const page=$('#page-autopilot');
 page.innerHTML=`<div class="page-intro"><div class="eyebrow">AI CREATIVE DIRECTOR</div><h2>Production Workspace</h2><p>आपका प्रोडक्शन ब्रीफ तैयार है। नीचे से कॉपी करें या कॉन्फ़िगर किए गए AI Text Provider से विस्तृत कंटेंट बनवाएँ।</p></div>
 <section class="panel"><div class="panel-head"><h3>${escapeHtml(project.title)}</h3><span class="subtle">${escapeHtml(mode)} MODE</span></div>
 <div class="modal-actions"><button class="btn secondary" id="copyProductionBrief">ब्रीफ कॉपी करें</button><button class="btn primary" id="runAiGeneration">✦ AI से कंटेंट तैयार करें</button></div>
 <div id="aiGenerationStatus" class="muted" aria-live="polite">AI generation के लिए Backend URL और Gemini API Key server पर configured होना जरूरी है।</div>
 <pre id="productionBrief" class="production-output"></pre><h3>AI Generated Content</h3><pre id="aiGeneratedOutput" class="production-output">अभी AI generation नहीं चलाई गई है।</pre></section>`;
 $('#productionBrief').textContent=brief;
 $('#copyProductionBrief').onclick=()=>navigator.clipboard.writeText(brief).then(()=>toast('ब्रीफ कॉपी हो गया।')).catch(()=>toast('Clipboard उपलब्ध नहीं है।'));
 $('#runAiGeneration').onclick=async()=>{
   const status=$('#aiGenerationStatus'),out=$('#aiGeneratedOutput'),btn=$('#runAiGeneration');
   if(!API){status.textContent='Backend URL configured नहीं है। frontend/config.js में API_BASE_URL सेट करें।';return}
   btn.disabled=true;status.textContent='AI से कंटेंट तैयार किया जा रहा है…';out.textContent='';
   try{
     const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),60000);
     const response=await fetch(`${API}/api/ai/generate`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:`You are the UPS Creator Studio creative director. Create a complete, accurate, useful production-ready content package from this brief. Respect the output format, category, language, duration, audience and platform. Do not invent current facts or sources. If live verification is unavailable, clearly label facts that need verification. Return structured headings, complete script/dialogue where relevant, visual prompts, caption and QA checklist.\\n\\n${brief}`}),signal:controller.signal});
     clearTimeout(timer);const data=await response.json();if(!response.ok)throw new Error(data.error||`Provider error ${response.status}`);
     out.textContent=data.text||'AI ने खाली उत्तर दिया।';status.textContent=`AI उत्तर प्राप्त हुआ · ${data.provider||'Provider'} · ${data.model||'model not specified'}`;
     project.aiOutput=out.textContent;project.aiProvider=data.provider||'unknown';saveLocal(project);
   }catch(e){status.textContent=e.name==='AbortError'?'AI request समय सीमा पार कर गई। पुनः प्रयास करें।':`AI generation उपलब्ध नहीं: ${e.message}`;out.textContent='आपका मूल Production Brief सुरक्षित है। Backend और provider configuration जाँचें।'}
   finally{btn.disabled=false}
 };
 if(sb&&currentUser)cloudSave(project).catch(e=>console.warn('Cloud save failed',e));
 openPage('autopilot');toast('प्रोडक्शन ब्रीफ तैयार और लोकल में सेव हुआ।');
}
async function cloudSave(p){const {error}=await sb.from('ups_projects').insert({user_id:currentUser.id,title:p.title,mode:p.mode,category:p.answers.category||null,topic:p.answers.topic||null,brief:p.brief});if(error)throw error}
function renderProjects(){const list=$('#projectsList'),items=getProjects();list.innerHTML=items.length?items.map(p=>`<div class="project-row"><span><b>${escapeHtml(p.title)}</b><br><small>${new Date(p.created_at).toLocaleString()}</small></span><button data-copy="${escapeHtml(p.id)}">Copy brief</button></div>`).join(''):'<div class="empty-state">अभी कोई प्रोजेक्ट सेव नहीं है। Auto-Pilot से पहला प्रोजेक्ट बनाएँ।</div>';$$('[data-copy]').forEach(b=>b.onclick=()=>{const p=items.find(x=>x.id===b.dataset.copy);if(p)navigator.clipboard.writeText(p.brief).then(()=>toast('ब्रीफ कॉपी हो गया।'))})}
async function searchTopics(query,target){
 if(!query.trim())return toast('पहले विषय लिखें।');target.innerHTML='<div class="empty-state">खोज जारी है…</div>';
 if(!API){target.innerHTML='<div class="empty-state">Backend URL सेट नहीं है। frontend/config.js में API_BASE_URL भरें और Backend deploy करें। अभी लाइव सर्च उपलब्ध नहीं है।</div>';return}
 try{const r=await fetch(`${API}/api/search?q=${encodeURIComponent(query)}`);const data=await r.json();if(!r.ok)throw new Error(data.error||'Search failed');const items=data.items||[];target.innerHTML=items.length?items.map(x=>`<div class="result-item"><b>${escapeHtml(x.title)}</b><small>${escapeHtml(x.source||'Source')} · ${escapeHtml(x.date||'Date unavailable')}</small><small>${escapeHtml(x.snippet||'')}</small><a href="${escapeHtml(x.url)}" target="_blank" rel="noopener">स्रोत खोलें ↗</a> <button class="use-topic" data-topic="${escapeHtml(x.title)}">इस विषय पर बनाएँ</button></div>`).join(''):'<div class="empty-state">इस खोज के लिए कोई परिणाम नहीं मिला।</div>';$$('.use-topic').forEach(b=>b.onclick=()=>openWizard({topic:b.dataset.topic,category:'AUTO'}))}
 catch(e){target.innerHTML=`<div class="empty-state">Search सेवा उपलब्ध नहीं: ${escapeHtml(e.message)}. बाद में पुनः प्रयास करें।</div>`}
}
async function checkServices(){
 $('#supabaseState').textContent=sb?'Configured':'Not configured';$('#connectionDetail').textContent=sb?'Supabase configured':'Supabase setup pending';
 let status='Not configured';if(API){try{const r=await fetch(`${API}/api/health`);const d=await r.json();status=r.ok?(d.status||'Connected'):'Unavailable'}catch{status='Unreachable'}}
 $('#backendState').textContent=status;$('#searchState').textContent=API?'Backend-dependent':'Not connected';$('#connectionStatus').textContent=sb&&API?'Services configured':'Setup required';
}
async function authAction(kind){if(!sb){$('#authMessage').textContent='पहले frontend/config.js में Supabase URL और public anon key भरें।';return}const email=$('#authEmail').value.trim(),password=$('#authPassword').value;if(!email||!password){$('#authMessage').textContent='ईमेल और पासवर्ड भरें।';return}let res=kind==='login'?await sb.auth.signInWithPassword({email,password}):await sb.auth.signUp({email,password});$('#authMessage').textContent=res.error?res.error.message:(kind==='login'?'Signed in.':'Registration request sent; check email if confirmation is enabled.');if(!res.error){const {data}=await sb.auth.getUser();currentUser=data.user;updateAuthUI()}}
function updateAuthUI(){$('#authButton').textContent=currentUser?'Account':'Sign in';$('#userAvatar').textContent=currentUser?(currentUser.email||'U')[0].toUpperCase():'U'}
function wire(){
 $$('[data-page]').forEach(b=>b.addEventListener('click',()=>openPage(b.dataset.page)));
 $$('[data-action="wizard"]').forEach(b=>b.addEventListener('click',()=>{const p={};if(b.dataset.format)p.format=b.dataset.format;if(b.dataset.category)p.category=b.dataset.category;openWizard(p)}));
 $$('[data-mode]').forEach(b=>b.addEventListener('click',()=>{$$('[data-mode]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');mode=b.dataset.mode;toast(`${mode} mode selected`)}));
 $('#wizardClose').onclick=()=>$('#wizardModal').classList.remove('show');
 $('#wizardBack').onclick=()=>{if(qStep===0)$('#wizardModal').classList.remove('show');else{qStep--;renderStep()}};
 $('#wizardNext').onclick=()=>{const s=steps[qStep];if(s.input)answers[s.key]=$('#wizardInput').value.trim();if(s.input&&!answers[s.key]&&mode!=='AUTO'){toast('विषय लिखें या AUTO मोड चुनें।');return}if(s.options&&!answers[s.key]){toast('एक विकल्प चुनें।');return}if(qStep<steps.length-1){qStep++;renderStep()}else showBrief()};
 $('#quickSearchBtn').onclick=()=>searchTopics($('#quickSearch').value,$('#quickResults'));
 $('#fullSearchBtn').onclick=()=>searchTopics($('#fullSearch').value,$('#fullResults'));
 $$('.quick-chips button').forEach(b=>b.onclick=()=>{const q=b.dataset.query;const t=$('#page-search').classList.contains('active')?$('#fullResults'):$('#quickResults');searchTopics(q,t)});
 $$('[data-query]').forEach(b=>b.addEventListener('click',()=>{const q=b.dataset.query;openPage('search');$('#fullSearch').value=q;searchTopics(q,$('#fullResults'))}));
 $('#menuToggle').onclick=()=>$('#sidebar').classList.toggle('open');
 $('#authButton').onclick=()=>$('#authModal').classList.add('show');$('#authClose').onclick=()=>$('#authModal').classList.remove('show');
 $('#loginBtn').onclick=()=>authAction('login');$('#registerBtn').onclick=()=>authAction('register');
 $('#signOutButton').onclick=async()=>{if(sb)await sb.auth.signOut();currentUser=null;updateAuthUI();toast('Signed out')};
 $('#healthCheck').onclick=checkServices;
}
async function init(){wire();checkServices();if(sb){const {data}=await sb.auth.getUser();currentUser=data.user;updateAuthUI();sb.auth.onAuthStateChange((_event,session)=>{currentUser=session?.user||null;updateAuthUI()})}if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});}
document.addEventListener('DOMContentLoaded',init);
})();
