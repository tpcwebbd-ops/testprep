Look at the dashboard/enrollments/page.tsx
```
const Page = () => {
  return <main>Page</main>;
};
export default Page;
```

api/enrollments/controller.ts
```

```
api/enrollments/model.ts
```

```
api/enrollments/route.ts
```

```

redux/enrollmentsSlice.ts
```

```

components/ImageUploadManager.ts
```
'use client';

import Image from 'next/image';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import imageCompression from 'browser-image-compression';
import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Plus, X, UploadCloud, Loader2, ImageIcon, Ghost, Search, CheckCircle2, Zap, ChevronLeft, ChevronRight, ImagesIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetMediasQuery, useAddMediaMutation } from '@/redux/features/media/mediaSlice';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';


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
  onImageToggle: (item: { url: string; name: string }) => void;
  selectedImages: { url: string; name: string }[];
}

const InternalImageVault = ({ onImageToggle, selectedImages }: InternalImageDialogProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const ITEMS_PER_PAGE = 9;

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
  }) as {
    data: MediaResponse | undefined;
    isLoading: boolean;
    isFetching: boolean;
  };

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
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
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
          uploaderPlace: 'imageBB',
          status: 'active',
        }).unwrap();
        toast.success('Image successfully uploaded');
        onImageToggle({ url: data.data.url, name: file.name });
      }
    } catch {
      toast.error('Image upload failed');
    } finally {
      setIsUploadingLocal(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
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
                      key={item.url}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        delay: idx * 0.03,
                        type: 'spring',
                        stiffness: 260,
                        damping: 20,
                      }}
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
                          className={`text-sm font-medium transition-colors duration-300 truncate w-full
                            ${isSelected ? 'text-indigo-400' : 'text-white/50 group-hover:text-white'}
                          `}
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
            <DialogContent className="bg-transparent p-0 shadow-none overflow-hidden max-w-5xl w-[95vw] text-white mt-4 border-white/50 border rounded-sm">
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
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="text-[11px] font-medium text-white/80 truncate">{item.name || 'Untitled'}</span>
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
                <div className="text-center space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90 group-hover:text-white transition-colors">No Images Selected</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">Click here to Select one</p>
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

components/ImageUploadManagerSingle
```

'use client';

import Image from 'next/image';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import imageCompression from 'browser-image-compression';
import React, { useMemo, useState, useRef, useEffect } from 'react';
import { X, UploadCloud, Loader2, ImageIcon, Ghost, RefreshCcw, Search, CheckCircle2, Zap, ChevronLeft, ChevronRight, Wallpaper } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetMediasQuery, useAddMediaMutation } from '@/redux/features/media/mediaSlice';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

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
  onImageSelect: ({ name, url }: { name: string; url: string }) => void;
  selectedImage: string;
}

