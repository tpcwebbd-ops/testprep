'use client';

import React, { useMemo, useState } from 'react';
import { Plus, X, Loader2, FileText, Ghost, Search, CheckCircle2, Zap, FileDown, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UploadButton } from '@/lib/uploadthing';

import { useGetMediasQuery, useAddMediaMutation } from '@/redux/features/media/mediaSlice';

interface InternalPdfVaultProps {
  onPdfToggle: (url: string) => void;
  selectedPdfs: string[];
}

const InternalPdfVault = ({ onPdfToggle, selectedPdfs }: InternalPdfVaultProps) => {
  const { data: response, isLoading: isFetching } = useGetMediasQuery({});
  const [addMedia, { isLoading: isAdding }] = useAddMediaMutation();
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const availablePdfs = useMemo(() => {
    if (!response?.data) return [];
    return (
      response.data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((item: any) => item.contentType === 'pdf' && item.status === 'active')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((item: any) => (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [response, searchQuery]);

  return (
    <div className="flex flex-col h-[85vh] md:h-[75vh] border border-slate-100/50 rounded-xl backdrop-blur-3xl bg-black/40">
      <DialogHeader className="p-8 border-b border-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="hidden">
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </div>

          <div className="flex flex-wrap items-center gap-4 justify-between w-full">
            <div className="relative group flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                placeholder="Search Document Library..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-indigo-500/50 transition-all"
              />
            </div>

            <div className="flex items-center gap-3">
              {(isUploadingLocal || isAdding) && (
                <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                  <Loader2 className="w-3 h-3 text-indigo-400 animate-spin" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Archiving</span>
                </div>
              )}
              <UploadButton
                endpoint="pdfUploader"
                appearance={{
                  button:
                    'flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500/20 transition-all shadow-[0_0_20px_rgba(99,102,241,0.1)] after:hidden before:hidden h-auto w-auto',
                  allowedContent: 'hidden',
                }}
                onUploadBegin={() => setIsUploadingLocal(true)}
                onClientUploadComplete={async res => {
                  if (res && res[0]) {
                    await addMedia({
                      url: res[0].url,
                      name: res[0].name,
                      contentType: 'pdf',
                      status: 'active',
                    }).unwrap();
                    setIsUploadingLocal(false);
                    onPdfToggle(res[0].url);
                    toast.success('Document synchronized');
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
      </DialogHeader>

      <ScrollArea className="flex-1 p-8">
        {isFetching ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
              <Layers className="absolute inset-0 m-auto w-6 h-6 text-indigo-500/40" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 animate-pulse">Retrieving Documents...</span>
          </div>
        ) : availablePdfs.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                availablePdfs.map((item: any, idx: number) => {
                  const isSelected = selectedPdfs.includes(item.url);
                  return (
                    <motion.div
                      key={item.url}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      onClick={() => onPdfToggle(item.url)}
                      className={`relative aspect-[3/4] rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-500 group flex flex-col items-center justify-center p-4
                      ${isSelected ? 'border-emerald-500/50 bg-emerald-500/5 scale-95 shadow-[0_0_30px_rgba(16,185,129,0.1)]' : 'border-white/5 bg-white/[0.02] hover:border-white/20 hover:scale-105'}
                    `}
                    >
                      <FileText
                        className={`w-10 h-10 transition-colors duration-500 ${isSelected ? 'text-emerald-400' : 'text-white/20 group-hover:text-white/40'}`}
                      />
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/70 text-center line-clamp-2 mt-4 px-2">
                        {item.name || 'UNLABELED_DOC'}
                      </span>
                      {isSelected && (
                        <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center backdrop-blur-[1px]">
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-emerald-500 text-white rounded-full p-1.5 shadow-2xl">
                            <CheckCircle2 className="w-4 h-4" />
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
              <h3 className="text-2xl font-black uppercase tracking-[0.4em]">Zero Results</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-2">The archive appears empty</p>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default function PdfUploadManager({
  value,
  onChange,
  label = 'Document Gallery',
}: {
  value: string[];
  onChange: (val: string[]) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const togglePdf = (url: string) => {
    if (value.includes(url)) {
      onChange(value.filter(item => item !== url));
    } else {
      onChange([...value, url]);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between px-1">
        <div className="space-y-1">
          <h4 className="text-sm text-white/40 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400/50" /> {label}
          </h4>
          <p className="text-[8px] font-bold uppercase tracking-widest text-white/10">{value.length} Items Locked</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outlineGlassy" size="sm">
              <Plus className="w-3.5 h-3.5" /> Select
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl bg-transparent border-none p-0 shadow-none">
            <InternalPdfVault selectedPdfs={value} onPdfToggle={togglePdf} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-6 rounded-[2.5rem] bg-slate-950/20 border border-white/5 backdrop-blur-3xl md:min-h-[30vh] transition-all">
        <AnimatePresence mode="popLayout">
          {value.map((url, idx) => (
            <motion.div
              key={url}
              layout
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="relative group"
            >
              <div className="relative aspect-video rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center justify-center backdrop-blur-xl shadow-2xl overflow-hidden group-hover:border-indigo-500/30 transition-all duration-700 p-6">
                <FileText className="w-8 h-8 text-indigo-400 mb-2 group-hover:scale-110 transition-transform duration-500" />
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest text-center truncate w-full px-4">SECURED_DOCUMENT</span>

                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all"
                  >
                    <FileDown className="w-5 h-5 text-white" />
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => onChange(value.filter(item => item !== url))}
                  className="absolute top-3 right-3 z-20 p-2 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <Zap className="absolute -top-1 -right-1 w-5 h-5 text-indigo-500/40 animate-pulse pointer-events-none z-10" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {value.length === 0 && (
          <div className="w-full flex-col min-w-full gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <div
                  key={i}
                  className="relative aspect-video rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl shadow-2xl transition-colors duration-500 group"
                >
                  <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[2rem]">
                    <motion.div
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
                    />
                  </div>
                  <motion.div
                    animate={{ y: [0, -5, 0], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex flex-col items-center gap-2"
                  >
                    <FileText className="w-8 h-8 text-white/20" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/10">Empty Slot</span>
                  </motion.div>
                  <Zap className="absolute -top-1 -right-1 w-5 h-5 text-indigo-500/40 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
