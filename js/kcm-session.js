/* KCM session cookie helper.
   The signed session token (from /api/verify-code) lives in localStorage, but
   a browser navigation to /apps/* can't send localStorage. The server-side
   gate (functions/apps/[[path]].js) therefore reads the same signed token
   from a cookie. This file keeps the two in step. The token is signed with a
   secret only the Worker holds, so a cookie can't be forged from devtools. */
(function () {
    'use strict';
    var NAME = 'kcm_session';

    var FALLBACK_MS = 30 * 24 * 60 * 60 * 1000; // cookie lifetime if expiry can't be read

    // Two token shapes exist: the live Worker issues  base64url({"tier","exp"}).signature
    // (exp in seconds or ms); older ones were  tier.expiresAtMs.signature.
    // The cookie's lifetime is only a convenience: the server (Worker) is the
    // authority on whether a token is still valid.
    function expiryOf(token) {
        var p = String(token || '').split('.');
        try {
            if (p.length === 3 && isFinite(Number(p[1]))) return Number(p[1]);
            if (p.length === 2) {
                var b = p[0].replace(/-/g, '+').replace(/_/g, '/');
                while (b.length % 4) b += '=';
                var j = JSON.parse(atob(b));
                var e = Number(j.exp);
                if (isFinite(e) && e > 0) return e > 1e12 ? e : e * 1000;
            }
        } catch (err) { /* fall through */ }
        return p.length >= 2 && p[p.length - 1] ? Date.now() + FALLBACK_MS : 0;
    }

    function set(token) {
        try {
            var exp = expiryOf(token);
            var secs = Math.floor((exp - Date.now()) / 1000);
            if (!token || secs <= 0) return clear();
            document.cookie = NAME + '=' + encodeURIComponent(token) +
                '; Path=/; Max-Age=' + secs + '; SameSite=Lax' +
                (location.protocol === 'https:' ? '; Secure' : '');
        } catch (e) { /* cookies blocked: server gate will treat as signed out */ }
    }

    function clear() {
        try {
            document.cookie = NAME + '=; Path=/; Max-Age=0; SameSite=Lax' +
                (location.protocol === 'https:' ? '; Secure' : '');
        } catch (e) {}
    }

    function sync() {
        var t = null;
        try { t = localStorage.getItem('kcm_session_token'); } catch (e) {}
        if (t) set(t); else clear();
    }

    window.KCMSession = { set: set, clear: clear, sync: sync };
})();
