// Tests for functions/apps/[[path]].js.  Run:  node tools/test-gate.mjs
import { onRequest, verifyLocal, appKey, readCookie, APPS, LEGACY } from '../functions/apps/[[path]].js';

const SECRET = 'test-secret';
const b64url = b => Buffer.from(b).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
async function sign(tier, exp, secret = SECRET) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${tier}.${exp}`));
  return `${tier}.${exp}.${b64url(new Uint8Array(mac))}`;
}
let fails = 0;
const ok = (name, cond) => { if (!cond) { fails++; console.error('FAIL', name); } else console.log('ok  ', name); };

const nextOk = () => new Response('<html>APP</html>', { status: 200, headers: { 'Cache-Control': 'public, max-age=86400' } });
async function run(path, { cookie, env = {} } = {}) {
  const headers = cookie ? { Cookie: `kcm_session=${encodeURIComponent(cookie)}` } : {};
  const req = new Request('https://keyscodesandmodes.com' + path, { headers });
  return onRequest({ request: req, env, next: async () => nextOk() });
}

const good = await sign('premium', Date.now() + 3600e3);
const expired = await sign('premium', Date.now() - 1000);
const forged = await sign('premium', Date.now() + 3600e3, 'attacker-secret');
const tampered = good.replace('premium', 'founder');
const env = { SESSION_SECRET: SECRET };

// asset / free / unknown
ok('js asset passes', (await run('/apps/js/kcm-midi-recorder.js', { env })).status === 200);
ok('png asset passes', (await run('/apps/kcm-official-logo-32.png', { env })).status === 200);
ok('free app passes with no cookie', (await run('/apps/kcm-tuner', { env })).status === 200);
ok('free app .html passes', (await run('/apps/kcm-tuner.html', { env })).status === 200);
const unk = await run('/apps/APP_DESIGN_STANDARD.html', { env });
ok('unknown html denied', unk.status === 302 && unk.headers.get('Location').includes('/my-apps.html'));
ok('unknown html denied even with good cookie', (await run('/apps/nope', { cookie: good, env })).status === 302);

// paid, secret mode
const noCookie = await run('/apps/chord-builder', { env });
ok('paid, no cookie -> 302 with locked id', noCookie.status === 302 && noCookie.headers.get('Location').endsWith('/my-apps.html?locked=chord-builder'));
ok('denial is no-store', noCookie.headers.get('Cache-Control') === 'private, no-store');
for (const p of ['/apps/chord-builder', '/apps/chord-builder.html', '/apps/chord-builder/', '/apps/CHORD-BUILDER']) {
  const r = await run(p, { cookie: good, env });
  if (p.includes('CHORD')) ok('case-variant path is not a free pass (denied as unknown)', r.status === 302);
  else ok(`paid, valid cookie passes: ${p}`, r.status === 200 && r.headers.get('Cache-Control') === 'private, no-store' && r.headers.get('X-Robots-Tag').includes('noindex'));
}
ok('expired cookie denied', (await run('/apps/chord-builder', { cookie: expired, env })).status === 302);
ok('forged cookie denied', (await run('/apps/chord-builder', { cookie: forged, env })).status === 302);
ok('tampered tier denied', (await run('/apps/chord-builder', { cookie: tampered, env })).status === 302);
ok('garbage cookie denied', (await run('/apps/chord-builder', { cookie: 'a.b', env })).status === 302);
ok('empty-tier cookie denied', (await run('/apps/chord-builder', { cookie: '.' + (Date.now() + 1e6) + '.x', env })).status === 302);
ok('encoded traversal denied/handled', (await run('/apps/%2e%2e/index', { cookie: good, env })).status === 302);
ok('bad percent-encoding denied', (await run('/apps/%E0%A4%A', { cookie: good, env })).status === 302);
ok('octave sibling is gated', (await run('/apps/octave-wave-visualizer-zplane', { env })).status === 302);
ok('POST passes through untouched', (await onRequest({ request: new Request('https://x.com/apps/chord-builder', { method: 'POST' }), env, next: async () => new Response('x') })).status === 200);

// service-binding mode
const bindingYes = { KCM_WORKER: { fetch: async (u, init) => new Response(JSON.stringify({ ok: JSON.parse(init.body).token === 'T', tier: 'premium' })) } };
ok('binding: accepted token passes', (await run('/apps/chord-builder', { cookie: 'T', env: bindingYes })).status === 200);
ok('binding: rejected token denied', (await run('/apps/chord-builder', { cookie: 'X', env: bindingYes })).status === 302);
ok('binding: no cookie denied', (await run('/apps/chord-builder', { env: bindingYes })).status === 302);
const bindingDown = { KCM_WORKER: { fetch: async () => { throw new Error('down'); } } };
ok('binding down fails CLOSED', (await run('/apps/chord-builder', { cookie: good, env: bindingDown })).status === 302);
const bindingBad = { KCM_WORKER: { fetch: async () => new Response('not json') } };
ok('binding returns junk fails CLOSED', (await run('/apps/chord-builder', { cookie: good, env: bindingBad })).status === 302);

// unconfigured mode = today's behavior, but visible
const un = await run('/apps/chord-builder', { env: {} });
ok('unconfigured serves page and flags it', un.status === 200 && un.headers.get('X-KCM-Gate') === 'unconfigured');


// legacy duplicate site pages -> real pages (apps link to ../privacy.html and terms.html)
for (const [k, to] of Object.entries(LEGACY)) {
  const r = await run('/apps/' + k + '.html', { env });
  ok(`legacy /apps/${k}.html -> ${to}`, r.status === 301 && new URL(r.headers.get('Location')).pathname === to);
}
ok('legacy redirect works with no cookie and unconfigured', (await run('/apps/privacy', { env: {} })).status === 301);
// restored unlisted real apps are members-only, not open and not lost
for (const k of ['guitar-improvisations', 'keys-codes-modes-guitar-fretboard', 'polyphonic-guitar-detector', 'S-Geo-Music']) {
  ok(`restored app listed as paid: ${k}`, APPS[k] && APPS[k].free === false);
  ok(`restored app denied without login: ${k}`, (await run('/apps/' + k, { env })).status === 302);
  ok(`restored app opens with login: ${k}`, (await run('/apps/' + k, { cookie: good, env })).status === 200);
}

// helpers
ok('verifyLocal good', (await verifyLocal(SECRET, good)) === 'premium');
ok('verifyLocal wrong secret', (await verifyLocal('other', good)) === null);
ok('appKey asset', appKey('/apps/js/a.js').asset === true);
ok('readCookie multi', readCookie('a=1; kcm_session=abc%2Edef; z=3', 'kcm_session') === 'abc.def');

if (fails) { console.error(`\n${fails} FAILED`); process.exit(1); }
console.log('\nall gate tests passed');
