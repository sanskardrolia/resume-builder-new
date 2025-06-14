
"use client";

import type { ResumeData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Download, Eye, Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { HtmlResumePreview } from './HtmlResumePreview';

// Attempt to import pdfmake with explicit .js extensions
// Log the PdfMakeModule to see its actual structure.
import * as PdfMakeModule from "pdfmake/build/pdfmake.js";

console.log("Raw PdfMakeModule import:", PdfMakeModule);

// Resolve the actual pdfMake instance.
let pdfMakeInstance: any;
if (PdfMakeModule && (PdfMakeModule as any).default && typeof (PdfMakeModule as any).default.createPdf === 'function') {
  pdfMakeInstance = (PdfMakeModule as any).default;
  console.log("Using PdfMakeModule.default as pdfMake instance.");
} else if (PdfMakeModule && typeof (PdfMakeModule as any).createPdf === 'function') {
  pdfMakeInstance = PdfMakeModule; // The namespace itself might be the library instance
  console.log("Using PdfMakeModule itself (namespace) as pdfMake instance.");
} else {
  pdfMakeInstance = {}; // Fallback to prevent errors, but indicates a problem
  console.error("CRITICAL: Could not resolve a valid pdfMake instance from PdfMakeModule. PdfMakeModule content:", PdfMakeModule);
}

// Assign to pdfMake, which is used throughout the component
const pdfMake = pdfMakeInstance;

console.log("Resolved pdfMake instance for component use:", pdfMake);
console.log("Typeof resolved pdfMake instance:", typeof pdfMake);

// pdfMake.vfs related imports and checks are removed.

interface PreviewPanelProps {
  resumeData: ResumeData;
}

const formatDateRange = (startDate?: string, endDate?: string) => {
  if (!startDate && !endDate) return '';
  const start = startDate || 'N/A';
  const end = endDate || 'Present';
  return `${start} - ${end}`;
};

const ensureFullUrl = (urlInput: string, isGithubUsername: boolean = false) => {
  if (!urlInput) return '';
  if (isGithubUsername) {
    if (urlInput.includes('github.com')) {
        return urlInput.startsWith('http') ? urlInput : `https://${urlInput}`;
    }
    return `https://github.com/${urlInput}`;
  }
  if (urlInput.startsWith('http://') || urlInput.startsWith('https://')) {
    return urlInput;
  }
  return `https://${urlInput}`;
};

export function PreviewPanel({ resumeData }: PreviewPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const handleDownloadPdf = async () => {
    if (!isClient) {
        toast({ title: "Preview Loading", description: "Please wait a moment for the preview to initialize." });
        return;
    }
    
    if (!pdfMake || typeof pdfMake.createPdf !== 'function') { 
      toast({
        title: "PDF Generation Error",
        description: "pdfMake library is not loaded correctly or createPdf function is missing. PDF cannot be generated. Check console logs for details.",
        variant: "destructive",
      });
      console.error("PDF Generation Aborted: pdfMake.createPdf is not a function or pdfMake is not loaded.", "pdfMake object:", pdfMake);
      return;
    }

    setIsLoading(true);
    try {
      const { personalInfo, education, workExperience, projects, certifications, skills, hobbies } = resumeData;

      const content: any[] = [];

      // Personal Info
      if (personalInfo.name) {
        content.push({ text: personalInfo.name, style: 'name', alignment: 'center' });
      }
      if (personalInfo.title) {
        content.push({ text: personalInfo.title, style: 'title', alignment: 'center', margin: [0, 0, 0, 3] });
      }
      
      const contactDetailsForPdf: any[] = [];
      if (personalInfo.email) {
        contactDetailsForPdf.push({ text: personalInfo.email, link: `mailto:${personalInfo.email}`, style: 'link' });
      }
      if (personalInfo.phone) {
        if (contactDetailsForPdf.length > 0) contactDetailsForPdf.push({ text: ' | ', style: 'contactSeparator' });
        contactDetailsForPdf.push({ text: personalInfo.phone });
      }
      if (personalInfo.linkedin) {
        if (contactDetailsForPdf.length > 0) contactDetailsForPdf.push({ text: ' | ', style: 'contactSeparator' });
        contactDetailsForPdf.push({ text: personalInfo.linkedin, link: ensureFullUrl(personalInfo.linkedin), style: 'link' });
      }
      if (personalInfo.github) {
        if (contactDetailsForPdf.length > 0) contactDetailsForPdf.push({ text: ' | ', style: 'contactSeparator' });
        contactDetailsForPdf.push({ text: `github.com/${personalInfo.github}`, link: ensureFullUrl(personalInfo.github, true), style: 'link' });
      }
      if (personalInfo.portfolioUrl) {
        if (contactDetailsForPdf.length > 0) contactDetailsForPdf.push({ text: ' | ', style: 'contactSeparator' });
        contactDetailsForPdf.push({ text: personalInfo.portfolioUrl, link: ensureFullUrl(personalInfo.portfolioUrl), style: 'link' });
      }

      if (contactDetailsForPdf.length > 0) {
        content.push({
          text: contactDetailsForPdf,
          alignment: 'center',
          style: 'contactLine',
          margin: [0, 0, 0, 5]
        });
      }

      if (personalInfo.summary) {
        content.push({ text: 'Summary', style: 'sectionHeader' });
        content.push({ text: personalInfo.summary, style: 'paragraph', margin: [0, 0, 0, 5] });
      }

      if (workExperience && workExperience.length > 0) {
        content.push({ text: 'Experience', style: 'sectionHeader' });
        workExperience.forEach(exp => {
          content.push({ text: exp.jobTitle, style: 'itemTitle' });
          content.push({ text: `${exp.company} | ${formatDateRange(exp.startDate, exp.endDate)}`, style: 'itemSubtitle' });
          if (exp.responsibilities) {
            content.push({
              ul: exp.responsibilities.split('\\n').map(line => line.trim()).filter(line => line),
              style: 'list',
              margin: [0, 1, 0, 4]
            });
          }
        });
      }

      if (education && education.length > 0) {
        content.push({ text: 'Education', style: 'sectionHeader' });
        education.forEach(edu => {
          content.push({ text: edu.degree, style: 'itemTitle' });
          content.push({ text: `${edu.institution} | ${formatDateRange(edu.startDate, edu.endDate)}`, style: 'itemSubtitle' });
          if (edu.details) {
            content.push({ text: edu.details, style: 'detailsText', margin: [0, 1, 0, 4] });
          }
        });
      }
      
      if (skills) {
        const skillsList = skills.split(/[\\n,]+/).map(s => s.trim()).filter(Boolean);
        if (skillsList.length > 0) {
          content.push({ text: 'Skills', style: 'sectionHeader' });
          content.push({ text: skillsList.join(', '), style: 'paragraph', margin: [0, 0, 0, 5] });
        }
      }

      if (projects && projects.length > 0) {
        content.push({ text: 'Projects', style: 'sectionHeader' });
        projects.forEach(proj => {
          const projectHeader: any[] = [{ text: proj.title, style: 'itemTitle', width: '*' }];
          if (proj.link) {
            projectHeader.push({ text: 'Link', link: ensureFullUrl(proj.link), style: 'link', alignment: 'right', width: 'auto' });
          }
          content.push({ columns: projectHeader });
          content.push({ text: proj.description, style: 'detailsText', margin: [0,1,0,0] });
          if (proj.technologies) {
            content.push({ text: `Technologies: ${proj.technologies}`, style: 'technologies', margin: [0,0,0,4] });
          }
        });
      }
      
      if (certifications && certifications.length > 0) {
        content.push({ text: 'Certifications', style: 'sectionHeader' });
        certifications.forEach(cert => {
          const certLine: any[] = [{ text: cert.name, style: 'itemTitle', width: '*' }];
           if (cert.dateEarned) {
            certLine.push({ text: cert.dateEarned, alignment: 'right', width: 'auto' });
          }
          content.push({ columns: certLine });
          content.push({ text: cert.issuingOrganization, style: 'itemSubtitle' });
          
          const credDetailsArray: any[] = [];
          if (cert.credentialId) credDetailsArray.push({ text: `ID: ${cert.credentialId}` });
          if (cert.credentialUrl) {
            if (credDetailsArray.length > 0) credDetailsArray.push({ text: ' | '});
            credDetailsArray.push({ text: 'Verify', link: ensureFullUrl(cert.credentialUrl), style: 'link' });
          }
           if (credDetailsArray.length > 0) {
            content.push({ text: credDetailsArray, style: 'detailsText', margin: [0,0,0,4] });
          } else {
            content.push({text: '', margin: [0,0,0, cert === certifications[certifications.length -1] ? 0 : 2]});
          }
        });
      }

      if (hobbies) {
        const hobbiesList = hobbies.split(/[\\n,]+/).map(h => h.trim()).filter(Boolean);
        if (hobbiesList.length > 0) {
          content.push({ text: 'Hobbies & Interests', style: 'sectionHeader' });
          content.push({ text: hobbiesList.join(', '), style: 'paragraph', margin: [0,0,0,5] });
        }
      }

      const documentDefinition = {
        content: content,
        defaultStyle: {
          font: 'Helvetica', 
          fontSize: 9,
          lineHeight: 1.2,
        },
        fonts: { 
            Helvetica: {
                normal: 'Helvetica',
                bold: 'Helvetica-Bold',
                italics: 'Helvetica-Oblique',
                bolditalics: 'Helvetica-BoldOblique'
            }
        },
        styles: {
          name: { fontSize: 18, bold: true, margin: [0, 0, 0, 1] as [number,number,number,number] },
          title: { fontSize: 12, color: 'gray', margin: [0, 0, 0, 2] as [number,number,number,number] },
          contactLine: { fontSize: 8, color: '#444444' },
          contactSeparator: { color: '#444444', margin: [0, 0, 0, 0] as [number,number,number,number] },
          sectionHeader: { fontSize: 10, bold: true, margin: [0, 5, 0, 2] as [number,number,number,number], decoration: 'underline' },
          itemTitle: { fontSize: 9, bold: true, margin: [0, 2, 0, 0] as [number,number,number,number] },
          itemSubtitle: { fontSize: 8, italic: true, color: '#333333', margin: [0, 0, 0, 1] as [number,number,number,number] },
          paragraph: { margin: [0, 0, 0, 3] as [number,number,number,number], alignment: 'justify' },
          list: { margin: [10, 1, 0, 3] as [number,number,number,number], lineHeight: 1.1 },
          detailsText: { fontSize: 8, margin: [0, 0, 0, 1] as [number,number,number,number] },
          technologies: { fontSize: 8, italic: true, color: '#555555', margin: [0,0,0,1] as [number,number,number,number]},
          link: { color: 'blue', decoration: 'underline', fontSize: 8 }
        },
        pageMargins: [ 30, 20, 30, 20 ] as [number,number,number,number],
      };
      
      // Improved error catching for pdfMake operations
      try {
        const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
        pdfDocGenerator.download(`${(personalInfo.name || 'Resume').replace(/\s+/g, '_')}-FresherResumeBuilder.pdf`);
        
        toast({
          title: "PDF Generated",
          description: "Your resume PDF has been downloaded.",
        });

      } catch (pdfError) {
        console.error("Error directly from pdfMake.createPdf or .download():", pdfError);
        toast({
          title: "PDF Creation/Download Error",
          description: pdfError instanceof Error ? pdfError.message : "An unknown error occurred while creating or downloading the PDF.",
          variant: "destructive",
        });
      }

    } catch (error) { // This outer catch is for errors in data processing before pdfMake
      console.error("Error preparing document definition for pdfMake:", error);
      toast({
        title: "Error Preparing PDF",
        description: error instanceof Error ? error.message : "An unknown error occurred while preparing the PDF document.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-muted/30 h-full flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="font-headline text-2xl font-semibold flex items-center gap-2">
          <Eye className="w-6 h-6 text-primary" />
          HTML Preview
        </h2>
        <Button
          className="font-headline"
          onClick={handleDownloadPdf}
          disabled={isLoading || !isClient}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {isLoading ? 'Generating PDF...' : 'Download PDF'}
        </Button>
      </div>
      <div
        className="overflow-auto flex-grow w-full h-[calc(100%-6rem)] border rounded-md bg-white p-2 shadow-inner"
      >
        <div className="w-full">
           {isClient ? <HtmlResumePreview data={resumeData} /> : <p>Loading preview...</p>}
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Note: The PDF is generated programmatically and uses standard fonts (e.g., Helvetica).
        The HTML preview above may differ slightly from the PDF.
      </p>
    </div>
  );
}
    
