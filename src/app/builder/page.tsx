
"use client";

import React, { useState } from 'react';
import type { ResumeData } from '@/lib/types';
import { initialResumeData } from '@/lib/types';
import { EditorPanel } from '@/components/builder/EditorPanel';
import { PreviewPanel } from '@/components/builder/PreviewPanel';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useIsMobile } from '@/hooks/use-mobile'; // Import the hook

export default function BuilderPage() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
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
            className="min-w-[300px] min-h-[400px]" // Added min-h for vertical
          >
            <div className="h-full overflow-y-auto">
              <EditorPanel resumeData={resumeData} setResumeData={setResumeData} />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel 
            defaultSize={isMobile ? 50 : 55} 
            minSize={isMobile ? 40 : 30} 
            className="min-w-[300px] min-h-[400px]" // Changed min-w for consistency and added min-h
          >
            <div className="h-full overflow-y-auto">
              <PreviewPanel resumeData={resumeData} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
    </div>
  );
}
