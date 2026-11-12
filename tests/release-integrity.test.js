const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

test('release-critical files exist', () => {
  for (const p of ['README.md','README_HINDI.md','frontend/index.html','frontend/app.js','frontend/styles.css','frontend/visual-quality-engine.js','frontend/web-series-engine.js','backend/server.js','backend/pipeline-config.js','backend/.env.example','config/master-architecture.json','docs/QA_CHECKLIST.md','android/README.md']) {
    assert.ok(fs.existsSync(path.join(root,p)), `Missing ${p}`);
  }
});

test('frontend local script and stylesheet references resolve', () => {
  const html = read('frontend/index.html');
  for (const [, ref] of html.matchAll(/(?:src|href)=["']\.\/(?!https?:)([^"']+)["']/g)) {
    if (ref.startsWith('#')) continue;
    assert.ok(fs.existsSync(path.join(root,'frontend',ref)), `Missing frontend asset ${ref}`);
  }
});

test('frontend HTML has no duplicate IDs', () => {
  const html = read('frontend/index.html');
  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m=>m[1]);
  assert.equal(ids.length, new Set(ids).size, 'Duplicate HTML id detected');
});

test('backend reports unavailable provider features honestly', () => {
  const server = read('backend/server.js');
  assert.match(server, /imageGeneration:false/);
  assert.match(server, /videoGeneration:false/);
  assert.match(server, /mp4Rendering:false/);
  assert.match(server, /socialPublishing:false/);
});

test('public frontend config contains no known server-secret variable names', () => {
  const config = read('frontend/config.js');
  assert.doesNotMatch(config, /SERVICE_ROLE_KEY|GEMINI_API_KEY|OPENAI_API_KEY|STRIPE_SECRET_KEY/);
});
