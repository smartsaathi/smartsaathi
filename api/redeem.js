<!DOCTYPE html>
<html lang="ur">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<meta name="theme-color" content="#080E0A">
<title>Smart Bachat — Access Lo</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Hind:wght@400;500;600&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
:root{
  --bg:#080E0A;--bg2:#0D1A10;--bg3:#122318;
  --g1:#1B4332;--g3:#40916C;--g4:#74C69D;
  --gold:#F0C040;--amber:#F4A261;--red:#E07A7A;
  --tx:#EEF7F0;--ts:#B8D4BE;--tm:#5E8A68;
  --bd:rgba(116,198,157,.13);
}
body{
  font-family:'Hind',-apple-system,sans-serif;
  background:var(--bg);color:var(--tx);
  min-height:100vh;display:flex;align-items:center;justify-content:center;
  -webkit-font-smoothing:antialiased;padding:20px;
}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 80% 50% at 50% 0%,rgba(45,106,79,.15),transparent 60%);pointer-events:none;}

.card{
  width:100%;max-width:380px;
  background:var(--bg2);
  border:1.5px solid rgba(116,198,157,.2);
  border-radius:24px;padding:28px 24px;
  position:relative;overflow:hidden;
  box-shadow:0 20px 60px rgba(0,0,0,.5);
}
.card::before{content:'';position:absolute;top:0;left:8%;right:8%;height:1.5px;background:linear-gradient(90deg,transparent,var(--gold),transparent);}

.logo{text-align:center;margin-bottom:20px;}
.logo-ico{font-size:40px;display:block;margin-bottom:6px;}
.logo-name{font-family:'Baloo 2',sans-serif;font-weight:800;font-size:20px;color:var(--g4);}

