// Quick test to check API responses
const fetch = require('node-fetch');

async function testAPI() {
  try {
    // Test login
    console.log('1️⃣ Testing login...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'mike.backend@test.com',
        password: 'TechPass123!'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login response:', JSON.stringify(loginData, null, 2));
    
    if (!loginData.data?.tokens?.accessToken) {
      console.error('❌ No accessToken found!');
      return;
    }
    
    const token = loginData.data.tokens.accessToken;
    console.log(`✅ Got token: ${token.substring(0, 20)}...`);
    
    // Test profile GET
    console.log('\n2️⃣ Testing GET /api/profiles...');
    const getResponse = await fetch('http://localhost:5000/api/profiles', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('GET Status:', getResponse.status);
    const getData = await getResponse.json();
    console.log('GET response:', JSON.stringify(getData, null, 2));
    
    // Test profile POST
    console.log('\n3️⃣ Testing POST /api/profiles...');
    const postResponse = await fetch('http://localhost:5000/api/profiles', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalInfo: {
          firstName: 'Sarah',
          lastName: 'Martinez'
        },
        contact: {
          email: 'sarah.content@test.com'
        }
      })
    });
    console.log('POST Status:', postResponse.status);
    const postData = await postResponse.json();
    console.log('POST response:', JSON.stringify(postData, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPI();
