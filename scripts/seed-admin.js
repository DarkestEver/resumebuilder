/**
 * Create Admin Accounts
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/profilebuilder';

const ADMIN_CREDENTIALS = [
  { email: 'admin@profilebuilder.com', password: 'AdminPass123!', firstName: 'Admin', lastName: 'Master' },
  { email: 'support@profilebuilder.com', password: 'SupportPass123!', firstName: 'Support', lastName: 'Team' },
  { email: 'moderator@profilebuilder.com', password: 'ModeratorPass123!', firstName: 'Moderator', lastName: 'Staff' },
];

async function createAdminAccounts() {
  try {
    console.log('👑 Creating admin accounts...');
    console.log(`📡 Connecting to MongoDB: ${MONGODB_URI}\n`);

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const userSchema = new mongoose.Schema(
      {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        firstName: String,
        lastName: String,
        title: String,
        isVerified: { type: Boolean, default: false },
        subscriptionTier: { type: String, default: 'enterprise' },
        role: { type: String, default: 'user' },
        createdAt: { type: Date, default: Date.now },
      },
      { timestamps: true }
    );

    const User = mongoose.model('User', userSchema);

    const createdAdmins = [];

    for (const admin of ADMIN_CREDENTIALS) {
      const existingUser = await User.findOne({ email: admin.email });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(admin.password, 10);

        await User.create({
          email: admin.email,
          password: hashedPassword,
          firstName: admin.firstName,
          lastName: admin.lastName,
          title: 'Administrator',
          isVerified: true,
          subscriptionTier: 'enterprise',
          role: 'admin',
        });

        createdAdmins.push({
          email: admin.email,
          password: admin.password,
          role: 'admin',
        });

        console.log(`✅ Created admin: ${admin.email}`);
      } else {
        console.log(`⏭️  Admin exists: ${admin.email}`);
      }
    }

    console.log(`\n✅ Admin account setup completed!`);
    console.log(`📊 Total admins created: ${createdAdmins.length}/${ADMIN_CREDENTIALS.length}\n`);

    console.log('═'.repeat(70));
    console.log('👑 ADMIN ACCOUNT CREDENTIALS');
    console.log('═'.repeat(70) + '\n');

    createdAdmins.forEach((admin, index) => {
      console.log(`${index + 1}. Email:    ${admin.email}`);
      console.log(`   Password: ${admin.password}`);
      console.log(`   Role:     ${admin.role}\n`);
    });

    console.log('═'.repeat(70));
    console.log('💡 Admin Panel: http://localhost:3000/admin');
    console.log('═'.repeat(70));

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');

    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error.message);
    process.exit(1);
  }
}

createAdminAccounts().catch(console.error);
