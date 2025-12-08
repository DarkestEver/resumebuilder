/**
 * Direct MongoDB Query to Find and Fix Video URL
 */

const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'profile-builder';

async function fixVideoData() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db(dbName);
    
    // Check all collections
    const collections = await db.listCollections().toArray();
    console.log('📚 Collections:', collections.map(c => c.name).join(', '));
    console.log('');
    
    // Check video-profiles collection
    const videoProfilesColl = db.collection('video-profiles');
    const videoProfiles = await videoProfilesColl.find({}).toArray();
    console.log(`📹 video-profiles collection: ${videoProfiles.length} documents`);
    
    if (videoProfiles.length > 0) {
      for (const vp of videoProfiles) {
        console.log(`\nVideo Profile ${vp._id}:`);
        console.log(`  Profile ID: ${vp.profileId}`);
        console.log(`  URL: ${vp.videoUrl}`);
        
        if (!vp.videoUrl.startsWith('/uploads/')) {
          const filename = vp.videoUrl.split('/').pop();
          const newUrl = `/uploads/videos/${filename}`;
          
          console.log(`  🔄 Updating to: ${newUrl}`);
          await videoProfilesColl.updateOne(
            { _id: vp._id },
            { $set: { videoUrl: newUrl } }
          );
          console.log('  ✅ Updated');
        }
      }
    }
    
    // Check profiles collection for embedded videoProfile
    const profilesColl = db.collection('profiles');
    const profilesWithVideo = await profilesColl.find({ 
      'videoProfile': { $exists: true } 
    }).toArray();
    
    console.log(`\n📝 profiles with videoProfile: ${profilesWithVideo.length} documents`);
    
    if (profilesWithVideo.length > 0) {
      for (const profile of profilesWithVideo) {
        console.log(`\nProfile ${profile._id}:`);
        console.log(`  Video data:`, JSON.stringify(profile.videoProfile, null, 2));
        
        if (profile.videoProfile && profile.videoProfile.url && !profile.videoProfile.url.startsWith('/uploads/')) {
          const filename = profile.videoProfile.url.split('/').pop();
          const newUrl = `/uploads/videos/${filename}`;
          
          console.log(`  🔄 Updating to: ${newUrl}`);
          await profilesColl.updateOne(
            { _id: profile._id },
            { $set: { 'videoProfile.url': newUrl } }
          );
          console.log('  ✅ Updated');
        }
      }
    }
    
    console.log('\n✅ Done!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

fixVideoData();
