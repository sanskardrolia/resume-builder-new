
'use server';

import type { ResumeData } from '@/lib/types';
import { ResumeHtmlTemplate } from '@/components/pdf/ResumeHtmlTemplate';
import puppeteer from 'puppeteer';
import ReactDOMServer from 'react-dom/server';
import React from 'react';

interface GeneratePdfResult {
  success: boolean;
  pdfBase64?: string;
  error?: string;
  fileName: string;
}

export async function generatePdfAction(resumeData: ResumeData): Promise<GeneratePdfResult> {
  const fileName = `${resumeData.personalInfo.name || 'Resume'}-ResuMatic.pdf`;
  try {
    const htmlContent = ReactDOMServer.renderToStaticMarkup(
      React.createElement(ResumeHtmlTemplate, { data: resumeData })
    );

    // Launch Puppeteer.
    // Note: In some environments (especially serverless), you might need additional args
    // like ['--no-sandbox', '--disable-setuid-sandbox'] for puppeteer.launch().
    // Also, ensure Puppeteer is correctly installed and accessible in your deployment environment.
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    // Set content and wait for network activity to settle, if any.
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { // Optional: adjust margins
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      }
    });

    await browser.close();

    return {
      success: true,
      pdfBase64: pdfBuffer.toString('base64'),
      fileName,
    };
  } catch (error) {
    console.error('Error generating PDF:', error);
    let errorMessage = 'Failed to generate PDF.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return {
      success: false,
      error: errorMessage,
      fileName,
    };
  }
}
