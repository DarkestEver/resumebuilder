/**
 * Simple Seed Script - Create dummy accounts
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Connection string
const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/profilebuilder';

// Test credentials
const TEST_CREDENTIALS = [
  // Tech Track
  { email: 'john.dev@test.com', password: 'TechPass123!', role: 'software-engineer' },
  { email: 'sarah.frontend@test.com', password: 'TechPass123!', role: 'frontend-engineer' },
  { email: 'mike.backend@test.com', password: 'TechPass123!', role: 'backend-engineer' },
  { email: 'alex.devops@test.com', password: 'TechPass123!', role: 'devops' },
  { email: 'lisa.datascience@test.com', password: 'TechPass123!', role: 'data-scientist' },
  { email: 'david.qa@test.com', password: 'TechPass123!', role: 'qa-engineer' },
  { email: 'emma.architect@test.com', password: 'TechPass123!', role: 'solutions-architect' },
  { email: 'jason.data@test.com', password: 'TechPass123!', role: 'data-analyst' },

  // Finance Track
  { email: 'michael.banker@test.com', password: 'FinPass123!', role: 'financial-analyst' },
  { email: 'jennifer.cpa@test.com', password: 'FinPass123!', role: 'accountant' },
  { email: 'kevin.banker@test.com', password: 'FinPass123!', role: 'investment-banker' },
  { email: 'rachel.auditor@test.com', password: 'FinPass123!', role: 'accountant' },
  { email: 'chris.analyst@test.com', password: 'FinPass123!', role: 'financial-analyst' },
  { email: 'laura.trader@test.com', password: 'FinPass123!', role: 'financial-analyst' },
  { email: 'mark.consultant@test.com', password: 'FinPass123!', role: 'consultant' },

  // Healthcare Track
  { email: 'dr.smith@test.com', password: 'HealthPass123!', role: 'physician' },
  { email: 'nurse.johnson@test.com', password: 'HealthPass123!', role: 'healthcare' },
  { email: 'pharmacist.lee@test.com', password: 'HealthPass123!', role: 'pharmacist' },
  { email: 'dr.patel@test.com', password: 'HealthPass123!', role: 'physician' },
  { email: 'nurse.williams@test.com', password: 'HealthPass123!', role: 'healthcare' },

  // Marketing Track
  { email: 'mark.digital@test.com', password: 'MarketPass123!', role: 'marketing' },
  { email: 'sarah.content@test.com', password: 'MarketPass123!', role: 'content-writer' },
  { email: 'brian.seo@test.com', password: 'MarketPass123!', role: 'marketing' },
  { email: 'victoria.brand@test.com', password: 'MarketPass123!', role: 'brand-manager' },
  { email: 'daniel.social@test.com', password: 'MarketPass123!', role: 'social-media-manager' },

  // Design Track
  { email: 'designer.alex@test.com', password: 'DesignPass123!', role: 'designer' },
  { email: 'ux.sophia@test.com', password: 'DesignPass123!', role: 'designer' },
  { email: 'graphic.ryan@test.com', password: 'DesignPass123!', role: 'graphic-designer' },
  { email: 'product.emily@test.com', password: 'DesignPass123!', role: 'product-manager' },
  { email: 'ui.james@test.com', password: 'DesignPass123!', role: 'designer' },

  // Sales Track
  { email: 'sales.robert@test.com', password: 'SalesPass123!', role: 'sales' },
  { email: 'executive.patricia@test.com', password: 'SalesPass123!', role: 'sales' },
  { email: 'account.george@test.com', password: 'SalesPass123!', role: 'sales' },
  { email: 'business.catherine@test.com', password: 'SalesPass123!', role: 'sales' },

  // HR Track
  { email: 'hr.manager@test.com', password: 'HRPass123!', role: 'hr' },
  { email: 'recruiter.amy@test.com', password: 'HRPass123!', role: 'recruiter' },
  { email: 'hr.andrew@test.com', password: 'HRPass123!', role: 'hr' },
  { email: 'talent.melissa@test.com', password: 'HRPass123!', role: 'recruiter' },

  // Other Roles
  { email: 'pm.nancy@test.com', password: 'OtherPass123!', role: 'project-manager' },
  { email: 'consultant.steven@test.com', password: 'OtherPass123!', role: 'consultant' },
  { email: 'ops.karen@test.com', password: 'OtherPass123!', role: 'operations-manager' },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    console.log(`📡 Connecting to MongoDB: ${MONGODB_URI}`);

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get User model
    const userSchema = new mongoose.Schema(
      {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        name: { type: String, required: true },
        firstName: String,
        lastName: String,
        title: String,
        isVerified: { type: Boolean, default: false },
        subscriptionTier: { type: String, default: 'free' },
        role: { type: String, default: 'user' },
        emailVerified: { type: Boolean, default: false },
        phoneVerified: { type: Boolean, default: false },
        twoFactorEnabled: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        aiCredits: { type: Number, default: 0 },
        subscription: {
          plan: { type: String, default: 'free' },
          status: { type: String, default: 'active' },
        },
        createdAt: { type: Date, default: Date.now },
      },
      { timestamps: true }
    );

    const User = mongoose.model('User', userSchema);

    // Seed test users
    console.log('📝 Creating test accounts...\n');
    const createdUsers = [];

    for (const credential of TEST_CREDENTIALS) {
      const existingUser = await User.findOne({ email: credential.email });

      if (!existingUser) {
        // Hash password
        const hashedPassword = await bcrypt.hash(credential.password, 10);

        // Create user
        const user = await User.create({
          email: credential.email,
          password: hashedPassword,
          name: `${credential.email.split('.')[0]} ${credential.role.replace(/-/g, ' ')}`.trim(),
          firstName: credential.email.split('.')[0],
          lastName: credential.role.replace(/-/g, ' ').toUpperCase(),
          title: credential.role.replace(/-/g, ' '),
          isVerified: true,
          subscriptionTier: ['pro', 'free', 'enterprise'][Math.floor(Math.random() * 3)],
          role: 'user',
        });

        createdUsers.push({
          email: credential.email,
          password: credential.password,
          role: credential.role,
        });

        console.log(`✅ Created: ${credential.email}`);
      } else {
        console.log(`⏭️  Skipped: ${credential.email} (already exists)`);
      }
    }

    console.log(`\n✅ Database seeding completed!`);
    console.log(`📊 Total users created: ${createdUsers.length}/${TEST_CREDENTIALS.length}\n`);

    console.log('═'.repeat(70));
    console.log('📋 TEST ACCOUNT CREDENTIALS - Use these to login:');
    console.log('═'.repeat(70) + '\n');

    // Group by role
    const groupedByRole = {};
    createdUsers.forEach((user) => {
      if (!groupedByRole[user.role]) {
        groupedByRole[user.role] = [];
      }
      groupedByRole[user.role].push(user);
    });

    Object.entries(groupedByRole).forEach(([role, users]) => {
      console.log(`\n🔹 ${role.toUpperCase()}`);
      users.forEach((user) => {
        console.log(`   📧 Email:    ${user.email}`);
        console.log(`   🔑 Password: ${user.password}\n`);
      });
    });

    console.log('═'.repeat(70));
    console.log('💡 Frontend URL: http://localhost:3000');
    console.log('💡 Login URL:    http://localhost:3000/login');
    console.log('═'.repeat(70));

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase().catch(console.error);
