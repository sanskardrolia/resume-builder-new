
"use client";

import type { ResumeData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Download, Eye, Loader2 } from 'lucide-react';
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { HtmlResumePreview } from './HtmlResumePreview';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import { FeedbackDialog } from './FeedbackDialog';

// Helper to format dates for the PDF
const formatDateRange = (startDate?: string, endDate?: string) => {
  if (!startDate && !endDate) return '';
  const start = startDate || 'N/A';
  const end = endDate || 'Present';
  return `${start} - ${end}`;
};

// Helper to ensure URLs are absolute
const ensureFullUrl = (urlInput: string) => {
  if (!urlInput) return '';
  if (urlInput.startsWith('http://') || urlInput.startsWith('https://')) {
    return urlInput;
  }
  return `https://${urlInput}`;
};

// Function to generate the PDF document definition
const createDocumentDefinition = (data: ResumeData): TDocumentDefinitions => {
  const { personalInfo, education, workExperience, projects, certifications, extraCurricular, skills, hobbies } = data;

  const skillsList = skills?.split(/[\n,]+/).map(s => s.trim()).filter(Boolean) || [];
  const hobbiesList = hobbies?.split(/[\n,]+/).map(h => h.trim()).filter(Boolean) || [];

  let content: any[] = [];

  // --- Personal Info ---
  if (personalInfo.name) content.push({ text: personalInfo.name, style: 'name', alignment: 'center' });
  if (personalInfo.title) content.push({ text: personalInfo.title, style: 'title', alignment: 'center', margin: [0, 0, 0, 5] });
  
  const contactItems: any[] = [];
  if (personalInfo.email) contactItems.push({ text: personalInfo.email, link: `mailto:${personalInfo.email}`, style: 'link' });
  if (personalInfo.phone) contactItems.push(personalInfo.phone);
  if (personalInfo.linkedin) contactItems.push({ text: personalInfo.linkedin, link: ensureFullUrl(personalInfo.linkedin), style: 'link' });
  if (personalInfo.github) contactItems.push({ text: `github.com/${personalInfo.github}`, link: `https://github.com/${personalInfo.github}`, style: 'link' });
  if (personalInfo.portfolioUrl) contactItems.push({ text: personalInfo.portfolioUrl, link: ensureFullUrl(personalInfo.portfolioUrl), style: 'link' });

  const interspersedContactItems = contactItems.flatMap((item, index) => index < contactItems.length - 1 ? [item, '  •  '] : [item]);
  content.push({ text: interspersedContactItems, alignment: 'center', style: 'contactLine', margin: [0, 0, 0, 10] });
  
  // --- Summary ---
  if (personalInfo.summary) {
    content.push({ text: 'Summary', style: 'sectionHeader' });
    content.push({ text: personalInfo.summary, style: 'paragraph' });
  }

  // --- Work Experience ---
  if (workExperience?.length > 0) {
    content.push({ text: 'Experience', style: 'sectionHeader' });
    workExperience.forEach(exp => {
      content.push({ text: exp.jobTitle, style: 'itemTitle' });
      content.push({ text: `${exp.company} | ${formatDateRange(exp.startDate, exp.endDate)}`, style: 'itemSubtitle' });
      if (exp.responsibilities) {
        content.push({
          ul: exp.responsibilities.split('\n').map(line => line.trim()).filter(line => line),
          style: 'list'
        });
      }
    });
  }

  // --- Education ---
  if (education?.length > 0) {
    content.push({ text: 'Education', style: 'sectionHeader' });
    education.forEach(edu => {
      content.push({ text: edu.degree, style: 'itemTitle' });
      content.push({ text: `${edu.institution} | ${formatDateRange(edu.startDate, edu.endDate)}`, style: 'itemSubtitle' });
      if (edu.details) {
        content.push({ text: edu.details, style: 'detailsText' });
      }
    });
  }

  // --- Skills ---
  if (skillsList.length > 0) {
    content.push({ text: 'Skills', style: 'sectionHeader' });
    content.push({ text: skillsList.join('  •  '), style: 'paragraph' });
  }

  // --- Projects ---
  if (projects?.length > 0) {
    content.push({ text: 'Projects', style: 'sectionHeader' });
    projects.forEach(proj => {
      content.push({
        columns: [
          { text: proj.title, style: 'itemTitle', width: '*' },
          proj.link ? { text: 'Link', link: ensureFullUrl(proj.link), style: 'link', alignment: 'right', width: 'auto' } : {},
        ]
      });
      content.push({ text: proj.description, style: 'detailsText', margin: [0, 2, 0, 2] });
      if (proj.technologies) {
        content.push({ text: `Technologies: ${proj.technologies}`, style: 'technologies' });
      }
    });
  }
  
  // --- Certifications ---
  if (certifications?.length > 0) {
    content.push({ text: 'Certifications', style: 'sectionHeader' });
    certifications.forEach(cert => {
      content.push({
        columns: [
          { text: cert.name, style: 'itemTitle', width: '*' },
          cert.dateEarned ? { text: cert.dateEarned, style: 'itemSubtitle', alignment: 'right', width: 'auto' } : {}
        ]
      });
      content.push({ text: cert.issuingOrganization, style: 'itemSubtitle' });
      if(cert.credentialId || cert.credentialUrl) {
         const creds: any[] = [];
         if(cert.credentialId) creds.push(`ID: ${cert.credentialId}`);
         if(cert.credentialUrl) creds.push({ text: 'Verify', link: ensureFullUrl(cert.credentialUrl), style: 'link'});
         content.push({ text: creds.flatMap((item, index) => index < creds.length - 1 ? [item, ' | '] : [item]), style: 'detailsText'});
      }
    });
  }
  
  // --- Extra-Curricular Activities ---
  if (extraCurricular?.length > 0) {
    content.push({ text: 'Extra-Curricular Activities', style: 'sectionHeader' });
    extraCurricular.forEach(activity => {
      content.push({ text: activity.activity, style: 'itemTitle' });
      content.push({ text: `${activity.organization} | ${formatDateRange(activity.startDate, activity.endDate)}`, style: 'itemSubtitle' });
      if (activity.description) {
        content.push({
          ul: activity.description.split('\n').map(line => line.trim()).filter(line => line),
          style: 'list'
        });
      }
    });
  }

  // --- Hobbies ---
  if (hobbiesList.length > 0) {
    content.push({ text: 'Hobbies & Interests', style: 'sectionHeader' });
    content.push({ text: hobbiesList.join('  •  '), style: 'paragraph' });
  }

  return {
    content,
    fonts: {
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
      }
    },
    defaultStyle: { font: 'Roboto', fontSize: 10, lineHeight: 1.15 },
    styles: {
      name: { fontSize: 24, bold: true, margin: [0, 0, 0, 2] },
      title: { fontSize: 14, color: 'gray', margin: [0, 0, 0, 5] },
      sectionHeader: { fontSize: 12, bold: true, margin: [0, 10, 0, 2], decoration: 'underline', decorationColor: '#cccccc' },
      itemTitle: { fontSize: 11, bold: true, margin: [0, 5, 0, 0] },
      itemSubtitle: { fontSize: 9, italics: true, color: '#333333', margin: [0, 1, 0, 2] },
      paragraph: { fontSize: 10, alignment: 'justify', margin: [0, 0, 0, 5] },
      list: { fontSize: 10, margin: [10, 2, 0, 5] },
      detailsText: { fontSize: 9, margin: [0, 2, 0, 5] },
      technologies: { fontSize: 9, italics: true, color: '#555555', margin: [0, 2, 0, 5] },
      link: { color: 'blue', decoration: 'underline' },
      contactLine: { fontSize: 9, color: '#444444' }
    },
    pageMargins: [40, 40, 40, 40],
  };
};

