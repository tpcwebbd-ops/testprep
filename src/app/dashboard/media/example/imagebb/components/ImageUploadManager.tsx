'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Plus, X, UploadCloud, Loader2, ImageIcon, Ghost, Search, CheckCircle2, Layers, Zap, ChevronLeft, ChevronRight, ImagesIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

import { useGetMediasQuery, useAddMediaMutation } from '@/redux/features/media/mediaSlice';

interface MediaItem {
  _id: string;
  name: string;
  url: string;
  status: string;
  contentType: string;
  createdAt: string;
  updatedAt: string;
}

interface MediaResponse {
  data: MediaItem[];
  total: number;
  page: number;
  limit: number;
}

interface InternalImageDialogProps {
  onImageToggle: (url: string) => void;
  selectedImages: string[];
}

const InternalImageVault = ({ onImageToggle, selectedImages }: InternalImageDialogProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: response,
    isLoading: isFetching,
    isFetching: isRefetching,
  } = useGetMediasQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    q: debouncedSearch,
    contentType: 'image',
    status: 'active',
  }) as { data: MediaResponse | undefined; isLoading: boolean; isFetching: boolean };

  const [addMedia, { isLoading: isAdding }] = useAddMediaMutation();
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableImages = useMemo(() => response?.data || [], [response]);

  const totalPages = useMemo(() => {
    if (!response?.total || !response?.limit) return 1;
    return Math.ceil(response.total / response.limit);
  }, [response]);

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
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-[85vh] md:h-[80vh] border border-white/50 rounded-sm backdrop-blur-3xl  bg-white/2 overflow-hidden shadow-2xl">
      <DialogHeader className="p-6 border-b border-white/5 bg-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
          <div className="hidden">
            <DialogTitle>Media Collection</DialogTitle>
            <DialogDescription>Manage and select multiple assets</DialogDescription>
          </div>

          <div className="relative group w-full max-w-md">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isRefetching ? 'text-indigo-400 animate-pulse' : 'text-white/20'}`}
            />
            <input
              type="text"
              placeholder="SEARCH ASSET SIGNATURES..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-sm pl-12 pr-4 py-3 text-[11px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-indigo-500/50 w-full transition-all placeholder:text-white/20"
            />
          </div>
        </div>
      </DialogHeader>

      <ScrollArea className="flex-1 p-8">
        {isFetching ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full"
              />
              <Layers className="absolute inset-0 m-auto w-6 h-6 text-indigo-500/40" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 animate-pulse">Decrypting Records...</span>
          </div>
        ) : availableImages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            <AnimatePresence mode="popLayout">
              {availableImages.map((item, idx) => {
                const isSelected = selectedImages.includes(item.url);
                return (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.02, type: 'spring', stiffness: 260, damping: 20 }}
                    onClick={() => onImageToggle(item.url)}
                    className={`relative aspect-square rounded-sm overflow-hidden border-2 cursor-pointer transition-all duration-500 group
                    ${
                      isSelected
                        ? 'border-emerald-500/50 scale-95 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                        : 'border-white/5 hover:border-white/20 hover:scale-105'
                    }
                  `}
                  >
                    <Image src={item.url} fill alt={item.name} className="object-cover transition-transform duration-1000 group-hover:scale-110" unoptimized />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/70 truncate">{item.name}</span>
                    </div>

                    {isSelected && (
                      <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center backdrop-blur-[2px]">
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="bg-emerald-500 text-white rounded-full p-2.5 shadow-2xl"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 opacity-20 space-y-6">
            <Ghost className="w-20 h-20 animate-bounce" />
            <div className="text-center">
              <h3 className="text-2xl font-black uppercase tracking-[0.4em]">Zero Results</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-2">No detectable signatures found</p>
            </div>
          </div>
        )}
      </ScrollArea>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 border-t border-white/5 bg-white/5">
        <div className="flex items-center gap-3">
          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1 h-10 w-10 p-0"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isFetching}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </Button>

          <div className="flex items-center gap-3 px-5 h-10 rounded-sm bg-white/5 border border-white/10">
            <span className="text-[11px] font-black text-white">{currentPage}</span>
            <span className="text-[10px] font-black text-white/20">/</span>
            <span className="text-[11px] font-black text-white/60">{totalPages}</span>
          </div>

          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1 h-10 w-10 p-0"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || isFetching}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </Button>

          <div className="hidden sm:block ml-4">
            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Total: {response?.total || 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageUpload} />
          <Button onClick={() => fileInputRef.current?.click()} disabled={isUploadingLocal || isAdding} variant="outlineGlassy" size="sm">
            {isUploadingLocal || isAdding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UploadCloud className="w-4 h-4 mr-2" />}
            {isAdding || isUploadingLocal ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function ImageUploadManager({ value, onChange, label = 'IMAGES' }: { value: string[]; onChange: (val: string[]) => void; label?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleImage = (url: string) => {
    if (value.includes(url)) {
      onChange(value.filter(item => item !== url));
    } else {
      onChange([...value, url]);
    }
  };

  return (
    <div className="space-y-5 w-full">
      <div className="flex items-center justify-between px-1">
        <div className="space-y-1">
          <div className="w-full flex items-start justify-start gap-2">
            <ImagesIcon className="w-3.5 h-3.5" />
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{label}</label>
          </div>
          <p className="text-[8px] font-bold uppercase tracking-widest text-white/90">{value.length} Selected</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outlineGlassy" size="sm" className="min-w-1">
              <Plus className="w-3.5 h-3.5" /> Select
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl bg-transparent border-none p-0 shadow-none text-white mt-4">
            <InternalImageVault selectedImages={value} onImageToggle={toggleImage} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 p-8 rounded-sm bg-white/2 border border-white/50 backdrop-blur-3xl min-h-[25vh] transition-all">
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
              <div className="relative aspect-square rounded-sm bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl shadow-2xl overflow-hidden group-hover:border-indigo-500/30 transition-colors duration-500">
                <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="relative w-full h-full">
                  <Image src={url} fill alt="Linked Asset" className="object-cover transition-transform duration-700 group-hover:scale-110" unoptimized />
                </motion.div>

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => onChange(value.filter(item => item !== url))}
                    className="p-3 rounded-sm bg-rose-500/20 border border-rose-500/50 text-rose-400 hover:bg-rose-500 hover:text-white transition-all duration-300 transform scale-90 group-hover:scale-100 shadow-2xl"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <Zap className="absolute -top-1 -right-1 w-5 h-5 text-indigo-500/40 animate-pulse pointer-events-none z-10" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {value.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-10 gap-4">
            <div className="flex gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="relative w-20 h-20 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center">
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 40px rgba(99,102,241,0.2)', '0 0 0px rgba(99,102,241,0)'],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-20 h-20 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-indigo-500/40 group-hover:bg-indigo-500/5 transition-all duration-500"
                  >
                    <ImageIcon className="w-10 h-10 text-white/20 group-hover:text-indigo-400" />
                  </motion.div>
                </div>
              ))}
            </div>
            <div className="text-center space-y-2">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90 group-hover:text-white transition-colors">No Images Selected</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
