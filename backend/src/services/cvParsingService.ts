import { parseDocx } from 'docx-parser';
import Tesseract from 'tesseract.js';
import PDFParser from 'pdf2json';
import axios from 'axios';
import { config } from '../config';
import { logger } from '../utils/logger';


/**
 * CV Parsing Service
 * Extracts information from various file formats using AI and OCR
 */

interface ExtractedData {
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
    technologies?: string;
    link?: string;
    github?: string;
  }>;
  certifications?: Array<{
    name?: string;
    issuer?: string;
    date?: string;
    expiryDate?: string;
  }>;
  languages?: Array<{
    name?: string;
    proficiency?: string;
  }>;
  achievements?: Array<{
    title?: string;
    description?: string;
    date?: string;
  }>;
}

export const cvParsingService = {
  /**
   * Parse PDF file with multiple fallback strategies
   */
  parsePDF: async (fileBuffer: Buffer, filePath?: string): Promise<ExtractedData> => {
    let text = '';
    let parseMethod = '';

    // Strategy 1: Try pdf-parse first (works for most PDFs)
    try {
      const pdfParse = require('pdf-parse');
      const data = await pdfParse(fileBuffer);
      text = data.text;
      parseMethod = 'pdf-parse';
      console.log('PDF parsed successfully with pdf-parse');
    } catch (pdfParseError: any) {
      console.warn('pdf-parse failed:', pdfParseError.message);

      // Strategy 2: Try pdf2json (works for PDFs with XRef issues)
      try {
        const pdfParser = new PDFParser(null, true);
        
        await new Promise<void>((resolve, reject) => {
          pdfParser.on('pdfParser_dataError', (errData: any) => {
            reject(new Error(errData.parserError));
          });
          
          pdfParser.on('pdfParser_dataReady', () => {
            try {
              // Extract text from parsed data
              const rawTextArray: string[] = [];
              if (pdfParser.getRawTextContent) {
                const rawText = pdfParser.getRawTextContent();
                text = rawText;
              } else {
                // Fallback: extract from Pages
                const pages = (pdfParser as any).Pages || [];
                pages.forEach((page: any) => {
                  if (page.Texts) {
                    page.Texts.forEach((textItem: any) => {
                      if (textItem.R) {
                        textItem.R.forEach((run: any) => {
                          if (run.T) {
                            rawTextArray.push(decodeURIComponent(run.T));
                          }
                        });
                      }
                    });
                  }
                });
                text = rawTextArray.join(' ');
              }
              parseMethod = 'pdf2json';
              console.log('PDF parsed successfully with pdf2json');
              resolve();
            } catch (extractError) {
              reject(extractError);
            }
          });

          pdfParser.parseBuffer(fileBuffer);
        });
      } catch (pdf2jsonError: any) {
        console.warn('pdf2json failed:', pdf2jsonError.message);

        // Strategy 3: Try OCR as last resort (for scanned PDFs or images)
        if (filePath && (filePath.endsWith('.jpg') || filePath.endsWith('.png') || filePath.endsWith('.jpeg'))) {
          try {
            console.log('Attempting OCR...');
            const { data: { text: ocrText } } = await Tesseract.recognize(fileBuffer, 'eng', {
              logger: (m: any) => console.log(m),
            });
            text = ocrText;
            parseMethod = 'tesseract-ocr';
            console.log('PDF parsed successfully with OCR');
          } catch (ocrError: any) {
            console.error('OCR failed:', ocrError.message);
            throw new Error(`All PDF parsing methods failed. Last error: ${ocrError.message}`);
          }
        } else {
          throw new Error(`Failed to parse PDF. pdf-parse error: ${pdfParseError.message}, pdf2json error: ${pdf2jsonError.message}`);
        }
      }
    }

    // Extract structured data from text
    if (!text || text.trim().length === 0) {
      throw new Error('No text content extracted from PDF');
    }

    console.log(`Extracted ${text.length} characters using ${parseMethod}`);
    return await cvParsingService.extractDataFromText(text);
  },

  /**
   * Parse DOCX file
   */
  parseDOC: async (fileBuffer: Buffer): Promise<ExtractedData> => {
    try {
      const text = await parseDocx(fileBuffer);
      return await cvParsingService.extractDataFromText(text);
    } catch (error) {
      console.error('DOCX parsing error:', error);
      throw new Error('Failed to parse DOCX');
    }
  },

  /**
   * Parse TXT file
   */
  parseTXT: async (text: string): Promise<ExtractedData> => {
    return await cvParsingService.extractDataFromText(text);
  },

  /**
   * Parse image using OCR
   */
  parseImage: async (imageBuffer: Buffer): Promise<ExtractedData> => {
    try {
      const base64Image = imageBuffer.toString('base64');
      const { data: result } = await Tesseract.recognize(
        `data:image/png;base64,${base64Image}`,
        'eng'
      );
      const text = result.text;
      return await cvParsingService.extractDataFromText(text);
    } catch (error) {
      console.error('Image OCR error:', error);
      throw new Error('Failed to parse image');
    }
  },

  /**
   * Extract structured data from raw text using AI
   */
  extractDataFromText: async (text: string): Promise<ExtractedData> => {
    try {
      // Try AI extraction first (much more accurate)
      return await cvParsingService.extractWithAI(text);
    } catch (aiError) {
      console.error('AI extraction failed, falling back to regex:', aiError);
      // Fallback to basic regex extraction
      return cvParsingService.extractWithRegex(text);
    }
  },

  /**
   * Extract data using AI (OpenAI/Claude/Gemini)
   */
  extractWithAI: async (text: string): Promise<ExtractedData> => {
    const prompt = `Extract the following information from this resume/CV text and return it as JSON. Be precise and extract only information that is explicitly present.

Resume Text:
"""
${text.slice(0, 8000)} 
"""

Return a JSON object with this exact structure (omit fields if not found):
{
  "personalInfo": {
    "firstName": "string",
    "lastName": "string", 
    "title": "string (job title/headline)"
  },
  "contact": {
    "email": "string",
    "phone": "string",
    "address": {
      "street": "string",
      "city": "string",
      "state": "string",
      "zipCode": "string",
      "country": "string"
    },
    "website": "string",
    "linkedin": "string (full URL)",
    "github": "string (full URL)"
  },
  "summary": "string (professional summary/objective, 2-3 sentences)",
  "experience": [
    {
      "title": "string",
      "company": "string",
      "location": "string",
      "startDate": "YYYY-MM format",
      "endDate": "YYYY-MM or 'Present'",
      "current": boolean,
      "description": "string (key responsibilities and achievements)"
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "location": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "gpa": "string"
    }
  ],
  "skills": [
    {
      "name": "string",
      "category": "Technical/Soft/Language",
      "level": "Beginner/Intermediate/Advanced/Expert"
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": "string",
      "link": "string",
      "github": "string"
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "date": "YYYY-MM",
      "expiryDate": "YYYY-MM"
    }
  ],
  "languages": [
    {
      "name": "string",
      "proficiency": "Native/Fluent/Professional/Conversational/Basic"
    }
  ],
  "achievements": [
    {
      "title": "string",
      "description": "string",
      "date": "YYYY-MM"
    }
  ]
}

Return ONLY the JSON object, no additional text.`;

    let aiResponse: string | null = null;

    // Try OpenAI (most reliable for structured output)
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini', // Fast and cost-effective
          messages: [
            {
              role: 'system',
              content: 'You are an expert CV/Resume parser. Extract information accurately and return valid JSON only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.1, // Low temperature for consistency
          max_tokens: 3000,
          response_format: { type: 'json_object' } // Force JSON response
        },
        {
          headers: {
            Authorization: `Bearer ${config.ai.openai.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      aiResponse = response.data.choices[0].message.content;
      logger.info(`CV parsed with AI (${response.data.usage.total_tokens} tokens)`);
    } catch (openaiError: any) {
      logger.error('AI CV extraction failed:', openaiError.message);
      throw new Error(`AI extraction failed: ${openaiError.message}`);
    }

    if (!aiResponse) {
      throw new Error('AI service returned empty response');
    }

    // Parse JSON response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }

    const extracted = JSON.parse(jsonMatch[0]);
    
    // Clean and validate the extracted data
    return cvParsingService.cleanExtractedData(extracted);
  },

  /**
   * Clean and validate extracted data
   */
  cleanExtractedData: (data: any): ExtractedData => {
    const cleaned: ExtractedData = {};

    // Personal Info
    if (data.personalInfo) {
      cleaned.personalInfo = {
        firstName: data.personalInfo.firstName?.trim(),
        lastName: data.personalInfo.lastName?.trim(),
        title: data.personalInfo.title?.trim()
      };
    }

    // Contact
    if (data.contact) {
      cleaned.contact = {};
      if (data.contact.email) cleaned.contact.email = data.contact.email.trim();
      if (data.contact.phone) cleaned.contact.phone = data.contact.phone.trim();
      if (data.contact.website) cleaned.contact.website = data.contact.website.trim();
      if (data.contact.linkedin) cleaned.contact.linkedin = data.contact.linkedin.trim();
      if (data.contact.github) cleaned.contact.github = data.contact.github.trim();
      
      if (data.contact.address && typeof data.contact.address === 'object') {
        cleaned.contact.address = data.contact.address;
      }
    }

    // Summary
    if (data.summary && typeof data.summary === 'string') {
      cleaned.summary = data.summary.trim();
    }

    // Experience
    if (Array.isArray(data.experience)) {
      cleaned.experience = data.experience
        .filter((exp: any) => exp.title || exp.company)
        .map((exp: any) => ({
          title: exp.title?.trim(),
          company: exp.company?.trim(),
          location: exp.location?.trim(),
          startDate: exp.startDate?.trim(),
          endDate: exp.endDate?.trim() || (exp.current ? 'Present' : undefined),
          current: !!exp.current,
          description: exp.description?.trim()
        }));
    }

    // Education
    if (Array.isArray(data.education)) {
      cleaned.education = data.education
        .filter((edu: any) => edu.degree || edu.institution)
        .map((edu: any) => ({
          degree: edu.degree?.trim(),
          institution: edu.institution?.trim(),
          location: edu.location?.trim(),
          startDate: edu.startDate?.trim(),
          endDate: edu.endDate?.trim(),
          gpa: edu.gpa?.trim()
        }));
    }

    // Skills
    if (Array.isArray(data.skills)) {
      cleaned.skills = data.skills
        .filter((skill: any) => skill.name || typeof skill === 'string')
        .map((skill: any) => 
          typeof skill === 'string' 
            ? { name: skill.trim(), level: 'intermediate' }
            : {
                name: skill.name?.trim(),
                category: skill.category?.trim(),
                level: skill.level?.trim() || 'intermediate'
              }
        );
    }

    // Projects
    if (Array.isArray(data.projects)) {
      cleaned.projects = data.projects
        .filter((proj: any) => proj.name)
        .map((proj: any) => ({
          name: proj.name?.trim(),
          description: proj.description?.trim(),
          technologies: proj.technologies?.trim(),
          link: proj.link?.trim(),
          github: proj.github?.trim()
        }));
    }

    // Certifications
    if (Array.isArray(data.certifications)) {
      cleaned.certifications = data.certifications
        .filter((cert: any) => cert.name)
        .map((cert: any) => ({
          name: cert.name?.trim(),
          issuer: cert.issuer?.trim(),
          date: cert.date?.trim(),
          expiryDate: cert.expiryDate?.trim()
        }));
    }

    // Languages
    if (Array.isArray(data.languages)) {
      cleaned.languages = data.languages
        .filter((lang: any) => lang.name || typeof lang === 'string')
        .map((lang: any) =>
          typeof lang === 'string'
            ? { name: lang.trim(), proficiency: 'Professional' }
            : {
                name: lang.name?.trim(),
                proficiency: lang.proficiency?.trim() || 'Professional'
              }
        );
    }

    // Achievements
    if (Array.isArray(data.achievements)) {
      cleaned.achievements = data.achievements
        .filter((ach: any) => ach.title || ach.description || typeof ach === 'string')
        .map((ach: any) =>
          typeof ach === 'string'
            ? { description: ach.trim() }
            : {
                title: ach.title?.trim(),
                description: ach.description?.trim(),
                date: ach.date?.trim()
              }
        );
    }

    return cleaned;
  },

  /**
   * Fallback: Extract data using regex (basic, ~40% accuracy)
   */
  extractWithRegex: (text: string): ExtractedData => {
    const extracted: ExtractedData = {};

    // Extract email
    const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
    if (emailMatch) {
      extracted.contact = extracted.contact || {};
      extracted.contact.email = emailMatch[1];
    }

    // Extract phone
    const phoneMatch = text.match(/(\+?1?\d{9,15})/);
    if (phoneMatch) {
      extracted.contact = extracted.contact || {};
      extracted.contact.phone = phoneMatch[1];
    }

    // Extract LinkedIn URL
    const linkedinMatch = text.match(/linkedin\.com\/in\/([a-zA-Z0-9-]+)/i);
    if (linkedinMatch) {
      extracted.contact = extracted.contact || {};
      extracted.contact.linkedin = `https://linkedin.com/in/${linkedinMatch[1]}`;
    }

    // Extract GitHub URL
    const githubMatch = text.match(/github\.com\/([a-zA-Z0-9-]+)/i);
    if (githubMatch) {
      extracted.contact = extracted.contact || {};
      extracted.contact.github = `https://github.com/${githubMatch[1]}`;
    }

    // Extract experience section
    const experienceMatch = text.match(
      /(?:experience|employment)([\s\S]*?)(?:education|skills|$)/i
    );
    if (experienceMatch) {
      // Parse job entries - simple pattern matching
      const jobs = experienceMatch[1].match(
        /([a-zA-Z\s]+)\s+(?:at|@)\s+([a-zA-Z\s&.]+)(?:\s*\n|\s*-\s*)(.+?)(?=\n\n|at @|$)/gim
      );

      if (jobs) {
        extracted.experience = jobs.map((job) => ({
          title: job.split(/at|@/i)[0]?.trim(),
          company: job.split(/at|@/i)[1]?.split(/\n|-/)[0]?.trim(),
          description: job.split(/\n/)[1]?.trim(),
        }));
      }
    }

    // Extract education section
    const educationMatch = text.match(
      /(?:education|degree)([\s\S]*?)(?:skills|experience|$)/i
    );
    if (educationMatch) {
      // Parse education entries
      const degrees = educationMatch[1].match(
        /([a-zA-Z\s]+)\s+(?:from|at)\s+([a-zA-Z\s&.]+)/gi
      );

      if (degrees) {
        extracted.education = degrees.map((deg) => ({
          degree: deg.split(/from|at/i)[0]?.trim(),
          institution: deg.split(/from|at/i)[1]?.trim(),
        }));
      }
    }

    // Extract skills
    const skillsMatch = text.match(/(?:skills|technologies?)([\s\S]*?)(?:education|experience|$)/i);
    if (skillsMatch) {
      const skillsList = skillsMatch[1]
        .split(/[,\n•-]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .slice(0, 20); // Limit to 20 skills

      extracted.skills = skillsList.map((skill) => ({
        name: skill,
        level: 'intermediate',
      }));
    }

    // Extract summary (first 300 chars of document)
    const summaryMatch = text.match(/^(.*?)(?:experience|skills|education)/is);
    if (summaryMatch) {
      const summary = summaryMatch[1]
        .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '')
        .replace(/\+?1?\d{9,15}/g, '')
        .trim()
        .slice(0, 300);

      if (summary.length > 50) {
        extracted.summary = summary;
      }
    }

    return extracted;
  },
};
