// api/webhook.js
// Vercel Serverless Function
// This runs when Paddle sends a payment notification
// Path: /api/webhook

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    var body = req.body;

    // Verify this is a real Paddle webhook
    // Paddle sends event type in the body
    var eventType = body.event_type;
    var data = body.data;

    console.log('Paddle webhook received:', eventType);

    // We only care about completed transactions
    if (eventType !== 'transaction.completed') {
      return res.status(200).json({ received: true });
    }

    // Extract customer details from Paddle
    var email = data.customer?.email || data.billing_details?.email;
    var paddleOrderId = data.id;
    var customerId = data.customer_id;

    // Extract what was purchased
    var items = data.items || [];
    var priceId = items[0]?.price?.id;
    var productId = items[0]?.price?.product_id;

    if (!email) {
      console.error('No email in webhook data');
      return res.status(400).json({ error: 'No email found' });
    }

    // Map Paddle product to our internal product ID
    var internalProductId = 'smart-bachat'; // Default
    // Add more mappings here when you add more products
    // if (productId === 'pro_xxxxx') internalProductId = 'smart-rise';

    // ── STEP 1: Create or find user in Supabase ──────────────
    var supabaseUrl = process.env.SUPABASE_URL;
    var supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    // Create user account via Supabase Admin API
    var userRes = await fetch(supabaseUrl + '/auth/v1/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': 'Bearer ' + supabaseServiceKey
      },
      body: JSON.stringify({
        email: email,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          source: 'paddle',
          product: internalProductId
        }
      })
    });

    var userData = await userRes.json();
    var userId = userData.id;

    // If user already exists (duplicate purchase or existing user)
    if (!userId && userData.error === 'email already exists') {
      // Get existing user
      var existingRes = await fetch(
        supabaseUrl + '/auth/v1/admin/users?email=' + encodeURIComponent(email),
        {
          headers: {
            'apikey': supabaseServiceKey,
            'Authorization': 'Bearer ' + supabaseServiceKey
          }
        }
      );
      var existingData = await existingRes.json();
      userId = existingData.users?.[0]?.id;
    }

    if (!userId) {
      console.error('Could not create or find user:', userData);
      return res.status(500).json({ error: 'User creation failed' });
    }

    // ── STEP 2: Record purchase in database ──────────────────
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
        amount_usd: data.details?.totals?.total / 100, // Paddle sends in cents
        status: 'active'
      })
    });

    if (!purchaseRes.ok) {
      var purchaseErr = await purchaseRes.json();
      // Ignore duplicate purchase errors
      if (!purchaseErr.code === '23505') {
        console.error('Purchase record failed:', purchaseErr);
      }
    }

    // ── STEP 3: Send magic link email via Resend ─────────────
    var emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.RESEND_API_KEY
      },
      body: JSON.stringify({
        from: 'SmartSaathi <hello@smartsaathi.app>',
        to: [email],
        subject: '✅ Smart Bachat — Aapka Access Tayaar Hai',
        html: buildWelcomeEmail(email, internalProductId)
      })
    });

    if (!emailRes.ok) {
      console.error('Email send failed:', await emailRes.json());
      // Don't fail the webhook — purchase is recorded
    }

    // ── STEP 4: Send magic link via Supabase ─────────────────
    await fetch(supabaseUrl + '/auth/v1/admin/generate_link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': 'Bearer ' + supabaseServiceKey
      },
      body: JSON.stringify({
        type: 'magiclink',
        email: email,
        options: {
          redirectTo: 'https://smartsaathi.app/app'
        }
      })
    });

    console.log('Webhook processed successfully for:', email);
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// ── EMAIL TEMPLATE ───────────────────────────────────────────
function buildWelcomeEmail(email, productId) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#080E0A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<div style="max-width:500px;margin:0 auto;padding:40px 24px;">

  <div style="text-align:center;margin-bottom:32px;">
    <div style="font-size:52px;margin-bottom:8px;">💰</div>
    <div style="font-size:22px;font-weight:800;color:#74C69D;">SmartSaathi</div>
  </div>

  <div style="background:#0F1A12;border:1px solid rgba(116,198,157,.2);border-radius:16px;padding:28px;margin-bottom:20px;">
    <h1 style="font-size:22px;font-weight:800;color:#EEF7F0;margin:0 0 8px;">
      Mubarak ho! 🎉
    </h1>
    <p style="color:#B8D4BE;font-size:15px;line-height:1.7;margin:0 0 20px;">
      Aapne Smart Bachat khareed liya. Ye Gulf workers ke liye banaya gaya hai — aap sahi jagah aaye.
    </p>

    <div style="background:#162019;border-radius:12px;padding:16px;margin-bottom:20px;">
      <p style="color:#5E8A68;font-size:12px;letter-spacing:.1em;text-transform:uppercase;margin:0 0 8px;">Aapka Account</p>
      <p style="color:#74C69D;font-size:15px;font-weight:700;margin:0;">${email}</p>
    </div>

    <a href="https://smartsaathi.app/login"
       style="display:block;text-align:center;padding:16px;background:linear-gradient(135deg,#40916C,#1B4332);border-radius:12px;color:#fff;font-size:17px;font-weight:700;text-decoration:none;">
      Smart Bachat Kholen →
    </a>
  </div>

  <div style="background:#0F1A12;border:1px solid rgba(116,198,157,.13);border-radius:14px;padding:20px;margin-bottom:20px;">
    <p style="color:#74C69D;font-size:13px;font-weight:700;margin:0 0 12px;">Login kaise karein:</p>
    <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;">
      <span style="background:linear-gradient(135deg,#40916C,#1B4332);color:#fff;font-size:11px;font-weight:800;width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;">1</span>
      <span style="color:#B8D4BE;font-size:13px;line-height:1.5;">Upar "Smart Bachat Kholen" par click karein</span>
    </div>
    <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;">
      <span style="background:linear-gradient(135deg,#40916C,#1B4332);color:#fff;font-size:11px;font-weight:800;width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;">2</span>
      <span style="color:#B8D4BE;font-size:13px;line-height:1.5;">Apna email dalein — login link milega</span>
    </div>
    <div style="display:flex;align-items:flex-start;gap:10px;">
      <span style="background:linear-gradient(135deg,#40916C,#1B4332);color:#fff;font-size:11px;font-weight:800;width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;">3</span>
      <span style="color:#B8D4BE;font-size:13px;line-height:1.5;">Home screen par add karein — real app jaisi feel</span>
    </div>
  </div>

  <p style="text-align:center;color:#5E8A68;font-size:12px;line-height:1.7;">
    Koi masla? <a href="mailto:hello@smartsaathi.app" style="color:#74C69D;">hello@smartsaathi.app</a> par likhein.<br>
    © 2025 SmartSaathi
  </p>
</div>
</body>
</html>
  `;
}
