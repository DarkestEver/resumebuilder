/**
 * Add AI credits to user account
 * Usage: node add-credits.js <email> <credits>
 */

require('dotenv').config();
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: String,
  aiCredits: Number,
});

const User = mongoose.model('User', UserSchema);

async function addCredits() {
  try {
    const email = process.argv[2];
    const credits = parseInt(process.argv[3]) || 10000;

    if (!email) {
      console.log('Usage: node add-credits.js <email> <credits>');
      console.log('Example: node add-credits.js user@example.com 10000');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const user = await User.findOne({ email });

    if (!user) {
      console.log(`❌ User not found: ${email}`);
      process.exit(1);
    }

    const oldCredits = user.aiCredits || 0;
    user.aiCredits = (user.aiCredits || 0) + credits;
    await user.save();

    console.log(`\n✅ Credits added successfully!`);
    console.log(`📧 Email: ${email}`);
    console.log(`💰 Previous credits: ${oldCredits}`);
    console.log(`➕ Added: ${credits}`);
    console.log(`💳 New balance: ${user.aiCredits}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addCredits();
