"use client";

import type { ResumeData } from '@/lib/types';
import { sampleResumeData } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react'; // Removed UploadCloud, Loader2
import { PersonalInfoForm } from './PersonalInfoForm';
import { EducationForm } from './EducationForm';
import { WorkExperienceForm } from './WorkExperienceForm';
import { ProjectsForm } from './ProjectsForm';
import { CertificationsForm } from './CertificationsForm';
import { SkillsForm } from './SkillsForm';
import { HobbiesForm } from './HobbiesForm';
import { FontSizeControl } from './FontSizeControl';
import React from 'react'; // Removed useRef, useState
import { useToast } from '@/hooks/use-toast';
// Removed pdfjsLib import and workerSrc configuration

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
  // Removed fileInputRef and isUploading state

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

  // Removed handlePdfUploadClick and handleFileChange functions

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="font-headline text-2xl font-semibold text-center md:text-left">Edit Your Resume</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <FontSizeControl 
            currentMultiplier={fontSizeMultiplier}
            onFontSizeMultiplierChange={onFontSizeMultiplierChange}
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
          <AccordionTrigger className="font-headline text-lg hover:no-underline">Hobbies & Interests</AccordionTrigger>
          <AccordionContent>
            <HobbiesForm data={resumeData.hobbies} onChange={handleHobbiesChange} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
