/*
|-----------------------------------------
| Setting up Single Section Mutation Editor
|-----------------------------------------
| Author: Toufiquer Rahman <toufiquer.0@gmail.com>
| © testprep-webapp, November 2025
|-----------------------------------------
*/

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Sparkles, X, Eye, Trash2, Save } from 'lucide-react';
import { ISectionData, defaultData } from './data';

interface SectionFormProps {
  data?: ISectionData;
  onSubmit: (values: ISectionData) => void;
}

const Mutation = ({ data, onSubmit }: SectionFormProps) => {
  const initialData = data ?? defaultData;
  const isUsingDefaultData = !data;
  const [section, setSection] = useState<ISectionData>(initialData);

  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [highlightInput, setHighlightInput] = useState('');

  /** Update single field dynamically */
  const updateField = (field: keyof ISectionData, value: string | string[]) => {
    setSection(prev => ({ ...prev, [field]: value }));
  };

  /** Add highlight tag */
  const addHighlight = () => {
    if (highlightInput.trim()) {
      updateField('highlights', [...section.highlights, highlightInput.trim()]);
      setHighlightInput('');
    }
  };

  /** Remove highlight tag */
  const removeHighlight = (index: number) => {
    updateField(
      'highlights',
      section.highlights.filter((_, i) => i !== index),
    );
  };

  /** Save and pass data up */
  const handleSave = () => {
    onSubmit(section);
  };

  /** Delete section */
  const confirmDelete = () => {
    console.log('Deleted Section:', section.id);
    setShowDeleteDialog(false);
  };

  return (
    <main className="min-h-screen p-6 bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Info Banner */}
        {isUsingDefaultData && (
          <div className="outline-water rounded-2xl px-4 py-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <p className="text-sm text-blue-100 font-medium">No section data provided — editing default template.</p>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between glassy-primary rounded-2xl border border-white/10 p-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Edit Section</h1>
            <p className="text-white/60 mt-1">Modify your section details and preview live.</p>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSave} className="glassy-success flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </Button>

            <Button onClick={() => setShowPreviewDialog(true)} className="outline-glassy flex items-center gap-2">
              <Eye className="w-4 h-4" /> Preview
            </Button>

            <Button onClick={() => setShowDeleteDialog(true)} className="glassy-danger flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Delete
            </Button>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6 glassy-dark rounded-2xl p-6 border border-white/10">
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Title" value={section.title} placeholder="Enter section title" onChange={v => updateField('title', v)} />
            <FormInput label="Heading" value={section.heading} placeholder="Lecture number or topic" onChange={v => updateField('heading', v)} />
          </div>

          <FormInput label="Subtitle" value={section.subtitle} placeholder="Subtitle or tag line" onChange={v => updateField('subtitle', v)} />

          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Primary Image URL" value={section.image} placeholder="https://..." onChange={v => updateField('image', v)} />
            <FormInput label="Secondary Image URL" value={section.secondaryImage} placeholder="https://..." onChange={v => updateField('secondaryImage', v)} />
          </div>

          <FormTextarea label="Description" value={section.description} placeholder="Main description" onChange={v => updateField('description', v)} />
          <FormTextarea
            label="Additional Description"
            value={section.additionalDescription}
            placeholder="Additional details"
            onChange={v => updateField('additionalDescription', v)}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Featured Label"
              value={section.featuredLabel}
              placeholder="e.g., Premium Course"
              onChange={v => updateField('featuredLabel', v)}
            />
            <FormInput label="Student Count" value={section.studentCount} placeholder="e.g., 5.2k+ Students" onChange={v => updateField('studentCount', v)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Primary Button" value={section.buttonPrimary} placeholder="e.g., Enroll Now" onChange={v => updateField('buttonPrimary', v)} />
            <FormInput
              label="Secondary Button"
              value={section.buttonSecondary}
              placeholder="e.g., View Curriculum"
              onChange={v => updateField('buttonSecondary', v)}
            />
          </div>

          <FormInput
            label="Enrollment Text"
            value={section.enrollmentText}
            placeholder="e.g., Active learners"
            onChange={v => updateField('enrollmentText', v)}
          />
          <FormInput label="CTA Text" value={section.ctaText} placeholder="e.g., Limited seats available" onChange={v => updateField('ctaText', v)} />

          {/* Highlights */}
          <div className="space-y-2">
            <Label className="text-white/90 text-sm font-medium">Highlights</Label>
            <div className="flex gap-2">
              <Input
                value={highlightInput}
                onChange={e => setHighlightInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                placeholder="Add highlight and press Enter"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
              <Button onClick={addHighlight} className="glassy-primary">
                <Sparkles className="w-4 h-4" />
              </Button>
            </div>

            {section.highlights.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {section.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-lg text-sm text-white">
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

          {/* Image Preview */}
          {section.image && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="relative h-32 rounded-lg overflow-hidden border border-white/20">
                <Image src={section.image} alt="Primary" fill className="object-cover" />
                <span className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-xs">Primary</span>
              </div>
              {section.secondaryImage && (
                <div className="relative h-32 rounded-lg overflow-hidden border border-white/20">
                  <Image src={section.secondaryImage} alt="Secondary" fill className="object-cover" />
                  <span className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-xs">Secondary</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* PREVIEW DIALOG */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="glassy-dark border border-white/20 sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Section Preview
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="relative w-full h-56 rounded-lg overflow-hidden border border-white/20">
              <Image src={section.image} alt={section.title} fill className="object-cover" />
              <div className="absolute top-4 right-4 bg-purple-600/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white font-medium">
                {section.featuredLabel}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold">{section.title}</h2>
              <p className="text-purple-400 font-semibold">{section.heading}</p>
              <p className="text-white/70 mt-2">{section.description}</p>
            </div>

            <div className="flex gap-3 mt-3">
              <Button className="glassy-success">{section.buttonPrimary}</Button>
              <Button className="outline-glassy">{section.buttonSecondary}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="glassy-danger border border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Section</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this section? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/20 text-white hover:bg-white/10">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};

/* 🌿 Reusable Form Components */
const FormInput = ({ label, value, placeholder, onChange }: { label: string; value: string; placeholder?: string; onChange: (v: string) => void }) => (
  <div className="space-y-1">
    <Label className="text-white/90 text-sm">{label}</Label>
    <Input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
    />
  </div>
);

const FormTextarea = ({ label, value, placeholder, onChange }: { label: string; value: string; placeholder?: string; onChange: (v: string) => void }) => (
  <div className="space-y-1">
    <Label className="text-white/90 text-sm">{label}</Label>
    <Textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[100px]"
    />
  </div>
);

export default Mutation;
