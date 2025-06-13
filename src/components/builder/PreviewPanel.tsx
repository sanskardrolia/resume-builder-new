
"use client";

import type { ResumeData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Download, Eye, Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { HtmlResumePreview } from './HtmlResumePreview';

// Standard UMD/ESM import for pdfmake and vfs_fonts
import pdfMakeLib from "pdfmake/build/pdfmake";
import pdfFontsData from "pdfmake/build/vfs_fonts";

// Log the imported values immediately to diagnose loading issues
console.log("Raw import pdfMakeLib:", pdfMakeLib);
console.log("Typeof pdfMakeLib:", typeof pdfMakeLib);
console.log("Raw import pdfFontsData:", pdfFontsData);
console.log("Typeof pdfFontsData:", typeof pdfFontsData);

const pdfMake = pdfMakeLib; // Assign to the variable name expected by the rest of the code

// Attempt to assign VFS
if (pdfMake && typeof pdfMake.createPdf === 'function') { // Check if pdfMake is a valid instance
  if (pdfFontsData && pdfFontsData.pdfMake && pdfFontsData.pdfMake.vfs) {
    pdfMake.vfs = pdfFontsData.pdfMake.vfs;
    console.log("pdfMake.vfs assigned successfully from pdfFontsData.pdfMake.vfs");
  } else {
    console.error(
      "CRITICAL: pdfFontsData structure is not as expected or is missing pdfMake.vfs.",
      "pdfFontsData:", pdfFontsData
    );
  }
} else {
  console.error(
    "CRITICAL: pdfMake (pdfMakeLib) is not loaded correctly or is not a valid pdfmake instance.",
    "pdfMakeLib:", pdfMakeLib
  );
}

// Post-initialization check for VFS
if (pdfMake && (!pdfMake.vfs || Object.keys(pdfMake.vfs).length === 0)) {
  console.warn(
    "Warning: pdfMake.vfs is still unpopulated or empty after attempted assignment. PDF font embedding might fail.",
    "Current pdfMake.vfs:", pdfMake.vfs
  );
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const handleDownloadPdf = async () => {
    if (!isClient) {
        toast({ title: "Preview Loading", description: "Please wait a moment for the preview to initialize." });
        return;
    }
    
    if (!pdfMake || typeof pdfMake.createPdf !== 'function' || !pdfMake.vfs || Object.keys(pdfMake.vfs).length === 0) { 
      toast({
        title: "PDF Generation Error",
        description: "pdfMake library or its fonts (vfs) are not loaded correctly. PDF cannot be generated.",
        variant: "destructive",
      });
      console.error("pdfMake.createPdf is not a function or pdfMake.vfs is not set/empty. PDF generation aborted. Check console for earlier critical errors.", "pdfMake object:", pdfMake);
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
              ul: exp.responsibilities.split('\n').map(line => line.trim()).filter(line => line),
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
        const skillsList = skills.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
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
          fontSize: 9,
          lineHeight: 1.2,
        },
        styles: {
          name: { fontSize: 18, bold: true, margin: [0, 0, 0, 1] },
          title: { fontSize: 12, color: 'gray', margin: [0, 0, 0, 2] },
          contactLine: { fontSize: 8, color: '#444444' },
          contactSeparator: { color: '#444444', margin: [0, 0, 0, 0] },
          sectionHeader: { fontSize: 10, bold: true, margin: [0, 5, 0, 2], decoration: 'underline' },
          itemTitle: { fontSize: 9, bold: true, margin: [0, 2, 0, 0] },
          itemSubtitle: { fontSize: 8, italic: true, color: '#333333', margin: [0, 0, 0, 1] },
          paragraph: { margin: [0, 0, 0, 3], alignment: 'justify' },
          list: { margin: [10, 1, 0, 3], lineHeight: 1.1 },
          detailsText: { fontSize: 8, margin: [0, 0, 0, 1] },
          technologies: { fontSize: 8, italic: true, color: '#555555', margin: [0,0,0,1]},
          link: { color: 'blue', decoration: 'underline', fontSize: 8 }
        },
        pageMargins: [ 30, 20, 30, 20 ],
      };

      pdfMake.createPdf(documentDefinition).download(`${(personalInfo.name || 'Resume').replace(/\s+/g, '_')}-FresherResumeBuilder.pdf`);

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
        Note: The PDF is generated programmatically with pdfMake and uses 'Roboto' font by default.
        The preview above shows HTML rendering which may differ slightly, especially with custom fonts.
      </p>
    </div>
  );
}

    