// ================================================================
// Keys, Codes & Modes — MailerLite Signup Worker
// Deploy this to: keyscodesandmode-mailer-lite (Cloudflare Workers)
// ================================================================

const MAILERLITE_API_KEY = 'mlsn.2c8bec80f2b4edcdc63560987070ba6b51c018634ebbfa9454a6f8efce98e241';
const MAILERLITE_API_URL = 'https://connect.mailerlite.com/api/subscribers';

// Your site URL for CORS
const ALLOWED_ORIGIN = 'https://www.keyscodesandmodes.com';

export default {
  async fetch(request, env, ctx) {

    // ── CORS preflight ──────────────────────────────────────────
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders()
      });
    }

    // ── Only accept POST ────────────────────────────────────────
    if (request.method !== 'POST') {
      return jsonResponse({ success: false, error: 'Method not allowed' }, 405);
    }

    // ── Parse form data ─────────────────────────────────────────
    let firstName = '';
    let email = '';

    try {
      const contentType = request.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        const body = await request.json();
        firstName = (body.firstName || '').trim();
        email = (body.email || '').trim();
      } else {
        // FormData
        const formData = await request.formData();
        firstName = (formData.get('firstName') || '').trim();
        email = (formData.get('email') || '').trim();
      }
    } catch (err) {
      return jsonResponse({ success: false, error: 'Invalid form data' }, 400);
    }

    // ── Validate ────────────────────────────────────────────────
    if (!email || !email.includes('@')) {
      return jsonResponse({ success: false, error: 'Valid email address is required' }, 400);
    }
    if (!firstName) {
      return jsonResponse({ success: false, error: 'First name is required' }, 400);
    }

    // ── Add subscriber to MailerLite ────────────────────────────
    try {
      const payload = {
        email: email,
        fields: {
          name: firstName
        },
        status: 'active'
      };

      const mlResponse = await fetch(MAILERLITE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const mlData = await mlResponse.json();

      // MailerLite returns 200 or 201 on success
      if (mlResponse.ok) {
        return jsonResponse({
          success: true,
          message: 'Successfully subscribed! Redirecting to your free apps...'
        }, 200);
      }

      // MailerLite returned an error
      console.error('MailerLite error:', mlData);
      return jsonResponse({
        success: false,
        error: mlData.message || 'Subscription failed. Please try again.'
      }, 400);

    } catch (err) {
      console.error('Worker fetch error:', err);
      return jsonResponse({
        success: false,
        error: 'Server error. Please try again in a moment.'
      }, 500);
    }
  }
};

// ── Helpers ──────────────────────────────────────────────────────

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
  };
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders()
    }
  });
}
