import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import Parser from 'rss-parser';
const app=express();
app.set('trust proxy', 1);
const port=Number(process.env.PORT||8787);
const origins=(process.env.ALLOWED_ORIGINS||'http://localhost:8080').split(',').map(x=>x.trim()).filter(Boolean);
const parser=new Parser({timeout:10000,headers:{'User-Agent':'UPS-Creator-Studio/1.0'}});
const safeText=(value,max=180)=>String(value??'').replace(/[\u0000-\u001F\u007F]/g,' ').trim().slice(0,max);
const allowedGeo=new Set(['IN','US','GB','CA','AU','SG','AE']);
app.use(helmet({crossOriginResourcePolicy:{policy:'cross-origin'}}));
app.use(cors({origin(origin,cb){if(!origin||origins.includes(origin))return cb(null,true);return cb(new Error('Origin not allowed by CORS'));}}));
app.use(express.json({limit:'1mb'}));
app.use('/api/',rateLimit({windowMs:60_000,limit:40,standardHeaders:true,legacyHeaders:false}));
// Authentication endpoints get a stricter independent limit to slow password guessing.
app.use('/api/auth/',rateLimit({windowMs:15*60_000,limit:10,standardHeaders:true,legacyHeaders:false,message:{error:'Too many authentication attempts. Try again later.'}}));

app.get('/api/health',(req,res)=>res.json({status:'ok',service:'UPS INFINITY API',time:new Date().toISOString(),features:{rssSearch:true,geminiText:!!process.env.GEMINI_API_KEY,imageGeneration:false,videoRendering:false}}));
app.get('/api/capabilities',(req,res)=>res.json({textGeneration:!!process.env.GEMINI_API_KEY,newsRss:true,trendsRss:true,imageGeneration:false,videoGeneration:false,mp4Rendering:false,socialPublishing:false,notes:'Capabilities are reported from configured services; image/video generation and publishing are not implemented in this starter.'}));

app.get('/api/search',async(req,res)=>{
 const q=safeText(req.query.q,180);
 if(!q)return res.status(400).json({error:'Search query is required'});
 const url=`https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=hi&gl=IN&ceid=IN:hi`;
 try{
  const feed=await parser.parseURL(url);
  const items=(feed.items||[]).slice(0,15).map(i=>({title:i.title||'Untitled',url:i.link||'',source:i.creator||i.source||'Google News RSS',date:i.isoDate||i.pubDate||null,snippet:(i.contentSnippet||i.content||'').replace(/<[^>]*>/g,'').slice(0,450)}));
  res.json({query:q,source:'Google News RSS',retrievedAt:new Date().toISOString(),items,notice:'News RSS results are discovery leads. Verify facts with primary sources before publishing; ranking is not official search volume.'});
 }catch(e){res.status(502).json({error:'News RSS source unavailable',detail:process.env.NODE_ENV==='development'?e.message:undefined})}
});

app.get('/api/trends',async(req,res)=>{
 const requestedGeo=safeText(req.query.geo||'IN',2).toUpperCase();
 const geo=allowedGeo.has(requestedGeo)?requestedGeo:'IN';
 const url=`https://trends.google.com/trending/rss?geo=${encodeURIComponent(geo)}`;
 try{
  const feed=await parser.parseURL(url);
  const items=(feed.items||[]).slice(0,25).map(i=>({title:i.title||'Untitled',url:i.link||'',source:'Google Trends RSS',date:i.isoDate||i.pubDate||null,snippet:i.contentSnippet||''}));
  res.json({geo,source:'Google Trends RSS',retrievedAt:new Date().toISOString(),items,notice:'Trend feed availability and coverage may vary. Do not interpret this feed as precise search-volume data.'});
 }catch(e){res.status(502).json({error:'Trends RSS unavailable',detail:process.env.NODE_ENV==='development'?e.message:undefined})}
});


