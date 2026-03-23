/**
 * kcm-ga4-tracking.js
 * Keys, Codes & Modes — GA4 Event Tracking
 * Add <script src="/js/kcm-ga4-tracking.js"></script> before </body> on every page
 * GA4 ID: G-6EGC5ZNZPF
 */

(function () {
  'use strict';

  /* ── Safe trackEvent wrapper ─────────────────────────────── */
  window.trackEvent = function (eventName, params) {
    try { if (typeof gtag === 'function') gtag('event', eventName, params || {}); } catch (e) {}
  };

  /* ── Scroll Depth (25 / 50 / 75 / 100%) ─────────────────── */
  var scrollMilestones = [25, 50, 75, 100];
  var scrollFired = {};
  function getScrollPct() {
    var el = document.documentElement;
    var t = el.scrollHeight - el.clientHeight;
    return t > 0 ? Math.round(((el.scrollTop || document.body.scrollTop) / t) * 100) : 0;
  }
  window.addEventListener('scroll', function () {
    var p = getScrollPct();
    scrollMilestones.forEach(function (m) {
      if (p >= m && !scrollFired[m]) {
        scrollFired[m] = true;
        trackEvent('scroll_depth', { depth_percent: m, page: window.location.pathname });
      }
    });
  }, { passive: true });

  /* ── Page-specific tracking (fires on DOMContentLoaded) ─── */
  document.addEventListener('DOMContentLoaded', function () {
    var page = window.location.pathname.replace(/.*\//, '').replace('.html', '') || 'home';

    /* ── about.html ── */
    if (page === 'about') {
      document.querySelectorAll('a[href]').forEach(function (a) {
        var h = a.getAttribute('href') || '';
        var t = (a.textContent || '').trim();
        if (h.includes('pricing.html')) a.addEventListener('click', function () {
          trackEvent('cta_click', { cta_text: t, destination: 'pricing', page: 'about' });
        });
        if (h.includes('insights.html')) a.addEventListener('click', function () {
          trackEvent('cta_click', { cta_text: t, destination: 'all_apps', page: 'about' });
        });
      });
    }

    /* ── contact.html ── */
    if (page === 'contact') {
      var socialMap = {
        'instagram.com': 'instagram', 'facebook.com': 'facebook', 'tiktok.com': 'tiktok',
        'linkedin.com': 'linkedin', 'x.com': 'twitter'
      };
      document.querySelectorAll('a[href]').forEach(function (a) {
        var h = (a.getAttribute('href') || '').toLowerCase();
        var t = (a.textContent || '').trim();
        Object.keys(socialMap).forEach(function (k) {
          if (h.includes(k)) a.addEventListener('click', function () {
            trackEvent('social_click', { platform: socialMap[k], page: 'contact' });
          });
        });
        if (h.includes('insights.html')) a.addEventListener('click', function () {
          trackEvent('cta_click', { cta_text: t, destination: 'all_apps', page: 'contact' });
        });
        if (h.includes('unlockinfinite.com') || h.includes('guitarfreestyle.com'))
          a.addEventListener('click', function () {
            trackEvent('external_link_click', { destination: h, page: 'contact' });
          });
      });
    }

    /* ── offerings.html ── */
    if (page === 'offerings' || page === 'insights') {
      /* App launch button clicks */
      document.querySelectorAll('a.btn-launch').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var appName = '';
          var card = btn.closest('.app-card');
          if (card) { var h4 = card.querySelector('h4'); if (h4) appName = h4.textContent.trim(); }
          trackEvent('app_launch', { app_name: appName, page: page });
        });
      });
      /* Email capture form */
      var emailForm = document.querySelector('.email-form');
      if (emailForm) emailForm.addEventListener('submit', function () {
        trackEvent('email_signup', { form_location: 'offerings_hero', page: page });
      });
    }

    /* ── pricing.html ── */
    if (page === 'pricing') {
      var planMap = {
        '3cI9AU8ZT1Fsg3a9pn63K04': 'student_monthly',
        '5kQaEY5NHfwicQY30Z63K05': 'student_yearly',
        '8x2cN67VP1Fs4kscBz63K06': 'professional_monthly',
        '14AdRacc5ck6eZ6dFD63K03': 'professional_yearly',
        '6oU14o1xrese6sA6db63K01': 'founders_circle'
      };
      document.querySelectorAll('a.cta-button[href*="buy.stripe.com"]').forEach(function (a) {
        a.addEventListener('click', function () {
          var href = a.getAttribute('href') || '';
          var plan = 'unknown';
          Object.keys(planMap).forEach(function (k) { if (href.includes(k)) plan = planMap[k]; });
          trackEvent('begin_checkout', { plan: plan, page: 'pricing' });
        });
      });
      /* Access code form */
      var codeForm = document.getElementById('accessCodeForm');
      if (codeForm) codeForm.addEventListener('submit', function () {
        setTimeout(function () {
          var tier = localStorage.getItem('userTier');
          if (tier) trackEvent('access_code_redeemed', { tier: tier, page: 'pricing' });
        }, 750);
      });
    }

    /* ── signup.html ── */
    if (page === 'signup') {
      /* Watch for MailerLite success message via MutationObserver */
      var formEl = document.querySelector('.ml-embedded');
      if (formEl) {
        var obs = new MutationObserver(function (mutations) {
          mutations.forEach(function (m) {
            m.addedNodes.forEach(function (node) {
              if (node.nodeType === 1) {
                var txt = (node.textContent || '').toLowerCase();
                if (txt.includes('thank') || txt.includes('success') || txt.includes('check your email')) {
                  trackEvent('signup_submit', { form: 'free_tuner', page: 'signup' });
                  obs.disconnect();
                }
              }
            });
          });
        });
        obs.observe(formEl, { childList: true, subtree: true });
      }
    }

  }); // end DOMContentLoaded

})();
/**
 * kcm-ga4-tracking.js
 * Keys, Codes & Modes — GA4 Event Tracking
 * Add <script src="/js/kcm-ga4-tracking.js"></script> before </body> on every page
 * GA4 ID: G-6EGC5ZNZPF
 */

