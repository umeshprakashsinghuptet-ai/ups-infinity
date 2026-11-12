const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cfg = require('../server/pipeline-config');
const engine = fs.readFileSync(path.join(__dirname,'../frontend/visual-quality-engine.js'),'utf8');
const brief = fs.readFileSync(path.join(__dirname,'../frontend/app.js'),'utf8');
test('exactly 12 engines, 100 unique modules and 25 unique locks',()=>{
 assert.equal(cfg.ENGINES.length,12); assert.equal(cfg.MODULES.length,100); assert.equal(cfg.LOCKS.length,25);
 assert.equal(new Set(cfg.MODULES).size,100); assert.equal(new Set(cfg.LOCKS).size,25);
});
test('visual masters and required locks are included',()=>{
 for(const x of ['IMAGE','VIDEO','THREE_D','HYBRID','Natural exposure','Identity','Temporal']) assert.match(engine,new RegExp(x,'i'));
 for(const x of ['VISUAL QUALITY MASTER ENGINE','IDENTITY PRESERVATION LOCK','TEMPORAL CONSISTENCY LOCK','AUTO ROUTING']) assert.ok(brief.includes(x));
});
test('package never claims external media rendering is already connected',()=>{
 const docs=fs.readFileSync(path.join(__dirname,'../docs/FEATURE_STATUS.md'),'utf8');
 assert.match(docs,/Not yet integrated|Live test required/i);
});
