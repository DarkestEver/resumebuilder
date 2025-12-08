/**
 * Fix Specific Video URL
 */

const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/profile-builder';

async function fixVideoUrl() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const VideoProfile = mongoose.connection.collection('videoprofiles');
    
    const videoId = '6936f52e9f5b24b613b83a20';
    
    console.log(`🔍 Finding video with ID: ${videoId}`);
    
    const video = await VideoProfile.findOne({ 
      _id: new mongoose.Types.ObjectId(videoId) 
    });
    
    if (!video) {
      console.log('⚠️  Video not found');
      process.exit(1);
    }
    
    console.log('\n📹 Current video data:');
    console.log(`   URL: ${video.videoUrl}`);
    console.log(`   Profile ID: ${video.profileId}`);
    
    // Extract filename from old URL
    const oldUrl = video.videoUrl;
    const filename = oldUrl.split('/').pop();
    const newUrl = `/uploads/videos/${filename}`;
    
    console.log('\n🔄 Updating URL:');
    console.log(`   OLD: ${oldUrl}`);
    console.log(`   NEW: ${newUrl}`);
    
    const result = await VideoProfile.updateOne(
      { _id: new mongoose.Types.ObjectId(videoId) },
      { $set: { videoUrl: newUrl } }
    );
    
    if (result.modifiedCount > 0) {
      console.log('\n✅ Video URL updated successfully!');
    } else {
      console.log('\n⚠️  No changes made');
    }
    
    // Verify the update
    const updatedVideo = await VideoProfile.findOne({ 
      _id: new mongoose.Types.ObjectId(videoId) 
    });
    console.log('\n✅ Verified new URL:', updatedVideo.videoUrl);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixVideoUrl();
