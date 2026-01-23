'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { X, Loader2, RefreshCcw, Search, CheckCircle2, Zap, ImageIcon, Wallpaper, ChevronLeft, ChevronRight, ImagePlus, Frame, Ghost } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UploadButton } from '@/lib/uploadthing';

import { useGetMediasQuery, useAddMediaMutation } from '@/redux/features/media/mediaSlice';
import Image from 'next/image';

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

interface InternalImageVaultProps {
  onImageSelect: (url: string) => void;
  selectedImage: string;
}

const InternalImageVault = ({ onImageSelect, selectedImage }: InternalImageVaultProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const ITEMS_PER_PAGE = 12;

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

  const [addMedia] = useAddMediaMutation();
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);

  const availableImages = useMemo(() => response?.data || [], [response]);

  const totalPages = useMemo(() => {
    if (!response?.total || !response?.limit) return 1;
    return Math.ceil(response.total / response.limit);
  }, [response]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUploadComplete = async (res: any) => {
    if (res && res[0]) {
      try {
        await addMedia({
          url: res[0].url,
          name: res[0].name || 'Image_Asset',
          contentType: 'image',
          status: 'active',
        }).unwrap();
        toast.success('Creative asset synchronized');
        onImageSelect(res[0].url);
      } catch {
        toast.error('Sync to vault failed');
      } finally {
        setIsUploadingLocal(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-[90vh] md:h-[80vh] backdrop-blur-[150px] rounded-sm overflow-hidden border border-white/60 bg-white/5 shadow-2xl">
      <DialogHeader className="p-6 border-b border-white/5 bg-white/5 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isRefetching ? 'text-cyan-500 animate-pulse' : 'text-white/20'}`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="SEARCH IMAGE VAULT..."
              className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-white/20"
            />
          </div>
          <div className="hidden">
            <DialogTitle> </DialogTitle>
            <DialogDescription> </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="flex-1 relative overflow-hidden">
        <ScrollArea className="h-full w-full p-8">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
              <div className="relative">
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="w-20 h-20 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full"
                />
                <Zap className="absolute inset-0 m-auto w-8 h-8 text-cyan-500 animate-pulse" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-500/60">Downloading Catalog...</span>
            </div>
          ) : availableImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              <AnimatePresence mode="popLayout">
                {availableImages.map((item, idx) => {
                  const isSelected = selectedImage === item.url;
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.02, type: 'spring', stiffness: 300, damping: 25 }}
                      onClick={() => onImageSelect(item.url)}
                      className={`relative aspect-square rounded-sm overflow-hidden border cursor-pointer transition-all duration-500 group
                        ${isSelected ? 'border-cyan-500 ring-2 ring-cyan-500/20 scale-95 shadow-[0_0_40px_rgba(6,182,212,0.3)]' : 'border-white/10 hover:border-cyan-500/40 hover:scale-105'}
                      `}
                    >
                      <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-white/5" />
                        <Image
                          fill
                          src={item.url}
                          alt={item.name}
                          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          loading="lazy"
                        />
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                        <span className="text-[8px] font-black uppercase tracking-tighter text-white truncate">{item.name || 'IMG_ASSET'}</span>
                      </div>

                      {isSelected && (
                        <div className="absolute inset-0 bg-cyan-500/10 flex items-center justify-center backdrop-blur-[1px]">
                          <motion.div
                            initial={{ scale: 0, rotate: 90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="bg-cyan-500 text-white rounded-full p-2 shadow-2xl"
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
            <div className="flex flex-col items-center justify-center py-20 opacity-30 space-y-6">
              <Ghost className="w-24 h-24 animate-bounce" />
              <div className="text-center">
                <h3 className="text-2xl font-black uppercase ">Ops! Nothing was found!</h3>
                <p className="text-[10px] font-bold uppercase mt-3">Please Upload a New Image</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 border-t border-white/5 bg-white/5">
        <div className="flex items-center gap-3">
          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isFetching}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </Button>

          <div className="flex items-center gap-3 px-5 h-8 rounded-sm bg-white/5 border border-white/10">
            <span className="text-[11px] text-white">{currentPage}</span>
            <span className="text-[10px] text-white/20">/</span>
            <span className="text-[11px] text-white/60">{totalPages}</span>
          </div>

          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || isFetching}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </Button>

          <div className="hidden sm:block ml-4">
            <p className="text-sm text-white/60 ">Total : {response?.total || 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <UploadButton
            endpoint="imageUploader"
            appearance={{
              button: `bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-white/30 text-white backdrop-blur-xl shadow-lg shadow-blue-500/20 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-white/50 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] transition-all duration-300 max-h-8 rounded-md gap-2 px-0 max-w-[100px] text-sm`,
              allowedContent: 'hidden',
            }}
            content={{
              button({ ready }) {
                if (isUploadingLocal) return <Loader2 className="w-4 h-4 animate-spin" />;
                return (
                  <div className="flex items-center gap-2">
                    <ImagePlus className="w-4 h-4" />
                    <span>{ready ? 'Upload' : 'Uploading...'}</span>
                  </div>
                );
              },
            }}
            onUploadBegin={() => setIsUploadingLocal(true)}
            onClientUploadComplete={handleUploadComplete}
            onUploadError={err => {
              setIsUploadingLocal(false);
              toast.error(err.message);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default function ImageUploadManagerSingle({
  value,
  onChange,
  label = 'IMAGE ASSET',
}: {
  value: string;
  onChange: (val: string) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between px-1">
        <div className="w-full flex items-start justify-start gap-2">
          <Wallpaper className="w-3.5 h-3.5 text-cyan-500" />
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">{label}</label>
        </div>
        <AnimatePresence>
          {value && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
              <button
                onClick={e => {
                  e.stopPropagation();
                  onChange('');
                }}
                className="group flex items-center gap-2 text-[9px] font-black text-white/40 hover:text-red-400 transition-colors uppercase tracking-widest"
              >
                <X className="w-3 h-3" /> CLEAR
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="group relative w-full h-[280px] aspect-video rounded-sm backdrop-blur-3xl transition-all duration-500 cursor-pointer overflow-hidden flex flex-col items-center justify-center border border-white/10 hover:border-cyan-500/30 bg-white/[0.02]">
            {value ? (
              <>
                <Image fill src={value} alt="Selected Preview" className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 px-6 py-3 rounded-sm bg-black/60 border border-white/20 text-[9px] font-black uppercase tracking-[0.4em] text-white"
                  >
                    <RefreshCcw className="w-4 h-4 animate-spin-slow" />
                    CHANGE IMAGE
                  </motion.div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-6">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 40px rgba(99,102,241,0.2)', '0 0 0px rgba(99,102,241,0)'],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1 * 0.5,
                  }}
                  className="w-16 h-16 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center"
                >
                  <ImageIcon className="w-8 h-8 text-white/10" />
                </motion.div>
                <div className="text-center space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90 group-hover:text-white transition-colors">No Image Selected</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">Click here to Select one</p>
                </div>
              </div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="bg-transparent border-none p-0 shadow-none overflow-hidden max-w-6xl w-[98vw] text-white mt-8">
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
