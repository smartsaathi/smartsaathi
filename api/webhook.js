// api/webhook.js — Vercel Serverless Function (CommonJS format)

module.exports = async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    var body = req.body;
    var eventType = body.event_type;
    var data = body.data;

    console.log('Paddle webhook received:', eventType);

    if (eventType !== 'transaction.completed') {
      return res.status(200).json({ received: true });
    }

    // Get email from multiple possible locations in Paddle payload
    var email = null;
    if (data.customer && data.customer.email) email = data.customer.email;
    else if (data.billing_details && data.billing_details.email) email = data.billing_details.email;
    else if (body.customer && body.customer.email) email = body.customer.email;

    var paddleOrderId = data.id;
    var internalProductId = 'smart-bachat';

    if (!email) {
      console.error('No email found. Body keys:', Object.keys(body));
      console.error('Data keys:', Object.keys(data || {}));
      return res.status(400).json({ error: 'No email found' });
    }

    var supabaseUrl = process.env.SUPABASE_URL;
    var supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
    var resendKey = process.env.RESEND_API_KEY;

    // STEP 1: Create user in Supabase
    var userRes = await fetch(supabaseUrl + '/auth/v1/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': 'Bearer ' + supabaseServiceKey
      },
      body: JSON.stringify({
        email: email,
        email_confirm: true,
        user_metadata: { source: 'paddle', product: internalProductId }
      })
    });

    var userData = await userRes.json();
    var userId = userData.id;

    // If user already exists — find them
    if (!userId) {
      var listRes = await fetch(
        supabaseUrl + '/auth/v1/admin/users?page=1&per_page=1000',
        {
          headers: {
            'apikey': supabaseServiceKey,
            'Authorization': 'Bearer ' + supabaseServiceKey
          }
        }
      );
      var listData = await listRes.json();
      var users = listData.users || [];
      for (var i = 0; i < users.length; i++) {
        if (users[i].email === email) {
          userId = users[i].id;
          break;
        }
      }
    }

    if (!userId) {
      console.error('Could not create or find user');
      return res.status(500).json({ error: 'User creation failed' });
    }

    // STEP 2: Record purchase
    var purchaseRes = await fetch(supabaseUrl + '/rest/v1/purchases', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': 'Bearer ' + supabaseServiceKey,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        user_id: userId,
        product_id: internalProductId,
        email: email,
        paddle_order_id: paddleOrderId,
        amount_usd: 2.99,
        status: 'active'
      })
    });

    if (!purchaseRes.ok) {
      var purchaseErr = await purchaseRes.text();
      console.log('Purchase insert note:', purchaseErr);
      // Continue even if duplicate
    }

    // STEP 3: Send welcome email via Resend
    var emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + resendKey
      },
      body: JSON.stringify({
        from: 'SmartSaathi <hello@smartsaathi.app>',
        to: [email],
        subject: 'Smart Bachat — Aapka Access Tayaar Hai',
        html: '<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:32px 24px;background:#080E0A;color:#EEF7F0;">'
            + '<div style="text-align:center;margin-bottom:24px;font-size:48px">💰</div>'
            + '<h1 style="color:#74C69D;text-align:center;margin-bottom:16px">SmartSaathi</h1>'
            + '<div style="background:#0F1A12;border-radius:14px;padding:24px;margin-bottom:16px;">'
            + '<h2 style="color:#EEF7F0;margin:0 0 12px">Mubarak ho! 🎉</h2>'
            + '<p style="color:#B8D4BE;margin:0 0 20px">Aapne Smart Bachat khareed liya. Gulf workers ke liye banaya gaya hai.</p>'
            + '<a href="https://smartsaathi.app/login" style="display:block;text-align:center;padding:16px;background:#40916C;border-radius:12px;color:#fff;font-weight:700;text-decoration:none;">Smart Bachat Kholen →</a>'
            + '</div>'
            + '<p style="color:#5E8A68;font-size:12px;text-align:center">hello@smartsaathi.app</p>'
            + '</div>'
      })
    });

    if (!emailRes.ok) {
      console.error('Email failed:', await emailRes.text());
    }

    console.log('Webhook success for:', email);
    return res.status(200).json({ success: true, email: email });

  } catch (error) {
    console.error('Webhook error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};
