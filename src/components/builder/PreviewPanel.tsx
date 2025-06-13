
"use client";

import type { ResumeData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Download, Eye, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { generatePdfAction } from '@/app/actions/generate-pdf.action';
import { useToast } from '@/hooks/use-toast';

interface PreviewPanelProps {
  resumeData: ResumeData;
}

export function PreviewPanel({ resumeData }: PreviewPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDownloadPdf = async () => {
    setIsLoading(true);
    try {
      const result = await generatePdfAction(resumeData);
      if (result.success && result.pdfBase64) {
        const byteCharacters = atob(result.pdfBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = result.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({
          title: "PDF Generated",
          description: "Your resume PDF has been downloaded.",
        });
      } else {
        throw new Error(result.error || 'Failed to generate PDF.');
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast({
        title: "Error Generating PDF",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-muted/30 h-full flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="font-headline text-2xl font-semibold flex items-center gap-2">
          <Eye className="w-6 h-6 text-primary" />
          Preview & Download
        </h2>
        <Button 
          className="font-headline" 
          onClick={handleDownloadPdf} 
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {isLoading ? 'Generating PDF...' : 'Download PDF'}
        </Button>
      </div>
      <div className="overflow-auto flex-grow w-full h-[calc(100%-4rem)] border rounded-md bg-white flex items-center justify-center text-muted-foreground p-4 text-center">
        <p>
          The PDF preview is no longer live. <br/> 
          Click the "Download PDF" button to generate and view your resume. <br/>
          Server-side rendering with Puppeteer is now used for higher fidelity PDF output.
        </p>
      </div>
    </div>
  );
}
