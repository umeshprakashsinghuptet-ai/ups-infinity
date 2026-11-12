const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');

test('master requirement register agrees with canonical 50 locks', () => {
  const doc = fs.readFileSync(path.join(root, 'docs/MASTER_REQUIREMENTS_REGISTER_HI.md'), 'utf8');
  const cfg = fs.readFileSync(path.join(root, 'backend/pipeline-config.js'), 'utf8');
  assert.match(doc, /Exactly 50 Master Locks/);
  assert.match(cfg, /const LOCKS = \[/);
});

test('PWA branding is UPS INFINITY', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'frontend/manifest.webmanifest'), 'utf8'));
  assert.match(manifest.name, /^UPS INFINITY/);
  assert.equal(manifest.short_name, 'UPS INFINITY');
});

test('primary frontend branding is UPS INFINITY', () => {
  const html = fs.readFileSync(path.join(root, 'frontend/index.html'), 'utf8');
  assert.match(html, /<title>UPS INFINITY/);
  assert.match(html, /<b>UPS INFINITY<\/b>/);
  assert.match(html, /compact-prompt-engine\.js/);
});

test('compact prompt engine validates and safely compacts Unicode text', () => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'frontend/compact-prompt-engine.js'), 'utf8'), context);
  const q = context.window.UPS_PROMPT_QUALITY;
  assert.equal(q.validate('नमस्ते').valid, true);
  assert.equal(q.validate('x'.repeat(901)).valid, false);
  assert.ok(q.count(q.compact('😀'.repeat(1000))) <= 900);
  assert.equal(q.validate(q.compact('x'.repeat(1200))).valid, true);
});

test('web series planner uses 90-second default and 10-scene breakdown', () => {
  const source = fs.readFileSync(path.join(root, 'frontend/web-series-engine.js'), 'utf8');
  assert.match(source, /seriesDuration'\)\.value='1\.5'/);
  assert.match(source, /sceneCount:10/);
  assert.match(source, /durationSeconds:Math\.round\(duration\*60\)/);
  assert.match(source, /imagePrompt:/);
  assert.match(source, /videoPrompt:/);
});

test('frontend brand name and developer credit are explicit', () => {
  const html = fs.readFileSync(path.join(root, 'frontend/index.html'), 'utf8');
  assert.match(html, /UPS INFINITY/);
  assert.match(html, /Developed by Umesh Prakash Singh/);
});


test('mobile design tokens provide readable type and touch targets', () => {
  const css = fs.readFileSync(path.join(root, 'frontend/styles.css'), 'utf8');
  assert.match(css, /--ui-font-body:clamp\(14px/);
  assert.match(css, /--ui-touch:44px/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /@media\(max-width:420px\)/);
});

test('keyboard focus visibility is defined', () => {
  const css = fs.readFileSync(path.join(root, 'frontend/styles.css'), 'utf8');
  assert.match(css, /focus-visible/);
  assert.match(css, /outline:2px solid var\(--cyan\)/);
});

test('all documented production modes are present in the main UI', () => {
  const html = fs.readFileSync(path.join(root, 'frontend/index.html'), 'utf8');
  for (const mode of ['AUTO', 'MANUAL', 'HYBRID']) assert.ok(html.includes(mode));
});

test('developer credit is consistent in PWA and main UI', () => {
  const html = fs.readFileSync(path.join(root, 'frontend/index.html'), 'utf8');
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'frontend/manifest.webmanifest'), 'utf8'));
  assert.match(html, /Developed by Umesh Prakash Singh/);
  assert.match(manifest.description, /Umesh Prakash Singh/);
});

test('all frontend local assets referenced by HTML exist', () => {
  const html = fs.readFileSync(path.join(root, 'frontend/index.html'), 'utf8');
  const refs = [...html.matchAll(/(?:src|href)=["']\.\/([^"'#?]+)["']/g)].map(m => m[1]);
  for (const ref of refs) assert.ok(fs.existsSync(path.join(root, 'frontend', ref)), `Missing frontend asset: ${ref}`);
});


test('GitHub CI workflow runs tests and full JavaScript syntax checks', () => {
  const workflow = fs.readFileSync(path.join(root, '.github/workflows/main.yml'), 'utf8');
  assert.match(workflow, /npm test/);
  assert.match(workflow, /npm run check/);
  assert.match(workflow, /node-version: "20"/);
});
