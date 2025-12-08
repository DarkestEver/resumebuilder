import fs from 'fs';
import { Profile } from '../models/Profile.model';
import { ProfileCollection } from '../models/ProfileCollection.model';
import { Resume } from '../models/Resume.model';
import { cvParsingService } from '../services/cvParsingService';

interface UploadOptions {
  uploadTarget: 'profile' | 'resume';
  uploadMode: 'update' | 'create';
  profileId?: string;
  resumeId?: string;
  newProfileName?: string;
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

      const { uploadTarget, uploadMode, profileId, resumeId, newProfileName, newResumeTitle } = options;

      let result: any = {};

      // Handle Profile Target
      if (uploadTarget === 'profile') {
        let profileCollection;

        if (uploadMode === 'create') {
          // Create new profile from CV data
          const existingCount = await ProfileCollection.countDocuments({
            userId,
            deletedAt: null,
          });

          profileCollection = new ProfileCollection({
            userId,
            profileName: newProfileName || `Profile ${existingCount + 1}`,
            isDefault: existingCount === 0,
            ...extractedData,
          });

          await profileCollection.save();

          result = {
            type: 'profile',
            action: 'created',
            profile: profileCollection,
          };
        } else if (uploadMode === 'update' && profileId) {
          // Update existing profile
          profileCollection = await ProfileCollection.findOne({
            _id: profileId,
            userId,
            deletedAt: null,
          });

          if (!profileCollection) {
            throw new Error('Profile not found');
          }

          Object.assign(profileCollection, extractedData);
          await profileCollection.save();

          result = {
            type: 'profile',
            action: 'updated',
            profile: profileCollection,
          };
        } else {
          throw new Error('Invalid profile operation');
        }
      }

      // Handle Resume Target
      else if (uploadTarget === 'resume') {
        if (uploadMode === 'create') {
          // Get profile for base data
          const profile = await ProfileCollection.findOne({
            _id: profileId,
            userId,
            deletedAt: null,
          });

          if (!profile) {
            throw new Error('Profile not found for new resume');
          }

          // Create new resume with extracted data
          const resume = new Resume({
            userId,
            profileId,
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
