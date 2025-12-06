const mongoose = require('mongoose');

async function deleteTestUsers() {
  try {
    await mongoose.connect('mongodb://localhost:27017/profilebuilder');
    
    const userSchema = new mongoose.Schema({
      email: String,
    });
    
    const User = mongoose.model('User', userSchema);
    
    const result = await User.deleteMany({
      email: { $regex: '@test.com' }
    });
    
    console.log('Deleted test users:', result.deletedCount);
    console.log('Also deleting admin accounts...');
    
    const adminResult = await User.deleteMany({
      email: { $regex: '@profilebuilder.com' }
    });
    
    console.log('Deleted admin users:', adminResult.deletedCount);
    
    await mongoose.disconnect();
    console.log('\n✅ Database cleaned');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

deleteTestUsers();
