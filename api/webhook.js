module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    var body = req.body;
    var eventType = body.event_type;
    var data = body.data;

    if (eventType !== 'transaction.completed') {
      return res.status(200).json({ received: true });
    }

    var email = data.customer?.email ||
                data.billing_details?.email ||
                body.customer?.email;

    if (!email) {
      console.error('No email found in webhook');
      return res.status(400).json({ error: 'No email found' });
    }

    var paddleOrderId = data.id;
    var internalProductId = 'smart-bachat';

    var supabaseUrl = process.env.SUPABASE_URL;
    var supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
    var resendKey = process.env.RESEND_API_KEY;

    // Step 1: Create user in Supabase
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

    // If user exists already
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
      var existing = (listData.users || []).find(function(u) {
        return u.email === email;
      });
      if (existing) userId = existing.id;
    }

    if (!userId) {
      return res.status(500).json({ error: 'Could not create user' });
    }

    // Step 2: Record purchase
    await fetch(supabaseUrl + '/rest/v1/purchases', {
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

    // Step 3: Send welcome email
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + resendKey
      },
      body: JSON.stringify({
        from: 'SmartSaathi <hello@smartsaathi.app>',
        to: [email],
        subject: 'Smart Bachat — Aapka Access Tayaar Hai ✅',
        html: '<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:40px 24px;background:#080E0A;color:#EEF7F0;">'
          + '<div style="text-align:center;margin-bottom:24px;"><div style="font-size:48px">💰</div>'
          + '<h1 style="color:#74C69D;font-size:22px">SmartSaathi</h1></div>'
          + '<h2 style="color:#EEF7F0">Mubarak ho! 🎉</h2>'
          + '<p style="color:#B8D4BE;margin:12px 0">Aapne Smart Bachat khareed liya.</p>'
          + '<p style="color:#B8D4BE;margin:12px 0">Login karne ke liye neeche click karein:</p>'
          + '<a href="https://smartsaathi.app/login" style="display:block;text-align:center;padding:16px;background:#40916C;border-radius:12px;color:#fff;font-weight:700;text-decoration:none;margin:20px 0">Smart Bachat Kholen →</a>'
          + '<p style="color:#5E8A68;font-size:12px;text-align:center">hello@smartsaathi.app</p>'
          + '</div>'
      })
    });

    console.log('Webhook success for:', email);
    return res.status(200).json({ success: true });

  } catch(error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: error.message });
  }
}
