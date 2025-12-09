import axios from 'axios';
import { logger } from '../utils/logger';

/**
 * LinkedIn Profile Sync Service
 * Handles OAuth and profile data import from LinkedIn
 */

interface LinkedInProfile {
  id: string;
  firstName: { localized: { [key: string]: string } };
  lastName: { localized: { [key: string]: string } };
  headline?: string;
  profilePicture?: {
    'displayImage~': {
      elements: Array<{
        identifiers: Array<{ identifier: string }>;
      }>;
    };
  };
  vanityName?: string;
}

interface LinkedInEmail {
  elements: Array<{
    'handle~': {
      emailAddress: string;
    };
  }>;
}

interface LinkedInPosition {
  elements: Array<{
    title: { localized: { [key: string]: string } };
    companyName: { localized: { [key: string]: string } };
    timePeriod: {
      startDate: { month: number; year: number };
      endDate?: { month: number; year: number };
    };
    description?: { localized: { [key: string]: string } };
    company?: string;
  }>;
}

interface LinkedInEducation {
  elements: Array<{
    schoolName: { localized: { [key: string]: string } };
    degreeName?: { localized: { [key: string]: string } };
    fieldOfStudy?: { localized: { [key: string]: string } };
    timePeriod: {
      startDate: { month: number; year: number };
      endDate?: { month: number; year: number };
    };
  }>;
}

interface LinkedInSkills {
  elements: Array<{
    name: { localized: { [key: string]: string } };
  }>;
}

export class LinkedInService {
  private static readonly LINKEDIN_API_BASE = 'https://api.linkedin.com/v2';

  /**
   * Get LinkedIn profile data using access token
   */
  static async getProfile(accessToken: string) {
    try {
      // Fetch basic profile
      const profileResponse = await axios.get<LinkedInProfile>(`${this.LINKEDIN_API_BASE}/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          projection: '(id,firstName,lastName,headline,profilePicture(displayImage~:playableStreams),vanityName)',
        },
      });

      const profile = profileResponse.data;

      // Fetch email
      const emailResponse = await axios.get<LinkedInEmail>(`${this.LINKEDIN_API_BASE}/emailAddress?q=members&projection=(elements*(handle~))`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const email = emailResponse.data.elements[0]?.['handle~']?.emailAddress;

      // Fetch positions (work experience)
      let positions: LinkedInPosition['elements'] = [];
      try {
        const positionsResponse = await axios.get<LinkedInPosition>(`${this.LINKEDIN_API_BASE}/positions`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        positions = positionsResponse.data.elements || [];
      } catch (error) {
        logger.warn('Failed to fetch LinkedIn positions:', error);
      }

      // Fetch education
      let education: LinkedInEducation['elements'] = [];
      try {
        const educationResponse = await axios.get<LinkedInEducation>(`${this.LINKEDIN_API_BASE}/educations`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        education = educationResponse.data.elements || [];
      } catch (error) {
        logger.warn('Failed to fetch LinkedIn education:', error);
      }

      // Fetch skills
      let skills: LinkedInSkills['elements'] = [];
      try {
        const skillsResponse = await axios.get<LinkedInSkills>(`${this.LINKEDIN_API_BASE}/skills`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        skills = skillsResponse.data.elements || [];
      } catch (error) {
        logger.warn('Failed to fetch LinkedIn skills:', error);
      }

      return {
        profile,
        email,
        positions,
        education,
        skills,
      };
    } catch (error: any) {
      logger.error('LinkedIn profile fetch error:', error.response?.data || error.message);
      throw new Error('Failed to fetch LinkedIn profile data');
    }
  }

  /**
   * Transform LinkedIn data to our profile schema
   */
  static transformToProfile(linkedInData: {
    profile: LinkedInProfile;
    email: string;
    positions: LinkedInPosition['elements'];
    education: LinkedInEducation['elements'];
    skills: LinkedInSkills['elements'];
  }) {
    const { profile, email, positions, education, skills } = linkedInData;

    // Get localized strings (prefer en_US)
    const getLocalizedString = (localized: { [key: string]: string }) => {
      return localized['en_US'] || Object.values(localized)[0] || '';
    };

    // Get profile photo
    let photo = '';
    if (profile.profilePicture && profile.profilePicture['displayImage~']?.elements?.length > 0) {
      const images = profile.profilePicture['displayImage~'].elements;
      photo = images[images.length - 1]?.identifiers?.[0]?.identifier || '';
    }

    // Transform experience
    const experience = positions.map((pos) => ({
      role: getLocalizedString(pos.title.localized),
      company: getLocalizedString(pos.companyName.localized),
      location: '',
      startDate: new Date(`${pos.timePeriod.startDate.year}-${String(pos.timePeriod.startDate.month).padStart(2, '0')}-01`),
      endDate: pos.timePeriod.endDate
        ? new Date(`${pos.timePeriod.endDate.year}-${String(pos.timePeriod.endDate.month).padStart(2, '0')}-01`)
        : undefined,
      current: !pos.timePeriod.endDate,
      description: pos.description ? getLocalizedString(pos.description.localized) : '',
      achievements: [],
    }));

    // Transform education
    const transformedEducation = education.map((edu) => ({
      institution: getLocalizedString(edu.schoolName.localized),
      degree: edu.degreeName ? getLocalizedString(edu.degreeName.localized) : '',
      field: edu.fieldOfStudy ? getLocalizedString(edu.fieldOfStudy.localized) : '',
      location: '',
      startDate: new Date(`${edu.timePeriod.startDate.year}-01-01`),
      endDate: edu.timePeriod.endDate
        ? new Date(`${edu.timePeriod.endDate.year}-12-31`)
        : undefined,
      current: !edu.timePeriod.endDate,
      gpa: undefined,
      honors: '',
    }));

    // Transform skills
    const transformedSkills = skills.map((skill) => ({
      name: getLocalizedString(skill.name.localized),
      proficiency: 'intermediate' as const,
      category: 'technical',
    }));

    return {
      personalInfo: {
        firstName: getLocalizedString(profile.firstName.localized),
        lastName: getLocalizedString(profile.lastName.localized),
        title: profile.headline || '',
        photo,
      },
      contact: {
        email,
        linkedin: profile.vanityName ? `https://www.linkedin.com/in/${profile.vanityName}` : '',
      },
      experience,
      education: transformedEducation,
      skills: transformedSkills,
      summary: profile.headline || '',
    };
  }

  /**
   * Exchange authorization code for access token
   */
  static async exchangeCodeForToken(code: string, redirectUri: string) {
    try {
      const response = await axios.post(
        'https://www.linkedin.com/oauth/v2/accessToken',
        new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          client_id: process.env.LINKEDIN_CLIENT_ID || '',
          client_secret: process.env.LINKEDIN_CLIENT_SECRET || '',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.data.access_token;
    } catch (error: any) {
      logger.error('LinkedIn token exchange error:', error.response?.data || error.message);
      throw new Error('Failed to exchange LinkedIn authorization code');
    }
  }
}
