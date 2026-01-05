'use client';

import React, { useMemo, useState } from 'react';
import { X, Loader2, Music, Ghost, RefreshCcw, Search, CheckCircle2, Zap, Headphones, ShieldCheck, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UploadButton } from '@/lib/uploadthing';

import { useGetMediasQuery, useAddMediaMutation } from '@/redux/features/media/mediaSlice';

interface InternalAudioVaultProps {
  onAudioSelect: (newAudio: string) => void;
  selectedAudio: string;
}

const InternalAudioVault = ({ onAudioSelect, selectedAudio }: InternalAudioVaultProps) => {
  const { data: response, isLoading: isFetching } = useGetMediasQuery({});
  const [addMedia, { isLoading: isAdding }] = useAddMediaMutation();
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const availableAudios = useMemo(() => {
    if (!response?.data) return [];
    return (
      response.data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((item: any) => item.contentType === 'audio' && item.status === 'active')
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
              placeholder="SEARCH AUDIO VAULT..."
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
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 animate-pulse">Syncing Frequency Data...</span>
          </div>
        ) : availableAudios.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                availableAudios.map((item: any, idx: number) => {
                  const isSelected = selectedAudio === item.url;
                  return (
                    <motion.div
                      key={item.url}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => onAudioSelect(item.url)}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-500 group flex flex-col items-center justify-center gap-3
                      ${isSelected ? 'border-indigo-500 bg-indigo-500/10 scale-95 shadow-[0_0_40px_rgba(99,102,241,0.3)]' : 'border-white/5 hover:border-white/20 hover:scale-105 bg-white/5'}
                    `}
                    >
                      <Music
                        className={`w-10 h-10 transition-colors duration-500 ${isSelected ? 'text-indigo-400' : 'text-white/20 group-hover:text-white/60'}`}
                      />
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/60 text-center px-2 line-clamp-2">
                        {item.name || 'AUDIO_PHASE_DETECTED'}
                      </span>
                      {isSelected && (
                        <div className="absolute inset-0 bg-indigo-500/10 flex items-center justify-center backdrop-blur-[2px]">
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-indigo-500 text-white rounded-full p-2 shadow-2xl">
                            <CheckCircle2 className="w-5 h-5" />
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
              <h3 className="text-2xl font-black uppercase tracking-[0.4em]">Zero Signals</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-2">The audio quadrant is silent</p>
            </div>
          </div>
        )}
      </ScrollArea>

      <div className="flex items-center gap-4 justify-end w-full p-6 border-t border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          {(isUploadingLocal || isAdding) && (
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20">
              <Loader2 className="w-3 h-3 text-indigo-400 animate-spin" />
              <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Encoding Signal</span>
            </div>
          )}
          <UploadButton
            endpoint="audioUploader"
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
                  contentType: 'audio',
                  status: 'active',
                }).unwrap();
                setIsUploadingLocal(false);
                onAudioSelect(res[0].url);
                toast.success('Audio frequency synchronized');
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

export default function AudioUploadManagerSingle({
  value,
  onChange,
  label = 'Single Audio',
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
          <Headphones className="w-4 h-4 text-indigo-400/50" /> {label}
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
            <X className="w-3 h-3 mr-1" /> Terminate Feed
          </Button>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="group relative w-full aspect-video rounded-xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden cursor-pointer transition-all duration-700 hover:border-white/20">
            {value ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                  <div className="relative flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.3, 0.1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute w-32 h-32 rounded-full bg-indigo-500/20 blur-2xl"
                    />
                    <motion.div
                      animate={{ height: [20, 40, 25, 45, 20] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="flex items-center gap-1.5 h-12"
                    >
                      {[1, 2, 3, 4, 5].map(i => (
                        <motion.div
                          key={i}
                          animate={{ height: [10, 30, 15, 35, 10] }}
                          transition={{ duration: 1, delay: i * 0.1, repeat: Infinity }}
                          className="w-1 bg-indigo-400/60 rounded-full"
                        />
                      ))}
                    </motion.div>
                  </div>
                  <div className="relative z-10 p-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 group-hover:bg-indigo-500/20 transition-all">
                    <Play className="w-6 h-6 text-white/40 group-hover:text-white fill-white/10 group-hover:fill-white/20 ml-1" />
                  </div>
                </div>

                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                  <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[0.2em] text-white scale-90 group-hover:scale-100 transition-transform">
                    <RefreshCcw className="w-4 h-4 animate-[spin_4s_linear_infinite]" />
                    Re-Map Frequency
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="px-4 py-2 bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 rounded-full flex items-center gap-2"
                  >
                    <ShieldCheck className="w-3 h-3 text-indigo-400" />
                    <span className="text-[10px] font-black text-indigo-300 italic tracking-tighter">SECURE_AUDIO_FEED</span>
                  </motion.div>
                </div>
              </div>
            ) : (
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-full h-full flex flex-col items-center justify-center gap-4"
              >
                <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-all duration-500">
                  <Music className="w-8 h-8 text-white/20 group-hover:text-indigo-400" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm text-white/60 group-hover:text-white transition-colors tracking-widest font-bold uppercase">Initialize Audio Stream</p>
                </div>
              </motion.div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="bg-transparent border-none p-0 shadow-none overflow-hidden max-w-5xl w-[95vw]">
          <InternalAudioVault
            selectedAudio={value}
            onAudioSelect={url => {
              onChange(url);
              setIsOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
