/**
 * Database Seeding Script - Populate with 50+ Test Users
 * Run: npx ts-node scripts/seedDatabase.ts
 */

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from '../backend/src/models/User.model';
import { Profile } from '../backend/src/models/Profile.model';
import { Resume } from '../backend/src/models/Resume.model';
import { TEST_CREDENTIALS, DUMMY_USER_DATA, generateDummyUsers } from './dummyData';

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/profilebuilder';

interface DummyUser {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  phone?: string;
  location?: string;
  company?: string;
  role?: string;
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    console.log(`📡 Connecting to MongoDB: ${MONGODB_URI}`);

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await User.deleteMany({});
    // await Profile.deleteMany({});
    // await Resume.deleteMany({});
    // console.log('🗑️ Cleared existing data');

    // Seed users from TEST_CREDENTIALS
    const seededUsers = [];
    for (const credential of TEST_CREDENTIALS) {
      const existingUser = await User.findOne({ email: credential.email });

      if (!existingUser) {
        // Hash password
        const hashedPassword = await bcrypt.hash(credential.password, 10);

        // Get dummy data if available
        const dummyData = DUMMY_USER_DATA[credential.email as keyof typeof DUMMY_USER_DATA];

        // Create user
        const user = await User.create({
          email: credential.email,
          password: hashedPassword,
          firstName: dummyData?.firstName || credential.email.split('.')[0],
          lastName: dummyData?.lastName || 'Test',
          title: dummyData?.title || credential.role,
          isVerified: true,
          subscriptionTier: ['pro', 'free', 'enterprise'][Math.floor(Math.random() * 3)],
          role: 'user',
          createdAt: new Date(2023 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
        });

        // Create associated profile
        if (dummyData) {
          const profile = await Profile.create({
            userId: user._id,
            firstName: dummyData.firstName,
            lastName: dummyData.lastName,
            email: dummyData.email,
            phone: dummyData.phone,
            location: dummyData.location,
            title: dummyData.title,
            summary: dummyData.summary,
            personalInfo: {
              firstName: dummyData.firstName,
              lastName: dummyData.lastName,
              title: dummyData.title,
            },
            contact: {
              email: dummyData.email,
              phone: dummyData.phone,
              location: dummyData.location,
            },
            experience: dummyData.experience || [],
            education: dummyData.education || [],
            skills: dummyData.skills || [],
            certifications: dummyData.certifications || [],
            projects: [],
            achievements: [],
            languages: ['English'],
            courses: [],
            interests: [],
            links: {
              linkedin: `https://linkedin.com/in/${dummyData.firstName.toLowerCase()}-${dummyData.lastName.toLowerCase()}`,
              github: `https://github.com/${dummyData.firstName.toLowerCase()}`,
              portfolio: `https://${dummyData.firstName.toLowerCase()}.com`,
            },
          });

          // Create 2-3 resumes per user
          const templateIds = [
            credential.role || 'software-engineer',
            ['software-engineer', 'data-scientist', 'project-manager', 'financial-analyst', 'designer'][
              Math.floor(Math.random() * 5)
            ],
            ['modern', 'classic', 'minimal', 'creative', 'executive', 'technical'][
              Math.floor(Math.random() * 6)
            ],
          ];

          for (let i = 0; i < 2; i++) {
            await Resume.create({
              userId: user._id,
              profileId: profile._id,
              title: `${dummyData.title} - Resume ${i + 1}`,
              templateId: templateIds[i],
              visibility: i === 0 ? 'public' : 'private',
              isAts: i === 0,
              customizations: {
                colors: {
                  primary: ['#0066cc', '#006644', '#663300', '#660066'][Math.floor(Math.random() * 4)],
                  secondary: '#f0f0f0',
                },
                sections: {
                  hideObjective: Math.random() > 0.5,
                  hideLinks: false,
                },
              },
              createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
            });
          }
        } else {
          // Create minimal profile for users without dummy data
          const profile = await Profile.create({
            userId: user._id,
            firstName: credential.email.split('.')[0],
            lastName: 'Test User',
            email: credential.email,
            phone: '+1-555-0000',
            location: 'San Francisco, CA',
            title: credential.role || 'Professional',
            summary: `Professional ${credential.role || 'profile'} for testing purposes.`,
            personalInfo: {
              firstName: credential.email.split('.')[0],
              lastName: 'Test User',
              title: credential.role || 'Professional',
            },
            contact: {
              email: credential.email,
              phone: '+1-555-0000',
              location: 'San Francisco, CA',
            },
            skills: ['Communication', 'Problem Solving', 'Leadership', 'Team Work'],
            experience: [],
            education: [
              {
                school: 'Test University',
                degree: 'BS',
                field: 'Computer Science',
                graduationYear: 2020,
              },
            ],
          });

          // Create 1 resume for minimal profile
          await Resume.create({
            userId: user._id,
            profileId: profile._id,
            title: `${credential.role || 'Professional'} Resume`,
            templateId: credential.role || 'software-engineer',
            visibility: 'private',
            isAts: false,
            customizations: {
              colors: {
                primary: '#0066cc',
                secondary: '#f0f0f0',
              },
            },
          });
        }

        seededUsers.push({
          email: credential.email,
          password: credential.password,
          role: credential.role,
        });

        console.log(`✅ Created user: ${credential.email}`);
      } else {
        console.log(`⏭️ Skipped existing user: ${credential.email}`);
      }
    }

    // Generate and seed additional random users (20-30 more)
    console.log('\n📝 Generating additional random users...');
    const additionalUsers = generateDummyUsers(20);

    for (const userData of additionalUsers) {
      const existingUser = await User.findOne({ email: userData.email });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const user = await User.create({
          email: userData.email,
          password: hashedPassword,
          firstName: userData.firstName || 'User',
          lastName: userData.lastName || '###',
          title: userData.title || 'Professional',
          isVerified: true,
          subscriptionTier: ['pro', 'free', 'enterprise'][Math.floor(Math.random() * 3)],
          role: 'user',
          createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
        });

        // Create profile
        const profile = await Profile.create({
          userId: user._id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          location: userData.location,
          title: userData.title,
          summary: `${userData.title} with expertise in various domains.`,
          personalInfo: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            title: userData.title,
          },
          contact: {
            email: userData.email,
            phone: userData.phone,
            location: userData.location,
          },
          skills: ['Skill 1', 'Skill 2', 'Skill 3', 'Skill 4'],
          experience: [],
          education: [
            {
              school: 'University',
              degree: 'BS',
              field: 'Related Field',
              graduationYear: 2020,
            },
          ],
        });

        // Create resume
        await Resume.create({
          userId: user._id,
          profileId: profile._id,
          title: `${userData.title} Resume`,
          templateId: userData.role || 'software-engineer',
          visibility: 'private',
          isAts: false,
          customizations: {
            colors: {
              primary: '#0066cc',
              secondary: '#f0f0f0',
            },
          },
        });

        console.log(`✅ Created user: ${userData.email}`);
      }
    }

    console.log(`\n✅ Database seeding completed!`);
    console.log(`📊 Total test users created: ${seededUsers.length + additionalUsers.length}`);
    console.log('\n📋 TEST CREDENTIALS (use for login):');
    console.log('═'.repeat(60));

    seededUsers.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Role: ${user.role}`);
      console.log('');
    });

    console.log('\n💾 Remember to save these credentials for testing!');
    console.log('📝 You can also find them in scripts/dummyData.ts');

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase().catch(console.error);
