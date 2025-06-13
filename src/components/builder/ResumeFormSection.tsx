"use client";

import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ResumeFormSectionProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export function ResumeFormSection({ title, icon: Icon, children }: ResumeFormSectionProps) {
  return (
    <Card className="w-full matte-glass shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-headline text-xl">
          <Icon className="w-6 h-6 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
