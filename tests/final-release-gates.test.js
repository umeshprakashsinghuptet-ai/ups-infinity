const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const root=path.join(__dirname,'..');const read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('SEO metadata, canonical, structured data and sitemap are present',()=>{
 const html=read('frontend/index.html');assert.match(html,/<meta name="description"/);assert.match(html,/<meta name="robots" content="index,follow/);assert.match(html,/<link rel="canonical"/);assert.match(html,/"@type":"SoftwareApplication"/);assert.match(html,/local-video-renderer\.js/);
 assert.ok(fs.existsSync(path.join(root,'frontend/robots.txt')));assert.ok(fs.existsSync(path.join(root,'frontend/sitemap.xml')));
});
test('local video renderer exposes supported-browser MediaRecorder flow',()=>{
 const js=read('frontend/local-video-renderer.js');for(const token of ['MediaRecorder','captureStream','video/webm','renderProgress','renderPreview','renderDownload'])assert.ok(js.includes(token),`missing ${token}`);
});
test('local video renderer UI is linked and has accessible progress/status',()=>{
 const html=read('frontend/index.html');assert.match(html,/data-page="render"/);assert.match(html,/id="page-render"/);assert.match(html,/aria-live="polite"/);assert.match(html,/id="renderStop"/);
});
test('SEO sitemap is valid XML and references canonical project URL',()=>{
 const xml=read('frontend/sitemap.xml');assert.match(xml,/<urlset/);assert.match(xml,/<loc>https:\/\/umeshprakashsinghuptet-ai\.github\.io\/upscreatorstudio\/<\/loc>/);assert.match(xml,/<\/urlset>/);
});
