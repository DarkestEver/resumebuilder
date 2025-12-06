const mongoose = require('mongoose');

// Manually set MongoDB URI
const MONGODB_URI = 'mongodb://localhost:27017/profilebuilder';

const resumeSchema = new mongoose.Schema({
  title: String,
  slug: String,
  visibility: String,
  userId: mongoose.Schema.Types.ObjectId,
}, { collection: 'resumes' });

const Resume = mongoose.model('Resume', resumeSchema);

async function checkSlugs() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const resumes = await Resume.find({ slug: { $exists: true, $ne: null } })
      .select('title slug visibility userId')
      .limit(10);

    console.log('\n=== Resumes with Slugs ===\n');
    
    if (resumes.length === 0) {
      console.log('❌ No resumes with slugs found!');
      console.log('\nTo test the slug feature:');
      console.log('1. Go to http://localhost:3000/resume');
      console.log('2. Create a new resume');
      console.log('3. Set a custom slug (e.g., "my-portfolio")');
      console.log('4. Then test with: http://localhost:3000/#/my-portfolio');
    } else {
      resumes.forEach(resume => {
        console.log(`📄 Title: ${resume.title}`);
        console.log(`   Slug: ${resume.slug}`);
        console.log(`   Visibility: ${resume.visibility}`);
        console.log(`   Test URL: http://localhost:3000/#/${resume.slug}`);
        console.log('');
      });
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkSlugs();
