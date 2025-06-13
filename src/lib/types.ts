export interface PersonalInfo {
  name: string;
  title: string; // e.g., Software Engineer
  email: string;
  phone: string;
  linkedin: string;
  summary: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string; // or 'Present'
  details: string; // e.g., GPA, Honors, Relevant Coursework
}

export interface WorkExperienceEntry {
  id: string;
  company: string;
  jobTitle: string;
  startDate: string;
  endDate: string; // or 'Present'
  responsibilities: string; // Use textarea, newlines for bullets
}

export interface ProjectEntry {
  id: string;
  title: string;
  description: string;
  technologies: string;
  link: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  education: EducationEntry[];
  workExperience: WorkExperienceEntry[];
  hobbies: string;
  projects: ProjectEntry[];
}

export const initialResumeData: ResumeData = {
  personalInfo: {
    name: '',
    title: '',
    email: '',
    phone: '',
    linkedin: '',
    summary: '',
  },
  education: [],
  workExperience: [],
  hobbies: '',
  projects: [],
};
