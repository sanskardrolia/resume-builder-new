
"use client";

import type { ResumeData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Download, Eye, Loader2 } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { HtmlResumePreview } from './HtmlResumePreview';

import pdfMake from "pdfmake/build/pdfmake";
// Try to import vfs_fonts with a structure that might be more robust
// It seems the default export *is* the object containing pdfMake, which then contains vfs
import * as pdfFontsAll from "pdfmake/build/vfs_fonts";

// Assign VFS
if (pdfFontsAll && (pdfFontsAll as any).pdfMake && (pdfFontsAll as any).pdfMake.vfs) {
  pdfMake.vfs = (pdfFontsAll as any).pdfMake.vfs;
} else if (pdfFontsAll && (pdfFontsAll as any).vfs) { // Fallback if the structure is { vfs: ... } directly
   pdfMake.vfs = (pdfFontsAll as any).vfs;
}
else {
  console.error("Could not load pdfmake vfs fonts. PDF generation might fail or use default fonts.");
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
  const printRef = useRef<HTMLDivElement>(null); 

  const handleDownloadPdf = async () => {
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
          margin: [0, 0, 0, 5] // Reduced margin after contact line
        });
      }

      if (personalInfo.summary) {
        content.push({ text: 'Summary', style: 'sectionHeader' });
        content.push({ text: personalInfo.summary, style: 'paragraph', margin: [0, 0, 0, 5] }); // Reduced bottom margin
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
              margin: [0, 1, 0, 4] // Reduced list item bottom margin
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
            content.push({ text: edu.details, style: 'detailsText', margin: [0, 1, 0, 4] }); // Reduced bottom margin
          }
        });
      }
      
      if (skills) {
        const skillsList = skills.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
        if (skillsList.length > 0) {
          content.push({ text: 'Skills', style: 'sectionHeader' });
          content.push({ text: skillsList.join(', '), style: 'paragraph', margin: [0, 0, 0, 5] });
        }
      }

      if (projects && projects.length > 0) {
        content.push({ text: 'Projects', style: 'sectionHeader' });
        projects.forEach(proj => {
          const projectHeader: any[] = [{ text: proj.title, style: 'itemTitle' }];
          if (proj.link) {
            projectHeader.push({ text: 'Link', link: ensureFullUrl(proj.link), style: 'link', margin: [5,0,0,0]});
          }
          content.push({ columns: projectHeader });
          content.push({ text: proj.description, style: 'detailsText', margin: [0,1,0,0] });
          if (proj.technologies) {
            content.push({ text: `Technologies: ${proj.technologies}`, style: 'technologies', margin: [0,0,0,4] }); // Reduced bottom margin
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
            content.push({ text: credDetailsArray, style: 'detailsText', margin: [0,0,0,4] }); // Reduced bottom margin
          } else {
             // Ensure consistent spacing even if no cred details
            content.push({text: '', margin: [0,0,0, cert === certifications[certifications.length -1] ? 0 : 2]});
          }
        });
      }

      if (hobbies) {
        const hobbiesList = hobbies.split(/[\n,]+/).map(h => h.trim()).filter(Boolean);
        if (hobbiesList.length > 0) {
          content.push({ text: 'Hobbies & Interests', style: 'sectionHeader' });
          content.push({ text: hobbiesList.join(', '), style: 'paragraph', margin: [0,0,0,5] });
        }
      }

      const documentDefinition = {
        content: content,
        defaultStyle: {
          font: 'Roboto', 
          fontSize: 9.5, // Slightly reduced base font size
          lineHeight: 1.25, // Reduced line height
        },
        styles: {
          name: { fontSize: 20, bold: true, margin: [0, 0, 0, 1] }, // Reduced font size and bottom margin
          title: { fontSize: 13, color: 'gray', margin: [0, 0, 0, 3] }, // Reduced bottom margin
          contactLine: { fontSize: 8.5, color: '#444444' }, // Reduced font size
          contactSeparator: { color: '#444444', margin: [0, 0, 0, 0] },
          sectionHeader: { fontSize: 11, bold: true, margin: [0, 6, 0, 2], decoration: 'underline' }, // Reduced top/bottom margin
          itemTitle: { fontSize: 9.5, bold: true, margin: [0, 2, 0, 0] }, // Reduced top margin
          itemSubtitle: { fontSize: 8.5, italic: true, color: '#333333', margin: [0, 0, 0, 1] }, // Reduced bottom margin
          paragraph: { margin: [0, 0, 0, 3], alignment: 'justify' }, // Reduced bottom margin
          list: { margin: [12, 1, 0, 3], lineHeight: 1.1 }, // Reduced left/bottom margin, reduced line height for lists
          detailsText: { fontSize: 8.5, margin: [0, 0, 0, 1] }, // Reduced bottom margin
          technologies: { fontSize: 8.5, italic: true, color: '#555555', margin: [0,0,0,1]},
          link: { color: 'blue', decoration: 'underline' }
        },
        pageMargins: [ 40, 30, 40, 30 ], // Reduced top/bottom page margins
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
