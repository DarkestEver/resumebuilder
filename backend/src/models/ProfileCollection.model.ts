import mongoose, { Document, Schema } from 'mongoose';

/**
 * ProfileCollection Model - Multiple Profiles per User
 * Each user can have multiple professional profiles (e.g., "Software Engineer", "Consultant", "Freelancer")
 * Resumes are created from a specific profile
 */

export interface IProfileCollection extends Document {
  userId: mongoose.Types.ObjectId;
  profileName: string; // "Software Engineer Profile", "Marketing Profile", etc.
  isDefault: boolean; // Default profile for new resumes
  
  // Personal Information
  personalInfo: {
    firstName: string;
    lastName: string;
    title?: string;
    photo?: string;
    dateOfBirth?: Date;
    nationality?: string;
  };
  
  // Contact
  contact: {
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    website?: string;
  };
  
  // Professional Summary
  summary?: string;
  
  // Experience
  experience: Array<{
    _id?: mongoose.Types.ObjectId;
    company: string;
    role: string;
    location?: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description?: string;
    achievements: string[];
  }>;
  
  // Education
  education: Array<{
    _id?: mongoose.Types.ObjectId;
    institution: string;
    degree: string;
    field: string;
    location?: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    gpa?: number;
    honors?: string;
  }>;
  
  // Skills
  skills: Array<{
    _id?: mongoose.Types.ObjectId;
    name: string;
    category?: string;
    proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    yearsOfExperience?: number;
  }>;
  
  // Projects
  projects: Array<{
    _id?: mongoose.Types.ObjectId;
    name: string;
    description: string;
    technologies: string[];
    link?: string;
    startDate?: Date;
    endDate?: Date;
  }>;
  
  // Certifications
  certifications: Array<{
    _id?: mongoose.Types.ObjectId;
    name: string;
    issuer: string;
    date: Date;
    expiryDate?: Date;
    credentialId?: string;
    verificationUrl?: string;
  }>;
  
  // Achievements
  achievements: Array<{
    _id?: mongoose.Types.ObjectId;
    title: string;
    description: string;
    date?: Date;
  }>;
  
  // Languages
  languages: Array<{
    _id?: mongoose.Types.ObjectId;
    language: string;
    proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
  }>;
  
  // Courses
  courses: Array<{
    _id?: mongoose.Types.ObjectId;
    name: string;
    institution: string;
    completionDate?: Date;
    certificateUrl?: string;
  }>;
  
  // Social Links
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
    other?: string;
  };
  
  // Interests/Hobbies
  interests: string[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const ProfileCollectionSchema = new Schema<IProfileCollection>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    profileName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    isDefault: {
      type: Boolean,
      default: false,
      index: true,
    },
    personalInfo: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, required: true, trim: true },
      title: { type: String, trim: true },
      photo: { type: String },
      dateOfBirth: { type: Date },
      nationality: { type: String, trim: true },
    },
    contact: {
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, trim: true },
      address: { type: String, trim: true },
      city: { type: String, trim: true },
      country: { type: String, trim: true },
      postalCode: { type: String, trim: true },
      website: { type: String, trim: true },
    },
    summary: { type: String, trim: true },
    experience: [
      {
        company: { type: String, required: true, trim: true },
        role: { type: String, required: true, trim: true },
        location: { type: String, trim: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        current: { type: Boolean, default: false },
        description: { type: String, trim: true },
        achievements: [{ type: String, trim: true }],
      },
    ],
    education: [
      {
        institution: { type: String, required: true, trim: true },
        degree: { type: String, required: true, trim: true },
        field: { type: String, required: true, trim: true },
        location: { type: String, trim: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        current: { type: Boolean, default: false },
        gpa: { type: Number, min: 0, max: 4 },
        honors: { type: String, trim: true },
      },
    ],
    skills: [
      {
        name: { type: String, required: true, trim: true },
        category: { type: String, trim: true },
        proficiency: {
          type: String,
          enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        },
        yearsOfExperience: { type: Number, min: 0 },
      },
    ],
    projects: [
      {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        technologies: [{ type: String, trim: true }],
        link: { type: String, trim: true },
        startDate: { type: Date },
        endDate: { type: Date },
      },
    ],
    certifications: [
      {
        name: { type: String, required: true, trim: true },
        issuer: { type: String, required: true, trim: true },
        date: { type: Date, required: true },
        expiryDate: { type: Date },
        credentialId: { type: String, trim: true },
        verificationUrl: { type: String, trim: true },
      },
    ],
    achievements: [
      {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        date: { type: Date },
      },
    ],
    languages: [
      {
        language: { type: String, required: true, trim: true },
        proficiency: {
          type: String,
          required: true,
          enum: ['basic', 'conversational', 'fluent', 'native'],
        },
      },
    ],
    courses: [
      {
        name: { type: String, required: true, trim: true },
        institution: { type: String, required: true, trim: true },
        completionDate: { type: Date },
        certificateUrl: { type: String, trim: true },
      },
    ],
    socialLinks: {
      linkedin: { type: String, trim: true },
      github: { type: String, trim: true },
      twitter: { type: String, trim: true },
      portfolio: { type: String, trim: true },
      other: { type: String, trim: true },
    },
    interests: [{ type: String, trim: true }],
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Indexes
ProfileCollectionSchema.index({ userId: 1, isDefault: 1 });
ProfileCollectionSchema.index({ userId: 1, profileName: 1 });
ProfileCollectionSchema.index({ userId: 1, deletedAt: 1 });

// Ensure only one default profile per user
ProfileCollectionSchema.pre('save', async function (next) {
  if (this.isDefault && this.isModified('isDefault')) {
    await mongoose.model('ProfileCollection').updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  next();
});

export const ProfileCollection = mongoose.model<IProfileCollection>(
  'ProfileCollection',
  ProfileCollectionSchema
);
