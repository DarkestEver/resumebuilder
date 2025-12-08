/**
 * List All Collections and Find Videos
 */

const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/profile-builder';

async function findVideos() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📚 Collections in database:');
    collections.forEach(col => console.log(`   - ${col.name}`));
    
    // Try different collection names
    const possibleNames = ['videoprofiles', 'VideoProfiles', 'video_profiles', 'videoProfile'];
    
    console.log('\n🔍 Searching for videos in collections...\n');
    
    for (const collectionName of possibleNames) {
      try {
        const collection = mongoose.connection.collection(collectionName);
        const count = await collection.countDocuments();
        
        if (count > 0) {
          console.log(`✅ Found ${count} videos in collection: ${collectionName}`);
          const videos = await collection.find({}).toArray();
          videos.forEach((v, i) => {
            console.log(`\n   Video ${i + 1}:`);
            console.log(`   ID: ${v._id}`);
            console.log(`   Profile ID: ${v.profileId}`);
            console.log(`   URL: ${v.videoUrl}`);
            console.log(`   Public: ${v.isPublic}`);
          });
        }
      } catch (err) {
        // Collection doesn't exist, skip
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

findVideos();
