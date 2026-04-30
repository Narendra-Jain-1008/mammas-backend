const https = require('https');

function req(method, path, data, token) {
  return new Promise((resolve, reject) => {
    const body = data ? JSON.stringify(data) : null;
    const headers = {'Content-Type': 'application/json'};
    if (token) headers['Authorization'] = 'Bearer ' + token;
    if (body) headers['Content-Length'] = Buffer.byteLength(body);
    const options = {
      hostname: 'mammas-backend-production.up.railway.app',
      path: path,
      method: method,
      headers: headers
    };
    const r = https.request(options, function(res) {
      let d = '';
      res.on('data', function(c) { d += c; });
      res.on('end', function() {
        try { resolve({status: res.statusCode, body: JSON.parse(d)}); }
        catch(e) { resolve({status: res.statusCode, body: {raw: d}}); }
      });
    });
    r.on('error', reject);
    if (body) r.write(body);
    r.end();
  });
}

async function main() {
  console.log('Testing what endpoints work...');
  
  // Test 1: store products
  const p = await req('GET', '/store/products', null, null);
  console.log('Store products status:', p.status);
  
  // Test 2: health
  const h = await req('GET', '/health', null, null);
  console.log('Health:', h.status, JSON.stringify(h.body));

  // Test 3: try the invite accept endpoint
  // Get fresh token
  const auth = await req('POST', '/auth/user/emailpass', {
    email: 'admin2@mammasmaternity.in',
    password: 'Mammas@2026'
  });
  const token = auth.body.token;
  console.log('Got token, actor_id empty:', 
    !JSON.parse(Buffer.from(token.split('.')[1],'base64').toString()).actor_id);

  // Test 4: Try the create user with unregistered token
  // The key insight: POST /admin/users needs 
  // allowUnregistered middleware
  const user = await req('POST', '/admin/users', {
    email: 'admin2@mammasmaternity.in',
    first_name: 'Narendra',
    last_name: 'Jain'
  }, token);
  console.log('Create user attempt:', 
    user.status, JSON.stringify(user.body));

  // Test 5: Try the invite accept flow
  // Create invite first (no auth needed in some versions)
  const inv = await req('POST', '/admin/invites/accept', {
    token: token,
    first_name: 'Narendra',
    last_name: 'Jain'
  }, null);
  console.log('Accept invite:', 
    inv.status, JSON.stringify(inv.body));
}

main().catch(function(e) { console.error(e); });
