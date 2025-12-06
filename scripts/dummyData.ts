/**
 * Dummy Data & Test Credentials - 50+ Test Users
 * For development, testing, and demo purposes
 */

export const TEST_CREDENTIALS = [
  // Tech Track
  { email: 'john.dev@test.com', password: 'TechPass123!', role: 'software-engineer', company: 'Google' },
  { email: 'sarah.frontend@test.com', password: 'TechPass123!', role: 'frontend-engineer', company: 'Meta' },
  { email: 'mike.backend@test.com', password: 'TechPass123!', role: 'backend-engineer', company: 'Amazon' },
  { email: 'alex.devops@test.com', password: 'TechPass123!', role: 'devops', company: 'Netflix' },
  { email: 'lisa.datascience@test.com', password: 'TechPass123!', role: 'data-scientist', company: 'Tesla' },
  { email: 'david.qa@test.com', password: 'TechPass123!', role: 'qa-engineer', company: 'Apple' },
  { email: 'emma.architect@test.com', password: 'TechPass123!', role: 'solutions-architect', company: 'Microsoft' },
  { email: 'jason.data@test.com', password: 'TechPass123!', role: 'data-analyst', company: 'IBM' },

  // Finance Track
  { email: 'michael.banker@test.com', password: 'FinPass123!', role: 'financial-analyst', company: 'Goldman Sachs' },
  { email: 'jennifer.cpa@test.com', password: 'FinPass123!', role: 'accountant', company: 'Deloitte' },
  { email: 'kevin.banker@test.com', password: 'FinPass123!', role: 'investment-banker', company: 'JP Morgan' },
  { email: 'rachel.auditor@test.com', password: 'FinPass123!', role: 'accountant', company: 'PwC' },
  { email: 'chris.analyst@test.com', password: 'FinPass123!', role: 'financial-analyst', company: 'McKinsey' },
  { email: 'laura.trader@test.com', password: 'FinPass123!', role: 'financial-analyst', company: 'Goldman Sachs' },
  { email: 'mark.consultant@test.com', password: 'FinPass123!', role: 'consultant', company: 'Bain' },

  // Healthcare Track
  { email: 'dr.smith@test.com', password: 'HealthPass123!', role: 'physician', company: 'Johns Hopkins' },
  { email: 'nurse.johnson@test.com', password: 'HealthPass123!', role: 'healthcare', company: 'Mayo Clinic' },
  { email: 'pharmacist.lee@test.com', password: 'HealthPass123!', role: 'pharmacist', company: 'CVS Health' },
  { email: 'dr.patel@test.com', password: 'HealthPass123!', role: 'physician', company: 'Stanford Hospital' },
  { email: 'nurse.williams@test.com', password: 'HealthPass123!', role: 'healthcare', company: 'Cleveland Clinic' },
  { email: 'pharmacist.brown@test.com', password: 'HealthPass123!', role: 'pharmacist', company: 'Walgreens' },
  { email: 'admin.healthcare@test.com', password: 'HealthPass123!', role: 'operations-manager', company: 'UnitedHealth' },

  // Legal Track
  { email: 'attorney.diana@test.com', password: 'LegalPass123!', role: 'legal', company: 'Kirkland & Ellis' },
  { email: 'lawyer.thomas@test.com', password: 'LegalPass123!', role: 'legal', company: 'Skadden' },
  { email: 'counsel.margaret@test.com', password: 'LegalPass123!', role: 'legal', company: 'Sullivan & Cromwell' },

  // Marketing Track
  { email: 'mark.digital@test.com', password: 'MarketPass123!', role: 'marketing', company: 'Google' },
  { email: 'sarah.content@test.com', password: 'MarketPass123!', role: 'content-writer', company: 'HubSpot' },
  { email: 'brian.seo@test.com', password: 'MarketPass123!', role: 'marketing', company: 'Moz' },
  { email: 'victoria.brand@test.com', password: 'MarketPass123!', role: 'brand-manager', company: 'Nike' },
  { email: 'daniel.social@test.com', password: 'MarketPass123!', role: 'social-media-manager', company: 'Meta' },
  { email: 'olivia.content@test.com', password: 'MarketPass123!', role: 'content-writer', company: 'Medium' },

  // Design Track
  { email: 'designer.alex@test.com', password: 'DesignPass123!', role: 'designer', company: 'Airbnb' },
  { email: 'ux.sophia@test.com', password: 'DesignPass123!', role: 'designer', company: 'Figma' },
  { email: 'graphic.ryan@test.com', password: 'DesignPass123!', role: 'graphic-designer', company: 'Adobe' },
  { email: 'product.emily@test.com', password: 'DesignPass123!', role: 'product-manager', company: 'Slack' },
  { email: 'ui.james@test.com', password: 'DesignPass123!', role: 'designer', company: 'Spotify' },

  // Sales Track
  { email: 'sales.robert@test.com', password: 'SalesPass123!', role: 'sales', company: 'Salesforce' },
  { email: 'executive.patricia@test.com', password: 'SalesPass123!', role: 'sales', company: 'Oracle' },
  { email: 'account.george@test.com', password: 'SalesPass123!', role: 'sales', company: 'SAP' },
  { email: 'business.catherine@test.com', password: 'SalesPass123!', role: 'sales', company: 'Zoom' },

  // HR Track
  { email: 'hr.manager@test.com', password: 'HRPass123!', role: 'hr', company: 'LinkedIn' },
  { email: 'recruiter.amy@test.com', password: 'HRPass123!', role: 'recruiter', company: 'Indeed' },
  { email: 'hr.andrew@test.com', password: 'HRPass123!', role: 'hr', company: 'Workday' },
  { email: 'talent.melissa@test.com', password: 'HRPass123!', role: 'recruiter', company: 'Greenhouse' },

  // Creative Track
  { email: 'photographer.benjamin@test.com', password: 'CreativePass123!', role: 'photographer', company: 'Getty Images' },
  { email: 'producer.jessica@test.com', password: 'CreativePass123!', role: 'video-producer', company: 'Netflix' },
  { email: 'writer.charles@test.com', password: 'CreativePass123!', role: 'content-writer', company: 'The New York Times' },

  // Other Roles
  { email: 'pm.nancy@test.com', password: 'OtherPass123!', role: 'project-manager', company: 'Accenture' },
  { email: 'consultant.steven@test.com', password: 'OtherPass123!', role: 'consultant', company: 'Boston Consulting Group' },
  { email: 'ops.karen@test.com', password: 'OtherPass123!', role: 'operations-manager', company: 'Costco' },
  { email: 'academic.professor@test.com', password: 'OtherPass123!', role: 'academic', company: 'MIT' },
  { email: 'executive.ceo@test.com', password: 'OtherPass123!', role: 'executive', company: 'Tesla' },
];

