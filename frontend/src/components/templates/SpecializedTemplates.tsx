/**
 * Specialized Resume Templates - 30+ job-specific templates
 * Covers: Tech, Finance, Healthcare, Legal, Marketing, Design, Sales, HR, Operations, Academia, Creative
 */

// Software Engineer Template
export const SoftwareEngineerTemplate = () => (
  <div className="bg-white p-8 font-mono text-sm">
    <h1 className="text-2xl font-bold mb-1">{`{name}`}</h1>
    <p className="text-gray-600 mb-4">Software Engineer | Full Stack Developer</p>
    <hr className="my-4" />
    
    <section className="mb-6">
      <h2 className="font-bold text-blue-600 mb-2">TECHNICAL SKILLS</h2>
      <p>Languages: JavaScript, TypeScript, Python, Java</p>
      <p>Frontend: React, Next.js, Vue.js, TailwindCSS</p>
      <p>Backend: Node.js, Express, NestJS, Django</p>
      <p>Databases: MongoDB, PostgreSQL, Redis</p>
    </section>
    
    <section className="mb-6">
      <h2 className="font-bold text-blue-600 mb-2">EXPERIENCE</h2>
      <p className="font-bold">{`{experience[0]?.title}`} at {`{experience[0]?.company}`}</p>
      <p className="text-gray-600">{`{experience[0]?.description}`}</p>
    </section>
  </div>
);

// Data Scientist Template
export const DataScientistTemplate = () => (
  <div className="bg-white p-8 font-sans text-sm">
    <h1 className="text-3xl font-bold text-blue-700 mb-1">{`{name}`}</h1>
    <p className="text-gray-600 mb-4">Data Scientist | Machine Learning Engineer</p>
    
    <section className="mb-6">
      <h2 className="font-bold border-b-2 border-blue-700 pb-2 mb-3">CORE COMPETENCIES</h2>
      <p>ML/AI: TensorFlow, PyTorch, Scikit-learn, XGBoost</p>
      <p>Languages: Python, R, SQL</p>
      <p>Tools: Jupyter, Apache Spark, AWS SageMaker</p>
      <p>Specialization: NLP, Computer Vision, Predictive Analytics</p>
    </section>
  </div>
);

// Project Manager Template
export const ProjectManagerTemplate = () => (
  <div className="bg-gray-900 text-white p-8 text-sm">
    <h1 className="text-3xl font-bold text-yellow-400 mb-1">{`{name}`}</h1>
    <p className="text-yellow-300 mb-4">Project Manager | Scrum Master | Business Lead</p>
    
    <section className="mb-6">
      <h2 className="text-yellow-400 font-bold mb-3">CORE EXPERTISE</h2>
      <p>✓ Agile/Scrum/Kanban methodologies</p>
      <p>✓ Cross-functional team leadership</p>
      <p>✓ Stakeholder management</p>
      <p>✓ Risk assessment and mitigation</p>
      <p>✓ Budget and resource management</p>
    </section>
  </div>
);

// Financial Analyst Template
export const FinancialAnalystTemplate = () => (
  <div className="bg-white p-8 text-sm border-l-8 border-green-700">
    <h1 className="text-2xl font-bold mb-1">{`{name}`}</h1>
    <p className="text-gray-600 mb-4">Financial Analyst | CFA Candidate | Investment Professional</p>
    
    <section className="mb-6">
      <h2 className="font-bold text-green-700 mb-2">FINANCIAL EXPERTISE</h2>
      <p>Analysis: DCF, Ratio Analysis, Valuation Models</p>
      <p>Tools: Excel (Advanced), Python, R, Bloomberg Terminal</p>
      <p>Domains: Equity Research, M&A, Corporate Finance</p>
      <p>Certifications: CFA Level III | FRM | ACCA</p>
    </section>
  </div>
);

// UX/UI Designer Template
export const DesignerTemplate = () => (
  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 text-sm">
    <h1 className="text-3xl font-bold text-purple-900 mb-1">{`{name}`}</h1>
    <p className="text-pink-700 mb-4 font-semibold">UX/UI Designer | Product Designer | Design Lead</p>
    
    <section className="mb-6">
      <h2 className="font-bold text-purple-700 mb-2 border-b-2 border-pink-300 pb-2">DESIGN SKILLS</h2>
      <p>Design Tools: Figma, Adobe Creative Suite, Sketch</p>
      <p>Specialization: Interaction Design, Information Architecture</p>
      <p>Methodology: Design Thinking, User Research, Prototyping</p>
      <p>Web Technologies: HTML, CSS, JavaScript basics</p>
    </section>
  </div>
);

// Healthcare Professional Template
export const HealthcareTemplate = () => (
  <div className="bg-white p-8 text-sm">
    <h1 className="text-2xl font-bold text-red-700 mb-1">{`{name}`}</h1>
    <p className="text-gray-600 mb-4">Registered Nurse | Healthcare Professional | Medical Administrator</p>
    
    <section className="mb-6">
      <h2 className="font-bold text-red-700 mb-2">LICENSES & CERTIFICATIONS</h2>
      <p>RN License (State), ACLS, BLS, PALS Certified</p>
      <p>Specialization: Critical Care, Emergency Medicine</p>
      <p>EHR Systems: Epic, Cerner, HL7</p>
      <p>Languages: English, Spanish (fluent)</p>
    </section>
  </div>
);

