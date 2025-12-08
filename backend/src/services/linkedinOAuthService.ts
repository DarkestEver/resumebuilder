/**
 * LinkedIn OAuth Service
 * Handles LinkedIn OAuth flow and profile import
 */

import axios from 'axios';
import { User } from '../models/User.model';
import { Profile } from '../models/Profile.model';
import { logger } from '../utils/logger';

interface LinkedInProfile {
  id: string;
  firstName: {
    localized: {
      [key: string]: string;
    };
  };
  lastName: {
    localized: {
      [key: string]: string;
    };
  };
  profilePicture?: {
    displayImage: string;
  };
  vanityName?: string;
}

interface LinkedInEmailResponse {
  elements: Array<{
    'handle~': {
      emailAddress: string;
    };
  }>;
}

export class LinkedInOAuthService {
  private static clientId = process.env.LINKEDIN_CLIENT_ID || '';
  private static clientSecret = process.env.LINKEDIN_CLIENT_SECRET || '';
  private static redirectUri = process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:3000/auth/linkedin/callback';

  /**
   * Get LinkedIn OAuth authorization URL
   */
  static getAuthorizationUrl(state?: string): string {
    const scope = 'r_liteprofile r_emailaddress w_member_social';
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope,
      state: state || '',
    });

    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  static async getAccessToken(code: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://www.linkedin.com/oauth/v2/accessToken',
        null,
        {
          params: {
            grant_type: 'authorization_code',
            code,
            client_id: this.clientId,
            client_secret: this.clientSecret,
            redirect_uri: this.redirectUri,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.data.access_token;
    } catch (error) {
      logger.error('LinkedIn token exchange error:', error);
      throw new Error('Failed to exchange LinkedIn authorization code');
    }
  }

  /**
   * Get LinkedIn profile data
   */
  static async getProfile(accessToken: string): Promise<LinkedInProfile> {
    try {
      const response = await axios.get('https://api.linkedin.com/v2/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      logger.error('LinkedIn profile fetch error:', error);
      throw new Error('Failed to fetch LinkedIn profile');
    }
  }

  /**
   * Get LinkedIn email address
   */
  static async getEmail(accessToken: string): Promise<string> {
    try {
      const response = await axios.get<LinkedInEmailResponse>(
        'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const email = response.data.elements[0]?.['handle~']?.emailAddress;
      if (!email) {
        throw new Error('No email found in LinkedIn profile');
      }

      return email;
    } catch (error) {
      logger.error('LinkedIn email fetch error:', error);
      throw new Error('Failed to fetch LinkedIn email');
    }
  }

  /**
   * Import full LinkedIn profile data (requires additional API calls)
   * Note: Basic profile import is free, but detailed work history requires LinkedIn Partner Program
   */
  static async importProfileData(accessToken: string, userId: string) {
    try {
      // Get basic profile
      const linkedInProfile = await this.getProfile(accessToken);
      const email = await this.getEmail(accessToken);

      // Extract first and last name from localized fields
      const firstNameKey = Object.keys(linkedInProfile.firstName.localized)[0];
      const lastNameKey = Object.keys(linkedInProfile.lastName.localized)[0];
      const firstName = linkedInProfile.firstName.localized[firstNameKey];
      const lastName = linkedInProfile.lastName.localized[lastNameKey];

      // Find or create profile
      let profile = await Profile.findOne({ userId });
      
      if (!profile) {
        profile = new Profile({
          userId,
          personalInfo: {
            firstName,
            lastName,
          },
          contact: {
            email,
          },
          skills: [],
          experience: [],
          education: [],
        });
      } else {
        // Update existing profile
        if (!profile.personalInfo) {
          profile.personalInfo = {} as any;
        }
        profile.personalInfo.firstName = firstName;
        profile.personalInfo.lastName = lastName;
        
        if (!profile.contact) {
          profile.contact = {} as any;
        }
        profile.contact.email = email;
      }

      // Add LinkedIn profile URL to contact if vanity name exists
      if (linkedInProfile.vanityName) {
        (profile.contact as any).linkedin = `https://linkedin.com/in/${linkedInProfile.vanityName}`;
      }

      await profile.save();

      logger.info(`LinkedIn profile imported for user: ${userId}`);

      return {
        success: true,
        profile,
        message: 'Basic profile imported from LinkedIn. Add more details manually for a complete resume.',
      };
    } catch (error) {
      logger.error('LinkedIn profile import error:', error);
      throw error;
    }
  }

  /**
   * Handle LinkedIn OAuth callback
   * Creates or updates user, imports basic profile data
   */
  static async handleOAuthCallback(code: string) {
    try {
      // Exchange code for access token
      const accessToken = await this.getAccessToken(code);

      // Get LinkedIn profile and email
      const linkedInProfile = await this.getProfile(accessToken);
      const email = await this.getEmail(accessToken);

      // Extract name
      const firstNameKey = Object.keys(linkedInProfile.firstName.localized)[0];
      const lastNameKey = Object.keys(linkedInProfile.lastName.localized)[0];
      const firstName = linkedInProfile.firstName.localized[firstNameKey];
      const lastName = linkedInProfile.lastName.localized[lastNameKey];
      const fullName = `${firstName} ${lastName}`;

      // Find or create user
      let user = await User.findOne({ email });

      if (user) {
        // Update existing user with LinkedIn ID
        user.linkedinId = linkedInProfile.id;
        user.name = user.name || fullName;
        user.emailVerified = true; // LinkedIn OAuth confirms email
        user.lastLoginAt = new Date();
        await user.save();
      } else {
        // Create new user
        user = await User.create({
          email,
          name: fullName,
          linkedinId: linkedInProfile.id,
          emailVerified: true,
          role: 'user',
          subscription: {
            plan: 'free',
            status: 'active',
          },
          aiCredits: 10, // Free tier credits
          isActive: true,
          lastLoginAt: new Date(),
        });

        logger.info(`New user created via LinkedIn OAuth: ${user._id}`);
      }

      // Import profile data
      await this.importProfileData(accessToken, user._id.toString());

      return {
        user,
        accessToken,
        isNewUser: !user.linkedinId,
      };
    } catch (error) {
      logger.error('LinkedIn OAuth callback error:', error);
      throw error;
    }
  }
}
