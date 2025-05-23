const fetch = require('node-fetch');

const API_URL = 'http://localhost:3001';
const testUser = {
  name: 'Smoke Test User',
  email: `smoketest_${Date.now()}@example.com`,
  password: 'TestPassword123!'
};

async function main() {
  // Helper to print results
  const print = (desc, res, body) => {
    console.log(`\n[${desc}] Status: ${res.status}`);
    if (typeof body === 'object') {
      console.log(JSON.stringify(body, null, 2));
    } else {
      console.log(body);
    }
  };

  // 1. Root endpoint
  let res = await fetch(`${API_URL}/`);
  let body = await res.json();
  print('GET /', res, body);

  // 2. Signup
  res = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser)
  });
  body = await res.json().catch(() => ({}));
  print('POST /api/auth/signup', res, body);

  // 3. Login
  res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testUser.email, password: testUser.password })
  });
  body = await res.json().catch(() => ({}));
  print('POST /api/auth/login', res, body);

  const token = body.token;
  if (!token) {
    console.error('Login failed, cannot test protected endpoints.');
    return;
  }
  const authHeader = { Authorization: `Bearer ${token}` };

  // 4. Get user profile
  res = await fetch(`${API_URL}/api/users/me`, { headers: authHeader });
  body = await res.json().catch(() => ({}));
  print('GET /api/users/me', res, body);

  // 5. Get user credits
  res = await fetch(`${API_URL}/api/users/credits`, { headers: authHeader });
  body = await res.json().catch(() => ({}));
  print('GET /api/users/credits', res, body);

  // 6. Get subscription plans
  res = await fetch(`${API_URL}/api/subscriptions`);
  body = await res.json().catch(() => ({}));
  print('GET /api/subscriptions', res, body);

  // 7. Humanize text
  res = await fetch(`${API_URL}/api/text/humanize`, {
    method: 'POST',
    headers: { ...authHeader, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'This is a test for humanization.' })
  });
  body = await res.json().catch(() => ({}));
  print('POST /api/text/humanize', res, body);

  // 8. Get text history
  res = await fetch(`${API_URL}/api/text/history`, { headers: authHeader });
  body = await res.json().catch(() => ({}));
  print('GET /api/text/history', res, body);
}

main().catch(err => {
  console.error('Smoke test error:', err);
}); 