export const DUMMY_USER_DATA = {
  // Tech Users
  'john.dev@test.com': {
    firstName: 'John',
    lastName: 'Mitchell',
    title: 'Senior Software Engineer',
    email: 'john.dev@test.com',
    phone: '+1-555-0101',
    location: 'San Francisco, CA',
    summary: '10+ years building scalable web applications. Expert in React, Node.js, and AWS.',
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Google',
        startDate: '2019-01-01',
        endDate: null,
        description: 'Led development of 5+ full-stack features serving millions of users',
        responsibilities: ['Architected microservices', 'Mentored 6 engineers', 'Reduced latency by 40%'],
      },
      {
        title: 'Software Engineer',
        company: 'Facebook',
        startDate: '2016-06-01',
        endDate: '2018-12-31',
        description: 'Developed features for core Facebook platform',
        responsibilities: ['Built React components', 'Optimized performance', 'Led code reviews'],
      },
    ],
    education: [
      {
        school: 'UC Berkeley',
        degree: 'BS',
        field: 'Computer Science',
        graduationYear: 2016,
      },
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'AWS', 'MongoDB', 'PostgreSQL', 'Docker', 'Kubernetes'],
    certifications: ['AWS Solutions Architect', 'Certified Kubernetes Administrator'],
  },

  'sarah.frontend@test.com': {
    firstName: 'Sarah',
    lastName: 'Johnson',
    title: 'Frontend Engineer',
    email: 'sarah.frontend@test.com',
    phone: '+1-555-0102',
    location: 'Seattle, WA',
    summary: '8 years crafting beautiful, performant user interfaces. Passionate about design systems.',
    experience: [
      {
        title: 'Frontend Engineer',
        company: 'Meta',
        startDate: '2020-03-01',
        endDate: null,
        description: 'Developed frontend for Meta products',
        responsibilities: ['Led design system initiative', '60+ component library', '99.9% uptime'],
      },
    ],
    education: [
      {
        school: 'University of Washington',
        degree: 'BS',
        field: 'Information Systems',
        graduationYear: 2016,
      },
    ],
    skills: ['React', 'TypeScript', 'CSS', 'Figma', 'Storybook', 'Jest', 'Webpack', 'GraphQL'],
  },

  'michael.banker@test.com': {
    firstName: 'Michael',
    lastName: 'Anderson',
    title: 'Vice President, Financial Analyst',
    email: 'michael.banker@test.com',
    phone: '+1-555-0103',
    location: 'New York, NY',
    summary: 'Investment banking professional with 12+ years advising Fortune 500 companies.',
    experience: [
      {
        title: 'Vice President',
        company: 'Goldman Sachs',
        startDate: '2018-07-01',
        endDate: null,
        description: 'Led M&A transactions',
        responsibilities: ['Closed $50B+ in deals', 'Managed $2M client portfolio', 'Industry recognition'],
      },
    ],
    education: [
      {
        school: 'Harvard Business School',
        degree: 'MBA',
        field: 'Finance',
        graduationYear: 2011,
      },
      {
        school: 'University of Pennsylvania',
        degree: 'BS',
        field: 'Economics',
        graduationYear: 2009,
      },
    ],
    skills: ['Financial Modeling', 'Excel', 'DCF Analysis', 'M&A', 'Valuations', 'Bloomberg Terminal'],
    certifications: ['CFA Level III', 'FRM'],
  },

  'dr.smith@test.com': {
    firstName: 'Dr. Robert',
    lastName: 'Smith',
    title: 'Cardiologist',
    email: 'dr.smith@test.com',
    phone: '+1-555-0104',
    location: 'Baltimore, MD',
    summary: 'Board-certified cardiologist with 15 years clinical experience.',
    experience: [
      {
        title: 'Cardiologist',
        company: 'Johns Hopkins Hospital',
        startDate: '2015-01-01',
        endDate: null,
        description: 'Cardiovascular care and research',
        responsibilities: ['2000+ patients annually', 'Published 10+ peer-reviewed articles', 'Residency mentor'],
      },
    ],
    education: [
      {
        school: 'Johns Hopkins School of Medicine',
        degree: 'MD',
        field: 'Medicine',
        graduationYear: 2008,
      },
    ],
    skills: ['Cardiology', 'Interventional Procedures', 'Patient Management', 'Research'],
    certifications: ['Board Certified Cardiologist', 'ACLS', 'BLS', 'ABIM'],
  },

  'designer.alex@test.com': {
    firstName: 'Alex',
    lastName: 'Rodriguez',
    title: 'Product Designer',
    email: 'designer.alex@test.com',
    phone: '+1-555-0105',
    location: 'San Francisco, CA',
    summary: 'Product designer focused on creating delightful user experiences.',
    experience: [
      {
        title: 'Product Designer',
        company: 'Airbnb',
        startDate: '2019-06-01',
        endDate: null,
        description: 'Design for core Airbnb platform',
        responsibilities: ['Redesigned booking flow', '+15% conversion', 'Design system lead'],
      },
    ],
    education: [
      {
        school: 'California Institute of the Arts',
        degree: 'BFA',
        field: 'Graphic Design',
        graduationYear: 2018,
      },
    ],
    skills: ['Figma', 'Prototyping', 'User Research', 'Information Architecture', 'Interaction Design'],
  },

  'mark.digital@test.com': {
    firstName: 'Mark',
    lastName: 'Thompson',
    title: 'Digital Marketing Manager',
    email: 'mark.digital@test.com',
    phone: '+1-555-0106',
    location: 'Austin, TX',
    summary: 'Growth marketer driving user acquisition and engagement at scale.',
    experience: [
      {
        title: 'Digital Marketing Manager',
        company: 'Google',
        startDate: '2017-09-01',
        endDate: null,
        description: 'Lead digital campaigns',
        responsibilities: ['Manage $10M ad budget', '300% ROI achieved', '5M+ impressions/month'],
      },
    ],
    education: [
      {
        school: 'University of Texas at Austin',
        degree: 'BS',
        field: 'Marketing',
        graduationYear: 2017,
      },
    ],
    skills: ['Google Analytics', 'SEO/SEM', 'Facebook Ads', 'Content Strategy', 'Conversion Optimization'],
  },

  'sales.robert@test.com': {
    firstName: 'Robert',
    lastName: 'Williams',
    title: 'Enterprise Sales Executive',
    email: 'sales.robert@test.com',
    phone: '+1-555-0107',
    location: 'Chicago, IL',
    summary: 'Enterprise sales leader with 8+ years closing multi-million dollar deals.',
    experience: [
      {
        title: 'Enterprise Account Executive',
        company: 'Salesforce',
        startDate: '2018-02-01',
        endDate: null,
        description: 'Manage enterprise client portfolio',
        responsibilities: ['$5M+ annual quota', 'Top 10% sales rep', '40+ client relationships'],
      },
    ],
    education: [
      {
        school: 'University of Illinois',
        degree: 'BS',
        field: 'Business Administration',
        graduationYear: 2015,
      },
    ],
    skills: ['Salesforce', 'Negotiation', 'Account Management', 'Relationship Building', 'Territory Management'],
  },

  'hr.manager@test.com': {
    firstName: 'Jennifer',
    lastName: 'Davis',
    title: 'HR Manager',
    email: 'hr.manager@test.com',
    phone: '+1-555-0108',
    location: 'Mountain View, CA',
    summary: 'HR leader specializing in talent development and organizational growth.',
    experience: [
      {
        title: 'HR Manager',
        company: 'LinkedIn',
        startDate: '2019-05-01',
        endDate: null,
        description: 'Manage 200+ person organization',
        responsibilities: ['Hiring 50+ engineers/year', 'Employee satisfaction 92%', 'Retention 95%'],
      },
    ],
    education: [
      {
        school: 'San Jose State University',
        degree: 'BS',
        field: 'Human Resource Management',
        graduationYear: 2015,
      },
    ],
    skills: ['Workday', 'Recruiting', 'Compliance', 'Employee Relations', 'Compensation & Benefits'],
  },

  'pm.nancy@test.com': {
    firstName: 'Nancy',
    lastName: 'Garcia',
    title: 'Senior Project Manager',
    email: 'pm.nancy@test.com',
    phone: '+1-555-0109',
    location: 'Boston, MA',
    summary: 'Agile/Scrum certified project manager delivering enterprise software projects.',
    experience: [
      {
        title: 'Senior Project Manager',
        company: 'Accenture',
        startDate: '2016-08-01',
        endDate: null,
        description: 'Manage large-scale transformation projects',
        responsibilities: ['Oversee $5M budgets', '50+ team members', '100% on-time delivery'],
      },
    ],
    education: [
      {
        school: 'Northeastern University',
        degree: 'MBA',
        field: 'Project Management',
        graduationYear: 2016,
      },
    ],
    skills: ['Jira', 'Agile/Scrum', 'Risk Management', 'Stakeholder Management', 'Budget Management'],
    certifications: ['PMP', 'Certified Scrum Master'],
  },

  'consultant.steven@test.com': {
    firstName: 'Steven',
    lastName: 'Martin',
    title: 'Management Consultant',
    email: 'consultant.steven@test.com',
    phone: '+1-555-0110',
    location: 'New York, NY',
    summary: 'Strategy consultant helping Fortune 500 companies with digital transformation.',
    experience: [
      {
        title: 'Senior Consultant',
        company: 'Boston Consulting Group',
        startDate: '2018-09-01',
        endDate: null,
        description: 'Advise C-level executives',
        responsibilities: ['30+ engagements', '$300M+ in value created', 'Industry expertise'],
      },
    ],
    education: [
      {
        school: 'Stanford Graduate School of Business',
        degree: 'MBA',
        field: 'Strategy',
        graduationYear: 2018,
      },
      {
        school: 'University of Michigan',
        degree: 'BS',
        field: 'Engineering',
        graduationYear: 2016,
      },
    ],
    skills: ['Strategic Planning', 'Data Analysis', 'Financial Modeling', 'Change Management'],
  },

  'academic.professor@test.com': {
    firstName: 'Dr. Daniel',
    lastName: 'Chen',
    title: 'Assistant Professor of Computer Science',
    email: 'academic.professor@test.com',
    phone: '+1-555-0111',
    location: 'Cambridge, MA',
    summary: 'Computer scientist researching AI and machine learning applications.',
    experience: [
      {
        title: 'Assistant Professor',
        company: 'MIT',
        startDate: '2020-09-01',
        endDate: null,
        description: 'Teaching and research in AI',
        responsibilities: ['Published 20+ papers', '50+ graduate students mentored', 'Course development'],
      },
    ],
    education: [
      {
        school: 'Stanford University',
        degree: 'PhD',
        field: 'Computer Science',
        graduationYear: 2020,
      },
      {
        school: 'Stanford University',
        degree: 'BS',
        field: 'Computer Science',
        graduationYear: 2016,
      },
    ],
    skills: ['Machine Learning', 'Python', 'Research', 'Teaching', 'Academic Publishing'],
  },

  'executive.ceo@test.com': {
    firstName: 'Elon',
    lastName: 'Musk',
    title: 'Chief Executive Officer',
    email: 'executive.ceo@test.com',
    phone: '+1-555-0112',
    location: 'Austin, TX',
    summary: 'Visionary CEO with track record of building multi-billion dollar companies.',
    experience: [
      {
        title: 'CEO & Chief Designer',
        company: 'Tesla',
        startDate: '2008-01-01',
        endDate: null,
        description: 'Lead Tesla to become most valuable auto company',
        responsibilities: ['Market cap: $1T+', 'Product innovation', 'Global expansion'],
      },
    ],
    education: [
      {
        school: 'Stanford University',
        degree: 'BS',
        field: 'Economics & Physics',
        graduationYear: 1995,
      },
    ],
    skills: ['Strategic Vision', 'Innovation', 'Product Development', 'Business Strategy'],
  },
};

