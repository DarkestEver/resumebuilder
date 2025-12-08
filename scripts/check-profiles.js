/**
 * Debug Script: Check existing profile data
 */

const mongoose = require('mongoose');

// MongoDB Connection
const MONGODB_URI = 'mongodb://localhost:27017/profilebuilder';

async function checkProfiles() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📚 Available collections:');
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    // Check for profiles
    const Profile = mongoose.model('Profile', new mongoose.Schema({}, { strict: false, collection: 'profiles' }));
    const profiles = await Profile.find({}).lean();
    console.log(`\n👤 Found ${profiles.length} profiles`);
    if (profiles.length > 0) {
      console.log('\nFirst profile sample:');
      console.log(JSON.stringify(profiles[0], null, 2));
    }
    
    // Check for profilecollections
    const ProfileCollection = mongoose.model('ProfileCollection', new mongoose.Schema({}, { strict: false, collection: 'profilecollections' }));
    const profileCollections = await ProfileCollection.find({}).lean();
    console.log(`\n📁 Found ${profileCollections.length} profile collections`);
    if (profileCollections.length > 0) {
      console.log('\nFirst profile collection sample:');
      console.log(JSON.stringify(profileCollections[0], null, 2));
    }
    
    // Check for users
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false, collection: 'users' }));
    const users = await User.find({}).lean();
    console.log(`\n👥 Found ${users.length} users`);
    if (users.length > 0) {
      console.log('\nFirst user sample (limited fields):');
      const { _id, email, username } = users[0];
      console.log({ _id, email, username });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkProfiles();
