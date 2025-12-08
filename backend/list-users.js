/**
 * List all users in the database
 */

require('dotenv').config();
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: String,
  name: String,
  aiCredits: Number,
  subscription: Object,
});

const User = mongoose.model('User', UserSchema);

async function listUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const users = await User.find({}).select('email name aiCredits subscription.plan').limit(20);

    if (users.length === 0) {
      console.log('No users found');
      process.exit(0);
    }

    console.log('📋 Users in database:\n');
    users.forEach((user, i) => {
      console.log(`${i + 1}. ${user.email}`);
      console.log(`   Name: ${user.name || 'N/A'}`);
      console.log(`   AI Credits: ${user.aiCredits || 0}`);
      console.log(`   Plan: ${user.subscription?.plan || 'free'}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

listUsers();
