const express = require("express");
const helmet = require("helmet");
const path = require("path");
const fs = require("fs");
const os = require("os");
const { spawn, spawnSync } = require("child_process");
const multer = require("multer");
let ffmpegPath = null;try{ffmpegPath = require("ffmpeg-static");}catch{}ffmpegPath = ffmpegPath || process.env.FFMPEG_PATH || "ffmpeg";
const ffmpegAvailable = (()=>{try{return spawnSync(ffmpegPath,["-version"],{stdio:"ignore"}).status===0;}catch{return false;}})();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(helmet({contentSecurityPolicy:false}));
app.use(express.json({limit:"20mb"}));
app.use(express.static(path.join(__dirname,"..","public")));
const upload = multer({dest:path.join(os.tmpdir(),"ups-v10-uploads"),limits:{fileSize:1024*1024*1024,files:40}});
const capabilities = {
 dashboard:true, projectLocalSave:true, projectSnapshotRestore:true, interactiveTimelineEditing:true, timelineUndoRedo:true, timelineSplitDuplicate:true, timelineDragReorder:true, timelineRippleDelete:true, timelineEDLExport:true, storyboardToTimeline:true, captionTimelineSync:true, localAudioWaveformPreview:true, localPreviewGainControl:true, jsonBackupImportExport:true, promptStudio:true, storyboardBuilder:true,
 synchronizedMultiTrackPlayback:true, ffmpegMultiTrackRender:ffmpegAvailable, mp4Export:ffmpegAvailable, videoAudioTrackMixing:ffmpegAvailable,
 continuityLock:true, captionsSrt:true, browserSpeechRecognition:"browser/device dependent", emailComposer:true, assetLibraryLocal:true, transitionPlanner:true, qualityProfiles:true,
 cloudAuth:false, cloudDatabase:false, aiImageGeneration:false, aiVideoGeneration:false, voiceSynthesis:false, lipSync:false, trendingResearch:false, cloudAssetStorage:false
};
app.get("/api/health",(_req,res)=>res.json({ok:true,app:"UPS CREATOR STUDIO",version:"11.0.0",ffmpegAvailable}));
app.get("/api/capabilities",(_req,res)=>res.json(capabilities));
app.get("/api/config",(_req,res)=>res.json({brand:"UPS CREATOR STUDIO",product:"ULTIMATE AUTO-PILOT FILMMAKER PRO MAX INFINITY",developer:"Developed by Umesh Prakash Singh",modes:["AUTO","HYBRID","DIRECTOR"],qualityPolicy:"Best-fit quality supported by connected provider and renderer"}));
function runFfmpeg(args){return new Promise((resolve,reject)=>{const proc=spawn(ffmpegPath,args,{stdio:["ignore","ignore","pipe"]});let err="";proc.stderr.on("data",d=>{err+=d.toString();if(err.length>12000)err=err.slice(-12000);});proc.on("error",reject);proc.on("close",code=>code===0?resolve():reject(new Error(err||`FFmpeg exited ${code}`)));});}
app.post("/api/render/mp4",upload.array("media",40),async(req,res)=>{
 const files=req.files||[];let tempOut="";
 try{
  if(!ffmpegAvailable)throw new Error("FFmpeg binary is unavailable on this host. Install ffmpeg-static or provide FFMPEG_PATH/system FFmpeg.");
  const timeline=JSON.parse(req.body.timeline||"{}");const clips=Array.isArray(timeline.clips)?timeline.clips:[];
  if(!clips.length)throw new Error("Timeline is empty.");
  const byName=new Map(files.map(f=>[f.originalname,f]));
  const trackState=(()=>{try{return JSON.parse(req.body.trackState||"{}");}catch{return {};}})();
  const hasSolo=Object.values(trackState).some(x=>x&&x.solo);
  const enabled=track=>!trackState[track]?.muted&&(!hasSolo||!!trackState[track]?.solo);
  const videoClips=clips.filter(c=>c.track==="Video"&&enabled(c.track)).sort((a,b)=>Number(a.start)-Number(b.start));
  const audioClips=clips.filter(c=>["Voice","Music","Sound Effect"].includes(c.track)&&enabled(c.track));
  const used=[...videoClips,...audioClips];
  const missing=[...new Set(used.filter(c=>!byName.has(c.sourceName)).map(c=>c.sourceName||c.label))];
  if(missing.length)throw new Error("इन Timeline clips की media files upload में नहीं मिलीं: "+missing.join(", "));
  const width=Math.max(320,Math.min(1920,Number(req.body.width)||1080));const height=Math.round(width*9/16);const fps=Math.max(12,Math.min(60,Number(req.body.fps)||30));
  const duration=Math.max(0.5,...clips.map(c=>(Number(c.start)||0)+(Number(c.duration)||0)));
  const inputs=[];const inputIndex=new Map();
  for(const c of used){const f=byName.get(c.sourceName);if(!inputIndex.has(f.path)){inputIndex.set(f.path,inputs.length);inputs.push(f.path);}}
  const args=["-y","-f","lavfi","-i",`color=c=black:s=${width}x${height}:r=${fps}:d=${duration}`];
  inputs.forEach(file=>args.push("-i",file));
  const filters=[];let current="basev";filters.push(`[0:v]format=yuv420p[${current}]`);
  videoClips.forEach((c,i)=>{const f=byName.get(c.sourceName),idx=inputIndex.get(f.path)+1,st=Math.max(0,Number(c.sourceIn)||0),dur=Math.max(.1,Number(c.duration)||1),at=Math.max(0,Number(c.start)||0),next=`v${i}`;filters.push(`[${idx}:v]trim=start=${st}:duration=${dur},setpts=PTS-STARTPTS,scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=${fps},format=yuva420p[vc${i}]`);filters.push(`[${current}][vc${i}]overlay=0:0:enable='between(t,${at},${at+dur})'[${next}]`);current=next;});
  filters.push(`[${current}]format=yuv420p[outv]`);
  const trackGains=(()=>{try{return JSON.parse(req.body.trackGains||"{}");}catch{return {};}})();
  const audioLabels=[];audioClips.forEach((c,i)=>{const f=byName.get(c.sourceName),idx=inputIndex.get(f.path)+1,st=Math.max(0,Number(c.sourceIn)||0),dur=Math.max(.1,Number(c.duration)||1),at=Math.max(0,Number(c.start)||0),baseGain=Number(trackGains[c.track]??100),gain=Math.max(0,Math.min(2,(Number(c.gain??100)/100)*(baseGain/100))),lab=`a${i}`;filters.push(`[${idx}:a]atrim=start=${st}:duration=${dur},asetpts=PTS-STARTPTS,volume=${gain},adelay=${Math.round(at*1000)}|${Math.round(at*1000)}[${lab}]`);audioLabels.push(`[${lab}]`);});
  if(audioLabels.length){filters.push(`${audioLabels.join("")}amix=inputs=${audioLabels.length}:duration=longest:dropout_transition=2,alimiter=limit=0.95[outa]`);}else{filters.push(`anullsrc=r=48000:cl=stereo,atrim=duration=${duration}[outa]`);}
  tempOut=path.join(os.tmpdir(),`ups-render-${Date.now()}.mp4`);
  args.push("-filter_complex",filters.join(";"),"-map","[outv]","-map","[outa]","-t",String(duration),"-c:v","libx264","-preset","veryfast","-crf","20","-pix_fmt","yuv420p","-c:a","aac","-b:a","192k","-movflags","+faststart",tempOut);
  await runFfmpeg(args);
  res.download(tempOut,"UPS_CREATOR_STUDIO_FINAL.mp4",err=>{try{fs.unlinkSync(tempOut);}catch{};files.forEach(f=>{try{fs.unlinkSync(f.path);}catch{}});});
 }catch(err){files.forEach(f=>{try{fs.unlinkSync(f.path);}catch{}});if(tempOut){try{fs.unlinkSync(tempOut);}catch{}};res.status(400).json({ok:false,error:err.message});}
});
app.listen(PORT,()=>console.log(`UPS Creator Studio V11 Infinity running on ${PORT}`));
