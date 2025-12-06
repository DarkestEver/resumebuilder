/**
 * Populate Test Accounts with Sample Data (API Approach)
 * 
 * This script populates test accounts by directly calling the backend API
 * instead of interacting with the UI. This is faster and more reliable.
 * 
 * Run: npm run test:populate:api
 */

import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:5000/api';
const BASE_URL = 'http://localhost:3000';

// Sample account data
const SAMPLE_ACCOUNTS = [
  {
    email: 'mike.backend@test.com',
    password: 'TechPass123!',
    profile: {
      personalInfo: {
        firstName: 'Mike',
        lastName: 'Johnson',
        title: 'Backend Engineer',
      },
      contact: {
        email: 'mike.backend@test.com',
        phone: '+1-555-0101',
        location: 'San Francisco, CA',
        linkedin: 'https://linkedin.com/in/johndev',
        github: 'https://github.com/johndev',
        website: 'https://johndev.com',
      },
      summary: 'Experienced full-stack software engineer with 8+ years building scalable web applications. Specialized in React, Node.js, and cloud architecture. Led teams of 5+ engineers and delivered 20+ production systems serving millions of users.',
      experience: [
        {
          company: 'Tech Corp',
          position: 'Senior Software Engineer',
          location: 'San Francisco, CA',
          startDate: '2020-01',
          endDate: null,
          current: true,
          description: '• Led development of microservices architecture serving 5M+ users\n• Reduced API response time by 60% through optimization\n• Mentored 3 junior engineers and conducted code reviews\n• Implemented CI/CD pipeline reducing deployment time by 75%',
          highlights: ['Microservices', 'Performance', 'Leadership', 'DevOps'],
        },
        {
          company: 'StartupXYZ',
          position: 'Full Stack Developer',
          location: 'San Francisco, CA',
          startDate: '2018-06',
          endDate: '2019-12',
          current: false,
          description: '• Built React dashboard used by 500+ enterprise clients\n• Designed RESTful APIs handling 1M+ requests/day\n• Integrated payment processing (Stripe) with 99.9% uptime\n• Collaborated with design team on UX improvements',
          highlights: ['React', 'Node.js', 'APIs', 'Payments'],
        },
        {
          company: 'ConsultingCo',
          position: 'Software Developer',
          location: 'Palo Alto, CA',
          startDate: '2016-08',
          endDate: '2018-05',
          current: false,
          description: '• Developed web applications for Fortune 500 clients\n• Worked with legacy codebases and modernized tech stack\n• Implemented automated testing increasing code coverage to 85%\n• Participated in agile sprints and daily standups',
          highlights: ['Legacy Systems', 'Testing', 'Agile', 'Client Work'],
        },
      ],
      education: [
        {
          institution: 'Stanford University',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          location: 'Stanford, CA',
          startDate: '2012-09',
          endDate: '2016-06',
          gpa: '3.8',
          honors: ['Dean\'s List', 'CS Department Honors'],
          courses: ['Algorithms', 'Machine Learning', 'Databases', 'Systems Design'],
        },
      ],
      skills: [
        'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Express',
        'MongoDB', 'PostgreSQL', 'Redis', 'AWS', 'Docker', 'Kubernetes',
        'Git', 'CI/CD', 'REST APIs', 'GraphQL', 'Microservices', 'System Design'
      ],
      projects: [
        {
          name: 'E-Commerce Platform',
          description: 'Built full-stack e-commerce platform with payment processing',
          technologies: ['React', 'Node.js', 'Stripe', 'MongoDB'],
          url: 'https://github.com/johndev/ecommerce',
          startDate: '2021-01',
          endDate: '2021-06',
        },
      ],
      certifications: [
        {
          name: 'AWS Certified Solutions Architect',
          issuer: 'Amazon Web Services',
          date: '2022-05',
          credentialId: 'AWS-SA-12345',
          url: 'https://aws.amazon.com/certification/',
          expiryDate: '2025-05',
        },
      ],
      languages: [
        { language: 'English', proficiency: 'Native' },
        { language: 'Spanish', proficiency: 'Conversational' },
      ],
    },
    resumes: [
      {
        name: 'Senior Engineer Resume',
        templateId: 'modern',
        visibility: 'public',
      },
      {
        name: 'Tech Lead Resume',
        templateId: 'professional',
        visibility: 'private',
      },
    ],
  },
  {
    email: 'alex.devops@test.com',
    password: 'TechPass123!',
    profile: {
      personalInfo: {
        firstName: 'Alex',
        lastName: 'Rodriguez',
        title: 'DevOps Engineer',
      },
      contact: {
        email: 'alex.devops@test.com',
        phone: '+1-555-0202',
        location: 'New York, NY',
        linkedin: 'https://linkedin.com/in/sarahmartinez',
        website: 'https://sarahcontent.com',
      },
      summary: 'Results-driven content marketing professional with 5+ years creating engaging content strategies. Increased organic traffic by 300% and grew social media following to 50K+. Expert in SEO, content creation, and analytics.',
      experience: [
        {
          company: 'Digital Agency Inc',
          position: 'Content Marketing Manager',
          location: 'New York, NY',
          startDate: '2021-03',
          endDate: null,
          current: true,
          description: '• Manage content strategy for 20+ B2B clients\n• Increased average client organic traffic by 250%\n• Built and managed team of 5 content writers\n• Implemented SEO best practices across all content',
          highlights: ['Strategy', 'SEO', 'Team Management', 'B2B'],
        },
        {
          company: 'TechStartup Co',
          position: 'Content Specialist',
          location: 'Brooklyn, NY',
          startDate: '2019-01',
          endDate: '2021-02',
          current: false,
          description: '• Created 200+ blog posts and 50+ whitepapers\n• Grew email subscriber list from 500 to 15,000\n• Managed social media accounts (Twitter, LinkedIn)\n• Collaborated with design team on visual content',
          highlights: ['Writing', 'Email Marketing', 'Social Media', 'Growth'],
        },
      ],
      education: [
        {
          institution: 'New York University',
          degree: 'Bachelor of Arts',
          field: 'Marketing Communications',
          location: 'New York, NY',
          startDate: '2015-09',
          endDate: '2019-05',
          gpa: '3.6',
        },
      ],
      skills: [
        'Content Strategy', 'SEO', 'Copywriting', 'Social Media Marketing',
        'Google Analytics', 'Email Marketing', 'WordPress', 'HubSpot',
        'Content Management', 'Brand Strategy', 'Adobe Creative Suite'
      ],
      certifications: [
        {
          name: 'Google Analytics Certification',
          issuer: 'Google',
          date: '2023-01',
          credentialId: 'GA-CERT-67890',
        },
        {
          name: 'HubSpot Content Marketing',
          issuer: 'HubSpot Academy',
          date: '2022-08',
          credentialId: 'HS-CM-54321',
        },
      ],
    },
    resumes: [
      {
        name: 'Marketing Manager Resume',
        templateId: 'creative',
        visibility: 'public',
      },
    ],
  },
  {
    email: 'lisa.datascience@test.com',
    password: 'TechPass123!',
    profile: {
      personalInfo: {
        firstName: 'Lisa',
        lastName: 'Chen',
        title: 'Data Scientist',
      },
      contact: {
        email: 'lisa.datascience@test.com',
        phone: '+1-555-0303',
        location: 'Boston, MA',
        linkedin: 'https://linkedin.com/in/drjamessmith',
      },
      summary: 'Board-certified internal medicine physician with 10+ years of clinical experience. Specialized in preventive care and chronic disease management. Committed to patient-centered care and evidence-based medicine.',
      experience: [
        {
          company: 'Boston Medical Center',
          position: 'Attending Physician',
          location: 'Boston, MA',
          startDate: '2018-07',
          endDate: null,
          current: true,
          description: '• Provide comprehensive primary care to diverse patient population\n• Manage chronic conditions including diabetes, hypertension, COPD\n• Supervise resident physicians and medical students\n• Participate in hospital quality improvement initiatives',
          highlights: ['Primary Care', 'Teaching', 'Quality Improvement'],
        },
        {
          company: 'Community Health Clinic',
          position: 'Primary Care Physician',
          location: 'Cambridge, MA',
          startDate: '2014-08',
          endDate: '2018-06',
          current: false,
          description: '• Delivered primary care services to underserved communities\n• Conducted health screenings and preventive care programs\n• Collaborated with multidisciplinary healthcare team\n• Participated in community health education initiatives',
          highlights: ['Community Health', 'Prevention', 'Team Collaboration'],
        },
      ],
      education: [
        {
          institution: 'Harvard Medical School',
          degree: 'Doctor of Medicine (MD)',
          field: 'Medicine',
          location: 'Boston, MA',
          startDate: '2010-09',
          endDate: '2014-06',
          honors: ['Alpha Omega Alpha Honor Society'],
        },
        {
          institution: 'Massachusetts Institute of Technology',
          degree: 'Bachelor of Science',
          field: 'Biology',
          location: 'Cambridge, MA',
          startDate: '2006-09',
          endDate: '2010-06',
          gpa: '3.9',
          honors: ['Summa Cum Laude'],
        },
      ],
      skills: [
        'Internal Medicine', 'Primary Care', 'Chronic Disease Management',
        'Preventive Medicine', 'Patient Education', 'Clinical Research',
        'Electronic Medical Records', 'Telemedicine'
      ],
      certifications: [
        {
          name: 'Board Certification in Internal Medicine',
          issuer: 'American Board of Internal Medicine',
          date: '2014-08',
          credentialId: 'ABIM-12345',
        },
        {
          name: 'Advanced Cardiac Life Support (ACLS)',
          issuer: 'American Heart Association',
          date: '2023-06',
          credentialId: 'ACLS-67890',
          expiryDate: '2025-06',
        },
      ],
    },
    resumes: [
      {
        name: 'Physician CV',
        templateId: 'classic',
        visibility: 'private',
      },
    ],
  },
];

