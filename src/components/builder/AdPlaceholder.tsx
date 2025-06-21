"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function AdPlaceholder() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <Card className="relative w-full overflow-hidden matte-glass shadow-lg border-primary/20">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1 right-1 h-6 w-6 z-10"
        onClick={(e) => {
          e.preventDefault(); // Prevent link navigation when closing
          setIsVisible(false);
        }}
        aria-label="Close advertisement"
      >
        <X className="h-4 w-4" />
      </Button>
      <Link href="https://www.linkedin.com/in/sanskardrolia/" target="_blank" rel="noopener noreferrer" className="block hover:bg-card/70 transition-colors">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="flex-1">
            <h3 className="font-headline font-semibold text-base">Advertise on ResuMatic</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Reach thousands of professionals and job seekers.
            </p>
          </div>
          <div className="relative h-16 w-16 flex-shrink-0">
             <Image
              src="https://ik.imagekit.io/eklbxmf2z/Resumatic%20Ad.png?updatedAt=1750505173253"
              alt="Advertisement placeholder"
              fill
              className="rounded-md object-cover"
              data-ai-hint="marketing product"
            />
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
