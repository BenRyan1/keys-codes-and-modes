// Fails if functions/apps/[[path]].js drifts from my-apps.html or the apps/ folder.
// Run:  node tools/check-app-manifest.mjs
import fs from 'node:fs';
import path from 'node:path';
import { APPS } from '../functions/apps/[[path]].js';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const launcher = fs.readFileSync(path.join(root, 'my-apps.html'), 'utf8');
const problems = [];

const entries = [...launcher.matchAll(/id:\s*'([^']+)',(?:\s*featured:[^\n]*\n)?\s*file:\s*(?:'([^']+)'|CONSOLE_URL[^\n]*)/g)];
const files = fs.readdirSync(path.join(root, 'apps')).filter(f => f.endsWith('.html')).map(f => f.slice(0, -5));

for (const [, id, file] of entries) {
  if (!file || /^https?:/.test(file)) continue;
  const key = path.basename(file, '.html');
  if (!APPS[key]) { problems.push(`launcher app "${id}" -> apps/${key}.html is missing from APPS`); continue; }
}
for (const key of Object.keys(APPS)) {
  if (!files.includes(key)) problems.push(`APPS lists "${key}" but apps/${key}.html does not exist`);
}
for (const key of files) {
  if (!APPS[key]) problems.push(`apps/${key}.html exists but is not in APPS (it will be DENIED to everyone)`);
  const src = fs.readFileSync(path.join(root, 'apps', key + '.html'), 'utf8');
  const m = src.match(/KCM_APP_ID\s*=\s*(\[[^\]]*\]|"[^"]*"|'[^']*')/);
  if (m && APPS[key]) {
    const ids = [...m[1].matchAll(/["']([^"']+)["']/g)].map(x => x[1]);
    if (!APPS[key].free && !ids.includes(APPS[key].id)) problems.push(`apps/${key}.html KCM_APP_ID ${ids} does not include APPS id "${APPS[key].id}"`);
  }
}
// free section of the launcher must be free on the server
const freeBlock = launcher.slice(launcher.indexOf('const FREE_APPS'), launcher.indexOf('];', launcher.indexOf('const FREE_APPS')));
for (const [, file] of freeBlock.matchAll(/file:\s*'(apps\/[^']+)'/g)) {
  const key = path.basename(file, '.html');
  if (!APPS[key]?.free) problems.push(`launcher lists apps/${key}.html as free but APPS says paid`);
}
if (problems.length) { console.error('MANIFEST PROBLEMS:\n- ' + problems.join('\n- ')); process.exit(1); }
console.log(`manifest OK: ${Object.keys(APPS).length} apps, ${Object.values(APPS).filter(a => a.free).length} free`);
