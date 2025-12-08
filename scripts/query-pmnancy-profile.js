/**
 * Query Specific Profile by Username
 */

const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'profilebuilder';

async function queryProfile() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db(dbName);
    
    // Find user by username
    const usersColl = db.collection('users');
    const user = await usersColl.findOne({ username: 'pmnancy' });
    
    if (!user) {
      console.log('⚠️  User not found');
      return;
    }
    
    console.log('👤 User found:');
    console.log(`  ID: ${user._id}`);
    console.log(`  Name: ${user.name}`);
    console.log(`  Email: ${user.email}`);
    
    // Find profile
    const profilesColl = db.collection('profiles');
    const profile = await profilesColl.findOne({ userId: user._id });
    
    if (!profile) {
      console.log('\n⚠️  Profile not found');
      return;
    }
    
    console.log('\n📝 Profile found:');
    console.log(`  ID: ${profile._id}`);
    console.log(`  Has videoProfile:`, !!profile.videoProfile);
    
    if (profile.videoProfile) {
      console.log('\n📹 Video Profile (embedded in profile):');
      console.log(JSON.stringify(profile.videoProfile, null, 2));
    }
    
    // Now check video-profiles collection
    const videoProfilesColl = db.collection('video-profiles');
    const videoProfile = await videoProfilesColl.findOne({ profileId: profile._id });
    
    if (videoProfile) {
      console.log('\n📹 Video Profile (separate collection):');
      console.log(JSON.stringify(videoProfile, null, 2));
      
      // Fix if needed
      if (!videoProfile.videoUrl.startsWith('/uploads/')) {
        const filename = videoProfile.videoUrl.split('/').pop();
        const newUrl = `/uploads/videos/${filename}`;
        
        console.log(`\n🔄 Fixing URL:`);
        console.log(`  OLD: ${videoProfile.videoUrl}`);
        console.log(`  NEW: ${newUrl}`);
        
        await videoProfilesColl.updateOne(
          { _id: videoProfile._id },
          { $set: { videoUrl: newUrl } }
        );
        
        console.log('✅ Updated!');
      } else {
        console.log('\n✅ URL is already correct');
      }
    } else {
      console.log('\n⚠️  No video profile in separate collection');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

queryProfile();
