/**
 * Check Video URLs - Debug Script
 */

const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/profile-builder';

const VideoProfileSchema = new mongoose.Schema({
  profileId: { type: mongoose.Schema.Types.ObjectId, required: true },
  videoUrl: { type: String, required: true },
  duration: Number,
  fileSize: Number,
  uploadedAt: Date,
  isPublic: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
});

const VideoProfile = mongoose.model('VideoProfile', VideoProfileSchema);

async function checkVideos() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const videos = await VideoProfile.find({});
    
    console.log(`📊 Total videos in database: ${videos.length}\n`);

    if (videos.length === 0) {
      console.log('⚠️  No videos found in database');
      process.exit(0);
    }

    videos.forEach((video, index) => {
      console.log(`Video ${index + 1}:`);
      console.log(`  ID: ${video._id}`);
      console.log(`  Profile ID: ${video.profileId}`);
      console.log(`  URL: ${video.videoUrl}`);
      console.log(`  Public: ${video.isPublic}`);
      console.log(`  Views: ${video.views}`);
      console.log(`  Uploaded: ${video.uploadedAt}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkVideos();
