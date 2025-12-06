import { test, expect, type Page } from '@playwright/test';

/**
 * Playwright Script: Populate Test Accounts with Complete Sample Data
 * 
 * This script logs into test accounts and creates complete profiles, resumes,
 * and other data to demonstrate the full functionality of the platform.
 */

const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:5000';

// Sample accounts to populate (select diverse roles)
const TEST_ACCOUNTS = [
  {
    email: 'john.dev@test.com',
    password: 'TechPass123!',
    profile: {
      firstName: 'John',
      lastName: 'Developer',
      title: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      phone: '+1 (415) 555-0123',
      email: 'john.dev@test.com',
      website: 'https://johndeveloper.com',
      linkedin: 'https://linkedin.com/in/johndeveloper',
      github: 'https://github.com/johndev',
      summary: 'Passionate software engineer with 8+ years of experience building scalable web applications. Expert in React, Node.js, and cloud infrastructure. Led teams to deliver high-impact products serving millions of users.',
      experience: [
        {
          company: 'TechCorp Inc.',
          position: 'Senior Software Engineer',
          location: 'San Francisco, CA',
          startDate: '2020-01',
          endDate: null,
          current: true,
          description: '• Led development of microservices architecture handling 10M+ requests/day\n• Mentored 5 junior engineers and conducted code reviews\n• Reduced deployment time by 60% through CI/CD automation\n• Built React dashboard improving user engagement by 40%'
        },
        {
          company: 'StartupXYZ',
          position: 'Full Stack Developer',
          location: 'Remote',
          startDate: '2018-03',
          endDate: '2019-12',
          current: false,
          description: '• Developed REST APIs using Node.js and Express\n• Implemented authentication system with JWT and OAuth\n• Created responsive UI with React and Material-UI\n• Optimized database queries reducing load time by 50%'
        },
        {
          company: 'WebSolutions LLC',
          position: 'Junior Developer',
          location: 'Austin, TX',
          startDate: '2016-06',
          endDate: '2018-02',
          current: false,
          description: '• Built client websites using HTML, CSS, and JavaScript\n• Collaborated with designers to implement pixel-perfect UIs\n• Fixed bugs and maintained legacy codebases\n• Participated in agile development sprints'
        }
      ],
      education: [
        {
          institution: 'Stanford University',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          location: 'Stanford, CA',
          startDate: '2012-09',
          endDate: '2016-05',
          gpa: '3.8'
        }
      ],
      skills: [
        'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 
        'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes',
        'GraphQL', 'REST APIs', 'Git', 'Agile', 'CI/CD'
      ],
      certifications: [
        {
          name: 'AWS Certified Solutions Architect',
          issuer: 'Amazon Web Services',
          date: '2022-03',
          credentialId: 'AWS-123456'
        }
      ],
      projects: [
        {
          name: 'E-Commerce Platform',
          description: 'Built full-stack e-commerce platform with payment integration',
          technologies: ['React', 'Node.js', 'Stripe', 'MongoDB'],
          url: 'https://github.com/johndev/ecommerce'
        }
      ]
    },
    resumes: [
      { name: 'Senior Engineer Resume', templateId: 'modern', visibility: 'public' },
      { name: 'Tech Lead Resume', templateId: 'professional', visibility: 'private' }
    ]
  },
  {
    email: 'sarah.content@test.com',
    password: 'MarketPass123!',
    profile: {
      firstName: 'Sarah',
      lastName: 'Martinez',
      title: 'Content Marketing Specialist',
      location: 'New York, NY',
      phone: '+1 (212) 555-0456',
      email: 'sarah.content@test.com',
      website: 'https://sarahwrites.com',
      linkedin: 'https://linkedin.com/in/sarahmartinez',
      summary: 'Creative content marketer with 5+ years crafting compelling stories that drive engagement. Skilled in SEO, copywriting, and content strategy. Increased organic traffic by 200% through data-driven content campaigns.',
      experience: [
        {
          company: 'Digital Marketing Agency',
          position: 'Content Marketing Specialist',
          location: 'New York, NY',
          startDate: '2021-06',
          endDate: null,
          current: true,
          description: '• Develop content strategy for 15+ clients across industries\n• Write SEO-optimized blog posts generating 50K+ monthly views\n• Manage social media campaigns with 85% engagement rate\n• Collaborate with design team on visual content'
        },
        {
          company: 'E-Commerce Startup',
          position: 'Content Writer',
          location: 'Remote',
          startDate: '2019-01',
          endDate: '2021-05',
          current: false,
          description: '• Created product descriptions for 500+ items\n• Wrote email campaigns with 25% open rate\n• Developed brand voice guidelines\n• Managed company blog and social media'
        }
      ],
      education: [
        {
          institution: 'NYU',
          degree: 'Bachelor of Arts',
          field: 'Marketing',
          location: 'New York, NY',
          startDate: '2015-09',
          endDate: '2019-05',
          gpa: '3.6'
        }
      ],
      skills: [
        'Content Marketing', 'SEO', 'Copywriting', 'Social Media',
        'WordPress', 'Google Analytics', 'Mailchimp', 'Canva',
        'Email Marketing', 'Content Strategy', 'Adobe Creative Suite'
      ],
      certifications: [
        {
          name: 'Google Analytics Certified',
          issuer: 'Google',
          date: '2022-01',
          credentialId: 'GA-789012'
        },
        {
          name: 'HubSpot Content Marketing',
          issuer: 'HubSpot',
          date: '2021-06',
          credentialId: 'HUB-345678'
        }
      ]
    },
    resumes: [
      { name: 'Marketing Resume', templateId: 'creative', visibility: 'public' }
    ]
  },
  {
    email: 'dr.smith@test.com',
    password: 'HealthPass123!',
    profile: {
      firstName: 'Dr. James',
      lastName: 'Smith',
      title: 'Internal Medicine Physician',
      location: 'Boston, MA',
      phone: '+1 (617) 555-0789',
      email: 'dr.smith@test.com',
      summary: 'Board-certified internist with 10+ years providing comprehensive patient care. Specializing in chronic disease management and preventive medicine. Committed to evidence-based practice and patient education.',
      experience: [
        {
          company: 'Boston Medical Center',
          position: 'Attending Physician',
          location: 'Boston, MA',
          startDate: '2018-07',
          endDate: null,
          current: true,
          description: '• Provide primary care for 2000+ patients\n• Manage complex chronic conditions (diabetes, hypertension)\n• Supervise medical residents and students\n• Participate in quality improvement initiatives'
        },
        {
          company: 'Mass General Hospital',
          position: 'Resident Physician',
          location: 'Boston, MA',
          startDate: '2015-07',
          endDate: '2018-06',
          current: false,
          description: '• Completed internal medicine residency program\n• Rotated through ICU, cardiology, and emergency medicine\n• Presented research at national conferences\n• Chief resident in final year'
        }
      ],
      education: [
        {
          institution: 'Harvard Medical School',
          degree: 'Doctor of Medicine',
          field: 'Medicine',
          location: 'Boston, MA',
          startDate: '2011-09',
          endDate: '2015-05',
          gpa: ''
        },
        {
          institution: 'MIT',
          degree: 'Bachelor of Science',
          field: 'Biology',
          location: 'Cambridge, MA',
          startDate: '2007-09',
          endDate: '2011-05',
          gpa: '3.9'
        }
      ],
      skills: [
        'Internal Medicine', 'Patient Care', 'Chronic Disease Management',
        'Electronic Health Records', 'Medical Research', 'Clinical Teaching'
      ],
      certifications: [
        {
          name: 'Board Certified in Internal Medicine',
          issuer: 'American Board of Internal Medicine',
          date: '2018-08',
          credentialId: 'ABIM-567890'
        }
      ]
    },
    resumes: [
      { name: 'Physician CV', templateId: 'professional', visibility: 'private' }
    ]
  }
];

