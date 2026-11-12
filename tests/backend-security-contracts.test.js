const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const server=fs.readFileSync(path.join(root,'backend/server.js'),'utf8');
const env=fs.readFileSync(path.join(root,'backend/.env.example'),'utf8');

test('authentication routes require a configured signing secret',()=>{
  assert.match(server,/if\(!JWT_SECRET\)return res\.status\(503\)/);
  assert.match(server,/JWT_SECRET_NOT_CONFIGURED/);
});
test('authentication has a dedicated brute-force rate limit',()=>{
  assert.match(server,/app\.use\('\/api\/auth\/',rateLimit\(/);
  assert.match(server,/15\*60_000,limit:10/);
});
test('password verification uses constant-time comparison with length guard',()=>{
  assert.match(server,/expected\.length!==actual\.length\|\|!crypto\.timingSafeEqual\(actual,expected\)/);
});
test('passcode is restricted to 6 through 12 numeric digits',()=>{
  assert.equal((server.match(/\^\\d\{6,12\}\$/g)||[]).length>=2,true);
});
test('project read/update/delete queries are owner scoped',()=>{
  assert.match(server,/store\.projects\.filter\(p=>p\.userId===req\.user\.id\)/);
  assert.match(server,/x\.id===req\.params\.id&&x\.userId===req\.user\.id/);
});
test('series read/write queries are owner scoped',()=>{
  assert.match(server,/store\.series\.filter\(s=>s\.userId===req\.user\.id\)/);
  assert.match(server,/x\.id===req\.params\.id&&x\.userId===req\.user\.id/);
});
test('billing refuses to claim checkout is implemented',()=>{
  assert.match(server,/Checkout adapter not implemented; no payment was created/);
  assert.match(server,/res\.status\(501\)/);
});
test('provider secrets are documented as backend-only configuration',()=>{
  assert.match(env,/JWT_SECRET/);
  assert.match(env,/GEMINI_API_KEY/);
  assert.match(env,/BRAVE_SEARCH_API_KEY/);
});
test('JSON store declares private file permissions',()=>{
  assert.match(server,/mode:0o600/);
});
test('request payload size is bounded',()=>{
  assert.match(server,/express\.json\(\{limit:'1mb'\}\)/);
});
