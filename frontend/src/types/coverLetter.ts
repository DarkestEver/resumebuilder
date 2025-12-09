export interface CoverLetterTemplate {
  id: string;
  name: string;
  description: string;
  category: 'professional' | 'creative' | 'executive' | 'technical' | 'entry-level';
  style: {
    fontSize: string;
    fontFamily: string;
    lineHeight: string;
    paragraphSpacing: string;
    headerStyle: 'traditional' | 'modern' | 'minimal';
    layout: 'standard' | 'two-column' | 'sidebar';
  };
  sections: {
    header: boolean;
    date: boolean;
    recipient: boolean;
    salutation: boolean;
    opening: boolean;
    body: boolean;
    closing: boolean;
    signature: boolean;
  };
  tone: 'formal' | 'conversational' | 'enthusiastic' | 'confident';
  preview?: string;
}

export interface CoverLetterData {
  // Sender Information
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  senderAddress?: string;
  senderLinkedIn?: string;
  
  // Recipient Information
  recipientName?: string;
  recipientTitle?: string;
  companyName: string;
  companyAddress?: string;
  
  // Position Details
  positionTitle: string;
  jobDescription?: string;
  subject?: string;
  
  // Content
  opening?: string;
  body?: string;
  closing?: string;
  
  // Generated Fields
  date?: string;
  salutation?: string;
}

export interface GeneratedCoverLetter {
  content: string;
  template: CoverLetterTemplate;
  data: CoverLetterData;
  generatedAt: Date;
}
