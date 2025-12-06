const mongoose = require('mongoose');

async function checkUser() {
  await mongoose.connect('mongodb://localhost:27017/profilebuilder');
  
  const User = mongoose.model('User', new mongoose.Schema({}, {strict: false, collection: 'users'}));
  const Profile = mongoose.model('Profile', new mongoose.Schema({}, {strict: false, collection: 'profiles'}));
  
  const user = await User.findOne({email: 'pm.nancy@test.com'});
  
  if (user) {
    console.log('✓ User found:', user.email);
    console.log('  Username:', user.username || 'NOT SET');
    
    const profile = await Profile.findOne({userId: user._id});
    if (profile) {
      console.log('✓ Profile exists');
      console.log('  Name:', profile.personalInfo?.firstName, profile.personalInfo?.lastName);
    } else {
      console.log('✗ NO PROFILE FOUND - User needs to create profile first');
    }
  } else {
    console.log('✗ User not found');
  }
  
  await mongoose.connection.close();
}

checkUser().catch(console.error);
