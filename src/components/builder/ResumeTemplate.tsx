import type { ResumeData } from '@/lib/types';
import React from 'react';

interface ResumeTemplateProps {
  data: ResumeData;
}

// Helper to split string into an array of list items
const renderMultilineText = (text: string | undefined) => {
  if (!text) return null;
  return text.split('\n').map((line, index) => (
    line.trim() ? <li key={index} className="ml-4 list-disc">{line.trim()}</li> : null
  )).filter(Boolean);
};

// Helper to format dates, if needed (simple display for now)
const formatDateRange = (startDate?: string, endDate?: string) => {
  if (!startDate && !endDate) return '';
  const start = startDate || 'N/A';
  const end = endDate || 'N/A';
  return `${start} - ${end}`;
};

export const ResumeTemplate = React.forwardRef<HTMLDivElement, ResumeTemplateProps>(({ data }, ref) => {
  const { personalInfo, education, workExperience, projects, hobbies } = data;

  const hobbiesList = hobbies?.split(/[\n,]+/).map(h => h.trim()).filter(Boolean) || [];

  return (
    <div ref={ref} className="p-8 bg-white text-black font-serif text-sm w-[210mm] min-h-[297mm] shadow-lg print:shadow-none print:w-full print:min-h-full">
      {/* Personal Info Section */}
      <div className="text-center mb-6">
        {personalInfo.name && <h1 className="text-3xl font-bold font-sans">{personalInfo.name}</h1>}
        {personalInfo.title && <p className="text-lg text-gray-700 font-sans">{personalInfo.title}</p>}
        <div className="flex justify-center items-center space-x-4 mt-2 text-xs text-gray-600 font-sans">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>| {personalInfo.phone}</span>}
          {personalInfo.linkedin && <span>| <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{personalInfo.linkedin}</a></span>}
        </div>
      </div>

      {/* Summary Section */}
      {personalInfo.summary && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b-2 border-gray-400 pb-1 mb-2 font-sans">Summary</h2>
          <p className="text-xs leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {/* Work Experience Section */}
      {workExperience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b-2 border-gray-400 pb-1 mb-2 font-sans">Experience</h2>
          {workExperience.map(exp => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="text-xs font-semibold">{exp.jobTitle}</h3>
                <span className="text-xs text-gray-600">{formatDateRange(exp.startDate, exp.endDate)}</span>
              </div>
              <p className="text-xs italic text-gray-700">{exp.company}</p>
              {exp.responsibilities && <ul className="mt-1 text-xs">{renderMultilineText(exp.responsibilities)}</ul>}
            </div>
          ))}
        </div>
      )}

      {/* Education Section */}
      {education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b-2 border-gray-400 pb-1 mb-2 font-sans">Education</h2>
          {education.map(edu => (
            <div key={edu.id} className="mb-3">
               <div className="flex justify-between items-baseline">
                <h3 className="text-xs font-semibold">{edu.degree}</h3>
                <span className="text-xs text-gray-600">{formatDateRange(edu.startDate, edu.endDate)}</span>
              </div>
              <p className="text-xs italic text-gray-700">{edu.institution}</p>
              {edu.details && <p className="text-xs mt-1">{edu.details}</p>}
            </div>
          ))}
        </div>
      )}
      
      {/* Projects Section */}
      {projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b-2 border-gray-400 pb-1 mb-2 font-sans">Projects</h2>
          {projects.map(proj => (
            <div key={proj.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="text-xs font-semibold">{proj.title}</h3>
                {proj.link && <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">Link</a>}
              </div>
              <p className="text-xs mt-1">{proj.description}</p>
              {proj.technologies && <p className="text-xs mt-1"><span className="font-semibold">Technologies:</span> {proj.technologies}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Hobbies Section */}
      {hobbiesList.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase border-b-2 border-gray-400 pb-1 mb-2 font-sans">Hobbies & Interests</h2>
          <p className="text-xs">{hobbiesList.join(', ')}</p>
        </div>
      )}
    </div>
  );
});

ResumeTemplate.displayName = 'ResumeTemplate';
