import fs from 'fs';
import { Profile } from '../models/Profile.model';
import { Resume } from '../models/Resume.model';
import { cvParsingService } from '../services/cvParsingService';

interface UploadOptions {
  uploadTarget: 'profile' | 'resume';
  uploadMode?: 'update' | 'create'; // Only used for resume target
  resumeId?: string;
  newResumeTitle?: string;
}

export const cvUploadController = {
  /**
   * Upload and parse CV file
   */
  uploadAndParseCv: async (
    userId: string,
    filePath: string,
    mimeType: string,
    options: UploadOptions
  ) => {
    try {
      // Read file content
      const fileContent = fs.readFileSync(filePath);

      // Parse CV - only PDF supported now
      let extractedData: any = {};

      if (mimeType === 'application/pdf') {
        extractedData = await cvParsingService.parsePDF(fileContent, filePath);
      } else {
        throw new Error('Only PDF files are supported');
      }

      const { uploadTarget, uploadMode, resumeId, newResumeTitle } = options;

      let result: any = {};

      // Handle Profile Target - Always update user's single profile
      if (uploadTarget === 'profile') {
        // Get or create the user's profile
        let profile = await Profile.findOne({ userId });

        if (!profile) {
          // Create new profile if doesn't exist
          profile = new Profile({
            userId,
            ...extractedData,
          });
          await profile.save();

          result = {
            type: 'profile',
            action: 'created',
            profile,
          };
        } else {
          // Update existing profile
          Object.assign(profile, extractedData);
          await profile.save();

          result = {
            type: 'profile',
            action: 'updated',
            profile,
          };
        }
      }

      // Handle Resume Target
      else if (uploadTarget === 'resume') {
        if (uploadMode === 'create') {
          // Get user's profile for linking
          const profile = await Profile.findOne({ userId });

          if (!profile) {
            throw new Error('Profile not found. Please create a profile first.');
          }

          // Create new resume with extracted data
          const resume = new Resume({
            userId,
            profileId: profile._id,
            title: newResumeTitle || 'Resume',
            templateId: 'modern-professional',
            data: extractedData,
            customizations: {},
            visibility: 'private',
          });

          await resume.save();

          result = {
            type: 'resume',
            action: 'created',
            resume,
          };
        } else if (uploadMode === 'update' && resumeId) {
          // Update existing resume
          const resume = await Resume.findOne({
            _id: resumeId,
            userId,
          });

          if (!resume) {
            throw new Error('Resume not found');
          }

          // Update resume data
          resume.data = {
            ...resume.data,
            ...extractedData,
          };
          resume.lastSyncedAt = new Date();

          await resume.save();

          result = {
            type: 'resume',
            action: 'updated',
            resume,
          };
        } else {
          throw new Error('Invalid resume operation');
        }
      }

      // Cleanup uploaded file
      fs.unlinkSync(filePath);

      return {
        success: true,
        extractedData,
        ...result,
      };
    } catch (error) {
      // Cleanup file on error
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      throw error;
    }
  },
};
