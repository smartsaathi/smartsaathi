// api/redeem.js — Vercel Serverless Function
// Validates access code and creates Supabase user

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, code } = req.body || {};

  // Validate inputs
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, error: 'invalid_email' });
  }
  if (!code) {
    return res.status(400).json({ success: false, error: 'invalid_code' });
  }

  const cleanCode = code.trim().toUpperCase();
  const cleanEmail = email.trim().toLowerCase();

  const SUPA_URL = process.env.SUPABASE_URL;
  const SUPA_KEY = process.env.SUPABASE_SERVICE_KEY;

  try {
    // ── STEP 1: Check code exists and is unused ──
    const codeRes = await fetch(
      `${SUPA_URL}/rest/v1/access_codes?code=eq.${encodeURIComponent(cleanCode)}&limit=1`,
      {
        headers: {
          'apikey': SUPA_KEY,
          'Authorization': `Bearer ${SUPA_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const codes = await codeRes.json();

    if (!codes || codes.length === 0) {
      return res.status(200).json({ success: false, error: 'invalid' });
    }

    const codeRecord = codes[0];

    if (codeRecord.used) {
      return res.status(200).json({ success: false, error: 'used' });
    }

    // ── STEP 2: Create Supabase user ──
    const createRes = await fetch(`${SUPA_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'apikey': SUPA_KEY,
        'Authorization': `Bearer ${SUPA_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: cleanEmail,
        email_confirm: true,
        password: Math.random().toString(36).slice(-12) + 'Aa1!'
      })
    });

    const userData = await createRes.json();

    // If user already exists (email_exists error) — that's ok, still give access
    let userId = userData.id;
    if (!userId && userData.msg && userData.msg.includes('already')) {
      // User exists — fetch their ID
      const existRes = await fetch(
        `${SUPA_URL}/auth/v1/admin/users?email=${encodeURIComponent(cleanEmail)}`,
        {
          headers: {
            'apikey': SUPA_KEY,
            'Authorization': `Bearer ${SUPA_KEY}`
          }
        }
      );
      const existData = await existRes.json();
      userId = existData.users && existData.users[0] ? existData.users[0].id : null;
    }

    // ── STEP 3: Record purchase ──
    await fetch(`${SUPA_URL}/rest/v1/purchases`, {
      method: 'POST',
      headers: {
        'apikey': SUPA_KEY,
        'Authorization': `Bearer ${SUPA_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        user_id: userId,
        email: cleanEmail,
        paddle_order_id: `CODE-${cleanCode}`,
        status: 'completed'
      })
    });

    // ── STEP 4: Mark code as used ──
    await fetch(
      `${SUPA_URL}/rest/v1/access_codes?code=eq.${encodeURIComponent(cleanCode)}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': SUPA_KEY,
          'Authorization': `Bearer ${SUPA_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          used: true,
          used_by_email: cleanEmail,
          used_at: new Date().toISOString()
        })
      }
    );

    // ── STEP 5: Send magic link email ──
    await fetch(`${SUPA_URL}/auth/v1/admin/users/${userId}/magic-link`, {
      method: 'POST',
      headers: {
        'apikey': SUPA_KEY,
        'Authorization': `Bearer ${SUPA_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: cleanEmail
      })
    }).catch(() => {}); // Non-critical — don't fail if email doesn't send

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Redeem error:', err);
    return res.status(500).json({ success: false, error: 'server_error' });
  }
};
