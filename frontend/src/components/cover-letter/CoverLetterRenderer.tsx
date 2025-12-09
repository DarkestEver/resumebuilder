'use client';

import React from 'react';
import { CoverLetterTemplate, CoverLetterData } from '@/types/coverLetter';

interface CoverLetterRendererProps {
  template: CoverLetterTemplate;
  data: CoverLetterData;
  generatedContent?: string;
}

export const CoverLetterRenderer: React.FC<CoverLetterRendererProps> = ({
  template,
  data,
  generatedContent,
}) => {
  const { style, sections } = template;

  const formatDate = (date?: string) => {
    if (!date) return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return date;
  };

  const getSalutation = () => {
    if (data.salutation) return data.salutation;
    if (data.recipientName) return `Dear ${data.recipientName},`;
    return 'Dear Hiring Manager,';
  };

  const getSubject = () => {
    if (data.subject) return data.subject;
    if (data.positionTitle && data.companyName) return `Application for ${data.positionTitle} – ${data.companyName}`;
    if (data.positionTitle) return `Application for ${data.positionTitle}`;
    return '';
  };

  const getClosingByTone = () => {
    switch (template.tone) {
      case 'formal':
        return 'Sincerely,';
      case 'conversational':
        return 'Best regards,';
      case 'enthusiastic':
        return 'Warm regards,';
      case 'confident':
        return 'Respectfully,';
      default:
        return 'Sincerely,';
    }
  };

  return (
    <div 
      className="cover-letter-preview bg-white shadow-lg mx-auto"
      style={{
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
        maxWidth: '8.5in',
        minHeight: '11in',
        padding: '1in',
      }}
    >
      {/* Header Section */}
      {sections.header && (
        <div className={`header mb-6 ${style.headerStyle === 'modern' ? 'border-b-2 border-gray-200 pb-4' : ''}`}>
          {style.headerStyle === 'traditional' && (
            <div className="text-left">
              <h1 className="text-2xl font-bold mb-1">{data.senderName}</h1>
              <div className="text-sm text-gray-700">
                <span>{data.senderEmail}</span>
                {data.senderEmail && data.senderPhone && <span> • </span>}
                <span>{data.senderPhone}</span>
                {(data.senderEmail || data.senderPhone) && data.senderLinkedIn && <span> • </span>}
                <span>{data.senderLinkedIn}</span>
              </div>
              {data.senderAddress && <div className="text-sm text-gray-600 mt-1">{data.senderAddress}</div>}
            </div>
          )}
          {style.headerStyle === 'modern' && (
            <div className="text-left">
              <div className="flex items-baseline justify-between">
                <h1 className="text-2xl font-bold">{data.senderName}</h1>
              </div>
              <div className="text-sm text-gray-700 mt-1">
                <span>{data.senderEmail}</span>
                {data.senderEmail && data.senderPhone && <span> • </span>}
                <span>{data.senderPhone}</span>
                {(data.senderEmail || data.senderPhone) && data.senderLinkedIn && <span> • </span>}
                <span>{data.senderLinkedIn}</span>
              </div>
              {data.senderAddress && <div className="text-sm text-gray-600 mt-1">{data.senderAddress}</div>}
            </div>
          )}
          {style.headerStyle === 'minimal' && (
            <div className="text-left">
              <div className="text-lg font-semibold">{data.senderName}</div>
              <div className="text-sm text-gray-700">
                <span>{data.senderEmail}</span>
                {data.senderEmail && data.senderPhone && <span> • </span>}
                <span>{data.senderPhone}</span>
                {(data.senderEmail || data.senderPhone) && data.senderLinkedIn && <span> • </span>}
                <span>{data.senderLinkedIn}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Date */}
      {sections.date && (
        <div className="text-sm mb-4">
          {formatDate(data.date)}
        </div>
      )}

      {/* Recipient Information */}
      {sections.recipient && (
        <div className="text-sm mb-6">
          {data.recipientName && <div>{data.recipientName}</div>}
          {data.recipientTitle && <div>{data.recipientTitle}</div>}
          {data.companyName && <div className="font-semibold">{data.companyName}</div>}
          {data.companyAddress && <div>{data.companyAddress}</div>}
        </div>
      )}

      {/* Subject Line */}
      {getSubject() && (
        <div className="mb-4 font-semibold">Re: {getSubject()}</div>
      )}

      {/* Salutation */}
      {sections.salutation && (
        <div className="mb-4 font-medium">
          {getSalutation()}
        </div>
      )}

      {/* Generated Content or Manual Content */}
      <div className="content" style={{ marginBottom: style.paragraphSpacing }}>
        {generatedContent ? (
          <div className="whitespace-pre-wrap">{generatedContent}</div>
        ) : (
          <>
            {/* Opening Paragraph */}
            {sections.opening && data.opening && (
              <p style={{ marginBottom: style.paragraphSpacing }}>
                {data.opening}
              </p>
            )}

            {/* Body */}
            {sections.body && data.body && (
              <div className="whitespace-pre-wrap" style={{ marginBottom: style.paragraphSpacing }}>
                {data.body}
              </div>
            )}

            {/* Closing */}
            {sections.closing && data.closing && (
              <p style={{ marginBottom: style.paragraphSpacing }}>
                {data.closing}
              </p>
            )}
          </>
        )}
      </div>

      {/* Signature */}
      {sections.signature && (
        <div className="mt-8">
          <div className="mb-4">{getClosingByTone()}</div>
          <div className="font-semibold">
            {data.senderName}
          </div>
        </div>
      )}
    </div>
  );
};
