
"use client";

import React, { useState } from 'react';
import type { ResumeData } from '@/lib/types';
import { initialResumeData } from '@/lib/types';
import { EditorPanel } from '@/components/builder/EditorPanel';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useIsMobile } from '@/hooks/use-mobile'; // Import the hook
import dynamic from 'next/dynamic'; // Import dynamic

// Dynamically import PreviewPanel
const PreviewPanel = dynamic(
  () => import('@/components/builder/PreviewPanel').then(mod => mod.PreviewPanel),
  {
    ssr: false,
    loading: () => (
      <div className="p-6 bg-muted/30 h-full flex flex-col items-center justify-center">
        <p>Loading Preview...</p>
      </div>
    ),
  }
);

export default function BuilderPage() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState<number>(1.0);
  const isMobile = useIsMobile(); // Use the hook

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]"> {/* Adjust height to account for header */}
        <ResizablePanelGroup 
          direction={isMobile ? "vertical" : "horizontal"} 
          className="flex-grow border rounded-lg"
        >
          <ResizablePanel 
            defaultSize={isMobile ? 50 : 45} 
            minSize={isMobile ? 40 : 30} 
            className="min-w-[300px]" // Removed min-h-[400px]
          >
            <div className="h-full overflow-y-auto">
              <EditorPanel 
                resumeData={resumeData} 
                setResumeData={setResumeData}
                fontSizeMultiplier={fontSizeMultiplier}
                onFontSizeMultiplierChange={setFontSizeMultiplier}
              />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel 
            defaultSize={isMobile ? 50 : 55} 
            minSize={isMobile ? 40 : 30} 
            className="min-w-[300px]" // Removed min-h-[400px]
          >
            <div className="h-full overflow-y-auto">
              <PreviewPanel resumeData={resumeData} fontSizeMultiplier={fontSizeMultiplier} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
    </div>
  );
}
