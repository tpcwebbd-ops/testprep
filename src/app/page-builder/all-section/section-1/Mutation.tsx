/*
|-----------------------------------------
| Mutation Form for a Single ISectionData
|-----------------------------------------
*/
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import type { ISectionData } from './data';
import { defaultData } from './data';
import ImageUploadManagerSingle from '@/components/dashboard-ui/ImageUploadManagerSingle';

export interface SectionFormProps {
  data?: ISectionData;
  onSubmit: (values: ISectionData) => void;
}

const Mutation = ({ data, onSubmit }: SectionFormProps) => {
  const [formData, setFormData] = useState<ISectionData>({ ...defaultData });

  useEffect(() => {
    // clone data into local state
    if (data) {
      setFormData({ ...data });
    }
  }, [data]);

  const updateField = (field: keyof ISectionData, value: string | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSubmit(formData);
  };

  return (
    <div className="space-y-6 p-1">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Section Mutation Form</h1>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input value={formData.title} onChange={e => updateField('title', e.target.value)} placeholder="Enter section title" />
        </div>

        <div className="space-y-2">
          <Label>Heading</Label>
          <Input value={formData.heading} onChange={e => updateField('heading', e.target.value)} placeholder="Lecture number, topic etc." />
        </div>

        <div className="space-y-2">
          <Label>Image URL</Label>
          <Input value={formData.image} onChange={e => updateField('image', e.target.value)} placeholder="https://..." />
        </div>
        {/* 
        {formData.image && (
          <div className="relative w-full h-48 border border-white/20 rounded-lg overflow-hidden">
            <Image src={formData.image} alt="Preview" fill className="object-cover" />
          </div>
        )} */}
        <ImageUploadManagerSingle value={formData.image} onChange={url => updateField('image', url)} />

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={e => updateField('description', e.target.value)}
            placeholder="Write section description..."
            className="min-h-[120px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Featured Label</Label>
          <Input value={formData.featuredLabel} onChange={e => updateField('featuredLabel', e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Student Count</Label>
          <Input value={formData.studentCount} onChange={e => updateField('studentCount', e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Primary Button Text</Label>
            <Input value={formData.buttonPrimary} onChange={e => updateField('buttonPrimary', e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Secondary Button Text</Label>
            <Input value={formData.buttonSecondary} onChange={e => updateField('buttonSecondary', e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Enrollment Text</Label>
          <Input value={formData.enrollmentText} onChange={e => updateField('enrollmentText', e.target.value)} />
        </div>
      </div>

      <Button onClick={handleSave} className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white hover:opacity-90">
        Save Section
      </Button>
    </div>
  );
};

export default Mutation;
