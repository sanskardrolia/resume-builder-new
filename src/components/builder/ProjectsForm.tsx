"use client";

import type { ProjectEntry } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2, Lightbulb } from 'lucide-react';
import { ResumeFormSection } from './ResumeFormSection';
import { Separator } from '@/components/ui/separator';

interface ProjectsFormProps {
  data: ProjectEntry[];
  onChange: (updatedEntries: ProjectEntry[]) => void;
}

export function ProjectsForm({ data, onChange }: ProjectsFormProps) {
  const addEntry = () => {
    onChange([...data, { id: crypto.randomUUID(), title: '', description: '', technologies: '', link: '' }]);
  };

  const updateEntry = (id: string, field: keyof Omit<ProjectEntry, 'id'>, value: string) => {
    onChange(data.map(entry => entry.id === id ? { ...entry, [field]: value } : entry));
  };

  const removeEntry = (id: string) => {
    onChange(data.filter(entry => entry.id !== id));
  };

  return (
    <ResumeFormSection title="Personal Projects" icon={Lightbulb}>
      <div className="space-y-6">
        {data.map((entry, index) => (
          <div key={entry.id} className="p-4 border rounded-md matte-glass bg-card/50">
            <div className="space-y-4">
              <div>
                <Label htmlFor={`project-title-${entry.id}`}>Project Title</Label>
                <Input id={`project-title-${entry.id}`} value={entry.title} onChange={(e) => updateEntry(entry.id, 'title', e.target.value)} placeholder="e.g., My Awesome App" />
              </div>
              <div>
                <Label htmlFor={`project-description-${entry.id}`}>Description</Label>
                <Textarea id={`project-description-${entry.id}`} value={entry.description} onChange={(e) => updateEntry(entry.id, 'description', e.target.value)} placeholder="Briefly describe your project." rows={3} />
              </div>
              <div>
                <Label htmlFor={`project-technologies-${entry.id}`}>Technologies Used</Label>
                <Input id={`project-technologies-${entry.id}`} value={entry.technologies} onChange={(e) => updateEntry(entry.id, 'technologies', e.target.value)} placeholder="e.g., React, Node.js, Python" />
              </div>
              <div>
                <Label htmlFor={`project-link-${entry.id}`}>Project Link (Optional)</Label>
                <Input id={`project-link-${entry.id}`} value={entry.link} onChange={(e) => updateEntry(entry.id, 'link', e.target.value)} placeholder="e.g., github.com/yourusername/project" />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => removeEntry(entry.id)} aria-label="Remove project entry">
                <Trash2 className="w-4 h-4 mr-1" /> Remove
              </Button>
            </div>
            {index < data.length - 1 && <Separator className="my-6" />}
          </div>
        ))}
        <Button onClick={addEntry} variant="outline" className="w-full">
          <PlusCircle className="w-4 h-4 mr-2" /> Add Project
        </Button>
      </div>
    </ResumeFormSection>
  );
}
