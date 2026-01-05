look at the ImageUploadmanager.tsx 
```
'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { Plus, X, UploadCloud, Loader2, ImageIcon, Ghost, Search, CheckCircle2, Layers, Zap } from 'lucide-react';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

import { useGetMediasQuery, useAddMediaMutation } from '@/redux/features/media/mediaSlice';

interface InternalImageDialogProps {
  onImageToggle: (url: string) => void;
  selectedImages: string[];
}

const InternalImageVault = ({ onImageToggle, selectedImages }: InternalImageDialogProps) => {
  const { data: response, isLoading: isFetching } = useGetMediasQuery({});
  const [addMedia, { isLoading: isAdding }] = useAddMediaMutation();
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const availableImages = useMemo(() => {
    if (!response?.data) return [];
    return (
      response.data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((item: any) => item.contentType === 'image' && item.status === 'active')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((item: any) => (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [response, searchQuery]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLocal(true);
    try {
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);

      const formData = new FormData();
      formData.append('image', compressedFile);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        await addMedia({
          url: data.data.url,
          name: file.name,
          contentType: 'image',
          status: 'active',
        }).unwrap();

        toast.success('Asset synchronized to vault');
        onImageToggle(data.data.url);
      }
    } catch {
      toast.error('Upload sequence failed');
    } finally {
      setIsUploadingLocal(false);
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-col h-[85vh] md:h-[75vh] border border-slate-100/50 rounded-xl backdrop-blur-3xl">
      <DialogHeader className="p-8 border-b border-white/5  ">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="hidden">
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent"></DialogTitle>
            <DialogDescription className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30"></DialogDescription>
          </div>

          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                placeholder="Search Assets..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-indigo-500/50 w-full md:w-64 transition-all"
              />
            </div>

            <label className="cursor-pointer group">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploadingLocal || isAdding} />
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500/20 transition-all shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                {isUploadingLocal || isAdding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                Upload
              </div>
            </label>
          </div>
        </div>
      </DialogHeader>

      <ScrollArea className="flex-1 p-8">
        {isFetching ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
              <Layers className="absolute inset-0 m-auto w-6 h-6 text-indigo-500/40" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 animate-pulse">Decrypting Records...</span>
          </div>
        ) : availableImages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4   gap-6">
            <AnimatePresence mode="popLayout">
              {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                availableImages.map((item: any, idx: number) => {
                  const isSelected = selectedImages.includes(item.url);
                  return (
                    <motion.div
                      key={item.url}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      onClick={() => onImageToggle(item.url)}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-500 group
                      ${isSelected ? 'border-emerald-500/50 scale-95 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'border-white/5 hover:border-white/20 hover:scale-105'}
                    `}
                    >
                      <Image
                        src={item.url}
                        fill
                        alt="Vault Item"
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        unoptimized
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/70 truncate">{item.name || 'ASSET_IDENTIFIED'}</span>
                      </div>

                      {isSelected && (
                        <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center backdrop-blur-[2px]">
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-emerald-500 text-white rounded-full p-2 shadow-2xl">
                            <CheckCircle2 className="w-5 h-5" />
                          </motion.div>
                        </div>
                      )}
                    </motion.div>
                  );
                })
              }
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 opacity-20 space-y-6">
            <Ghost className="w-20 h-20 animate-bounce" />
            <div className="text-center">
              <h3 className="text-2xl font-black uppercase tracking-[0.4em]">Zero Results</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-2">No detectable signatures found</p>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default function ImageUploadManager({
  value,
  onChange,
  label = 'Image Gallery',
}: {
  value: string[];
  onChange: (val: string[]) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleImage = (url: string) => {
    if (value.includes(url)) {
      onChange(value.filter(item => item !== url));
    } else {
      onChange([...value, url]);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between px-1">
        <div className="space-y-1">
          <h4 className="text-sm text-white/40 ">{label}</h4>
          <p className="text-[8px] font-bold uppercase tracking-widest text-white/10">{value.length} Items Selected</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outlineGlassy" size="sm">
              <Plus className="w-3.5 h-3.5" /> Select
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl bg-transparent border-none p-0 shadow-none ">
            <InternalImageVault selectedImages={value} onImageToggle={toggleImage} />
          </DialogContent>
        </Dialog>
      </div>  

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 p-6 rounded-4xl bg-slate-950/20 border border-white/5 backdrop-blur-3xl  md:h-[39vh] transition-all">
        <AnimatePresence mode="popLayout">
          {value.map((url, idx) => (
            <motion.div
              key={url}
              layout
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="relative group"
            >
              <div className="relative w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl shadow-2xl overflow-hidden group-hover:border-indigo-500/30 transition-colors duration-500">
                <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="relative w-full h-full">
                  <Image src={url} fill alt="Selected Asset" className="object-cover transition-transform duration-700 group-hover:scale-110" unoptimized />
                </motion.div>

                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <button
                  type="button"
                  onClick={() => onChange(value.filter(item => item !== url))}
                  className="absolute top-1.5 right-1.5 z-20 p-1.5 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <Zap className="absolute -top-1 -right-1 w-5 h-5 text-indigo-500/40 animate-pulse pointer-events-none z-10" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {value.length === 0 && (
          <div className="w-full flex-col min-w-96 gap-4  ">
            <div className="w-full flex gap-4   ">
              <div className="relative w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl shadow-2xl group-hover:border-indigo-500/30 transition-colors duration-500">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl">
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
                  />
                </div>

                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                  <ImageIcon className="w-10 h-10 text-white/20 group-hover:text-indigo-400/60 transition-colors duration-500" />
                </motion.div>

                <Zap className="absolute -top-1 -right-1 w-5 h-5 text-indigo-500/40 animate-pulse" />
              </div>
              <div className="relative w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl shadow-2xl group-hover:border-indigo-500/30 transition-colors duration-500">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl">
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
                  />
                </div>

                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                  <ImageIcon className="w-10 h-10 text-white/20 group-hover:text-indigo-400/60 transition-colors duration-500" />
                </motion.div>

                <Zap className="absolute -top-1 -right-1 w-5 h-5 text-indigo-500/40 animate-pulse" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

```

and here is VideoUploadManager.tsx
```
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
              <span>Add Video</span>
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

```


Now Your task is update VideoUploadManager so it working like ImageUploadManager. 
And remember One things Please do not change color-combination, and do not change style. 