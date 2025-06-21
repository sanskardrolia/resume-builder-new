
"use client";

import type { ExtraCurricularEntry } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2, Trophy } from 'lucide-react';
import { ResumeFormSection } from './ResumeFormSection';
import { Separator } from '@/components/ui/separator';

interface ExtraCurricularFormProps {
  data: ExtraCurricularEntry[];
  onChange: (updatedEntries: ExtraCurricularEntry[]) => void;
}

export function ExtraCurricularForm({ data, onChange }: ExtraCurricularFormProps) {
  const addEntry = () => {
    onChange([...data, { id: crypto.randomUUID(), activity: '', organization: '', startDate: '', endDate: '', description: '' }]);
  };

  const updateEntry = (id: string, field: keyof Omit<ExtraCurricularEntry, 'id'>, value: string) => {
    onChange(data.map(entry => entry.id === id ? { ...entry, [field]: value } : entry));
  };

  const removeEntry = (id: string) => {
    onChange(data.filter(entry => entry.id !== id));
  };

  return (
    <ResumeFormSection title="Extra-Curricular Activities" icon={Trophy}>
      <div className="space-y-6">
        {data.map((entry, index) => (
          <div key={entry.id} className="p-4 border rounded-md matte-glass bg-card/50">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`activity-${entry.id}`}>Activity / Role</Label>
                  <Input id={`activity-${entry.id}`} value={entry.activity} onChange={(e) => updateEntry(entry.id, 'activity', e.target.value)} placeholder="e.g., Event Head"/>
                </div>
                <div>
                  <Label htmlFor={`organization-${entry.id}`}>Organization / Club</Label>
                  <Input id={`organization-${entry.id}`} value={entry.organization} onChange={(e) => updateEntry(entry.id, 'organization', e.target.value)} placeholder="e.g., Tech Fest Committee" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`extra-startDate-${entry.id}`}>Start Date</Label>
                  <Input id={`extra-startDate-${entry.id}`} type="text" value={entry.startDate} onChange={(e) => updateEntry(entry.id, 'startDate', e.target.value)} placeholder="e.g., Jun 2020" />
                </div>
                <div>
                  <Label htmlFor={`extra-endDate-${entry.id}`}>End Date</Label>
                  <Input id={`extra-endDate-${entry.id}`} type="text" value={entry.endDate} onChange={(e) => updateEntry(entry.id, 'endDate', e.target.value)} placeholder="e.g., Aug 2022 or Present" />
                </div>
              </div>
              <div>
                <Label htmlFor={`extra-description-${entry.id}`}>Description & Achievements</Label>
                <Textarea id={`extra-description-${entry.id}`} value={entry.description} onChange={(e) => updateEntry(entry.id, 'description', e.target.value)} placeholder="Describe your role and any notable achievements. Start each point on a new line." rows={4} />
                 <p className="text-xs text-muted-foreground mt-1">Tip: Start each point on a new line for clear bullet points in the resume.</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => removeEntry(entry.id)} aria-label="Remove extra-curricular entry">
                <Trash2 className="w-4 h-4 mr-1" /> Remove
              </Button>
            </div>
             {index < data.length - 1 && <Separator className="my-6" />}
          </div>
        ))}
        <Button onClick={addEntry} variant="outline" className="w-full">
          <PlusCircle className="w-4 h-4 mr-2" /> Add Activity
        </Button>
      </div>
    </ResumeFormSection>
  );
}
