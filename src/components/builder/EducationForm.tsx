"use client";

import type { EducationEntry } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2, GraduationCap } from 'lucide-react';
import { ResumeFormSection } from './ResumeFormSection';
import { Separator } from '@/components/ui/separator';

interface EducationFormProps {
  data: EducationEntry[];
  onChange: (updatedEntries: EducationEntry[]) => void;
}

export function EducationForm({ data, onChange }: EducationFormProps) {
  const addEntry = () => {
    onChange([...data, { id: crypto.randomUUID(), institution: '', degree: '', startDate: '', endDate: '', details: '' }]);
  };

  const updateEntry = (id: string, field: keyof Omit<EducationEntry, 'id'>, value: string) => {
    onChange(data.map(entry => entry.id === id ? { ...entry, [field]: value } : entry));
  };

  const removeEntry = (id: string) => {
    onChange(data.filter(entry => entry.id !== id));
  };

  return (
    <ResumeFormSection title="Education" icon={GraduationCap}>
      <div className="space-y-6">
        {data.map((entry, index) => (
          <div key={entry.id} className="p-4 border rounded-md matte-glass bg-card/50">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`institution-${entry.id}`}>Institution</Label>
                  <Input id={`institution-${entry.id}`} value={entry.institution} onChange={(e) => updateEntry(entry.id, 'institution', e.target.value)} placeholder="e.g., University of Example" />
                </div>
                <div>
                  <Label htmlFor={`degree-${entry.id}`}>Degree/Certificate</Label>
                  <Input id={`degree-${entry.id}`} value={entry.degree} onChange={(e) => updateEntry(entry.id, 'degree', e.target.value)} placeholder="e.g., B.S. in Computer Science" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`edu-startDate-${entry.id}`}>Start Date</Label>
                  <Input id={`edu-startDate-${entry.id}`} type="text" value={entry.startDate} onChange={(e) => updateEntry(entry.id, 'startDate', e.target.value)} placeholder="e.g., Aug 2018 or 2018" />
                </div>
                <div>
                  <Label htmlFor={`edu-endDate-${entry.id}`}>End Date</Label>
                  <Input id={`edu-endDate-${entry.id}`} type="text" value={entry.endDate} onChange={(e) => updateEntry(entry.id, 'endDate', e.target.value)} placeholder="e.g., May 2022 or Present" />
                </div>
              </div>
              <div>
                <Label htmlFor={`edu-details-${entry.id}`}>Details (Optional)</Label>
                <Textarea id={`edu-details-${entry.id}`} value={entry.details} onChange={(e) => updateEntry(entry.id, 'details', e.target.value)} placeholder="e.g., GPA: 3.8/4.0, Dean's List, Relevant Coursework..." rows={3}/>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => removeEntry(entry.id)} aria-label="Remove education entry">
                <Trash2 className="w-4 h-4 mr-1" /> Remove
              </Button>
            </div>
            {index < data.length - 1 && <Separator className="my-6" />}
          </div>
        ))}
        <Button onClick={addEntry} variant="outline" className="w-full">
          <PlusCircle className="w-4 h-4 mr-2" /> Add Education
        </Button>
      </div>
    </ResumeFormSection>
  );
}