// Generate additional dummy user objects for testing
export const generateDummyUsers = (count: number = 50) => {
  const roles = [
    'software-engineer', 'frontend-engineer', 'backend-engineer', 'devops', 'data-scientist',
    'financial-analyst', 'accountant', 'physician', 'designer', 'marketing',
    'sales', 'hr', 'project-manager', 'consultant', 'academic', 'executive'
  ];

  const companies = [
    'Google', 'Meta', 'Amazon', 'Apple', 'Microsoft', 'Netflix', 'Tesla', 'IBM',
    'Goldman Sachs', 'JP Morgan', 'McKinsey', 'Bain', 'Boston Consulting Group',
    'Johns Hopkins', 'Mayo Clinic', 'Stanford Hospital', 'Kirkland & Ellis', 'Skadden'
  ];

  const cities = [
    'San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Boston, MA', 'Austin, TX',
    'Chicago, IL', 'Los Angeles, CA', 'Mountain View, CA', 'Palo Alto, CA', 'Baltimore, MD'
  ];

  const users = [];

  for (let i = 0; i < count; i++) {
    const role = roles[i % roles.length];
    const company = companies[i % companies.length];
    const city = cities[i % cities.length];

    users.push({
      email: `user${i + 1}@test.com`,
      password: 'TestPass123!',
      firstName: `User`,
      lastName: `${i + 1}`,
      title: role.replace(/-/g, ' ').toUpperCase(),
      phone: `+1-555-${String(i + 1).padStart(4, '0')}`,
      location: city,
      company: company,
      role: role,
    });
  }

  return users;
};

