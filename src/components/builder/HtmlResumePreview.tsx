
"use client";

import type { ResumeData } from '@/lib/types';
import React from 'react';

// Helper to format dates
const formatDateRange = (startDate?: string, endDate?: string) => {
  if (!startDate && !endDate) return '';
  const start = startDate || 'N/A';
  const end = endDate || 'Present';
  return `${start} - ${end}`;
};

const ensureFullUrl = (urlInput: string) => {
  if (!urlInput) return '';
  if (urlInput.startsWith('http://') || urlInput.startsWith('https://')) {
    return urlInput;
  }
  return `https://${urlInput}`;
};

// Base font sizes in points (pt)
const baseHtmlFontSizes = {
  container: 10,
  name: 22,
  title: 13,
  contactInfo: 9,
  sectionTitle: 11,
  paragraph: 9.5,
  itemTitle: 10,
  itemSubTitle: 9,
  itemDates: 9,
  listItem: 9.5,
  detailsText: 9,
  technologies: 9,
  skillsText: 9.5,
  hobbiesText: 9.5,
  projectLink: 9,
};

interface HtmlResumePreviewProps {
  data: ResumeData;
}

export const HtmlResumePreview = React.forwardRef<HTMLDivElement, HtmlResumePreviewProps>(
  ({ data }, ref) => {
  const { personalInfo, education, workExperience, projects, certifications, extraCurricular, skills, hobbies } = data;

  const skillsList = skills?.split(/[\n,]+/).map(s => s.trim()).filter(Boolean) || [];
  const hobbiesList = hobbies?.split(/[\n,]+/).map(h => h.trim()).filter(Boolean) || [];

  const baseFontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'";

  // Calculate font sizes
  const s = (key: keyof typeof baseHtmlFontSizes) => {
    return (baseHtmlFontSizes[key]).toFixed(2); // Keep 2 decimal places for pt
  };

  const styles = `
    .resume-preview-container { font-family: ${baseFontFamily}; font-size: ${s('container')}pt; line-height: 1.35; color: #333; background-color: white; padding: 25px; max-width: 800px; margin: auto; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
    .headerSection { text-align: center; margin-bottom: 15px; }
    .name { font-size: ${s('name')}pt; font-weight: bold; margin-bottom: 1px; }
    .title { font-size: ${s('title')}pt; color: #555; margin-bottom: 4px; }
    .contactInfo { display: flex; justify-content: center; flex-wrap: wrap; font-size: ${s('contactInfo')}pt; color: #444; margin-bottom: 10px; }
    .contactText { margin: 0 4px; }
    .contactLink { color: #007bff; text-decoration: none; }
    .section { margin-bottom: 12px; }
    .sectionTitle { font-size: ${s('sectionTitle')}pt; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 2px; margin-bottom: 6px; }
    .paragraph { font-size: ${s('paragraph')}pt; text-align: justify; white-space: pre-wrap; margin-bottom: 8px; }
    .entry { margin-bottom: 8px; }
    .entryHeader { display: flex; justify-content: space-between; align-items: baseline; }
    .itemTitle { font-size: ${s('itemTitle')}pt; font-weight: bold; }
    .itemSubTitle { font-size: ${s('itemSubTitle')}pt; font-style: italic; color: #555; margin-bottom: 1px; }
    .itemDates { font-size: ${s('itemDates')}pt; color: #555; white-space: nowrap; }
    .list { margin: 0; padding-left: 18px; }
    .listItem { font-size: ${s('listItem')}pt; margin-bottom: 1px; }
    .detailsText { font-size: ${s('detailsText')}pt; margin-top: 1px; white-space: pre-wrap; }
    .technologies { font-size: ${s('technologies')}pt; margin-top: 1px; }
    .skillsText { font-size: ${s('skillsText')}pt; }
    .hobbiesText { font-size: ${s('hobbiesText')}pt; }
    a { color: #007bff; text-decoration: none; }
    .projectLinkStyle { font-size: ${s('projectLink')}pt; }
  `;

  return (
    // The ref is attached to this root div, which is then captured by html2canvas
    <div ref={ref}>
      <style>{styles}</style>
      <div className="resume-preview-container">
        {(personalInfo.name || personalInfo.title || personalInfo.email || personalInfo.phone || personalInfo.linkedin || personalInfo.github || personalInfo.portfolioUrl) && (
          <div className="headerSection">
            {personalInfo.name && <div className="name">{personalInfo.name}</div>}
            {personalInfo.title && <div className="title">{personalInfo.title}</div>}
            <div className="contactInfo">
              {personalInfo.email && <span className="contactText">{personalInfo.email}</span>}
              {personalInfo.phone && <span className="contactText">| {personalInfo.phone}</span>}
              {personalInfo.linkedin && (
                <span className="contactText">
                  | <a href={ensureFullUrl(personalInfo.linkedin)} className="contactLink" target="_blank" rel="noopener noreferrer">{personalInfo.linkedin}</a>
                </span>
              )}
              {personalInfo.github && (
                <span className="contactText">
                  | <a href={`https://github.com/${personalInfo.github}`} className="contactLink" target="_blank" rel="noopener noreferrer">github.com/{personalInfo.github}</a>
                </span>
              )}
              {personalInfo.portfolioUrl && (
                <span className="contactText">
                  | <a href={ensureFullUrl(personalInfo.portfolioUrl)} className="contactLink" target="_blank" rel="noopener noreferrer">{personalInfo.portfolioUrl}</a>
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
                    {exp.responsibilities.split('\n').map(line => line.trim()).filter(line => line).map((line, idx) => (
                      <li key={idx} className="listItem">{line}</li>
                    ))}
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

        {skillsList.length > 0 && (
          <div className="section">
            <div className="sectionTitle">Skills</div>
            <div className="skillsText">{skillsList.join('  •  ')}</div>
          </div>
        )}
        
        {projects && projects.length > 0 && (
          <div className="section">
            <div className="sectionTitle">Projects</div>
            {projects.map(proj => (
              <div key={proj.id} className="entry">
                <div className="entryHeader">
                  <span className="itemTitle">{proj.title}</span>
                  {proj.link && <a href={ensureFullUrl(proj.link)} className="projectLinkStyle" target="_blank" rel="noopener noreferrer">Link</a>}
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
                    {cert.credentialUrl && <a href={ensureFullUrl(cert.credentialUrl)} target="_blank" rel="noopener noreferrer">Verify</a>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {extraCurricular && extraCurricular.length > 0 && (
          <div className="section">
            <div className="sectionTitle">Extra-Curricular Activities</div>
            {extraCurricular.map(activity => (
              <div key={activity.id} className="entry">
                <div className="entryHeader">
                  <span className="itemTitle">{activity.activity}</span>
                  <span className="itemDates">{formatDateRange(activity.startDate, activity.endDate)}</span>
                </div>
                <div className="itemSubTitle">{activity.organization}</div>
                {activity.description && (
                  <ul className="list">
                    {activity.description.split('\n').map(line => line.trim()).filter(line => line).map((line, idx) => (
                      <li key={idx} className="listItem">{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {hobbiesList.length > 0 && (
          <div className="section">
            <div className="sectionTitle">Hobbies & Interests</div>
            <div className="hobbiesText">{hobbiesList.join('  •  ')}</div>
          </div>
        )}
      </div>
    </div>
  );
});
HtmlResumePreview.displayName = 'HtmlResumePreview';
