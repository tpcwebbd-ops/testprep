'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { X, UploadCloud, Loader2, ImageIcon, Ghost, RefreshCcw, Search, CheckCircle2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

import { useGetMediasQuery, useAddMediaMutation } from '@/redux/features/media/mediaSlice';

interface InternalImageDialogProps {
  onImageSelect: (newImage: string) => void;
  selectedImage: string;
}

const InternalImageVault = ({ onImageSelect, selectedImage }: InternalImageDialogProps) => {
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
        onImageSelect(data.data.url);
      }
    } catch {
      toast.error('Vault uplink failed');
    } finally {
      setIsUploadingLocal(false);
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-col h-[85vh] md:h-[70vh] bg-slate-950/60 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden border border-white/10">
      <DialogHeader className="p-8 border-b border-white/5 bg-white/[0.02]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
              Vault Selection
            </DialogTitle>
            <DialogDescription className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
              Identifying visual signature for reference
            </DialogDescription>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                placeholder="Query ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-indigo-500/50 w-full md:w-48 transition-all"
              />
            </div>

            <label className="cursor-pointer group">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploadingLocal || isAdding} />
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest group-hover:bg-emerald-500/20 transition-all shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                {isUploadingLocal || isAdding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                New Uplink
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
              <Zap className="absolute inset-0 m-auto w-6 h-6 text-indigo-500/40" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 animate-pulse">Syncing Vault Data...</span>
          </div>
        ) : availableImages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                availableImages.map((item: any, idx: number) => {
                  const isSelected = selectedImage === item.url;
                  return (
                    <motion.div
                      key={item.url}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => onImageSelect(item.url)}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-500 group
                      ${isSelected ? 'border-indigo-500 scale-95 shadow-[0_0_40px_rgba(99,102,241,0.3)]' : 'border-white/5 hover:border-white/20 hover:scale-105'}
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
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/60 truncate">{item.name || 'SIGNATURE_DETECTED'}</span>
                      </div>
                      {isSelected && (
                        <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center backdrop-blur-[2px]">
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-indigo-500 text-white rounded-full p-2.5 shadow-2xl">
                            <CheckCircle2 className="w-6 h-6" />
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
              <h3 className="text-2xl font-black uppercase tracking-[0.4em]">Zero Assets</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-2">The quadrant appears to be empty</p>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default function ImageUploadManagerSingle({
  value,
  onChange,
  label = 'Reference Asset',
}: {
  value: string;
  onChange: (val: string) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic">{label}</h4>
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange('')}
            className="h-6 text-red-400/60 hover:text-red-400 text-[9px] font-black uppercase tracking-widest bg-red-500/5 hover:bg-red-500/10"
          >
            <X className="w-3 h-3 mr-1" /> Terminate
          </Button>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="group relative w-full aspect-video rounded-[2rem] border-2 border-dashed border-white/5 hover:border-indigo-500/40 bg-white/[0.02] backdrop-blur-[120px] transition-all duration-700 cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-4">
            {value ? (
              <>
                <Image
                  src={value}
                  fill
                  alt="Selected Signature"
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  unoptimized
                />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                  <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[0.2em] text-white scale-90 group-hover:scale-100 transition-transform">
                    <RefreshCcw className="w-4 h-4 animate-[spin_4s_linear_infinite]" />
                    Change Signature
                  </div>
                </div>
              </>
            ) : (
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 3, repeat: Infinity }} className="flex flex-col items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-all duration-500">
                  <ImageIcon className="w-8 h-8 text-white/20 group-hover:text-indigo-400" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-white transition-colors">Awaiting Selection</p>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-white/10 italic">Open vault records to proceed</p>
                </div>
              </motion.div>
            )}
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2rem] pointer-events-none" />
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl bg-transparent border-none p-0 shadow-none overflow-hidden">
          <InternalImageVault
            selectedImage={value}
            onImageSelect={url => {
              onChange(url);
              setIsOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
