/**
 * Quick Gemini test - single request
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function quickTest() {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

  console.log('🧪 Quick Gemini Test\n');
  console.log('Model:', model);
  console.log('API Key:', apiKey.substring(0, 15) + '...\n');

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const geminiModel = genAI.getGenerativeModel({ model });

    console.log('Sending request: "Improve this: Worked on projects"\n');
    
    const result = await geminiModel.generateContent(
      'You are a resume expert. Improve this bullet point: "Worked on projects". Make it impactful and professional. Return only the improved version.'
    );
    
    const response = result.response;
    
    console.log('✅ SUCCESS!\n');
    console.log('Response:', response.text());
    console.log('\n📊 Tokens:', response.usageMetadata?.totalTokenCount || 'N/A');
    console.log('\n🎉 Gemini AI is working perfectly!');
    console.log('\nYour configuration:');
    console.log('- Provider: gemini');
    console.log('- Model:', model);
    console.log('- Status: ✅ Active and Working');

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('429')) {
      console.log('\n⚠️  Rate limit hit. Wait 1 minute and try again.');
      console.log('Free tier limits: 15 requests/minute');
    }
  }
}

quickTest();
