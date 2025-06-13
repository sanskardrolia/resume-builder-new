
import type { ResumeData } from '@/lib/types';
import React from 'react';
import { cn } from '@/lib/utils'; // For cn utility

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

// Helper to format dates
const formatDateRange = (startDate?: string, endDate?: string) => {
  if (!startDate && !endDate) return '';
  const start = startDate || 'N/A';
  const end = endDate || 'N/A';
  return `${start} - ${end}`;
};

export const ResumeTemplate = React.forwardRef<HTMLDivElement, ResumeTemplateProps>(({ data }, ref) => {
  const { personalInfo, education, workExperience, projects, certifications, hobbies } = data;

  const hobbiesList = hobbies?.split(/[\n,]+/).map(h => h.trim()).filter(Boolean) || [];

  const resumeStyle = {
    fontFamily: personalInfo.fontFamily || 'Arial, sans-serif',
  };

  return (
    <div 
      ref={ref} 
      className={cn(
        "p-8 bg-white text-black text-sm w-[210mm] min-h-[297mm] shadow-lg print:shadow-none print:w-full print:min-h-full"
      )}
      style={resumeStyle} // Apply dynamic font family
    >
      {/* Personal Info Section */}
      { (personalInfo.name || personalInfo.title || personalInfo.email || personalInfo.phone || personalInfo.linkedin) && (
        <div className="text-center mb-6">
          {personalInfo.name && <h1 className="text-3xl font-bold" style={resumeStyle}>{personalInfo.name}</h1>}
          {personalInfo.title && <p className="text-lg text-gray-700" style={resumeStyle}>{personalInfo.title}</p>}
          <div className="flex flex-wrap justify-center items-center space-x-2 md:space-x-4 mt-2 text-xs text-gray-600" style={resumeStyle}>
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <> <span className="hidden md:inline">|</span> <span>{personalInfo.phone}</span> </>}
            {personalInfo.linkedin && <> <span className="hidden md:inline">|</span> <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{personalInfo.linkedin}</a> </>}
          </div>
        </div>
      )}

      {/* Summary Section */}
      {personalInfo.summary && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b-2 border-gray-400 pb-1 mb-2" style={resumeStyle}>Summary</h2>
          <p className="text-xs leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {/* Work Experience Section */}
      {workExperience && workExperience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b-2 border-gray-400 pb-1 mb-2" style={resumeStyle}>Experience</h2>
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
      {education && education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b-2 border-gray-400 pb-1 mb-2" style={resumeStyle}>Education</h2>
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
      {projects && projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b-2 border-gray-400 pb-1 mb-2" style={resumeStyle}>Projects</h2>
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

      {/* Certifications Section */}
      {certifications && certifications.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b-2 border-gray-400 pb-1 mb-2" style={resumeStyle}>Certifications</h2>
          {certifications.map(cert => (
            <div key={cert.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="text-xs font-semibold">{cert.name}</h3>
                {cert.dateEarned && <span className="text-xs text-gray-600">{cert.dateEarned}</span>}
              </div>
              <p className="text-xs italic text-gray-700">{cert.issuingOrganization}</p>
              {(cert.credentialId || cert.credentialUrl) && (
                <p className="text-xs mt-1">
                  {cert.credentialId && <span>ID: {cert.credentialId}</span>}
                  {cert.credentialId && cert.credentialUrl && <span> | </span>}
                  {cert.credentialUrl && <a href={cert.credentialUrl.startsWith('http') ? cert.credentialUrl : `https://${cert.credentialUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Verify</a>}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Hobbies Section */}
      {hobbiesList.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase border-b-2 border-gray-400 pb-1 mb-2" style={resumeStyle}>Hobbies & Interests</h2>
          <p className="text-xs">{hobbiesList.join(', ')}</p>
        </div>
      )}
    </div>
  );
});

ResumeTemplate.displayName = 'ResumeTemplate';
