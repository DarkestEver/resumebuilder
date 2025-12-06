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
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
    website?: string;
    linkedin?: string;
    github?: string;
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
  const doc = new PDFDocument();
  const buffers: Buffer[] = [];
  
  doc.on('data', (chunk: Buffer) => buffers.push(chunk));

  // Header
  doc.fontSize(24).font('Helvetica-Bold').text(`${data.personalInfo?.firstName} ${data.personalInfo?.lastName}`, { align: 'left' });
  if (data.personalInfo?.title) {
    doc.fontSize(13).fillColor('#2563eb').text(data.personalInfo.title);
  }

  // Contact info
  if (data.contact?.email || data.contact?.phone || data.contact?.linkedin) {
    const contactInfo = [
      data.contact?.email,
      data.contact?.phone,
      data.contact?.linkedin,
    ]
      .filter(Boolean)
      .join(' • ');
    doc.fontSize(10).fillColor('#000').text(contactInfo);
  }

  doc.moveDown(0.5);
  doc.strokeColor('#2563eb').lineWidth(2).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.3);

  // Summary
  if (data.summary) {
    doc.fontSize(11).font('Helvetica-Bold').text('PROFESSIONAL SUMMARY', { underline: true });
    doc.fontSize(10).font('Helvetica').text(data.summary);
    doc.moveDown(0.3);
  }

  // Experience
  if (data.experience && data.experience.length > 0) {
    doc.fontSize(11).font('Helvetica-Bold').text('EXPERIENCE', { underline: true });
    data.experience.forEach((job) => {
      doc.fontSize(10).font('Helvetica-Bold').text(job.title || '');
      doc.fontSize(9).font('Helvetica').fillColor('#666').text(`${job.company} ${job.location ? `• ${job.location}` : ''}`);
      doc.fontSize(9).fillColor('#666').text(`${job.startDate} – ${job.endDate || 'Present'}`);
      if (job.description) {
        doc.fontSize(9).fillColor('#000').text(job.description);
      }
      doc.moveDown(0.2);
    });
    doc.moveDown(0.3);
  }

  // Education
  if (data.education && data.education.length > 0) {
    doc.fontSize(11).font('Helvetica-Bold').text('EDUCATION', { underline: true });
    data.education.forEach((edu) => {
      doc.fontSize(10).font('Helvetica-Bold').text(edu.degree || '');
      doc.fontSize(9).font('Helvetica').fillColor('#666').text(`${edu.institution} ${edu.location ? `• ${edu.location}` : ''}`);
      if (edu.gpa) {
        doc.fontSize(9).fillColor('#000').text(`GPA: ${edu.gpa}`);
      }
      doc.moveDown(0.2);
    });
    doc.moveDown(0.3);
  }

  // Skills
  if (data.skills && data.skills.length > 0) {
    doc.fontSize(11).font('Helvetica-Bold').text('SKILLS', { underline: true });
    const skillNames = data.skills.map((s) => s.name).join(' • ');
    doc.fontSize(10).font('Helvetica').text(skillNames);
    doc.moveDown(0.3);
  }

  // Languages
  if (data.languages && data.languages.length > 0) {
    doc.fontSize(11).font('Helvetica-Bold').text('LANGUAGES', { underline: true });
    data.languages.forEach((lang) => {
      doc.fontSize(10).font('Helvetica').text(`${lang.name} – ${lang.proficiency}`);
    });
    doc.moveDown(0.3);
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
