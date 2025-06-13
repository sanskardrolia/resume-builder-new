
"use client";

import type { ResumeData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Download, Eye, Loader2 } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { HtmlResumePreview } from './HtmlResumePreview'; // New component for HTML preview

interface PreviewPanelProps {
  resumeData: ResumeData;
}

export function PreviewPanel({ resumeData }: PreviewPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    if (!printRef.current) {
      toast({
        title: "Error Generating PDF",
        description: "Preview content not found.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // Increase scale for better resolution
        useCORS: true, // If you have external images
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate dimensions for PDF
      // A4 dimensions: 210mm x 297mm. jsPDF uses points (1pt = 1/72 inch, 1 inch = 25.4mm)
      // A4 width in points: 210 / 25.4 * 72 = 595.27
      // A4 height in points: 297 / 25.4 * 72 = 841.89
      const pdfWidth = 595.27; 
      const pdfHeight = 841.89;

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const effectiveImgWidth = imgWidth * ratio;
      const effectiveImgHeight = imgHeight * ratio;

      // Center the image on the PDF page (optional)
      const xOffset = (pdfWidth - effectiveImgWidth) / 2;
      const yOffset = (pdfHeight - effectiveImgHeight) / 2;
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });
      
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, effectiveImgWidth, effectiveImgHeight);
      
      const fileName = `${resumeData.personalInfo.name || 'Resume'}-ResuMatic.pdf`;
      pdf.save(fileName);

      toast({
        title: "PDF Generated",
        description: "Your resume PDF has been downloaded.",
      });

    } catch (error) {
      console.error("Error generating PDF with html2canvas/jsPDF:", error);
      toast({
        title: "Error Generating PDF",
        description: error instanceof Error ? error.message : "An unknown error occurred while generating the PDF.",
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
      <div 
        className="overflow-auto flex-grow w-full h-[calc(100%-4rem)] border rounded-md bg-white p-2"
        // Ensure this container has a defined size for html2canvas
      >
        <div ref={printRef} className="w-full"> {/* This inner div will be captured */}
          <HtmlResumePreview data={resumeData} />
        </div>
      </div>
    </div>
  );
}
