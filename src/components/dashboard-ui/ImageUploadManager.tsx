'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { Plus, X, UploadCloud, Loader2, ImageIcon, Ghost } from 'lucide-react';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useGetMediasQuery, useAddMediaMutation } from '@/redux/features/media/mediaSlice';
import { motion, AnimatePresence } from 'framer-motion';

interface InternalImageDialogProps {
  onImageSelect: (newImage: string) => void;
  selectedImages: string[];
}

const InternalImageDialog = ({ onImageSelect, selectedImages }: InternalImageDialogProps) => {
  const { data: response, isLoading: isFetching } = useGetMediasQuery({});
  const [addMedia, { isLoading: isAdding }] = useAddMediaMutation();
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);

  const availableImages = useMemo(() => {
    if (!response?.data) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.data.filter((item: any) => item.contentType === 'image' && item.status === 'active').map((item: any) => item.url);
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
        onImageSelect(data.data.url);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Upload sequence failed');
    } finally {
      setIsUploadingLocal(false);
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-col h-[70vh]">
      <DialogHeader className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <DialogTitle className="text-sm font-black uppercase tracking-[0.2em] text-white/90 italic">Vault Explorer</DialogTitle>
          <label className="cursor-pointer">
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploadingLocal || isAdding} />
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500/30 transition-all">
              {isUploadingLocal || isAdding ? <Loader2 className="w-3 h-3 animate-spin" /> : <UploadCloud className="w-3 h-3" />}
              Upload New
            </div>
          </label>
        </div>
      </DialogHeader>

      <ScrollArea className="flex-1 p-6">
        {isFetching ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Accessing Records...</span>
          </div>
        ) : availableImages.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {availableImages.map((url: string) => {
              const isSelected = selectedImages.includes(url);
              return (
                <div
                  key={url}
                  onClick={() => !isSelected && onImageSelect(url)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-500 cursor-pointer group
                    ${isSelected ? 'border-indigo-500 scale-95 opacity-50' : 'border-white/5 hover:border-white/20 hover:scale-105'}
                  `}
                >
                  <Image src={url} fill alt="Vault Item" className="object-cover" unoptimized />
                  {isSelected && (
                    <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center">
                      <div className="bg-white text-indigo-600 rounded-full p-1 shadow-xl">
                        <X className="w-3 h-3" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-20">
            <Ghost className="w-12 h-12 mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest">No Signatures Detected</p>
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
  const removeImage = (url: string) => onChange(value.filter(item => item !== url));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{label}</h4>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outlineWater" size="xs" className="rounded-lg">
              <Plus className="w-3 h-3" /> Select
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-[#020617]/95 backdrop-blur-2xl border-white/10 p-0 overflow-hidden rounded-[2rem]">
            <InternalImageDialog selectedImages={value} onImageSelect={url => onChange([...value, url])} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-3xl bg-white/[0.02] border border-white/5 min-h-[120px]">
        <AnimatePresence>
          {value.map(url => (
            <motion.div
              key={url}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative aspect-square rounded-2xl overflow-hidden group border border-white/10"
            >
              <Image src={url} fill alt="Selected" className="object-cover" unoptimized />
              <button
                onClick={() => removeImage(url)}
                className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {value.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-8 text-white/10">
            <ImageIcon className="w-8 h-8 mb-2" />
            <span className="text-[9px] font-black uppercase tracking-widest">Empty Stack</span>
          </div>
        )}
      </div>
    </div>
  );
}
