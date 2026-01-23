'use client';

import React, { useMemo, useState, useEffect } from 'react';
import {
  X,
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
  VideoIcon,
  Trash2,
} from 'lucide-react';
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

interface InternalVideoVaultProps {
  onVideoToggle: (item: { url: string; name: string }) => void;
  selectedVideos: { url: string; name: string }[];
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

  const handleUploadComplete = async (res: { url: string; name: string }[]) => {
    if (res && res[0]) {
      try {
        await addMedia({
          url: res[0].url,
          name: res[0].name || 'Video_Source',
          contentType: 'video',
          status: 'active',
        }).unwrap();
        toast.success('Production asset synchronized');
        onVideoToggle({ url: res[0].url, name: res[0].name || 'Video_Source' });
      } catch {
        toast.error('Sync to vault failed');
      } finally {
        setIsUploadingLocal(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-[90vh] md:h-[80vh] backdrop-blur-3xl rounded-sm overflow-hidden border border-white/20 bg-neutral-950/90 shadow-2xl">
      <DialogHeader className="p-6 border-b border-white/10 bg-white/5 text-white">
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
                  const isSelected = selectedVideos.some(v => v.url === item.url);
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.03, type: 'spring', stiffness: 260, damping: 20 }}
                      onClick={() => onVideoToggle({ url: item.url, name: item.name })}
                      className={`relative aspect-video rounded-sm overflow-hidden border cursor-pointer transition-all duration-500 group
                        ${isSelected ? 'border-indigo-500 scale-95 shadow-[0_0_40px_rgba(99,102,241,0.3)]' : 'border-white/5 hover:border-white/20 hover:scale-105 shadow-xl'}
                      `}
                    >
                      <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
                        <Film className="w-8 h-8 text-white/5 group-hover:text-white/10 transition-colors" />
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
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/60 truncate">{item.name || 'VIDEO_NODE'}</span>
                      </div>
                      {isSelected && (
                        <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center backdrop-blur-[2px]">
                          <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="bg-indigo-500 text-white rounded-sm p-2 shadow-2xl"
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
                <h3 className="text-2xl font-black uppercase tracking-[0.4em] text-white">Grid Empty</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-2 text-white/60">Zero cinematic signatures detected</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 border-t border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1 h-9 w-10 border-white/10"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isFetching}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </Button>

          <div className="flex items-center gap-3 px-5 h-9 rounded-sm bg-white/5 border border-white/10">
            <span className="text-[11px] font-black text-white">{currentPage}</span>
            <span className="text-[10px] font-black text-white/20">/</span>
            <span className="text-[11px] font-black text-white/60">{totalPages}</span>
          </div>

          <Button
            variant="outlineGlassy"
            size="sm"
            className="min-w-1 h-9 w-10 border-white/10"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || isFetching}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </Button>

          <div className="hidden sm:block ml-4">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Total Vault Assets: {response?.total || 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <UploadButton
            endpoint="videoUploader"
            appearance={{
              button: `bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-xl transition-all duration-300 h-9 rounded-sm px-6 text-[11px] font-black uppercase tracking-widest`,
              allowedContent: 'hidden',
            }}
            content={{
              button({ ready }) {
                if (isUploadingLocal) return <Loader2 className="w-4 h-4 animate-spin" />;
                return (
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>{ready ? 'NEW UPLOAD' : 'CONNECTING...'}</span>
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

export default function VideoUploadManager({
  value,
  onChange,
  label = 'PRODUCTION ASSETS',
}: {
  value: { url: string; name: string }[];
  onChange: (val: { url: string; name: string }[]) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleVideo = (item: { url: string; name: string }) => {
    const exists = value.some(v => v.url === item.url);
    if (exists) {
      onChange(value.filter(v => v.url !== item.url));
    } else {
      onChange([...value, item]);
    }
  };

  return (
    <div className="space-y-6 w-full group/container">
      <div className="flex items-center justify-between px-2 flex-col sm:flex-row gap-4">
        <div className="space-y-1">
          <div className="w-full flex items-center justify-start gap-2">
            <Clapperboard className="w-3.5 h-3.5 text-indigo-500" />
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">{label}</label>
          </div>
          <p className="text-[8px] font-bold uppercase tracking-widest text-white/40">{value.length} Active Nodes Selected</p>
        </div>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {value.length > 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onChange([])}
                  className="h-9 text-[9px] font-black tracking-widest text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" /> DISCARD ALL
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outlineGlassy"
                size="sm"
                className="rounded-sm border-white/10 bg-white/[0.03] hover:bg-indigo-500/10 hover:border-indigo-500/50 transition-all gap-2 group h-9 px-6 text-[9px] font-black uppercase tracking-widest"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                SELECT ASSETS
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl bg-transparent border-none p-0 shadow-none text-white overflow-hidden">
              <InternalVideoVault selectedVideos={value} onVideoToggle={toggleVideo} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="min-h-[250px] rounded-sm p-8 bg-neutral-900/30 border border-white/10 backdrop-blur-3xl transition-all duration-500 hover:border-white/20">
        <ScrollArea className="w-full h-full">
          {value.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-4">
              <AnimatePresence mode="popLayout">
                {value.map((item, index) => (
                  <motion.div
                    key={item.url}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group relative aspect-video rounded-sm overflow-hidden bg-black/40 border border-white/5 hover:border-indigo-500/40 transition-all duration-500 shadow-2xl"
                  >
                    <video
                      src={item.url}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                      muted
                      onMouseOver={e => e.currentTarget.play()}
                      onMouseOut={e => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1 overflow-hidden">
                          <div className="flex items-center gap-2">
                            <VideoIcon className="w-3 h-3 text-indigo-400" />
                            <span className="text-[10px] font-bold text-white tracking-wider truncate max-w-[150px]">{item.name || 'VIDEO_STREAM'}</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => onChange(value.filter(v => v.url !== item.url))}
                          className="h-8 w-8 p-0 rounded-sm bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="absolute top-4 left-4 flex gap-1.5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="px-2 py-0.5 rounded-full bg-indigo-500 text-[8px] font-black uppercase tracking-tighter">Live Preview</div>
                    </div>
                    <Zap className="absolute top-4 right-4 w-4 h-4 text-indigo-400/20 animate-pulse" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-8">
              <div className="flex gap-5">
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -12, 0],
                      boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 40px rgba(99,102,241,0.1)', '0 0 0px rgba(99,102,241,0)'],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
                    className="w-20 h-20 rounded-sm bg-white/[0.02] border border-white/10 flex items-center justify-center group-hover:border-indigo-500/40 transition-all duration-500"
                  >
                    <MonitorPlay className="w-8 h-8 text-white/5 group-hover:text-indigo-400/40" />
                  </motion.div>
                ))}
              </div>
              <div className="text-center space-y-2">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-white/60 transition-colors">
                  System Awaiting Input
                </p>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">Select cinematic assets from vault</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
