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
        try { resolve(JSON.parse(d)); }
        catch(e) { resolve({raw: d}); }
      });
    });
    r.on('error', reject);
    if (body) r.write(body);
    r.end();
  });
}

async function main() {
  const fs = require('fs');

  console.log('Step 1 - Login with emailpass...');
  const auth = await req('POST', '/auth/user/emailpass', {
    email: 'admin@mammasmaternity.in',
    password: 'Mammas@2026'
  });
  console.log('Auth response:', JSON.stringify(auth));

  if (!auth.token) {
    console.log('Login failed. Trying token endpoint...');
    return;
  }

  console.log('Step 2 - Refresh token...');
  const refreshed = await req('POST', '/auth/token/refresh', 
    null, auth.token);
  console.log('Refresh response:', JSON.stringify(refreshed));

  const finalToken = refreshed.token || auth.token;
  console.log('Using token length:', finalToken.length);

  console.log('Step 3 - Test admin access...');
  const test = await req('GET', '/admin/users/me', null, finalToken);
  console.log('Admin test:', JSON.stringify(test));

  console.log('Step 4 - Create API key...');
  const apiKey = await req('POST', '/admin/api-keys', {
    title: 'Mammas Frontend Key',
    type: 'publishable'
  }, finalToken);
  console.log('API Key result:', JSON.stringify(apiKey, null, 2));

  if (apiKey.api_key) {
    fs.writeFileSync('publishable_key.txt', apiKey.api_key.token);
    console.log('');
    console.log('=== YOUR PUBLISHABLE KEY ===');
    console.log(apiKey.api_key.token);
    console.log('===========================');
  }
}

main().catch(function(err) { console.error('Error:', err); });
