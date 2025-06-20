"use client";

import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Link } from '@react-pdf/renderer';
import type { ResumeData } from '@/lib/types';

// NOTE: Custom font registration has been removed to ensure PDF generation stability.
// The PDF will now use default built-in fonts like Helvetica.

// Helper to format dates
const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate && !endDate) return '';
    const start = startDate || 'N/A';
    const end = endDate || 'Present';
    return `${start} - ${end}`;
};

const ensureFullUrl = (urlInput: string, isGithubUsername: boolean = false) => {
    if (!urlInput) return '';
    if (isGithubUsername) {
        if (urlInput.includes('github.com')) {
            return urlInput.startsWith('http') ? urlInput : `https://${urlInput}`;
        }
        return `https://github.com/${urlInput}`;
    }
    if (urlInput.startsWith('http://') || urlInput.startsWith('https://')) {
        return urlInput;
    }
    return `https://${urlInput}`;
};

interface ResumeDocumentProps {
    data: ResumeData;
    fontSizeMultiplier?: number;
}

export const ResumeDocument = ({ data, fontSizeMultiplier = 1.0 }: ResumeDocumentProps) => {
    const { personalInfo, education, workExperience, projects, certifications, skills, hobbies } = data;
    const skillsList = skills?.split(/[\n,]+/).map(s => s.trim()).filter(Boolean) || [];
    const hobbiesList = hobbies?.split(/[\n,]+/).map(h => h.trim()).filter(Boolean) || [];

    const styles = StyleSheet.create({
        page: {
            fontSize: 10 * fontSizeMultiplier,
            padding: '30pt 40pt',
            color: '#333',
            lineHeight: 1.4,
        },
        // Header
        header: {
            textAlign: 'center',
            marginBottom: 20,
        },
        name: {
            fontSize: 24 * fontSizeMultiplier,
            fontWeight: 'bold', // Using standard 'bold'
            marginBottom: 2,
        },
        title: {
            fontSize: 14 * fontSizeMultiplier,
            color: '#555',
            marginBottom: 8,
        },
        contactInfo: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            fontSize: 9 * fontSizeMultiplier,
            color: '#444',
        },
        contactText: {
            marginHorizontal: 4,
        },
        contactLink: {
            color: '#007bff',
            textDecoration: 'none',
        },
        // Sections
        section: {
            marginBottom: 12,
        },
        sectionTitle: {
            fontSize: 12 * fontSizeMultiplier,
            fontWeight: 'bold', // Using standard 'bold'
            textTransform: 'uppercase',
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
            paddingBottom: 2,
            marginBottom: 8,
        },
        summary: {
            textAlign: 'justify',
        },
        // Entries (Work, Education, etc.)
        entry: {
            marginBottom: 10,
        },
        entryHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'baseline',
        },
        itemTitle: {
            fontSize: 11 * fontSizeMultiplier,
            fontWeight: 'bold',
        },
        itemSubTitle: {
            fontSize: 10 * fontSizeMultiplier,
            fontStyle: 'italic',
            color: '#555',
            marginBottom: 2,
        },
        itemDates: {
            fontSize: 10 * fontSizeMultiplier,
            color: '#555',
        },
        list: {
            marginTop: 4,
        },
        listItem: {
            flexDirection: 'row',
            marginBottom: 2,
        },
        bullet: {
            width: 10,
            fontSize: 10 * fontSizeMultiplier,
        },
        listItemText: {
            flex: 1,
            textAlign: 'justify'
        },
        detailsText: {
            fontSize: 10 * fontSizeMultiplier,
            marginTop: 2,
            whiteSpace: 'pre-wrap',
        },
        technologies: {
            fontSize: 9 * fontSizeMultiplier,
            marginTop: 2,
        },
        skillsText: {
            lineHeight: 1.5,
        },
        hobbiesText: {
            lineHeight: 1.5,
        },
        projectLink: {
             fontSize: 9 * fontSizeMultiplier,
             color: '#007bff',
             textDecoration: 'none',
        },
        certificationDetails: {
            flexDirection: 'row',
        }
    });

    return (
        <Document author={personalInfo.name} title={`Resume - ${personalInfo.name}`}>
            <Page size="A4" style={styles.page}>
                {/* Personal Info */}
                <View style={styles.header}>
                    {personalInfo.name && <Text style={styles.name}>{personalInfo.name}</Text>}
                    {personalInfo.title && <Text style={styles.title}>{personalInfo.title}</Text>}
                    <View style={styles.contactInfo}>
                        {personalInfo.email && <Text style={styles.contactText}>{personalInfo.email}</Text>}
                        {personalInfo.phone && <Text style={styles.contactText}>| {personalInfo.phone}</Text>}
                        {personalInfo.linkedin && (
                            <Text style={styles.contactText}>
                                | <Link src={ensureFullUrl(personalInfo.linkedin)} style={styles.contactLink}>{personalInfo.linkedin}</Link>
                            </Text>
                        )}
                        {personalInfo.github && (
                            <Text style={styles.contactText}>
                                | <Link src={ensureFullUrl(personalInfo.github, true)} style={styles.contactLink}>github.com/{personalInfo.github}</Link>
                            </Text>
                        )}
                        {personalInfo.portfolioUrl && (
                             <Text style={styles.contactText}>
                                | <Link src={ensureFullUrl(personalInfo.portfolioUrl)} style={styles.contactLink}>{personalInfo.portfolioUrl}</Link>
                            </Text>
                        )}
                    </View>
                </View>

                {/* Summary */}
                {personalInfo.summary && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Summary</Text>
                        <Text style={styles.summary}>{personalInfo.summary}</Text>
                    </View>
                )}
                
                {/* Work Experience */}
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
                                {exp.responsibilities && (
                                    <View style={styles.list}>
                                        {exp.responsibilities.split('\n').map(line => line.trim()).filter(line => line).map((line, idx) => (
                                            <View key={idx} style={styles.listItem}>
                                                <Text style={styles.bullet}>•</Text>
                                                <Text style={styles.listItemText}>{line}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {/* Education */}
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

                {/* Skills */}
                {skillsList.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Skills</Text>
                        <Text style={styles.skillsText}>{skillsList.join('  •  ')}</Text>
                    </View>
                )}

                {/* Projects */}
                {projects && projects.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Projects</Text>
                        {projects.map(proj => (
                            <View key={proj.id} style={styles.entry}>
                                <View style={styles.entryHeader}>
                                    <Text style={styles.itemTitle}>{proj.title}</Text>
                                    {proj.link && <Link src={ensureFullUrl(proj.link)} style={styles.projectLink}>Link</Link>}
                                </View>
                                <Text style={styles.detailsText}>{proj.description}</Text>
                                {proj.technologies && <Text style={styles.technologies}>Technologies: {proj.technologies}</Text>}
                            </View>
                        ))}
                    </View>
                )}

                {/* Certifications */}
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
                                    <View style={styles.certificationDetails}>
                                        {cert.credentialId && <Text style={styles.detailsText}>ID: {cert.credentialId}</Text>}
                                        {cert.credentialId && cert.credentialUrl && <Text style={styles.detailsText}> | </Text>}
                                        {cert.credentialUrl && <Link src={ensureFullUrl(cert.credentialUrl)} style={styles.projectLink}>Verify</Link>}
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {/* Hobbies */}
                {hobbiesList.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Hobbies & Interests</Text>
                        <Text style={styles.hobbiesText}>{hobbiesList.join('  •  ')}</Text>
                    </View>
                )}

            </Page>
        </Document>
    );
};
