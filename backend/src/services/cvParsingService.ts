import { parseDocx } from 'docx-parser';
import Tesseract from 'tesseract.js';
import PDFParser from 'pdf2json';
import fs from 'fs';

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
        const pdfParser = new PDFParser(null, 1);
        
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
    return cvParsingService.extractDataFromText(text);
  },

  /**
   * Parse DOCX file
   */
  parseDOC: async (fileBuffer: Buffer): Promise<ExtractedData> => {
    try {
      const text = await parseDocx(fileBuffer);
      return cvParsingService.extractDataFromText(text);
    } catch (error) {
      console.error('DOCX parsing error:', error);
      throw new Error('Failed to parse DOCX');
    }
  },

  /**
   * Parse TXT file
   */
  parseTXT: async (text: string): Promise<ExtractedData> => {
    return cvParsingService.extractDataFromText(text);
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
      return cvParsingService.extractDataFromText(text);
    } catch (error) {
      console.error('Image OCR error:', error);
      throw new Error('Failed to parse image');
    }
  },

  /**
   * Extract structured data from raw text
   */
  extractDataFromText: (text: string): ExtractedData => {
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
