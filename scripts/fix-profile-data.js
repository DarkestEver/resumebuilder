/**
 * Script to check and fix profile data
 * Finds profiles where lastName looks like a title and fixes them
 */

const mongoose = require('mongoose');

// MongoDB Connection
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/profilebuilder';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Define Profile Schema (simplified)
const ProfileSchema = new mongoose.Schema({
  personalInfo: {
    firstName: String,
    lastName: String,
    title: String,
  },
  contact: {
    email: String,
  }
}, { strict: false });

const Profile = mongoose.model('profiles', ProfileSchema);

async function checkAndFixProfiles() {
  try {
    console.log('\n🔍 Checking all profiles...\n');
    
    const profiles = await Profile.find({});
    console.log(`Found ${profiles.length} profiles\n`);
    
    for (const profile of profiles) {
      console.log('-------------------');
      console.log(`Profile ID: ${profile._id}`);
      console.log(`Email: ${profile.contact?.email}`);
      console.log(`Current Data:`);
      console.log(`  firstName: "${profile.personalInfo?.firstName}"`);
      console.log(`  lastName: "${profile.personalInfo?.lastName}"`);
      console.log(`  title: "${profile.personalInfo?.title}"`);
      
      // Check if lastName looks like it's actually a title
      const lastName = profile.personalInfo?.lastName || '';
      const title = profile.personalInfo?.title || '';
      
      // Common job titles that might be in lastName
      const jobTitleWords = ['manager', 'developer', 'engineer', 'designer', 'analyst', 'consultant', 'director', 'specialist', 'coordinator', 'administrator', 'executive', 'lead', 'senior', 'junior', 'intern'];
      
      const lastNameHasJobTitle = jobTitleWords.some(word => 
        lastName.toLowerCase().includes(word)
      );
      
      if (lastNameHasJobTitle && lastName === title) {
        console.log('\n⚠️  ISSUE DETECTED: lastName appears to be a duplicate of title!');
        console.log('This profile needs manual fixing.');
        console.log('Please update the profile with correct firstName and lastName.\n');
      } else if (lastNameHasJobTitle) {
        console.log('\n⚠️  WARNING: lastName might be a job title instead of actual last name');
        console.log(`  Suggested fix: Move "${lastName}" to title field if it's not a real surname\n`);
      } else {
        console.log('✅ Profile looks OK\n');
      }
    }
    
    console.log('-------------------');
    console.log('\n✅ Profile check complete!');
    console.log('\nTo fix these issues:');
    console.log('1. Go to the Profile page in the app');
    console.log('2. Update First Name and Last Name with correct values');
    console.log('3. Make sure Title is set correctly');
    console.log('4. Click Save\n');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

checkAndFixProfiles();
