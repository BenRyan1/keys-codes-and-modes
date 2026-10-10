/* ────────────────────────────────────────────────────────────────
   KCM SERVER-SIDE APP GATE  (Cloudflare Pages Function)
   Runs BEFORE any /apps/* page is served. Paid apps are only sent to
   requests carrying a valid signed `kcm_session` cookie, so view-source
   or a direct URL no longer reveals them. (The browser-side gate in
   js/kcm-app-gate.js stays as a second layer.)

   Verification, in order of preference:
     env.KCM_WORKER is a Service Binding to the snowy-rain-84a5 Worker; its
     existing /api/verify-session is the single authority on tokens (so token
     format changes in the Worker never need a change here).
     No binding configured - serves the page as before (today's behavior)
     and adds the header  X-KCM-Gate: unconfigured  so you can see it.
   With the binding present, any failure denies the paid app.

   Rules:
     - Non-HTML files in /apps (js, images) are always served.
     - HTML not listed in APPS below is DENIED (default-deny).
     - Free apps are served to everyone.
     - Free "3 picks" in localStorage are no longer honored (unsignable).

   Keep APPS in sync with my-apps.html: run  node tools/check-app-manifest.mjs
   ──────────────────────────────────────────────────────────────── */

export const APPS = {
  "S-Geo-Enhanced": { free: false, id: "S-Geo-Enhanced" },
  "S-Geo-Music Theory Explorer": { free: false, id: "S-Geo-Music Theory Explorer" },
  "S-Geo-Music": { free: false, id: "S-Geo-Music" },
  "S-Geo-Music_Theory_Explorer": { free: false, id: "S-Geo-Music_Theory_Explorer" },
  "Sacred-Geometry-Musical-face": { free: false, id: "Sacred-Geometry-Musical-face" },
  "caged-145-master": { free: false, id: "caged-explorer" },
  "caged-stencil-fretboard": { free: false, id: "caged-stencil" },
  "chladni-visualizer": { free: false, id: "chladni-visualizer" },
  "chord-builder": { free: false, id: "chord-builder" },
  "chromatic-circle": { free: false, id: "chromatic-scale-viz" },
  "chromatic-mandala": { free: false, id: "chromatic-mandala" },
  "chromatic-roulette": { free: false, id: "chromatic-roulette" },
  "chromatic-spoke-clock": { free: false, id: "chromatic-spoke-clock" },
  "chromatic-wheel-of-sound": { free: false, id: "chromatic-wheel-of-sound" },
  "circle-of-modes": { free: false, id: "circle-of-modes" },
  "fretboard-speed-challenge": { free: false, id: "fretboard-speed-challenge" },
  "guitar-fretboard-explorer-streamlined": { free: false, id: "guitar-fretboard-pro" },
  "guitar-fretboard-explorer": { free: false, id: "guitar-fretboard-pro" },
  "guitar-improvisations": { free: false, id: "guitar-improvisations" },
  "harmonized-chromatic-scale": { free: false, id: "harmonized-chromatic-scale" },
  "holy-mole-grail": { free: false, id: "holy-grail" },
  "kcm-chromatic-sphere-interactive": { free: true, id: "kcm-chromatic-sphere-interactive" },
  "kcm-cymatics-visualizer": { free: false, id: "cymatics" },
  "kcm-midi-chromatic-circle": { free: true, id: "kcm-midi-chromatic-circle" },
  "kcm-sound-observatory": { free: false, id: "kcm-sound-observatory" },
  "kcm-tuner": { free: true, id: "kcm-tuner" },
  "keys-codes-modes-guitar-fretboard": { free: false, id: "guitar-fretboard-pro" },
  "music-theory-pro": { free: false, id: "music-theory-pro" },
  "name-that-note": { free: false, id: "name-that-note" },
  "octave-wave-visualizer-3d": { free: false, id: "octave-wave" },
  "octave-wave-visualizer-chromatic-spheres": { free: false, id: "octave-wave" },
  "octave-wave-visualizer-full": { free: false, id: "octave-wave" },
  "octave-wave-visualizer-wireframe-spheres": { free: false, id: "octave-wave" },
  "octave-wave-visualizer-zplane": { free: false, id: "octave-wave" },
  "octave-wave-visualizer": { free: false, id: "octave-wave" },
  "pitch-detector": { free: false, id: "pitch-detector" },
  "polyphonic-guitar-detector": { free: false, id: "polyphonic-guitar-detector" },
  "radial-chart-visualizer": { free: false, id: "radial-chart-visualizer" },
  "rhythm-clock": { free: false, id: "rhythm-clock" },
  "rhythm-geometry-lab": { free: false, id: "rhythm-geometry-lab" },
  "rhythm-harmony": { free: false, id: "rhythm-harmony" },
  "sacred-geometry-enhanced-final": { free: false, id: "sacred-geometry" },
  "sonic-levitation": { free: false, id: "sonic-levitation" },
  "sonic-undertaking": { free: false, id: "sonic-undertaking" },
  "tonic-subdominant-dominant": { free: false, id: "tonic-sub-dom" },
  "uhim-ear-training": { free: false, id: "uhim-ear-training" },
  "wheel-of-sound": { free: false, id: "wheel-of-sound" },
  "ymatics_Music_Theory_Visualizer": { free: false, id: "ymatics_Music_Theory_Visualizer" }
};

