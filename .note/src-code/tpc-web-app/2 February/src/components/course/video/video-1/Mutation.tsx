'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Type, FileText, Clock, Calendar, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import VideoUploadManagerSingle from '@/components/dashboard-ui/VideoUploadMangerSingle';

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

  const handleVideoUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, url }));
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-6xl mx-auto backdrop-blur-[120px] border border-white/10 rounded-[2.5rem] overflow-hidden bg-white/[0.01]"
    >
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-0">
        <div className="lg:col-span-7 p-6 md:p-10 space-y-10 border-b lg:border-b-0 lg:border-r border-white/10">
          <motion.div variants={itemVariants} className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                <Film className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Production Studio</h2>
                <p className="text-white/40 text-sm font-medium">Configure video properties and metadata</p>
              </div>
            </div>
          </motion.div>

          <div className="space-y-8">
            <motion.div variants={itemVariants} className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-white/30 flex items-center gap-2 px-1">
                <Type className="w-3.5 h-3.5" /> Media Title
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ex: Advanced Motion Graphics"
                className="h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:border-indigo-500/50 transition-all placeholder:text-white/20"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-white/30 flex items-center gap-2 px-1">
                <FileText className="w-3.5 h-3.5" /> Synopsis
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Briefly describe the content of this production..."
                className="min-h-[120px] bg-white/5 border-white/10 text-white rounded-2xl focus:border-indigo-500/50 transition-all placeholder:text-white/20 resize-none p-4"
              />
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div variants={itemVariants} className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-white/30 flex items-center gap-2 px-1">
                  <Clock className="w-3.5 h-3.5" /> Length (Sec)
                </label>
                <Input
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:border-indigo-500/50 transition-all"
                />
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-white/30 flex items-center gap-2 px-1">
                  <Calendar className="w-3.5 h-3.5" /> Air Date
                </label>
                <Input
                  type="date"
                  value={formData.startDate.toISOString().split('T')[0]}
                  onChange={e => handleDateChange('startDate', e.target.value)}
                  className="h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:border-indigo-500/50 transition-all [color-scheme:dark]"
                />
              </motion.div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 p-6 md:p-10 flex flex-col gap-8 bg-white/[0.02]">
          <motion.div variants={itemVariants} className="flex-1">
            <VideoUploadManagerSingle value={formData.url} onChange={handleVideoUrlChange} label="Asset Deployment" />
          </motion.div>

          <motion.div variants={itemVariants} className="mt-auto flex justify-end">
            <Button
              onClick={() => onSave(formData)}
              disabled={!formData.url}
              variant="outlineGlassy"
              className="w-full h-16 rounded-2xl font-black text-lg gap-3"
            >
              <Save className="w-6 h-6" />
              Commit Changes
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Mutation;
