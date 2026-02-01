'use client';

import React, { useMemo, useState } from 'react';
import { X, Loader2, Video, Ghost, RefreshCcw, Search, CheckCircle2, Zap, MonitorPlay, ShieldCheck, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UploadButton } from '@/lib/uploadthing';

import { useGetMediasQuery, useAddMediaMutation } from '@/redux/features/media/mediaSlice';

interface InternalVideoVaultProps {
  onVideoSelect: (newVideo: string) => void;
  selectedVideo: string;
}

const InternalVideoVault = ({ onVideoSelect, selectedVideo }: InternalVideoVaultProps) => {
  const { data: response, isLoading: isFetching } = useGetMediasQuery({});
  const [addMedia, { isLoading: isAdding }] = useAddMediaMutation();
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const availableVideos = useMemo(() => {
    if (!response?.data) return [];
    return (
      response.data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((item: any) => item.contentType === 'video' && item.status === 'active')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((item: any) => (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [response, searchQuery]);

  return (
    <div className="flex flex-col h-[85vh] md:h-[70vh] backdrop-blur-[150px] rounded-xl overflow-hidden border border-white/10 bg-black/40">
      <DialogHeader className="p-6 border-b border-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="SEARCH VIDEO VAULT..."
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-[10px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-indigo-500/50 transition-colors placeholder:text-white/20"
            />
          </div>
          <div className="hidden">
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
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
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 animate-pulse">Syncing Video Data...</span>
          </div>
        ) : availableVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                availableVideos.map((item: any, idx: number) => {
                  const isSelected = selectedVideo === item.url;
                  return (
                    <motion.div
                      key={item.url}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => onVideoSelect(item.url)}
                      className={`relative aspect-video rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-500 group
                      ${isSelected ? 'border-indigo-500 scale-95 shadow-[0_0_40px_rgba(99,102,241,0.3)]' : 'border-white/5 hover:border-white/20 hover:scale-105'}
                    `}
                    >
                      <video
                        src={item.url}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                        muted
                        onMouseEnter={e => e.currentTarget.play()}
                        onMouseLeave={e => {
                          e.currentTarget.pause();
                          e.currentTarget.currentTime = 0;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/60 truncate">{item.name || 'VIDEO_STREAM_DETECTED'}</span>
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
              <h3 className="text-2xl font-black uppercase tracking-[0.4em]">Zero Streams</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-2">The video quadrant is empty</p>
            </div>
          </div>
        )}
      </ScrollArea>

      <div className="flex items-center gap-4 justify-end w-full p-6 border-t border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          {(isUploadingLocal || isAdding) && (
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20">
              <Loader2 className="w-3 h-3 text-indigo-400 animate-spin" />
              <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Processing Node</span>
            </div>
          )}
          <UploadButton
            endpoint="videoUploader"
            appearance={{
              button:
                'bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest px-6 h-10 border border-white/10 rounded-xl transition-all after:hidden before:hidden',
              allowedContent: 'hidden',
            }}
            onUploadBegin={() => setIsUploadingLocal(true)}
            onClientUploadComplete={async res => {
              if (res && res[0]) {
                await addMedia({
                  url: res[0].url,
                  name: res[0].name,
                  contentType: 'video',
                  status: 'active',
                }).unwrap();
                setIsUploadingLocal(false);
                onVideoSelect(res[0].url);
                toast.success('Video uplink synchronized');
              }
            }}
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

export default function VideoUploadManagerSingle({
  value,
  onChange,
  label = 'Single Video',
}: {
  value: string;
  onChange: (val: string) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-white/40 text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2">
          <MonitorPlay className="w-4 h-4 text-indigo-400/50" /> {label}
        </h2>
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={e => {
              e.stopPropagation();
              onChange('');
            }}
            className="h-6 text-red-400/60 hover:text-red-400 text-[9px] font-black uppercase tracking-widest bg-red-500/5 hover:bg-red-500/10"
          >
            <X className="w-3 h-3 mr-1" /> Clear Source
          </Button>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="group relative w-full aspect-video rounded-xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden cursor-pointer transition-all duration-700 hover:border-white/20">
            {value ? (
              <div className="relative w-full h-full">
                <video src={value} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />

                <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/60 transition-all duration-500 flex items-center justify-center">
                  <div className="relative flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute w-32 h-32 rounded-full border border-indigo-500/30"
                    />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                      className="absolute w-24 h-24 rounded-full border-2 border-dashed border-white/10 group-hover:border-indigo-500/40"
                    />
                    <div className="relative z-10 w-16 h-16 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/50">
                      <Play className="w-6 h-6 text-white/40 group-hover:text-white fill-white/10 group-hover:fill-white/20 transition-all ml-1" />
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="px-4 py-2 bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 rounded-full flex items-center gap-2"
                  >
                    <ShieldCheck className="w-3 h-3 text-indigo-400" />
                  </motion.div>

                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <RefreshCcw className="w-3 h-3 text-white/60 animate-[spin_4s_linear_infinite]" />
                    <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">Swap</span>
                  </div>
                </div>
              </div>
            ) : (
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-full h-full flex flex-col items-center justify-center gap-4"
              >
                <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-all duration-500">
                  <Video className="w-8 h-8 text-white/20 group-hover:text-indigo-400" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm text-white/60 group-hover:text-white transition-colors tracking-widest font-bold uppercase">Initialize Stream</p>
                </div>
              </motion.div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="bg-transparent border-none p-0 shadow-none overflow-hidden max-w-5xl w-[95vw]">
          <InternalVideoVault
            selectedVideo={value}
            onVideoSelect={url => {
              onChange(url);
              setIsOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
