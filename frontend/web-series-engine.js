/* UPS INFINITY — Web Series Studio v2.0
   Local planner + AUTO/MANUAL/HYBRID form assistance.
   This creates planning/script drafts; provider-backed AI generation/rendering is separate. */
(() => {
 'use strict';
 const $ = id => document.getElementById(id);
 const baseTopics = [
  {title:'भारत का संविधान: निर्माण से आज तक',genre:'Educational Documentary',premise:'भारतीय संविधान की ऐतिहासिक पृष्ठभूमि, निर्माण सभा, मूल सिद्धांत, अधिकार, कर्तव्य और समय के साथ हुए बदलावों को स्रोत-आधारित सरल श्रृंखला में समझाना।',audience:'विद्यार्थी और सामान्य दर्शक'},
  {title:'भारत के अनकहे वैज्ञानिक योगदान',genre:'Science & Discovery',premise:'भारत के वैज्ञानिक विचारों, खोजों, संस्थानों और आधुनिक अनुसंधान की सत्यापित यात्रा को रोचक एपिसोड में प्रस्तुत करना।',audience:'विद्यार्थी और विज्ञान में रुचि रखने वाले दर्शक'},
  {title:'इतिहास के निर्णायक मोड़',genre:'Historical Drama',premise:'इतिहास की महत्वपूर्ण घटनाओं के कारण, संदर्भ, प्रमुख व्यक्तित्व और दीर्घकालिक प्रभाव को प्रमाणित तथ्यों के साथ समझाना।',audience:'इतिहास प्रेमी और विद्यार्थी'},
  {title:'छोटी आदतें, बड़े बदलाव',genre:'Motivational',premise:'अनुशासन, सीखने, समय प्रबंधन, लक्ष्य निर्धारण और धैर्य पर व्यावहारिक, गैर-अतिशयोक्तिपूर्ण प्रेरक श्रृंखला।',audience:'युवा और सामान्य दर्शक'},
  {title:'डिजिटल दुनिया की समझ',genre:'Social Awareness',premise:'ऑनलाइन सुरक्षा, डिजिटल साक्षरता, गलत सूचना की पहचान, गोपनीयता और जिम्मेदार इंटरनेट उपयोग पर जागरूकता श्रृंखला।',audience:'विद्यार्थी, अभिभावक और सामान्य दर्शक'},
  {title:'अंतरिक्ष की खोज',genre:'Science & Discovery',premise:'सौरमंडल, तारों, ग्रहों, अंतरिक्ष अभियानों और वैज्ञानिक खोजों को विश्वसनीय स्रोतों के आधार पर समझाना।',audience:'विद्यार्थी और जिज्ञासु दर्शक'}

 ];
 const library=window.UPS_UNIVERSAL_CONTENT_LIBRARY||{categories:[]};
 const topics=library.categories.flatMap(cat=>cat.subgenres.map(sub=>({
  title:`${sub} — विशेष श्रृंखला`,genre:cat.name,
  premise:`${sub} विषय पर ${cat.name} श्रेणी की क्रमबद्ध, दर्शक-केंद्रित और शोध-आधारित श्रृंखला तैयार करें। प्रत्येक एपिसोड में नया पहलू, स्पष्ट उद्देश्य और उपयुक्त निष्कर्ष हो।`,
  audience:cat.name.includes('Kids')||cat.name.includes('Cartoon')?'बच्चे और परिवार':'रुचि रखने वाले सामान्य दर्शक',
  categoryId:cat.id,subcategory:sub
 }))).concat(baseTopics);
 const beats=[
  ['Opening Hook','एक स्पष्ट सवाल, रोचक तथ्य या समस्या से शुरुआत करें।'],
  ['पृष्ठभूमि','विषय का संदर्भ, समय, स्थान और जरूरी शब्द सरल भाषा में समझाएँ।'],
  ['मुख्य खोज','इस एपिसोड का पहला महत्वपूर्ण तथ्य/विचार प्रमाण सहित प्रस्तुत करें।'],
  ['गहराई','उदाहरण, तुलना, कारण और प्रभाव से विषय को विस्तार दें।'],
  ['मुख्य निष्कर्ष','इस भाग की सबसे महत्वपूर्ण सीख स्पष्ट करें।'],
  ['दर्शक से जुड़ाव','सीख को दैनिक जीवन/पाठ्यक्रम/समाज से जोड़ें।'],
  ['अगले भाग का संकेत','अगले एपिसोड की ओर ले जाने वाला वास्तविक प्रश्न रखें; झूठा cliffhanger नहीं।']
 ];
 const continuityRules=['Character identity consistency','Wardrobe and prop continuity','Verified facts and source traceability','Episode-to-episode narrative progression'];
 const PLAN_ONLY='PLAN_ONLY';
 let current=null, mode='AUTO', selectedTopic=0;
 const safe=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function status(t){$('seriesStatus').textContent=t;}

 function initLibrary(){
  const catSel=$('seriesCategory'), subSel=$('seriesSubcategory'), genreSel=$('seriesGenre');
  if(!catSel||!subSel||!genreSel)return;
  library.categories.forEach(c=>{catSel.add(new Option(`${c.name} — ${c.nameHi}`,c.id));genreSel.add(new Option(c.name,c.name));});
  function updateSubs(){
   const c=library.categories.find(x=>x.id===catSel.value);
   subSel.innerHTML='<option value="">AUTO SELECT</option>';
   (c?.subgenres||[]).forEach(x=>subSel.add(new Option(x,x)));
   if(c)genreSel.value=c.name;
  }
  catSel.addEventListener('change',updateSubs);
  genreSel.addEventListener('change',()=>{const c=library.categories.find(x=>x.name===genreSel.value);if(c){catSel.value=c.id;updateSubs();}});
 }
 function applyUserTopic(){
  const t=$('seriesTopicInput')?.value.trim(); if(!t){status('पहले अपना Topic या निर्देश लिखें।');return;}
  $('seriesTitle').value=t.length>90?t.slice(0,87)+'...':t;
  $('seriesPremise').value=`उपयोगकर्ता का निर्देश: ${t}\nइसी विषय पर तथ्य-जाँच/रचनात्मक उपयुक्तता के अनुसार क्रमबद्ध सीरीज तैयार करें।`;
  if($('seriesTopicSource'))$('seriesTopicSource').value='MANUAL_TOPIC';
  status('आपका Manual Topic लागू कर दिया गया। बाकी विवरण आप बदल सकते हैं या AUTO-FILL से भर सकते हैं।');
 }
 async function liveSearch(autoApply=false){
  const q=$('seriesTopicInput')?.value.trim()||$('seriesPremise')?.value.trim()||$('seriesCategory')?.selectedOptions?.[0]?.text||'नई वेब सीरीज के लिए लोकप्रिय विषय';
  const box=$('seriesResearchResults');box.textContent='Live search provider से खोज जारी है…';
  try{
   const base=(window.UPS_CONFIG?.API_BASE_URL||'').replace(/\/$/,'');
   if(!base)throw new Error('Backend API URL सेट नहीं है।');
   const r=await fetch(`${base}/api/research/search?q=${encodeURIComponent(q)}&country=IN&lang=hi`);
   const data=await r.json();if(!r.ok)throw new Error(data.error||'Search provider unavailable');
   if(autoApply&&data.items?.length){const top=data.items[0];$('seriesTitle').value=top.title;$('seriesPremise').value=`Live web discovery: ${top.title}\\n${top.description||''}\\nSource: ${top.url}`;status('Live search से मिला पहला विषय AUTO में लागू हुआ। मूल स्रोतों से तथ्य जाँचें।');}
   box.innerHTML=`<p><b>स्रोत:</b> ${safe(data.provider)} · ${safe(data.items?.length||0)} परिणाम</p>`+
    (data.items||[]).map((x,i)=>`<div class="series-episode"><b>${i+1}. ${safe(x.title)}</b><p>${safe(x.description||'')}</p><a href="${safe(x.url)}" target="_blank" rel="noopener">स्रोत खोलें ↗</a><button class="btn secondary" type="button" data-topic-pick="${i}">इस विषय को चुनें</button></div>`).join('');
   box.querySelectorAll('[data-topic-pick]').forEach(b=>b.addEventListener('click',()=>{const x=data.items[Number(b.dataset.topicPick)];$('seriesTopicInput').value=x.title;$('seriesTitle').value=x.title;$('seriesPremise').value=`वेब रिसर्च से मिला विषय: ${x.title}\n${x.description||''}\nस्रोत: ${x.url}`;status('Live search result को Topic के रूप में लागू किया गया। तथ्य प्रकाशित करने से पहले मूल स्रोत जाँचें।');}));
  }catch(e){box.textContent=`Live Search उपलब्ध नहीं: ${e.message}. स्थानीय Library और Manual Topic उपलब्ध हैं।`;status('Live Search के लिए Backend पर BRAVE_SEARCH_API_KEY आवश्यक है।');}
 }

 function setMode(m){
  mode=m;
  [['seriesAutoMode','AUTO'],['seriesManualMode','MANUAL'],['seriesHybridMode','HYBRID']].forEach(([id,v])=>{
   const b=$(id); if(!b)return; const on=m===v;b.setAttribute('aria-pressed',String(on));b.classList.toggle('primary',on);b.classList.toggle('secondary',!on);
  });
  status(m+' MODE सक्रिय। '+(m==='AUTO'?'खाली फ़ील्ड सिस्टम भरेगा।':m==='MANUAL'?'सभी फ़ील्ड आप नियंत्रित करेंगे।':'आपके दिए इनपुट बाकी फ़ील्ड को दिशा देंगे।'));
 }
 function fill(force=false){
  const manual=$('seriesTopicInput')?.value.trim();
  const source=$('seriesTopicSource')?.value||'AUTO_RANDOM';
  const topic=manual&&(source==='MANUAL_TOPIC'||source==='HYBRID')?{title:manual,genre:$('seriesGenre').value||'General',premise:`${manual} विषय पर क्रमबद्ध सीरीज तैयार करें। तथ्यों/दावों को विश्वसनीय स्रोतों से सत्यापित करें।`,audience:'विषय के अनुरूप दर्शक'}:topics[selectedTopic%topics.length];
  const isBlank=id=>!$(id).value.trim();
  if(mode==='MANUAL'&&!force){status('MANUAL MODE में फ़ील्ड स्वयं भरें। AUTO-FILL दबाने पर भी खाली फ़ील्ड भरे जा सकते हैं।');return;}
  if(force||isBlank('seriesTitle'))$('seriesTitle').value=topic.title;
  if(force||isBlank('seriesPremise'))$('seriesPremise').value=topic.premise;
  if(force||isBlank('seriesAudience'))$('seriesAudience').value=topic.audience;
  if(force||mode==='AUTO')$('seriesGenre').value=topic.genre;
  if(topic.categoryId&&$('seriesCategory')){$('seriesCategory').value=topic.categoryId;$('seriesCategory').dispatchEvent(new Event('change'));if(topic.subcategory)$('seriesSubcategory').value=topic.subcategory;}
  if(force||isBlank('seriesEpisodes'))$('seriesEpisodes').value='5';
  if(force||isBlank('seriesDuration'))$('seriesDuration').value='1.5';
  if(force||isBlank('seriesLanguage'))$('seriesLanguage').value='Hindi';
  status('AUTO-FILL पूरा: विषय, शीर्षक, शैली, एपिसोड, अवधि, भाषा और दर्शक-वर्ग भर दिए गए। अब “सीरीज प्लान बनाएँ” दबाएँ।');
 }
 function suggest(){
  selectedTopic=(selectedTopic+1+Math.floor(Math.random()*(topics.length-1)))%topics.length;
  const t=topics[selectedTopic];
  $('seriesTitle').value=t.title;$('seriesPremise').value=t.premise;$('seriesGenre').value=t.genre;$('seriesAudience').value=t.audience;
  $('seriesEpisodes').value='5';$('seriesDuration').value='1.5';$('seriesLanguage').value='Hindi';
  status('नया विषय सुझाया गया और फ़ॉर्म में भर दिया गया।');
 }
 function build(){
  if(mode==='AUTO')fill(false);
  const title=$('seriesTitle').value.trim(), premise=$('seriesPremise').value.trim();
  if(!title||!premise){status('शीर्षक और मुख्य विषय जरूरी हैं। AUTO-FILL दबाएँ या दोनों फ़ील्ड भरें।');return;}
  const count=Math.max(2,Math.min(30,Number($('seriesEpisodes').value)||5));
  const duration=Math.max(0.5,Math.min(90,Number($('seriesDuration').value)||1.5));
  const genre=$('seriesGenre').value,category=$('seriesCategory')?.selectedOptions?.[0]?.text||genre,subcategory=$('seriesSubcategory')?.value||'',language=$('seriesLanguage').value,audience=$('seriesAudience').value.trim()||'सामान्य दर्शक';
  const episodes=Array.from({length:count},(_,i)=>({
   episode:i+1,title:`${title} — भाग ${i+1}`,
   purpose:`${premise} से जुड़ा क्रमिक पहलू ${i+1}`,
   learningObjective:`दर्शक इस भाग के बाद विषय का एक नया पहलू समझ सके।`,
   durationMinutes:duration,
   durationSeconds:Math.round(duration*60),
   sceneCount:10,
   scenes:Array.from({length:10},(_,sceneIndex)=>({
    scene:sceneIndex+1,
    startSeconds:Math.round((duration*60/10)*sceneIndex),
    endSeconds:Math.round((duration*60/10)*(sceneIndex+1)),
    purpose:sceneIndex===0?'Opening visual hook':sceneIndex===9?'Conclusion / next-episode bridge':`Story progression ${sceneIndex+1}`,
    imagePrompt:`[IMAGE PROMPT REQUIRED] ${title}; episode ${i+1}; scene ${sceneIndex+1}; preserve character, wardrobe, location and visual style continuity.`,
    videoPrompt:`[VIDEO PROMPT REQUIRED] ${title}; episode ${i+1}; scene ${sceneIndex+1}; duration ${Math.round(duration*6)} seconds; natural motion and temporal continuity.`,
    dialogue:'[DIALOGUE DRAFT REQUIRED]',
    continuityReference:sceneIndex===0?'Series Bible + previous episode ending':`Episode ${i+1}, scene ${sceneIndex}`
   })),
   beats:beats.map(([beat,direction])=>({beat,direction})),
   continuityNote:i===0?'सीरीज का केंद्रीय प्रश्न, संदर्भ और मुख्य शब्द स्थापित करें।':`भाग ${i} के सत्यापित निष्कर्ष से आगे बढ़ें; अनावश्यक पुनरावृत्ति न करें।`,
   cliffhanger:i===count-1?'समापन: मुख्य निष्कर्ष, सीख और आगे पढ़ने/जानने के स्रोत दें।':`अगले भाग (${i+2}) में आने वाले प्रश्न का संकेत दें।`
  }));
  current={schema:'ups-infinity.series-plan.v3',title,genre,category,subcategory,topicSource:$('seriesTopicSource')?.value||'AUTO_RANDOM',userTopic:$('seriesTopicInput')?.value||'',premise,language,audience,episodeCount:count,episodeDurationMinutes:duration,productionMode:mode,
   continuityRules:['नाम, तारीख, स्थान और तथ्य सभी एपिसोड में समान रखें।','किरदार/प्रस्तुतकर्ता की पहचान, पोशाक और दृश्य शैली का रिकॉर्ड रखें।','हर एपिसोड पिछले भाग से आगे बढ़े और नया मूल्य दे।','तथ्यात्मक दावों के साथ विश्वसनीय स्रोत और सत्यापन तिथि जोड़ें।','अंतिम एपिसोड में कहानी/सीख का उचित निष्कर्ष दें।'],
   seriesBible:{corePromise:premise},
   episodes,createdAt:new Date().toISOString(),status:'PLAN_ONLY', detailStatus:'PLAN_AND_SCRIPT_OUTLINE_ONLY',
   capabilityNote:'यह लोकल प्लान, 10-scene breakdown और prompt placeholders है। पूर्ण AI रिसर्च/डायलॉग/मीडिया जनरेशन और वास्तविक 10-second clips के लिए सुरक्षित Backend AI/Media Providers आवश्यक हैं।'
  };
  try{const prev=JSON.parse(localStorage.getItem('ups_infinity_series_plans')||'[]');localStorage.setItem('ups_infinity_series_plans',JSON.stringify([current,...prev].slice(0,50)));}catch(e){}
  render();status(`${count} एपिसोड का प्लान तैयार। यह प्लान/आउटलाइन है—अभी वीडियो रेंडर नहीं हुआ।`);
 }
 function render(){
  const c=current;if(!c)return;
  $('seriesOutput').innerHTML=`<div class="series-bible"><h3>${safe(c.title)}</h3><p><b>शैली:</b> ${safe(c.genre)} · <b>भाषा:</b> ${safe(c.language)} · <b>दर्शक:</b> ${safe(c.audience)} · <b>मोड:</b> ${safe(c.productionMode)}</p><p>${safe(c.premise)}</p><h4>Series Bible / Continuity Locks</h4><ul>${c.continuityRules.map(x=>`<li>${safe(x)}</li>`).join('')}</ul></div>`+
  c.episodes.map(e=>`<article class="series-episode"><h3>Episode ${e.episode}: ${safe(e.title)}</h3><p><b>उद्देश्य:</b> ${safe(e.learningObjective)}</p><p><b>अवधि:</b> ${safe(e.durationSeconds)} सेकंड · <b>Scenes:</b> ${safe(e.sceneCount)}</p><p><b>Continuity:</b> ${safe(e.continuityNote)}</p><details><summary>10-Scene Breakdown / Prompt Placeholders</summary><ol>${e.scenes.map(sc=>`<li><b>Scene ${sc.scene} (${sc.startSeconds}–${sc.endSeconds}s)</b><br>${safe(sc.purpose)}<br><small>${safe(sc.imagePrompt)}</small><br><small>${safe(sc.videoPrompt)}</small></li>`).join('')}</ol></details><ol>${e.beats.map(b=>`<li><b>${safe(b.beat)}:</b> ${safe(b.direction)}</li>`).join('')}</ol><p><b>समापन:</b> ${safe(e.cliffhanger)}</p></article>`).join('');
 }
 function scriptDraft(){
  if(!current){build();if(!current)return;}
  const lines=[`सीरीज: ${current.title}`,`शैली: ${current.genre}`,`विषय: ${current.premise}`,''];
  current.episodes.forEach(e=>{lines.push(`एपिसोड ${e.episode}: ${e.title}`,`अवधि: ${e.durationSeconds} सेकंड (${e.durationMinutes} मिनट)`,`उद्देश्य: ${e.learningObjective}`,'');e.beats.forEach((b,i)=>lines.push(`${i+1}. ${b.beat} — ${b.direction}`));lines.push(`समापन: ${e.cliffhanger}`,'','[डायलॉग/वॉयसओवर विस्तार के लिए AI Backend Provider आवश्यक]','');});
  download(lines.join('\n'),'ups-infinity-series-script-outline.txt','text/plain;charset=utf-8');status('एपिसोड-वाइज स्क्रिप्ट आउटलाइन TXT डाउनलोड हो गई।');
 }
 async function copy(){if(!current){status('पहले सीरीज प्लान बनाएँ।');return;}try{await navigator.clipboard.writeText(JSON.stringify(current,null,2));status('पूरा सीरीज JSON कॉपी हो गया।');}catch(e){status('Clipboard अनुमति नहीं मिली—JSON डाउनलोड करें।');}}
 function download(data,name,type){const a=document.createElement('a'),u=URL.createObjectURL(new Blob([data],{type}));a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1200);}
 function exportJson(){if(!current){status('पहले सीरीज प्लान बनाएँ।');return;}download(JSON.stringify(current,null,2),'ups-infinity-web-series-plan.json','application/json');}
 function exportText(){if(!current){status('पहले सीरीज प्लान बनाएँ।');return;}download([`SERIES: ${current.title}`,`GENRE: ${current.genre}`,`TOPIC: ${current.premise}`,...current.episodes.flatMap(e=>['',`EPISODE ${e.episode}: ${e.title}`,`OBJECTIVE: ${e.learningObjective}`,...e.beats.map((b,i)=>`${i+1}. ${b.beat}: ${b.direction}`),`ENDING: ${e.cliffhanger}`])].join('\n'),'ups-infinity-series-plan.txt','text/plain;charset=utf-8');}
 document.addEventListener('DOMContentLoaded',()=>{
  initLibrary();
  $('seriesLiveSearch')?.addEventListener('click',()=>liveSearch(false));$('seriesApplyManualTopic')?.addEventListener('click',applyUserTopic);$('seriesAutoDiscover')?.addEventListener('click',()=>liveSearch(true));
  $('seriesTopicSource')?.addEventListener('change',e=>{if(e.target.value==='MANUAL_TOPIC')status('अपना विषय लिखें और “लिखे Topic को लागू करें” दबाएँ।');});
  $('seriesAutoMode')?.addEventListener('click',()=>{setMode('AUTO');fill(false);});
  $('seriesManualMode')?.addEventListener('click',()=>setMode('MANUAL'));
  $('seriesHybridMode')?.addEventListener('click',()=>setMode('HYBRID'));
  $('seriesAutoFill')?.addEventListener('click',()=>{fill(true);if($('seriesTopicSource')?.value==='AUTO_RANDOM')liveSearch(true);});
  $('seriesSurprise')?.addEventListener('click',suggest);
  $('seriesClear')?.addEventListener('click',()=>{['seriesTitle','seriesPremise','seriesAudience'].forEach(id=>$(id).value='');$('seriesOutput').innerHTML='';current=null;status('फ़ॉर्म साफ़ हो गया। AUTO-FILL से फिर भरें।');});
  $('buildSeries')?.addEventListener('click',build);$('copySeries')?.addEventListener('click',copy);
  $('exportSeries')?.addEventListener('click',exportJson);$('seriesEpisodeScript')?.addEventListener('click',scriptDraft);$('seriesDownloadText')?.addEventListener('click',exportText);
  setMode('AUTO');
 });
})();