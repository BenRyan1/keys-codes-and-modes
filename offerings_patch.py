#!/usr/bin/env python3
"""
offerings_patch.py — KCM GA4 Fixes for offerings.html
Run from your repo root: python3 offerings_patch.py

What this does:
  1. Fixes wrong GA4 ID (G-MMQVHC40B9 → G-6EGC5ZNZPF)
  2. Adds scroll depth tracking
  3. Adds app launch click tracking
  4. Adds email form submit tracking
  5. Adds shared kcm-ga4-tracking.js reference
"""

import sys
import shutil
from datetime import datetime

INPUT  = 'offerings.html'   # change path if needed
OUTPUT = 'offerings.html'   # overwrites in place

# ── Make a backup first ──────────────────────────────────────
backup = INPUT + '.bak.' + datetime.now().strftime('%Y%m%d_%H%M%S')
shutil.copy2(INPUT, backup)
print(f'Backup saved: {backup}')

with open(INPUT, 'r', encoding='utf-8') as f:
    html = f.read()

original_len = len(html)

# ── Fix 1: Wrong GA4 ID ──────────────────────────────────────
WRONG_ID = 'G-MMQVHC40B9'
RIGHT_ID  = 'G-6EGC5ZNZPF'
count = html.count(WRONG_ID)
html = html.replace(WRONG_ID, RIGHT_ID)
print(f'Fix 1: Replaced GA4 ID ({count} occurrence{"s" if count!=1 else ""})')

# ── Fix 2: trackEvent function (make robust) ─────────────────
# Original in offerings is already correct syntax - just ensure it's present
if 'function trackEvent' not in html:
    print('WARNING: trackEvent function not found - manual check needed')
else:
    print('Fix 2: trackEvent function present and correct')

# ── Fix 3: Add tracking block before </body> ─────────────────
TRACKING_BLOCK = """
<!-- ══ KCM GA4 TRACKING ══════════════════════════════════════ -->
<script src="/js/kcm-ga4-tracking.js"></script>
<script>
/* Scroll Depth */
(function(){var m=[25,50,75,100],f={};
function p(){var e=document.documentElement,t=e.scrollHeight-e.clientHeight;
return t>0?Math.round(((e.scrollTop||document.body.scrollTop)/t)*100):0;}
window.addEventListener("scroll",function(){var v=p();
m.forEach(function(x){if(v>=x&&!f[x]){f[x]=true;
trackEvent("scroll_depth",{depth_percent:x,page:"offerings"});}});},{passive:true});
})();

document.addEventListener("DOMContentLoaded", function() {
  /* App launch button clicks */
  document.querySelectorAll("a.btn-launch").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var appName = "";
      var card = btn.closest(".app-card");
      if (card) { var h4 = card.querySelector("h4"); if (h4) appName = h4.textContent.trim(); }
      trackEvent("app_launch", {app_name: appName, page: "offerings"});
    });
  });

  /* Email capture form submit */
  var emailForm = document.querySelector(".email-form");
  if (emailForm) {
    emailForm.addEventListener("submit", function() {
      trackEvent("email_signup", {form_location: "offerings_hero", page: "offerings"});
    });
  }

  /* Pricing/signup CTA clicks */
  document.querySelectorAll("a[href*='pricing.html'], a[href*='signup.html']").forEach(function(a) {
    a.addEventListener("click", function() {
      trackEvent("cta_click", {cta_text: (a.textContent||"").trim(), destination: "pricing", page: "offerings"});
    });
  });
});
</script>
<!-- ══════════════════════════════════════════════════════════ -->
</body>
</html>"""

if TRACKING_BLOCK.strip() in html:
    print('Fix 3: Tracking block already present - skipping')
elif '</body>' not in html:
    print('ERROR: </body> tag not found - cannot inject tracking')
    sys.exit(1)
else:
    html = html.replace('</body>\n</html>', TRACKING_BLOCK)
    if TRACKING_BLOCK not in html:
        # Try alternate ending
        html = html.replace('</body>', TRACKING_BLOCK.replace('\n</body>\n</html>', ''))
    print('Fix 3: Tracking block injected before </body>')

# ── Write output ─────────────────────────────────────────────
with open(OUTPUT, 'w', encoding='utf-8') as f:
    f.write(html)

new_len = len(html)
print(f'\nDone! {INPUT} updated ({original_len} → {new_len} bytes, +{new_len-original_len} bytes added)')
print(f'GA4 ID check: {html.count(RIGHT_ID)} occurrence(s) of correct ID G-6EGC5ZNZPF')
print(f'Wrong ID remaining: {html.count(WRONG_ID)} (should be 0)')
