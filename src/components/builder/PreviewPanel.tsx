"use client";

import type { ResumeData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Download, Eye, Loader2 } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { HtmlResumePreview } from './HtmlResumePreview';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PreviewPanelProps {
  resumeData: ResumeData;
  fontSizeMultiplier: number;
}

export function PreviewPanel({ resumeData, fontSizeMultiplier }: PreviewPanelProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    const element = previewRef.current;
    if (!element) {
      toast({
        title: 'Error generating PDF',
        description: 'Preview component is not available.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsGenerating(true);

    try {
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Using 'pt' (points) as units, which is common for PDF measurements. A4 is 595.28 x 841.89 pts.
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      // Calculate the aspect ratio to fit the image to the PDF's width
      const ratio = canvasWidth / pdfWidth;
      const calculatedHeight = canvasHeight / ratio;
      
      // Handle multi-page PDFs
      let heightLeft = calculatedHeight;
      let position = 0;

      // Add the first page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, calculatedHeight);
      heightLeft -= pdfHeight;

      // Add more pages if the content is taller than one page
      while (heightLeft > 0) {
        position = -pdfHeight * (Math.ceil(calculatedHeight / pdfHeight) - Math.ceil(heightLeft / pdfHeight));
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, calculatedHeight);
        heightLeft -= pdfHeight;
      }
      
      const fileName = `${(resumeData.personalInfo?.name || 'Resume').replace(/\s+/g, '_')}-ResuMatic.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Error generating PDF',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 bg-muted/30 h-full flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="font-headline text-2xl font-semibold flex items-center gap-2">
          <Eye className="w-6 h-6 text-primary" />
          Resume Preview
        </h2>
        
        <Button className="font-headline" onClick={handleDownloadPdf} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </>
          )}
        </Button>

      </div>
      <div
        className="overflow-auto flex-grow w-full h-[calc(100%-6rem)] border rounded-md bg-white p-2 shadow-inner"
      >
        <div className="w-full">
          <HtmlResumePreview ref={previewRef} data={resumeData} fontSizeMultiplier={fontSizeMultiplier} />
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Note: The downloaded PDF is a high-quality image of the preview above. 
        What you see is what you get. Font size changes will apply.
      </p>
    </div>
  );
}
