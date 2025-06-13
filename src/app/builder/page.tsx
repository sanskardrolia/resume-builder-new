"use client";

import React, { useState } from 'react';
import type { ResumeData } from '@/lib/types';
import { initialResumeData } from '@/lib/types';
import { EditorPanel } from '@/components/builder/EditorPanel';
import { PreviewPanel } from '@/components/builder/PreviewPanel';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export default function BuilderPage() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]"> {/* Adjust height to account for header */}
        <ResizablePanelGroup direction="horizontal" className="flex-grow border rounded-lg">
          <ResizablePanel defaultSize={45} minSize={30} className="min-w-[300px]">
            <div className="h-full overflow-y-auto">
              <EditorPanel resumeData={resumeData} setResumeData={setResumeData} />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={55} minSize={30} className="min-w-[400px]">
            <div className="h-full overflow-y-auto">
              <PreviewPanel resumeData={resumeData} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
    </div>
  );
}
