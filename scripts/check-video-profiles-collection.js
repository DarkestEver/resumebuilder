/**
 * Check video-profiles Collection
 */

const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/profile-builder';

async function checkVideoProfiles() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const VideoProfiles = mongoose.connection.collection('video-profiles');
    
    const videos = await VideoProfiles.find({}).toArray();
    
    console.log(`📊 Found ${videos.length} videos in 'video-profiles' collection\n`);
    
    videos.forEach((video, i) => {
      console.log(`Video ${i + 1}:`);
      console.log(`  ID: ${video._id}`);
      console.log(`  Profile ID: ${video.profileId}`);
      console.log(`  URL: ${video.videoUrl}`);
      console.log(`  Public: ${video.isPublic}`);
      console.log(`  Views: ${video.views}`);
      console.log('');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkVideoProfiles();
