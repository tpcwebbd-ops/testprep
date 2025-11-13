'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, X } from 'lucide-react';

import type { ISectionData } from './data';
import { defaultData } from './data';

export interface SectionFormProps {
  data?: ISectionData;
  onSubmit: (values: ISectionData) => void;
}

const Mutation = ({ data, onSubmit }: SectionFormProps) => {
  const [formData, setFormData] = useState<ISectionData>({ ...defaultData });
  const [highlightInput, setHighlightInput] = useState('');

  useEffect(() => {
    if (data) {
      setFormData({ ...data });
    }
  }, [data]);

  const updateField = (field: keyof ISectionData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addHighlight = () => {
    if (highlightInput.trim()) {
      updateField('highlights', [...formData.highlights, highlightInput.trim()]);
      setHighlightInput('');
    }
  };

  const removeHighlight = (index: number) => {
    updateField(
      'highlights',
      formData.highlights.filter((_, i) => i !== index),
    );
  };

  const handleSave = () => {
    onSubmit(formData);
  };

  return (
    <div className="space-y-6 p-1">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-2xl blur-xl" />
        <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Section Mutation Form</h1>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-purple-900/20 to-blue-900/30 rounded-2xl blur-2xl" />
        <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={formData.title}
              onChange={e => updateField('title', e.target.value)}
              placeholder="Enter section title"
              className="backdrop-blur-sm bg-white/10 border-white/20"
            />
          </div>

          <div className="space-y-2">
            <Label>Heading</Label>
            <Input
              value={formData.heading}
              onChange={e => updateField('heading', e.target.value)}
              placeholder="Lecture number, topic etc."
              className="backdrop-blur-sm bg-white/10 border-white/20"
            />
          </div>

          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={formData.subtitle}
              onChange={e => updateField('subtitle', e.target.value)}
              placeholder="Subtitle or tag line"
              className="backdrop-blur-sm bg-white/10 border-white/20"
            />
          </div>

          <div className="space-y-2">
            <Label>Primary Image URL</Label>
            <Input
              value={formData.image}
              onChange={e => updateField('image', e.target.value)}
              placeholder="https://..."
              className="backdrop-blur-sm bg-white/10 border-white/20"
            />
          </div>

          <div className="space-y-2">
            <Label>Secondary Image URL</Label>
            <Input
              value={formData.secondaryImage}
              onChange={e => updateField('secondaryImage', e.target.value)}
              placeholder="https://..."
              className="backdrop-blur-sm bg-white/10 border-white/20"
            />
          </div>

          {formData.image && (
            <div className="grid grid-cols-2 gap-4">
              <div className="relative w-full h-48 border border-white/20 rounded-lg overflow-hidden backdrop-blur-sm">
                <Image src={formData.image} alt="Primary Preview" fill className="object-cover" />
                <span className="absolute bottom-2 left-2 backdrop-blur-md bg-black/60 px-2 py-0.5 rounded text-xs">Primary</span>
              </div>
              {formData.secondaryImage && (
                <div className="relative w-full h-48 border border-white/20 rounded-lg overflow-hidden backdrop-blur-sm">
                  <Image src={formData.secondaryImage} alt="Secondary Preview" fill className="object-cover" />
                  <span className="absolute bottom-2 left-2 backdrop-blur-md bg-black/60 px-2 py-0.5 rounded text-xs">Secondary</span>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={e => updateField('description', e.target.value)}
              placeholder="Write section description..."
              className="min-h-[120px] backdrop-blur-sm bg-white/10 border-white/20"
            />
          </div>

          <div className="space-y-2">
            <Label>Additional Description</Label>
            <Textarea
              value={formData.additionalDescription}
              onChange={e => updateField('additionalDescription', e.target.value)}
              placeholder="Additional details..."
              className="min-h-[120px] backdrop-blur-sm bg-white/10 border-white/20"
            />
          </div>

          <div className="space-y-2">
            <Label>Featured Label</Label>
            <Input
              value={formData.featuredLabel}
              onChange={e => updateField('featuredLabel', e.target.value)}
              className="backdrop-blur-sm bg-white/10 border-white/20"
            />
          </div>

          <div className="space-y-2">
            <Label>Student Count</Label>
            <Input
              value={formData.studentCount}
              onChange={e => updateField('studentCount', e.target.value)}
              className="backdrop-blur-sm bg-white/10 border-white/20"
            />
          </div>

          <div className="space-y-2">
            <Label>Highlights</Label>
            <div className="flex gap-2">
              <Input
                value={highlightInput}
                onChange={e => setHighlightInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                placeholder="Add highlight and press Enter"
                className="backdrop-blur-sm bg-white/10 border-white/20"
              />
              <Button onClick={addHighlight} className="backdrop-blur-sm bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white hover:opacity-90">
                <Sparkles className="w-4 h-4" />
              </Button>
            </div>

            {formData.highlights.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-1 backdrop-blur-sm bg-purple-500/20 border border-purple-400/30 rounded-lg text-sm">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    {highlight}
                    <button onClick={() => removeHighlight(idx)} className="ml-1 hover:text-red-400 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Primary Button Text</Label>
              <Input
                value={formData.buttonPrimary}
                onChange={e => updateField('buttonPrimary', e.target.value)}
                className="backdrop-blur-sm bg-white/10 border-white/20"
              />
            </div>

            <div className="space-y-2">
              <Label>Secondary Button Text</Label>
              <Input
                value={formData.buttonSecondary}
                onChange={e => updateField('buttonSecondary', e.target.value)}
                className="backdrop-blur-sm bg-white/10 border-white/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Enrollment Text</Label>
            <Input
              value={formData.enrollmentText}
              onChange={e => updateField('enrollmentText', e.target.value)}
              className="backdrop-blur-sm bg-white/10 border-white/20"
            />
          </div>

          <div className="space-y-2">
            <Label>CTA Text</Label>
            <Input value={formData.ctaText} onChange={e => updateField('ctaText', e.target.value)} className="backdrop-blur-sm bg-white/10 border-white/20" />
          </div>
        </div>
      </div>

      <Button onClick={handleSave} className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white hover:opacity-90 backdrop-blur-sm">
        Save Section
      </Button>
    </div>
  );
};

export default Mutation;
