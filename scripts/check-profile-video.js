/**
 * Check Profile Video Data Structure
 */

const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/profile-builder';

async function checkProfileVideo() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const Profile = mongoose.connection.collection('profiles');
    
    // Find profiles that have videoProfile data
    const profiles = await Profile.find({
      videoProfile: { $exists: true }
    }).toArray();
    
    console.log(`📊 Found ${profiles.length} profiles with videoProfile data\n`);
    
    profiles.forEach((profile, i) => {
      console.log(`Profile ${i + 1}:`);
      console.log(`  ID: ${profile._id}`);
      console.log(`  User ID: ${profile.userId}`);
      console.log(`  Video Profile:`, JSON.stringify(profile.videoProfile, null, 4));
      console.log('');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkProfileVideo();
