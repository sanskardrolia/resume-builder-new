"use client";

import type { ResumeData } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PersonalInfoForm } from './PersonalInfoForm';
import { EducationForm } from './EducationForm';
import { WorkExperienceForm } from './WorkExperienceForm';
import { ProjectsForm } from './ProjectsForm';
import { HobbiesForm } from './HobbiesForm';

interface EditorPanelProps {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

export function EditorPanel({ resumeData, setResumeData }: EditorPanelProps) {
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

  const handleHobbiesChange = (value: string) => {
    setResumeData(prev => ({ ...prev, hobbies: value }));
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <h2 className="font-headline text-2xl font-semibold text-center md:text-left">Edit Your Resume</h2>
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
        <AccordionItem value="projects">
          <AccordionTrigger className="font-headline text-lg hover:no-underline">Personal Projects</AccordionTrigger>
          <AccordionContent>
            <ProjectsForm data={resumeData.projects} onChange={handleProjectsChange} />
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
