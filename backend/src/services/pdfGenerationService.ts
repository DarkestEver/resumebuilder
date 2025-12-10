import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

export interface ResumeData {
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    title?: string;
    photo?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
    alternatePhone?: string;
    address?: {
      street?: string;
      apartment?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
    website?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  signature?: {
    name?: string;
    date?: string;
    place?: string;
    image?: string;
  };
  summary?: string;
  experience?: Array<{
    title?: string;
    company?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    description?: string;
  }>;
  education?: Array<{
    degree?: string;
    institution?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    gpa?: string;
  }>;
  skills?: Array<{
    name?: string;
    category?: string;
    level?: string;
  }>;
  projects?: Array<{
    name?: string;
    description?: string;
    technologies?: string[];
    link?: string;
  }>;
  certifications?: Array<{
    name?: string;
    issuer?: string;
    date?: string;
    link?: string;
  }>;
  achievements?: string[];
  languages?: Array<{
    name?: string;
    proficiency?: string;
  }>;
}

/**
 * Generate Modern Resume PDF
 */
export function generateModernPDF(data: ResumeData): Readable {
  const doc = new PDFDocument({
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    size: 'LETTER'
  });
  const buffers: Buffer[] = [];
  
  doc.on('data', (chunk: Buffer) => buffers.push(chunk));

  // Header - Full name
  const firstName = data.personalInfo?.firstName || '';
  const lastName = data.personalInfo?.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim() || 'Untitled Resume';
  
  // Name with more spacing
  doc.fontSize(28).font('Helvetica-Bold').fillColor('#1F2937').text(fullName, {
    align: 'left'
  });
  
  doc.moveDown(0.3);
  
  // Title
  if (data.personalInfo?.title) {
    doc.fontSize(14).font('Helvetica').fillColor('#4B5563').text(data.personalInfo.title);
    doc.moveDown(0.3);
  }

  // Contact info with better formatting
  if (data.contact?.email || data.contact?.phone || data.contact?.linkedin) {
    doc.fontSize(9).fillColor('#6B7280');
    const contactParts = [];
    
    if (data.contact?.email) contactParts.push(data.contact.email);
    if (data.contact?.phone) contactParts.push(data.contact.phone);
    if (data.contact?.linkedin) contactParts.push(data.contact.linkedin);
    
    doc.text(contactParts.join('  •  '));
  }

  // Separator line
  doc.moveDown(0.8);
  doc.strokeColor('#1F2937').lineWidth(2.5).moveTo(50, doc.y).lineTo((doc as any).page.width - 50, doc.y).stroke();
  doc.moveDown(0.8);

  // Summary
  if (data.summary) {
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#1F2937').text('PROFESSIONAL SUMMARY');
    doc.moveDown(0.4);
    doc.fontSize(10).font('Helvetica').fillColor('#374151').text(data.summary, {
      align: 'left',
      lineGap: 2
    });
    doc.moveDown(1);
  }

  // Experience
  if (data.experience && data.experience.length > 0) {
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#1F2937').text('PROFESSIONAL EXPERIENCE');
    doc.moveDown(0.4);
    
    data.experience.forEach((job, index) => {
      // Job title
      doc.fontSize(11).font('Helvetica-Bold').fillColor('#1F2937').text(job.title || '');
      
      // Company and location
      doc.fontSize(10).font('Helvetica').fillColor('#6B7280').text(
        `${job.company}${job.location ? ` • ${job.location}` : ''}`
      );
      
      // Dates
      doc.fontSize(9).fillColor('#9CA3AF').text(
        `${job.startDate || ''} – ${job.endDate || 'Present'}`
      );
      
      // Description
      if (job.description) {
        doc.moveDown(0.2);
        doc.fontSize(10).fillColor('#374151').text(job.description, {
          align: 'left',
          lineGap: 1
        });
      }
      
      if (index < (data.experience?.length || 0) - 1) {
        doc.moveDown(0.6);
      }
    });
    doc.moveDown(1);
  }

  // Education
  if (data.education && data.education.length > 0) {
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#1F2937').text('EDUCATION');
    doc.moveDown(0.4);
    
    data.education.forEach((edu, index) => {
      // Degree
      doc.fontSize(11).font('Helvetica-Bold').fillColor('#1F2937').text(edu.degree || '');
      
      // Institution
      doc.fontSize(10).font('Helvetica').fillColor('#6B7280').text(
        `${edu.institution}${edu.location ? ` • ${edu.location}` : ''}`
      );
      
      // Dates and GPA
      const eduDetails = [];
      if (edu.startDate && edu.endDate) {
        eduDetails.push(`${edu.startDate} – ${edu.endDate}`);
      }
      if (edu.gpa) {
        eduDetails.push(`GPA: ${edu.gpa}`);
      }
      if (eduDetails.length > 0) {
        doc.fontSize(9).fillColor('#9CA3AF').text(eduDetails.join(' • '));
      }
      
      if (index < (data.education?.length || 0) - 1) {
        doc.moveDown(0.6);
      }
    });
    doc.moveDown(1);
  }

  // Skills
  if (data.skills && data.skills.length > 0) {
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#1F2937').text('SKILLS');
    doc.moveDown(0.4);
    const skillNames = data.skills.map((s) => s.name).filter(Boolean).join('  •  ');
    doc.fontSize(10).font('Helvetica').fillColor('#374151').text(skillNames, {
      align: 'left',
      lineGap: 2
    });
    doc.moveDown(1);
  }

  // Projects
  if (data.projects && data.projects.length > 0) {
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#1F2937').text('PROJECTS');
    doc.moveDown(0.4);
    
    data.projects.forEach((project, index) => {
      doc.fontSize(11).font('Helvetica-Bold').fillColor('#1F2937').text(project.name || '');
      
      if (project.description) {
        doc.fontSize(10).font('Helvetica').fillColor('#374151').text(project.description);
      }
      
      if (project.technologies && project.technologies.length > 0) {
        doc.fontSize(9).fillColor('#6B7280').text(
          `Technologies: ${project.technologies.join(', ')}`
        );
      }
      
      if (index < (data.projects?.length || 0) - 1) {
        doc.moveDown(0.6);
      }
    });
    doc.moveDown(1);
  }

  // Certifications
  if (data.certifications && data.certifications.length > 0) {
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#1F2937').text('CERTIFICATIONS');
    doc.moveDown(0.4);
    
    data.certifications.forEach((cert, index) => {
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#1F2937').text(cert.name || '');
      
      const certDetails = [];
      if (cert.issuer) certDetails.push(cert.issuer);
      if (cert.date) certDetails.push(cert.date);
      
      if (certDetails.length > 0) {
        doc.fontSize(9).fillColor('#6B7280').text(certDetails.join(' • '));
      }
      
      if (index < (data.certifications?.length || 0) - 1) {
        doc.moveDown(0.4);
      }
    });
    doc.moveDown(1);
  }

  // Languages
  if (data.languages && data.languages.length > 0) {
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#1F2937').text('LANGUAGES');
    doc.moveDown(0.4);
    
    const languageText = data.languages
      .map((lang) => `${lang.name} (${lang.proficiency})`)
      .join('  •  ');
    
    doc.fontSize(10).font('Helvetica').fillColor('#374151').text(languageText);
  }

  doc.end();

  return Readable.from(buffers);
}

/**
 * Generate Classic Resume PDF
 */
export function generateClassicPDF(data: ResumeData): Readable {
  const doc = new PDFDocument({ margin: 50 });
  const buffers: Buffer[] = [];
  
  doc.on('data', (chunk: Buffer) => buffers.push(chunk));

  // Header
  doc.fontSize(22).font('Helvetica-Bold').text(`${data.personalInfo?.firstName} ${data.personalInfo?.lastName}`);
  if (data.personalInfo?.title) {
    doc.fontSize(12).fillColor('#666').text(data.personalInfo.title);
  }

  const contactInfo = [data.contact?.email, data.contact?.phone, data.contact?.linkedin]
    .filter(Boolean)
    .join(' | ');
  doc.fontSize(9).fillColor('#000').text(contactInfo);
  doc.moveDown(0.5);

  // Summary
  if (data.summary) {
    doc.fontSize(10).font('Helvetica-Bold').text('PROFESSIONAL SUMMARY');
    doc.fontSize(9).font('Helvetica').text(data.summary);
    doc.moveDown(0.3);
  }

  // Experience
  if (data.experience && data.experience.length > 0) {
    doc.fontSize(10).font('Helvetica-Bold').text('EXPERIENCE');
    data.experience.forEach((job) => {
      doc.fontSize(9).font('Helvetica-Bold').text(job.title || '');
      doc.fontSize(8).fillColor('#666').text(`${job.company} – ${job.startDate}`);
      if (job.description) {
        doc.fontSize(8).fillColor('#000').text(job.description);
      }
      doc.moveDown(0.15);
    });
    doc.moveDown(0.3);
  }

  // Education
  if (data.education && data.education.length > 0) {
    doc.fontSize(10).font('Helvetica-Bold').text('EDUCATION');
    data.education.forEach((edu) => {
      doc.fontSize(9).font('Helvetica-Bold').text(edu.degree || '');
      doc.fontSize(8).fillColor('#666').text(edu.institution || '');
      doc.moveDown(0.15);
    });
    doc.moveDown(0.3);
  }

  // Skills
  if (data.skills && data.skills.length > 0) {
    doc.fontSize(10).font('Helvetica-Bold').text('SKILLS');
    const skillNames = data.skills.map((s) => s.name).join(', ');
    doc.fontSize(8).font('Helvetica').text(skillNames);
  }

  doc.end();

  return Readable.from(buffers);
}
