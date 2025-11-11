/*
|-----------------------------------------
| Setting up Mutation for Single Section
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
import { Eye, Save, Trash2, Sparkles, X, Plus } from 'lucide-react';
import { ISectionData, defaultData } from './data';

interface MutationProps {
  params?: {
    data?: ISectionData;
  };
}

const Mutation = ({ params }: MutationProps) => {
  // ✅ Single section
  const initialData = params?.data ? params.data : defaultData;
  const isUsingDefaultData = !params?.data;
  const [section, setSection] = useState<ISectionData>(initialData);

  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [highlightInput, setHighlightInput] = useState('');

  /** Update field dynamically */
  const updateField = (field: keyof ISectionData, value: string | string[]) => {
    setSection({ ...section, [field]: value });
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

  /** Save handler */
  const handleSave = () => {
    console.log('Section Saved:', section);
  };

  /** Delete section */
  const confirmDelete = () => {
    console.log('Deleted Section:', section.id);
    setShowDeleteDialog(false);
  };

  return (
    <main className="min-h-screen p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Info Banner */}
        {isUsingDefaultData && (
          <div className="outline-water rounded-2xl px-4 py-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <p className="text-sm text-blue-100 font-medium">No section data provided — using default template</p>
          </div>
        )}

        {/* Header */}
        <div className="glassy-primary border border-white/10 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Edit Section</h1>
            <p className="text-white/60 mt-1">Modify your section details and preview changes live.</p>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSave} className="glassy-success flex items-center gap-2">
              <Save className="w-4 h-4" /> Save
            </Button>
            <Button onClick={() => setShowPreviewDialog(true)} className="outline-glassy flex items-center gap-2">
              <Eye className="w-4 h-4" /> Preview
            </Button>
            <Button onClick={() => setShowDeleteDialog(true)} className="glassy-danger flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Delete
            </Button>
          </div>
        </div>

        {/* Form Section */}
        <div className="space-y-6 glassy-dark border border-white/10 rounded-2xl p-6">
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Title" value={section.title} onChange={v => updateField('title', v)} />
            <FormInput label="Heading" value={section.heading} onChange={v => updateField('heading', v)} />
          </div>

          <FormInput label="Subtitle" value={section.subtitle} onChange={v => updateField('subtitle', v)} />

          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Primary Image URL" value={section.image} onChange={v => updateField('image', v)} />
            <FormInput label="Secondary Image URL" value={section.secondaryImage} onChange={v => updateField('secondaryImage', v)} />
          </div>

          <FormTextarea label="Description" value={section.description} onChange={v => updateField('description', v)} />

          <FormTextarea label="Additional Description" value={section.additionalDescription} onChange={v => updateField('additionalDescription', v)} />

          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Featured Label" value={section.featuredLabel} onChange={v => updateField('featuredLabel', v)} />
            <FormInput label="Student Count" value={section.studentCount} onChange={v => updateField('studentCount', v)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Primary Button" value={section.buttonPrimary} onChange={v => updateField('buttonPrimary', v)} />
            <FormInput label="Secondary Button" value={section.buttonSecondary} onChange={v => updateField('buttonSecondary', v)} />
          </div>

          <FormInput label="Enrollment Text" value={section.enrollmentText} onChange={v => updateField('enrollmentText', v)} />

          <FormInput label="CTA Text" value={section.ctaText} onChange={v => updateField('ctaText', v)} />

          {/* Highlights */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-white/90">Highlights</Label>
            <div className="flex gap-2">
              <Input
                value={highlightInput}
                onChange={e => setHighlightInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                placeholder="Add highlight and press Enter"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
              <Button onClick={addHighlight} className="glassy-primary">
                <Plus className="w-4 h-4" />
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

          {/* Preview Images */}
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
              <Button variant="outline" className="outline-glassy">
                {section.buttonSecondary}
              </Button>
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
            <AlertDialogCancel className="outline-glassy">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="glassy-danger">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};

/* 🌿 Reusable Form Components */
const FormInput = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="space-y-1">
    <Label className="text-white/80 text-sm">{label}</Label>
    <Input value={value} onChange={e => onChange(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-white/40" />
  </div>
);

const FormTextarea = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="space-y-1">
    <Label className="text-white/80 text-sm">{label}</Label>
    <Textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[100px]"
    />
  </div>
);

export default Mutation;