// Old duplicate site pages that used to live in /apps. Two apps link to
// privacy.html / terms.html by relative path, so send these to the real pages.
export const LEGACY = {
  'about': '/about', 'contact': '/contact', 'index': '/', 'insights': '/insights',
  'pricing': '/pricing', 'privacy': '/privacy', 'refund-policy': '/refund-policy',
  'signup': '/signup', 'terms': '/terms-of-service'
};

export const COOKIE_NAME = 'kcm_session';

export function readCookie(header, name) {
  if (!header) return '';
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    if (part.slice(0, i).trim() === name) {
      try { return decodeURIComponent(part.slice(i + 1).trim()); } catch (e) { return ''; }
    }
  }
  return '';
}

async function verifyViaWorker(binding, token) {
  try {
    const res = await binding.fetch('https://keyscodesandmodes.com/api/verify-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'https://keyscodesandmodes.com' },
      body: JSON.stringify({ token })
    });
    const data = await res.json();
    return data && data.ok && data.tier ? data.tier : null;
  } catch (e) {
    return null;
  }
}

export function appKey(pathname) {
  // /apps/foo, /apps/foo/, /apps/foo.html  ->  "foo".  Null for non-HTML assets.
  let p = pathname.replace(/^\/apps\/?/, '').replace(/\/+$/, '');
  if (!p) return { key: '', asset: false };
  if (/\.html?$/i.test(p)) p = p.replace(/\.html?$/i, '');
  else if (/\.[A-Za-z0-9]{1,6}$/.test(p)) return { key: p, asset: true };
  return { key: decodeURIComponent(p), asset: false };
}

function deny(url, id) {
  const to = new URL('/my-apps.html', url);
  if (id) to.searchParams.set('locked', id);
  return new Response(null, {
    status: 302,
    headers: { Location: to.toString(), 'Cache-Control': 'private, no-store' }
  });
}

export async function onRequest(context) {
  const { request, env, next } = context;
  if (request.method !== 'GET' && request.method !== 'HEAD') return next();

  const url = new URL(request.url);
  let parsed;
  try { parsed = appKey(url.pathname); } catch (e) { return deny(url, ''); }
  if (parsed.asset) return next();

  if (Object.prototype.hasOwnProperty.call(LEGACY, parsed.key)) {
    return Response.redirect(new URL(LEGACY[parsed.key], url).toString(), 301);
  }

  const entry = Object.prototype.hasOwnProperty.call(APPS, parsed.key) ? APPS[parsed.key] : null;
  if (!entry) return deny(url, '');          // default-deny unknown HTML
  if (entry.free) return next();

  const token = readCookie(request.headers.get('Cookie'), COOKIE_NAME);
  let tier = null;
  let configured = true;

  if (env && env.KCM_WORKER && typeof env.KCM_WORKER.fetch === 'function') {
    tier = token ? await verifyViaWorker(env.KCM_WORKER, token) : null;
  } else {
    configured = false;
  }

  if (configured && !tier) return deny(url, entry.id);

  const res = await next();
  const out = new Response(res.body, res);
  out.headers.set('Cache-Control', 'private, no-store');
  out.headers.set('X-Robots-Tag', 'noindex, nofollow');
  if (!configured) out.headers.set('X-KCM-Gate', 'unconfigured');
  return out;
}
