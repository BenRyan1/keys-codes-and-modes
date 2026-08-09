/* ────────────────────────────────────────────────────────────────
   KCM APP GATE
   Loaded at the very top of every /apps/*.html page. The launcher
   (my-apps.html) already hides locked apps from browsing, but until
   this ran, anyone with a direct link to an app file could open it
   regardless of tier — there was no check on the app page itself.

   This is a soft, client-side gate: the page is still a static HTML
   file anyone with the URL can fetch, so a sufficiently determined
   visitor can still read the source. It meaningfully stops casual
   link-sharing and browsing, but it is NOT the real security
   boundary — that's /api/verify-session on the Worker. True
   enforcement would mean serving app content through an authenticated
   route instead of static files, which this site doesn't do.

   Each app page sets window.KCM_APP_ID (string or array of strings,
   matching the `id` field(s) in my-apps.html's ALL_APPS) and hides
   <html> via inline style *before* this file loads, so there's no
   flash of gated content while we check. We reveal the page, or
   redirect to the launcher, once we know the answer.
   ──────────────────────────────────────────────────────────────── */
(function () {
    'use strict';

    var ids = window.KCM_APP_ID;
    if (!ids) return; // page didn't opt in — nothing to enforce
    if (!Array.isArray(ids)) ids = [ids];

    function reveal() {
        document.documentElement.style.visibility = '';
    }

    function redirectUnauthorized() {
        window.location.replace('/my-apps.html?locked=' + encodeURIComponent(ids[0]));
    }

    function isFreePick() {
        try {
            var freeApps = JSON.parse(localStorage.getItem('freeApps') || '[]');
            return ids.some(function (id) { return freeApps.indexOf(id) !== -1; });
        } catch (e) {
            return false;
        }
    }

    var token = localStorage.getItem('kcm_session_token');

    if (!token) {
        // No claimed premium session at all — no network call needed,
        // just check whether this app is one of the visitor's free picks.
        if (isFreePick()) reveal(); else redirectUnauthorized();
        return;
    }

    // Claims premium — verify the token server-side rather than trusting
    // it. A missing/invalid/expired token or a failed request all fall
    // through to the free-pick check, never straight to "allow."
    var settled = false;

    var timeout = setTimeout(function () {
        if (settled) return;
        settled = true;
        // Verification is taking unusually long (Worker cold start,
        // flaky network). Don't strand a legitimately-entitled visitor
        // on a blank page indefinitely — reveal, and log it so repeated
        // timeouts are visible. This is a UX safety valve, not a
        // security decision: the Worker/my-apps.html remain the real
        // gate on anything that actually matters.
        console.warn('KCM access gate: verification timed out, revealing page');
        reveal();
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
            if (data.ok && data.tier) reveal();
            else if (isFreePick()) reveal();
            else redirectUnauthorized();
        })
        .catch(function (e) {
            if (settled) return;
            settled = true;
            clearTimeout(timeout);
            console.warn('KCM access gate: session check failed', e);
            if (isFreePick()) reveal(); else redirectUnauthorized();
        });
})();
