look at the ImageUploadManager.tsx 
```
'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Plus, Loader2, Search, CheckCircle2, Zap, ImageIcon, ImagesIcon, ChevronLeft, ChevronRight, ImagePlus, Ghost } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

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
  onImageToggle: (item: { url: string; name: string }) => void;
  selectedImages: { url: string; name: string }[];
}

const InternalImageVault = ({ onImageToggle, selectedImages }: InternalImageVaultProps) => {
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

  const [addMedia] = useAddMediaMutation();
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);

  const availableImages = useMemo(() => response?.data || [], [response]);

  const totalPages = useMemo(() => {
    if (!response?.total || !response?.limit) return 1;
    return Math.ceil(response.total / response.limit);
  }, [response]);

  const handleUploadComplete = async (res: { url: string; name: string }[]) => {
    if (res && res[0]) {
      try {
        await addMedia({
          url: res[0].url,
          name: res[0].name || 'Image_Asset',
          contentType: 'image',
          status: 'active',
        }).unwrap();
        toast.success('Asset synchronized to vault');
        onImageToggle({ url: res[0].url, name: res[0].name || 'Image_Asset' });
      } catch {
        toast.error('Vault synchronization failed');
      } finally {
        setIsUploadingLocal(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-[90vh] md:h-[80vh] backdrop-blur-[150px] rounded-sm overflow-hidden bg-white/2 shadow-2xl">
      <DialogHeader className="p-6 border-b border-white/5 bg-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 -mt-1">
          <div className="relative flex-1 max-w-md">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                isRefetching ? 'text-indigo-500 animate-pulse' : 'text-white/20'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="SEARCH ASSET VAULT..."
              className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-white/20"
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
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-20 h-20 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full"
                />
                <Zap className="absolute inset-0 m-auto w-8 h-8 text-indigo-500 animate-pulse" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500/60">Loading...</span>
            </div>
          ) : availableImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {availableImages.map((item, idx) => {
                  const isSelected = selectedImages.some(img => img.url === item.url);
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.03, type: 'spring', stiffness: 260, damping: 20 }}
                      className="flex flex-col gap-3 group"
                    >
                      <div
                        onClick={() => onImageToggle({ url: item.url, name: item.name })}
                        className={`relative aspect-square rounded-sm overflow-hidden cursor-pointer transition-all duration-500 
                          ${isSelected ? 'scale-[0.98] shadow-[0_0_40px_rgba(99,102,241,0.3)]' : 'hover:scale-[1.02] shadow-2xl'}
                        `}
                      >
                        <Image
                          src={item.url}
                          fill
                          alt={item.name || 'Gallery Image'}
                          className={`object-cover transition-transform duration-1000 ease-out border border-white/40 rounded-sm 
                            ${isSelected ? 'scale-110' : 'group-hover:scale-110'}
                            `}
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-indigo-600/20 backdrop-blur-[3px] flex items-center justify-center overflow-hidden border border-white/60 rounded-sm"
                            >
                              <motion.div
                                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                exit={{ scale: 0, rotate: 180, opacity: 0 }}
                                transition={{ type: 'spring', damping: 12 }}
                                className="bg-white text-indigo-600 rounded-sm p-4 shadow-2xl"
                              >
                                <CheckCircle2 className="w-8 h-8" />
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <div className="absolute inset-0 pointer-events-none border-[1px] border-white/10 rounded-sm" />
                      </div>
                      <div className="-mt-1 flex items-center justify-start gap-2 px-1">
                        <ImageIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-white/40'}`} />
                        <h3
                          className={`text-sm font-medium transition-colors duration-300 truncate w-full ${isSelected ? 'text-indigo-400' : 'text-white/50 group-hover:text-white'}`}
                        >
                          {item.name || 'Untitled Asset'}
                        </h3>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 opacity-30 space-y-6">
              <Ghost className="w-24 h-24 animate-bounce" />
              <div className="text-center">
                <h3 className="text-2xl font-black uppercase">Ops! Nothing was found!</h3>
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
            <p className="text-sm text-white/60">Total : {response?.total || 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <UploadButton
            endpoint="imageUploader"
            appearance={{
              button: `bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-white/30 text-white backdrop-blur-xl shadow-lg shadow-blue-500/20 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-white/50 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] transition-all duration-300 h-8 rounded-md gap-1 max-w-[100px] text-sm`,
              allowedContent: 'hidden',
            }}
            content={{
              button({ ready }) {
                if (isUploadingLocal) return <Loader2 className="w-4 h-4 animate-spin" />;
                return (
                  <div className="flex items-center gap-2">
                    <ImagePlus className="w-4 h-4" />
                    <span>{ready ? 'Upload' : 'Connecting...'}</span>
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

export default function ImageUploadManager({
  value,
  onChange,
  label = 'Images',
}: {
  value: { url: string; name: string }[];
  onChange: (val: { url: string; name: string }[]) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleImage = (item: { url: string; name: string }) => {
    const exists = value.some(v => v.url === item.url);
    if (exists) {
      onChange(value.filter(v => v.url !== item.url));
    } else {
      onChange([...value, item]);
    }
  };

  return (
    <div className="space-y-4 w-full h-full">
      <div className="flex items-center justify-between px-1 flex-col md:flex-row">
        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-start gap-2">
            <ImagesIcon className="w-3.5 h-3.5" />
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{label}</label>
          </div>
          <p className="text-[8px] font-bold tracking-widest text-white/60">{value.length} Assets Linked</p>
        </div>

        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <AnimatePresence>
            {value.length > 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <Button variant="outlineFire" size="sm" onClick={() => onChange([])}>
                  <X className="w-3.5 h-3.5" /> Remove all
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outlineGlassy" size="sm" className="min-w-1">
                <Plus className="w-3.5 h-3.5" /> SELECT
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-transparent p-0 shadow-none overflow-hidden max-w-5xl w-[95vw] text-white border-white/50 border rounded-sm mt-8">
              <InternalImageVault selectedImages={value} onImageToggle={toggleImage} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <ScrollArea className="w-full h-[300px]">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 p-8 rounded-sm bg-white/2 border border-white/50 backdrop-blur-3xl min-h-[20vh] transition-all">
          <AnimatePresence mode="popLayout">
            {value.length > 0 ? (
              value.map((item, idx) => (
                <motion.div
                  key={item.url}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="flex flex-col gap-3 group"
                >
                  <div className="relative aspect-square rounded-sm bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl shadow-2xl overflow-hidden group-hover:border-indigo-500/30 transition-all duration-500">
                    <Image src={item.url} fill alt={item.name} className="object-cover transition-transform duration-700 group-hover:scale-110" unoptimized />
                    <div className="absolute inset-0 bg-black/60 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button
                        type="button"
                        onClick={() => onChange(value.filter(u => u.url !== item.url))}
                        className="p-3 cursor-pointer rounded-sm bg-rose-500/20 border border-rose-500/50 text-rose-400 hover:bg-rose-500 hover:text-white transition-all duration-300 transform scale-90 group-hover:scale-100 min-w-1"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                    <Zap className="absolute -top-1 -right-1 w-4 h-4 text-indigo-500/40 animate-pulse pointer-events-none z-10" />
                  </div>
                  <div className="flex items-center gap-2 px-1 opacity-70 group-hover:opacity-100 transition-opacity overflow-hidden">
                    <ImageIcon className="w-3.5 h-3.5 text-white shrink-0" />
                    <span className="text-[11px] font-medium text-white truncate">{item.name || 'Untitled'}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-10 gap-6">
                <div className="flex gap-4">
                  {[1, 2, 3].map(i => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [0, -10, 0],
                        boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 40px rgba(99,102,241,0.2)', '0 0 0px rgba(99,102,241,0)'],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.5,
                      }}
                      className="w-16 h-16 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center"
                    >
                      <ImageIcon className="w-8 h-8 text-white/10" />
                    </motion.div>
                  ))}
                </div>
                <div className="text-center space-y-1">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90">No Assets Selected</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">Click Select to populate grid</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}

```

and here is VideoUploadManager.tsx
```
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
  Play,
  Film,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clapperboard,
  MonitorPlay,
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

interface InternalVideoVaultProps {
  onImageToggle: (item: { url: string; name: string }) => void;
  selectedImages: { url: string; name: string }[];
}

const InternalVideoVault = ({ onVideoToggle, selectedVideos }: InternalVideoVaultProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const ITEMS_PER_PAGE = 8;

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
    contentType: 'video',
    status: 'active',
  }) as { data: MediaResponse | undefined; isLoading: boolean; isFetching: boolean };

  const [addMedia] = useAddMediaMutation();
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);

  const availableVideos = useMemo(() => response?.data || [], [response]);

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
          name: res[0].name || 'Video_Source',
          contentType: 'video',
          status: 'active',
        }).unwrap();
        toast.success('Production asset synchronized');
        onVideoToggle(res[0].url);
      } catch {
        toast.error('Sync to vault failed');
      } finally {
        setIsUploadingLocal(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-[85vh] md:h-[80vh] backdrop-blur-[150px] rounded-sm overflow-hidden border border-white/60 bg-white/2 shadow-2xl">
      <DialogHeader className="p-6 border-b border-white/5 bg-white/5 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isRefetching ? 'text-indigo-500 animate-pulse' : 'text-white/20'}`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="SEARCH PRODUCTION VAULT..."
              className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/20"
            />
          </div>
          <div className="hidden">
            <DialogTitle>Media Library</DialogTitle>
            <DialogDescription>Multiple Video Asset Selection</DialogDescription>
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
              <Zap className="absolute inset-0 m-auto w-6 h-6 text-indigo-500/40" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 animate-pulse">Scanning Grid...</span>
          </div>
        ) : availableVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {availableVideos.map((item, idx) => {
                const isSelected = selectedVideos.includes(item.url);
                return (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.03, type: 'spring', stiffness: 260, damping: 20 }}
                    onClick={() => onVideoToggle(item.url)}
                    title={item.name || 'Video'}
                    className={`relative aspect-video rounded-sm overflow-hidden border-2 cursor-pointer transition-all duration-500 group
                      ${isSelected ? 'border-emerald-500 scale-95 shadow-[0_0_40px_rgba(16,185,129,0.3)]' : 'border-white/5 hover:border-white/20 hover:scale-105 shadow-xl'}
                    `}
                  >
                    <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                      <Film className="w-8 h-8 text-white/10 group-hover:text-white/20 transition-colors" />
                      <video
                        src={item.url}
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                        muted
                        onMouseOver={e => e.currentTarget.play()}
                        onMouseOut={e => {
                          e.currentTarget.pause();
                          e.currentTarget.currentTime = 0;
                        }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/60 truncate">{item.name || 'VIDEO_NODE'}</span>
                    </div>
                    {isSelected && (
                      <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center backdrop-blur-[2px]">
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="bg-emerald-500 text-white rounded-full p-2.5 shadow-2xl"
                        >
                          <CheckCircle2 className="w-6 h-6" />
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
              <h3 className="text-2xl font-black uppercase tracking-[0.4em]">Grid Empty</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-2">Zero cinematic signatures detected</p>
            </div>
          </div>
        )}
      </ScrollArea>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 border-t border-white/5 bg-white/5">
        <div className="flex items-center gap-3">
          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1 h-8 w-10 p-0"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isFetching}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </Button>

          <div className="flex items-center gap-3 px-5 h-8 rounded-sm bg-white/5 border border-white/10">
            <span className="text-[11px] font-black text-white">{currentPage}</span>
            <span className="text-[10px] font-black text-white/20">/</span>
            <span className="text-[11px] font-black text-white/60">{totalPages}</span>
          </div>

          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1 h-8 w-10 p-0"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || isFetching}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </Button>

          <div className="hidden sm:block ml-4">
            <p className="text-[9px] font-black text-white/80 uppercase tracking-[0.2em]">Total: {response?.total || 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <UploadButton
            endpoint="videoUploader"
            appearance={{
              button: `bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-white/30 text-white backdrop-blur-xl shadow-lg shadow-blue-500/20 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-white/50 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] transition-all duration-300]`,
              allowedContent: 'hidden',
            }}
            content={{
              button({ ready }) {
                if (isUploadingLocal) return <Loader2 className="w-4 h-4 animate-spin" />;
                return ready ? (
                  <>
                    <UploadCloud className="w-4 h-4 mr-2" />
                    <span>Upload</span>
                  </>
                ) : (
                  'Uploading...'
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

export default function VideoUploadManager({
  value,
  onChange,
  label = 'Video',
}: {
  value: { url: string; name: string }[];
  onChange: (val: { url: string; name: string }[]) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleVideo = (url: string) => {
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
            <Clapperboard className="w-3.5 h-3.5" />
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{label}</label>
          </div>
          <p className="text-[8px] font-bold uppercase tracking-widest text-white/90">{value.length} Selected</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outlineGlassy"
              size="sm"
              className="rounded-sm border-white/10 bg-white/2 hover:bg-indigo-500/10 hover:border-indigo-500/50 transition-all gap-2 group h-9 px-5 text-[9px] font-black uppercase tracking-widest"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              SELECT
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl bg-transparent border-none p-0 shadow-none text-white mt-4">
            <InternalVideoVault selectedVideos={value} onVideoToggle={toggleVideo} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="min-h-[25vh] rounded-sm p-8 bg-white/2 border border-white/50 backdrop-blur-3xl">
        <ScrollArea className="w-full">
          {value.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
              <AnimatePresence mode="popLayout">
                {value.map((url, index) => (
                  <motion.div
                    key={url}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group relative aspect-video rounded-sm overflow-hidden bg-black/40 border border-white/10 hover:border-indigo-500/30 transition-all duration-500 shadow-2xl"
                  >
                    <video
                      src={url}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                      muted
                      onMouseOver={e => e.currentTarget.play()}
                      onMouseOut={e => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-indigo-500/20 backdrop-blur-md rounded-sm border border-indigo-500/30">
                            <Play className="w-3.5 h-3.5 text-white fill-white" />
                          </div>
                        </div>
                        <Button onClick={() => onChange(value.filter(v => v !== url))} variant="outlineFire" size="sm" className="min-w-1 h-8">
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-1.5 pointer-events-none">
                      <Zap className="w-4 h-4 text-indigo-400/40 animate-pulse" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4 gap-6">
              <div className="flex gap-4">
                {[1, 2, 3].map(i => (
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 40px rgba(99,102,241,0.2)', '0 0 0px rgba(99,102,241,0)'],
                    }}
                    key={i}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-20 h-20 rounded-sm bg-white/5 border border-white/40 flex items-center justify-center group-hover:border-indigo-500/40 group-hover:bg-indigo-500/5 transition-all duration-500"
                  >
                    <MonitorPlay className="w-10 h-10 text-white/20 group-hover:text-indigo-400" />
                  </motion.div>
                ))}
              </div>
              <div className="text-center space-y-2">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90 group-hover:text-white transition-colors">No Video Selected</p>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">Click here to Select one</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}

```

Now Your task is update proper implementation on VideoUploadManager.tsx so it is workable. 
