declare module 'pdfkit' {
  class PDFDocument extends NodeJS.WritableStream {
    constructor(options?: any);
    fontSize(size: number): PDFDocument;
    font(name: string, size?: number): PDFDocument;
    text(text: string): PDFDocument;
    text(text: string, options: any): PDFDocument;
    text(text: string, x: number, y: number): PDFDocument;
    text(text: string, x: number, y: number, options: any): PDFDocument;
    moveDown(lines?: number): PDFDocument;
    fillColor(color: string): PDFDocument;
    strokeColor(color: string): PDFDocument;
    lineWidth(width: number): PDFDocument;
    moveTo(x: number, y: number): PDFDocument;
    lineTo(x: number, y: number): PDFDocument;
    rect(x: number, y: number, width: number, height: number): PDFDocument;
    fill(color?: string): PDFDocument;
    stroke(color?: string): PDFDocument;
    image(path: string, x?: number, y?: number, options?: any): PDFDocument;
    end(): PDFDocument;
    on(event: string, callback: (...args: any[]) => void): PDFDocument;
    y: number;
  }
  export = PDFDocument;
}
