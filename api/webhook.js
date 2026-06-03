module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    var body = req.body;
    var eventType = body.event_type;
    var data = body.data || {};

    console.log('Event:', eventType);
    console.log('Full body keys:', JSON.stringify(Object.keys(body)));
    console.log('Data keys:', JSON.stringify(Object.keys(data)));
    console.log('Full payload:', JSON.stringify(body).substring(0, 2000));

    if (eventType !== 'transaction.completed') {
      return res.status(200).json({ received: true });
    }

    // Try every possible location for email
    var email = null;

    // Check data.customer
    if (data.customer && data.customer.email) {
      email = data.customer.email;
      console.log('Email from data.customer:', email);
    }
    // Check data.billing_details
    else if (data.billing_details && data.billing_details.email) {
      email = data.billing_details.email;
      console.log('Email from billing_details:', email);
    }
    // Check top level customer
    else if (body.customer && body.customer.email) {
      email = body.customer.email;
      console.log('Email from body.customer:', email);
    }
    // Check data directly
    else if (data.email) {
      email = data.email;
      console.log('Email from data.email:', email);
    }
    // Check payments array
    else if (data.payments && data.payments[0] && data.payments[0].customer) {
      email = data.payments[0].customer.email;
      console.log('Email from payments:', email);
    }

    console.log('Final email found:', email);

    if (!email) {
      // Log full data to find email location
      console.error('NO EMAIL FOUND. Full data:', JSON.stringify(data));
      return res.status(400).json({ error: 'No email found', keys: Object.keys(data) });
    }

    var internalProductId = 'smart-bachat';
    var supabaseUrl = process.env.SUPABASE_URL;
    var supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
    var resendKey = process.env.RESEND_API_KEY;

    // Create user in Supabase
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

    if (!userId) {
      var listRes = await fetch(
        supabaseUrl + '/auth/v1/admin/users?page=1&per_page=1000',
        { headers: { 'apikey': supabaseServiceKey, 'Authorization': 'Bearer ' + supabaseServiceKey } }
      );
      var listData = await listRes.json();
      var users = listData.users || [];
      for (var i = 0; i < users.length; i++) {
        if (users[i].email === email) { userId = users[i].id; break; }
      }
    }

    if (!userId) {
      return res.status(500).json({ error: 'User creation failed' });
    }

    // Record purchase
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
        paddle_order_id: data.id,
        amount_usd: 2.99,
        status: 'active'
      })
    });

    // Send welcome email
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + resendKey
      },
      body: JSON.stringify({
        from: 'SmartSaathi <hello@smartsaathi.app>',
        to: [email],
        subject: 'Smart Bachat — Aapka Access Tayaar Hai',
        html: '<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:32px;background:#080E0A;color:#EEF7F0;">'
            + '<div style="text-align:center;font-size:48px;margin-bottom:16px">💰</div>'
            + '<h1 style="color:#74C69D;text-align:center">SmartSaathi</h1>'
            + '<div style="background:#0F1A12;border-radius:14px;padding:24px;margin:20px 0;">'
            + '<h2 style="color:#EEF7F0;margin:0 0 12px">Mubarak ho! 🎉</h2>'
            + '<p style="color:#B8D4BE;margin:0 0 20px">Aapne Smart Bachat khareed liya.</p>'
            + '<a href="https://smartsaathi.app/login" style="display:block;text-align:center;padding:16px;background:#40916C;border-radius:12px;color:#fff;font-weight:700;text-decoration:none;">Smart Bachat Kholen →</a>'
            + '</div>'
            + '<p style="color:#5E8A68;font-size:12px;text-align:center">hello@smartsaathi.app</p>'
            + '</div>'
      })
    });

    console.log('Success for:', email);
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
};
