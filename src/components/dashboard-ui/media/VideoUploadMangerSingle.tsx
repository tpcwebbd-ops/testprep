'use client';

import { useMemo, useState } from 'react';
import { X, UploadCloud, Loader2, Ghost, RefreshCcw, Search, CheckCircle2, Zap, MonitorPlay, Play, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UploadButton } from '@/lib/uploadthing';

import { useGetMediasQuery, useAddMediaMutation } from '@/redux/features/media/mediaSlice';

interface InternalVideoVaultProps {
  onVideoSelect: (url: string) => void;
  selectedVideo: string;
}

const InternalVideoVault = ({ onVideoSelect, selectedVideo }: InternalVideoVaultProps) => {
  const { data: response, isLoading: isFetching } = useGetMediasQuery({});
  const [addMedia] = useAddMediaMutation();
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
        onVideoSelect(res[0].url);
      } catch {
        toast.error('Sync to vault failed');
      } finally {
        setIsUploadingLocal(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-[85vh] md:h-[70vh] backdrop-blur-[150px] rounded-xl overflow-hidden border border-white/10 bg-black/40">
      <DialogHeader className="p-6 border-b border-white/5 text-white">
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
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 animate-pulse">Syncing Media Streams...</span>
          </div>
        ) : availableVideos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
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
                      ${
                        isSelected
                          ? 'border-indigo-500 scale-95 shadow-[0_0_40px_rgba(99,102,241,0.3)]'
                          : 'border-white/5 hover:border-white/20 hover:scale-105'
                      }
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
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/60 truncate">{item.name || 'VIDEO_STREAM'}</span>
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
              <h3 className="text-2xl font-black uppercase tracking-[0.4em]">No Footage</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-2">The video archive is currently empty</p>
            </div>
          </div>
        )}
      </ScrollArea>

      <div className="flex items-center gap-4 justify-end w-full p-4 border-t border-white/5">
        <UploadButton
          endpoint="videoUploader"
          appearance={{
            button: `h-9 px-4 rounded-md border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2 duration-300`,
            allowedContent: 'hidden',
          }}
          content={{
            button({ ready }) {
              if (isUploadingLocal) return <Loader2 className="w-3.5 h-3.5 animate-spin" />;
              return (
                <>
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{ready ? 'UPLOAD NEW' : 'INITIALIZING...'}</span>
                </>
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
        <h4 className="text-sm text-white/40 flex items-center gap-2">
          <MonitorPlay className="w-3.5 h-3.5" />
          {label}
        </h4>
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={e => {
              e.stopPropagation();
              onChange('');
            }}
            className="h-6 text-rose-200 cursor-pointer hover:text-red-400 text-[9px] border-rose-500 border font-black uppercase tracking-widest bg-red-500/5 hover:bg-red-500/10"
          >
            <X className="w-3 h-3 mr-1" /> Remove
          </Button>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="group relative w-full aspect-video rounded-xl backdrop-blur-[120px] transition-all duration-700 cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-4 border border-white/5 hover:border-white/10">
            {value ? (
              <>
                <video
                  src={value}
                  className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-105"
                  muted
                  loop
                  onMouseOver={e => e.currentTarget.play()}
                  onMouseOut={e => e.currentTarget.pause()}
                />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                  <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[0.2em] text-white scale-90 group-hover:scale-100 transition-transform">
                    <RefreshCcw className="w-4 h-4 animate-[spin_4s_linear_infinite]" />
                    Update Stream
                  </div>
                </div>
                <div className="absolute top-4 right-4 p-2 bg-indigo-500 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-3 h-3 text-white fill-current" />
                </div>
              </>
            ) : (
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 3, repeat: Infinity }} className="flex flex-col items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-all duration-500">
                  <Film className="w-8 h-8 text-white/20 group-hover:text-indigo-400" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xl text-white/40 group-hover:text-white transition-colors">No Source Loaded</p>
                  <p className="text-sm text-white/60 group-hover:text-white transition-colors">Select Production Footage</p>
                </div>
              </motion.div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="bg-transparent border-none p-0 shadow-none overflow-hidden max-w-4xl w-[95vw] text-white">
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
