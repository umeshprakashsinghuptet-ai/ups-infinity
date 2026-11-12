const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'frontend/index.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'frontend/app.js'), 'utf8');
const visual = fs.readFileSync(path.join(root, 'frontend/visual-quality-engine.js'), 'utf8');
const server = fs.readFileSync(path.join(root, 'backend/server.js'), 'utf8');
test('responsive shell references exactly one app entry and visual engine', () => {
  assert.match(html, /name="viewport"/);
  assert.match(html, /visual-quality-engine\.js/);
  assert.match(html, /app\.js/);
  assert.equal((html.match(/app\.js/g)||[]).length, 1);
});
test('core studios and guided workflow are represented', () => {
  for (const id of ['home','search','content','poster','video','education','media','business','personal','projects','settings']) assert.match(html, new RegExp(`page-${id}`));
  assert.match(html, /एक समय में एक जरूरी सवाल/);
  assert.match(js, /VISUAL QUALITY MASTER ENGINE/);
});
test('visual quality routing includes four masters and identity/temporal locks', () => {
  for (const key of ['IMAGE','VIDEO','THREE_D','HYBRID','identity','temporal','function route']) assert.ok(visual.includes(key));
});
test('backend has health, capability, search and text generation routes', () => {
  for (const route of ['/api/health','/api/capabilities','/api/search','/api/trends','/api/ai/generate']) assert.ok(server.includes(route));
});
test('feature boundaries are documented honestly', () => {
  const status = fs.readFileSync(path.join(root, 'docs/FEATURE_STATUS.md'), 'utf8');
  assert.match(status, /NOT IMPLEMENTED/);
  assert.match(status, /LIVE TEST REQUIRED/);
  assert.match(status, /Admin dashboard/);
});
