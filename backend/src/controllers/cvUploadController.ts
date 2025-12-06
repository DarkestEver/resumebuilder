import fs from 'fs';
import { Profile } from '../models/Profile.model';
import { ProfileCollection } from '../models/ProfileCollection.model';
import { cvParsingService } from '../services/cvParsingService';

export const cvUploadController = {
  /**
   * Upload and parse CV file
   */
  uploadAndParseCv: async (
    userId: string,
    filePath: string,
    mimeType: string,
    profileId?: string,
    createNew?: boolean,
    profileName?: string
  ) => {
    try {
      // Read file content
      const fileContent = fs.readFileSync(filePath);

      // Parse CV based on file type
      let extractedData: any = {};

      if (mimeType === 'application/pdf') {
        extractedData = await cvParsingService.parsePDF(fileContent, filePath);
      } else if (
        mimeType === 'application/msword' ||
        mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        extractedData = await cvParsingService.parseDOC(fileContent);
      } else if (mimeType === 'text/plain') {
        extractedData = await cvParsingService.parseTXT(fileContent.toString());
      } else if (mimeType.startsWith('image/')) {
        extractedData = await cvParsingService.parseImage(fileContent);
      }

      // Determine which profile to update/create
      let profileCollection;

      if (createNew) {
        // Create new profile from CV data
        const existingCount = await ProfileCollection.countDocuments({
          userId,
          deletedAt: null,
        });

        profileCollection = new ProfileCollection({
          userId,
          profileName:
            profileName || `Profile ${existingCount + 1}`,
          isDefault: existingCount === 0,
          ...extractedData,
        });
      } else if (profileId) {
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
      } else {
        // Update default profile or create first profile
        profileCollection = await ProfileCollection.findOne({
          userId,
          isDefault: true,
          deletedAt: null,
        });

        if (!profileCollection) {
          // Create first profile
          profileCollection = new ProfileCollection({
            userId,
            profileName: 'Default Profile',
            isDefault: true,
            ...extractedData,
          });
        } else {
          Object.assign(profileCollection, extractedData);
        }
      }

      await profileCollection.save();

      // Also update legacy Profile model for backward compatibility
      let legacyProfile = await Profile.findOne({ userId });
      if (!legacyProfile) {
        legacyProfile = new Profile({
          userId,
          ...extractedData,
        });
      } else {
        Object.assign(legacyProfile, extractedData);
      }
      await legacyProfile.save();

      // Cleanup uploaded file
      fs.unlinkSync(filePath);

      return {
        success: true,
        extractedData,
        profile: profileCollection,
        legacyProfile,
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
