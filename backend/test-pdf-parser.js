const fs = require('fs');
const PDFParser = require('pdf2json');

// Test pdf2json with the uploaded file
const files = fs.readdirSync('uploads/cv');
console.log('Files in uploads/cv:', files);

if (files.length > 0) {
  const pdfPath = `uploads/cv/${files[0]}`;
  console.log(`\nTesting ${pdfPath} with pdf2json...`);
  
  const pdfParser = new PDFParser(null, 1);
  
  pdfParser.on('pdfParser_dataError', errData => {
    console.error('pdf2json error:', errData.parserError);
  });
  
  pdfParser.on('pdfParser_dataReady', () => {
    console.log('PDF parsed successfully!');
    
    // Try getRawTextContent
    if (pdfParser.getRawTextContent) {
      const text = pdfParser.getRawTextContent();
      console.log(`\nExtracted text (${text.length} chars):`);
      console.log(text.substring(0, 500) + '...');
    } else {
      console.log('\nNo getRawTextContent method, extracting from Pages...');
      const pages = pdfParser.Pages || [];
      console.log(`Found ${pages.length} pages`);
      
      const textArray = [];
      pages.forEach((page, i) => {
        console.log(`Page ${i + 1}: ${page.Texts?.length || 0} text items`);
        if (page.Texts) {
          page.Texts.forEach(textItem => {
            if (textItem.R) {
              textItem.R.forEach(run => {
                if (run.T) {
                  textArray.push(decodeURIComponent(run.T));
                }
              });
            }
          });
        }
      });
      
      const text = textArray.join(' ');
      console.log(`\nExtracted text (${text.length} chars):`);
      console.log(text.substring(0, 500) + '...');
    }
  });
  
  pdfParser.loadPDF(pdfPath);
} else {
  console.log('No files to test!');
}
