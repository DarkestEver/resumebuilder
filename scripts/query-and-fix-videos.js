/**
 * Query Using Mongoose Model
 */

const mongoose = require('mongoose');
const path = require('path');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/profile-builder';

// Define schema exactly as in the model
const VideoProfileSchema = new mongoose.Schema(
  {
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
      unique: true,
      index: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    duration: Number,
    fileSize: Number,
    uploadedAt: Date,
    isPublic: Boolean,
    views: Number,
    likes: Number,
  },
  {
    timestamps: true,
    collection: 'video-profiles',
  }
);

async function queryVideos() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const VideoProfile = mongoose.model('VideoProfile', VideoProfileSchema);
    
    const videos = await VideoProfile.find({});
    
    console.log(`📊 Found ${videos.length} videos using Mongoose model\n`);
    
    if (videos.length > 0) {
      videos.forEach((video, i) => {
        console.log(`Video ${i + 1}:`);
        console.log(`  ID: ${video._id}`);
        console.log(`  Profile ID: ${video.profileId}`);
        console.log(`  URL: ${video.videoUrl}`);
        console.log(`  Public: ${video.isPublic}`);
        console.log('');
      });
      
      // Now update the URLs
      console.log('🔄 Updating video URLs...\n');
      
      for (const video of videos) {
        if (video.videoUrl && !video.videoUrl.startsWith('/uploads/')) {
          const oldUrl = video.videoUrl;
          const filename = oldUrl.split('/').pop();
          const newUrl = `/uploads/videos/${filename}`;
          
          console.log(`📝 Updating video ${video._id}:`);
          console.log(`   OLD: ${oldUrl}`);
          console.log(`   NEW: ${newUrl}`);
          
          video.videoUrl = newUrl;
          await video.save();
          
          console.log('   ✅ Updated\n');
        }
      }
      
      console.log('✅ All updates complete!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

queryVideos();
