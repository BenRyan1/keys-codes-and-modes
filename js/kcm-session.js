/* KCM session cookie helper.
   The signed session token (from /api/verify-code) lives in localStorage, but
   a browser navigation to /apps/* can't send localStorage. The server-side
   gate (functions/apps/[[path]].js) therefore reads the same signed token
   from a cookie. This file keeps the two in step. The token is signed with a
   secret only the Worker holds, so a cookie can't be forged from devtools. */
(function () {
    'use strict';
    var NAME = 'kcm_session';

    function expiryOf(token) {
        var p = String(token || '').split('.');
        var exp = Number(p[1]);
        return p.length === 3 && isFinite(exp) ? exp : 0;
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
