// Runs js/kcm-session.js against both token shapes. Run:  node tools/test-session-cookie.mjs
import fs from 'node:fs';
import vm from 'node:vm';
let fails = 0;
const ok = (n, c) => { if (!c) { fails++; console.error('FAIL', n); } else console.log('ok  ', n); };
const src = fs.readFileSync(new URL('../js/kcm-session.js', import.meta.url), 'utf8');

function load(tokenInStorage) {
  const jar = { value: '' };
  const win = {
    document: { get cookie() { return jar.value; }, set cookie(v) { jar.value = v; } },
    location: { protocol: 'https:' },
    localStorage: { getItem: k => (k === 'kcm_session_token' ? tokenInStorage : null) },
  };
  vm.runInNewContext(src, { window: win, document: win.document, location: win.location, localStorage: win.localStorage, atob: s => Buffer.from(s, 'base64').toString('binary'), Date, Math, Number, String, JSON, isFinite, encodeURIComponent });
  return { win, jar };
}
const maxAge = v => Number((/Max-Age=(-?\d+)/.exec(v) || [])[1]);
const inDays = d => Date.now() + d * 864e5;
const b64 = o => Buffer.from(JSON.stringify(o)).toString('base64url');
const sig = 'z'.repeat(43);

let { win, jar } = load(null);
win.KCMSession.set(b64({ tier: 'demo', exp: Math.floor(inDays(172) / 1000) }) + '.' + sig);
ok('new format, exp in seconds: cookie set ~172d', /^kcm_session=/.test(jar.value) && Math.abs(maxAge(jar.value) - 172 * 86400) < 120);
ok('cookie is Secure + SameSite=Lax + Path=/', /Secure/.test(jar.value) && /SameSite=Lax/.test(jar.value) && /Path=\//.test(jar.value));
({ win, jar } = load(null));
win.KCMSession.set(b64({ tier: 'demo', exp: Math.floor(inDays(10)) }) + '.' + sig);
ok('new format, exp in ms: cookie set ~10d', Math.abs(maxAge(jar.value) - 10 * 86400) < 120);
({ win, jar } = load(null));
win.KCMSession.set('premium.' + Math.floor(inDays(90)) + '.' + sig);
ok('old three-part format: cookie set ~90d', Math.abs(maxAge(jar.value) - 90 * 86400) < 120);
({ win, jar } = load(null));
win.KCMSession.set(b64({ tier: 'demo', exp: Math.floor(inDays(-1) / 1000) }) + '.' + sig);
ok('expired token: cookie cleared (Max-Age=0)', maxAge(jar.value) === 0);
({ win, jar } = load(null));
win.KCMSession.set('opaque.' + sig);
ok('unreadable expiry: falls back to ~30d', Math.abs(maxAge(jar.value) - 30 * 86400) < 120);
({ win, jar } = load(null));
win.KCMSession.set('garbage');
ok('no signature part: cookie cleared', maxAge(jar.value) === 0);
({ win, jar } = load(b64({ tier: 'demo', exp: Math.floor(inDays(5) / 1000) }) + '.' + sig));
win.KCMSession.sync();
ok('sync() copies stored token to cookie', /^kcm_session=/.test(jar.value) && maxAge(jar.value) > 4 * 86400);
({ win, jar } = load(null));
win.KCMSession.sync();
ok('sync() with no token clears cookie', maxAge(jar.value) === 0);

if (fails) { console.error(`\n${fails} FAILED`); process.exit(1); }
console.log('\nall session-cookie tests passed');
