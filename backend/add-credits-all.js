/**
 * Add AI credits to ALL users
 */

require('dotenv').config();
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: String,
  aiCredits: Number,
});

const User = mongoose.model('User', UserSchema);

async function addCreditsToAll() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const result = await User.updateMany(
      {},
      { $set: { aiCredits: 10000 } }
    );

    console.log(`✅ Added 10,000 AI credits to ${result.modifiedCount} users`);
    console.log('\n💳 All users now have 10,000 AI credits');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addCreditsToAll();
