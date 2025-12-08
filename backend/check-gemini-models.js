/**
 * List available Gemini models for your API key
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in .env file');
    process.exit(1);
  }

  console.log('🔍 Checking Gemini API Key and Available Models...\n');
  console.log('API Key:', apiKey.substring(0, 20) + '...');
  console.log();

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try to list models
    console.log('📋 Attempting to list available models...\n');
    
    // Test with different model names that might work
    const modelsToTry = [
      'gemini-2.0-flash',
      'gemini-2.0-flash-exp',
      'gemini-1.5-flash-latest',
      'gemini-1.5-pro-latest', 
      'gemini-1.0-pro',
      'gemini-pro',
      'gemini-1.5-flash',
      'gemini-1.5-pro'
    ];

    console.log('🧪 Testing which models work with your API key...\n');

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Say "Hello"');
        const response = result.response;
        console.log(`✅ ${modelName} - WORKS!`);
        console.log(`   Response: ${response.text().substring(0, 50)}...`);
        console.log();
      } catch (error) {
        console.log(`❌ ${modelName} - Not available`);
      }
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.error('\n⚠️  Your API key appears to be invalid or expired.');
      console.error('\nTo get a new API key:');
      console.error('1. Visit: https://makersuite.google.com/app/apikey');
      console.error('2. Click "Create API Key"');
      console.error('3. Copy the key and update GEMINI_API_KEY in backend/.env');
    } else if (error.message.includes('404')) {
      console.error('\n⚠️  The API endpoint returned 404.');
      console.error('This might mean:');
      console.error('1. Your API key is invalid or expired');
      console.error('2. The Gemini API service has changed');
      console.error('3. Your region may not have access');
      console.error('\nTry getting a fresh API key from:');
      console.error('https://aistudio.google.com/app/apikey');
    }
  }
}

listModels().catch(console.error);
