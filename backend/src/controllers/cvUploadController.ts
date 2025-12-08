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

/**
 * Transform AI extracted data to Profile model format
 * Flexible: Only adds fields that are provided by AI (no defaults for missing fields)
 */
function transformExtractedDataForProfile(extractedData: any): any {
  const transformed: any = {};

  // Only add fields that AI actually extracted
  if (extractedData.personalInfo) transformed.personalInfo = { ...extractedData.personalInfo };
  if (extractedData.contact) transformed.contact = { ...extractedData.contact };
  if (extractedData.summary) transformed.summary = extractedData.summary;

  // Experience: Rename "title" → "role", convert dates
  if (extractedData.experience && Array.isArray(extractedData.experience)) {
    transformed.experience = extractedData.experience
      .filter((exp: any) => exp.company || exp.title || exp.role)
      .map((exp: any) => {
        const entry: any = {};
        if (exp.company) entry.company = exp.company;
        if (exp.title || exp.role) entry.role = exp.title || exp.role;
        if (exp.location) entry.location = exp.location;
        if (exp.startDate) entry.startDate = new Date(exp.startDate);
        if (exp.endDate && exp.endDate !== 'Present') entry.endDate = new Date(exp.endDate);
        if (exp.current !== undefined) entry.current = exp.current;
        if (exp.description) entry.description = exp.description;
        if (exp.achievements) entry.achievements = Array.isArray(exp.achievements) ? exp.achievements : [];
        return entry;
      });
  }

  // Education: Extract field from degree, convert dates
  if (extractedData.education && Array.isArray(extractedData.education)) {
    transformed.education = extractedData.education
      .filter((edu: any) => edu.institution || edu.degree)
      .map((edu: any) => {
        const entry: any = {};
        if (edu.institution) entry.institution = edu.institution;
        if (edu.degree) entry.degree = edu.degree;
        if (edu.field) entry.field = edu.field;
        else if (edu.degree) {
          const match = edu.degree.match(/in\s+(.+?)(?:\s+from|\s*$)/i);
          entry.field = match ? match[1].trim() : 'General';
        }
        if (edu.location) entry.location = edu.location;
        if (edu.startDate) entry.startDate = new Date(edu.startDate);
        if (edu.endDate && edu.endDate !== 'Present') entry.endDate = new Date(edu.endDate);
        if (edu.current !== undefined) entry.current = edu.current;
        if (edu.gpa) entry.gpa = typeof edu.gpa === 'number' ? edu.gpa : parseFloat(edu.gpa);
        if (edu.honors) entry.honors = edu.honors;
        return entry;
      });
  }

  // Skills: Normalize proficiency
  if (extractedData.skills && Array.isArray(extractedData.skills)) {
    transformed.skills = extractedData.skills
      .filter((skill: any) => skill.name)
      .map((skill: any) => {
        const entry: any = { name: skill.name };
        if (skill.category) entry.category = skill.category;
        if (skill.level) entry.proficiency = skill.level.toLowerCase();
        else if (skill.proficiency) entry.proficiency = skill.proficiency.toLowerCase();
        if (skill.yearsOfExperience) entry.yearsOfExperience = skill.yearsOfExperience;
        return entry;
      });
  }

  // Projects: Split technologies string to array
  if (extractedData.projects && Array.isArray(extractedData.projects)) {
    transformed.projects = extractedData.projects
      .filter((proj: any) => proj.name)
      .map((proj: any) => {
        const entry: any = { name: proj.name };
        if (proj.description) entry.description = proj.description;
        if (proj.technologies) {
          entry.technologies = typeof proj.technologies === 'string'
            ? proj.technologies.split(',').map((t: string) => t.trim()).filter(Boolean)
            : proj.technologies;
        }
        if (proj.link) entry.link = proj.link;
        else if (proj.github) entry.link = proj.github;
        if (proj.startDate) entry.startDate = new Date(proj.startDate);
        if (proj.endDate) entry.endDate = new Date(proj.endDate);
        return entry;
      });
  }

  // Certifications: Convert dates
  if (extractedData.certifications && Array.isArray(extractedData.certifications)) {
    transformed.certifications = extractedData.certifications
      .filter((cert: any) => cert.name)
      .map((cert: any) => {
        const entry: any = { name: cert.name };
        if (cert.issuer) entry.issuer = cert.issuer;
        if (cert.date) entry.date = new Date(cert.date);
        if (cert.expiryDate) entry.expiryDate = new Date(cert.expiryDate);
        if (cert.credentialId) entry.credentialId = cert.credentialId;
        if (cert.verificationUrl) entry.verificationUrl = cert.verificationUrl;
        return entry;
      });
  }

  // Languages: Rename "name" → "language", map proficiency
  if (extractedData.languages && Array.isArray(extractedData.languages)) {
    const profMap: any = { native: 'native', fluent: 'fluent', professional: 'professional', basic: 'limited', elementary: 'elementary' };
    transformed.languages = extractedData.languages
      .filter((lang: any) => lang.name || lang.language)
      .map((lang: any) => ({
        language: lang.name || lang.language,
        proficiency: lang.proficiency ? (profMap[lang.proficiency.toLowerCase()] || 'professional') : undefined
      }));
  }

  // Achievements: Convert dates
  if (extractedData.achievements && Array.isArray(extractedData.achievements)) {
    transformed.achievements = extractedData.achievements
      .filter((ach: any) => ach.title)
      .map((ach: any) => {
        const entry: any = { title: ach.title };
        if (ach.description) entry.description = ach.description;
        if (ach.date) entry.date = new Date(ach.date);
        return entry;
      });
  }

  // Optional fields
  if (extractedData.courses) transformed.courses = extractedData.courses;
  if (extractedData.interests) transformed.interests = extractedData.interests;
  if (extractedData.publications) transformed.publications = extractedData.publications;
  
  // Consolidate links
  if (extractedData.contact || extractedData.links) {
    transformed.links = {
      github: extractedData.contact?.github || extractedData.links?.github,
      linkedin: extractedData.contact?.linkedin || extractedData.links?.linkedin,
      website: extractedData.contact?.website || extractedData.links?.website
    };
  }

  return transformed;
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
        // Transform AI data to Profile model format
        const profileData = transformExtractedDataForProfile(extractedData);

        // Get or create the user's profile
        let profile = await Profile.findOne({ userId });

        if (!profile) {
          // Create new profile if doesn't exist
          profile = new Profile({
            userId,
            ...profileData,
          });
          await profile.save();

          result = {
            type: 'profile',
            action: 'created',
            profile,
          };
        } else {
          // Update existing profile
          Object.assign(profile, profileData);
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
