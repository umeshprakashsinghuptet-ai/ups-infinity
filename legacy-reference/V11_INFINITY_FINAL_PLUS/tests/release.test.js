const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, '../public/app.js'), 'utf8');
const server = fs.readFileSync(path.join(__dirname, '../server/index.js'), 'utf8');

test('release metadata and responsive document shell are present', () => {
  assert.match(html, /<html lang="hi">/);
  assert.match(html, /name="viewport"/);
  assert.match(html, /UPS Creator Studio V11 Infinity/);
  assert.match(html, /styles\.css/);
  assert.match(html, /app\.js/);
});

test('visual reference lab exposes the complete planning and transcript inputs', () => {
  for (const id of ['visualref','vrIntent','vrCategory','vrTopic','vrRatio','vrDuration','vrStyle','vrLanguage','vrBuild','vrAuto','vrPlan','vrCompact','vrUrl','vrMedia','vrTranscript','vrAnalyze','vrAnalysis','vrCopyScript']) {
    assert.match(html, new RegExp(`id=["']${id}["']`), `missing UI element: ${id}`);
  }
  assert.match(js, /vrMaster\.slice\(0,\s*900\)/, 'compact prompt must be capped at 900 chars');
  assert.match(js, /Reference segment/);
  assert.match(js, /Hindi dialogue \/ script/);
});

test('workflow dock and all main workspace sections are wired', () => {
  const pages = ['dashboard','profiles','gkstudio','keyframes','visualref','workflow','prompt','storyboard','continuity','transitions','quality','speech','captions','assets','editor','email','monitor','qa'];
  for (const id of pages) assert.match(html, new RegExp(`<section id="${id}"`), `missing page: ${id}`);
  for (const id of ['dockBack','dockNext','dockSave','stepBack','stepNext','copyCurrentOutput']) assert.match(html, new RegExp(`id="${id}"`));
  assert.match(js, /dockNext/);
  assert.match(js, /dockBack/);
});

test('backend declares health, capability and MP4 render routes', () => {
  assert.match(server, /app\.get\("\/api\/health"/);
  assert.match(server, /app\.get\("\/api\/capabilities"/);
  assert.match(server, /app\.post\("\/api\/render\/mp4"/);
  assert.match(server, /ffmpegAvailable/);
});

test('client-side code does not claim URL transcription or AI generation is connected', () => {
  assert.match(js, /URL से स्वतः transcript इस build में उपलब्ध नहीं/);
  assert.match(html, /वास्तविक AI-generated images नहीं/);
  assert.match(server, /aiImageGeneration:false/);
  assert.match(server, /aiVideoGeneration:false/);
});