app.get('/api/research/search',async(req,res)=>{
 const q=safeText(req.query.q,500);
 if(!q)return res.status(400).json({error:'Search query is required'});
 const key=process.env.BRAVE_SEARCH_API_KEY;
 if(!key)return res.status(503).json({error:'Live web search provider is not configured. Set BRAVE_SEARCH_API_KEY on the backend.'});
 const country=safeText(req.query.country||'IN',2).toUpperCase();
 const lang=safeText(req.query.lang||'hi',8).toLowerCase();
 const url=new URL('https://api.search.brave.com/res/v1/web/search');
 url.searchParams.set('q',q);url.searchParams.set('country',country);url.searchParams.set('search_lang',lang);url.searchParams.set('count','10');url.searchParams.set('safesearch','moderate');
 try{
  const upstream=await fetch(url,{headers:{'X-Subscription-Token':key,'Accept':'application/json'},signal:AbortSignal.timeout(15000)});
  if(!upstream.ok)return res.status(502).json({error:'Search provider request failed',providerStatus:upstream.status});
  const data=await upstream.json();
  const items=(data.web?.results||[]).slice(0,10).map(x=>({title:safeText(x.title,250),url:x.url||'',description:safeText(x.description,700),age:x.age||null}));
  res.json({query:q,provider:'Brave Search API',retrievedAt:new Date().toISOString(),items,notice:'Search results are discovery leads, not verified facts. Open primary sources and verify claims before publication.'});
 }catch(e){res.status(502).json({error:'Live search connection failed'});}
});

