
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Linkedin, Instagram } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ShareDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

export function ShareDialog({ isOpen, onOpenChange }: ShareDialogProps) {
  const { toast } = useToast();

  const shareUrl = "https://fresher-resume.vercel.app/builder";
  const shareMessages = {
    whatsapp: `Hey! I just built my resume using MakeItResume, a fantastic tool for creating professional resumes. You should check it out: ${shareUrl}`,
    linkedinTitle: "MakeItResume: The AI-Powered Resume Builder",
    linkedinSummary: `I just created my resume with MakeItResume and it was a breeze! It's a great tool for crafting professional, ATS-friendly resumes. Highly recommended for anyone on the job hunt. #ResumeBuilder #JobSearch #Career`,
    instagram: `Check out MakeItResume for building a great resume! ${shareUrl}`
  };

  const handleCopyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareMessages.instagram).then(() => {
        toast({
          title: "Copied to Clipboard!",
          description: "You can now paste the link in your Instagram story.",
        });
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share MakeItResume</DialogTitle>
          <DialogDescription>
            Enjoying MakeItResume? Spread the word and help your connections!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-center pt-4">
            <div className="flex justify-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild variant="outline" size="icon">
                      <a 
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessages.whatsapp)}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="Share on WhatsApp"
                      >
                        <WhatsAppIcon />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Share on WhatsApp</p></TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild variant="outline" size="icon">
                      <a 
                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareMessages.linkedinTitle)}&summary=${encodeURIComponent(shareMessages.linkedinSummary)}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="Share on LinkedIn"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Share on LinkedIn</p></TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={handleCopyToClipboard} aria-label="Copy Instagram share text">
                        <Instagram className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Copy link for Instagram</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
