import mongoose, { Document, Schema } from 'mongoose';

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  
  // Personal Information
  personalInfo: {
    firstName: string;
    lastName: string;
    title?: string;
    photo?: string;
    dateOfBirth?: Date;
    nationality?: string;
    placeOfBirth?: string;
  };
  
  // Soft delete
  deletedAt?: Date;
  
  // Contact
  contact: {
    email: string;
    phone?: string;
    alternatePhone?: string;
    address?: {
      street?: string;
      apartment?: string;
      city?: string;
      state?: string;
      country?: string;
      zipCode?: string;
    };
    website?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };

  // Signature
  signature?: {
    name?: string;
    date?: Date;
    place?: string;
    image?: string;
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
    proficiency: 'elementary' | 'limited' | 'professional' | 'fluent' | 'native';
  }>;
  
  // Courses
  courses: Array<{
    _id?: mongoose.Types.ObjectId;
    name: string;
    institution: string;
    completionDate?: Date;
    certificateUrl?: string;
  }>;
  
  // Links
  links: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    twitter?: string;
    website?: string;
    other?: string[];
  };
  
  // Interests
  interests: string[];
  
  // Publications
  publications: Array<{
    _id?: mongoose.Types.ObjectId;
    title: string;
    publisher: string;
    date: Date;
    url?: string;
    authors: string[];
  }>;
  
  // Patents
  patents: Array<{
    _id?: mongoose.Types.ObjectId;
    title: string;
    patentNumber: string;
    date: Date;
    description?: string;
  }>;
  
  // Video Profile
  videoProfile?: {
    url: string;
    thumbnail?: string;
    transcript?: string;
    duration?: number;
  };
  
  // Metadata
  completionPercentage: number;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    
    personalInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      title: String,
      photo: String,
      dateOfBirth: Date,
      nationality: String,
      placeOfBirth: String,
    },
    
    contact: {
      email: { type: String, required: true },
      phone: String,
      alternatePhone: String,
      address: {
        street: String,
        apartment: String,
        city: String,
        state: String,
        country: String,
        zipCode: String,
      },
      website: String,
      linkedin: String,
      github: String,
      portfolio: String,
    },

    signature: {
      name: String,
      date: Date,
      place: String,
      image: String,
    },
    
    summary: String,
    
    experience: [
      {
        company: { type: String, required: true },
        role: { type: String, required: true },
        location: String,
        startDate: { type: Date, required: true },
        endDate: Date,
        current: { type: Boolean, default: false },
        description: String,
        achievements: [String],
      },
    ],
    
    education: [
      {
        institution: { type: String, required: true },
        degree: { type: String, required: true },
        field: { type: String, required: true },
        location: String,
        startDate: { type: Date, required: true },
        endDate: Date,
        current: { type: Boolean, default: false },
        gpa: Number,
        honors: String,
      },
    ],
    
    skills: [
      {
        name: { type: String, required: true },
        category: String,
        proficiency: {
          type: String,
          enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        },
        yearsOfExperience: Number,
      },
    ],
    
    projects: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
        technologies: [String],
        link: String,
        startDate: Date,
        endDate: Date,
      },
    ],
    
    certifications: [
      {
        name: { type: String, required: true },
        issuer: { type: String, required: true },
        date: { type: Date, required: true },
        expiryDate: Date,
        credentialId: String,
        verificationUrl: String,
      },
    ],
    
    achievements: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        date: Date,
      },
    ],
    
    languages: [
      {
        language: { type: String, required: true },
        proficiency: {
          type: String,
          enum: ['elementary', 'limited', 'professional', 'fluent', 'native'],
          required: true,
        },
      },
    ],
    
    courses: [
      {
        name: { type: String, required: true },
        institution: { type: String, required: true },
        completionDate: Date,
        certificateUrl: String,
      },
    ],
    
    links: {
      github: String,
      linkedin: String,
      portfolio: String,
      twitter: String,
      website: String,
      other: [String],
    },
    
    interests: [String],
    
    publications: [
      {
        title: { type: String, required: true },
        publisher: { type: String, required: true },
        date: { type: Date, required: true },
        url: String,
        authors: [String],
      },
    ],
    
    patents: [
      {
        title: { type: String, required: true },
        patentNumber: { type: String, required: true },
        date: { type: Date, required: true },
        description: String,
      },
    ],
    
    videoProfile: {
      url: String,
      thumbnail: String,
      transcript: String,
      duration: Number,
    },
    
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ProfileSchema.index({ userId: 1 });
ProfileSchema.index({ 'personalInfo.firstName': 1, 'personalInfo.lastName': 1 });

export const Profile = mongoose.model<IProfile>('Profile', ProfileSchema);
