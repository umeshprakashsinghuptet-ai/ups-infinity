const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const required = [
  'frontend/index.html','frontend/styles.css','frontend/app.js','frontend/config.js',
  'backend/server.js','backend/package.json','backend/.env.example','render.yaml',
  '.github/workflows/main.yml','.github/workflows/static.yml',
  '.github/workflows/auto-extract-upload.yml','.github/scripts/extract_upload.py',
  'config/master-architecture.json','docs/FEATURE_STATUS.md','docs/FINAL_QA_SUMMARY.txt'
];
const missing = required.filter(p => !fs.existsSync(path.join(root,p)));
const pkg = JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const backend = JSON.parse(fs.readFileSync(path.join(root,'backend/package.json'),'utf8'));
const problems = [];
if (Number(process.versions.node.split('.')[0]) < 20) problems.push('Node.js 20+ is required.');
if (!pkg.scripts?.test || !pkg.scripts?.check) problems.push('Root test/check scripts are missing.');
if (!backend.scripts?.start) problems.push('Backend start script is missing.');
if (missing.length) problems.push(`Missing required files: ${missing.join(', ')}`);
if (problems.length) { console.error('PREFLIGHT FAIL\n- '+problems.join('\n- ')); process.exit(1); }
console.log(`PREFLIGHT PASS — ${required.length} required release files present; Node ${process.versions.node}.`);
