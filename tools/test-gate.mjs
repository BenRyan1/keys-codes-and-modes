// Tests for functions/apps/[[path]].js.  Run:  node tools/test-gate.mjs
// The Worker (via the KCM_WORKER service binding) is the only token authority, so
// these tests mock it and use BOTH token shapes seen in the wild:
//   new:    base64url({"tier","exp"}).signature     old:  tier.expMs.signature
import { onRequest, appKey, readCookie, APPS, LEGACY } from '../functions/apps/[[path]].js';

let fails = 0;
const ok = (name, cond) => { if (!cond) { fails++; console.error('FAIL', name); } else console.log('ok  ', name); };

const NEW_TOKEN = Buffer.from(JSON.stringify({ tier: 'demo', exp: 1900000000 })).toString('base64url') + '.' + 'x'.repeat(43);
const OLD_TOKEN = 'premium.1900000000000.' + 'y'.repeat(43);
const BAD_TOKEN = 'bad.token';
const mockWorker = {
  fetch: async (u, init) => {
    const t = JSON.parse(init.body).token;
    return new Response(JSON.stringify({ ok: t === NEW_TOKEN || t === OLD_TOKEN, tier: 'demo' }));
  }
};
const env = { KCM_WORKER: mockWorker };

const nextOk = () => new Response('<html>APP</html>', { status: 200, headers: { 'Cache-Control': 'public, max-age=86400' } });
async function run(path, { cookie, env: e = env } = {}) {
  const headers = cookie ? { Cookie: `kcm_session=${encodeURIComponent(cookie)}` } : {};
  const req = new Request('https://keyscodesandmodes.com' + path, { headers });
  return onRequest({ request: req, env: e, next: async () => nextOk() });
}

// assets / free / unknown
ok('js asset passes', (await run('/apps/js/kcm-midi-recorder.js')).status === 200);
ok('png asset passes', (await run('/apps/kcm-official-logo-32.png')).status === 200);
ok('free app passes with no cookie', (await run('/apps/kcm-tuner')).status === 200);
ok('free app .html passes', (await run('/apps/kcm-tuner.html')).status === 200);
const unk = await run('/apps/APP_DESIGN_STANDARD.html');
ok('unknown html denied', unk.status === 302 && unk.headers.get('Location').includes('/my-apps.html'));
ok('unknown html denied even with good cookie', (await run('/apps/nope', { cookie: NEW_TOKEN })).status === 302);
ok('.DS_Store style name denied', (await run('/apps/.DS_Store', { cookie: NEW_TOKEN })).status === 302);

// paid apps: both token shapes work, bad ones do not
const noCookie = await run('/apps/chord-builder');
ok('paid, no cookie -> 302 with locked id', noCookie.status === 302 && noCookie.headers.get('Location').endsWith('/my-apps.html?locked=chord-builder'));
ok('denial is no-store', noCookie.headers.get('Cache-Control') === 'private, no-store');
for (const [label, tok] of [['new-format token', NEW_TOKEN], ['old-format token', OLD_TOKEN]]) {
  for (const p of ['/apps/chord-builder', '/apps/chord-builder.html', '/apps/chord-builder/']) {
    const r = await run(p, { cookie: tok });
    ok(`paid opens with ${label}: ${p}`, r.status === 200 && r.headers.get('Cache-Control') === 'private, no-store' && r.headers.get('X-Robots-Tag').includes('noindex'));
  }
}
ok('rejected token denied', (await run('/apps/chord-builder', { cookie: BAD_TOKEN })).status === 302);
ok('garbage cookie denied', (await run('/apps/chord-builder', { cookie: 'a.b' })).status === 302);
ok('case-variant path denied (unknown)', (await run('/apps/CHORD-BUILDER', { cookie: NEW_TOKEN })).status === 302);
ok('encoded traversal denied', (await run('/apps/%2e%2e/index', { cookie: NEW_TOKEN })).status === 302);
ok('bad percent-encoding denied', (await run('/apps/%E0%A4%A', { cookie: NEW_TOKEN })).status === 302);
ok('octave sibling is gated', (await run('/apps/octave-wave-visualizer-zplane')).status === 302);
ok('POST passes through untouched', (await onRequest({ request: new Request('https://x.com/apps/chord-builder', { method: 'POST' }), env, next: async () => new Response('x') })).status === 200);

// worker failures fail CLOSED
ok('worker down fails closed', (await run('/apps/chord-builder', { cookie: NEW_TOKEN, env: { KCM_WORKER: { fetch: async () => { throw new Error('down'); } } } })).status === 302);
ok('worker junk fails closed', (await run('/apps/chord-builder', { cookie: NEW_TOKEN, env: { KCM_WORKER: { fetch: async () => new Response('not json') } } })).status === 302);

// unconfigured = today's behavior, but visible
const un = await run('/apps/chord-builder', { env: {} });
ok('unconfigured serves page and flags it', un.status === 200 && un.headers.get('X-KCM-Gate') === 'unconfigured');

// legacy duplicate site pages -> real pages
for (const [k, to] of Object.entries(LEGACY)) {
  const r = await run('/apps/' + k + '.html');
  ok(`legacy /apps/${k}.html -> ${to}`, r.status === 301 && new URL(r.headers.get('Location')).pathname === to);
}
ok('legacy redirect works unconfigured', (await run('/apps/privacy', { env: {} })).status === 301);

// restored unlisted real apps are members-only, not open and not lost
for (const k of ['guitar-improvisations', 'keys-codes-modes-guitar-fretboard', 'polyphonic-guitar-detector', 'S-Geo-Music']) {
  ok(`restored app listed as paid: ${k}`, APPS[k] && APPS[k].free === false);
  ok(`restored app denied without login: ${k}`, (await run('/apps/' + k)).status === 302);
  ok(`restored app opens with login: ${k}`, (await run('/apps/' + k, { cookie: NEW_TOKEN })).status === 200);
}

// helpers
ok('appKey asset', appKey('/apps/js/a.js').asset === true);
ok('readCookie multi', readCookie('a=1; kcm_session=abc%2Edef; z=3', 'kcm_session') === 'abc.def');

if (fails) { console.error(`\n${fails} FAILED`); process.exit(1); }
console.log('\nall gate tests passed');