.lang-btns{display:flex;gap:8px;justify-content:center;margin-bottom:20px;}
.lang-btn{padding:5px 16px;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;border:1.5px solid var(--bd);background:transparent;color:var(--tm);font-family:inherit;transition:all .2s;}
.lang-btn.on{background:var(--g3);border-color:var(--g3);color:#fff;}

.title{font-family:'Baloo 2',sans-serif;font-weight:800;font-size:22px;text-align:center;margin-bottom:6px;color:var(--tx);}
.subtitle{font-size:13px;color:var(--tm);text-align:center;margin-bottom:20px;line-height:1.6;}

.lbl{font-size:11px;letter-spacing:.1em;color:var(--tm);text-transform:uppercase;margin-bottom:8px;font-weight:700;}

/* Phone input */
.phone-wrap{display:flex;gap:8px;margin-bottom:12px;}
.phone-flag{
  background:var(--bg3);border:1.5px solid var(--bd);
  border-radius:12px;padding:14px 12px;
  font-size:16px;color:var(--ts);
  white-space:nowrap;flex-shrink:0;
  display:flex;align-items:center;gap:4px;
}
.inp{
  width:100%;background:var(--bg3);
  border:1.5px solid var(--bd);border-radius:12px;
  padding:14px 16px;color:var(--tx);font-size:16px;
  outline:none;transition:border-color .2s;
  -webkit-appearance:none;font-family:inherit;
}
.inp:focus{border-color:var(--g4);}
.inp::placeholder{color:var(--tm);}

/* Code input */
.code-inp{
  width:100%;background:var(--bg3);
  border:2px solid rgba(240,192,64,.3);border-radius:12px;
  padding:16px;color:var(--gold);
  font-size:26px;font-weight:800;
  font-family:'Baloo 2',sans-serif;
  outline:none;transition:border-color .2s;
  -webkit-appearance:none;
  text-align:center;letter-spacing:5px;
  text-transform:uppercase;margin-bottom:6px;
}
.code-inp:focus{border-color:var(--gold);}
.code-inp::placeholder{color:rgba(240,192,64,.3);letter-spacing:2px;font-size:15px;}
.inp-note{font-size:11px;color:var(--tm);margin-bottom:16px;line-height:1.6;text-align:center;}

/* Phone note */
.phone-note{
  background:rgba(116,198,157,.05);
  border:1px solid rgba(116,198,157,.15);
  border-radius:10px;padding:9px 12px;
  font-size:11px;color:var(--ts);
  line-height:1.6;margin-bottom:14px;
}

.btn{
  width:100%;padding:16px;
  background:linear-gradient(135deg,#F0C040,#F4A261);
  border:none;border-radius:14px;
  color:#0A1A10;font-size:18px;font-weight:800;
  cursor:pointer;font-family:'Baloo 2',sans-serif;
  box-shadow:0 6px 24px rgba(240,192,64,.3);
  transition:transform .15s;margin-bottom:12px;
}
.btn:active{transform:scale(.97);}
.btn:disabled{opacity:.6;transform:none;}
@keyframes pulse{0%,100%{box-shadow:0 6px 24px rgba(240,192,64,.3)}50%{box-shadow:0 6px 32px rgba(240,192,64,.55)}}
.btn:not(:disabled){animation:pulse 2.5s ease-in-out infinite;}

.msg{padding:12px 14px;border-radius:12px;font-size:13px;line-height:1.6;text-align:center;margin-bottom:10px;display:none;}
.msg.err{background:rgba(224,122,122,.08);border:1px solid rgba(224,122,122,.25);color:var(--red);}
.msg.ok{background:rgba(116,198,157,.08);border:1px solid rgba(116,198,157,.25);color:var(--g4);}

.spinner{display:inline-block;width:16px;height:16px;border:2px solid rgba(10,26,16,.3);border-top-color:#0A1A10;border-radius:50%;animation:spin .6s linear infinite;vertical-align:middle;margin-right:8px;}
@keyframes spin{to{transform:rotate(360deg)}}

/* Success */
.success{display:none;text-align:center;}
.success-ico{font-size:60px;margin-bottom:16px;}
.success-title{font-family:'Baloo 2',sans-serif;font-weight:800;font-size:22px;color:var(--g4);margin-bottom:8px;}
.success-sub{font-size:14px;color:var(--ts);margin-bottom:20px;line-height:1.7;}
.success-btn{width:100%;padding:16px;background:linear-gradient(135deg,#F0C040,#F4A261);border:none;border-radius:14px;color:#0A1A10;font-size:17px;font-weight:800;cursor:pointer;font-family:'Baloo 2',sans-serif;}

.divider{height:1px;background:linear-gradient(90deg,transparent,var(--bd),transparent);margin:14px 0;}
.back-link{display:block;text-align:center;font-size:13px;color:var(--tm);}

@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.card{animation:fadeUp .4s ease both;}
</style>
</head>
<body>
<div class="card">
  <div class="logo">
    <span class="logo-ico">💰</span>
    <div class="logo-name">SmartSaathi</div>
  </div>

  <div class="lang-btns">
    <button class="lang-btn on" id="btnUR" onclick="setLang('ur')">اردو</button>
    <button class="lang-btn" id="btnBD" onclick="setLang('bd')">বাংলা</button>
  </div>

  <!-- FORM -->
  <div id="formSection">
    <div class="title" id="formTitle">Access Code Daakhil Karein</div>
    <div class="subtitle" id="formSub">SmartSaathi ne jo code bheja hai woh yahan darj karein</div>

    <!-- Phone Number -->
    <div class="lbl" id="phoneLbl">Aapka WhatsApp Number</div>
    <div class="phone-wrap">
      <div class="phone-flag">🌍 +</div>
      <input class="inp" type="tel" id="phoneInp"
        placeholder="966XXXXXXXXX"
        inputmode="numeric" autocomplete="tel">
    </div>
    <div class="phone-note" id="phoneNote">
      📱 Wahi number daalen jo aapne payment ke waqt bheja tha — yahi aapka login hoga
    </div>

    <!-- Code -->
    <div class="lbl" id="codeLbl">Access Code</div>
    <input class="code-inp" type="text" id="codeInp"
      placeholder="SB-XXXX-XXXX"
      maxlength="12" autocomplete="off"
      oninput="this.value=this.value.toUpperCase().replace(/[^A-Z0-9-]/g,'')">
    <div class="inp-note" id="inpNote">Code SmartSaathi ne WhatsApp par bheja hai</div>

    <div class="msg err" id="errMsg"></div>

    <button class="btn" id="submitBtn" onclick="redeemCode()">
      <span id="btnText">✅ Access Lo — App Kholo</span>
    </button>

    <div class="divider"></div>
    <a class="back-link" href="/" id="backLink">← Wapas Jayen</a>
  </div>

  <!-- SUCCESS -->
  <div class="success" id="successSection">
    <div class="success-ico">🎉</div>
    <div class="success-title" id="successTitle">Mubarak ho! Access Mil Gaya!</div>
    <div class="success-sub" id="successSub">Aapka Smart Bachat tayaar hai. Neeche button dabao.</div>
    <button class="success-btn" onclick="openApp()" id="openAppBtn">💰 Smart Bachat Kholein</button>
  </div>
</div>

<script>
var lang = 'ur';

var C = {
  ur:{
    formTitle:'Access Code Daakhil Karein',
    formSub:'SmartSaathi ne jo code bheja hai woh yahan darj karein',
    phoneLbl:'Aapka WhatsApp Number',
    phonePlaceholder:'966XXXXXXXXX',
    phoneNote:'📱 Wahi number daalen jo aapne payment ke waqt bheja tha — yahi aapka login hoga',
    codeLbl:'Access Code',
    inpNote:'Code SmartSaathi ne WhatsApp par bheja hai',
    btnText:'✅ Access Lo — App Kholo',
    errPhone:'Sahi WhatsApp number daalen.',
    errCode:'Code daalna zaroori hai.',
    errInvalid:'Yeh code galat hai ya number se match nahi karta. SmartSaathi se dobara check karein.',
    errUsed:'Yeh code pehle hi use ho chuka hai.',
    successTitle:'Mubarak ho! Access Mil Gaya! 🎉',
    successSub:'Aapka Smart Bachat tayaar hai. Neeche button dabao — app abhi khulega.',
    openAppBtn:'💰 Smart Bachat Kholein',
    backLink:'← Wapas Jayen',
  },
  bd:{
    formTitle:'Access Code লিখুন',
    formSub:'SmartSaathi যে code পাঠিয়েছে সেটা এখানে লিখুন',
    phoneLbl:'আপনার WhatsApp নম্বর',
    phonePlaceholder:'966XXXXXXXXX',
    phoneNote:'📱 পেমেন্টের সময় যে নম্বর দিয়েছিলেন সেটা দিন — এটাই আপনার login হবে',
    codeLbl:'Access Code',
    inpNote:'Code SmartSaathi WhatsApp-এ পাঠিয়েছে',
    btnText:'✅ Access নিন — App খুলুন',
    errPhone:'সঠিক WhatsApp নম্বর দিন।',
    errCode:'Code দেওয়া আবশ্যক।',
    errInvalid:'এই code ভুল অথবা নম্বরের সাথে মিলছে না। SmartSaathi-কে জানান।',
    errUsed:'এই code আগেই ব্যবহার হয়ে গেছে।',
    successTitle:'মোবারক! Access পেয়ে গেছেন! 🎉',
    successSub:'আপনার Smart Bachat তৈরি। নিচের button চাপুন — App এখনই খুলবে।',
    openAppBtn:'💰 Smart Bachat খুলুন',
    backLink:'← ফিরে যান',
  }
};

function G(id){return document.getElementById(id);}
function setT(id,v){var e=G(id);if(e)e.textContent=v;}
function setH(id,v){var e=G(id);if(e)e.innerHTML=v;}

function setLang(l){
  lang=l;
  G('btnUR').classList.toggle('on',l==='ur');
  G('btnBD').classList.toggle('on',l==='bd');
  render();
}

function render(){
  var d=C[lang];
  setT('formTitle',d.formTitle);
  setT('formSub',d.formSub);
  setT('phoneLbl',d.phoneLbl);
  G('phoneInp').placeholder=d.phonePlaceholder;
  setT('phoneNote',d.phoneNote);
  setT('codeLbl',d.codeLbl);
  setT('inpNote',d.inpNote);
  setH('btnText',d.btnText);
  setT('backLink',d.backLink);
}

function showErr(msg){var e=G('errMsg');e.textContent=msg;e.style.display='block';}
function hideErr(){G('errMsg').style.display='none';}

function cleanPhone(p){
  // Remove spaces, dashes, plus signs
  return p.replace(/[\s\-\+]/g,'').trim();
}

async function redeemCode(){
  var d = C[lang];
  var phone = cleanPhone(G('phoneInp').value);
  var code = G('codeInp').value.trim().toUpperCase();

  if(!phone || phone.length < 8){showErr(d.errPhone);return;}
  if(!code || code.length < 5){showErr(d.errCode);return;}
  hideErr();

  var btn = G('submitBtn');
  btn.disabled = true;
  G('btnText').innerHTML = '<span class="spinner"></span>Checking...';

  try{
    var res = await fetch('/api/redeem',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({phone:phone, code:code})
    });
    var data = await res.json();

    if(data.success){
      // Store session
      if(data.access_token) localStorage.setItem('sb_access_token', data.access_token);
      if(data.refresh_token) localStorage.setItem('sb_refresh_token', data.refresh_token);
      localStorage.setItem('sb_purchased','1');
      localStorage.setItem('sb_purchased_time', Date.now().toString());
      localStorage.setItem('sb_phone', phone);
      // Show success
      G('formSection').style.display='none';
      var s=G('successSection');
      s.style.display='block';
      setT('successTitle',d.successTitle);
      setT('successSub',d.successSub);
      setT('openAppBtn',d.openAppBtn);
    } else {
      if(data.error==='used') showErr(d.errUsed);
      else showErr(d.errInvalid);
      btn.disabled=false;
      G('btnText').innerHTML=d.btnText;
    }
  }catch(e){
    showErr('Network error. Please try again.');
    btn.disabled=false;
    G('btnText').innerHTML=d.btnText;
  }
}

function openApp(){
  window.location.href='/app';
}

window.addEventListener('DOMContentLoaded',function(){
  var detected=(navigator.language||'').toLowerCase();
  if(detected.startsWith('bn')||detected.startsWith('bd')) lang='bd';
  G('btnUR').classList.toggle('on',lang==='ur');
  G('btnBD').classList.toggle('on',lang==='bd');
  render();
});
</script>
</body>
</html>
<!DOCTYPE html>
<html lang="ur">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<meta name="theme-color" content="#080E0A">
<title>Smart Bachat — Access Lo</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Hind:wght@400;500;600&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
:root{
  --bg:#080E0A;--bg2:#0D1A10;--bg3:#122318;
  --g1:#1B4332;--g3:#40916C;--g4:#74C69D;
  --gold:#F0C040;--amber:#F4A261;--red:#E07A7A;
  --tx:#EEF7F0;--ts:#B8D4BE;--tm:#5E8A68;
  --bd:rgba(116,198,157,.13);
}
body{
  font-family:'Hind',-apple-system,sans-serif;
  background:var(--bg);color:var(--tx);
  min-height:100vh;display:flex;align-items:center;justify-content:center;
  -webkit-font-smoothing:antialiased;padding:20px;
}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 80% 50% at 50% 0%,rgba(45,106,79,.15),transparent 60%);pointer-events:none;}

.card{
  width:100%;max-width:380px;
  background:var(--bg2);
  border:1.5px solid rgba(116,198,157,.2);
  border-radius:24px;padding:28px 24px;
  position:relative;overflow:hidden;
  box-shadow:0 20px 60px rgba(0,0,0,.5);
}
.card::before{content:'';position:absolute;top:0;left:8%;right:8%;height:1.5px;background:linear-gradient(90deg,transparent,var(--gold),transparent);}

.logo{text-align:center;margin-bottom:20px;}
.logo-ico{font-size:40px;display:block;margin-bottom:6px;}
.logo-name{font-family:'Baloo 2',sans-serif;font-weight:800;font-size:20px;color:var(--g4);}

.lang-btns{display:flex;gap:8px;justify-content:center;margin-bottom:20px;}
.lang-btn{padding:5px 16px;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;border:1.5px solid var(--bd);background:transparent;color:var(--tm);font-family:inherit;transition:all .2s;}
.lang-btn.on{background:var(--g3);border-color:var(--g3);color:#fff;}

.title{font-family:'Baloo 2',sans-serif;font-weight:800;font-size:22px;text-align:center;margin-bottom:6px;color:var(--tx);}
.subtitle{font-size:13px;color:var(--tm);text-align:center;margin-bottom:20px;line-height:1.6;}

.lbl{font-size:11px;letter-spacing:.1em;color:var(--tm);text-transform:uppercase;margin-bottom:8px;font-weight:700;}

/* Phone input */
.phone-wrap{display:flex;gap:8px;margin-bottom:12px;}
.phone-flag{
  background:var(--bg3);border:1.5px solid var(--bd);
  border-radius:12px;padding:14px 12px;
  font-size:16px;color:var(--ts);
  white-space:nowrap;flex-shrink:0;
  display:flex;align-items:center;gap:4px;
}
.inp{
  width:100%;background:var(--bg3);
  border:1.5px solid var(--bd);border-radius:12px;
  padding:14px 16px;color:var(--tx);font-size:16px;
  outline:none;transition:border-color .2s;
  -webkit-appearance:none;font-family:inherit;
}
.inp:focus{border-color:var(--g4);}
.inp::placeholder{color:var(--tm);}

/* Code input */
.code-inp{
  width:100%;background:var(--bg3);
  border:2px solid rgba(240,192,64,.3);border-radius:12px;
  padding:16px;color:var(--gold);
  font-size:26px;font-weight:800;
  font-family:'Baloo 2',sans-serif;
  outline:none;transition:border-color .2s;
  -webkit-appearance:none;
  text-align:center;letter-spacing:5px;
  text-transform:uppercase;margin-bottom:6px;
}
.code-inp:focus{border-color:var(--gold);}
.code-inp::placeholder{color:rgba(240,192,64,.3);letter-spacing:2px;font-size:15px;}
.inp-note{font-size:11px;color:var(--tm);margin-bottom:16px;line-height:1.6;text-align:center;}

/* Phone note */
.phone-note{
  background:rgba(116,198,157,.05);
  border:1px solid rgba(116,198,157,.15);
  border-radius:10px;padding:9px 12px;
  font-size:11px;color:var(--ts);
  line-height:1.6;margin-bottom:14px;
}

.btn{
  width:100%;padding:16px;
  background:linear-gradient(135deg,#F0C040,#F4A261);
  border:none;border-radius:14px;
  color:#0A1A10;font-size:18px;font-weight:800;
  cursor:pointer;font-family:'Baloo 2',sans-serif;
  box-shadow:0 6px 24px rgba(240,192,64,.3);
  transition:transform .15s;margin-bottom:12px;
}
.btn:active{transform:scale(.97);}
.btn:disabled{opacity:.6;transform:none;}
@keyframes pulse{0%,100%{box-shadow:0 6px 24px rgba(240,192,64,.3)}50%{box-shadow:0 6px 32px rgba(240,192,64,.55)}}
.btn:not(:disabled){animation:pulse 2.5s ease-in-out infinite;}

.msg{padding:12px 14px;border-radius:12px;font-size:13px;line-height:1.6;text-align:center;margin-bottom:10px;display:none;}
.msg.err{background:rgba(224,122,122,.08);border:1px solid rgba(224,122,122,.25);color:var(--red);}
.msg.ok{background:rgba(116,198,157,.08);border:1px solid rgba(116,198,157,.25);color:var(--g4);}

.spinner{display:inline-block;width:16px;height:16px;border:2px solid rgba(10,26,16,.3);border-top-color:#0A1A10;border-radius:50%;animation:spin .6s linear infinite;vertical-align:middle;margin-right:8px;}
@keyframes spin{to{transform:rotate(360deg)}}

/* Success */
.success{display:none;text-align:center;}
.success-ico{font-size:60px;margin-bottom:16px;}
.success-title{font-family:'Baloo 2',sans-serif;font-weight:800;font-size:22px;color:var(--g4);margin-bottom:8px;}
.success-sub{font-size:14px;color:var(--ts);margin-bottom:20px;line-height:1.7;}
.success-btn{width:100%;padding:16px;background:linear-gradient(135deg,#F0C040,#F4A261);border:none;border-radius:14px;color:#0A1A10;font-size:17px;font-weight:800;cursor:pointer;font-family:'Baloo 2',sans-serif;}

.divider{height:1px;background:linear-gradient(90deg,transparent,var(--bd),transparent);margin:14px 0;}
.back-link{display:block;text-align:center;font-size:13px;color:var(--tm);}

@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.card{animation:fadeUp .4s ease both;}
</style>
</head>
<body>
<div class="card">
  <div class="logo">
    <span class="logo-ico">💰</span>
    <div class="logo-name">SmartSaathi</div>
  </div>

  <div class="lang-btns">
    <button class="lang-btn on" id="btnUR" onclick="setLang('ur')">اردو</button>
    <button class="lang-btn" id="btnBD" onclick="setLang('bd')">বাংলা</button>
  </div>

  <!-- FORM -->
  <div id="formSection">
    <div class="title" id="formTitle">Access Code Daakhil Karein</div>
    <div class="subtitle" id="formSub">SmartSaathi ne jo code bheja hai woh yahan darj karein</div>

    <!-- Phone Number -->
    <div class="lbl" id="phoneLbl">Aapka WhatsApp Number</div>
    <div class="phone-wrap">
      <div class="phone-flag">🌍 +</div>
      <input class="inp" type="tel" id="phoneInp"
        placeholder="966XXXXXXXXX"
        inputmode="numeric" autocomplete="tel">
    </div>
    <div class="phone-note" id="phoneNote">
      📱 Wahi number daalen jo aapne payment ke waqt bheja tha — yahi aapka login hoga
    </div>

    <!-- Code -->
    <div class="lbl" id="codeLbl">Access Code</div>
    <input class="code-inp" type="text" id="codeInp"
      placeholder="SB-XXXX-XXXX"
      maxlength="12" autocomplete="off"
      oninput="this.value=this.value.toUpperCase().replace(/[^A-Z0-9-]/g,'')">
    <div class="inp-note" id="inpNote">Code SmartSaathi ne WhatsApp par bheja hai</div>

    <div class="msg err" id="errMsg"></div>

    <button class="btn" id="submitBtn" onclick="redeemCode()">
      <span id="btnText">✅ Access Lo — App Kholo</span>
    </button>

    <div class="divider"></div>
    <a class="back-link" href="/" id="backLink">← Wapas Jayen</a>
  </div>

  <!-- SUCCESS -->
  <div class="success" id="successSection">
    <div class="success-ico">🎉</div>
    <div class="success-title" id="successTitle">Mubarak ho! Access Mil Gaya!</div>
    <div class="success-sub" id="successSub">Aapka Smart Bachat tayaar hai. Neeche button dabao.</div>
    <button class="success-btn" onclick="openApp()" id="openAppBtn">💰 Smart Bachat Kholein</button>
  </div>
</div>

<script>
var lang = 'ur';

var C = {
  ur:{
    formTitle:'Access Code Daakhil Karein',
    formSub:'SmartSaathi ne jo code bheja hai woh yahan darj karein',
    phoneLbl:'Aapka WhatsApp Number',
    phonePlaceholder:'966XXXXXXXXX',
    phoneNote:'📱 Wahi number daalen jo aapne payment ke waqt bheja tha — yahi aapka login hoga',
    codeLbl:'Access Code',
    inpNote:'Code SmartSaathi ne WhatsApp par bheja hai',
    btnText:'✅ Access Lo — App Kholo',
    errPhone:'Sahi WhatsApp number daalen.',
    errCode:'Code daalna zaroori hai.',
    errInvalid:'Yeh code galat hai ya number se match nahi karta. SmartSaathi se dobara check karein.',
    errUsed:'Yeh code pehle hi use ho chuka hai.',
    successTitle:'Mubarak ho! Access Mil Gaya! 🎉',
    successSub:'Aapka Smart Bachat tayaar hai. Neeche button dabao — app abhi khulega.',
    openAppBtn:'💰 Smart Bachat Kholein',
    backLink:'← Wapas Jayen',
  },
  bd:{
    formTitle:'Access Code লিখুন',
    formSub:'SmartSaathi যে code পাঠিয়েছে সেটা এখানে লিখুন',
    phoneLbl:'আপনার WhatsApp নম্বর',
    phonePlaceholder:'966XXXXXXXXX',
    phoneNote:'📱 পেমেন্টের সময় যে নম্বর দিয়েছিলেন সেটা দিন — এটাই আপনার login হবে',
    codeLbl:'Access Code',
    inpNote:'Code SmartSaathi WhatsApp-এ পাঠিয়েছে',
    btnText:'✅ Access নিন — App খুলুন',
    errPhone:'সঠিক WhatsApp নম্বর দিন।',
    errCode:'Code দেওয়া আবশ্যক।',
    errInvalid:'এই code ভুল অথবা নম্বরের সাথে মিলছে না। SmartSaathi-কে জানান।',
    errUsed:'এই code আগেই ব্যবহার হয়ে গেছে।',
    successTitle:'মোবারক! Access পেয়ে গেছেন! 🎉',
    successSub:'আপনার Smart Bachat তৈরি। নিচের button চাপুন — App এখনই খুলবে।',
    openAppBtn:'💰 Smart Bachat খুলুন',
    backLink:'← ফিরে যান',
  }
};

function G(id){return document.getElementById(id);}
function setT(id,v){var e=G(id);if(e)e.textContent=v;}
function setH(id,v){var e=G(id);if(e)e.innerHTML=v;}

function setLang(l){
  lang=l;
  G('btnUR').classList.toggle('on',l==='ur');
  G('btnBD').classList.toggle('on',l==='bd');
  render();
}

function render(){
  var d=C[lang];
  setT('formTitle',d.formTitle);
  setT('formSub',d.formSub);
  setT('phoneLbl',d.phoneLbl);
  G('phoneInp').placeholder=d.phonePlaceholder;
  setT('phoneNote',d.phoneNote);
  setT('codeLbl',d.codeLbl);
  setT('inpNote',d.inpNote);
  setH('btnText',d.btnText);
  setT('backLink',d.backLink);
}

function showErr(msg){var e=G('errMsg');e.textContent=msg;e.style.display='block';}
function hideErr(){G('errMsg').style.display='none';}

function cleanPhone(p){
  // Remove spaces, dashes, plus signs
  return p.replace(/[\s\-\+]/g,'').trim();
}

async function redeemCode(){
  var d = C[lang];
  var phone = cleanPhone(G('phoneInp').value);
  var code = G('codeInp').value.trim().toUpperCase();

  if(!phone || phone.length < 8){showErr(d.errPhone);return;}
  if(!code || code.length < 5){showErr(d.errCode);return;}
  hideErr();

  var btn = G('submitBtn');
  btn.disabled = true;
  G('btnText').innerHTML = '<span class="spinner"></span>Checking...';

  try{
    var res = await fetch('/api/redeem',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({phone:phone, code:code})
    });
    var data = await res.json();

    if(data.success){
      // Store session
      if(data.access_token) localStorage.setItem('sb_access_token', data.access_token);
      if(data.refresh_token) localStorage.setItem('sb_refresh_token', data.refresh_token);
      localStorage.setItem('sb_purchased','1');
      localStorage.setItem('sb_purchased_time', Date.now().toString());
      localStorage.setItem('sb_phone', phone);
      // Show success
      G('formSection').style.display='none';
      var s=G('successSection');
      s.style.display='block';
      setT('successTitle',d.successTitle);
      setT('successSub',d.successSub);
      setT('openAppBtn',d.openAppBtn);
    } else {
      if(data.error==='used') showErr(d.errUsed);
      else showErr(d.errInvalid);
      btn.disabled=false;
      G('btnText').innerHTML=d.btnText;
    }
  }catch(e){
    showErr('Network error. Please try again.');
    btn.disabled=false;
    G('btnText').innerHTML=d.btnText;
  }
}

function openApp(){
  window.location.href='/app';
}

window.addEventListener('DOMContentLoaded',function(){
  var detected=(navigator.language||'').toLowerCase();
  if(detected.startsWith('bn')||detected.startsWith('bd')) lang='bd';
  G('btnUR').classList.toggle('on',lang==='ur');
  G('btnBD').classList.toggle('on',lang==='bd');
  render();
});
</script>
</body>
</html>
<!DOCTYPE html>
<html lang="ur">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<meta name="theme-color" content="#080E0A">
<title>Smart Bachat — Access Lo</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Hind:wght@400;500;600&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
:root{
  --bg:#080E0A;--bg2:#0D1A10;--bg3:#122318;
  --g1:#1B4332;--g3:#40916C;--g4:#74C69D;
  --gold:#F0C040;--amber:#F4A261;--red:#E07A7A;
  --tx:#EEF7F0;--ts:#B8D4BE;--tm:#5E8A68;
  --bd:rgba(116,198,157,.13);
}
body{
  font-family:'Hind',-apple-system,sans-serif;
  background:var(--bg);color:var(--tx);
  min-height:100vh;display:flex;align-items:center;justify-content:center;
  -webkit-font-smoothing:antialiased;padding:20px;
}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 80% 50% at 50% 0%,rgba(45,106,79,.15),transparent 60%);pointer-events:none;}

.card{
  width:100%;max-width:380px;
  background:var(--bg2);
  border:1.5px solid rgba(116,198,157,.2);
  border-radius:24px;padding:28px 24px;
  position:relative;overflow:hidden;
  box-shadow:0 20px 60px rgba(0,0,0,.5);
}
.card::before{content:'';position:absolute;top:0;left:8%;right:8%;height:1.5px;background:linear-gradient(90deg,transparent,var(--gold),transparent);}

.logo{text-align:center;margin-bottom:20px;}
.logo-ico{font-size:40px;display:block;margin-bottom:6px;}
.logo-name{font-family:'Baloo 2',sans-serif;font-weight:800;font-size:20px;color:var(--g4);}

.lang-btns{display:flex;gap:8px;justify-content:center;margin-bottom:20px;}
.lang-btn{padding:5px 16px;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;border:1.5px solid var(--bd);background:transparent;color:var(--tm);font-family:inherit;transition:all .2s;}
.lang-btn.on{background:var(--g3);border-color:var(--g3);color:#fff;}

.title{font-family:'Baloo 2',sans-serif;font-weight:800;font-size:22px;text-align:center;margin-bottom:6px;color:var(--tx);}
.subtitle{font-size:13px;color:var(--tm);text-align:center;margin-bottom:20px;line-height:1.6;}

.lbl{font-size:11px;letter-spacing:.1em;color:var(--tm);text-transform:uppercase;margin-bottom:8px;font-weight:700;}

/* Phone input */
.phone-wrap{display:flex;gap:8px;margin-bottom:12px;}
.phone-flag{
  background:var(--bg3);border:1.5px solid var(--bd);
  border-radius:12px;padding:14px 12px;
  font-size:16px;color:var(--ts);
  white-space:nowrap;flex-shrink:0;
  display:flex;align-items:center;gap:4px;
}
.inp{
  width:100%;background:var(--bg3);
  border:1.5px solid var(--bd);border-radius:12px;
  padding:14px 16px;color:var(--tx);font-size:16px;
  outline:none;transition:border-color .2s;
  -webkit-appearance:none;font-family:inherit;
}
.inp:focus{border-color:var(--g4);}
.inp::placeholder{color:var(--tm);}

/* Code input */
.code-inp{
  width:100%;background:var(--bg3);
  border:2px solid rgba(240,192,64,.3);border-radius:12px;
  padding:16px;color:var(--gold);
  font-size:26px;font-weight:800;
  font-family:'Baloo 2',sans-serif;
  outline:none;transition:border-color .2s;
  -webkit-appearance:none;
  text-align:center;letter-spacing:5px;
  text-transform:uppercase;margin-bottom:6px;
}
.code-inp:focus{border-color:var(--gold);}
.code-inp::placeholder{color:rgba(240,192,64,.3);letter-spacing:2px;font-size:15px;}
.inp-note{font-size:11px;color:var(--tm);margin-bottom:16px;line-height:1.6;text-align:center;}

/* Phone note */
.phone-note{
  background:rgba(116,198,157,.05);
  border:1px solid rgba(116,198,157,.15);
  border-radius:10px;padding:9px 12px;
  font-size:11px;color:var(--ts);
  line-height:1.6;margin-bottom:14px;
}

.btn{
  width:100%;padding:16px;
  background:linear-gradient(135deg,#F0C040,#F4A261);
  border:none;border-radius:14px;
  color:#0A1A10;font-size:18px;font-weight:800;
  cursor:pointer;font-family:'Baloo 2',sans-serif;
  box-shadow:0 6px 24px rgba(240,192,64,.3);
  transition:transform .15s;margin-bottom:12px;
}
.btn:active{transform:scale(.97);}
.btn:disabled{opacity:.6;transform:none;}
@keyframes pulse{0%,100%{box-shadow:0 6px 24px rgba(240,192,64,.3)}50%{box-shadow:0 6px 32px rgba(240,192,64,.55)}}
.btn:not(:disabled){animation:pulse 2.5s ease-in-out infinite;}

.msg{padding:12px 14px;border-radius:12px;font-size:13px;line-height:1.6;text-align:center;margin-bottom:10px;display:none;}
.msg.err{background:rgba(224,122,122,.08);border:1px solid rgba(224,122,122,.25);color:var(--red);}
.msg.ok{background:rgba(116,198,157,.08);border:1px solid rgba(116,198,157,.25);color:var(--g4);}

.spinner{display:inline-block;width:16px;height:16px;border:2px solid rgba(10,26,16,.3);border-top-color:#0A1A10;border-radius:50%;animation:spin .6s linear infinite;vertical-align:middle;margin-right:8px;}
@keyframes spin{to{transform:rotate(360deg)}}

/* Success */
.success{display:none;text-align:center;}
.success-ico{font-size:60px;margin-bottom:16px;}
.success-title{font-family:'Baloo 2',sans-serif;font-weight:800;font-size:22px;color:var(--g4);margin-bottom:8px;}
.success-sub{font-size:14px;color:var(--ts);margin-bottom:20px;line-height:1.7;}
.success-btn{width:100%;padding:16px;background:linear-gradient(135deg,#F0C040,#F4A261);border:none;border-radius:14px;color:#0A1A10;font-size:17px;font-weight:800;cursor:pointer;font-family:'Baloo 2',sans-serif;}

.divider{height:1px;background:linear-gradient(90deg,transparent,var(--bd),transparent);margin:14px 0;}
.back-link{display:block;text-align:center;font-size:13px;color:var(--tm);}

@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.card{animation:fadeUp .4s ease both;}
</style>
</head>
<body>
<div class="card">
  <div class="logo">
    <span class="logo-ico">💰</span>
    <div class="logo-name">SmartSaathi</div>
  </div>

  <div class="lang-btns">
    <button class="lang-btn on" id="btnUR" onclick="setLang('ur')">اردو</button>
    <button class="lang-btn" id="btnBD" onclick="setLang('bd')">বাংলা</button>
  </div>

  <!-- FORM -->
  <div id="formSection">
    <div class="title" id="formTitle">Access Code Daakhil Karein</div>
    <div class="subtitle" id="formSub">SmartSaathi ne jo code bheja hai woh yahan darj karein</div>

    <!-- Phone Number -->
    <div class="lbl" id="phoneLbl">Aapka WhatsApp Number</div>
    <div class="phone-wrap">
      <div class="phone-flag">🌍 +</div>
      <input class="inp" type="tel" id="phoneInp"
        placeholder="966XXXXXXXXX"
        inputmode="numeric" autocomplete="tel">
    </div>
    <div class="phone-note" id="phoneNote">
      📱 Wahi number daalen jo aapne payment ke waqt bheja tha — yahi aapka login hoga
    </div>

    <!-- Code -->
    <div class="lbl" id="codeLbl">Access Code</div>
    <input class="code-inp" type="text" id="codeInp"
      placeholder="SB-XXXX-XXXX"
      maxlength="12" autocomplete="off"
      oninput="this.value=this.value.toUpperCase().replace(/[^A-Z0-9-]/g,'')">
    <div class="inp-note" id="inpNote">Code SmartSaathi ne WhatsApp par bheja hai</div>

    <div class="msg err" id="errMsg"></div>

    <button class="btn" id="submitBtn" onclick="redeemCode()">
      <span id="btnText">✅ Access Lo — App Kholo</span>
    </button>

    <div class="divider"></div>
    <a class="back-link" href="/" id="backLink">← Wapas Jayen</a>
  </div>

  <!-- SUCCESS -->
  <div class="success" id="successSection">
    <div class="success-ico">🎉</div>
    <div class="success-title" id="successTitle">Mubarak ho! Access Mil Gaya!</div>
    <div class="success-sub" id="successSub">Aapka Smart Bachat tayaar hai. Neeche button dabao.</div>
    <button class="success-btn" onclick="openApp()" id="openAppBtn">💰 Smart Bachat Kholein</button>
  </div>
</div>

<script>
var lang = 'ur';

var C = {
  ur:{
    formTitle:'Access Code Daakhil Karein',
    formSub:'SmartSaathi ne jo code bheja hai woh yahan darj karein',
    phoneLbl:'Aapka WhatsApp Number',
    phonePlaceholder:'966XXXXXXXXX',
    phoneNote:'📱 Wahi number daalen jo aapne payment ke waqt bheja tha — yahi aapka login hoga',
    codeLbl:'Access Code',
    inpNote:'Code SmartSaathi ne WhatsApp par bheja hai',
    btnText:'✅ Access Lo — App Kholo',
    errPhone:'Sahi WhatsApp number daalen.',
    errCode:'Code daalna zaroori hai.',
    errInvalid:'Yeh code galat hai ya number se match nahi karta. SmartSaathi se dobara check karein.',
    errUsed:'Yeh code pehle hi use ho chuka hai.',
    successTitle:'Mubarak ho! Access Mil Gaya! 🎉',
    successSub:'Aapka Smart Bachat tayaar hai. Neeche button dabao — app abhi khulega.',
    openAppBtn:'💰 Smart Bachat Kholein',
    backLink:'← Wapas Jayen',
  },
  bd:{
    formTitle:'Access Code লিখুন',
    formSub:'SmartSaathi যে code পাঠিয়েছে সেটা এখানে লিখুন',
    phoneLbl:'আপনার WhatsApp নম্বর',
    phonePlaceholder:'966XXXXXXXXX',
    phoneNote:'📱 পেমেন্টের সময় যে নম্বর দিয়েছিলেন সেটা দিন — এটাই আপনার login হবে',
    codeLbl:'Access Code',
    inpNote:'Code SmartSaathi WhatsApp-এ পাঠিয়েছে',
    btnText:'✅ Access নিন — App খুলুন',
    errPhone:'সঠিক WhatsApp নম্বর দিন।',
    errCode:'Code দেওয়া আবশ্যক।',
    errInvalid:'এই code ভুল অথবা নম্বরের সাথে মিলছে না। SmartSaathi-কে জানান।',
    errUsed:'এই code আগেই ব্যবহার হয়ে গেছে।',
    successTitle:'মোবারক! Access পেয়ে গেছেন! 🎉',
    successSub:'আপনার Smart Bachat তৈরি। নিচের button চাপুন — App এখনই খুলবে।',
    openAppBtn:'💰 Smart Bachat খুলুন',
    backLink:'← ফিরে যান',
  }
};

function G(id){return document.getElementById(id);}
function setT(id,v){var e=G(id);if(e)e.textContent=v;}
function setH(id,v){var e=G(id);if(e)e.innerHTML=v;}

function setLang(l){
  lang=l;
  G('btnUR').classList.toggle('on',l==='ur');
  G('btnBD').classList.toggle('on',l==='bd');
  render();
}

function render(){
  var d=C[lang];
  setT('formTitle',d.formTitle);
  setT('formSub',d.formSub);
  setT('phoneLbl',d.phoneLbl);
  G('phoneInp').placeholder=d.phonePlaceholder;
  setT('phoneNote',d.phoneNote);
  setT('codeLbl',d.codeLbl);
  setT('inpNote',d.inpNote);
  setH('btnText',d.btnText);
  setT('backLink',d.backLink);
}

function showErr(msg){var e=G('errMsg');e.textContent=msg;e.style.display='block';}
function hideErr(){G('errMsg').style.display='none';}

function cleanPhone(p){
  // Remove spaces, dashes, plus signs
  return p.replace(/[\s\-\+]/g,'').trim();
}

async function redeemCode(){
  var d = C[lang];
  var phone = cleanPhone(G('phoneInp').value);
  var code = G('codeInp').value.trim().toUpperCase();

  if(!phone || phone.length < 8){showErr(d.errPhone);return;}
  if(!code || code.length < 5){showErr(d.errCode);return;}
  hideErr();

  var btn = G('submitBtn');
  btn.disabled = true;
  G('btnText').innerHTML = '<span class="spinner"></span>Checking...';

  try{
    var res = await fetch('/api/redeem',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({phone:phone, code:code})
    });
    var data = await res.json();

    if(data.success){
      // Store session
      if(data.access_token) localStorage.setItem('sb_access_token', data.access_token);
      if(data.refresh_token) localStorage.setItem('sb_refresh_token', data.refresh_token);
      localStorage.setItem('sb_purchased','1');
      localStorage.setItem('sb_purchased_time', Date.now().toString());
      localStorage.setItem('sb_phone', phone);
      // Show success
      G('formSection').style.display='none';
      var s=G('successSection');
      s.style.display='block';
      setT('successTitle',d.successTitle);
      setT('successSub',d.successSub);
      setT('openAppBtn',d.openAppBtn);
    } else {
      if(data.error==='used') showErr(d.errUsed);
      else showErr(d.errInvalid);
      btn.disabled=false;
      G('btnText').innerHTML=d.btnText;
    }
  }catch(e){
    showErr('Network error. Please try again.');
    btn.disabled=false;
    G('btnText').innerHTML=d.btnText;
  }
}

function openApp(){
  window.location.href='/app';
}

window.addEventListener('DOMContentLoaded',function(){
  var detected=(navigator.language||'').toLowerCase();
  if(detected.startsWith('bn')||detected.startsWith('bd')) lang='bd';
  G('btnUR').classList.toggle('on',lang==='ur');
  G('btnBD').classList.toggle('on',lang==='bd');
  render();
});
</script>
</body>
</html>
