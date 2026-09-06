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

    // SECURITY FIX (Aug 27, 2026): welcome-free-picker.html's own UI only
    // ever lets a visitor choose 3 apps, but nothing here used to enforce
    // that — `freeApps` is a plain localStorage array with no signature,
    // so anyone could open devtools and set it to ALL 26 catalog app ids
    // at once, permanently unlocking the entire premium library with zero
    // payment, zero code, zero signup. The `.length <= 3` check is the
    // actual fix: a spoofed array longer than the real free-tier limit no
    // longer grants anything. Still soft (someone could still relabel
    // their honest 3 picks, or reset and re-pick different apps over and
    // over) — that residual is the same accepted client-side-trust
    // trade-off already called out in the file header above, not a new gap.
    function isFreePick() {
        try {
            var freeApps = JSON.parse(localStorage.getItem('freeApps') || '[]');
            if (!Array.isArray(freeApps) || freeApps.length > 3) return false;
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

    // SECURITY FIX (Aug 27, 2026): this used to reveal unconditionally on
    // timeout ("don't strand a legit visitor on a slow connection") — but
    // that meant anyone could bypass the ENTIRE gate on ANY app, no token
    // or code needed at all, just by blocking or delaying this one fetch
    // past 6 seconds (trivial via devtools' "Block request URL", or any
    // network throttling). A timeout is now treated exactly like a failed
    // verification: fall through to the free-pick check, else redirect.
    // Trade-off: a real premium visitor on a slow connection or during a
    // genuine Worker cold-start can get bounced to the locked page instead
    // of waiting it out — annoying, but the alternative was a standing
    // bypass for the whole premium catalog, so this fails closed instead.
    var timeout = setTimeout(function () {
        if (settled) return;
        settled = true;
        console.warn('KCM access gate: verification timed out, treating as unauthorized');
        if (isFreePick()) reveal(); else redirectUnauthorized();
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
