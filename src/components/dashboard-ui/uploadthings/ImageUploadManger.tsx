'use client';

import React, { useMemo, useState, useEffect } from 'react';
import {
  X,
  UploadCloud,
  Loader2,
  Ghost,
  Search,
  CheckCircle2,
  Zap,
  ImageIcon,
  Wallpaper,
  ChevronLeft,
  ChevronRight,
  Plus,
  Frame,
  ImagePlus,
  Maximize2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UploadButton } from '@/lib/uploadthing';

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

interface InternalImageVaultProps {
  onImageToggle: (url: string) => void;
  selectedImages: string[];
}

const InternalImageVault = ({ onImageToggle, selectedImages }: InternalImageVaultProps) => {
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

  const handleUploadComplete = async (res: any) => {
    if (res && res[0]) {
      try {
        await addMedia({
          url: res[0].url,
          name: res[0].name || 'Image_Asset',
          contentType: 'image',
          status: 'active',
        }).unwrap();
        toast.success('Creative resource synchronized');
        onImageToggle(res[0].url);
      } catch {
        toast.error('Vault synchronization failed');
      } finally {
        setIsUploadingLocal(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-[85vh] md:h-[80vh] backdrop-blur-[120px] rounded-sm overflow-hidden border border-white/40 bg-white/5 shadow-2xl">
      <DialogHeader className="p-6 border-b border-white/10 bg-black/20 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isRefetching ? 'text-cyan-400 animate-pulse' : 'text-white/30'}`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="SEARCH CREATIVE VAULT..."
              className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-white/20"
            />
          </div>
          <div className="hidden">
            <DialogTitle>Asset Library</DialogTitle>
            <DialogDescription>Image Collection Management</DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <ScrollArea className="flex-1 p-8">
        {isFetching ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <div className="relative">
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 border-2 border-cyan-500/10 border-t-cyan-500 rounded-full"
              />
              <Zap className="absolute inset-0 m-auto w-6 h-6 text-cyan-500/40 animate-pulse" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Indexing Archives...</span>
          </div>
        ) : availableImages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <AnimatePresence mode="popLayout">
              {availableImages.map((item, idx) => {
                const isSelected = selectedImages.includes(item.url);
                return (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.02, type: 'spring', stiffness: 300, damping: 25 }}
                    onClick={() => onImageToggle(item.url)}
                    className={`relative aspect-square rounded-sm overflow-hidden border cursor-pointer transition-all duration-500 group
                      ${isSelected ? 'border-cyan-500 ring-2 ring-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.2)]' : 'border-white/10 hover:border-white/40 hover:scale-105 shadow-lg'}
                    `}
                  >
                    <div className="absolute inset-0 bg-slate-950 flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-white/5" />
                      <img
                        src={item.url}
                        alt={item.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                        loading="lazy"
                      />
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
          <div className="flex flex-col items-center justify-center py-40 opacity-20 space-y-6">
            <Frame className="w-20 h-20 animate-pulse" />
            <div className="text-center">
              <h3 className="text-2xl font-black uppercase tracking-[0.5em]">No Imagery</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-2">Database surface is currently void</p>
            </div>
          </div>
        )}
      </ScrollArea>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 border-t border-white/10 bg-black/20">
        <div className="flex items-center gap-3">
          <Button
            variant="outlineGlassy"
            size="sm"
            className="w-10 h-10 border-white/10"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isFetching}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </Button>

          <div className="flex items-center gap-3 px-6 h-10 rounded-sm bg-white/5 border border-white/10">
            <span className="text-[11px] font-black text-cyan-400">{currentPage}</span>
            <span className="text-[10px] font-black text-white/20">OF</span>
            <span className="text-[11px] font-black text-white/60">{totalPages}</span>
          </div>

          <Button
            variant="outlineGlassy"
            size="sm"
            className="w-10 h-10 border-white/10"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || isFetching}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </Button>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <UploadButton
            endpoint="imageUploader"
            appearance={{
              button: `bg-linear-to-br from-cyan-500/20 to-blue-600/20 border border-white/20 text-white backdrop-blur-xl shadow-xl hover:from-cyan-500/40 hover:to-blue-600/40 hover:border-white/40 hover:scale-[1.02] transition-all duration-300 font-black text-[10px] uppercase tracking-[0.2em] px-10 h-11`,
              allowedContent: 'hidden',
            }}
            content={{
              button({ ready }) {
                if (isUploadingLocal) return <Loader2 className="w-4 h-4 animate-spin" />;
                return (
                  <div className="flex items-center gap-2">
                    <UploadCloud className="w-4 h-4" />
                    <span>{ready ? 'NEW ASSET' : 'BOOTING...'}</span>
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
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between px-2">
        <div className="space-y-1">
          <div className="w-full flex items-start justify-start gap-2">
            <Wallpaper className="w-3.5 h-3.5 text-cyan-500" />
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">{label}</label>
          </div>
          <p className="text-[8px] font-black uppercase tracking-widest text-cyan-400/60">{value.length} Collected Assets</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outlineGlassy"
              size="sm"
              className="rounded-sm border-white/20 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all gap-2 group h-9 px-6 text-[9px] font-black uppercase tracking-widest"
            >
              <Plus className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              ADD ASSETS
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl bg-transparent border-none p-0 shadow-none text-white mt-4">
            <InternalImageVault selectedImages={value} onImageToggle={toggleImage} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="min-h-[20vh] rounded-sm p-8 bg-white/[0.02] border border-white/20 backdrop-blur-3xl">
        <ScrollArea className="w-full">
          {value.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pb-4">
              <AnimatePresence mode="popLayout">
                {value.map((url, index) => (
                  <motion.div
                    key={url}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    className="group relative aspect-square rounded-sm overflow-hidden bg-black/40 border border-white/10 hover:border-cyan-500/40 transition-all duration-500 shadow-xl"
                  >
                    <img
                      src={url}
                      alt={`Selected asset ${index}`}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3">
                      <div className="flex items-center justify-between">
                        <div className="p-1.5 bg-white/10 backdrop-blur-md rounded-sm border border-white/20">
                          <Maximize2 className="w-3 h-3 text-white" />
                        </div>
                        <button
                          onClick={() => onChange(value.filter(v => v !== url))}
                          className="p-1.5 bg-red-500/20 hover:bg-red-500 transition-colors backdrop-blur-md rounded-sm border border-red-500/30 group/btn"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 gap-6">
              <div className="flex gap-4">
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    animate={{
                      opacity: [0.1, 0.3, 0.1],
                      y: [0, -5, 0],
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    className="w-16 h-16 rounded-sm bg-white/5 border border-white/20 flex items-center justify-center"
                  >
                    <ImagePlus className="w-6 h-6 text-white/20" />
                  </motion.div>
                ))}
              </div>
              <div className="text-center space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Canvas Empty</p>
                <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/20">Initialize selection to populate container</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
