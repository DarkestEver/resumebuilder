/**
 * Fix Video URLs - Migration Script
 * Updates old video URL format to new format
 * OLD: /videos/{profileId}/{filename}
 * NEW: /uploads/videos/{filename}
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

async function fixVideoUrls() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🔍 Finding videos with old URL format...');
    const videos = await VideoProfile.find({
      videoUrl: { $regex: '^/videos/' }
    });

    console.log(`📊 Found ${videos.length} videos to update`);

    if (videos.length === 0) {
      console.log('✅ No videos need updating');
      process.exit(0);
    }

    let updated = 0;
    let failed = 0;

    for (const video of videos) {
      try {
        const oldUrl = video.videoUrl;
        // Extract filename from old format: /videos/{profileId}/{filename}
        const filename = oldUrl.split('/').pop();
        const newUrl = `/uploads/videos/${filename}`;

        console.log(`\n📝 Updating video ${video._id}`);
        console.log(`   OLD: ${oldUrl}`);
        console.log(`   NEW: ${newUrl}`);

        video.videoUrl = newUrl;
        await video.save();
        
        updated++;
        console.log('   ✅ Updated successfully');
      } catch (error) {
        failed++;
        console.error(`   ❌ Failed to update video ${video._id}:`, error.message);
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📦 Total: ${videos.length}`);

    console.log('\n✅ Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

fixVideoUrls();
