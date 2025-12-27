'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Save, Type, FileText, Clock, Calendar, Video, CheckCircle2, Loader2, Sparkles, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface IVideo1 {
  uid: string;
  name: string;
  description: string;
  duration: number;
  url: string;
  startDate: Date;
  endDate: Date;
}

interface MutationProps {
  data: string;
  onSave: (data: IVideo1) => void;
}

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const Mutation = ({ data, onSave }: MutationProps) => {
  const [formData, setFormData] = useState<IVideo1>(() => {
    try {
      const parsed = JSON.parse(data);
      return {
        ...parsed,
        startDate: parsed.startDate ? new Date(parsed.startDate) : new Date(),
        endDate: parsed.endDate ? new Date(parsed.endDate) : new Date(),
      };
    } catch {
      return {
        uid: crypto.randomUUID(),
        name: '',
        description: '',
        duration: 0,
        url: '',
        startDate: new Date(),
        endDate: new Date(),
      };
    }
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? Number(value) : value,
    }));
  };

  const handleDateChange = (name: 'startDate' | 'endDate', value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: new Date(value),
    }));
  };

  const handleUploadClick = () => {
    setIsUploading(true);
    setTimeout(() => {
      const mockUrl = `https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`;
      setFormData(prev => ({ ...prev, url: mockUrl }));
      setIsUploading(false);
      toast.success('Cinematic source synchronized');
    }, 2000);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-5xl mx-auto backdrop-blur-[120px] border border-white/10 p-1"
    >
      <div className="flex flex-col lg:flex-row gap-12 p-6">
        <div className="flex-1 space-y-10">
          <motion.div variants={itemVariants} className="space-y-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-indigo-500/10   border border-indigo-500/20">
                <Film className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Production Metadata</h2>
                <p className="text-white/40 text-sm font-medium">Define the core attributes of your media</p>
              </div>
            </div>
          </motion.div>

          <div className="space-y-8">
            <motion.div variants={itemVariants} className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-white/30 flex items-center gap-2 px-1">
                <Type className="w-3.5 h-3.5" /> Video Title
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ex: Masterclass Chapter 01"
                className="h-14 bg-white/5 border-white/10 text-white   focus:border-indigo-500/50 transition-all placeholder:text-white/20"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-white/30 flex items-center gap-2 px-1">
                <FileText className="w-3.5 h-3.5" /> Narrative Description
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide context for this cinematic content..."
                className="min-h-[140px] bg-white/5 border-white/10 text-white   focus:border-indigo-500/50 transition-all placeholder:text-white/20 resize-none p-4"
              />
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div variants={itemVariants} className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-white/30 flex items-center gap-2 px-1">
                  <Clock className="w-3.5 h-3.5" /> Runtime (Seconds)
                </label>
                <Input
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="h-14 bg-white/5 border-white/10 text-white   focus:border-indigo-500/50 transition-all"
                />
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-white/30 flex items-center gap-2 px-1">
                  <Calendar className="w-3.5 h-3.5" /> Release Date
                </label>
                <Input
                  type="date"
                  value={formData.startDate.toISOString().split('T')[0]}
                  onChange={e => handleDateChange('startDate', e.target.value)}
                  className="h-14 bg-white/5 border-white/10 text-white   focus:border-indigo-500/50 transition-all [color-scheme:dark]"
                />
              </motion.div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[380px] flex flex-col gap-8">
          <motion.div
            variants={itemVariants}
            onClick={handleUploadClick}
            className={`relative group h-[300px] md:h-full min-h-[300px]   border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-700 overflow-hidden
              ${formData.url ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/10 bg-white/5 hover:border-indigo-500/40 hover:bg-indigo-500/5'}`}
          >
            <AnimatePresence mode="wait">
              {isUploading ? (
                <motion.div
                  key="uploading"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="relative">
                    <Loader2 className="w-16 h-16 text-indigo-400 animate-spin" />
                    <Sparkles className="w-6 h-6 text-white absolute top-0 right-0 animate-pulse" />
                  </div>
                  <p className="text-indigo-300 font-black tracking-tighter text-xl italic uppercase">Encrypting</p>
                </motion.div>
              ) : formData.url ? (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-6 p-8 text-center"
                >
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-emerald-400 font-bold text-lg mb-1">Stream Ready</p>
                    <p className="text-white/30 text-xs font-mono break-all line-clamp-2">{formData.url}</p>
                  </div>
                  <Button variant="outlineGlassy" size="sm" className="rounded-full border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10">
                    Replace Source
                  </Button>
                </motion.div>
              ) : (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-6 p-8 text-center">
                  <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-indigo-500/30 transition-all duration-500 shadow-2xl">
                    <Upload className="w-10 h-10 text-white/20 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-white font-bold text-lg">Upload Media</p>
                    <p className="text-white/30 text-sm leading-relaxed">Drag and drop your high-bitrate master file or click to browse.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {formData.url && !isUploading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 pointer-events-none border-[1px] border-emerald-500/20 rounded-[2.5rem]"
              />
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="mt-auto flex justify-end">
            <Button onClick={() => onSave(formData)} variant="outlineGlassy">
              <Save className="w-6 h-6" />
              Commit Production
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Mutation;
