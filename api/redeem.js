// api/redeem.js — CommonJS
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS') return res.status(200).end();
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});

  var phone = (req.body.phone||'').replace(/[\s\-\+]/g,'').trim();
  var code  = (req.body.code||'').trim().toUpperCase();

  if(!phone || phone.length < 8)
    return res.status(400).json({success:false, error:'invalid_phone'});
  if(!code)
    return res.status(400).json({success:false, error:'invalid_code'});

  var SUPA_URL = process.env.SUPABASE_URL;
  var SUPA_KEY = process.env.SUPABASE_SERVICE_KEY;

  try {
    // ── STEP 1: Find and validate code ──
    var codeRes = await fetch(
      SUPA_URL+'/rest/v1/access_codes?code=eq.'+encodeURIComponent(code)+'&limit=1',
      { headers:{'apikey':SUPA_KEY,'Authorization':'Bearer '+SUPA_KEY,'Content-Type':'application/json'} }
    );
    var codes = await codeRes.json();

    if(!codes || codes.length===0)
      return res.status(200).json({success:false, error:'invalid'});

    var record = codes[0];

    if(record.used){
      // Code used before — check if same phone is trying to re-login
      var storedPhone2 = (record.buyer_phone||'').replace(/[\s\-\+]/g,'').trim();
      if(storedPhone2 === phone){
        // Same buyer — give them access again
        var emailProxy2 = 'sb'+phone+'@smartsaathi.app';
        var fixedPassword2 = 'SB!'+code+'!'+phone.slice(-4);
        // Sign them in again
        var reSignIn = await fetch(SUPA_URL+'/auth/v1/token?grant_type=password',{
          method:'POST',
          headers:{'apikey':SUPA_KEY,'Content-Type':'application/json'},
          body:JSON.stringify({email:emailProxy2, password:fixedPassword2})
        });
        var reData = await reSignIn.json();
        if(reData.access_token){
          return res.status(200).json({
            success:true,
            access_token:reData.access_token,
            refresh_token:reData.refresh_token||''
          });
        }
      }
      return res.status(200).json({success:false, error:'used'});
    }

    // ── STEP 2: Verify phone matches ──
    var storedPhone = (record.buyer_phone||'').replace(/[\s\-\+]/g,'').trim();
    if(storedPhone !== phone)
      return res.status(200).json({success:false, error:'invalid'});

    // ── STEP 3: Create user with fixed password ──
    var emailProxy = 'sb'+phone+'@smartsaathi.app';
    var fixedPassword = 'SB!'+code+'!'+phone.slice(-4);

    // Try to create user
    var createRes = await fetch(SUPA_URL+'/auth/v1/admin/users', {
      method:'POST',
      headers:{
        'apikey':SUPA_KEY,
        'Authorization':'Bearer '+SUPA_KEY,
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        email: emailProxy,
        email_confirm: true,
        password: fixedPassword,
        user_metadata: { phone:phone, source:'redeem', code:code }
      })
    });
    var userData = await createRes.json();
    var userId = userData.id;

    // User exists already — update their password to match
    if(!userId) {
      // Get existing user
      var listRes = await fetch(
        SUPA_URL+'/auth/v1/admin/users?email='+encodeURIComponent(emailProxy),
        { headers:{'apikey':SUPA_KEY,'Authorization':'Bearer '+SUPA_KEY} }
      );
      var listData = await listRes.json();
      userId = listData.users&&listData.users[0]?listData.users[0].id:null;

      // Update password so login works
      if(userId) {
        await fetch(SUPA_URL+'/auth/v1/admin/users/'+userId, {
          method:'PUT',
          headers:{
            'apikey':SUPA_KEY,
            'Authorization':'Bearer '+SUPA_KEY,
            'Content-Type':'application/json'
          },
          body:JSON.stringify({ password:fixedPassword, email_confirm:true })
        });
      }
    }

    if(!userId)
      return res.status(500).json({success:false, error:'user_error'});

    // ── STEP 4: Record purchase ──
    await fetch(SUPA_URL+'/rest/v1/purchases', {
      method:'POST',
      headers:{
        'apikey':SUPA_KEY,
        'Authorization':'Bearer '+SUPA_KEY,
        'Content-Type':'application/json',
        'Prefer':'return=minimal'
      },
      body:JSON.stringify({
        user_id: userId,
        email: emailProxy,
        paddle_order_id: 'CODE-'+code,
        status: 'completed',
        amount_usd: 2.99
      })
    }).catch(function(){}); // ignore duplicate errors

    // ── STEP 5: Mark code as used ──
    await fetch(
      SUPA_URL+'/rest/v1/access_codes?code=eq.'+encodeURIComponent(code), {
      method:'PATCH',
      headers:{
        'apikey':SUPA_KEY,
        'Authorization':'Bearer '+SUPA_KEY,
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        used: true,
        used_by_phone: phone,
        used_at: new Date().toISOString()
      })
    });

    // ── STEP 6: Sign in to get session token ──
    var signInRes = await fetch(
      SUPA_URL+'/auth/v1/token?grant_type=password', {
      method:'POST',
      headers:{
        'apikey':SUPA_KEY,
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        email: emailProxy,
        password: fixedPassword
      })
    });
    var signInData = await signInRes.json();

    if(signInData.access_token) {
      return res.status(200).json({
        success: true,
        access_token: signInData.access_token,
        refresh_token: signInData.refresh_token||''
      });
    }

    // Sign in failed — still return success, user can login manually
    console.log('Sign in failed but user created:', signInData);
    return res.status(200).json({ success:true, access_token:null });

  } catch(err) {
    console.error('Redeem error:', err);
    return res.status(500).json({success:false, error:'server_error'});
  }
};
