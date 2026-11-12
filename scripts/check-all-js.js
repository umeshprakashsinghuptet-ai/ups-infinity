#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const skip = new Set(['node_modules', '.git']);
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (skip.has(entry.name)) return [];
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : (entry.isFile() && full.endsWith('.js') ? [full] : []);
  });
}
const files = walk(root);
let failed = 0;
for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    failed++;
    process.stderr.write(`FAIL ${path.relative(root, file)}\n${result.stderr}`);
  }
}
console.log(`JavaScript syntax: ${files.length - failed}/${files.length} PASS`);
if (failed) process.exitCode = 1;
