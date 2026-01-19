Look at the VideoUploader.tsx 
```
 
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadButton } from '@/lib/uploadthing';
import { Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVideoStore } from './store/useVideoStore';

const VideoUploader = () => {
  const { uploadedVideos, addVideos, removeVideo, clearAllVideos } = useVideoStore();

  return (
    <div className="space-y-6">
      <Card className="bg-transparent backdrop-blur-md border-white/20 shadow-2xl overflow-hidden">
        <CardHeader className="relative">
          <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Upload Videos</CardTitle>
          <CardDescription className="text-gray-600">
            Upload MP4 video files to your library ({uploadedVideos.length} video{uploadedVideos.length !== 1 ? 's' : ''} uploaded)
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <div className="border-2 border-dashed border-purple-300/50 rounded-2xl p-12 bg-transparent backdrop-blur-sm hover:border-purple-400/70 transition-all duration-300 hover:shadow-xl">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="h-20 w-20 rounded-full bg-transparent backdrop-blur-lg border border-purple-500/30 flex items-center justify-center shadow-lg animate-pulse">
                <Upload className="h-10 w-10 text-purple-600" />
              </div>
              <UploadButton
                endpoint="videoUploader"
                onClientUploadComplete={res => {
                  if (res) {
                    const newVideos = res.map(file => ({
                      url: file.ufsUrl,
                      name: file.name,
                      key: file.key,
                      uploadedAt: new Date().toISOString(),
                    }));
                    addVideos(newVideos);
                  }
                }}
                onUploadError={(error: Error) => {
                  alert(`Upload error: ${error.message}`);
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {uploadedVideos.length > 0 && (
        <Card className="bg-transparent backdrop-blur-md border-white/20 shadow-2xl overflow-hidden">
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Manage Videos</CardTitle>
                <CardDescription className="text-gray-600">Delete individual videos or clear all</CardDescription>
              </div>
              <Button
                variant="destructive"
                onClick={clearAllVideos}
                className="bg-transparent backdrop-blur-md border border-red-500/30 hover:border-red-600/50 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-3">
              {uploadedVideos.map((video, index) => (
                <div
                  key={video.key}
                  className="flex items-center justify-between p-4 bg-transparent backdrop-blur-md rounded-xl border border-white/20 hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-left"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-transparent backdrop-blur-lg border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                      <Upload className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{video.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(video.uploadedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeVideo(video.key)}
                    className="text-red-600 hover:text-red-700 hover:bg-transparent hover:backdrop-blur-sm"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VideoUploader;

```
and here is VideoUploadManagerSingle.tsx 
```
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
```

and here is example of ImageUploadManagerSingle.tsx 
```
'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { X, UploadCloud, Loader2, ImageIcon, Ghost, RefreshCcw, Search, CheckCircle2, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';

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

interface InternalImageDialogProps {
  onImageSelect: (newImage: string) => void;
  selectedImage: string;
}

const InternalImageVault = ({ onImageSelect, selectedImage }: InternalImageDialogProps) => {
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

  const [addMedia, { isLoading: isAdding }] = useAddMediaMutation();
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableImages = useMemo(() => response?.data || [], [response]);

  const totalPages = useMemo(() => {
    if (!response?.total || !response?.limit) return 1;
    return Math.ceil(response.total / response.limit);
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
        toast.success('Asset synchronized to vault');
        onImageSelect(data.data.url);
      }
    } catch {
      toast.error('Vault uplink failed');
    } finally {
      setIsUploadingLocal(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-[90vh] md:h-[80vh] backdrop-blur-[150px] rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-2xl">
      <DialogHeader className="p-6 border-b border-white/5 bg-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
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
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-white/20"
            />
          </div>
          <div className="hidden">
            <DialogTitle>Media Vault</DialogTitle>
            <DialogDescription>Select or upload media assets</DialogDescription>
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
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500/60">Scanning Bio-Grid...</span>
            </div>
          ) : availableImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              <AnimatePresence mode="popLayout">
                {availableImages.map((item, idx) => {
                  const isSelected = selectedImage === item.url;
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: idx * 0.02, type: 'spring', stiffness: 260, damping: 20 }}
                      onClick={() => onImageSelect(item.url)}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-500 group
                        ${
                          isSelected
                            ? 'border-indigo-500 scale-95 shadow-[0_0_50px_rgba(99,102,241,0.4)]'
                            : 'border-white/5 hover:border-indigo-500/30 hover:scale-105 shadow-xl'
                        }
                      `}
                    >
                      <Image
                        src={item.url}
                        fill
                        alt={item.name || 'Images'}
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                        <span className="text-[9px] font-black uppercase tracking-widest text-white truncate">{item.name}</span>
                      </div>
                      {isSelected && (
                        <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center backdrop-blur-[2px]">
                          <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="bg-indigo-500 text-white rounded-full p-3 shadow-2xl"
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
            <div className="flex flex-col items-center justify-center py-40 opacity-30 space-y-6">
              <Ghost className="w-24 h-24 animate-bounce" />
              <div className="text-center">
                <h3 className="text-2xl font-black uppercase tracking-[0.6em]">Void Detected</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-3">No assets matching the criteria found</p>
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

          <div className="flex items-center gap-3 px-5 h-10 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[11px] font-black text-white">{currentPage}</span>
            <span className="text-[10px] font-black text-white/20">/</span>
            <span className="text-[11px] font-black text-white/60">{totalPages}</span>
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
            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Total : {response?.total || 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageUpload} />
          <Button onClick={() => fileInputRef.current?.click()} disabled={isUploadingLocal || isAdding} variant="outlineGlassy" size="sm">
            {isUploadingLocal || isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            {isAdding || isUploadingLocal ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function ImageUploadManagerSingle({
  value,
  onChange,
  label = 'ASSET SELECTION',
}: {
  value: string;
  onChange: (val: string) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between px-1">
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{label}</label>
        <AnimatePresence>
          {value && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={e => {
                  e.stopPropagation();
                  onChange('');
                }}
                className="h-7 px-3 text-rose-400 hover:text-rose-300 border border-rose-500/30 hover:border-rose-500 font-black uppercase tracking-widest text-[9px] bg-rose-500/5 hover:bg-rose-500/10 rounded-lg transition-all"
              >
                <X className="w-3.5 h-3.5 mr-2" /> DISCARD
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="group relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl backdrop-blur-3xl transition-all duration-700 cursor-pointer overflow-hidden flex flex-col items-center justify-center border border-white/5 hover:border-indigo-500/30 bg-white/[0.02]">
            {value ? (
              <>
                <Image src={value} fill alt="Current Selection" className="object-cover transition-transform duration-1000 group-hover:scale-105" unoptimized />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[0.3em] text-white"
                  >
                    <RefreshCcw className="w-5 h-5 animate-[spin_4s_linear_infinite]" />
                    REPLACE ASSET
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
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-indigo-500/40 group-hover:bg-indigo-500/5 transition-all duration-500"
                >
                  <ImageIcon className="w-10 h-10 text-white/20 group-hover:text-indigo-400" />
                </motion.div>
                <div className="text-center space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.5em] text-white/40 group-hover:text-white transition-colors">No Asset Selected</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">Access the mainframe to proceed</p>
                </div>
              </div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="bg-transparent border-none p-0 shadow-none overflow-hidden max-w-5xl w-[95vw] text-white mt-4">
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

```
Now Your task is implement those features in VideoUploadManagerSingle.tsx 
1. Implement pagination.
2. Update search query.
3. do not change color-combination and style. 
4. and make sure user can upload only Video from the bottom Upload Button. 