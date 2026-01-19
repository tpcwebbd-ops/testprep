'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  X,
  UploadCloud,
  Loader2,
  Ghost,
  RefreshCcw,
  Search,
  CheckCircle2,
  Zap,
  MonitorPlay,
  Play,
  Film,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clapperboard,
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
  onVideoToggle: (url: string) => void;
  selectedVideos: string[];
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
    <div className="flex flex-col h-[85vh] md:h-[80vh] backdrop-blur-[150px] rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-2xl">
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
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/20"
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
                    className={`relative aspect-video rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-500 group
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
            className="min-w-1 h-10 w-10 p-0"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isFetching}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </Button>

          <div className="flex items-center gap-3 px-5 h-10 rounded-xl bg-white/5 border border-white/10">
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
            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">RECORDS: {response?.total || 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <UploadButton
            endpoint="videoUploader"
            appearance={{
              button: `h-11 px-8 rounded-xl border-none bg-indigo-600 text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 duration-300 shadow-[0_0_20px_rgba(79,70,229,0.3)]`,
              allowedContent: 'hidden',
            }}
            content={{
              button({ ready }) {
                if (isUploadingLocal) return <Loader2 className="w-4 h-4 animate-spin" />;
                return ready ? (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>IMPORT PRODUCTION</span>
                  </>
                ) : (
                  'INITIALIZING...'
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
  label = 'VIDEO GALLERY',
}: {
  value: string[];
  onChange: (val: string[]) => void;
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
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-2">
            <Clapperboard className="w-3.5 h-3.5" />
            {label}
          </h4>
          <p className="text-[8px] font-bold uppercase tracking-widest text-indigo-400">{value.length} Assets Selected</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outlineGlassy"
              size="sm"
              className="rounded-2xl border-white/10 bg-white/5 hover:bg-indigo-500/10 hover:border-indigo-500/50 transition-all gap-2 group h-9 px-5 text-[9px] font-black uppercase tracking-widest"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              SELECT FOOTAGE
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl bg-transparent border-none p-0 shadow-none text-white mt-4">
            <InternalVideoVault selectedVideos={value} onVideoToggle={toggleVideo} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="min-h-[25vh] rounded-[2.5rem] p-8 bg-black/20 border border-white/5 backdrop-blur-3xl">
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
                    className="group relative aspect-video rounded-3xl overflow-hidden bg-black/40 border border-white/10 hover:border-indigo-500/30 transition-all duration-500 shadow-2xl"
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
                          <div className="p-2.5 bg-indigo-500/20 backdrop-blur-md rounded-xl border border-indigo-500/30">
                            <Play className="w-3.5 h-3.5 text-white fill-white" />
                          </div>
                          <span className="text-[9px] font-black text-white uppercase tracking-widest">Live Stream</span>
                        </div>
                        <button
                          onClick={() => onChange(value.filter(v => v !== url))}
                          className="p-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl border border-rose-500/20 transition-all duration-300 transform scale-90 group-hover:scale-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
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
            <div className="flex flex-col items-center justify-center py-16 opacity-20 gap-6">
              <div className="flex gap-4">
                {[1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                    className="w-24 h-14 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center"
                  >
                    <Film className="w-6 h-6" />
                  </motion.div>
                ))}
              </div>
              <p className="font-black uppercase tracking-[0.5em] text-[11px] text-center">Library Standby - Deploy Assets</p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
