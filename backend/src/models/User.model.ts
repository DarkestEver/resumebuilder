import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  phone?: string;
  profilePhoto?: string;
  emailVerified: boolean;
  emailVerifiedAt?: Date;
  phoneVerified: boolean;
  username?: string;
  role: 'user' | 'admin';
  
  // Subscription
  subscription: {
    plan: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'canceled' | 'past_due' | 'trialing';
    startDate?: Date;
    endDate?: Date;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
  };
  
  // AI Credits
  aiCredits: number;
  
  // OAuth
  googleId?: string;
  linkedinId?: string;
  githubId?: string;
  
  // 2FA
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  backupCodes?: string[];
  
  // Account status
  isActive: boolean;
  deletedAt?: Date;
  
  // Timestamps
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      select: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: String,
    profilePhoto: String,
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifiedAt: Date,
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    
    // Subscription
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'pro', 'enterprise'],
        default: 'free',
      },
      status: {
        type: String,
        enum: ['active', 'canceled', 'past_due', 'trialing'],
        default: 'active',
      },
      startDate: Date,
      endDate: Date,
      stripeCustomerId: String,
      stripeSubscriptionId: String,
    },
    
    // AI Credits
    aiCredits: {
      type: Number,
      default: 1000,
    },
    
    // OAuth
    googleId: String,
    linkedinId: String,
    githubId: String,
    
    // 2FA
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: String,
    backupCodes: [String],
    
    // Account status
    isActive: {
      type: Boolean,
      default: true,
    },
    deletedAt: Date,
    
    // Timestamps
    lastLoginAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ 'subscription.plan': 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
