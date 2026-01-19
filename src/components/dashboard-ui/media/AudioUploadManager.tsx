'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  X,
  UploadCloud,
  Loader2,
  Ghost,
  Search,
  CheckCircle2,
  Zap,
  Volume2,
  Play,
  Pause,
  Music,
  Files,
  Plus,
  ChevronLeft,
  ChevronRight,
  Headphones,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

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

const InternalAudioVault = ({ onAudioToggle, selectedAudios }: { onAudioToggle: (url: string) => void; selectedAudios: string[] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    contentType: 'audio',
    status: 'active',
  }) as { data: MediaResponse | undefined; isLoading: boolean; isFetching: boolean };

  const [addMedia, { isLoading: isAdding }] = useAddMediaMutation();
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);

  const availableAudios = useMemo(() => response?.data || [], [response]);
  const totalPages = useMemo(() => (response?.total ? Math.ceil(response.total / ITEMS_PER_PAGE) : 1), [response]);

  const togglePlay = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingUrl === url) {
      audioRef.current?.pause();
      setPlayingUrl(null);
    } else {
      setPlayingUrl(url);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
      }
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('audio/')) {
      toast.error('AUDIO FILE REQUIRED');
      return;
    }
    setIsUploadingLocal(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        await addMedia({ url: data.secure_url, name: file.name, contentType: 'audio', status: 'active' }).unwrap();
        toast.success('ASSET ENCODED');
        onAudioToggle(data.secure_url);
      }
    } catch {
      toast.error('SYNC FAILURE');
    } finally {
      setIsUploadingLocal(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-[85vh] md:h-[80vh] backdrop-blur-[150px] rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-2xl">
      <audio ref={audioRef} onEnded={() => setPlayingUrl(null)} className="hidden" />
      <DialogHeader className="p-6 border-b border-white/5 bg-white/5 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isRefetching ? 'text-emerald-500 animate-pulse' : 'text-white/20'}`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="FILTER AUDIO GRID..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-white/20"
            />
          </div>
        </div>
      </DialogHeader>

      <ScrollArea className="flex-1 p-8">
        {isFetching ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full flex items-center justify-center"
            >
              <Volume2 className="w-6 h-6 text-emerald-500/40" />
            </motion.div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 animate-pulse">Synchronizing Signals...</span>
          </div>
        ) : availableAudios.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {availableAudios.map((item, idx) => {
                const isSelected = selectedAudios.includes(item.url);
                const isPlaying = playingUrl === item.url;
                return (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => onAudioToggle(item.url)}
                    className={`relative aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-500 group bg-white/[0.02] flex flex-col items-center justify-center p-4
                      ${isSelected ? 'border-emerald-500 scale-95 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'border-white/5 hover:border-white/20 hover:scale-105 shadow-xl'}
                    `}
                  >
                    <Music className={`w-10 h-10 transition-all duration-500 ${isSelected ? 'text-emerald-400' : 'text-white/10 group-hover:text-white/30'}`} />
                    <p className="mt-3 text-[8px] font-black text-white/60 uppercase tracking-widest truncate w-full text-center">{item.name}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 rounded-full h-8 w-8 bg-white/5"
                      onClick={e => togglePlay(item.url, e)}
                    >
                      {isPlaying ? <Pause className="w-3 h-3 fill-white" /> : <Play className="w-3 h-3 fill-white" />}
                    </Button>
                    {isSelected && (
                      <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center backdrop-blur-[2px]">
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="bg-emerald-500 text-white rounded-full p-2 shadow-2xl"
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
            <h3 className="text-xl font-black uppercase tracking-[0.4em]">Grid Empty</h3>
          </div>
        )}
      </ScrollArea>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 border-t border-white/5 bg-white/5">
        <div className="flex items-center gap-3">
          <Button
            variant="outlineGlassy"
            size="sm"
            className="w-10 h-10 p-0"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isFetching}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </Button>
          <div className="flex items-center gap-3 px-5 h-10 rounded-xl bg-white/5 border border-white/10 text-[11px] font-black text-white">
            <span>{currentPage}</span>
            <span className="opacity-20">/</span>
            <span className="opacity-60">{totalPages}</span>
          </div>
          <Button
            variant="outlineGlassy"
            size="sm"
            className="w-10 h-10 p-0"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || isFetching}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </Button>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <input type="file" ref={fileInputRef} accept="audio/*" className="hidden" onChange={handleUpload} />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingLocal || isAdding}
            className="w-full md:w-auto h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 border-none"
          >
            {isUploadingLocal ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            {isUploadingLocal ? 'ARCHIVING...' : 'IMPORT AUDIO FEED'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function AudioUploadManager({
  value,
  onChange,
  label = 'SONIC LIBRARY',
}: {
  value: string[];
  onChange: (val: string[]) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleAudio = (url: string) => (value.includes(url) ? onChange(value.filter(v => v !== url)) : onChange([...value, url]));

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between px-2">
        <div className="space-y-1">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-2">
            <Headphones className="w-3.5 h-3.5" />
            {label}
          </h4>
          <p className="text-[8px] font-bold uppercase tracking-widest text-emerald-400">{value.length} Assets Linked</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outlineGlassy"
              size="sm"
              className="rounded-2xl border-white/10 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all gap-2 group h-9 px-5 text-[9px] font-black uppercase tracking-widest"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" /> SELECT AUDIO
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl bg-transparent border-none p-0 shadow-none text-white mt-4">
            <InternalAudioVault selectedAudios={value} onAudioToggle={toggleAudio} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="min-h-[20vh] rounded-[2.5rem] p-8 bg-black/20 border border-white/5 backdrop-blur-3xl">
        <ScrollArea className="w-full">
          {value.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-4">
              <AnimatePresence mode="popLayout">
                {value.map((url, index) => (
                  <motion.div
                    key={url}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group relative aspect-[3/2] rounded-3xl overflow-hidden bg-black/40 border border-white/10 hover:border-emerald-500/30 transition-all duration-500 flex flex-col items-center justify-center"
                  >
                    <Music className="w-8 h-8 text-emerald-400/40 group-hover:text-emerald-400 group-hover:scale-110 transition-all" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-5">
                      <div className="flex items-center justify-between">
                        <div className="p-2 bg-emerald-500/20 rounded-lg">
                          <Play className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                        </div>
                        <button
                          onClick={() => onChange(value.filter(v => v !== url))}
                          className="p-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl border border-rose-500/20 transition-all transform scale-90 group-hover:scale-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 opacity-20 gap-6">
              <div className="flex gap-4">
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: i * 0.4 }}
                    className="w-16 h-20 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center"
                  >
                    <Music className="w-6 h-6" />
                  </motion.div>
                ))}
              </div>
              <p className="font-black uppercase tracking-[0.5em] text-[11px] text-center">Sonic Grid Standby</p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
