const fs = require('fs');
const path = require('path');

async function testPdfParse() {
  try {
    console.log('Testing pdf-parse import methods...\n');
    
    // Method 1: require
    console.log('Method 1: require()');
    const pdfParse1 = require('pdf-parse');
    console.log('Type:', typeof pdfParse1);
    console.log('Keys:', Object.keys(pdfParse1));
    console.log('Has default?', pdfParse1.default !== undefined);
    console.log('Is function?', typeof pdfParse1 === 'function');
    
    // Method 2: dynamic import
    console.log('\nMethod 2: dynamic import()');
    const pdfParse2 = await import('pdf-parse');
    console.log('Type:', typeof pdfParse2);
    console.log('Keys:', Object.keys(pdfParse2));
    console.log('Has default?', pdfParse2.default !== undefined);
    console.log('Default type:', typeof pdfParse2.default);
    console.log('Default keys:', pdfParse2.default ? Object.keys(pdfParse2.default) : 'N/A');
    
    // Create a simple test PDF buffer (minimal valid PDF)
    const testPdfBuffer = Buffer.from(`%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Hello World) Tj
ET
endstream
endobj
5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000367 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
457
%%EOF`);
    
    // Test with require
    console.log('\n--- Testing with require ---');
    try {
      const result1 = await pdfParse1(testPdfBuffer);
      console.log('✅ SUCCESS with require');
      console.log('Text extracted:', result1.text.trim());
    } catch (err) {
      console.log('❌ FAILED with require:', err.message);
    }
    
    // Test with dynamic import.default
    console.log('\n--- Testing with dynamic import.default ---');
    try {
      const result2 = await pdfParse2.default(testPdfBuffer);
      console.log('✅ SUCCESS with dynamic import.default');
      console.log('Text extracted:', result2.text.trim());
    } catch (err) {
      console.log('❌ FAILED with dynamic import.default:', err.message);
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testPdfParse();
