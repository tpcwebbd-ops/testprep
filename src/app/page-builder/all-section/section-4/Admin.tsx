'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, Plus, Trash2 } from 'lucide-react';
import ImageUploadFieldSingle from '@/components/dashboard-ui/ImageUploadFieldSingle';
import { defaultData, Section4Props, SectionData } from './data';

const AdminSection4 = ({ data }: Section4Props) => {
  const [formData, setFormData] = useState<SectionData>(data || defaultData);

  const handleFieldChange = (name: keyof SectionData, value: string | string[] | null) => {
    if (value !== null) {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleHighlightChange = (index: number, value: string) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = value;
    handleFieldChange('highlights', newHighlights);
  };

  const addHighlight = () => {
    handleFieldChange('highlights', [...formData.highlights, '']);
  };

  const removeHighlight = (index: number) => {
    const newHighlights = formData.highlights.filter((_, i) => i !== index);
    handleFieldChange('highlights', newHighlights);
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-orange-900 flex items-center justify-center p-4">
      <div className="max-w-6xl lg:max-w-7xl w-full">
        <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10" />

          <div className="relative p-8 lg:p-12">
            <div className="mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">Edit Event Section</h2>
              <p className="text-gray-400">Update event/conference content</p>
            </div>

            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="id" className="text-right text-white">
                  ID
                </Label>
                <div className="col-span-3">
                  <Input
                    id="id"
                    value={formData.id}
                    onChange={e => handleFieldChange('id', e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right text-white">
                  Title
                </Label>
                <div className="col-span-3">
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={e => handleFieldChange('title', e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="subtitle" className="text-right text-white">
                  Subtitle
                </Label>
                <div className="col-span-3">
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={e => handleFieldChange('subtitle', e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right text-white">
                  Primary Image
                </Label>
                <div className="col-span-3">
                  <ImageUploadFieldSingle label="Primary Image" value={formData.image} onChange={url => handleFieldChange('image', url)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="secondaryImage" className="text-right text-white">
                  Secondary Image
                </Label>
                <div className="col-span-3">
                  <ImageUploadFieldSingle label="Secondary Image" value={formData.secondaryImage} onChange={url => handleFieldChange('secondaryImage', url)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="heading" className="text-right text-white">
                  Heading
                </Label>
                <div className="col-span-3">
                  <Input
                    id="heading"
                    value={formData.heading}
                    onChange={e => handleFieldChange('heading', e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right text-white pt-3">
                  Description
                </Label>
                <div className="col-span-3">
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={e => handleFieldChange('description', e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 min-h-[120px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                <Label htmlFor="additionalDescription" className="text-right text-white pt-3">
                  Additional Description
                </Label>
                <div className="col-span-3">
                  <Textarea
                    id="additionalDescription"
                    value={formData.additionalDescription}
                    onChange={e => handleFieldChange('additionalDescription', e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 min-h-[120px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="featuredLabel" className="text-right text-white">
                  Featured Label
                </Label>
                <div className="col-span-3">
                  <Input
                    id="featuredLabel"
                    value={formData.featuredLabel}
                    onChange={e => handleFieldChange('featuredLabel', e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="buttonPrimary" className="text-right text-white">
                  Primary Button
                </Label>
                <div className="col-span-3">
                  <Input
                    id="buttonPrimary"
                    value={formData.buttonPrimary}
                    onChange={e => handleFieldChange('buttonPrimary', e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="buttonSecondary" className="text-right text-white">
                  Secondary Button
                </Label>
                <div className="col-span-3">
                  <Input
                    id="buttonSecondary"
                    value={formData.buttonSecondary}
                    onChange={e => handleFieldChange('buttonSecondary', e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="studentCount" className="text-right text-white">
                  Attendee Count
                </Label>
                <div className="col-span-3">
                  <Input
                    id="studentCount"
                    value={formData.studentCount}
                    onChange={e => handleFieldChange('studentCount', e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="enrollmentText" className="text-right text-white">
                  Attendee Text
                </Label>
                <div className="col-span-3">
                  <Input
                    id="enrollmentText"
                    value={formData.enrollmentText}
                    onChange={e => handleFieldChange('enrollmentText', e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="ctaText" className="text-right text-white">
                  CTA Text
                </Label>
                <div className="col-span-3">
                  <Input
                    id="ctaText"
                    value={formData.ctaText}
                    onChange={e => handleFieldChange('ctaText', e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                <Label className="text-right text-white pt-3">Highlights</Label>
                <div className="col-span-3 space-y-3">
                  {formData.highlights.map((highlight, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={highlight}
                        onChange={e => handleHighlightChange(index, e.target.value)}
                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                        placeholder={`Highlight ${index + 1}`}
                      />
                      <Button
                        type="button"
                        onClick={() => removeHighlight(index)}
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" onClick={addHighlight} variant="outline" className="w-full border-white/20 text-white hover:bg-white/5">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Highlight
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                onClick={handleSubmit}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:scale-105 transition-all duration-300 shadow-lg shadow-orange-500/30"
              >
                <Save className="w-5 h-5 mr-2" />
                Submit Changes
              </Button>
            </div>
          </div>

          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>
    </main>
  );
};

export default AdminSection4;