(function () {
  'use strict';

  /* ── Safe trackEvent wrapper ─────────────────────────────── */
  window.trackEvent = function (eventName, params) {
    try { if (typeof gtag === 'function') gtag('event', eventName, params || {}); } catch (e) {}
  };

  /* ── Scroll Depth (25 / 50 / 75 / 100%) ─────────────────── */
  var scrollMilestones = [25, 50, 75, 100];
  var scrollFired = {};
  function getScrollPct() {
    var el = document.documentElement;
    var t = el.scrollHeight - el.clientHeight;
    return t > 0 ? Math.round(((el.scrollTop || document.body.scrollTop) / t) * 100) : 0;
  }
  window.addEventListener('scroll', function () {
    var p = getScrollPct();
    scrollMilestones.forEach(function (m) {
      if (p >= m && !scrollFired[m]) {
        scrollFired[m] = true;
        trackEvent('scroll_depth', { depth_percent: m, page: window.location.pathname });
      }
    });
  }, { passive: true });

  /* ── Page-specific tracking (fires on DOMContentLoaded) ─── */
  document.addEventListener('DOMContentLoaded', function () {
    var page = window.location.pathname.replace(/.*\//, '').replace('.html', '') || 'home';

    /* ── about.html ── */
    if (page === 'about') {
      document.querySelectorAll('a[href]').forEach(function (a) {
        var h = a.getAttribute('href') || '';
        var t = (a.textContent || '').trim();
        if (h.includes('pricing.html')) a.addEventListener('click', function () {
          trackEvent('cta_click', { cta_text: t, destination: 'pricing', page: 'about' });
        });
        if (h.includes('insights.html')) a.addEventListener('click', function () {
          trackEvent('cta_click', { cta_text: t, destination: 'all_apps', page: 'about' });
        });
      });
    }

    /* ── contact.html ── */
    if (page === 'contact') {
      var socialMap = {
        'instagram.com': 'instagram', 'facebook.com': 'facebook', 'tiktok.com': 'tiktok',
        'linkedin.com': 'linkedin', 'x.com': 'twitter'
      };
      document.querySelectorAll('a[href]').forEach(function (a) {
        var h = (a.getAttribute('href') || '').toLowerCase();
        var t = (a.textContent || '').trim();
        Object.keys(socialMap).forEach(function (k) {
          if (h.includes(k)) a.addEventListener('click', function () {
            trackEvent('social_click', { platform: socialMap[k], page: 'contact' });
          });
        });
        if (h.includes('insights.html')) a.addEventListener('click', function () {
          trackEvent('cta_click', { cta_text: t, destination: 'all_apps', page: 'contact' });
        });
        if (h.includes('unlockinfinite.com') || h.includes('guitarfreestyle.com'))
          a.addEventListener('click', function () {
            trackEvent('external_link_click', { destination: h, page: 'contact' });
          });
      });
    }

    /* ── offerings.html ── */
    if (page === 'offerings' || page === 'insights') {
      /* App launch button clicks */
      document.querySelectorAll('a.btn-launch').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var appName = '';
          var card = btn.closest('.app-card');
          if (card) { var h4 = card.querySelector('h4'); if (h4) appName = h4.textContent.trim(); }
          trackEvent('app_launch', { app_name: appName, page: page });
        });
      });
      /* Email capture form */
      var emailForm = document.querySelector('.email-form');
      if (emailForm) emailForm.addEventListener('submit', function () {
        trackEvent('email_signup', { form_location: 'offerings_hero', page: page });
      });
    }

    /* ── pricing.html ── */
    if (page === 'pricing') {
      var planMap = {
        '3cI9AU8ZT1Fsg3a9pn63K04': 'student_monthly',
        '5kQaEY5NHfwicQY30Z63K05': 'student_yearly',
        '8x2cN67VP1Fs4kscBz63K06': 'professional_monthly',
        '14AdRacc5ck6eZ6dFD63K03': 'professional_yearly',
        '6oU14o1xrese6sA6db63K01': 'founders_circle'
      };
      document.querySelectorAll('a.cta-button[href*="buy.stripe.com"]').forEach(function (a) {
        a.addEventListener('click', function () {
          var href = a.getAttribute('href') || '';
          var plan = 'unknown';
          Object.keys(planMap).forEach(function (k) { if (href.includes(k)) plan = planMap[k]; });
          trackEvent('begin_checkout', { plan: plan, page: 'pricing' });
        });
      });
      /* Access code form */
      var codeForm = document.getElementById('accessCodeForm');
      if (codeForm) codeForm.addEventListener('submit', function () {
        setTimeout(function () {
          var tier = localStorage.getItem('userTier');
          if (tier) trackEvent('access_code_redeemed', { tier: tier, page: 'pricing' });
        }, 750);
      });
    }

    /* ── signup.html ── */
    if (page === 'signup') {
      /* Watch for MailerLite success message via MutationObserver */
      var formEl = document.querySelector('.ml-embedded');
      if (formEl) {
        var obs = new MutationObserver(function (mutations) {
          mutations.forEach(function (m) {
            m.addedNodes.forEach(function (node) {
              if (node.nodeType === 1) {
                var txt = (node.textContent || '').toLowerCase();
                if (txt.includes('thank') || txt.includes('success') || txt.includes('check your email')) {
                  trackEvent('signup_submit', { form: 'free_tuner', page: 'signup' });
                  obs.disconnect();
                }
              }
            });
          });
        });
        obs.observe(formEl, { childList: true, subtree: true });
      }
    }

  }); // end DOMContentLoaded

})();