app.post('/api/ai/generate',async(req,res)=>{
 const apiKey=process.env.GEMINI_API_KEY;
 if(!apiKey)return res.status(503).json({error:'AI text provider is not configured on the backend.'});
 const prompt=safeText(req.body?.prompt,18000);
 if(!prompt)return res.status(400).json({error:'Prompt is required.'});
 const model=process.env.GEMINI_MODEL||'gemini-2.5-flash';
 const controller=new AbortController();
 const timeout=setTimeout(()=>controller.abort(),45000);
 try{
  const endpoint=`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const upstream=await fetch(endpoint,{
   method:'POST',
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify({
    contents:[{role:'user',parts:[{text:prompt}]}],
    generationConfig:{temperature:0.65,maxOutputTokens:8192}
   }),
   signal:controller.signal
  });
  const data=await upstream.json();
  if(!upstream.ok)return res.status(502).json({
   error:'AI provider request failed',
   providerStatus:upstream.status,
   detail:process.env.NODE_ENV==='development'?(data.error?.message||'Provider error'):'Check provider key, model and quota.'
  });
  const text=(data.candidates||[]).flatMap(c=>c.content?.parts||[]).map(p=>p.text||'').join('\n');
  if(!text.trim())return res.status(502).json({error:'AI provider returned no text. Check safety filters and provider response.'});
  res.json({text,model,provider:'Gemini',generatedAt:new Date().toISOString()});
 }catch(e){
  res.status(502).json({
   error:e.name==='AbortError'?'AI provider timed out':'AI provider connection failed',
   detail:process.env.NODE_ENV==='development'?e.message:undefined
  });
 }finally{clearTimeout(timeout)}
});


// ---- UPS INFINITY production data/auth layer (JSON adapter; migrate to managed DB for multi-instance) ----
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
const DATA_DIR=process.env.DATA_DIR||path.resolve('data');
const DB_FILE=path.join(DATA_DIR,'ups-infinity-store.json');
const JWT_SECRET=process.env.JWT_SECRET||'';
const store={users:[],projects:[],series:[],audit:[]};
async function loadStore(){await fs.mkdir(DATA_DIR,{recursive:true});try{const d=JSON.parse(await fs.readFile(DB_FILE,'utf8'));for(const k of Object.keys(store))store[k]=Array.isArray(d[k])?d[k]:[];}catch(e){if(e.code!=='ENOENT')throw e;await saveStore();}}
let saveChain=Promise.resolve();
function saveStore(){saveChain=saveChain.then(()=>fs.writeFile(DB_FILE,JSON.stringify(store,null,2),{mode:0o600}));return saveChain;}
const b64=o=>Buffer.from(JSON.stringify(o)).toString('base64url');
function sign(payload){if(!JWT_SECRET)throw Error('JWT_SECRET_NOT_CONFIGURED');const h=b64({alg:'HS256',typ:'JWT'}),p=b64(payload),sig=crypto.createHmac('sha256',JWT_SECRET).update(h+'.'+p).digest('base64url');return h+'.'+p+'.'+sig;}
function verify(token){if(!JWT_SECRET)throw Error('JWT_SECRET_NOT_CONFIGURED');const [h,p,s]=String(token||'').split('.');if(!h||!p||!s)throw Error('BAD_TOKEN');const expected=crypto.createHmac('sha256',JWT_SECRET).update(h+'.'+p).digest();const actual=Buffer.from(s,'base64url');if(actual.length!==expected.length||!crypto.timingSafeEqual(actual,expected))throw Error('BAD_TOKEN');const v=JSON.parse(Buffer.from(p,'base64url'));if(v.exp<Date.now())throw Error('TOKEN_EXPIRED');return v;}
const hashPassword=(password,salt=crypto.randomBytes(16).toString('hex'))=>({salt,hash:crypto.scryptSync(password,salt,64).toString('hex')});
function auth(req,res,next){try{const t=(req.headers.authorization||'').replace(/^Bearer\s+/i,'');const claims=verify(t);const user=store.users.find(x=>x.id===claims.sub);if(!user)throw Error('NO_USER');req.user=user;next();}catch(e){res.status(401).json({error:'Authentication required or session expired'});}}
function own(req,res,next){const owner=req.params.userId||req.body?.userId;if(owner&&owner!==req.user.id)return res.status(403).json({error:'Forbidden'});next();}
const id=()=>crypto.randomUUID();
app.get('/api/system/status',(req,res)=>res.json({service:'UPS INFINITY',api:'online',auth:!!JWT_SECRET,storage:'local-json-single-instance',aiText:!!process.env.GEMINI_API_KEY,liveSearch:!!process.env.BRAVE_SEARCH_API_KEY,googleTrendsRss:true,ffmpeg:!!process.env.FFMPEG_PATH,payments:!!(process.env.RAZORPAY_KEY_ID&&process.env.RAZORPAY_KEY_SECRET),note:'Provider capabilities are reported honestly; unconfigured services are disabled.'}));
app.post('/api/auth/register',async(req,res)=>{const email=safeText(req.body?.email,254).toLowerCase(),password=String(req.body?.password||'');if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||password.length<12)return res.status(400).json({error:'Valid email and password of at least 12 characters required'});if(store.users.some(u=>u.email===email))return res.status(409).json({error:'Account already exists'});if(!JWT_SECRET)return res.status(503).json({error:'Set a strong JWT_SECRET on the server before enabling authentication'});const pw=hashPassword(password),user={id:id(),email,role:'user',password:pw,createdAt:new Date().toISOString()};store.users.push(user);await saveStore();res.status(201).json({token:sign({sub:user.id,exp:Date.now()+86400000}),user:{id:user.id,email,role:user.role}});});
app.post('/api/auth/login',(req,res)=>{if(!JWT_SECRET)return res.status(503).json({error:'Authentication is not configured on the server'});const email=safeText(req.body?.email,254).toLowerCase(),password=String(req.body?.password||'');const u=store.users.find(x=>x.email===email);if(!u||!u.password?.salt||!u.password?.hash)return res.status(401).json({error:'Invalid credentials'});const candidate=hashPassword(password,u.password.salt).hash;const expected=Buffer.from(u.password.hash,'hex'),actual=Buffer.from(candidate,'hex');if(expected.length!==actual.length||!crypto.timingSafeEqual(actual,expected))return res.status(401).json({error:'Invalid credentials'});res.json({token:sign({sub:u.id,exp:Date.now()+86400000}),user:{id:u.id,email:u.email,role:u.role}});});
app.get('/api/auth/me',auth,(req,res)=>res.json({id:req.user.id,email:req.user.email,role:req.user.role}));
app.post('/api/auth/passcode/verify',auth,(req,res)=>{const pin=String(req.body?.pin||'');if(!/^\d{6,12}$/.test(pin))return res.status(400).json({error:'Passcode must be 6–12 digits'});const salt=req.user.passcode?.salt;if(!salt)return res.status(409).json({error:'Passcode is not enrolled. Use passcode setup first.'});const h=crypto.scryptSync(pin,salt,64);res.json({verified:crypto.timingSafeEqual(h,Buffer.from(req.user.passcode.hash,'hex'))});});
app.post('/api/auth/passcode/setup',auth,async(req,res)=>{const pin=String(req.body?.pin||'');if(!/^\d{6,12}$/.test(pin))return res.status(400).json({error:'Passcode must be 6–12 digits'});const pw=hashPassword(pin);req.user.passcode=pw;await saveStore();res.json({configured:true});});
app.get('/api/projects',auth,(req,res)=>res.json(store.projects.filter(p=>p.userId===req.user.id)));
app.post('/api/projects',auth,async(req,res)=>{const title=safeText(req.body?.title,180);if(!title)return res.status(400).json({error:'Project title required'});const p={id:id(),userId:req.user.id,title,data:req.body?.data||{},createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};store.projects.push(p);await saveStore();res.status(201).json(p);});
app.put('/api/projects/:id',auth,async(req,res)=>{const p=store.projects.find(x=>x.id===req.params.id&&x.userId===req.user.id);if(!p)return res.status(404).json({error:'Project not found'});p.title=safeText(req.body?.title||p.title,180);p.data=req.body?.data??p.data;p.updatedAt=new Date().toISOString();await saveStore();res.json(p);});
app.delete('/api/projects/:id',auth,async(req,res)=>{const i=store.projects.findIndex(x=>x.id===req.params.id&&x.userId===req.user.id);if(i<0)return res.status(404).json({error:'Project not found'});store.projects.splice(i,1);await saveStore();res.json({deleted:true});});
app.get('/api/series',auth,(req,res)=>res.json(store.series.filter(s=>s.userId===req.user.id)));
app.post('/api/series',auth,async(req,res)=>{const title=safeText(req.body?.title,180);if(!title)return res.status(400).json({error:'Series title required'});const s={id:id(),userId:req.user.id,title,format:safeText(req.body?.format||'episodic',40),episodeDurationSeconds:Number(req.body?.episodeDurationSeconds)||600,parts:[],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};store.series.push(s);await saveStore();res.status(201).json(s);});
app.post('/api/series/:id/parts',auth,async(req,res)=>{const s=store.series.find(x=>x.id===req.params.id&&x.userId===req.user.id);if(!s)return res.status(404).json({error:'Series not found'});const duration=Number(req.body?.durationSeconds||10);if(!Number.isInteger(duration)||duration<1||duration>900)return res.status(400).json({error:'Part duration must be 1–900 seconds'});const part={id:id(),index:s.parts.length+1,title:safeText(req.body?.title||`Part ${s.parts.length+1}`,160),durationSeconds:duration,story:safeText(req.body?.story,5000),dialogue:safeText(req.body?.dialogue,5000),visualPrompt:safeText(req.body?.visualPrompt,5000),continuityRef:safeText(req.body?.continuityRef,500),createdAt:new Date().toISOString()};s.parts.push(part);s.updatedAt=new Date().toISOString();await saveStore();res.status(201).json(part);});
app.get('/api/admin/overview',auth,(req,res)=>{if(req.user.role!=='admin')return res.status(403).json({error:'Admin only'});res.json({users:store.users.length,projects:store.projects.length,series:store.series.length});});
app.get('/api/billing/status',auth,(req,res)=>res.json({enabled:!!(process.env.RAZORPAY_KEY_ID&&process.env.RAZORPAY_KEY_SECRET),plans:[],message:'Payment checkout/webhook adapter must be configured and verified before accepting money.'}));
app.post('/api/billing/order',auth,(req,res)=>{if(!process.env.RAZORPAY_KEY_ID||!process.env.RAZORPAY_KEY_SECRET)return res.status(503).json({error:'Payment provider is not configured'});res.status(501).json({error:'Checkout adapter not implemented; no payment was created.'});});

await loadStore();
app.use((err,req,res,next)=>{if(err.message?.includes('CORS'))return res.status(403).json({error:'Origin not allowed'});console.error(err);res.status(500).json({error:'Internal server error'})});
app.listen(port,()=>console.log(`UPS INFINITY API listening on ${port}`));
