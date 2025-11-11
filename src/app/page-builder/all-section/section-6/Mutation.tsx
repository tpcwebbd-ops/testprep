'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
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
  sectionUid: 'section-uid-6',
  id: 'community_section_005',
  title: 'Join the Developer Community',
  image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
  heading: 'Growing Fast',
  description:
    'Connect with thousands of developers worldwide. Share knowledge, collaborate on projects, get mentorship, and grow your career in a supportive environment.',
  featuredLabel: 'Global Network',
  buttonPrimary: 'Join Community',
  buttonSecondary: 'Explore Features',
  studentCount: '50k+ Members',
  enrollmentText: 'Active developers',
  secondaryImage: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
  subtitle: 'Learn. Build. Connect. Grow.',
  additionalDescription:
    'Our thriving community offers daily discussions, weekly webinars, monthly hackathons, and year-round mentorship programs. Whether you are just starting or are an experienced professional, you will find value.',
  ctaText: 'Free forever - Premium features available',
  highlights: ['Weekly webinars', 'Career resources', 'Open source projects'],
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

  const updateField = (field: keyof ISectionData, value: string | string[]) => {
    setFormData({ ...formData, [field]: value });
  };

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

  const handlePreview = (section: ISectionData) => {
    setPreviewData(section);
    setShowPreviewDialog(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      setSections(sections.filter(s => s.id !== deletingId));
      setShowDeleteDialog(false);
      setDeletingId(null);
    }
  };

  const handleSave = () => {
    if (editingId) {
      setSections(sections.map(s => (s.id === editingId ? formData : s)));
    } else {
      setSections([...sections, formData]);
    }
    setShowDialog(false);
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
    <main className="min-h-screen p-8 relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900" />

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Info Banner */}
        {isUsingDefaultData && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-2xl bg-blue-500/10 border border-blue-400/30 rounded-2xl p-4 flex items-center gap-3 shadow-lg"
          >
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <p className="text-blue-300 text-sm font-medium">No data provided — displaying default section data</p>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between glassy-card border border-white/10 p-6 rounded-2xl"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-md">
              Section Mutation
            </h1>
            <p className="text-white/70 mt-2">Manage sections with style ✨</p>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={handleAdd} className="glassy-button bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white gap-2 shadow-lg">
              <Plus className="w-4 h-4" />
              Add Section
            </Button>
          </motion.div>
        </motion.div>

        {/* Cards */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-400/50 transition-all duration-300 shadow-lg hover:shadow-purple-500/20 group">
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image src={section.image} alt={section.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-2 right-2 bg-purple-600/90 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white font-medium shadow-md">
                      {section.featuredLabel}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-white text-lg font-bold">{section.title}</h3>
                    <p className="text-purple-300 text-sm">{section.subtitle}</p>
                    <p className="text-white/70 text-sm line-clamp-2">{section.description}</p>
                    <div className="flex gap-2 flex-wrap">
                      {section.highlights.slice(0, 3).map((h, i) => (
                        <span
                          key={i}
                          className="text-xs text-purple-300 bg-purple-500/20 border border-purple-400/30 px-2 py-1 rounded-md flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex p-4 gap-2 bg-white/5 border-t border-white/10">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(section)}
                      className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10 gap-2 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleEdit(section)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition-all"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDelete(section.id)}
                      className="flex-1 bg-transparent border border-red-400/40 text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
};

export default Mutation;
