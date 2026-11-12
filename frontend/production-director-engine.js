/* UPS INFINITY — local production director planner. Plans production; does not render media. */
(function(root){
 'use strict';
 const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
 const safe=(v,fallback)=>String(v||fallback).trim();
 function build(input={}){
  const a=input.answers||input;
  const durationText=safe(a.duration,'90 Seconds');
  const parsed=Number((durationText.match(/[0-9]+(?:\.[0-9]+)?/)||[])[0]);
  const duration=clamp(parsed||90,10,3600);
  const isSeconds=/sec|second/i.test(durationText)||duration<=60;
  const totalSeconds=isSeconds?duration:duration*60;
  const topic=safe(a.topic,'AI द्वारा चुना गया विषय');
  const category=safe(a.category,'General');
  const mode=safe(input.mode,'HYBRID').toUpperCase();
  const count=clamp(Math.ceil(totalSeconds/9),10,12);
  const sceneDuration=totalSeconds/count;
  const format=safe(a.format,'Video / Reel');
  const ratio=safe(a.ratio,'9:16 Vertical');
  const platform=safe(a.platform,'AUTO');
  const language=safe(a.language,'Hindi');
  const sceneTypes=['HOOK','CONTEXT','SETUP','DISCOVERY','DEVELOPMENT','DETAIL','TURNING POINT','PAYOFF','TAKEAWAY','CTA','BRIDGE','CLOSING'];
  const scenes=Array.from({length:count},(_,i)=>{
   const start=+(i*sceneDuration).toFixed(2),end=+((i+1)*sceneDuration).toFixed(2);
   const type=sceneTypes[i]||'SUPPORT';
   return {scene:i+1,type,time:{start,end,duration:+(end-start).toFixed(2)},
    objective:i===0?'पहले 2–3 सेकंड में ध्यान खींचें':i===count-1?'मुख्य संदेश और CTA स्पष्ट करें':`${topic} को क्रमबद्ध तरीके से आगे बढ़ाएँ`,
    visual_prompt:`${topic} — ${type} दृश्य; ${category} संदर्भ; ${ratio}; विषय के अनुरूप ${mode} visual treatment; स्पष्ट subject, composition, lighting और background; अनावश्यक text नहीं।`,
    video_prompt:`${type} shot for ${topic}; duration ${(end-start).toFixed(2)} seconds; natural motion, stable camera, coherent action, consistent identity/wardrobe/location, realistic physics, no flicker or morphing.`,
    dialogue:`[${language} में इस दृश्य के उद्देश्य के अनुसार संवाद/नैरेशन लिखें]`,
    audio:{voice:'स्पष्ट, स्वाभाविक और भाव के अनुरूप',music:i===0?'Hook accent':'Background score continuity',sfx:'केवल दृश्य के अनुरूप'},
    edit:{transition:i===0?'Open':i===count-1?'End':'Motivated cut',caption:'Readable, safe-area aligned',continuity:'पिछले और अगले दृश्य से character, wardrobe, props, location, light match करें'}
   };
  });
  return {schema:'ups-infinity-production-plan/1.0',createdAt:new Date().toISOString(),status:'PLAN_ONLY_MEDIA_NOT_RENDERED',mode,brief:{topic,category,format,platform,ratio,language,totalSeconds,sceneCount:count},director:{visualMaster:mode==='AUTO'?'AUTO_ROUTE':mode,identityLock:true,temporalConsistencyLock:true,safeFrame:true,qualityGate:['Factual accuracy','Identity consistency','Temporal continuity','Audio/dialogue sync','Caption safe area','Export validation']},scenes,timeline:{durationSeconds:totalSeconds,tracks:[{name:'V1 — Main Video',type:'video'},{name:'V2 — B-roll / Graphics',type:'video'},{name:'A1 — Dialogue / Voice',type:'audio'},{name:'A2 — Music',type:'audio'},{name:'A3 — SFX',type:'audio'},{name:'T1 — Captions / Titles',type:'text'}]},render:{status:'NOT_RENDERED',required:'Connected video provider or local render worker (FFmpeg)',target:{aspectRatio:ratio,platform,container:'MP4'},validation:['Check actual duration','Check resolution and aspect ratio','Check audio stream','Check caption timing','Play final file end-to-end']}};
 }
 function toText(plan){return [`UPS INFINITY — PRODUCTION DIRECTOR PLAN`,`STATUS: ${plan.status}`,`MODE: ${plan.mode}`,`TOPIC: ${plan.brief.topic}`,`DURATION: ${plan.brief.totalSeconds}s | SCENES: ${plan.scenes.length}`,'',...plan.scenes.flatMap(s=>[`SCENE ${s.scene} · ${s.type} · ${s.time.start}-${s.time.end}s`,`Objective: ${s.objective}`,`Visual: ${s.visual_prompt}`,`Video: ${s.video_prompt}`,`Dialogue: ${s.dialogue}`,`Edit: ${s.edit.transition} | ${s.edit.continuity}`,''])].join('\n');}
 root.UPS_PRODUCTION_DIRECTOR={build,toText};
 if(typeof module!=='undefined'&&module.exports)module.exports=root.UPS_PRODUCTION_DIRECTOR;
})(typeof window!=='undefined'?window:globalThis);