interface PreviewPanelProps {
  resumeData: ResumeData;
}

export function PreviewPanel({ resumeData }: PreviewPanelProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = React.useState(false);
  const previewRef = React.useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    setIsGenerating(true);
    try {
      // Dynamically import pdfmake and vfs_fonts
      const pdfMakeModule = await import('pdfmake/build/pdfmake');
      const pdfFontsModule = await import('pdfmake/build/vfs_fonts');

      // Assign the VFS to pdfMake
      pdfMakeModule.default.vfs = pdfFontsModule.default.vfs;

      const docDefinition = createDocumentDefinition(resumeData);
      const fileName = `${(resumeData.personalInfo?.name || 'Resume').replace(/\s+/g, '_')}-ResuMatic.pdf`;

      // Create and download the PDF
      pdfMakeModule.default.createPdf(docDefinition).download(fileName, () => {
        // This callback is a good place to trigger the feedback form.
        setIsFeedbackDialogOpen(true);
      });
    } catch (error) {
      console.error('Error generating PDF with pdfmake:', error);
      toast({
        title: 'Error generating PDF',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 bg-muted/30 h-full flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="font-headline text-2xl font-semibold flex items-center gap-2">
          <Eye className="w-6 h-6 text-primary" />
          Resume Preview
        </h2>
        <Button className="font-headline" onClick={handleDownloadPdf} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </>
          )}
        </Button>
      </div>
      <div
        className="overflow-auto flex-grow w-full h-[calc(100%-6rem)] border rounded-md bg-white p-2 shadow-inner"
      >
        <div className="w-full">
          <HtmlResumePreview ref={previewRef} data={resumeData} />
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Note: The downloaded PDF is generated from your data using the Roboto font.
        The preview may differ slightly.
      </p>
      <FeedbackDialog 
        isOpen={isFeedbackDialogOpen} 
        onOpenChange={setIsFeedbackDialogOpen} 
      />
    </div>
  );
}
