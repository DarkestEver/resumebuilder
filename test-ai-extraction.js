const axios = require('axios');

// Sample resume text
const resumeText = `
JOHN DOE
Senior Software Engineer

Email: john.doe@example.com
Phone: +1-555-0123
LinkedIn: linkedin.com/in/johndoe
GitHub: github.com/johndoe

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years building scalable web applications.
Expert in full-stack development with focus on React, Node.js, and cloud technologies.

WORK EXPERIENCE

Senior Software Engineer | Tech Corp | San Francisco, CA
January 2020 - Present
- Developed microservices architecture using Node.js and Express, improving system performance by 40%
- Led team of 5 developers in building customer-facing React applications
- Implemented CI/CD pipelines reducing deployment time by 60%
- Technologies: React, Node.js, AWS, Docker, PostgreSQL

Software Engineer | StartupXYZ | New York, NY
June 2018 - December 2019
- Built RESTful APIs serving 100k+ daily active users
- Designed and implemented MongoDB database schemas
- Collaborated with product team to deliver features on tight deadlines

EDUCATION

Bachelor of Science in Computer Science
Massachusetts Institute of Technology | 2014-2018
GPA: 3.8/4.0

SKILLS

Programming Languages: JavaScript, TypeScript, Python, Java
Frontend: React, Next.js, Vue.js, HTML5, CSS3, TailwindCSS
Backend: Node.js, Express, Django, Spring Boot
Databases: PostgreSQL, MongoDB, Redis
Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD

PROJECTS

E-commerce Platform
- Built full-stack e-commerce application using MERN stack
- Implemented payment integration with Stripe
- Technologies: MongoDB, Express, React, Node.js
- GitHub: github.com/johndoe/ecommerce-platform

CERTIFICATIONS

AWS Certified Solutions Architect | Amazon Web Services
Issued: March 2022 | Expires: March 2025

LANGUAGES

English - Native
Spanish - Professional Working Proficiency
`;

// Test AI extraction
async function testAIExtraction() {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'your-key-here';
  
  const prompt = `Extract the following information from this resume/CV text and return it as JSON. Be precise and extract only information that is explicitly present.

Resume Text:
"""
${resumeText.slice(0, 8000)}
"""

Return a JSON object with this exact structure (omit fields if not found):
{
  "personalInfo": {
    "firstName": "string",
    "lastName": "string",
    "title": "string (job title/headline)"
  },
  "contact": {
    "email": "string",
    "phone": "string",
    "linkedin": "string (full URL)",
    "github": "string (full URL)"
  },
  "summary": "string (professional summary/objective)",
  "experience": [
    {
      "title": "string",
      "company": "string",
      "location": "string",
      "startDate": "YYYY-MM format",
      "endDate": "YYYY-MM or 'Present'",
      "current": boolean,
      "description": "string"
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "gpa": "string"
    }
  ],
  "skills": [
    {
      "name": "string",
      "category": "Technical/Soft/Language",
      "level": "Intermediate"
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": "string",
      "github": "string"
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "date": "YYYY-MM"
    }
  ],
  "languages": [
    {
      "name": "string",
      "proficiency": "Native/Professional/Basic"
    }
  ]
}

Return ONLY the JSON object, no additional text.`;

  try {
    console.log('🚀 Testing AI CV Extraction...\n');
    console.log('Sending request to OpenAI GPT-4o-mini...\n');
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert CV/Resume parser. Extract information accurately and return valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 3000,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    const extracted = JSON.parse(aiResponse);
    
    console.log('✅ AI Extraction Successful!\n');
    console.log('📊 Token Usage:', response.data.usage);
    console.log('💰 Cost: $', ((response.data.usage.prompt_tokens * 0.15 + response.data.usage.completion_tokens * 0.60) / 1000000).toFixed(6));
    console.log('\n📝 Extracted Data:\n');
    console.log(JSON.stringify(extracted, null, 2));
    
    // Verify extraction accuracy
    console.log('\n✅ Accuracy Check:');
    console.log('- Name:', extracted.personalInfo?.firstName, extracted.personalInfo?.lastName);
    console.log('- Title:', extracted.personalInfo?.title);
    console.log('- Email:', extracted.contact?.email);
    console.log('- Phone:', extracted.contact?.phone);
    console.log('- Experience count:', extracted.experience?.length);
    console.log('- Education count:', extracted.education?.length);
    console.log('- Skills count:', extracted.skills?.length);
    console.log('- Projects count:', extracted.projects?.length);
    console.log('- Certifications count:', extracted.certifications?.length);
    console.log('- Languages count:', extracted.languages?.length);
    
  } catch (error) {
    console.error('❌ AI Extraction Failed:', error.response?.data || error.message);
  }
}

testAIExtraction();
