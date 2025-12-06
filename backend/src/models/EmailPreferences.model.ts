/**
 * Email Preferences Model
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IEmailPreferences extends Document {
  userId: string;
  emailNotifications: boolean;
  marketingEmails: boolean;
  paymentReceipts: boolean;
  weeklyDigest: boolean;
  shares: boolean;
  comments: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EmailPreferencesSchema = new Schema<IEmailPreferences>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    marketingEmails: {
      type: Boolean,
      default: true,
    },
    paymentReceipts: {
      type: Boolean,
      default: true,
    },
    weeklyDigest: {
      type: Boolean,
      default: false,
    },
    shares: {
      type: Boolean,
      default: true,
    },
    comments: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const EmailPreferences = mongoose.model<IEmailPreferences>(
  'EmailPreferences',
  EmailPreferencesSchema
);
