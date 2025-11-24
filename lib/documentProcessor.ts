import * as mammoth from 'mammoth';
import fs from 'fs/promises';

// Note: pdf-parse has issues with Next.js edge runtime
// For now, we'll skip PDF support or use a different approach
export async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    // Temporarily return placeholder - PDF parsing needs different approach in Next.js
    throw new Error('PDF support coming soon. Please use TXT or DOCX files for now.');
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('PDF support coming soon. Please use TXT or DOCX files for now.');
  }
}

export async function extractTextFromWord(filePath: string): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error('Error extracting text from Word document:', error);
    throw new Error('Failed to extract text from Word document');
  }
}

export async function extractTextFromTxt(filePath: string): Promise<string> {
  try {
    const text = await fs.readFile(filePath, 'utf-8');
    return text;
  } catch (error) {
    console.error('Error reading text file:', error);
    throw new Error('Failed to read text file');
  }
}

export async function extractText(filePath: string, mimeType: string): Promise<string> {
  if (mimeType === 'application/pdf') {
    return extractTextFromPDF(filePath);
  } else if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword'
  ) {
    return extractTextFromWord(filePath);
  } else if (mimeType === 'text/plain') {
    return extractTextFromTxt(filePath);
  } else {
    throw new Error(`Unsupported file type: ${mimeType}`);
  }
}
  
  
