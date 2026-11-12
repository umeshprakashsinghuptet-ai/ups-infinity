const test=require('node:test');const assert=require('node:assert/strict');
const director=require('../frontend/production-director-engine.js');
test('90-second default creates 10 timed scenes and six timeline tracks',()=>{const p=director.build({answers:{topic:'भारतीय संविधान',duration:'90 Seconds'},mode:'HYBRID'});assert.equal(p.brief.totalSeconds,90);assert.equal(p.scenes.length,10);assert.equal(p.scenes[0].time.start,0);assert.equal(p.scenes.at(-1).time.end,90);assert.equal(p.timeline.tracks.length,6)});
test('AUTO, MANUAL and HYBRID modes are preserved',()=>{for(const mode of ['AUTO','MANUAL','HYBRID'])assert.equal(director.build({topic:'Test',mode}).mode,mode)});
test('scene prompts include identity and temporal continuity instructions',()=>{const p=director.build({topic:'Test',duration:'30 Seconds'});assert.ok(p.scenes.every(s=>s.video_prompt.includes('consistent identity')));assert.equal(p.director.identityLock,true);assert.equal(p.director.temporalConsistencyLock,true)});
test('export text labels plan as not rendered',()=>{const t=director.toText(director.build({topic:'Test'}));assert.match(t,/PLAN_ONLY_MEDIA_NOT_RENDERED/);assert.match(t,/SCENE 1/)});
test('duration is bounded and scene count stays in supported range',()=>{const p=director.build({duration:'99999 Seconds'});assert.ok(p.brief.totalSeconds<=3600);assert.ok(p.scenes.length>=10&&p.scenes.length<=12)});
