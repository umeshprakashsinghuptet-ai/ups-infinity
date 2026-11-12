const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');

test('ZIP auto-extract workflow and safe extraction helper are included', () => {
  const workflow = read('.github/workflows/auto-extract-upload.yml');
  const helper = read('.github/scripts/extract_upload.py');
  assert.match(workflow, /UPS_INFINITY_PROJECT\.zip/);
  assert.match(workflow, /contents: write/);
  assert.match(workflow, /PurePosixPath/);
  assert.match(workflow, /Symbolic links are not allowed/);
  assert.match(helper, /UPS_INFINITY_AI_CREATOR_PRODUCTION_HUB/);
  assert.match(helper, /Unsafe ZIP path/);
  assert.match(helper, /Symbolic links are not allowed/);
});

test('Render backend blueprint declares health check, persistent data and generated JWT secret', () => {
  const yaml = read('render.yaml');
  assert.match(yaml, /rootDir: backend/);
  assert.match(yaml, /healthCheckPath: \/api\/health/);
  assert.match(yaml, /mountPath: \/var\/data/);
  assert.match(yaml, /key: JWT_SECRET\n\s+generateValue: true/);
});

test('environment templates never contain live provider secrets', () => {
  const content = read('backend/.env.example');
  assert.match(content, /GEMINI_API_KEY=/);
  assert.match(content, /BRAVE_SEARCH_API_KEY=/);
  assert.match(content, /JWT_SECRET=/);
  assert.doesNotMatch(content, /AIza[0-9A-Za-z_-]{20,}/);
  assert.match(read('.env.example'), /backend\/.env.example/);
  assert.match(read('.gitignore'), /^\.env$/m);
  assert.match(read('.gitignore'), /^backend\/\.env$/m);
});

test('deployment instructions clearly separate Pages frontend from backend server', () => {
  const doc = read('docs/DEPLOYMENT_ENV_MATRIX_HI.md');
  assert.match(doc, /GitHub Pages hosts only `frontend\//);
  assert.match(doc, /Render/);
  assert.match(doc, /service-role/);
  assert.match(doc, /package-lock\.json/);
});
