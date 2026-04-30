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
  const fs = require('fs');

  // Use the registration token from previous step
  // This token was returned when we registered admin2
  console.log('Step 1 - Login with admin2...');
  const auth = await req('POST', '/auth/user/emailpass', {
    email: 'admin2@mammasmaternity.in',
    password: 'Mammas@2026'
  });
  const registerToken = auth.body.token;
  console.log('Got token');

  // Step 2 - Create the user record using the registration token
  // This links the auth identity to a user record
  console.log('Step 2 - Create user record to link auth identity...');
  const createUser = await req('POST', '/admin/users', {
    email: 'admin2@mammasmaternity.in',
    first_name: 'Narendra',
    last_name: 'Jain'
  }, registerToken);
  console.log('Create user:', JSON.stringify(createUser, null, 2));

  // Step 3 - Try the invite approach for original admin
  console.log('Step 3 - Create invite for original admin...');
  
  // First get any working token
  // Try the original user
  const auth1 = await req('POST', '/auth/user/emailpass', {
    email: 'admin@mammasmaternity.in', 
    password: 'Mammas@2026'
  });
  
  // Step 4 - Check what endpoints are available without auth
  console.log('Step 4 - Check store products (no auth needed)...');
  const products = await req('GET', '/store/products', null, null);
  console.log('Store products:', JSON.stringify(products, null, 2));

  // Step 5 - Try creating invite without auth
  // In Medusa v2 invites can be created via a special route
  console.log('Step 5 - Try accept-invite flow...');
  
  // First create invite 
  const invite = await req('POST', '/admin/invites', {
    email: 'admin3@mammasmaternity.in'
  }, registerToken);
  console.log('Invite result:', JSON.stringify(invite, null, 2));

  // Step 6 - Try Medusa v2 specific user creation
  console.log('Step 6 - Try v2 user creation endpoint...');
  const v2user = await req('POST', '/admin/users', {
    email: 'admin@mammasmaternity.in',
  }, registerToken);
  console.log('V2 user:', JSON.stringify(v2user, null, 2));
}

main().catch(function(err) { console.error('Error:', err); });
