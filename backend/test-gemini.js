/**
 * Test script to verify Gemini AI integration
 * Run with: node test-gemini.js
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  console.log('🧪 Testing Gemini AI Integration...\n');
  
  // Check if API key is configured
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in .env file');
    console.log('\nPlease add your Gemini API key to backend/.env:');
    console.log('GEMINI_API_KEY=your-api-key-here');
    console.log('\nGet your API key from: https://makersuite.google.com/app/apikey');
    process.exit(1);
  }

  console.log('✅ API Key found:', apiKey.substring(0, 10) + '...');
  console.log('📝 Provider:', process.env.AI_PRIMARY_PROVIDER || 'gemini');
  console.log('🤖 Model:', process.env.GEMINI_MODEL || 'gemini-2.0-flash');
  console.log();

  try {
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    });

    // Test 1: Simple text generation
    console.log('🧪 Test 1: Simple Text Generation');
    console.log('Prompt: "Improve this resume bullet: Worked on projects"\n');
    
    const prompt1 = `You are a resume expert. Improve this bullet point to be more impactful and professional:

"Worked on projects"

Return only the improved bullet point, nothing else.`;

    const result1 = await model.generateContent(prompt1);
    const response1 = result1.response;
    
    console.log('✅ Response:', response1.text());
    console.log('📊 Tokens used:', response1.usageMetadata?.totalTokenCount || 'N/A');
    console.log();

    // Test 2: JSON generation
    console.log('🧪 Test 2: JSON Mode (Resume Data Extraction)');
    console.log('Testing structured JSON output...\n');

    const model2 = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 800,
        responseMimeType: 'application/json',
      },
    });

    const prompt2 = `Extract information from this resume text and return as JSON:

"John Doe
Software Engineer
Email: john@example.com
Phone: (555) 123-4567

Experience:
- Senior Developer at Tech Corp (2020-Present)
  Led team of 5 developers, increased performance by 40%

Skills: JavaScript, Python, React, Node.js"

Return JSON with this structure:
{
  "name": "string",
  "title": "string",
  "email": "string",
  "phone": "string",
  "experience": [{"title": "string", "company": "string", "years": "string", "description": "string"}],
  "skills": ["string"]
}`;

    const result2 = await model2.generateContent(prompt2);
    const response2 = result2.response;
    const jsonData = JSON.parse(response2.text());
    
    console.log('✅ JSON Response:', JSON.stringify(jsonData, null, 2));
    console.log('📊 Tokens used:', response2.usageMetadata?.totalTokenCount || 'N/A');
    console.log();

    // Test 3: ATS Scoring (like the PDF scoring feature)
    console.log('🧪 Test 3: ATS Resume Scoring');
    console.log('Testing comprehensive resume analysis...\n');

    const model3 = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1500,
        responseMimeType: 'application/json',
      },
    });

    const prompt3 = `Analyze this resume for ATS compatibility and return JSON:

Resume:
"Senior Software Engineer with 5 years experience in full-stack development.
Proficient in React, Node.js, Python, Docker.
Led team of 8 developers at TechCorp.
Increased application performance by 45%.
Bachelor's in Computer Science from MIT."

Return JSON:
{
  "overallScore": <number 0-100>,
  "strengths": ["<strength 1>", "<strength 2>"],
  "weaknesses": ["<weakness 1>"],
  "keywords": {
    "found": ["React", "Node.js"],
    "missing": ["CI/CD", "Agile"]
  }
}`;

    const result3 = await model3.generateContent(prompt3);
    const response3 = result3.response;
    const scoreData = JSON.parse(response3.text());
    
    console.log('✅ ATS Score:', scoreData.overallScore + '/100');
    console.log('✅ Strengths:', scoreData.strengths?.length || 0);
    console.log('✅ Weaknesses:', scoreData.weaknesses?.length || 0);
    console.log('📊 Tokens used:', response3.usageMetadata?.totalTokenCount || 'N/A');
    console.log();

    // Summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('🎉 ALL TESTS PASSED!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ Gemini AI is working correctly');
    console.log('✅ Text generation: Working');
    console.log('✅ JSON mode: Working');
    console.log('✅ ATS scoring: Working');
    console.log();
    console.log('Your application is ready to use Gemini AI! 🚀');
    console.log();
    console.log('Current configuration:');
    console.log('- Provider: Gemini');
    console.log('- Model: ' + (process.env.GEMINI_MODEL || 'gemini-1.5-flash'));
    console.log('- API Key: Configured ✓');
    console.log();

  } catch (error) {
    console.error('❌ TEST FAILED!');
    console.error();
    console.error('Error:', error.message);
    console.error();
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.error('🔑 Your API key appears to be invalid.');
      console.error('Please check your GEMINI_API_KEY in backend/.env');
      console.error('Get a new key from: https://makersuite.google.com/app/apikey');
    } else if (error.message.includes('quota')) {
      console.error('⚠️  You may have exceeded your API quota.');
      console.error('Wait a few minutes or check your quota at:');
      console.error('https://console.cloud.google.com/');
    } else {
      console.error('Full error details:', error);
    }
    
    process.exit(1);
  }
}

// Run tests
testGemini().catch(console.error);
