/**
 * Fix Video URL in Profile Document
 */

const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/profile-builder';

async function fixProfileVideoUrl() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const Profile = mongoose.connection.collection('profiles');
    
    // Find profile with video URL containing '/videos/'
    console.log('🔍 Finding profiles with old video URL format...');
    
    const profiles = await Profile.find({
      'videoProfile.videoUrl': { $regex: '^/videos/' }
    }).toArray();
    
    console.log(`📊 Found ${profiles.length} profiles to update\n`);
    
    if (profiles.length === 0) {
      console.log('✅ No profiles need updating');
      process.exit(0);
    }
    
    for (const profile of profiles) {
      const oldUrl = profile.videoProfile.videoUrl;
      const filename = oldUrl.split('/').pop();
      const newUrl = `/uploads/videos/${filename}`;
      
      console.log(`📝 Updating profile ${profile._id}:`);
      console.log(`   OLD: ${oldUrl}`);
      console.log(`   NEW: ${newUrl}`);
      
      await Profile.updateOne(
        { _id: profile._id },
        { $set: { 'videoProfile.videoUrl': newUrl } }
      );
      
      console.log('   ✅ Updated\n');
    }
    
    console.log('✅ All video URLs updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixProfileVideoUrl();
