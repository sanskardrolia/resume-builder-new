
"use client";

import type { ResumeData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Download, Eye, Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { HtmlResumePreview } from './HtmlResumePreview';

// Attempt to import pdfmake with explicit .js extensions
import * as PdfMakeModule from "pdfmake/build/pdfmake.js";

// Import vfs_fonts for its side effects AFTER PdfMakeModule is imported
import "pdfmake/build/vfs_fonts.js";

// Resolve the actual pdfMake instance.
let pdfMakeInstance: any;
if (PdfMakeModule && (PdfMakeModule as any).default && typeof (PdfMakeModule as any).default.createPdf === 'function') {
  pdfMakeInstance = (PdfMakeModule as any).default;
} else if (PdfMakeModule && typeof (PdfMakeModule as any).createPdf === 'function') {
  pdfMakeInstance = PdfMakeModule; 
} else {
  pdfMakeInstance = {}; 
  console.error("CRITICAL: Could not resolve a valid pdfMake instance from PdfMakeModule. PdfMakeModule content:", PdfMakeModule);
}

const pdfMake = pdfMakeInstance;

// Check if pdfMake.vfs was populated by the side-effect import of vfs_fonts.js
if (pdfMake && pdfMake.vfs && Object.keys(pdfMake.vfs).length > 0) {
  // console.log("pdfMake.vfs successfully populated after side-effect import of vfs_fonts.js");
} else {
  console.error(
    "CRITICAL: pdfMake.vfs was not populated or is empty after side-effect import of 'pdfmake/build/vfs_fonts'. " +
    "PDF font embedding will not work if custom fonts were intended. Ensure the vfs_fonts module correctly attaches to the pdfMake instance " +
    "or that the pdfmake and vfs_fonts versions are compatible.",
    "Current pdfMake object:", pdfMake,
    "Current pdfMake.vfs:", (pdfMake && typeof pdfMake === 'object' && pdfMake.vfs) ? pdfMake.vfs : "N/A (pdfMake itself might be undefined or not an object)"
  );
}


interface PreviewPanelProps {
  resumeData: ResumeData;
  fontSizeMultiplier: number; // Added prop
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

// Base font sizes for PDF
const basePdfFontSizes = {
  default: 9,
  name: 18,
  title: 12,
  contactLine: 8,
  sectionHeader: 10,
  itemTitle: 9,
  itemSubtitle: 8,
  paragraph: 9, // Added for consistency with defaultStyle
  list: 9,      // Assuming list items should match paragraph
  detailsText: 8,
  technologies: 8,
  link: 8,
};


export function PreviewPanel({ resumeData, fontSizeMultiplier }: PreviewPanelProps) {
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
      
      // Scale PDF font sizes
      const s = (key: keyof typeof basePdfFontSizes) => {
        return Math.round(basePdfFontSizes[key] * fontSizeMultiplier);
      };

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
        const skillsList = skills.split(/[\\n,]+/).map(skill => skill.trim()).filter(Boolean);
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
            certLine.push({ text: cert.dateEarned, alignment: 'right', width: 'auto', style: 'itemSubtitle' }); // Applied itemSubtitle for consistency
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
            // Add a small margin even if no cred details to separate entries
            content.push({text: '', margin: [0,0,0, cert === certifications[certifications.length -1] ? 0 : 2]});
          }
        });
      }

      if (hobbies) {
        const hobbiesList = hobbies.split(/[\\n,]+/).map(hobby => hobby.trim()).filter(Boolean);
        if (hobbiesList.length > 0) {
          content.push({ text: 'Hobbies & Interests', style: 'sectionHeader' });
          content.push({ text: hobbiesList.join(', '), style: 'paragraph', margin: [0,0,0,5] });
        }
      }

      const documentDefinition = {
        content: content,
        defaultStyle: {
          fontSize: s('default'),
          lineHeight: 1.2,
        },
        styles: {
          name: { fontSize: s('name'), bold: true, margin: [0, 0, 0, 1] as [number,number,number,number] },
          title: { fontSize: s('title'), color: 'gray', margin: [0, 0, 0, 2] as [number,number,number,number] },
          contactLine: { fontSize: s('contactLine'), color: '#444444' },
          contactSeparator: { color: '#444444', margin: [0, 0, 0, 0] as [number,number,number,number] }, // Font size will be inherited from contactLine
          sectionHeader: { fontSize: s('sectionHeader'), bold: true, margin: [0, 5, 0, 2] as [number,number,number,number], decoration: 'underline' },
          itemTitle: { fontSize: s('itemTitle'), bold: true, margin: [0, 2, 0, 0] as [number,number,number,number] },
          itemSubtitle: { fontSize: s('itemSubtitle'), italic: true, color: '#333333', margin: [0, 0, 0, 1] as [number,number,number,number] },
          paragraph: { fontSize: s('paragraph'), margin: [0, 0, 0, 3] as [number,number,number,number], alignment: 'justify' },
          list: { fontSize: s('list'), margin: [10, 1, 0, 3] as [number,number,number,number], lineHeight: 1.1 },
          detailsText: { fontSize: s('detailsText'), margin: [0, 0, 0, 1] as [number,number,number,number] },
          technologies: { fontSize: s('technologies'), italic: true, color: '#555555', margin: [0,0,0,1] as [number,number,number,number]},
          link: { color: 'blue', decoration: 'underline', fontSize: s('link') }
        },
        pageMargins: [ 30, 20, 30, 20 ] as [number,number,number,number],
      };
      
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

    } catch (error) { 
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
           {isClient ? <HtmlResumePreview data={resumeData} fontSizeMultiplier={fontSizeMultiplier} /> : <p>Loading preview...</p>}
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Note: The PDF is generated programmatically and uses standard fonts.
        The HTML preview above may differ slightly from the PDF. Font size changes will apply to both.
      </p>
    </div>
  );
}
