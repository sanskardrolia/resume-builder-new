"use client";

import type { WorkExperienceEntry } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2, Briefcase } from 'lucide-react';
import { ResumeFormSection } from './ResumeFormSection';
import { Separator } from '@/components/ui/separator';

interface WorkExperienceFormProps {
  data: WorkExperienceEntry[];
  onChange: (updatedEntries: WorkExperienceEntry[]) => void;
}

export function WorkExperienceForm({ data, onChange }: WorkExperienceFormProps) {
  const addEntry = () => {
    onChange([...data, { id: crypto.randomUUID(), company: '', jobTitle: '', startDate: '', endDate: '', responsibilities: '' }]);
  };

  const updateEntry = (id: string, field: keyof Omit<WorkExperienceEntry, 'id'>, value: string) => {
    onChange(data.map(entry => entry.id === id ? { ...entry, [field]: value } : entry));
  };

  const removeEntry = (id: string) => {
    onChange(data.filter(entry => entry.id !== id));
  };

  return (
    <ResumeFormSection title="Work Experience" icon={Briefcase}>
      <div className="space-y-6">
        {data.map((entry, index) => (
          <div key={entry.id} className="p-4 border rounded-md matte-glass bg-card/50">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`company-${entry.id}`}>Company</Label>
                  <Input id={`company-${entry.id}`} value={entry.company} onChange={(e) => updateEntry(entry.id, 'company', e.target.value)} placeholder="e.g., Tech Solutions Inc."/>
                </div>
                <div>
                  <Label htmlFor={`jobTitle-${entry.id}`}>Job Title</Label>
                  <Input id={`jobTitle-${entry.id}`} value={entry.jobTitle} onChange={(e) => updateEntry(entry.id, 'jobTitle', e.target.value)} placeholder="e.g., Software Developer" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`exp-startDate-${entry.id}`}>Start Date</Label>
                  <Input id={`exp-startDate-${entry.id}`} type="text" value={entry.startDate} onChange={(e) => updateEntry(entry.id, 'startDate', e.target.value)} placeholder="e.g., Jun 2020" />
                </div>
                <div>
                  <Label htmlFor={`exp-endDate-${entry.id}`}>End Date</Label>
                  <Input id={`exp-endDate-${entry.id}`} type="text" value={entry.endDate} onChange={(e) => updateEntry(entry.id, 'endDate', e.target.value)} placeholder="e.g., Aug 2022 or Present" />
                </div>
              </div>
              <div>
                <Label htmlFor={`responsibilities-${entry.id}`}>Key Responsibilities & Achievements</Label>
                <Textarea id={`responsibilities-${entry.id}`} value={entry.responsibilities} onChange={(e) => updateEntry(entry.id, 'responsibilities', e.target.value)} placeholder="Describe your key responsibilities and achievements. Start each point on a new line." rows={5} />
                 <p className="text-xs text-muted-foreground mt-1">Tip: Start each point on a new line for clear bullet points in the resume.</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => removeEntry(entry.id)} aria-label="Remove work experience entry">
                <Trash2 className="w-4 h-4 mr-1" /> Remove
              </Button>
            </div>
             {index < data.length - 1 && <Separator className="my-6" />}
          </div>
        ))}
        <Button onClick={addEntry} variant="outline" className="w-full">
          <PlusCircle className="w-4 h-4 mr-2" /> Add Experience
        </Button>
      </div>
    </ResumeFormSection>
  );
}
