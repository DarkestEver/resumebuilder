/**
 * Test Public Profile API Response
 */

const axios = require('axios');

async function testPublicProfile() {
  try {
    const username = 'pmnancy'; // Username from the screenshot
    const url = `http://localhost:5000/api/public/profile/${username}`;
    
    console.log(`🔍 Fetching: ${url}\n`);
    
    const response = await axios.get(url);
    
    console.log('✅ Response Status:', response.status);
    console.log('\n📊 Response Data:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Check if video profile is included
    if (response.data?.data?.profile?.videoProfile) {
      console.log('\n📹 Video Profile Data:');
      console.log(JSON.stringify(response.data.data.profile.videoProfile, null, 2));
    } else {
      console.log('\n⚠️  No video profile data in response');
      console.log('Profile keys:', Object.keys(response.data?.data?.profile || {}));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testPublicProfile();
