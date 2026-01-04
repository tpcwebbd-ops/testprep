'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { Plus, X, UploadCloud, Loader2, ImageIcon, Ghost, RefreshCcw } from 'lucide-react';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useGetMediasQuery, useAddMediaMutation } from '@/redux/features/media/mediaSlice';

interface InternalImageDialogProps {
  onImageSelect: (newImage: string) => void;
  selectedImage: string;
}

const InternalImageDialog = ({ onImageSelect, selectedImage }: InternalImageDialogProps) => {
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
        toast.success('Asset added to vault');
        onImageSelect(data.data.url);
      }
    } catch {
      toast.error('Vault synchronization failed');
    } finally {
      setIsUploadingLocal(false);
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-col h-[70vh]">
      <DialogHeader className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <DialogTitle className="text-sm font-black uppercase tracking-[0.2em] text-white/90 italic">Asset Selection</DialogTitle>
          <label className="cursor-pointer">
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploadingLocal || isAdding} />
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all">
              {isUploadingLocal || isAdding ? <Loader2 className="w-3 h-3 animate-spin" /> : <UploadCloud className="w-3 h-3" />}
              New Upload
            </div>
          </label>
        </div>
      </DialogHeader>

      <ScrollArea className="flex-1 p-6">
        {isFetching ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Querying Vault...</span>
          </div>
        ) : availableImages.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {availableImages.map((url: string) => {
              const isSelected = selectedImage === url;
              return (
                <div
                  key={url}
                  onClick={() => onImageSelect(url)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-500 cursor-pointer
                    ${isSelected ? 'border-emerald-500 scale-95 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-white/5 hover:border-white/20 hover:scale-105'}
                  `}
                >
                  <Image src={url} fill alt="Vault Item" className="object-cover" unoptimized />
                  {isSelected && (
                    <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                      <div className="bg-emerald-500 text-white rounded-full p-1 shadow-xl">
                        <Plus className="w-3 h-3" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-20">
            <Ghost className="w-12 h-12 mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest">Vault Empty</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default function ImageUploadManagerSingle({
  value,
  onChange,
  label = 'Featured Image',
}: {
  value: string;
  onChange: (val: string) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{label}</h4>
        {value && (
          <Button variant="ghost" size="xs" onClick={() => onChange('')} className="text-red-400/60 hover:text-red-400">
            <X className="w-3 h-3 mr-1" /> Clear
          </Button>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="group relative w-full aspect-video rounded-3xl bg-white/[0.02] border border-white/5 border-dashed hover:border-white/20 hover:bg-white/[0.04] transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-4">
            {value ? (
              <>
                <Image src={value} fill alt="Selected" className="object-cover transition-transform duration-700 group-hover:scale-110" unoptimized />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest text-white">
                    <RefreshCcw className="w-3 h-3" /> Change Signature
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-6 h-6 text-white/20" />
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors">
                    Select Visual Asset
                  </p>
                  <p className="text-[8px] font-bold text-white/10 uppercase mt-1">Cloud Stream Required</p>
                </div>
              </>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-xl bg-[#020617]/95 backdrop-blur-3xl border-white/10 p-0 overflow-hidden rounded-[2.5rem]">
          <InternalImageDialog
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
