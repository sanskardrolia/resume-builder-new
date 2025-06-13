
"use client";

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Wrench } from 'lucide-react';
import { ResumeFormSection } from './ResumeFormSection';

interface SkillsFormProps {
  data: string;
  onChange: (value: string) => void;
}

export function SkillsForm({ data, onChange }: SkillsFormProps) {
  return (
    <ResumeFormSection title="Skills" icon={Wrench}>
      <div className="space-y-2">
        <Label htmlFor="skills">List your skills</Label>
        <Textarea 
          id="skills" 
          value={data} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder="e.g., JavaScript, React, Node.js, Python, SQL. You can list them separated by commas or on new lines." 
          rows={4} 
        />
        <p className="text-xs text-muted-foreground">Separate skills with commas or new lines for best display.</p>
      </div>
    </ResumeFormSection>
  );
}
