import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { Resume } from '../models/Resume.model';
import { Profile } from '../models/Profile.model';
import { generateModernPDF, generateClassicPDF, ResumeData } from '../services/pdfGenerationService';

const router = Router();

/**
 * GET /api/resumes/:id/export-pdf
 * Export resume as PDF
 */
router.get('/:id/export-pdf', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Get resume
    const resume = await Resume.findById(id);
    if (!resume) {
      res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
      return;
    }

    // Verify ownership
    if (resume.userId.toString() !== req.user?.userId) {
      res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    // Get profile data
    const profile = await Profile.findById(resume.profileId);
    if (!profile) {
      res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
      return;
    }

    // Prepare resume data with proper type conversion
    const resumeData: ResumeData = {
      personalInfo: profile.personalInfo,
      contact: {
        email: profile.contact?.email,
        phone: profile.contact?.phone,
        address: profile.contact?.address ? {
          city: profile.contact.city,
          country: profile.contact.country,
          zipCode: profile.contact.postalCode,
        } : undefined,
        website: profile.contact?.website,
      },
      summary: profile.summary,
      experience: profile.experience?.map(exp => ({
        title: exp.role,
        company: exp.company,
        location: exp.location,
        startDate: exp.startDate?.toISOString().split('T')[0],
        endDate: exp.endDate?.toISOString().split('T')[0],
        current: exp.current,
        description: exp.description,
      })),
      education: profile.education?.map(edu => ({
        degree: edu.degree,
        institution: edu.institution,
        location: edu.location,
        startDate: edu.startDate?.toISOString().split('T')[0],
        endDate: edu.endDate?.toISOString().split('T')[0],
        gpa: edu.gpa?.toString(),
      })),
      skills: profile.skills,
      projects: profile.projects,
      certifications: profile.certifications?.map(cert => ({
        name: cert.name,
        issuer: cert.issuer,
        date: cert.date?.toISOString().split('T')[0],
        link: cert.verificationUrl,
      })),
      languages: profile.languages,
    };

    // Apply customizations (hide sections, etc.)
    if (resume.customizations?.sections?.visibility) {
      const visibility = resume.customizations.sections.visibility;
      if (visibility.summary === false) resumeData.summary = undefined;
      if (visibility.experience === false) resumeData.experience = undefined;
      if (visibility.education === false) resumeData.education = undefined;
      if (visibility.skills === false) resumeData.skills = undefined;
      if (visibility.projects === false) resumeData.projects = undefined;
      if (visibility.languages === false) resumeData.languages = undefined;
    }

    // Select PDF generator based on template
    let pdfStream;
    const templateId = resume.templateId || 'modern';
    switch (templateId) {
      case 'classic':
        pdfStream = generateClassicPDF(resumeData);
        break;
      case 'modern':
      default:
        pdfStream = generateModernPDF(resumeData);
    }

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="resume.pdf"`);

    // Pipe PDF stream to response
    pdfStream.pipe(res);

    // Handle errors
    pdfStream.on('error', (error) => {
      console.error('PDF generation error:', error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Failed to generate PDF',
        });
      }
    });

    // Update download count when done
    res.on('finish', async () => {
      resume.downloadCount = (resume.downloadCount || 0) + 1;
      await resume.save();
    });
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to export PDF',
    });
  }
});

export default router;
