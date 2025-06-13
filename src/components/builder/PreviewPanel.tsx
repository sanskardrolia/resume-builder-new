"use client";

import type { ResumeData } from '@/lib/types';
import { ResumeTemplate } from './ResumeTemplate';
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import React from 'react';

interface PreviewPanelProps {
  resumeData: ResumeData;
}

export function PreviewPanel({ resumeData }: PreviewPanelProps) {
  const componentRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${resumeData.personalInfo.name || 'Resume'}-ResuMatic`,
    onPrintError: (error) => console.error("Error printing resume:", error),
  });

  return (
    <div className="p-6 bg-muted/30 h-full flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="font-headline text-2xl font-semibold flex items-center gap-2">
          <Eye className="w-6 h-6 text-primary" />
          Preview
        </h2>
        <Button onClick={handlePrint} className="font-headline">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>
      <div className="overflow-auto flex-grow w-full flex justify-center py-4">
        <div className="transform scale-[0.85] origin-top"> {/* Scale down for better fit in preview area */}
           <ResumeTemplate ref={componentRef} data={resumeData} />
        </div>
      </div>
       <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-area, .printable-area * {
            visibility: visible;
          }
          .printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            margin: 0;
            padding: 0;
            transform: scale(1) !important; 
          }
        }
      `}</style>
    </div>
  );
}
