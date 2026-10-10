/* ────────────────────────────────────────────────────────────────
   KCM APP GATE  (browser-side, second layer)
   Loaded at the top of /apps/*.html pages.

   The REAL boundary is server-side: functions/apps/[[path]].js refuses
   to send a paid app unless the request carries a valid signed
   `kcm_session` cookie. This script is the backup layer: it re-checks the
   token with /api/verify-session and bounces the visitor to the launcher
   if it fails, and it keeps the cookie in step with localStorage.

   Each app page sets window.KCM_APP_ID (string or array of strings matching
   `id` in my-apps.html's ALL_APPS) and hides <html> before this loads, so
   there is no flash of gated content. We reveal the page, or redirect.

   2026-10-10: the old "3 free picks" (unsigned localStorage `freeApps`) is
   no longer honored. It could not be verified by the server, so it was an
   honor system. Free apps are the ALWAYS_FREE list below.
   ──────────────────────────────────────────────────────────────── */
(function () {
    'use strict';

    var ids = window.KCM_APP_ID;
    if (!ids) return; // page didn't opt in, nothing to enforce
    if (!Array.isArray(ids)) ids = [ids];

    // Apps advertised as FREE must never be gated (matches FREE_APPS in
    // my-apps.html and `free: true` in functions/apps/[[path]].js).
    var ALWAYS_FREE = ['kcm-tuner', 'kcm-chromatic-sphere', 'kcm-midi-chromatic-circle'];
    if (ids.some(function (id) { return ALWAYS_FREE.indexOf(id) !== -1; })) {
        document.documentElement.style.visibility = '';
        return;
    }

    function reveal() {
        document.documentElement.style.visibility = '';
    }

    function redirectUnauthorized() {
        window.location.replace('/my-apps.html?locked=' + encodeURIComponent(ids[0]));
    }

    var token = null;
    try { token = localStorage.getItem('kcm_session_token'); } catch (e) {}

    if (!token) {
        // Not signed in as a member: no network call needed.
        redirectUnauthorized();
        return;
    }

    // Verify server-side. A missing/invalid/expired token, a failed request,
    // or a timeout all fail CLOSED (redirect), never open.
    var settled = false;

    var timeout = setTimeout(function () {
        if (settled) return;
        settled = true;
        console.warn('KCM access gate: verification timed out, treating as unauthorized');
        redirectUnauthorized();
    }, 6000);

    fetch('/api/verify-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token })
    })
        .then(function (res) { return res.json().catch(function () { return { ok: false, tier: null }; }); })
        .then(function (data) {
            if (settled) return;
            settled = true;
            clearTimeout(timeout);
            if (data.ok && data.tier) {
                // Keep the server-side gate's cookie in step with the token.
                try {
                    if (!/(^|; )kcm_session=/.test(document.cookie)) {
                        // Token may be base64url({tier,exp}).sig or tier.expMs.sig; the
                        // server is the authority, so a 30-day cookie is just a convenience.
                        var secs = 30 * 24 * 60 * 60;
                        try {
                            var tp = String(token).split('.');
                            var ms = 0;
                            if (tp.length === 3 && isFinite(Number(tp[1]))) ms = Number(tp[1]);
                            else if (tp.length === 2) {
                                var b = tp[0].replace(/-/g, '+').replace(/_/g, '/');
                                while (b.length % 4) b += '=';
                                var e = Number(JSON.parse(atob(b)).exp);
                                if (isFinite(e) && e > 0) ms = e > 1e12 ? e : e * 1000;
                            }
                            if (ms) secs = Math.min(secs, Math.floor((ms - Date.now()) / 1000));
                        } catch (err) {}
                        if (secs > 0) {
                            document.cookie = 'kcm_session=' + encodeURIComponent(token) +
                                '; Path=/; Max-Age=' + secs + '; SameSite=Lax' +
                                (location.protocol === 'https:' ? '; Secure' : '');
                        }
                    }
                } catch (e) {}
                reveal();
            } else {
                redirectUnauthorized();
            }
        })
        .catch(function (e) {
            if (settled) return;
            settled = true;
            clearTimeout(timeout);
            console.warn('KCM access gate: session check failed', e);
            redirectUnauthorized();
        });
})();
