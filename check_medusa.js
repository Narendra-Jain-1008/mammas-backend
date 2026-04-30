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

  console.log('Step 1 - Login...');
  const auth = await req('POST', '/auth/user/emailpass', {
    email: 'admin@mammasmaternity.in',
    password: 'Mammas@2026'
  });
  const token = auth.token;
  console.log('Token actor_id check - decoding JWT...');
  
  // Decode JWT payload to see actor_id
  const payload = JSON.parse(
    Buffer.from(token.split('.')[1], 'base64').toString()
  );
  console.log('JWT payload:', JSON.stringify(payload, null, 2));

  console.log('Step 2 - Try to create user linked to auth...');
  const createUser = await req('POST', '/admin/users', {
    email: 'admin@mammasmaternity.in',
    first_name: 'Narendra',
    last_name: 'Jain'
  }, token);
  console.log('Create user result:', 
    JSON.stringify(createUser, null, 2));

  console.log('Step 3 - Try invite flow...');
  const invite = await req('POST', '/admin/invites', {
    email: 'admin@mammasmaternity.in'
  }, token);
  console.log('Invite result:', JSON.stringify(invite, null, 2));

  console.log('Step 4 - Check auth identity...');
  const identity = await req('GET', 
    '/admin/auth-identity', null, token);
  console.log('Identity:', JSON.stringify(identity, null, 2));
}

main().catch(function(err) { console.error('Error:', err); });
