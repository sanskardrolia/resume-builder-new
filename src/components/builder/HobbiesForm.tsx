"use client";

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Smile } from 'lucide-react';
import { ResumeFormSection } from './ResumeFormSection';

interface HobbiesFormProps {
  data: string;
  onChange: (value: string) => void;
}

export function HobbiesForm({ data, onChange }: HobbiesFormProps) {
  return (
    <ResumeFormSection title="Hobbies & Interests" icon={Smile}>
      <div className="space-y-2">
        <Label htmlFor="hobbies">List your hobbies and interests</Label>
        <Textarea 
          id="hobbies" 
          value={data} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder="e.g., Reading, Hiking, Coding, Playing Guitar. You can list them separated by commas or on new lines." 
          rows={4} 
        />
        <p className="text-xs text-muted-foreground">Separate hobbies with commas or new lines for best display.</p>
      </div>
    </ResumeFormSection>
  );
}
