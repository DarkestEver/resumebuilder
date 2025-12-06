const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
}, { collection: 'users', strict: false });

async function setUsername() {
  await mongoose.connect('mongodb://localhost:27017/profilebuilder');
  
  const User = mongoose.model('User', userSchema);
  
  const result = await User.updateOne(
    { email: 'pm.nancy@test.com' },
    { $set: { username: 'pmnancy' } }
  );
  
  console.log('Update result:', result);
  
  const user = await User.findOne({ email: 'pm.nancy@test.com' });
  console.log('✓ Username now set to:', user.username);
  
  await mongoose.connection.close();
}

setUsername().catch(console.error);
