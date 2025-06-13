
import type { ResumeData } from '@/lib/types';
import React from 'react';

interface ResumeHtmlTemplateProps {
  data: ResumeData;
}

// Helper to format dates
const formatDateRange = (startDate?: string, endDate?: string) => {
  if (!startDate && !endDate) return '';
  const start = startDate || 'N/A';
  const end = endDate || 'Present';
  return `${start} - ${end}`;
};

export function ResumeHtmlTemplate({ data }: ResumeHtmlTemplateProps) {
  const { personalInfo, education, workExperience, projects, certifications, hobbies } = data;

  const hobbiesList = hobbies?.split(/[\n,]+/).map(h => h.trim()).filter(Boolean) || [];

  // Basic styling for the HTML. Puppeteer will use this.
  // Using a very common font stack as a base, then applying user's choice.
  const baseFontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'";
  const selectedFontFamily = personalInfo.fontFamily || baseFontFamily;

  const styles = `
    body { font-family: ${selectedFontFamily}; font-size: 10pt; line-height: 1.4; color: #333; margin: 0; padding: 0; }
    .page { padding: 30px; max-width: 800px; margin: auto; }
    .headerSection { text-align: center; margin-bottom: 20px; }
    .name { font-size: 24pt; font-weight: bold; margin-bottom: 2px; }
    .title { font-size: 14pt; color: #555; margin-bottom: 5px; }
    .contactInfo { display: flex; justify-content: center; flex-wrap: wrap; font-size: 9pt; color: #444; }
    .contactText { margin: 0 5px; }
    .contactLink { color: #007bff; text-decoration: none; }
    .section { margin-bottom: 15px; }
    .sectionTitle { font-size: 12pt; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin-bottom: 8px; }
    .paragraph { font-size: 10pt; text-align: justify; }
    .entry { margin-bottom: 10px; }
    .entryHeader { display: flex; justify-content: space-between; align-items: baseline; }
    .itemTitle { font-size: 10pt; font-weight: bold; }
    .itemSubTitle { font-size: 9pt; font-style: italic; color: #555; margin-bottom: 2px; }
    .itemDates { font-size: 9pt; color: #555; white-space: nowrap; }
    .list { margin: 0; padding-left: 20px; }
    .listItem { font-size: 10pt; margin-bottom: 2px; }
    .detailsText { font-size: 9pt; margin-top: 2px; }
    .technologies { font-size: 9pt; margin-top: 2px; }
    .hobbiesText { font-size: 10pt; }
    a { color: #007bff; text-decoration: none; }
  `;

  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <title>{`${personalInfo.name || 'Resume'} - ResuMatic`}</title>
        <style dangerouslySetInnerHTML={{ __html: styles }} />
      </head>
      <body>
        <div className="page">
          {(personalInfo.name || personalInfo.title || personalInfo.email || personalInfo.phone || personalInfo.linkedin) && (
            <div className="headerSection">
              {personalInfo.name && <div className="name">{personalInfo.name}</div>}
              {personalInfo.title && <div className="title">{personalInfo.title}</div>}
              <div className="contactInfo">
                {personalInfo.email && <span className="contactText">{personalInfo.email}</span>}
                {personalInfo.phone && <span className="contactText">| {personalInfo.phone}</span>}
                {personalInfo.linkedin && (
                  <span className="contactText">
                    | <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} className="contactLink" target="_blank" rel="noopener noreferrer">{personalInfo.linkedin}</a>
                  </span>
                )}
              </div>
            </div>
          )}

          {personalInfo.summary && (
            <div className="section">
              <div className="sectionTitle">Summary</div>
              <div className="paragraph">{personalInfo.summary}</div>
            </div>
          )}

          {workExperience && workExperience.length > 0 && (
            <div className="section">
              <div className="sectionTitle">Experience</div>
              {workExperience.map(exp => (
                <div key={exp.id} className="entry">
                  <div className="entryHeader">
                    <span className="itemTitle">{exp.jobTitle}</span>
                    <span className="itemDates">{formatDateRange(exp.startDate, exp.endDate)}</span>
                  </div>
                  <div className="itemSubTitle">{exp.company}</div>
                  {exp.responsibilities && (
                    <ul className="list">
                      {exp.responsibilities.split('\n').map((line, idx) => (
                        line.trim() ? <li key={idx} className="listItem">{line.trim()}</li> : null
                      )).filter(Boolean)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {education && education.length > 0 && (
            <div className="section">
              <div className="sectionTitle">Education</div>
              {education.map(edu => (
                <div key={edu.id} className="entry">
                   <div className="entryHeader">
                    <span className="itemTitle">{edu.degree}</span>
                    <span className="itemDates">{formatDateRange(edu.startDate, edu.endDate)}</span>
                  </div>
                  <div className="itemSubTitle">{edu.institution}</div>
                  {edu.details && <div className="detailsText">{edu.details}</div>}
                </div>
              ))}
            </div>
          )}
          
          {projects && projects.length > 0 && (
            <div className="section">
              <div className="sectionTitle">Projects</div>
              {projects.map(proj => (
                <div key={proj.id} className="entry">
                  <div className="entryHeader">
                    <span className="itemTitle">{proj.title}</span>
                    {proj.link && <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} style={{fontSize: '9pt'}} target="_blank" rel="noopener noreferrer">Link</a>}
                  </div>
                  <div className="detailsText">{proj.description}</div>
                  {proj.technologies && <div className="technologies"><strong>Technologies:</strong> {proj.technologies}</div>}
                </div>
              ))}
            </div>
          )}

          {certifications && certifications.length > 0 && (
            <div className="section">
              <div className="sectionTitle">Certifications</div>
              {certifications.map(cert => (
                <div key={cert.id} className="entry">
                  <div className="entryHeader">
                    <span className="itemTitle">{cert.name}</span>
                    {cert.dateEarned && <span className="itemDates">{cert.dateEarned}</span>}
                  </div>
                  <div className="itemSubTitle">{cert.issuingOrganization}</div>
                  {(cert.credentialId || cert.credentialUrl) && (
                    <div className="detailsText">
                      {cert.credentialId && <span>ID: {cert.credentialId}</span>}
                      {cert.credentialId && cert.credentialUrl && <span> | </span>}
                      {cert.credentialUrl && <a href={cert.credentialUrl.startsWith('http') ? cert.credentialUrl : `https://${cert.credentialUrl}`} target="_blank" rel="noopener noreferrer">Verify</a>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {hobbiesList.length > 0 && (
            <div className="section">
              <div className="sectionTitle">Hobbies & Interests</div>
              <div className="hobbiesText">{hobbiesList.join(', ')}</div>
            </div>
          )}
        </div>
      </body>
    </html>
  );
}
