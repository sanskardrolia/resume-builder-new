"use client";

import type { ResumeData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Download, Eye, Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { HtmlResumePreview } from './HtmlResumePreview';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ResumeDocument } from './ResumeDocument'; // The new component

interface PreviewPanelProps {
  resumeData: ResumeData;
  fontSizeMultiplier: number;
}

export function PreviewPanel({ resumeData, fontSizeMultiplier }: PreviewPanelProps) {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  // @react-pdf/renderer is client-side only
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="p-6 bg-muted/30 h-full flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="font-headline text-2xl font-semibold flex items-center gap-2">
          <Eye className="w-6 h-6 text-primary" />
          Resume Preview
        </h2>
        {isClient ? (
          <PDFDownloadLink
            document={<ResumeDocument data={resumeData} fontSizeMultiplier={fontSizeMultiplier} />}
            fileName={`${(resumeData.personalInfo.name || 'Resume').replace(/\s+/g, '_')}-ResuMatic.pdf`}
          >
            {({ blob, url, loading, error }) => {
              if (error) {
                toast({
                  title: 'Error generating PDF',
                  description: 'There was an error creating your PDF. Please try again.',
                  variant: 'destructive',
                });
                console.error("react-pdf error:", error);
              }

              return (
                <Button className="font-headline" disabled={loading}>
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  {loading ? 'Generating PDF...' : 'Download PDF'}
                </Button>
              );
            }}
          </PDFDownloadLink>
        ) : (
          <Button className="font-headline" disabled={true}>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Loading...
          </Button>
        )}
      </div>
      <div
        className="overflow-auto flex-grow w-full h-[calc(100%-6rem)] border rounded-md bg-white p-2 shadow-inner"
      >
        <div className="w-full">
           {isClient ? <HtmlResumePreview data={resumeData} fontSizeMultiplier={fontSizeMultiplier} /> : <p>Loading preview...</p>}
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Note: The PDF is generated using Poppins and PT Sans fonts. 
        The HTML preview above may differ slightly from the PDF. Font size changes will apply to both.
      </p>
    </div>
  );
}
