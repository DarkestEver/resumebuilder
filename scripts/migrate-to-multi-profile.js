/**
 * Migration Script: Convert legacy Profile model to ProfileCollection
 * 
 * This script migrates existing single-profile data to the new multi-profile system:
 * 1. For each user with a Profile, create a ProfileCollection with isDefault=true
 * 2. Update all Resumes to reference the new ProfileCollection
 * 3. Keep legacy Profile for backward compatibility
 * 
 * Run with: node scripts/migrate-to-multi-profile.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/resume-builder';

// Import models (we'll define schemas inline to avoid import issues)
const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  personalInfo: {
    firstName: String,
    lastName: String,
    title: String,
    photo: String,
    dateOfBirth: Date,
    nationality: String,
  },
  contact: {
    email: String,
    phone: String,
    address: String,
    city: String,
    country: String,
    postalCode: String,
    website: String,
  },
  summary: String,
  experience: Array,
  education: Array,
  skills: Array,
  projects: Array,
  certifications: Array,
  achievements: Array,
  languages: Array,
  courses: Array,
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String,
    portfolio: String,
    other: String,
  },
  interests: [String],
  deletedAt: Date,
}, { timestamps: true });

const ProfileCollectionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  profileName: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  personalInfo: {
    firstName: String,
    lastName: String,
    title: String,
    photo: String,
    dateOfBirth: Date,
    nationality: String,
  },
  contact: {
    email: String,
    phone: String,
    address: String,
    city: String,
    country: String,
    postalCode: String,
    website: String,
  },
  summary: String,
  experience: Array,
  education: Array,
  skills: Array,
  projects: Array,
  certifications: Array,
  achievements: Array,
  languages: Array,
  courses: Array,
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String,
    portfolio: String,
    other: String,
  },
  interests: [String],
  deletedAt: Date,
}, { timestamps: true });

const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProfileCollection' },
  title: String,
  templateId: String,
  customizations: Object,
  visibility: String,
  deletedAt: Date,
}, { timestamps: true });

async function migrateToMultiProfile() {
  try {
    console.log('🚀 Starting migration to multi-profile system...\n');

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const Profile = mongoose.model('Profile', ProfileSchema);
    const ProfileCollection = mongoose.model('ProfileCollection', ProfileCollectionSchema);
    const Resume = mongoose.model('Resume', ResumeSchema);

    // Get all existing profiles
    const profiles = await Profile.find({ deletedAt: null });
    console.log(`📊 Found ${profiles.length} existing profiles\n`);

    let migratedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const profile of profiles) {
      try {
        // Check if ProfileCollection already exists for this user
        const existingCollection = await ProfileCollection.findOne({
          userId: profile.userId,
          deletedAt: null,
        });

        if (existingCollection) {
          console.log(`⏭️  User ${profile.userId} already has ProfileCollection, skipping...`);
          skippedCount++;
          continue;
        }

        // Create ProfileCollection from Profile
        const profileData = profile.toObject();
        delete profileData._id;

        const profileCollection = new ProfileCollection({
          ...profileData,
          profileName: 'Default Profile',
          isDefault: true,
        });

        await profileCollection.save();
        console.log(`✅ Created ProfileCollection for user ${profile.userId}`);

        // Update all resumes for this user to reference the new ProfileCollection
        const updateResult = await Resume.updateMany(
          {
            userId: profile.userId,
            profileId: profile._id, // Old reference to Profile
            deletedAt: null,
          },
          {
            $set: { profileId: profileCollection._id }, // New reference to ProfileCollection
          }
        );

        console.log(`   📄 Updated ${updateResult.modifiedCount} resume(s) for this user\n`);
        migratedCount++;
      } catch (error) {
        console.error(`❌ Error migrating profile ${profile._id}:`, error.message);
        errorCount++;
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successfully migrated: ${migratedCount}`);
    console.log(`⏭️  Skipped (already exists): ${skippedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📊 Total processed: ${profiles.length}`);
    console.log('='.repeat(60) + '\n');

    // Verify migration
    const totalCollections = await ProfileCollection.countDocuments({ deletedAt: null });
    console.log(`✅ Total ProfileCollections in database: ${totalCollections}\n`);

    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run migration
migrateToMultiProfile();
