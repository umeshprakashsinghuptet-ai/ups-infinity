const test = require('node:test');
const assert = require('node:assert/strict');

const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname,'..');
const cfgPromise = import('../backend/pipeline-config.js');
const registry = JSON.parse(fs.readFileSync(path.join(root,'config/master-architecture.json'),'utf8'));
test('architecture counts are exact',async()=>{const cfg=await cfgPromise;assert.equal(cfg.ENGINES.length,12);assert.equal(cfg.MODULES.length,100);assert.equal(cfg.LOCKS.length,50);assert.equal(registry.commands.length,100);assert.equal(registry.qa_departments.length,20);assert.equal(registry.initial_profiles.length,10)});
test('architecture names are unique',async()=>{const cfg=await cfgPromise;for(const a of [cfg.ENGINES,cfg.MODULES,cfg.LOCKS,registry.commands,registry.qa_departments])assert.equal(new Set(a).size,a.length)});
test('web series engine is included and linked',()=>{const html=fs.readFileSync(path.join(root,'frontend/index.html'),'utf8');const js=fs.readFileSync(path.join(root,'frontend/web-series-engine.js'),'utf8');assert.match(html,/data-page="series"/);assert.match(html,/id="page-series"/);assert.match(html,/web-series-engine\.js/);const app=fs.readFileSync(path.join(root,'frontend/app.js'),'utf8');assert.match(app,/series:'Web Series Studio'/);assert.match(js,/continuityRules/);assert.match(js,/PLAN_ONLY/)});
test('backend sanitizer uses control-character range and bounded length',()=>{const server=fs.readFileSync(path.join(root,'backend/server.js'),'utf8');assert.ok(server.includes('safeText='));assert.ok(server.includes('u0000'));assert.ok(server.includes('u001F'));assert.ok(server.includes('u007F'));assert.ok(server.includes('slice(0,max)'))});
