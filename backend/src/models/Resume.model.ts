import mongoose, { Document, Schema } from 'mongoose';

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  profileId: mongoose.Types.ObjectId;
  
  title: string;
  templateId: string;
  
  // Resume-specific data (copied from profile, can be edited independently)
  data?: {
    personalInfo?: any;
    contact?: any;
    summary?: string;
    experience?: any[];
    education?: any[];
    skills?: any[];
    projects?: any[];
    certifications?: any[];
    languages?: any[];
    achievements?: any[];
  };
  
  lastSyncedAt?: Date; // Track when data was last synced from profile
  
  // Customizations override profile data
  customizations: {
    colors?: {
      primary?: string;
      secondary?: string;
      text?: string;
    };
    fonts?: {
      heading?: string;
      body?: string;
    };
    layout?: {
      spacing?: 'compact' | 'normal' | 'relaxed';
      columns?: 1 | 2;
    };
    sections?: {
      order?: string[];
      visibility?: Record<string, boolean>;
    };
  };
  
  // Privacy settings
  visibility: 'private' | 'public' | 'password' | 'expiring';
  password?: string;
  expiryDate?: Date;
  maxViews?: number;
  currentViews: number;
  
  // Tailored resume
  tailoredFor?: {
    jobTitle?: string;
    company?: string;
    jobDescription?: string;
    keywords?: string[];
    matchScore?: number;
  };
  
  // Public profile
  shortId?: string; // For yourdomain.com/r/xyz123
  slug?: string; // Custom slug for yourdomain.com/username/slug
  qrCode?: string; // S3 URL
  
  // Expiry and soft delete
  expiresAt?: Date;
  deletedAt?: Date;
  
  // Analytics
  viewCount: number;
  downloadCount: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    profileId: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
      index: true,
    },
    
    title: {
      type: String,
      required: true,
      default: 'My Resume',
    },
    
    templateId: {
      type: String,
      required: true,
      default: 'minimalist',
    },
    
    // Resume-specific data (editable copy from profile)
    data: {
      personalInfo: Schema.Types.Mixed,
      contact: Schema.Types.Mixed,
      summary: String,
      experience: [Schema.Types.Mixed],
      education: [Schema.Types.Mixed],
      skills: [Schema.Types.Mixed],
      projects: [Schema.Types.Mixed],
      certifications: [Schema.Types.Mixed],
      languages: [Schema.Types.Mixed],
      achievements: [Schema.Types.Mixed],
    },
    
    lastSyncedAt: Date,
    
    customizations: {
      colors: {
        primary: String,
        secondary: String,
        accent: String,
        text: String,
      },
      fonts: {
        heading: String,
        body: String,
      },
      layout: {
        type: Schema.Types.Mixed, // Allow string or object for flexibility
      },
      hiddenSections: [String], // Array of section IDs to hide
      sections: {
        order: [String],
        visibility: Schema.Types.Mixed,
      },
    },
    
    visibility: {
      type: String,
      enum: ['private', 'public', 'password', 'expiring'],
      default: 'private',
    },
    
    password: {
      type: String,
      select: false,
    },
    
    expiryDate: Date,
    
    maxViews: Number,
    
    currentViews: {
      type: Number,
      default: 0,
    },
    
    tailoredFor: {
      jobTitle: String,
      company: String,
      jobDescription: String,
      keywords: [String],
      matchScore: Number,
    },
    
    shortId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    
    qrCode: String,
    
    viewCount: {
      type: Number,
      default: 0,
    },
    
    downloadCount: {
      type: Number,
      default: 0,
    },
    
    expiresAt: Date,
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
ResumeSchema.index({ userId: 1, createdAt: -1 });
ResumeSchema.index({ shortId: 1 });
ResumeSchema.index({ visibility: 1 });
// Partial index: only enforce uniqueness when slug is not null
ResumeSchema.index(
  { userId: 1, slug: 1 }, 
  { 
    unique: true, 
    partialFilterExpression: { slug: { $type: 'string' } } 
  }
);

export const Resume = mongoose.model<IResume>('Resume', ResumeSchema);
