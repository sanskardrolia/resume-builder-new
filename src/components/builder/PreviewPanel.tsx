
"use client";

import type { ResumeData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Download, Eye, Loader2 } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { HtmlResumePreview } from './HtmlResumePreview';

import pdfMake from "pdfmake/build/pdfmake";
import { pdfMake as pdfMakeWithFontsVfs } from "pdfmake/build/vfs_fonts"; // Renamed for clarity

if (pdfMakeWithFontsVfs && pdfMakeWithFontsVfs.vfs) {
  pdfMake.vfs = pdfMakeWithFontsVfs.vfs;
} else if ((pdfMakeWithFontsVfs as any)?.pdfMake?.vfs) { // Fallback for potential different structure
   pdfMake.vfs = (pdfMakeWithFontsVfs as any).pdfMake.vfs;
}
else {
  console.error("Could not load pdfmake vfs fonts using named import. PDF generation might fail or use default fonts.");
}

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
    if (urlInput.includes('github.com')) { // User might enter full URL
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
  const printRef = useRef<HTMLDivElement>(null); 

  const handleDownloadPdf = async () => {
    setIsLoading(true);
    try {
      const { personalInfo, education, workExperience, projects, certifications, hobbies } = resumeData;

      const content: any[] = [];

      // Personal Info
      if (personalInfo.name) {
        content.push({ text: personalInfo.name, style: 'name', alignment: 'center' });
      }
      if (personalInfo.title) {
        content.push({ text: personalInfo.title, style: 'title', alignment: 'center', margin: [0, 0, 0, 5] });
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
          margin: [0, 0, 0, 10]
        });
      }

      if (personalInfo.summary) {
        content.push({ text: 'Summary', style: 'sectionHeader' });
        content.push({ text: personalInfo.summary, style: 'paragraph', margin: [0, 0, 0, 10] });
      }

      if (workExperience && workExperience.length > 0) {
        content.push({ text: 'Experience', style: 'sectionHeader' });
        workExperience.forEach(exp => {
          content.push({ text: exp.jobTitle, style: 'itemTitle' });
          content.push({ text: `${exp.company} | ${formatDateRange(exp.startDate, exp.endDate)}`, style: 'itemSubtitle' });
          if (exp.responsibilities) {
            content.push({
              ul: exp.responsibilities.split('\n').map(line => line.trim()).filter(line => line),
              style: 'list',
              margin: [0, 2, 0, 8]
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
            content.push({ text: edu.details, style: 'detailsText', margin: [0, 2, 0, 8] });
          }
        });
      }

      if (projects && projects.length > 0) {
        content.push({ text: 'Projects', style: 'sectionHeader' });
        projects.forEach(proj => {
          const projectHeader: any[] = [{ text: proj.title, style: 'itemTitle' }];
          if (proj.link) {
            projectHeader.push({ text: 'Link', link: ensureFullUrl(proj.link), style: 'link', margin: [5,0,0,0]});
          }
          content.push({ columns: projectHeader });
          content.push({ text: proj.description, style: 'detailsText', margin: [0,2,0,0] });
          if (proj.technologies) {
            content.push({ text: `Technologies: ${proj.technologies}`, style: 'technologies', margin: [0,0,0,8] });
          }
        });
      }
      
      if (certifications && certifications.length > 0) {
        content.push({ text: 'Certifications', style: 'sectionHeader' });
        certifications.forEach(cert => {
          const certLine: any[] = [{ text: cert.name, style: 'itemTitle' }];
           if (cert.dateEarned) {
            certLine.push({ text: cert.dateEarned, alignment: 'right' });
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
            content.push({ text: credDetailsArray, style: 'detailsText', margin: [0,0,0,8] });
          } else {
            content.push({text: '', margin: [0,0,0,8]}); // Ensure consistent spacing
          }
        });
      }

      if (hobbies) {
        const hobbiesList = hobbies.split(/[\n,]+/).map(h => h.trim()).filter(Boolean);
        if (hobbiesList.length > 0) {
          content.push({ text: 'Hobbies & Interests', style: 'sectionHeader' });
          content.push({ text: hobbiesList.join(', '), style: 'paragraph', margin: [0,0,0,10] });
        }
      }

      const documentDefinition = {
        content: content,
        defaultStyle: {
          font: 'Roboto', 
          fontSize: 10,
          lineHeight: 1.3,
        },
        styles: {
          name: { fontSize: 22, bold: true, margin: [0, 0, 0, 2] },
          title: { fontSize: 14, color: 'gray', margin: [0, 0, 0, 5] },
          contactLine: { fontSize: 9, color: '#444444' },
          contactSeparator: { color: '#444444', margin: [0, 0, 0, 0] }, // No extra margin for separator itself
          sectionHeader: { fontSize: 12, bold: true, margin: [0, 10, 0, 3], decoration: 'underline' },
          itemTitle: { fontSize: 10, bold: true, margin: [0, 5, 0, 0] },
          itemSubtitle: { fontSize: 9, italic: true, color: '#333333', margin: [0, 1, 0, 2] },
          paragraph: { margin: [0, 0, 0, 5], alignment: 'justify' },
          list: { margin: [15, 2, 0, 5] }, 
          detailsText: { fontSize: 9, margin: [0, 1, 0, 2] },
          technologies: { fontSize: 9, italic: true, color: '#555555', margin: [0,1,0,2]},
          link: { color: 'blue', decoration: 'underline' }
        },
        pageMargins: [ 40, 50, 40, 50 ], 
      };

      pdfMake.createPdf(documentDefinition).download(`${(personalInfo.name || 'Resume').replace(/\s+/g, '_')}-ResuMatic.pdf`);

      toast({
        title: "PDF Generated",
        description: "Your resume PDF has been downloaded.",
      });

    } catch (error) {
      console.error("Error generating PDF with pdfMake:", error);
      toast({
        title: "Error Generating PDF",
        description: error instanceof Error ? error.message : "An unknown error occurred while generating the PDF.",
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
          Preview & Download
        </h2>
        <Button 
          className="font-headline" 
          onClick={handleDownloadPdf} 
          disabled={isLoading}
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
        className="overflow-auto flex-grow w-full h-[calc(100%-4rem)] border rounded-md bg-white p-2"
      >
        <div ref={printRef} className="w-full"> 
          <HtmlResumePreview data={resumeData} />
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Note: The PDF is generated programmatically with pdfMake and uses 'Roboto' font by default. 
        The preview above shows HTML rendering which may differ slightly, especially with custom fonts.
      </p>
    </div>
  );
}