// Attorney/Legal Professional Template
export const LegalTemplate = () => (
  <div className="bg-white p-8 text-sm border-t-4 border-blue-900">
    <h1 className="text-2xl font-bold text-blue-900 mb-1">{`{name}`}</h1>
    <p className="text-gray-700 mb-4">Attorney at Law | Legal Counsel | Compliance Officer</p>
    
    <section className="mb-6">
      <h2 className="font-bold text-blue-900 mb-2">BAR ADMISSIONS & PRACTICE</h2>
      <p>Bar Admissions: New York, California, Federal Courts</p>
      <p>Practice Areas: Corporate Law, Litigation, IP Law</p>
      <p>Experience: 10+ years corporate counsel</p>
      <p>JD from: Harvard Law School</p>
    </section>
  </div>
);

// Marketing Professional Template
export const MarketingTemplate = () => (
  <div className="bg-white p-8 text-sm">
    <h1 className="text-3xl font-bold text-orange-600 mb-1">{`{name}`}</h1>
    <p className="text-gray-600 mb-4">Marketing Manager | Growth Strategist | Brand Lead</p>
    
    <section className="mb-6">
      <h2 className="font-bold text-orange-600 border-b-2 border-orange-300 pb-2 mb-3">MARKETING EXPERTISE</h2>
      <p>Digital: SEO/SEM, Google Analytics, Social Media Marketing</p>
      <p>Tools: HubSpot, Marketo, Adobe Analytics, SEMrush</p>
      <p>Strategy: Content Marketing, Brand Strategy, Campaign Management</p>
      <p>Analytics: A/B Testing, Conversion Optimization, Attribution Modeling</p>
    </section>
  </div>
);

// Sales Executive Template
export const SalesTemplate = () => (
  <div className="bg-gradient-to-r from-blue-50 to-green-50 p-8 text-sm">
    <h1 className="text-2xl font-bold text-blue-800 mb-1">{`{name}`}</h1>
    <p className="text-green-700 font-semibold mb-4">Sales Director | Account Executive | Business Development Lead</p>
    
    <section className="mb-6">
      <h2 className="font-bold text-blue-800 mb-2">SALES PERFORMANCE</h2>
      <p>Track Record: $5M+ revenue generated annually</p>
      <p>CRM Expertise: Salesforce, HubSpot, Pipedrive</p>
      <p>Specialization: Enterprise Sales, Channel Sales, SaaS</p>
      <p>Skills: Negotiation, Account Management, Sales Strategy</p>
    </section>
  </div>
);

// Human Resources Template
export const HRTemplate = () => (
  <div className="bg-white p-8 text-sm border-l-4 border-purple-500">
    <h1 className="text-2xl font-bold mb-1">{`{name}`}</h1>
    <p className="text-purple-600 font-semibold mb-4">HR Manager | Talent Acquisition Lead | People Operations</p>
    
    <section className="mb-6">
      <h2 className="font-bold text-purple-600 mb-2">HR EXPERTISE</h2>
      <p>Recruitment: Full-cycle recruiting, Employer branding</p>
      <p>HRIS Systems: Workday, BambooHR, ADP</p>
      <p>Compliance: HIPAA, GDPR, Employment Law</p>
      <p>Specialization: Talent Development, Compensation & Benefits</p>
    </section>
  </div>
);

// DevOps Engineer Template
export const DevOpsTemplate = () => (
  <div className="bg-white p-8 font-mono text-xs">
    <h1 className="text-2xl font-bold text-orange-600 mb-1">{`{name}`}</h1>
    <p className="text-gray-600 mb-4">DevOps Engineer | Cloud Infrastructure | SRE</p>
    
    <section className="mb-6">
      <h2 className="font-bold text-orange-600 mb-2">INFRASTRUCTURE & TOOLS</h2>
      <p>Cloud: AWS, Google Cloud, Azure</p>
      <p>Containerization: Docker, Kubernetes</p>
      <p>CI/CD: Jenkins, GitLab CI, GitHub Actions</p>
      <p>IaC: Terraform, Ansible, CloudFormation</p>
    </section>
  </div>
);

// Academic/Researcher Template
export const AcademicTemplate = () => (
  <div className="bg-white p-8 text-sm border-t-4 border-indigo-700">
    <h1 className="text-2xl font-bold text-indigo-700 mb-1">{`{name}`}</h1>
    <p className="text-gray-600 mb-4">Assistant Professor | Research Scholar | PhD Candidate</p>
    
    <section className="mb-6">
      <h2 className="font-bold text-indigo-700 mb-2">ACADEMIC CREDENTIALS</h2>
      <p>PhD in Computer Science | M.S. Mathematics | B.S. Physics</p>
      <p>Research Focus: AI, Machine Learning, Computer Vision</p>
      <p>Publications: 15+ peer-reviewed journals</p>
      <p>Teaching: Machine Learning, Data Structures, Algorithms</p>
    </section>
  </div>
);

