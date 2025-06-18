
"use client";

import type { ResumeData } from '@/lib/types';
import { sampleResumeData } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Wand2, UploadCloud, Loader2 } from 'lucide-react';
import { PersonalInfoForm } from './PersonalInfoForm';
import { EducationForm } from './EducationForm';
import { WorkExperienceForm } from './WorkExperienceForm';
import { ProjectsForm } from './ProjectsForm';
import { CertificationsForm } from './CertificationsForm';
import { SkillsForm } from './SkillsForm';
import { HobbiesForm } from './HobbiesForm';
import { FontSizeControl } from './FontSizeControl';
import React, { useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';

// Set workerSrc to a CDN version. This is crucial for Next.js environments.
// Make sure the version matches the installed pdfjs-dist version.
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;


interface EditorPanelProps {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  fontSizeMultiplier: number;
  onFontSizeMultiplierChange: (multiplier: number) => void;
}

export function EditorPanel({ 
  resumeData, 
  setResumeData,
  fontSizeMultiplier,
  onFontSizeMultiplierChange
}: EditorPanelProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handlePersonalInfoChange = (field: keyof ResumeData['personalInfo'], value: string) => {
    setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }));
  };

  const handleEducationChange = (updatedEntries: ResumeData['education']) => {
    setResumeData(prev => ({ ...prev, education: updatedEntries }));
  };

  const handleWorkExperienceChange = (updatedEntries: ResumeData['workExperience']) => {
    setResumeData(prev => ({ ...prev, workExperience: updatedEntries }));
  };
  
  const handleProjectsChange = (updatedEntries: ResumeData['projects']) => {
    setResumeData(prev => ({ ...prev, projects: updatedEntries }));
  };

  const handleCertificationsChange = (updatedEntries: ResumeData['certifications']) => {
    setResumeData(prev => ({ ...prev, certifications: updatedEntries }));
  };

  const handleSkillsChange = (value: string) => { 
    setResumeData(prev => ({ ...prev, skills: value }));
  };

  const handleHobbiesChange = (value: string) => {
    setResumeData(prev => ({ ...prev, hobbies: value }));
  };

  const loadSampleData = () => {
    const deepCopiedSampleData = JSON.parse(JSON.stringify(sampleResumeData));
    setResumeData(deepCopiedSampleData);
     toast({
      title: "Sample Data Loaded",
      description: "The sample resume data has been loaded into the editor.",
    });
  };

  const handlePdfUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const fileReader = new FileReader();

    fileReader.onload = async function() {
      try {
        const typedArray = new Uint8Array(this.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument({data: typedArray}).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          // The 'str' property is available on TextItem, but types might be restrictive.
          // Using `(item as any).str` is a common way to access it.
          fullText += textContent.items.map(item => (item as any).str).join(' ') + '\n\n';
        }
        
        setResumeData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            summary: fullText.trim() // Populate summary with extracted text
          }
        }));

        toast({
          title: "PDF Content Extracted",
          description: "The text from your PDF has been placed in the 'Professional Summary' field. Please review and distribute the content to other sections as needed.",
        });

      } catch (error) {
        console.error("Error parsing PDF:", error);
        toast({
          title: "PDF Parsing Error",
          description: "Could not extract text from the PDF. The file might be corrupted or in an unsupported format.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
        // Reset file input to allow uploading the same file again
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    fileReader.onerror = () => {
      toast({
        title: "File Reading Error",
        description: "Could not read the selected file.",
        variant: "destructive",
      });
      setIsUploading(false);
       if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
    };

    fileReader.readAsArrayBuffer(file);
  };


  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
        <h2 className="font-headline text-2xl font-semibold text-center md:text-left">Edit Your Resume</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={handlePdfUploadClick} variant="outline" size="sm" disabled={isUploading}>
            {isUploading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <UploadCloud className="w-4 h-4 mr-2" />
            )}
            {isUploading ? 'Processing PDF...' : 'Upload &amp; Fill from PDF'}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            style={{ display: 'none' }}
          />
          <Button onClick={loadSampleData} variant="outline" size="sm">
            <Wand2 className="w-4 h-4 mr-2" />
            Load Sample Data
          </Button>
        </div>
      </div>
      <Accordion type="multiple" defaultValue={['personal-info']} className="w-full">
        <AccordionItem value="personal-info">
          <AccordionTrigger className="font-headline text-lg hover:no-underline">Personal Information</AccordionTrigger>
          <AccordionContent>
            <PersonalInfoForm data={resumeData.personalInfo} onChange={handlePersonalInfoChange} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="font-size">
          <AccordionTrigger className="font-headline text-lg hover:no-underline">Appearance</AccordionTrigger>
          <AccordionContent>
            <FontSizeControl 
              currentMultiplier={fontSizeMultiplier}
              onMultiplierChange={onFontSizeMultiplierChange}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="education">
          <AccordionTrigger className="font-headline text-lg hover:no-underline">Education</AccordionTrigger>
          <AccordionContent>
            <EducationForm data={resumeData.education} onChange={handleEducationChange} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="work-experience">
          <AccordionTrigger className="font-headline text-lg hover:no-underline">Work Experience</AccordionTrigger>
          <AccordionContent>
            <WorkExperienceForm data={resumeData.workExperience} onChange={handleWorkExperienceChange} />
          </AccordionContent>
        </AccordionItem>
         <AccordionItem value="skills">
          <AccordionTrigger className="font-headline text-lg hover:no-underline">Skills</AccordionTrigger>
          <AccordionContent>
            <SkillsForm data={resumeData.skills} onChange={handleSkillsChange} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="projects">
          <AccordionTrigger className="font-headline text-lg hover:no-underline">Personal Projects</AccordionTrigger>
          <AccordionContent>
            <ProjectsForm data={resumeData.projects} onChange={handleProjectsChange} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="certifications">
          <AccordionTrigger className="font-headline text-lg hover:no-underline">Certifications</AccordionTrigger>
          <AccordionContent>
            <CertificationsForm data={resumeData.certifications} onChange={handleCertificationsChange} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="hobbies">
          <AccordionTrigger className="font-headline text-lg hover:no-underline">Hobbies &amp; Interests</AccordionTrigger>
          <AccordionContent>
            <HobbiesForm data={resumeData.hobbies} onChange={handleHobbiesChange} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