const InternalImageVault = ({ onImageSelect, selectedImage }: InternalImageDialogProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const ITEMS_PER_PAGE = 9;

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
          uploaderPlace: 'imageBB',
          status: 'active',
        }).unwrap();
        toast.success('Image successfully uploaded');
        onImageSelect({ name: file.name, url: data.data.url });
      }
    } catch {
      toast.error('Image upload failed');
    } finally {
      setIsUploadingLocal(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
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
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {availableImages.map((item, idx) => {
                  const isSelected = selectedImage === item.url;
                  return (
                    <motion.div
                      key={item.url}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        delay: idx * 0.03,
                        type: 'spring',
                        stiffness: 260,
                        damping: 20,
                      }}
                      className="flex flex-col gap-3 group "
                    >
                      <div
                        onClick={() => onImageSelect({ name: item.name, url: item.url })}
                        className={`relative aspect-square rounded-sm overflow-hidden cursor-pointer transition-all duration-500 
          ${isSelected ? ' scale-[0.98] shadow-[0_0_40px_rgba(99,102,241,0.3)]' : 'hover:scale-[1.02] shadow-2xl'}
        `}
                      >
                        <Image
                          src={item.url}
                          fill
                          alt={item.name || 'Gallery Image'}
                          className={`object-cover transition-transform duration-1000 ease-out  border border-white/40 rounded-sm 
                            ${isSelected ? 'scale-110' : 'group-hover:scale-110 '}
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
                              className="absolute inset-0 bg-indigo-600/20 backdrop-blur-[3px] flex items-center justify-center overflow-hidden  border border-white/60 rounded-sm"
                            >
                              <motion.div
                                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                exit={{ scale: 0, rotate: 180, opacity: 0 }}
                                transition={{ type: 'spring', damping: 12 }}
                                className="bg-white text-indigo-600 rounded-sm p-4 shadow-2xl "
                              >
                                <CheckCircle2 className="w-8 h-8" />
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="absolute inset-0 pointer-events-none border-[1px] border-white/10 rounded-sm" />
                      </div>

                      <div className="-mt-2 flex items-center justify-start gap-2">
                        <ImageIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-white/40'}`} />
                        <h3
                          className={`text-sm font-medium transition-colors duration-300 truncate w-full
          ${isSelected ? 'text-indigo-400' : 'text-white/50 group-hover:text-white'}
        `}
                        >
                          {item.name || 'Untitled Name'}
                        </h3>
                      </div>
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
  label = 'Image',
}: {
  value: { name: string; url: string };
  onChange: (val: { name: string; url: string }) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4 w-full h-full ">
      <div className="flex items-center justify-between px-1">
        <div className="w-full flex items-start justify-start gap-2">
          <Wallpaper className="w-3.5 h-3.5" />
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{label}</label>
        </div>
        <AnimatePresence>
          {value.name && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <Button
                variant="outlineGlassy"
                size="sm"
                onClick={e => {
                  e.stopPropagation();
                  onChange({ name: '', url: '' });
                }}
              >
                <X className="w-3.5 h-3.5" /> Remove
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="group relative w-full h-[315px] aspect-[16/9] md:aspect-[21/9] rounded-sm backdrop-blur-3xl transition-all duration-700 cursor-pointer overflow-hidden flex flex-col items-center justify-center border border-white/50 hover:border-indigo-500/30 bg-white/2">
            {value.name ? (
              <div className="">
                <Image
                  src={value.url}
                  fill
                  alt="Current Selection"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  unoptimized
                />

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 px-8 py-4 rounded-sm bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[0.3em] text-white"
                  >
                    <RefreshCcw className="w-5 h-5 animate-[spin_4s_linear_infinite]" />
                    REPLACE ASSET
                  </motion.div>
                </div>
                <div className="absolute bottom-1 left-1 flex items-center justify-start gap-2">
                  <ImageIcon className={`w-3.5 h-3.5 text-white/80 bg-gray-800/50`} />
                  <h3 className={`text-sm font-medium truncate w-full`}>{value.name || 'Untitled Name'}</h3>
                </div>
              </div>
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
        <DialogContent className="bg-transparent p-0 shadow-none overflow-hidden max-w-5xl w-[95vw] text-white mt-4 border-white/50 border rounded-sm">
          <InternalImageVault
            selectedImage={value.url}
            onImageSelect={val => {
              onChange({ name: val.name, url: val.url });
              setIsOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

```

components/YTVideoUploadManager
```

'use client';

import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useMemo, useState, useEffect } from 'react';
import { X, Loader2, Search, CheckCircle2, Youtube, Plus, MonitorPlay, ChevronLeft, ChevronRight, Film, Code, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetMediasQuery, useAddMediaMutation } from '@/redux/features/media/mediaSlice';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface MediaItem {
  _id: string;
  name: string;
  url: string;
  status: string;
  contentType: string;
  uploaderPlace?: string;
  createdAt: string;
}

interface MediaResponse {
  data: MediaItem[];
  total: number;
  page: number;
  limit: number;
}

interface YouTubeVaultProps {
  onVideoToggle: (item: { url: string; name: string }) => void;
  selectedVideos: { url: string; name: string }[];
}

const InternalYouTubeVault = ({ onVideoToggle, selectedVideos }: YouTubeVaultProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [iframeCode, setIframeCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const ITEMS_PER_PAGE = 6;

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

  const availableVideos = useMemo(() => response?.data || [], [response]);
  const totalPages = useMemo(() => Math.ceil((response?.total || 0) / ITEMS_PER_PAGE) || 1, [response]);

  const handleProcessImport = async () => {
    if (!iframeCode.trim()) {
      toast.warn('Please paste iframe from YouTube');
      return;
    }

    setIsProcessing(true);
    try {
      const match = iframeCode.match(/src="([^"]+)"/);
      const url = match ? match[1] : iframeCode.trim();

      if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
        toast.error('Invalid YouTube source detected');
        return;
      }

      const newMedia = {
        name: `YT_ASSET_${Date.now()}`,
        url: url,
        status: 'active',
        contentType: 'video',
        uploaderPlace: 'youtube',
      };

      const result = await addMedia(newMedia).unwrap();
      toast.success('YouTube Asset Pipeline Integrated');
      onVideoToggle({ url: result.url, name: result.name });
      setIframeCode('');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to link YouTube asset');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-[90vh] md:h-[85vh] backdrop-blur-3xl rounded-sm overflow-hidden bg-black/40 border border-white/10 shadow-2xl">
      <DialogHeader className="p-6 border-b border-white/5 bg-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isRefetching ? 'text-indigo-500 animate-pulse' : 'text-white/20'}`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="SEARCH YOUTUBE ARCHIVE..."
              className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/20"
            />
          </div>
          <div className="hidden">
            <DialogTitle />
            <DialogDescription />
          </div>
        </div>
      </DialogHeader>

      <div className="flex-1 relative overflow-hidden">
        <ScrollArea className="h-full w-full p-8">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full"
                />
                <Zap className="absolute inset-0 m-auto w-6 h-6 text-indigo-500/40" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 animate-pulse">Syncing Vault...</span>
            </div>
          ) : availableVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {availableVideos.map((item, idx) => {
                  const isSelected = selectedVideos.some(v => v.url === item.url);
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => onVideoToggle({ url: item.url, name: item.name })}
                      className={`group relative aspect-video rounded-sm border cursor-pointer transition-all duration-500 ${
                        isSelected ? 'border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.2)]' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="absolute inset-0 bg-neutral-900/80 flex items-center justify-center overflow-hidden">
                        <iframe src={item.url} className="w-full h-full pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                          <Youtube className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-white/40'}`} />
                          <span className="text-[9px] font-bold text-white/60 truncate max-w-[120px] uppercase tracking-tighter">{item.name}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute inset-0 bg-indigo-500/10 backdrop-blur-[2px] flex items-center justify-center">
                          <CheckCircle2 className="w-8 h-8 text-indigo-500" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 opacity-20">
              <Film className="w-16 h-16 mb-4 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-widest">No Assets Indexed</p>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="p-6 border-t border-white/10 bg-black/40 space-y-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Code className="w-3.5 h-3.5 text-indigo-400" />
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Import YouTube Node</label>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <textarea
              value={iframeCode}
              onChange={e => setIframeCode(e.target.value)}
              placeholder="Paste <iframe> code here..."
              className="flex-1 bg-white/5 border border-white/10 rounded-sm p-3 text-[11px] font-mono text-indigo-300 focus:outline-none focus:border-indigo-500/50 min-h-[60px] transition-all resize-none"
            />
            <Button
              onClick={handleProcessImport}
              disabled={isProcessing}
              variant="outlineGlassy"
              className="h-auto py-4 px-8 bg-indigo-500/10 border-indigo-500/30 hover:bg-indigo-500/20 text-indigo-400"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              <span className="text-[10px] font-black uppercase tracking-widest">Process & Import</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Button
              variant="outlineGlassy"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isFetching}
              className="px-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-sm text-[10px] font-bold text-white/60">
              {currentPage} / {totalPages}
            </div>
            <Button
              variant="outlineGlassy"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || isFetching}
              className="px-2"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[9px] font-black uppercase tracking-widest text-white/30">YT-API Signal: Stable</p>
        </div>
      </div>
    </div>
  );
};

export default function YouTubeVideoUploadManager({
  value,
  onChange,
  label = 'YouTube Assets',
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
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-white/90">
            <Youtube className="w-4 h-4 text-red-500" />
            <label className="text-[11px] font-black uppercase tracking-[0.2em]">{label}</label>
          </div>
          <span className="text-[9px] font-bold text-white/40 tracking-widest uppercase">{value.length} Linked Nodes</span>
        </div>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {value.length > 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <Button variant="outlineFire" size="sm" onClick={() => onChange([])} className="min-w-1">
                  <X className="w-3 h-3" /> Clear All
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outlineGlassy" size="sm" className="min-w-1">
                <Plus className="w-3.5 h-3.5" /> Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl bg-transparent p-0 shadow-none border-white/40 border rounded-sm overflow-hidden mt-8 text-white">
              <InternalYouTubeVault selectedVideos={value} onVideoToggle={toggleVideo} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="min-h-[280px] rounded-sm p-6 border border-white/5 bg-white/2 backdrop-blur-xl relative overflow-hidden">
        <ScrollArea className="h-full w-full">
          {value.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {value.map((item, idx) => (
                  <motion.div
                    key={item.url}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group relative aspect-video rounded-sm overflow-hidden border border-white/10"
                  >
                    <iframe src={item.url} className="w-full h-full pointer-events-none" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/90 px-4 text-center truncate w-full">{item.name}</p>
                      <Button
                        variant="outlineFire"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={() => onChange(value.filter(v => v.url !== item.url))}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-6 opacity-30">
              <div className="flex gap-4">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                    className="w-12 h-12 rounded-sm border border-white/20 flex items-center justify-center bg-white/5"
                  >
                    <MonitorPlay className="w-6 h-6" />
                  </motion.div>
                ))}
              </div>
              <div className="text-center">
                <p className="text-xs font-black uppercase tracking-[0.3em]">No Content Selected</p>
                <p className="text-[9px] font-bold uppercase mt-1 tracking-widest">Interface Ready for Ingestion</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}

```

components/YTVideoUploadManagerSingle
```

'use client';

import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useMemo, useState, useEffect } from 'react';
import { X, Loader2, RefreshCcw, Search, CheckCircle2, Zap, MonitorPlay, Film, ChevronLeft, ChevronRight, VideoIcon, Youtube, Code } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetMediasQuery, useAddMediaMutation } from '@/redux/features/media/mediaSlice';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface MediaItem {
  _id: string;
  name: string;
  url: string;
  status: string;
  contentType: string;
  uploaderPlace?: string;
  createdAt: string;
}

interface MediaResponse {
  data: MediaItem[];
  total: number;
  page: number;
  limit: number;
}

interface InternalYouTubeVaultProps {
  onVideoSelect: (val: { name: string; url: string }) => void;
  selectedUrl: string;
}

const InternalYouTubeVault = ({ onVideoSelect, selectedUrl }: InternalYouTubeVaultProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [iframeCode, setIframeCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const ITEMS_PER_PAGE = 6;

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

  const availableVideos = useMemo(() => response?.data || [], [response]);
  const totalPages = useMemo(() => Math.ceil((response?.total || 0) / ITEMS_PER_PAGE) || 1, [response]);

  const handleProcessImport = async () => {
    if (!iframeCode.trim()) {
      toast.warn('Please paste iframe from YouTube');
      return;
    }

    setIsProcessing(true);
    try {
      const match = iframeCode.match(/src="([^"]+)"/);
      const url = match ? match[1] : iframeCode.trim();

      const payload = {
        name: `YT_STREAM_${Date.now()}`,
        url: url,
        status: 'active',
        contentType: 'video',
        uploaderPlace: 'youtube',
      };

      const result = await addMedia(payload).unwrap();
      toast.success('YouTube Asset Integrated');
      onVideoSelect({ name: result.name, url: result.url });
      setIframeCode('');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to process YouTube asset');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-[90vh] md:h-[85vh] backdrop-blur-3xl rounded-sm overflow-hidden bg-black/60 border border-white/20 shadow-2xl">
      <DialogHeader className="p-6 border-b border-white/10 bg-white/5">
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
              placeholder="SEARCH YOUTUBE VAULT..."
              className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/20"
            />
          </div>
          <div className="hidden">
            <DialogTitle />
            <DialogDescription />
          </div>
        </div>
      </DialogHeader>

      <div className="flex-1 relative overflow-hidden">
        <ScrollArea className="h-full w-full p-8">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-20 h-20 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full"
                />
                <Zap className="absolute inset-0 m-auto w-8 h-8 text-indigo-500 animate-pulse" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400">Syncing Grid...</span>
            </div>
          ) : availableVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {availableVideos.map((item, idx) => {
                  const isSelected = selectedUrl === item.url;
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => onVideoSelect({ name: item.name, url: item.url })}
                      className="group flex flex-col gap-3"
                    >
                      <div
                        className={`relative aspect-video rounded-sm overflow-hidden border cursor-pointer transition-all duration-500 
                        ${isSelected ? 'border-indigo-500 ring-1 ring-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.2)]' : 'border-white/10 hover:border-white/30'}
                      `}
                      >
                        <div className="absolute inset-0 bg-black flex items-center justify-center">
                          <iframe
                            src={item.url}
                            className="absolute inset-0 w-full h-full pointer-events-none opacity-50 group-hover:opacity-80 transition-opacity"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                        </div>
                        {isSelected && (
                          <div className="absolute inset-0 bg-indigo-500/10 backdrop-blur-[2px] flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-indigo-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 px-1">
                        <Youtube className={`w-3 h-3 ${isSelected ? 'text-indigo-400' : 'text-white/30'}`} />
                        <span className={`text-[10px] font-bold truncate uppercase tracking-tighter ${isSelected ? 'text-indigo-400' : 'text-white/50'}`}>
                          {item.name}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 opacity-20">
              <Film className="w-16 h-16 animate-pulse mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest">Vault Empty</p>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="p-6 border-t border-white/10 bg-white/5 space-y-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Code className="w-3.5 h-3.5 text-indigo-400" />
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Import YouTube Embed</label>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <textarea
              value={iframeCode}
              onChange={e => setIframeCode(e.target.value)}
              placeholder='<iframe src="https://www.youtube.com/embed/..." ...></iframe>'
              className="flex-1 bg-black/40 border border-white/10 rounded-sm p-3 text-[11px] font-mono text-indigo-300 focus:outline-none focus:border-indigo-500/50 min-h-[70px] transition-all resize-none"
            />
            <Button
              onClick={handleProcessImport}
              disabled={isProcessing}
              variant="outlineGlassy"
              className="h-auto px-8 bg-indigo-500/10 border-indigo-500/30 hover:bg-indigo-500/20 text-indigo-400"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Youtube className="w-4 h-4 mr-2" />}
              <span className="text-[10px] font-black uppercase tracking-widest">Process & Link</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Button
              variant="outlineGlassy"
              size="sm"
              className="px-2"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isFetching}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-sm text-[10px] font-black text-white/60">
              {currentPage} / {totalPages}
            </div>
            <Button
              variant="outlineGlassy"
              size="sm"
              className="px-2"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || isFetching}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[9px] font-black uppercase tracking-widest text-white/20">System Status: Operational</p>
        </div>
      </div>
    </div>
  );
};

export default function YouTubeVideoUploadManagerSingle({
  value,
  onChange,
  label = 'YOUTUBE SOURCE',
}: {
  value: { name: string; url: string };
  onChange: (val: { name: string; url: string }) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4 w-full group/container">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Youtube className="w-4 h-4 text-red-500" />
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{label}</label>
        </div>
        <AnimatePresence>
          {value?.url && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <Button variant="outlineFire" size="sm" onClick={() => onChange({ name: '', url: '' })} className="min-w-1">
                <X className="w-3 h-3" /> Remove
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="group relative w-full aspect-video rounded-sm backdrop-blur-3xl transition-all duration-700 cursor-pointer overflow-hidden flex flex-col items-center justify-center border border-white/10 hover:border-indigo-500/40 bg-white/[0.02]">
            {value?.url ? (
              <div className="w-full h-full relative">
                <iframe src={value.url} className="w-full h-full pointer-events-none" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 px-8 py-4 rounded-sm bg-indigo-500/10 border border-indigo-500/30 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400"
                  >
                    <RefreshCcw className="w-4 h-4 animate-spin-slow" />
                    RELINK SOURCE
                  </motion.div>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-sm">
                  <div className="flex items-center gap-2 truncate">
                    <VideoIcon className="w-3 h-3 text-indigo-400" />
                    <span className="text-[9px] font-black text-white tracking-widest truncate uppercase">{value.name || 'ACTIVE_YOUTUBE_STREAM'}</span>
                  </div>
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6">
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                    boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 40px rgba(99,102,241,0.1)', '0 0 0px rgba(99,102,241,0)'],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-16 h-16 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center"
                >
                  <MonitorPlay className="w-8 h-8 text-white/20" />
                </motion.div>
                <div className="text-center space-y-2 px-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/80 group-hover:text-indigo-400 transition-colors">
                    No Asset Deployed
                  </p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">Select from YouTube Vault</p>
                </div>
              </div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="bg-transparent border border-white/40 p-0 shadow-none overflow-hidden max-w-5xl w-[95vw] text-white mt-8">
          <InternalYouTubeVault
            selectedUrl={value?.url}
            onVideoSelect={val => {
              onChange(val);
              setIsOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

```

and here is example of response
```
{
    "data": {
        "enrollments": [],
        "total": 0,
        "page": 1,
        "limit": 10
    },
    "message": "Fetched successfully",
    "status": 200
}
```

Now your task is to update `dashboard/enrollments/page.tsx` with the following requirements:

1. 🔘 Add Button & Modal (Top Right)
   - Place a visually appealing **"Add Order"** button at the top-right corner.
   - On click, open a **modern modal (centered, responsive)** with:
     - Smooth **fade + scale animation** on open/close.
     - A **close (✕) icon** at the top-right.
   - Inside the modal:
     - Dynamically generate **all fields from the model**.
     - Handle media inputs:
       - Single image → `ImageUploadManagerSingle`
       - Multiple images → `ImageUploadManager`
       - Single video → `VideoUploadImageManagerSingle`
       - Multiple videos → `VideoUploadImageManager`
     - Bottom aligned **"Add" button** with loading state.
   - Ensure:
     - Proper **form validation**
     - Clear **error messages**
     - **Responsive layout** (stack fields on mobile, grid on desktop)

2. 📊 Summary Section (Filterable Cards)
   - Create a **summary dashboard section** with 3 cards:
     - Last Month (30 days)
     - Last Week (7 days)
     - Total (Lifetime)
   - Each card:
     - Displays **total sales/enrollments**
     - Has **hover animation (scale + shadow)**
     - Is **clickable to filter data**
   - Use a clean **card layout with icons and color distinction**
   - Make it **responsive (grid → stacked on mobile)**

3. 🔍 Smart Search Bar
   - Add a **debounced search input**:
     - Trigger API call after **3 characters**
     - Add **300ms–500ms debounce**
     - Avoid duplicate fetch if input hasn’t changed
   - Include:
     - Search icon inside input
     - Loading indicator while fetching

4. 📋 Table Section (Advanced Data Table)
   - Build a **fully responsive data table** with:
     - Horizontal scroll on mobile
     - Sticky header (optional)
   - Features:
     - Column visibility toggle (show/hide columns)
     - Export options (CSV, Excel)
     - Bulk select (checkbox per row + select all)
     - Bulk actions:
       - Delete
       - Update
     - Row actions:
       - Edit
       - Delete
       - View (optional modal/drawer)
   - Pagination:
     - Bottom aligned
     - Select items per page (10–500)
     - Smooth transition when changing pages

5. ⚙️ State Management (Redux Toolkit)
   - Use **Redux Toolkit Query (RTK Query)**:
     - Queries for fetching data
     - Mutations for add, update, delete
   - Ensure:
     - Proper cache invalidation
     - Optimistic updates (optional but preferred)

6. 🚦 UX States Handling
   - Loading:
     - Use skeleton loaders or spinners
   - Error:
     - Show user-friendly error messages
   - Empty State:
     - Display:
       👉 “No data found in database”
       - Add illustration or icon for better UX

7. 🎨 UI/UX & Design Guidelines
   - Use **modern design system (Tailwind / ShadCN / Material UI)**:
     - Soft shadows, rounded corners (lg/2xl)
     - Consistent spacing (padding & margins)
   - Color palette:
     - Primary: Indigo / Blue
     - Accent: Emerald / Orange
     - Background: Light gray / white
   - Typography:
     - Clear hierarchy (title, subtitle, body)
   - Animations:
     - Button hover → scale + color transition
     - Modal → fade + zoom
     - Cards → hover lift effect
     - Table rows → subtle hover highlight

8. 📱 Full Responsiveness
   - Mobile:
     - Stack layouts vertically
     - Scrollable table
   - Tablet:
     - 2-column grids where possible
   - Desktop/Laptop:
     - Full grid layout with proper spacing

9. 🧩 Code Quality
   - Keep components reusable:
     - Modal component
     - Table component
     - Form components
   - Use clean folder structure
   - Maintain readability and separation of concerns