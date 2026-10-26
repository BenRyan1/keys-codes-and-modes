/* KCM creator attribution (added 2026-10-20).
   Captures ?ref=CODE from a creator's link, remembers it for 60 days (cookie
   shared across *.keyscodesandmodes.com, plus localStorage), counts one visit,
   and tags Stripe Payment Links with client_reference_id so the sale is credited
   to that creator. The ref is public and is NOT an access code. */
(function () {
  var RE = /^[A-Za-z0-9_-]{2,40}$/;
  var DAYS = 60;
  var API = 'https://keyscodesandmodes.com/api';

  function readCookie() {
    var m = document.cookie.match(/(?:^|; )kcm_ref=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : '';
  }
  function save(ref) {
    try { localStorage.setItem('kcm_ref', ref); } catch (e) {}
    var dom = /(^|\.)keyscodesandmodes\.com$/.test(location.hostname) ? '; Domain=.keyscodesandmodes.com' : '';
    document.cookie = 'kcm_ref=' + encodeURIComponent(ref) + '; Max-Age=' + (DAYS * 86400) +
      '; Path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '') + dom;
  }
  function hit(ref) {
    try {
      if (sessionStorage.getItem('kcm_ref_hit') === ref) return;
      sessionStorage.setItem('kcm_ref_hit', ref);
    } catch (e) {}
    try {
      fetch(API + '/ref-hit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref: ref }),
        keepalive: true
      }).catch(function () {});
    } catch (e) {}
  }
  function get() {
    var ref = '';
    try { ref = (new URLSearchParams(location.search).get('ref') || '').trim(); } catch (e) {}
    if (RE.test(ref)) { save(ref); hit(ref); return ref; }
    ref = readCookie();
    if (!RE.test(ref)) { try { ref = localStorage.getItem('kcm_ref') || ''; } catch (e) { ref = ''; } }
    return RE.test(ref) ? ref : '';
  }

  var current = get();
  window.KCMRef = { get: function () { return current || get(); } };

  // Tag Stripe Payment Links (static and the ones pricing.html swaps in).
  function tag(a) {
    if (!a || !a.href || a.href.indexOf('https://buy.stripe.com/') !== 0) return;
    var r = window.KCMRef.get();
    if (!r) return;
    try {
      var u = new URL(a.href);
      u.searchParams.set('client_reference_id', r);
      a.href = u.toString();
    } catch (e) {}
  }
  function onEvt(e) { tag(e.target && e.target.closest ? e.target.closest('a') : null); }
  ['mousedown', 'click', 'touchstart', 'keydown'].forEach(function (t) {
    document.addEventListener(t, onEvt, { capture: true, passive: true });
  });
  document.addEventListener('DOMContentLoaded', function () {
    var links = document.querySelectorAll('a[href^="https://buy.stripe.com/"]');
    for (var i = 0; i < links.length; i++) tag(links[i]);
  });
})();
