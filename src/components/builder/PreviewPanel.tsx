
"use client";

import type { ResumeData } from '@/lib/types';
import { ResumeTemplate } from './ResumeTemplate';
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';
import { PDFViewer, PDFDownloadLink, Font } from '@react-pdf/renderer';
import React from 'react';

interface PreviewPanelProps {
  resumeData: ResumeData;
}

export function PreviewPanel({ resumeData }: PreviewPanelProps) {
  const [client, setClient] = React.useState(false);

  React.useEffect(() => {
    setClient(true);
    // Note: Font registration could be done globally if preferred
    // For simplicity, keeping it here, but @react-pdf/renderer recommends registering fonts once.
    // However, since font might change based on resumeData, re-evaluating font here might be okay,
    // or better, map to a fixed set of pre-registered fonts if dynamic registration is complex.
    // For standard fonts like Helvetica and Times-Roman, explicit registration isn't usually needed.
  }, []);


  return (
    <div className="p-6 bg-muted/30 h-full flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="font-headline text-2xl font-semibold flex items-center gap-2">
          <Eye className="w-6 h-6 text-primary" />
          Preview
        </h2>
        {client && (
          <PDFDownloadLink
            document={<ResumeTemplate data={resumeData} />}
            fileName={`${resumeData.personalInfo.name || 'Resume'}-ResuMatic.pdf`}
          >
            {({ loading, error }) => (
              <Button className="font-headline" disabled={loading}>
                <Download className="w-4 h-4 mr-2" />
                {loading ? 'Generating PDF...' : 'Download PDF'}
              </Button>
            )}
          </PDFDownloadLink>
        )}
      </div>
      <div className="overflow-auto flex-grow w-full h-[calc(100%-4rem)] border rounded-md bg-white">
        {client ? (
          <PDFViewer width="100%" height="100%" showToolbar={true} className="border-none">
            <ResumeTemplate data={resumeData} />
          </PDFViewer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Loading Preview...</p>
          </div>
        )}
      </div>
    </div>
  );
}