// Helper function to login
async function login(page: Page, email: string, password: string) {
  await page.goto(`${BASE_URL}/login`);
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  // Wait for navigation - could be dashboard or profile page
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000); // Wait for any redirects
}

// Helper function to create profile
async function createProfile(page: Page, profileData: any) {
  await page.goto(`${BASE_URL}/profile`);
  
  // Check if profile needs to be created first
  const createButton = page.locator('button:has-text("Create Profile")');
  const isCreateButtonVisible = await createButton.isVisible().catch(() => false);
  
  if (isCreateButtonVisible) {
    console.log('    📝 Creating new profile...');
    await createButton.click();
    await page.waitForTimeout(2000); // Wait for profile creation
    await page.reload(); // Reload to get the form
  }
  
  // Personal Info
  await page.fill('input[name="firstName"]', profileData.firstName);
  await page.fill('input[name="lastName"]', profileData.lastName);
  await page.fill('input[name="title"]', profileData.title);
  await page.fill('input[name="location"]', profileData.location);
  await page.fill('input[name="phone"]', profileData.phone);
  if (profileData.website) await page.fill('input[name="website"]', profileData.website);
  if (profileData.linkedin) await page.fill('input[name="linkedin"]', profileData.linkedin);
  if (profileData.github) await page.fill('input[name="github"]', profileData.github);
  
  // Summary
  if (profileData.summary) {
    await page.fill('textarea[name="summary"]', profileData.summary);
  }
  
  // Experience
  for (const exp of profileData.experience || []) {
    await page.click('button:has-text("Add Experience")');
    await page.fill('input[name="company"]', exp.company);
    await page.fill('input[name="position"]', exp.position);
    await page.fill('input[name="location"]', exp.location);
    await page.fill('input[name="startDate"]', exp.startDate);
    if (!exp.current) await page.fill('input[name="endDate"]', exp.endDate);
    await page.fill('textarea[name="description"]', exp.description);
    await page.click('button:has-text("Save")');
  }
  
  // Education
  for (const edu of profileData.education || []) {
    await page.click('button:has-text("Add Education")');
    await page.fill('input[name="institution"]', edu.institution);
    await page.fill('input[name="degree"]', edu.degree);
    await page.fill('input[name="field"]', edu.field);
    await page.fill('input[name="location"]', edu.location);
    await page.fill('input[name="startDate"]', edu.startDate);
    await page.fill('input[name="endDate"]', edu.endDate);
    if (edu.gpa) await page.fill('input[name="gpa"]', edu.gpa);
    await page.click('button:has-text("Save")');
  }
  
  // Skills
  for (const skill of profileData.skills || []) {
    await page.fill('input[name="skill"]', skill);
    await page.press('input[name="skill"]', 'Enter');
  }
  
  // Certifications
  for (const cert of profileData.certifications || []) {
    await page.click('button:has-text("Add Certification")');
    await page.fill('input[name="name"]', cert.name);
    await page.fill('input[name="issuer"]', cert.issuer);
    await page.fill('input[name="date"]', cert.date);
    await page.fill('input[name="credentialId"]', cert.credentialId);
    await page.click('button:has-text("Save")');
  }
  
  // Save profile
  await page.click('button:has-text("Save Profile")');
  await page.waitForTimeout(2000);
}

