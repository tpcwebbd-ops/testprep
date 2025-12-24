// components/video/Mutation.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Save, Type, FileText, Clock, Calendar, Video, CheckCircle2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { IVideo1 } from './data';
import { toast } from 'react-toastify';

const Mutation = () => {
  const [formData, setFormData] = useState<IVideo1>({
    uid: crypto.randomUUID(),
    name: '',
    description: '',
    duration: 0,
    url: '',
    startDate: new Date(),
    endDate: new Date(),
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
      toast.success('Video uploaded successfully!', {
        style: {
          background: '#1e1b4b',
          color: '#fff',
          border: '1px solid #4338ca',
        },
      });
      console.log('Video URL:', mockUrl);
    }, 2000);
  };

  const handleSave = () => {
    if (!formData.url) {
      toast.error('Please upload a video first');
      return;
    }
    console.log('Final Data:', formData);
    toast.success('Metadata updated and saved!');
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl">
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl shadow-2xl">
          <CardHeader className="border-b border-slate-800/50 pb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                <Video className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Video Mutation</CardTitle>
                <CardDescription className="text-slate-400 text-lg">Configure and upload your cinematic content</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Type className="w-4 h-4 text-indigo-400" /> Video Title
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter video title..."
                    className="bg-slate-950/50 border-slate-800 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" /> Description
                  </label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your video content..."
                    className="bg-slate-950/50 border-slate-800 min-h-[120px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-400" /> Duration (s)
                    </label>
                    <Input name="duration" type="number" value={formData.duration} onChange={handleInputChange} className="bg-slate-950/50 border-slate-800" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-400" /> Start Date
                    </label>
                    <Input
                      type="date"
                      onChange={e => handleDateChange('startDate', e.target.value)}
                      className="bg-slate-950/50 border-slate-800 text-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between space-y-6">
                <div
                  onClick={handleUploadClick}
                  className={`relative h-full min-h-[250px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-500 group
                    ${
                      formData.url
                        ? 'border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]'
                        : 'border-slate-700 bg-slate-950/30 hover:border-indigo-500/50 hover:bg-indigo-500/5'
                    }`}
                >
                  <AnimatePresence mode="wait">
                    {isUploading ? (
                      <motion.div
                        key="uploading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-3"
                      >
                        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                        <p className="text-indigo-400 font-medium animate-pulse">Processing Video...</p>
                      </motion.div>
                    ) : formData.url ? (
                      <motion.div
                        key="complete"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center gap-3"
                      >
                        <div className="p-4 bg-emerald-500/20 rounded-full">
                          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                        </div>
                        <p className="text-emerald-500 font-semibold text-center px-4">Video Link Secured</p>
                        <span className="text-xs text-slate-500 truncate max-w-[200px]">{formData.url}</span>
                      </motion.div>
                    ) : (
                      <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 p-6">
                        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Upload className="w-8 h-8 text-indigo-400 group-hover:text-indigo-300" />
                        </div>
                        <div className="text-center">
                          <p className="text-slate-300 font-medium">Click to upload video</p>
                          <p className="text-xs text-slate-500 mt-1">MP4, WEBM or OGG (Max. 100MB)</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Button
                  onClick={handleSave}
                  className="w-full h-14 text-lg font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl transition-all hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] active:scale-95 flex gap-2"
                >
                  <Save className="w-5 h-5" /> Save Production
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Mutation;
