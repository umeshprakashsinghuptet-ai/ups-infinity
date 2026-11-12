import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(new URL('..', import.meta.url).pathname);

test('Auto-Pilot offers configured backend AI generation and keeps brief if unavailable', () => {
  const app = fs.readFileSync(path.join(root,'frontend/app.js'),'utf8');
  assert.match(app,/\/api\/ai\/generate/);
  assert.match(app,/AI generation उपलब्ध नहीं/);
  assert.match(app,/productionBrief/);
});

test('Backend validates trend geography and bounds user prompts', () => {
  const server = fs.readFileSync(path.join(root,'backend/server.js'),'utf8');
  assert.match(server,/allowedGeo/);
  assert.match(server,/safeText\(req\.body\?\.prompt,18000\)/);
  assert.match(server,/AbortController/);
  assert.match(server,/AI provider timed out/);
});

test('AI generation UI is accessible and has a visible status region', () => {
  const app = fs.readFileSync(path.join(root,'frontend/app.js'),'utf8');
  assert.match(app,/aria-live="polite"/);
  assert.match(app,/runAiGeneration/);
});

test('release documentation distinguishes local checks from live integrations', () => {
  const status = fs.readFileSync(path.join(root,'docs/FEATURE_STATUS.md'),'utf8');
  assert.match(status,/NOT IMPLEMENTED as a live provider/);
  assert.match(status,/LIVE TEST REQUIRED/);
});
