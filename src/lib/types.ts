
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

export const sampleResumeData: ResumeData = {
  personalInfo: {
    name: 'John B. Sample',
    title: 'Experienced Web Developer',
    email: 'john.sample@example.com',
    phone: '(555) 123-4567',
    linkedin: 'linkedin.com/in/johnbsample',
    summary: "Highly skilled and creative Web Developer with 5+ years of experience in designing, developing, and launching responsive websites and web applications. Proficient in a wide range of modern technologies and frameworks. Passionate about creating intuitive user experiences and efficient back-end solutions.",
  },
  education: [
    {
      id: 'edu_sample_1',
      institution: 'State University of Technology',
      degree: 'M.S. in Computer Science',
      startDate: 'Sep 2016',
      endDate: 'May 2018',
      details: "Thesis on 'Advanced AI Algorithms for Web Personalization'. GPA: 3.9/4.0.",
    },
    {
      id: 'edu_sample_2',
      institution: 'City College',
      degree: 'B.S. in Software Engineering',
      startDate: 'Aug 2012',
      endDate: 'May 2016',
      details: 'Graduated Summa Cum Laude. President of the Coding Club.',
    },
  ],
  workExperience: [
    {
      id: 'work_sample_1',
      company: 'Innovatech Solutions Ltd.',
      jobTitle: 'Senior Web Developer',
      startDate: 'Jun 2020',
      endDate: 'Present',
      responsibilities: "Led a team of 5 developers in the creation of a new e-commerce platform, resulting in a 20% increase in sales.\nDeveloped and maintained client-side and server-side applications using React, Node.js, and Express.\nImplemented RESTful APIs and integrated with third-party services.\nMentored junior developers and conducted code reviews.",
    },
    {
      id: 'work_sample_2',
      company: 'WebWorks Agency',
      jobTitle: 'Junior Web Developer',
      startDate: 'Jul 2018',
      endDate: 'May 2020',
      responsibilities: "Contributed to the development of over 15 client websites using HTML, CSS, JavaScript, and WordPress.\nCollaborated with designers to translate mockups into functional web pages.\nAssisted in debugging and resolving technical issues.",
    },
  ],
  projects: [
    {
      id: 'proj_sample_1',
      title: 'Portfolio Website V2',
      description: 'A personal portfolio website showcasing my projects and skills, built with Next.js and Tailwind CSS.',
      technologies: 'Next.js, React, Tailwind CSS, Vercel',
      link: 'github.com/johnbsample/portfolio-v2',
    },
    {
      id: 'proj_sample_2',
      title: 'Task Management App',
      description: 'A full-stack task management application with user authentication and real-time updates.',
      technologies: 'React, Firebase, Node.js, Express',
      link: 'github.com/johnbsample/task-app',
    },
  ],
  hobbies: 'Photography, Hiking, Contributing to open-source projects, Learning new programming languages',
};
