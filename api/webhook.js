// api/webhook.js — CommonJS (required for Vercel)
const crypto = require('crypto');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    var body = req.body;
    var eventType = body.event_type;
    var data = body.data;

    console.log('Paddle webhook:', eventType);

    if (eventType !== 'transaction.completed') {
      return res.status(200).json({ received: true });
    }

    // Get email — must fetch from Paddle API since not in transaction data
    var email = null;
    var customerId = data.customer_id;

    if (customerId) {
      try {
        var custRes = await fetch('https://api.paddle.com/customers/' + customerId, {
          headers: {
            'Authorization': 'Bearer ' + process.env.PADDLE_API_KEY,
            'Content-Type': 'application/json'
          }
        });
        var custData = await custRes.json();
        email = custData.data && custData.data.email ? custData.data.email : null;
      } catch(e) {
        console.error('Paddle customer fetch error:', e);
      }
    }

    // Fallback — try billing details
    if (!email) {
      email = data.billing_details && data.billing_details.email ? data.billing_details.email : null;
    }

    if (!email) {
      console.error('No email found for transaction:', data.id);
      return res.status(400).json({ error: 'No email found' });
    }

    var paddleOrderId = data.id;
    var SUPA_URL = process.env.SUPABASE_URL;
    var SUPA_KEY = process.env.SUPABASE_SERVICE_KEY;

    // Step 1: Create user in Supabase
    var userRes = await fetch(SUPA_URL + '/auth/v1/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPA_KEY,
        'Authorization': 'Bearer ' + SUPA_KEY
      },
      body: JSON.stringify({
        email: email,
        email_confirm: true,
        user_metadata: { source: 'paddle', product: 'smart-bachat' }
      })
    });

    var userData = await userRes.json();
    var userId = userData.id;

    // User already exists — get their ID
    if (!userId) {
      var listRes = await fetch(
        SUPA_URL + '/auth/v1/admin/users?email=' + encodeURIComponent(email),
        { headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY } }
      );
      var listData = await listRes.json();
      userId = listData.users && listData.users[0] ? listData.users[0].id : null;
    }

    if (!userId) {
      console.error('Could not create/find user');
      return res.status(500).json({ error: 'User error' });
    }

    // Step 2: Record purchase
    await fetch(SUPA_URL + '/rest/v1/purchases', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPA_KEY,
        'Authorization': 'Bearer ' + SUPA_KEY,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        user_id: userId,
        product_id: 'smart-bachat',
        email: email,
        paddle_order_id: paddleOrderId,
        amount_usd: data.details && data.details.totals ? data.details.totals.total / 100 : 2.99,
        status: 'active'
      })
    });

    // Step 3: Send welcome email via Resend
    var amount = data.details && data.details.totals ? (data.details.totals.total / 100).toFixed(2) : '2.99';
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.RESEND_API_KEY
      },
      body: JSON.stringify({
        from: 'SmartSaathi <hello@smartsaathi.app>',
        to: [email],
        subject: 'Smart Bachat — Aapka Access Tayaar Hai! 🎉',
        html: buildEmail(email)
      })
    });

    console.log('Webhook success for:', email);
    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

function buildEmail(email) {
  return '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;background:#080E0A;font-family:-apple-system,sans-serif;">' +
  '<div style="max-width:480px;margin:0 auto;padding:40px 24px;">' +
  '<div style="text-align:center;margin-bottom:24px;"><div style="font-size:48px;">💰</div>' +
  '<div style="font-size:20px;font-weight:800;color:#74C69D;">SmartSaathi</div></div>' +
  '<div style="background:#0F1A12;border:1px solid rgba(116,198,157,.2);border-radius:16px;padding:24px;margin-bottom:16px;">' +
  '<h1 style="font-size:20px;font-weight:800;color:#EEF7F0;margin:0 0 8px;">Mubarak ho! 🎉</h1>' +
  '<p style="color:#B8D4BE;font-size:14px;line-height:1.7;margin:0 0 16px;">Smart Bachat aapka ho gaya. Login karne ke liye neeche button dabayein.</p>' +
  '<a href="https://www.smartsaathi.app/login" style="display:block;text-align:center;padding:14px;background:linear-gradient(135deg,#40916C,#1B4332);border-radius:12px;color:#fff;font-size:16px;font-weight:700;text-decoration:none;">Smart Bachat Kholen →</a>' +
  '</div>' +
  '<p style="color:#5E8A68;font-size:12px;text-align:center;line-height:1.7;">Email: ' + email + '<br>' +
  'Koi masla? <a href="mailto:hello@smartsaathi.app" style="color:#74C69D;">hello@smartsaathi.app</a></p>' +
  '</div></body></html>';
}
