const https = require('https');

function req(method, path, data, token, extraHeaders) {
  return new Promise((resolve, reject) => {
    const body = data ? JSON.stringify(data) : null;
    const headers = {'Content-Type': 'application/json'};
    if (token) headers['Authorization'] = 'Bearer ' + token;
    if (extraHeaders) Object.assign(headers, extraHeaders);
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
  console.log('Step 1 - Register fresh admin user...');
  const register = await req('POST', 
    '/auth/user/emailpass/register', {
    email: 'admin2@mammasmaternity.in',
    password: 'Mammas@2026'
  });
  console.log('Register:', JSON.stringify(register, null, 2));

  console.log('Step 2 - Login with new user...');
  const auth = await req('POST', 
    '/auth/user/emailpass', {
    email: 'admin2@mammasmaternity.in',
    password: 'Mammas@2026'
  });
  console.log('Login:', JSON.stringify(auth, null, 2));

  if (!auth.body || !auth.body.token) {
    console.log('Login failed');
    return;
  }

  const token = auth.body.token;
  const payload = JSON.parse(
    Buffer.from(token.split('.')[1], 'base64').toString()
  );
  console.log('New JWT actor_id:', payload.actor_id);

  if (payload.actor_id) {
    console.log('actor_id is set - testing admin access...');
    const test = await req('GET', 
      '/admin/users/me', null, token);
    console.log('Admin test:', JSON.stringify(test, null, 2));

    console.log('Creating API key...');
    const apiKey = await req('POST', '/admin/api-keys', {
      title: 'Mammas Frontend Key',
      type: 'publishable'
    }, token);
    console.log('API Key:', JSON.stringify(apiKey, null, 2));

    if (apiKey.body && apiKey.body.api_key) {
      require('fs').writeFileSync(
        'publishable_key.txt', 
        apiKey.body.api_key.token
      );
      console.log('');
      console.log('=== YOUR PUBLISHABLE KEY ===');
      console.log(apiKey.body.api_key.token);
      console.log('===========================');
    }
  } else {
    console.log('actor_id still empty - need database fix');
    console.log('auth_identity_id:', payload.auth_identity_id);
  }
}

main().catch(function(err) { console.error('Error:', err); });
