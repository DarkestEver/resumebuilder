/**
 * Database Seed Script
 * Creates admin users and test data for production
 * 
 * Usage: node scripts/seed-database.js
 * 
 * Run inside Docker: 
 * docker exec -it profilebuilder-backend node scripts/seed-database.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:ProfileBuilder2025Secure!@localhost:27017/profilebuilder?authSource=admin';

// Admin Users to Create
const ADMIN_USERS = [
  {
    email: 'admin@profilebuilder.com',
    password: 'Admin@123456',
    username: 'admin',
    firstName: 'System',
    lastName: 'Admin',
    role: 'admin',
    plan: 'enterprise',
    aiCredits: 99999,
    isEmailVerified: true,
  },
  {
    email: 'demo@profilebuilder.com',
    password: 'Demo@123456',
    username: 'demo',
    firstName: 'Demo',
    lastName: 'User',
    role: 'user',
    plan: 'pro',
    aiCredits: 1000,
    isEmailVerified: true,
  },
];

// Test Users
const TEST_USERS = [
  {
    email: 'john@example.com',
    password: 'Test@123456',
    username: 'johndoe',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    plan: 'pro',
    aiCredits: 500,
    isEmailVerified: true,
  },
  {
    email: 'jane@example.com',
    password: 'Test@123456',
    username: 'janesmith',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'user',
    plan: 'free',
    aiCredits: 50,
    isEmailVerified: true,
  },
];

// User Schema (simplified for seeding)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
  aiCredits: { type: Number, default: 50 },
  isEmailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Profile Schema
const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  personalInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    location: String,
    title: String,
    summary: String,
    photo: String,
  },
  experience: [{
    company: String,
    position: String,
    location: String,
    startDate: String,
    endDate: String,
    current: Boolean,
    description: String,
    highlights: [String],
  }],
  education: [{
    institution: String,
    degree: String,
    field: String,
    startDate: String,
    endDate: String,
    gpa: String,
    description: String,
  }],
  skills: [{
    name: String,
    level: String,
    category: String,
  }],
  projects: [{
    name: String,
    description: String,
    technologies: [String],
    url: String,
    startDate: String,
    endDate: String,
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: String,
    expiryDate: String,
    credentialId: String,
    url: String,
  }],
  languages: [{
    name: String,
    proficiency: String,
  }],
  links: {
    linkedin: String,
    github: String,
    portfolio: String,
    twitter: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Sample Profile Data
const sampleProfile = {
  personalInfo: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    title: 'Senior Software Engineer',
    summary: 'Experienced software engineer with 8+ years of expertise in full-stack development, cloud architecture, and team leadership. Passionate about building scalable applications and mentoring junior developers.',
  },
  experience: [
    {
      company: 'Tech Giants Inc.',
      position: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2021-01',
      endDate: '',
      current: true,
      description: 'Leading development of microservices architecture serving 10M+ users',
      highlights: [
        'Architected and implemented microservices handling 100K+ requests/minute',
        'Reduced deployment time by 60% through CI/CD pipeline optimization',
        'Mentored team of 5 junior developers',
      ],
    },
    {
      company: 'StartupXYZ',
      position: 'Full Stack Developer',
      location: 'New York, NY',
      startDate: '2018-03',
      endDate: '2020-12',
      current: false,
      description: 'Built and maintained core product features',
      highlights: [
        'Developed React-based dashboard used by 50K+ customers',
        'Implemented real-time notification system using WebSockets',
        'Improved API response times by 40%',
      ],
    },
  ],
  education: [
    {
      institution: 'Stanford University',
      degree: 'Master of Science',
      field: 'Computer Science',
      startDate: '2014-09',
      endDate: '2016-06',
      gpa: '3.9',
      description: 'Specialization in Distributed Systems and Machine Learning',
    },
    {
      institution: 'UC Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2010-09',
      endDate: '2014-05',
      gpa: '3.7',
      description: '',
    },
  ],
  skills: [
    { name: 'JavaScript', level: 'Expert', category: 'Programming' },
    { name: 'TypeScript', level: 'Expert', category: 'Programming' },
    { name: 'Python', level: 'Advanced', category: 'Programming' },
    { name: 'React', level: 'Expert', category: 'Frontend' },
    { name: 'Node.js', level: 'Expert', category: 'Backend' },
    { name: 'PostgreSQL', level: 'Advanced', category: 'Database' },
    { name: 'MongoDB', level: 'Advanced', category: 'Database' },
    { name: 'AWS', level: 'Advanced', category: 'Cloud' },
    { name: 'Docker', level: 'Advanced', category: 'DevOps' },
    { name: 'Kubernetes', level: 'Intermediate', category: 'DevOps' },
  ],
  projects: [
    {
      name: 'E-Commerce Platform',
      description: 'Built a scalable e-commerce platform handling 1M+ products',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS'],
      url: 'https://github.com/johndoe/ecommerce',
      startDate: '2022-01',
      endDate: '2022-06',
    },
    {
      name: 'Real-time Chat Application',
      description: 'Developed a chat app with end-to-end encryption',
      technologies: ['React Native', 'Socket.io', 'MongoDB'],
      url: 'https://github.com/johndoe/chatapp',
      startDate: '2021-06',
      endDate: '2021-09',
    },
  ],
  certifications: [
    {
      name: 'AWS Solutions Architect Professional',
      issuer: 'Amazon Web Services',
      date: '2023-01',
      expiryDate: '2026-01',
      credentialId: 'AWS-SAP-12345',
      url: 'https://aws.amazon.com/verification',
    },
    {
      name: 'Google Cloud Professional Developer',
      issuer: 'Google',
      date: '2022-06',
      expiryDate: '2025-06',
      credentialId: 'GCP-PD-67890',
      url: '',
    },
  ],
  languages: [
    { name: 'English', proficiency: 'Native' },
    { name: 'Spanish', proficiency: 'Intermediate' },
    { name: 'Mandarin', proficiency: 'Basic' },
  ],
  links: {
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    portfolio: 'https://johndoe.dev',
    twitter: 'https://twitter.com/johndoe',
  },
};

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...\n');
    
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Create models
    const User = mongoose.models.User || mongoose.model('User', userSchema);
    const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);

    // Create Admin Users
    console.log('👤 Creating admin users...');
    for (const adminData of ADMIN_USERS) {
      const existingUser = await User.findOne({ email: adminData.email });
      if (existingUser) {
        console.log(`   ⏭️  ${adminData.email} already exists, skipping...`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(adminData.password, 10);
      const user = await User.create({
        ...adminData,
        password: hashedPassword,
      });
      console.log(`   ✅ Created: ${adminData.email} (${adminData.role})`);
    }

    // Create Test Users
    console.log('\n👥 Creating test users...');
    for (const userData of TEST_USERS) {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`   ⏭️  ${userData.email} already exists, skipping...`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        ...userData,
        password: hashedPassword,
      });

      // Create profile for test user
      const existingProfile = await Profile.findOne({ userId: user._id });
      if (!existingProfile) {
        await Profile.create({
          userId: user._id,
          ...sampleProfile,
          personalInfo: {
            ...sampleProfile.personalInfo,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
          },
        });
        console.log(`   ✅ Created: ${userData.email} with sample profile`);
      } else {
        console.log(`   ✅ Created: ${userData.email}`);
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 Database seeding completed!\n');
    console.log('📋 Created Accounts:');
    console.log('');
    console.log('   ADMIN ACCOUNT:');
    console.log('   Email:    admin@profilebuilder.com');
    console.log('   Password: Admin@123456');
    console.log('');
    console.log('   DEMO ACCOUNT:');
    console.log('   Email:    demo@profilebuilder.com');
    console.log('   Password: Demo@123456');
    console.log('');
    console.log('   TEST ACCOUNTS:');
    console.log('   Email:    john@example.com');
    console.log('   Password: Test@123456');
    console.log('');
    console.log('   Email:    jane@example.com');
    console.log('   Password: Test@123456');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the seed
seedDatabase();
