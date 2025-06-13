
"use client";

import type { ResumeData } from '@/lib/types';
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Link } from '@react-pdf/renderer';

interface ResumeTemplateProps {
  data: ResumeData;
}

const mapFontFamily = (fontFamily: string | undefined) => {
  if (!fontFamily) return 'Helvetica';
  if (fontFamily.toLowerCase().includes('arial')) return 'Helvetica';
  if (fontFamily.toLowerCase().includes('times new roman')) return 'Times-Roman';
  if (fontFamily.toLowerCase().includes('cambria')) return 'Times-Roman';
  if (fontFamily.toLowerCase().includes('garamond')) return 'Times-Roman';
  if (fontFamily.toLowerCase().includes('verdana')) return 'Helvetica';
  if (fontFamily.toLowerCase().includes('georgia')) return 'Times-Roman';
  return 'Helvetica'; // Default
};

// Helper to format dates
const formatDateRange = (startDate?: string, endDate?: string) => {
  if (!startDate && !endDate) return '';
  const start = startDate || 'N/A';
  const end = endDate || 'Present'; // Default to Present if endDate is missing
  return `${start} - ${end}`;
};

export function ResumeTemplate({ data }: ResumeTemplateProps) {
  const { personalInfo, education, workExperience, projects, certifications, hobbies } = data;
  const selectedFont = mapFontFamily(personalInfo.fontFamily);

  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontFamily: selectedFont,
      fontSize: 10,
      lineHeight: 1.4,
      color: '#333',
    },
    headerSection: {
      textAlign: 'center',
      marginBottom: 20,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      fontFamily: selectedFont, // Ensure name uses selected font
      marginBottom: 2,
    },
    title: {
      fontSize: 14,
      color: '#555',
      fontFamily: selectedFont,
      marginBottom: 5,
    },
    contactInfo: {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      fontSize: 9,
      color: '#444',
    },
    contactText: {
      marginHorizontal: 5,
    },
    link: {
      color: '#007bff',
      textDecoration: 'none',
    },
    section: {
      marginBottom: 15,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      paddingBottom: 3,
      marginBottom: 8,
      fontFamily: selectedFont,
    },
    paragraph: {
      fontSize: 10,
      textAlign: 'justify',
    },
    entry: {
      marginBottom: 10,
    },
    entryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
    },
    itemTitle: {
      fontSize: 10,
      fontWeight: 'bold',
    },
    itemSubTitle: {
      fontSize: 9,
      fontStyle: 'italic',
      color: '#555',
      marginBottom: 2,
    },
    itemDates: {
      fontSize: 9,
      color: '#555',
    },
    listItem: {
      marginLeft: 10,
      fontSize: 10,
      marginBottom: 2,
    },
    detailsText: {
      fontSize: 9,
      marginTop: 2,
    },
    technologies: {
      fontSize: 9,
      marginTop: 2,
    },
    hobbiesText: {
      fontSize: 10,
    },
  });

  const hobbiesList = hobbies?.split(/[\n,]+/).map(h => h.trim()).filter(Boolean) || [];

  return (
    <Document title={`${personalInfo.name || 'Resume'} - ResuMatic`}>
      <Page size="A4" style={styles.page}>
        { (personalInfo.name || personalInfo.title || personalInfo.email || personalInfo.phone || personalInfo.linkedin) && (
          <View style={styles.headerSection}>
            {personalInfo.name && <Text style={styles.name}>{personalInfo.name}</Text>}
            {personalInfo.title && <Text style={styles.title}>{personalInfo.title}</Text>}
            <View style={styles.contactInfo}>
              {personalInfo.email && <Text style={styles.contactText}>{personalInfo.email}</Text>}
              {personalInfo.phone && <Text style={styles.contactText}>| {personalInfo.phone}</Text>}
              {personalInfo.linkedin && (
                <Text style={styles.contactText}>
                  | <Link src={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} style={styles.link}>{personalInfo.linkedin}</Link>
                </Text>
              )}
            </View>
          </View>
        )}

        {personalInfo.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.paragraph}>{personalInfo.summary}</Text>
          </View>
        )}

        {workExperience && workExperience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {workExperience.map(exp => (
              <View key={exp.id} style={styles.entry}>
                <View style={styles.entryHeader}>
                  <Text style={styles.itemTitle}>{exp.jobTitle}</Text>
                  <Text style={styles.itemDates}>{formatDateRange(exp.startDate, exp.endDate)}</Text>
                </View>
                <Text style={styles.itemSubTitle}>{exp.company}</Text>
                {exp.responsibilities && exp.responsibilities.split('\n').map((line, idx) => (
                  line.trim() ? <Text key={idx} style={styles.listItem}>• {line.trim()}</Text> : null
                )).filter(Boolean)}
              </View>
            ))}
          </View>
        )}

        {education && education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map(edu => (
              <View key={edu.id} style={styles.entry}>
                 <View style={styles.entryHeader}>
                  <Text style={styles.itemTitle}>{edu.degree}</Text>
                  <Text style={styles.itemDates}>{formatDateRange(edu.startDate, edu.endDate)}</Text>
                </View>
                <Text style={styles.itemSubTitle}>{edu.institution}</Text>
                {edu.details && <Text style={styles.detailsText}>{edu.details}</Text>}
              </View>
            ))}
          </View>
        )}
        
        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map(proj => (
              <View key={proj.id} style={styles.entry}>
                <View style={styles.entryHeader}>
                  <Text style={styles.itemTitle}>{proj.title}</Text>
                  {proj.link && <Link src={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} style={{...styles.link, fontSize: 9}}>Link</Link>}
                </View>
                <Text style={styles.detailsText}>{proj.description}</Text>
                {proj.technologies && <Text style={styles.technologies}><Text style={{fontWeight: 'bold'}}>Technologies:</Text> {proj.technologies}</Text>}
              </View>
            ))}
          </View>
        )}

        {certifications && certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certifications.map(cert => (
              <View key={cert.id} style={styles.entry}>
                <View style={styles.entryHeader}>
                  <Text style={styles.itemTitle}>{cert.name}</Text>
                  {cert.dateEarned && <Text style={styles.itemDates}>{cert.dateEarned}</Text>}
                </View>
                <Text style={styles.itemSubTitle}>{cert.issuingOrganization}</Text>
                {(cert.credentialId || cert.credentialUrl) && (
                  <Text style={styles.detailsText}>
                    {cert.credentialId && <Text>ID: {cert.credentialId}</Text>}
                    {cert.credentialId && cert.credentialUrl && <Text> | </Text>}
                    {cert.credentialUrl && <Link src={cert.credentialUrl.startsWith('http') ? cert.credentialUrl : `https://${cert.credentialUrl}`} style={styles.link}>Verify</Link>}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {hobbiesList.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hobbies & Interests</Text>
            <Text style={styles.hobbiesText}>{hobbiesList.join(', ')}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
