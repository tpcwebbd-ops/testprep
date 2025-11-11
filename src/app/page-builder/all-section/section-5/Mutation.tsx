/*
|-----------------------------------------
| setting up Mutation for the App (Single Section)
|-----------------------------------------
| @author:
| Toufiquer Rahman <toufiquer.0@gmail.com>
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
import { Eye, Edit, Trash2, X, Sparkles, Plus, Save } from 'lucide-react';

export interface ISectionData {
  sectionUid: string;
  id: string;
  title: string;
  image: string;
  heading: string;
  description: string;
  featuredLabel: string;
  buttonPrimary: string;
  buttonSecondary: string;
  studentCount: string;
  enrollmentText: string;
  secondaryImage: string;
  subtitle: string;
  additionalDescription: string;
  ctaText: string;
  highlights: string[];
}

export const defaultData: ISectionData = {
  sectionUid: 'section-uid-4',
  id: 'event_section_003',
  title: 'Global Design Summit 2025',
  image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
  heading: 'March 15-17',
  description:
    'Join designers, innovators, and creative leaders from around the world for three days of inspiring talks, hands-on workshops, and networking opportunities.',
  featuredLabel: 'Annual Conference',
  buttonPrimary: 'Register Now',
  buttonSecondary: 'View Schedule',
  studentCount: '3,500+ Attendees',
  enrollmentText: 'Expected this year',
  secondaryImage: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
  subtitle: 'Where Creativity Meets Innovation',
  additionalDescription: 'Experience keynotes from industry pioneers, participate in interactive workshops covering the latest design tools and methodologies.',
  ctaText: 'Early bird pricing ends soon - Save 40%',
  highlights: ['50+ expert speakers', 'Hands-on workshops', 'Networking events'],
};

interface MutationProps {
  params?: {
    data?: ISectionData;
  };
}

const Mutation = ({ params }: MutationProps) => {
  const initialData = params?.data ?? defaultData;
  const [section, setSection] = useState<ISectionData>(initialData);
  const [showDialog, setShowDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [highlightInput, setHighlightInput] = useState('');

  const updateField = (field: keyof ISectionData, value: string | string[]) => {
    setSection({ ...section, [field]: value });
  };

  const addHighlight = () => {
    if (highlightInput.trim()) {
      updateField('highlights', [...section.highlights, highlightInput.trim()]);
      setHighlightInput('');
    }
  };

  const removeHighlight = (index: number) => {
    updateField(
      'highlights',
      section.highlights.filter((_, i) => i !== index),
    );
  };

  const handleSave = () => {
    console.log('Saved Section:', section);
    setShowDialog(false);
  };

  const handleDelete = () => {
    console.log('Deleted Section:', section.id);
    setShowDeleteDialog(false);
  };

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Section Mutation</h1>
            <p className="text-white/70 mt-2">Manage your single section</p>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => setShowDialog(true)} className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button onClick={() => setShowPreviewDialog(true)} variant="outline" className="border-white/30 text-white">
              <Eye className="w-4 h-4 mr-2" /> Preview
            </Button>
            <Button onClick={() => setShowDeleteDialog(true)} className="bg-red-600 text-white hover:bg-red-700">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Single Section Card */}
        <div className="backdrop-blur-xl bg-white/5 border-white/10 overflow-hidden rounded-2xl group hover:border-purple-400/50 transition-all duration-300">
          <div className="relative h-64 w-full overflow-hidden">
            <Image src={section.image} alt={section.title} fill className="object-cover transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute top-3 right-3 bg-purple-600/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white font-medium">
              {section.featuredLabel}
            </div>
          </div>
          <div className="p-6 space-y-3">
            <h2 className="text-xl font-bold text-white">{section.title}</h2>
            <p className="text-purple-400 font-semibold text-sm">{section.subtitle}</p>
            <p className="text-white/70">{section.description}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {section.highlights.map((highlight, idx) => (
                <span key={idx} className="px-2 py-1 bg-purple-500/20 border border-purple-400/30 rounded-md text-xs text-purple-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-slate-900/95 backdrop-blur-xl border border-white/20 text-white sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Edit Section
            </DialogTitle>
            <DialogDescription className="text-white/70">Update your section details below.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <FormInput label="Title" value={section.title} onChange={v => updateField('title', v)} />
            <FormInput label="Heading" value={section.heading} onChange={v => updateField('heading', v)} />
            <FormInput label="Subtitle" value={section.subtitle} onChange={v => updateField('subtitle', v)} />
            <FormTextarea label="Description" value={section.description} onChange={v => updateField('description', v)} />
            <FormTextarea label="Additional Description" value={section.additionalDescription} onChange={v => updateField('additionalDescription', v)} />

            {/* Highlights */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-white/90">Highlights</Label>
              <div className="flex gap-2">
                <Input
                  value={highlightInput}
                  onChange={e => setHighlightInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  placeholder="Add highlight and press Enter"
                />
                <Button onClick={addHighlight} className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {section.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 border border-purple-400/30 rounded-lg text-sm text-white">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    {h}
                    <button onClick={() => removeHighlight(i)} className="ml-1 hover:text-red-400 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSave} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
              <Save className="w-4 h-4 mr-1" /> Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="bg-slate-900/95 backdrop-blur-xl border border-white/20 text-white sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Section Preview
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <Image src={section.image} alt={section.title} width={800} height={400} className="rounded-lg border border-white/20" />
            <div>
              <h3 className="text-3xl font-bold">{section.title}</h3>
              <p className="text-purple-400 font-semibold">{section.heading}</p>
              <p className="text-white/80 mt-2">{section.description}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-slate-900/95 backdrop-blur-xl border border-white/20 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Section</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this section? This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/20 text-white hover:bg-white/10">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};

/* Reusable Components */
const FormInput = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium text-white/90">{label}</Label>
    <Input value={value} onChange={e => onChange(e.target.value)} className="bg-white/5 border-white/20 text-white placeholder:text-white/40" />
  </div>
);

const FormTextarea = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium text-white/90">{label}</Label>
    <Textarea value={value} onChange={e => onChange(e.target.value)} className="bg-white/5 border-white/20 text-white placeholder:text-white/40 min-h-[80px]" />
  </div>
);

export default Mutation;