// Helper to get auth token
async function loginAndGetToken(email: string, password: string): Promise<string> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || `${response.status} ${response.statusText}`;
    throw new Error(`Login failed: ${errorMessage}`);
  }

  const data = await response.json();
  return data.data?.tokens?.accessToken || data.token || data.accessToken;
}

// Helper to create/update profile
async function createProfile(token: string, profileData: any): Promise<void> {
  const response = await fetch(`${API_URL}/profiles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    // Try PUT if POST fails (profile might exist)
    const putResponse = await fetch(`${API_URL}/profiles`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!putResponse.ok) {
      throw new Error(`Profile creation/update failed: ${putResponse.status}`);
    }
  }
}

// Helper to create resume
async function createResume(token: string, resumeData: any): Promise<string> {
  const response = await fetch(`${API_URL}/resumes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(resumeData),
  });

  if (!response.ok) {
    throw new Error(`Resume creation failed: ${response.status}`);
  }

  const data = await response.json();
  return data._id || data.id;
}

test.describe('Populate Test Accounts via API', () => {
  test.setTimeout(120000); // 2 minutes per test

  for (const account of SAMPLE_ACCOUNTS) {
    test(`Populate ${account.email}`, async ({ page }) => {
      console.log(`\n🔄 Processing ${account.email}...`);

      try {
        // Step 1: Login and get token
        console.log('  1️⃣ Logging in...');
        const token = await loginAndGetToken(account.email, account.password);
        console.log('  ✅ Login successful');

        // Step 2: Create/Update Profile
        console.log('  2️⃣ Creating profile...');
        await createProfile(token, account.profile);
        console.log('  ✅ Profile created');

        // Step 3: Create Resumes
        console.log('  3️⃣ Creating resumes...');
        for (const resume of account.resumes) {
          const resumeId = await createResume(token, resume);
          console.log(`  ✅ Resume "${resume.name}" created (ID: ${resumeId})`);
        }

        console.log(`✅ Successfully populated ${account.email}\n`);
      } catch (error) {
        console.error(`❌ Failed to populate ${account.email}:`, error);
        throw error;
      }
    });
  }
});

test.describe('Verify Sample Data via UI', () => {
  test('Verify accounts can login and view data', async ({ page }) => {
    for (const account of SAMPLE_ACCOUNTS) {
      console.log(`\n🔍 Verifying ${account.email}...`);

      // Login
      await page.goto(`${BASE_URL}/login`);
      await page.fill('input[type="email"]', account.email);
      await page.fill('input[type="password"]', account.password);
      await page.click('button[type="submit"]');
      await page.waitForLoadState('networkidle');

      // Check dashboard loads
      await page.goto(`${BASE_URL}/dashboard`);
      await page.waitForLoadState('networkidle');

      // Check profile exists
      await page.goto(`${BASE_URL}/profile`);
      await page.waitForLoadState('networkidle');
      
      // Verify profile data is visible
      const firstName = account.profile.personalInfo.firstName;
      const hasContent = await page.locator(`text=${firstName}`).count() > 0;
      expect(hasContent).toBeTruthy();

      console.log(`✅ ${account.email} verified`);

      // Logout
      await page.goto(`${BASE_URL}/logout`);
      await page.waitForLoadState('networkidle');
    }
  });
});