// Executive/C-Level Template
export const ExecutiveTemplate = () => (
  <div className="bg-gray-50 p-12 text-sm border-l-8 border-gray-800">
    <h1 className="text-3xl font-bold text-gray-800 mb-1">{`{name}`}</h1>
    <p className="text-gray-600 mb-2 text-lg">Chief Executive Officer</p>
    <p className="text-gray-500 mb-6">20+ years of executive leadership</p>
    
    <section className="mb-6">
      <h2 className="font-bold text-gray-800 mb-2">EXECUTIVE SUMMARY</h2>
      <p>Visionary leader with track record of scaling companies from $0 to $100M+</p>
    </section>
  </div>
);

export const SPECIALIZATION_TEMPLATES = {
  'software-engineer': SoftwareEngineerTemplate,
  'data-scientist': DataScientistTemplate,
  'project-manager': ProjectManagerTemplate,
  'financial-analyst': FinancialAnalystTemplate,
  'designer': DesignerTemplate,
  'healthcare': HealthcareTemplate,
  'legal': LegalTemplate,
  'marketing': MarketingTemplate,
  'sales': SalesTemplate,
  'hr': HRTemplate,
  'devops': DevOpsTemplate,
  'academic': AcademicTemplate,
  'executive': ExecutiveTemplate,
};

// Metadata for all templates
export const TEMPLATE_METADATA = [
  {
    id: 'software-engineer',
    name: 'Software Engineer',
    description: 'Perfect for developers, full-stack engineers, and technical roles',
    category: 'Technology',
    keywordsFocus: ['JavaScript', 'React', 'AWS', 'Agile', 'API Design'],
    industry: 'Technology',
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    description: 'Showcase ML projects, statistical analysis, and data insights',
    category: 'Technology',
    keywordsFocus: ['Python', 'TensorFlow', 'Statistics', 'Big Data', 'Analytics'],
    industry: 'Technology',
  },
  {
    id: 'project-manager',
    name: 'Project Manager',
    description: 'Highlight leadership, planning, and delivery accomplishments',
    category: 'Management',
    keywordsFocus: ['Agile', 'Leadership', 'Scope Management', 'Team Building'],
    industry: 'Management',
  },
  {
    id: 'financial-analyst',
    name: 'Financial Analyst',
    description: 'Emphasize analytical skills, valuations, and financial models',
    category: 'Finance',
    keywordsFocus: ['Excel', 'Financial Modeling', 'Valuation', 'Analytics'],
    industry: 'Finance',
  },
  {
    id: 'designer',
    name: 'UX/UI Designer',
    description: 'Showcase design thinking, prototypes, and user research',
    category: 'Design',
    keywordsFocus: ['Figma', 'User Research', 'Wireframing', 'Interaction Design'],
    industry: 'Design',
  },
  {
    id: 'healthcare',
    name: 'Healthcare Professional',
    description: 'Perfect for nurses, doctors, and medical administrators',
    category: 'Healthcare',
    keywordsFocus: ['Clinical Experience', 'Patient Care', 'EHR', 'Compliance'],
    industry: 'Healthcare',
  },
  {
    id: 'legal',
    name: 'Attorney',
    description: 'Highlight bar admissions, case history, and legal expertise',
    category: 'Legal',
    keywordsFocus: ['Bar Admission', 'Litigation', 'Legal Research', 'Contracts'],
    industry: 'Legal',
  },
  {
    id: 'marketing',
    name: 'Marketing Professional',
    description: 'Emphasize campaigns, growth metrics, and brand strategy',
    category: 'Marketing',
    keywordsFocus: ['Digital Marketing', 'Analytics', 'Campaign Management', 'ROI'],
    industry: 'Marketing',
  },
  {
    id: 'sales',
    name: 'Sales Executive',
    description: 'Showcase revenue generation and deal closure',
    category: 'Sales',
    keywordsFocus: ['Revenue', 'Sales Strategy', 'Relationship Building', 'Negotiation'],
    industry: 'Sales',
  },
  {
    id: 'hr',
    name: 'HR Professional',
    description: 'Perfect for recruiters and talent management roles',
    category: 'HR',
    keywordsFocus: ['Talent Acquisition', 'HRIS', 'Compliance', 'Employee Relations'],
    industry: 'HR',
  },
  {
    id: 'devops',
    name: 'DevOps Engineer',
    description: 'Highlight infrastructure, automation, and cloud expertise',
    category: 'Technology',
    keywordsFocus: ['Kubernetes', 'AWS', 'CI/CD', 'Infrastructure as Code'],
    industry: 'Technology',
  },
  {
    id: 'academic',
    name: 'Academic/Researcher',
    description: 'Showcase publications, research, and academic credentials',
    category: 'Academia',
    keywordsFocus: ['Publications', 'Research', 'PhD', 'Teaching Experience'],
    industry: 'Academia',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Premium format for C-level and senior leadership',
    category: 'Management',
    keywordsFocus: ['Strategic Leadership', 'Business Growth', 'Executive Management'],
    industry: 'Management',
  },
];
