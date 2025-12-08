/**
 * Check Specific Video - Debug Script
 */

const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/profile-builder';

async function checkSpecificVideo() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const VideoProfile = mongoose.connection.collection('videoprofiles');
    const profileId = '6933d7a063d9b54ff132684f';
    
    console.log(`🔍 Looking for video with profile ID: ${profileId}\n`);
    
    const video = await VideoProfile.findOne({ 
      profileId: new mongoose.Types.ObjectId(profileId) 
    });
    
    if (video) {
      console.log('📹 Video found:');
      console.log(JSON.stringify(video, null, 2));
    } else {
      console.log('⚠️  No video found for this profile ID');
    }

    // Also check all videos
    const allVideos = await VideoProfile.find({}).toArray();
    console.log(`\n📊 Total videos in collection: ${allVideos.length}`);
    
    if (allVideos.length > 0) {
      console.log('\nAll videos:');
      allVideos.forEach((v, i) => {
        console.log(`\n${i + 1}. Video ID: ${v._id}`);
        console.log(`   Profile ID: ${v.profileId}`);
        console.log(`   URL: ${v.videoUrl}`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkSpecificVideo();
