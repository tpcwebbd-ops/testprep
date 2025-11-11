/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, November, 2025
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Eye, X, Sparkles } from 'lucide-react';

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
    data?: ISectionData[];
  };
}

const Mutation = ({ params }: MutationProps) => {
  const initialData = params?.data && params.data.length > 0 ? params.data : [defaultData];
  const isUsingDefaultData = !params?.data || params.data.length === 0;
  const [sections, setSections] = useState<ISectionData[]>(initialData);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<ISectionData | null>(null);
  const [formData, setFormData] = useState<ISectionData>(defaultData);
  const [highlightInput, setHighlightInput] = useState('');

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      ...defaultData,
      id: `section-${Date.now()}`,
      sectionUid: `section-uid-${Date.now()}`,
    });
    setShowDialog(true);
  };

  const handleEdit = (section: ISectionData) => {
    setEditingId(section.id);
    setFormData(section);
    setShowDialog(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setShowDeleteDialog(true);
  };

  const handlePreview = (section: ISectionData) => {
    setPreviewData(section);
    setShowPreviewDialog(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      setSections(sections.filter(s => s.id !== deletingId));
      console.log('Deleted Section ID:', deletingId);
      setShowDeleteDialog(false);
      setDeletingId(null);
    }
  };

  const handleSave = () => {
    if (editingId) {
      setSections(sections.map(s => (s.id === editingId ? formData : s)));
      console.log('Updated Section:', formData);
    } else {
      setSections([...sections, formData]);
      console.log('Added New Section:', formData);
    }
    setShowDialog(false);
  };

  const updateField = (field: keyof ISectionData, value: string | string[]) => {
    setFormData({ ...formData, [field]: value });
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

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {isUsingDefaultData && (
          <div className="backdrop-blur-xl bg-blue-500/10 border border-blue-400/30 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <p className="text-blue-300 text-sm font-medium">No data provided - displaying default section data</p>
          </div>
        )}

        <div className="flex items-center justify-between backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Section Mutation</h1>
            <p className="text-white/70 mt-2">Manage your sections with full CRUD operations</p>
          </div>
          <Button
            onClick={handleAdd}
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Section
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map(section => (
            <Card
              key={section.id}
              className="backdrop-blur-xl bg-white/5 border-white/10 overflow-hidden group hover:border-purple-400/50 transition-all duration-300"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={section.image}
                  alt={section.title}
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-2 right-2 bg-purple-600/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white font-medium">
                  {section.featuredLabel}
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-white line-clamp-1">{section.title}</CardTitle>
                <CardDescription className="text-purple-400 text-xs font-semibold">{section.subtitle}</CardDescription>
                <CardDescription className="text-white/60 line-clamp-2 mt-2">{section.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <span className="font-semibold text-purple-400">{section.studentCount}</span>
                  <span className="text-white/60">{section.enrollmentText}</span>
                </div>
                {section.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {section.highlights.slice(0, 2).map((highlight, idx) => (
                      <div
                        key={idx}
                        className="px-2 py-1 bg-purple-500/20 border border-purple-400/30 rounded-md text-xs text-purple-300 flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        {highlight}
                      </div>
                    ))}
                    {section.highlights.length > 2 && (
                      <div className="px-2 py-1 bg-white/5 rounded-md text-xs text-white/60">+{section.highlights.length - 2} more</div>
                    )}
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreview(section)}
                  className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10 gap-2"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(section)}
                  className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10 gap-2"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(section.id)}
                  className="flex-1 bg-transparent border-red-400/30 text-red-400 hover:bg-red-500/10 gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-slate-900/95 backdrop-blur-xl border border-white/20 text-white sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              {editingId ? 'Edit Section' : 'Add New Section'}
            </DialogTitle>
            <DialogDescription className="text-white/70">Fill in the details below to {editingId ? 'update' : 'create'} your section.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-white/90">
                  Title
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={e => updateField('title', e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  placeholder="Section title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heading" className="text-sm font-medium text-white/90">
                  Heading
                </Label>
                <Input
                  id="heading"
                  value={formData.heading}
                  onChange={e => updateField('heading', e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  placeholder="e.g., March 15-17"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle" className="text-sm font-medium text-white/90">
                Subtitle
              </Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={e => updateField('subtitle', e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                placeholder="e.g., Where Creativity Meets Innovation"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="image" className="text-sm font-medium text-white/90">
                  Primary Image URL
                </Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={e => updateField('image', e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryImage" className="text-sm font-medium text-white/90">
                  Secondary Image URL
                </Label>
                <Input
                  id="secondaryImage"
                  value={formData.secondaryImage}
                  onChange={e => updateField('secondaryImage', e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-white/90">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={e => updateField('description', e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40 min-h-[80px]"
                placeholder="Main description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalDescription" className="text-sm font-medium text-white/90">
                Additional Description
              </Label>
              <Textarea
                id="additionalDescription"
                value={formData.additionalDescription}
                onChange={e => updateField('additionalDescription', e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40 min-h-[80px]"
                placeholder="Additional details"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="featuredLabel" className="text-sm font-medium text-white/90">
                  Featured Label
                </Label>
                <Input
                  id="featuredLabel"
                  value={formData.featuredLabel}
                  onChange={e => updateField('featuredLabel', e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  placeholder="e.g., Annual Conference"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentCount" className="text-sm font-medium text-white/90">
                  Stats / Count
                </Label>
                <Input
                  id="studentCount"
                  value={formData.studentCount}
                  onChange={e => updateField('studentCount', e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  placeholder="e.g., 3,500+ Attendees"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buttonPrimary" className="text-sm font-medium text-white/90">
                  Primary Button
                </Label>
                <Input
                  id="buttonPrimary"
                  value={formData.buttonPrimary}
                  onChange={e => updateField('buttonPrimary', e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  placeholder="e.g., Register Now"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buttonSecondary" className="text-sm font-medium text-white/90">
                  Secondary Button
                </Label>
                <Input
                  id="buttonSecondary"
                  value={formData.buttonSecondary}
                  onChange={e => updateField('buttonSecondary', e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  placeholder="e.g., View Schedule"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="enrollmentText" className="text-sm font-medium text-white/90">
                Supporting Text
              </Label>
              <Input
                id="enrollmentText"
                value={formData.enrollmentText}
                onChange={e => updateField('enrollmentText', e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                placeholder="e.g., Expected this year"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ctaText" className="text-sm font-medium text-white/90">
                CTA Text
              </Label>
              <Input
                id="ctaText"
                value={formData.ctaText}
                onChange={e => updateField('ctaText', e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                placeholder="e.g., Early bird pricing ends soon"
              />
            </div>

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
                <Button type="button" onClick={addHighlight} className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.highlights.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 border border-purple-400/30 rounded-lg text-sm text-white">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      {highlight}
                      <button type="button" onClick={() => removeHighlight(index)} className="ml-1 hover:text-red-400 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {formData.image && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-white/90">Preview</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border border-white/20">
                    <Image src={formData.image} alt="Primary preview" className="object-cover" fill sizes="350px" />
                    <div className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-xs text-white">Primary</div>
                  </div>
                  {formData.secondaryImage && (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-white/20">
                      <Image src={formData.secondaryImage} alt="Secondary preview" className="object-cover" fill sizes="350px" />
                      <div className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-xs text-white">Secondary</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDialog(false)} className="bg-transparent border-white/20 text-white hover:bg-white/10">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white"
            >
              {editingId ? 'Update' : 'Create'} Section
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="bg-slate-900/95 backdrop-blur-xl border border-white/20 text-white sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Section Preview
            </DialogTitle>
          </DialogHeader>

          {previewData && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative w-full h-64 rounded-lg overflow-hidden border border-white/20">
                  <Image src={previewData.image} alt={previewData.title} className="object-cover" fill sizes="400px" />
                  <div className="absolute top-4 right-4 bg-purple-600/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white font-medium">
                    {previewData.featuredLabel}
                  </div>
                </div>
                <div className="relative w-full h-64 rounded-lg overflow-hidden border border-white/20">
                  <Image src={previewData.secondaryImage} alt="Secondary" className="object-cover" fill sizes="400px" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-3xl font-bold text-white">{previewData.title}</h3>
                  <p className="text-purple-400 font-semibold mt-1">{previewData.heading}</p>
                  <p className="text-pink-400 text-sm mt-1">{previewData.subtitle}</p>
                </div>

                <p className="text-white/80 leading-relaxed">{previewData.description}</p>
                <p className="text-white/70 leading-relaxed">{previewData.additionalDescription}</p>

                <div className="flex items-center gap-3 py-2">
                  <span className="text-lg font-bold text-purple-400">{previewData.studentCount}</span>
                  <span className="text-white/60">{previewData.enrollmentText}</span>
                </div>

                {previewData.highlights.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-white/90">Event Highlights</Label>
                    <div className="flex flex-wrap gap-2">
                      {previewData.highlights.map((highlight, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 border border-purple-400/30 rounded-lg text-sm text-white"
                        >
                          <Sparkles className="w-4 h-4 text-purple-400" />
                          {highlight}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-xl p-4">
                  <p className="text-white font-medium">{previewData.ctaText}</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    {previewData.buttonPrimary}
                  </Button>
                  <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10">
                    {previewData.buttonSecondary}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-slate-900/95 backdrop-blur-xl border border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Section</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to delete this section? This action cannot be undone.
            </AlertDialogDescription>
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

export default Mutation;
