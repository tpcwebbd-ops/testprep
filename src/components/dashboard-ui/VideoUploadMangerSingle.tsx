// VideoUploadManagerSingle.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, RefreshCw, ShieldCheck, UploadCloud, MonitorPlay } from 'lucide-react';
import { toast } from 'sonner';
import { UploadButton } from '@/lib/uploadthing';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';

interface VideoUploadManagerSingleProps {
  value: string;
  onChange: (newValue: string) => void;
  label?: string;
}

export default function VideoUploadManagerSingle({ value, onChange, label = 'Feature Video' }: VideoUploadManagerSingleProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-white/90 text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2">
          <MonitorPlay className="w-4 h-4 text-indigo-400" /> {label}
        </h2>
        {value && (
          <button onClick={() => onChange('')} className="text-red-400/50 hover:text-red-400 text-[10px] font-bold uppercase transition-colors">
            Clear Source
          </button>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="relative group w-full aspect-video rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden cursor-pointer transition-all duration-500 hover:border-white/20">
            {value ? (
              <div className="relative w-full h-full">
                <video src={value} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} whileHover={{ scale: 1, opacity: 1 }} className="flex gap-3">
                    <div className="p-4 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
                      <RefreshCw className="w-6 h-6 text-white" />
                    </div>
                  </motion.div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                  <div className="px-4 py-2 bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 rounded-full flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-indigo-400" />
                    <span className="text-[10px] font-black text-indigo-300 uppercase italic">Verified Source</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
                  <Video className="w-8 h-8 text-white/20 group-hover:text-white/60" />
                </div>
                <div className="text-center">
                  <p className="text-white/40 font-bold text-sm">Initialize Media Asset</p>
                  <p className="text-white/20 text-[10px] uppercase font-medium mt-1">Select from library or upload</p>
                </div>
              </div>
            )}
          </div>
        </DialogTrigger>

        <DialogContent className="max-w-xl p-0 bg-[#020617]/80 backdrop-blur-[120px] border-white/10 rounded-[3rem] overflow-hidden">
          <div className="p-10 space-y-10">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-indigo-500/10 rounded-3xl border border-indigo-500/20">
                <UploadCloud className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-2xl font-black text-white italic tracking-tighter uppercase">Source Selection</DialogTitle>
                <p className="text-white/40 text-xs font-medium">Connect your high-resolution production master.</p>
              </div>
            </div>

            <div className="relative min-h-[280px] border-2 border-dashed border-white/10 rounded-[2.5rem] bg-white/5 flex flex-col items-center justify-center transition-all duration-500 hover:border-indigo-500/40">
              <AnimatePresence mode="wait">
                {isUploading ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="text-indigo-400 font-black tracking-[0.2em] text-[10px] uppercase italic">Encoding Streams</p>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center gap-8 text-center p-8">
                    <UploadButton
                      endpoint="videoUploader"
                      appearance={{
                        button: 'bg-white text-black font-black px-12 h-14 rounded-2xl shadow-2xl hover:bg-white/90 transition-all',
                        allowedContent: 'text-white/20 text-[10px] font-bold uppercase tracking-widest mt-4',
                      }}
                      onUploadBegin={() => setIsUploading(true)}
                      onClientUploadComplete={res => {
                        if (res && res[0]) {
                          onChange(res[0].url);
                          setIsUploading(false);
                          setIsOpen(false);
                          toast.success('Production source updated');
                        }
                      }}
                      onUploadError={err => {
                        setIsUploading(false);
                        toast.error(err.message);
                      }}
                    />
                    <div className="space-y-2">
                      <p className="text-white font-black uppercase text-xs italic tracking-widest">Master File Interface</p>
                      <p className="text-white/20 text-[10px] max-w-[200px] leading-relaxed">Ensure bitrate compliance before deployment.</p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