// Export all metadata for template population
export const ALL_TEMPLATE_METADATA = [
  // Tech templates (13)
  { id: 'software-engineer', name: 'Software Engineer', category: 'Technology' },
  { id: 'frontend-engineer', name: 'Frontend Engineer', category: 'Technology' },
  { id: 'backend-engineer', name: 'Backend Engineer', category: 'Technology' },
  { id: 'devops', name: 'DevOps Engineer', category: 'Technology' },
  { id: 'data-scientist', name: 'Data Scientist', category: 'Technology' },
  { id: 'qa-engineer', name: 'QA Engineer', category: 'Technology' },
  { id: 'solutions-architect', name: 'Solutions Architect', category: 'Technology' },
  { id: 'data-analyst', name: 'Data Analyst', category: 'Technology' },

  // Finance templates (4)
  { id: 'financial-analyst', name: 'Financial Analyst', category: 'Finance' },
  { id: 'accountant', name: 'Accountant', category: 'Finance' },
  { id: 'investment-banker', name: 'Investment Banker', category: 'Finance' },

  // Healthcare templates (4)
  { id: 'physician', name: 'Physician', category: 'Healthcare' },
  { id: 'healthcare', name: 'Healthcare Professional', category: 'Healthcare' },
  { id: 'pharmacist', name: 'Pharmacist', category: 'Healthcare' },

  // Legal templates (1)
  { id: 'legal', name: 'Attorney', category: 'Legal' },

  // Marketing templates (4)
  { id: 'marketing', name: 'Marketing Professional', category: 'Marketing' },
  { id: 'content-writer', name: 'Content Writer', category: 'Marketing' },
  { id: 'brand-manager', name: 'Brand Manager', category: 'Marketing' },
  { id: 'social-media-manager', name: 'Social Media Manager', category: 'Marketing' },

  // Design templates (3)
  { id: 'designer', name: 'UX/UI Designer', category: 'Design' },
  { id: 'graphic-designer', name: 'Graphic Designer', category: 'Design' },
  { id: 'product-manager', name: 'Product Manager', category: 'Design' },

  // Sales templates (1)
  { id: 'sales', name: 'Sales Executive', category: 'Sales' },

  // HR/Admin templates (3)
  { id: 'hr', name: 'HR Manager', category: 'HR' },
  { id: 'recruiter', name: 'Recruiter', category: 'HR' },
  { id: 'operations-manager', name: 'Operations Manager', category: 'Operations' },

  // Creative templates (2)
  { id: 'video-producer', name: 'Video Producer', category: 'Creative' },
  { id: 'photographer', name: 'Photographer', category: 'Creative' },

  // Other templates (3)
  { id: 'project-manager', name: 'Project Manager', category: 'Management' },
  { id: 'consultant', name: 'Consultant', category: 'Management' },
  { id: 'academic', name: 'Academic/Researcher', category: 'Academia' },
  { id: 'executive', name: 'Executive', category: 'Management' },
];

console.log('📊 Total Templates: 32+');
console.log('📊 Total Test Credentials: 50+');
console.log('✅ Dummy data ready for seeding');
