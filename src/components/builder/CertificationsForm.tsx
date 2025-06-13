
"use client";

import type { CertificationEntry } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, Award } from 'lucide-react';
import { ResumeFormSection } from './ResumeFormSection';
import { Separator } from '@/components/ui/separator';

interface CertificationsFormProps {
  data: CertificationEntry[];
  onChange: (updatedEntries: CertificationEntry[]) => void;
}

export function CertificationsForm({ data, onChange }: CertificationsFormProps) {
  const addEntry = () => {
    onChange([...data, { id: crypto.randomUUID(), name: '', issuingOrganization: '', dateEarned: '', credentialId: '', credentialUrl: '' }]);
  };

  const updateEntry = (id: string, field: keyof Omit<CertificationEntry, 'id'>, value: string) => {
    onChange(data.map(entry => entry.id === id ? { ...entry, [field]: value } : entry));
  };

  const removeEntry = (id: string) => {
    onChange(data.filter(entry => entry.id !== id));
  };

  return (
    <ResumeFormSection title="Certifications" icon={Award}>
      <div className="space-y-6">
        {data.map((entry, index) => (
          <div key={entry.id} className="p-4 border rounded-md matte-glass bg-card/50">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`cert-name-${entry.id}`}>Certification Name</Label>
                  <Input id={`cert-name-${entry.id}`} value={entry.name} onChange={(e) => updateEntry(entry.id, 'name', e.target.value)} placeholder="e.g., Certified Kubernetes Administrator" />
                </div>
                <div>
                  <Label htmlFor={`cert-org-${entry.id}`}>Issuing Organization</Label>
                  <Input id={`cert-org-${entry.id}`} value={entry.issuingOrganization} onChange={(e) => updateEntry(entry.id, 'issuingOrganization', e.target.value)} placeholder="e.g., Cloud Native Computing Foundation" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`cert-date-${entry.id}`}>Date Earned</Label>
                  <Input id={`cert-date-${entry.id}`} type="text" value={entry.dateEarned} onChange={(e) => updateEntry(entry.id, 'dateEarned', e.target.value)} placeholder="e.g., Dec 2021" />
                </div>
                 <div>
                  <Label htmlFor={`cert-id-${entry.id}`}>Credential ID (Optional)</Label>
                  <Input id={`cert-id-${entry.id}`} value={entry.credentialId || ''} onChange={(e) => updateEntry(entry.id, 'credentialId', e.target.value)} placeholder="e.g., LF-abc123xyz" />
                </div>
              </div>
              <div>
                <Label htmlFor={`cert-url-${entry.id}`}>Credential URL (Optional)</Label>
                <Input id={`cert-url-${entry.id}`} value={entry.credentialUrl || ''} onChange={(e) => updateEntry(entry.id, 'credentialUrl', e.target.value)} placeholder="e.g., https://example.com/credential" />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => removeEntry(entry.id)} aria-label="Remove certification entry">
                <Trash2 className="w-4 h-4 mr-1" /> Remove
              </Button>
            </div>
            {index < data.length - 1 && <Separator className="my-6" />}
          </div>
        ))}
        <Button onClick={addEntry} variant="outline" className="w-full">
          <PlusCircle className="w-4 h-4 mr-2" /> Add Certification
        </Button>
      </div>
    </ResumeFormSection>
  );
}
