
"use client";

import type { PersonalInfo } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Palette } from 'lucide-react';
import { ResumeFormSection } from './ResumeFormSection';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (field: keyof PersonalInfo, value: string) => void;
}

const fontOptions = [
  { value: 'Arial, Helvetica, sans-serif', label: 'Arial' },
  { value: 'Cambria, Cochin, Georgia, Times, "Times New Roman", serif', label: 'Cambria' },
  { value: 'Garamond, Baskerville, "Baskerville Old Face", "Hoefler Text", "Times New Roman", serif', label: 'Garamond' },
  { value: '"Times New Roman", Times, serif', label: 'Times New Roman' },
  { value: 'Verdana, Geneva, sans-serif', label: 'Verdana' },
  { value: 'Georgia, serif', label: 'Georgia' },
];

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
        <div>
          <Label htmlFor="summary">Professional Summary</Label>
          <Textarea id="summary" value={data.summary} onChange={(e) => onChange('summary', e.target.value)} placeholder="A brief summary of your skills and experience..." rows={4} />
        </div>
        <div>
          <Label htmlFor="fontFamily" className="flex items-center gap-2"><Palette className="w-4 h-4 text-muted-foreground" />Resume Font</Label>
          <Select value={data.fontFamily} onValueChange={(value) => onChange('fontFamily', value)}>
            <SelectTrigger id="fontFamily">
              <SelectValue placeholder="Select a font" />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map(font => (
                <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </ResumeFormSection>
  );
}