// Helper function to create resume
async function createResume(page: Page, resumeData: any) {
  await page.goto(`${BASE_URL}/resume`);
  await page.click('button:has-text("Create New Resume")');
  
  // Select template
  await page.click(`[data-template="${resumeData.templateId}"]`);
  
  // Name resume
  await page.fill('input[name="resumeName"]', resumeData.name);
  await page.click('button:has-text("Continue")');
  
  // Set visibility
  await page.selectOption('select[name="visibility"]', resumeData.visibility);
  
  // Save
  await page.click('button:has-text("Save Resume")');
  await page.waitForTimeout(2000);
}

// Main test suite
test.describe('Populate Test Accounts with Sample Data', () => {
  
  for (const account of TEST_ACCOUNTS) {
    test(`Populate ${account.email}`, async ({ page }) => {
      console.log(`\n🔄 Processing ${account.email}...`);
      
      // Login
      await login(page, account.email, account.password);
      console.log(`✅ Logged in as ${account.email}`);
      
      // Create profile
      await createProfile(page, account.profile);
      console.log(`✅ Profile created for ${account.profile.firstName} ${account.profile.lastName}`);
      
      // Create resumes
      for (const resume of account.resumes) {
        await createResume(page, resume);
        console.log(`✅ Resume created: ${resume.name}`);
      }
      
      // Logout
      await page.goto(`${BASE_URL}/dashboard`);
      await page.click('button:has-text("Logout")');
      console.log(`✅ Logged out from ${account.email}\n`);
    });
  }
  
});

test.describe('Verify Sample Data', () => {
  
  test('Verify all accounts have data', async ({ page }) => {
    for (const account of TEST_ACCOUNTS) {
      await login(page, account.email, account.password);
      
      // Check profile exists
      await page.goto(`${BASE_URL}/profile`);
      await expect(page.locator(`text=${account.profile.firstName}`)).toBeVisible();
      
      // Check resumes exist
      await page.goto(`${BASE_URL}/dashboard`);
      for (const resume of account.resumes) {
        await expect(page.locator(`text=${resume.name}`)).toBeVisible();
      }
      
      console.log(`✅ Verified data for ${account.email}`);
    }
  });
  
});
