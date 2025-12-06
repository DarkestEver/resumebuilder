import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalytics extends Document {
  resumeId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  
  // View tracking
  views: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    lastUpdated: Date;
  };
  
  // Downloads
  downloads: {
    total: number;
    lastDownloadedAt?: Date;
  };
  
  // Geographic data
  locations: Array<{
    country?: string;
    city?: string;
    views: number;
    lastViewed: Date;
  }>;
  
  // Device data
  devices: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  
  // Section engagement (which sections users scroll to/view)
  sectionEngagement: {
    summary: number;
    experience: number;
    education: number;
    skills: number;
    projects: number;
    [key: string]: number;
  };
  
  // Referrer tracking
  referrers: Array<{
    source: string;
    count: number;
  }>;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const AnalyticsSchema: Schema = new Schema(
  {
    resumeId: {
      type: Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    
    views: {
      total: {
        type: Number,
        default: 0,
      },
      today: {
        type: Number,
        default: 0,
      },
      thisWeek: {
        type: Number,
        default: 0,
      },
      thisMonth: {
        type: Number,
        default: 0,
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },
    
    downloads: {
      total: {
        type: Number,
        default: 0,
      },
      lastDownloadedAt: Date,
    },
    
    locations: [
      {
        country: String,
        city: String,
        views: {
          type: Number,
          default: 0,
        },
        lastViewed: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    
    devices: {
      mobile: {
        type: Number,
        default: 0,
      },
      desktop: {
        type: Number,
        default: 0,
      },
      tablet: {
        type: Number,
        default: 0,
      },
    },
    
    sectionEngagement: {
      type: Schema.Types.Mixed,
      default: {
        summary: 0,
        experience: 0,
        education: 0,
        skills: 0,
        projects: 0,
      },
    },
    
    referrers: [
      {
        source: String,
        count: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for analytics queries
AnalyticsSchema.index({ resumeId: 1, createdAt: -1 });
AnalyticsSchema.index({ userId: 1, createdAt: -1 });
AnalyticsSchema.index({ 'views.lastUpdated': -1 });

export const Analytics = mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
