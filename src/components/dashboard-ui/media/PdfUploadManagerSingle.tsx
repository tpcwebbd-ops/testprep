'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { X, UploadCloud, Loader2, Ghost, Search, CheckCircle2, Zap, FileText, ChevronLeft, ChevronRight, RefreshCcw, FileSearch } from 'lucide-react';
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

interface InternalVaultProps {
  onPdfSelect: (url: string) => void;
  selectedPdf: string;
}

const InternalPdfVault = ({ onPdfSelect, selectedPdf }: InternalVaultProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const ITEMS_PER_PAGE = 8;
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    contentType: 'pdf',
    status: 'active',
  }) as { data: MediaResponse | undefined; isLoading: boolean; isFetching: boolean };

  const [addMedia, { isLoading: isAdding }] = useAddMediaMutation();
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);

  const availablePdfs = useMemo(() => response?.data || [], [response]);
  const totalPages = useMemo(() => {
    if (!response?.total || !response?.limit) return 1;
    return Math.ceil(response.total / response.limit);
  }, [response]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      toast.error('VALID PDF REQUIRED');
      return;
    }

    setIsUploadingLocal(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default');

      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, { method: 'POST', body: formData });

      const data = await res.json();
      if (data.secure_url) {
        await addMedia({
          url: data.secure_url,
          name: file.name,
          contentType: 'pdf',
          status: 'active',
        }).unwrap();
        toast.success('DOCUMENT ARCHIVED');
        onPdfSelect(data.secure_url);
      }
    } catch {
      toast.error('UPLINK FAILURE');
    } finally {
      setIsUploadingLocal(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-[85vh] md:h-[75vh] backdrop-blur-[150px] rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-2xl">
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
              placeholder="DECRYPT DOCUMENT TITLES..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/20"
            />
          </div>
          <div className="hidden">
            <DialogTitle>PDF Vault</DialogTitle>
            <DialogDescription>Select document from central archive</DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <ScrollArea className="flex-1 p-8">
        {isFetching ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full flex items-center justify-center"
            >
              <Zap className="w-6 h-6 text-indigo-500/40" />
            </motion.div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Syncing Intelligence...</span>
          </div>
        ) : availablePdfs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {availablePdfs.map((item, idx) => {
                const isSelected = selectedPdf === item.url;
                return (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: idx * 0.03, type: 'spring', stiffness: 260, damping: 20 }}
                    onClick={() => onPdfSelect(item.url)}
                    className={`relative aspect-[3/4] rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-500 group bg-white/[0.02] flex flex-col items-center justify-center p-6
                      ${isSelected ? 'border-indigo-500 scale-95 shadow-[0_0_40px_rgba(99,102,241,0.2)]' : 'border-white/5 hover:border-white/20 hover:scale-105 shadow-xl'}
                    `}
                  >
                    <FileText
                      className={`w-12 h-12 transition-all duration-500 ${isSelected ? 'text-indigo-400' : 'text-white/10 group-hover:text-white/30'}`}
                    />
                    <div className="mt-4 text-center">
                      <p className="text-[9px] font-black text-white/60 uppercase tracking-widest truncate max-w-[120px]">{item.name}</p>
                    </div>
                    {isSelected && (
                      <div className="absolute inset-0 bg-indigo-500/10 flex items-center justify-center backdrop-blur-[2px]">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-indigo-500 text-white rounded-full p-2">
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
          <div className="flex flex-col items-center justify-center py-32 opacity-20 space-y-6">
            <Ghost className="w-20 h-20 animate-bounce" />
            <h3 className="text-xl font-black uppercase tracking-[0.4em]">Zero Fragments</h3>
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
          <div className="flex items-center gap-3 px-5 h-10 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[11px] font-black text-white">{currentPage}</span>
            <span className="text-[10px] font-black text-white/20">/</span>
            <span className="text-[11px] font-black text-white/60">{totalPages}</span>
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
          <input type="file" ref={fileInputRef} accept="application/pdf" className="hidden" onChange={handleUpload} />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingLocal || isAdding}
            className="w-full md:w-auto h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3 border-none shadow-2xl"
          >
            {isUploadingLocal || isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            {isUploadingLocal || isAdding ? 'ARCHIVING...' : 'IMPORT TO VAULT'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function PdfUploadManagerSingle({
  value,
  onChange,
  label = 'DOCUMENT SELECTION',
}: {
  value: string;
  onChange: (val: string) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between px-1">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-2">
          <FileSearch className="w-3.5 h-3.5" />
          {label}
        </h4>
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
                className="h-7 px-3 text-rose-400 hover:text-rose-300 border border-rose-500/30 hover:border-rose-500 font-black uppercase tracking-widest text-[9px] bg-rose-500/5 hover:bg-rose-500/10 rounded-lg"
              >
                <X className="w-3.5 h-3.5 mr-2" /> DISCARD
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="group relative w-full aspect-[21/9] md:aspect-[32/9] rounded-2xl backdrop-blur-3xl transition-all duration-700 cursor-pointer overflow-hidden flex flex-col items-center justify-center border border-white/5 hover:border-indigo-500/30 bg-white/[0.02]">
            {value ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <FileText className="w-6 h-6 text-indigo-400" />
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/50">Node Synchronized</p>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                  <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-widest text-white scale-90 group-hover:scale-100 transition-transform">
                    <RefreshCcw className="w-4 h-4 animate-spin-slow" /> UPDATE DATA
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <FileText className="w-10 h-10 text-white/10 group-hover:text-indigo-400 transition-all duration-500" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-white/40 transition-colors">
                  Awaiting Data Fragment
                </p>
              </div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="bg-transparent border-none p-0 shadow-none overflow-hidden max-w-5xl w-[95vw] text-white mt-4">
          <InternalPdfVault
            selectedPdf={value}
            onPdfSelect={url => {
              onChange(url);
              setIsOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
