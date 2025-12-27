// VideoUploadManager.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Plus, Clapperboard, Film } from 'lucide-react';
import { toast } from 'sonner';
import { UploadButton } from '@/lib/uploadthing';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';

interface VideoUploadManagerProps {
  value: string[];
  onChange: (newValues: string[]) => void;
  label?: string;
}

export default function VideoUploadManager({ value, onChange, label = 'Video Library' }: VideoUploadManagerProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleRemove = (urlToRemove: string) => {
    onChange(value.filter(url => url !== urlToRemove));
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-white text-xl font-black tracking-tight flex items-center gap-2">
            <Film className="w-5 h-5 text-indigo-400" /> {label}
          </h2>
          <p className="text-white/30 text-xs font-medium uppercase tracking-widest">{value.length} Assets Selected</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outlineGlassy" className="rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 transition-all gap-2 group">
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              <span>Add Production</span>
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl p-0 bg-white/5 backdrop-blur-[120px] border-white/10 rounded-[2.5rem] overflow-hidden">
            <div className="p-8 space-y-8">
              <div className="space-y-2">
                <DialogTitle className="text-2xl font-black text-white italic tracking-tighter uppercase">Media Intake</DialogTitle>
                <p className="text-white/40 text-sm">Deploy new cinematic assets to your production library.</p>
              </div>

              <div className="relative group min-h-[300px] border-2 border-dashed border-white/10 rounded-[2rem] bg-white/5 flex flex-col items-center justify-center transition-all duration-500 hover:border-indigo-500/40">
                <AnimatePresence mode="wait">
                  {isUploading ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                      <p className="text-indigo-400 font-bold animate-pulse uppercase tracking-widest text-xs">Synchronizing</p>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center gap-6 p-10 text-center">
                      <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <UploadButton
                          endpoint="videoUploader"
                          appearance={{
                            button: 'bg-white text-black font-black px-8 h-12 rounded-xl active:scale-95 transition-all',
                            allowedContent: 'text-white/20 text-[10px] uppercase font-bold mt-3',
                          }}
                          onUploadBegin={() => setIsUploading(true)}
                          onClientUploadComplete={res => {
                            if (res) {
                              const urls = res.map(f => f.url);
                              onChange([...urls, ...value]);
                              setIsUploading(false);
                              toast.success('Assets encoded successfully');
                            }
                          }}
                          onUploadError={err => {
                            setIsUploading(false);
                            toast.error(err.message);
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-white font-bold">Cloud Deployment</p>
                        <p className="text-white/30 text-xs max-w-[200px]">Drag and drop MP4 or WebM files directly into the studio.</p>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="min-h-[160px] rounded-[2rem] p-6 bg-white/5 border border-white/10 backdrop-blur-md">
        <ScrollArea className="w-full">
          {value.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
              <AnimatePresence initial={false}>
                {value.map((url, index) => (
                  <motion.div
                    key={url}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/10"
                  >
                    <video src={url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-white/10 backdrop-blur-md rounded-lg">
                            <Play className="w-3 h-3 text-white fill-white" />
                          </div>
                          <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Preview</span>
                        </div>
                        <button
                          onClick={() => handleRemove(url)}
                          className="p-2 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 opacity-20">
              <Clapperboard className="w-12 h-12 mb-4" />
              <p className="font-bold uppercase tracking-widest text-sm">No Content Allocated</p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
