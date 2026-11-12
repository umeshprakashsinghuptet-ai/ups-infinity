/* Local draft renderer: browser Canvas + MediaRecorder. No external media claims. */
(function(){
 'use strict';
 const $=id=>document.getElementById(id);
 let recorder=null,stream=null,raf=0,stopped=false,chunks=[];
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 function wrap(ctx,text,maxWidth){
  const words=String(text).split(/\s+/),lines=[];let line='';
  for(const word of words){const test=line?line+' '+word:word;if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=word}else line=test}
  if(line)lines.push(line);return lines;
 }
 function drawFrame(ctx,w,h,title,scenes,index,progress){
  const scene=scenes[index]||title;const g=ctx.createLinearGradient(0,0,w,h);
  g.addColorStop(0,'#101b3b');g.addColorStop(.55,'#172554');g.addColorStop(1,'#070b16');
  ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  const pulse=.5+.5*Math.sin(progress*Math.PI*8);
  ctx.globalAlpha=.12;ctx.fillStyle='#8ab4ff';ctx.beginPath();ctx.arc(w*.82,h*.22,Math.min(w,h)*(.12+pulse*.025),0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
  ctx.fillStyle='#a5b4fc';ctx.font=`700 ${Math.round(w*.035)}px Arial,sans-serif`;ctx.fillText('UPS INFINITY',w*.08,h*.105);
  ctx.fillStyle='#64748b';ctx.fillRect(w*.08,h*.13,w*.84,2);
  ctx.textAlign='left';ctx.fillStyle='#c7d2fe';ctx.font=`600 ${Math.round(w*.035)}px Arial,sans-serif`;ctx.fillText(`SCENE ${String(index+1).padStart(2,'0')} / ${String(scenes.length).padStart(2,'0')}`,w*.08,h*.24);
  const size=Math.round(w*.068);ctx.font=`700 ${size}px "Noto Sans Devanagari",Arial,sans-serif`;ctx.fillStyle='#ffffff';
  const lines=wrap(ctx,scene,w*.82);const lineH=size*1.48;const total=lines.length*lineH;let y=(h-total)/2;
  lines.forEach(line=>{ctx.fillText(line,w*.08,y);y+=lineH});
  ctx.fillStyle='#94a3b8';ctx.font=`${Math.round(w*.027)}px Arial,sans-serif`;ctx.fillText(title.slice(0,70),w*.08,h*.89);
  ctx.fillStyle='#334155';ctx.fillRect(w*.08,h*.925,w*.84,5);ctx.fillStyle='#93c5fd';ctx.fillRect(w*.08,h*.925,w*.84*clamp(progress,0,1),5);
  ctx.fillStyle='#cbd5e1';ctx.font=`${Math.round(w*.023)}px Arial,sans-serif`;ctx.fillText('DRAFT RENDER · LOCAL BROWSER',w*.08,h*.96);
 }
 async function render(){
  const start=$('renderStart'),stop=$('renderStop'),status=$('renderStatus'),progress=$('renderProgress'),preview=$('renderPreview'),link=$('renderDownload');
  if(!window.MediaRecorder){status.textContent='इस ब्राउज़र में MediaRecorder उपलब्ध नहीं है। Chrome के नवीनतम संस्करण में प्रयास करें।';return}
  const scenes=$('renderScript').value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  if(!scenes.length){status.textContent='कम-से-कम एक सीन लिखें।';return}
  const duration=clamp(Number($('renderDuration').value)||30,10,60),fps=clamp(Number($('renderFps').value)||30,24,30),ratio=$('renderRatio').value;
  const w=ratio==='landscape'?1280:ratio==='square'?1080:720,h=ratio==='landscape'?720:ratio==='square'?1080:1280;
  const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d');
  const mime=['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'].find(t=>MediaRecorder.isTypeSupported(t));
  if(!mime){status.textContent='इस डिवाइस पर समर्थित WebM codec नहीं मिला।';return}
  chunks=[];stopped=false;start.disabled=true;stop.disabled=false;link.hidden=true;preview.style.display='none';progress.value=0;
  stream=canvas.captureStream(fps);recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:4500000});
  recorder.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data)};
  recorder.onerror=()=>{status.textContent='रेंडर में त्रुटि हुई। ब्राउज़र/डिवाइस की memory जाँचें।';cleanup()};
  const blobPromise=new Promise((resolve,reject)=>{recorder.onstop=()=>{const blob=new Blob(chunks,{type:mime});resolve(blob)};recorder.onerror=e=>reject(e.error||new Error('MediaRecorder failed'))});
  recorder.start(250);const began=performance.now(),total=duration*1000;let last=0;
  const frame=now=>{
   if(stopped)return;const elapsed=now-began,p=clamp(elapsed/total,0,1),idx=Math.min(scenes.length-1,Math.floor(p*scenes.length));
   drawFrame(ctx,w,h,$('renderTitle').value||'UPS INFINITY',scenes,idx,p);progress.value=Math.round(p*100);
   status.textContent=`रेंडर हो रहा है… ${Math.round(p*100)}%`;
   if(elapsed>=total){recorder.stop();return}raf=requestAnimationFrame(frame);last=now;
  };
  drawFrame(ctx,w,h,$('renderTitle').value||'UPS INFINITY',scenes,0,0);raf=requestAnimationFrame(frame);
  try{
   const blob=await blobPromise;const url=URL.createObjectURL(blob);preview.src=url;preview.style.display='block';link.href=url;link.download='ups-infinity-video-draft.webm';link.textContent='⬇ वीडियो ड्राफ्ट डाउनलोड करें (WebM)';link.hidden=false;status.textContent=`रेंडर पूरा — ${(blob.size/1024/1024).toFixed(2)} MB WebM draft. यह text-scene video है, AI footage नहीं।`;progress.value=100;
  }catch(e){status.textContent='रेंडर असफल: '+e.message}
  cleanup();
 }
 function cleanup(){cancelAnimationFrame(raf);if(stream)stream.getTracks().forEach(t=>t.stop());stream=null;$('renderStart').disabled=false;$('renderStop').disabled=true}
 $('renderStart')?.addEventListener('click',render);
 $('renderStop')?.addEventListener('click',()=>{stopped=true;cancelAnimationFrame(raf);if(recorder&&recorder.state!=='inactive')recorder.stop()});
})();
