
"use client";

import type { PersonalInfo } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User } from 'lucide-react'; // Removed Palette
import { ResumeFormSection } from './ResumeFormSection';
// Removed Select imports as font selection is removed

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (field: keyof Omit<PersonalInfo, 'fontFamily'>, value: string) => void; // Adjusted Omit
}

// Removed fontOptions array

export function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  return (
    <ResumeFormSection title="Personal Information" icon={User}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={data.name} onChange={(e) => onChange('name', e.target.value)} placeholder="e.g., Jane Doe" />
          </div>
          <div>
            <Label htmlFor="title">Professional Title</Label>
            <Input id="title" value={data.title} onChange={(e) => onChange('title', e.target.value)} placeholder="e.g., Software Engineer" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={data.email} onChange={(e) => onChange('email', e.target.value)} placeholder="e.g., jane.doe@example.com" />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" value={data.phone} onChange={(e) => onChange('phone', e.target.value)} placeholder="e.g., (123) 456-7890" />
          </div>
        </div>
        <div>
          <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
          <Input id="linkedin" value={data.linkedin} onChange={(e) => onChange('linkedin', e.target.value)} placeholder="e.g., linkedin.com/in/janedoe" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="github">GitHub Username</Label>
            <Input id="github" value={data.github || ''} onChange={(e) => onChange('github', e.target.value)} placeholder="e.g., janedoe" />
          </div>
          <div>
            <Label htmlFor="portfolioUrl">Personal Portfolio URL</Label>
            <Input id="portfolioUrl" value={data.portfolioUrl || ''} onChange={(e) => onChange('portfolioUrl', e.target.value)} placeholder="e.g., https://janedoe.dev" />
          </div>
        </div>
        <div>
          <Label htmlFor="summary">Professional Summary</Label>
          <Textarea id="summary" value={data.summary} onChange={(e) => onChange('summary', e.target.value)} placeholder="A brief summary of your skills and experience..." rows={4} />
        </div>
        {/* Font selection dropdown removed */}
      </div>
    </ResumeFormSection>
  );
}
