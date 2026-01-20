'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid,
  Video,
  ImageIcon,
  FileText,
  FileCode,
  Trash2,
  CheckCircle,
  Plus,
  HardDrive,
  Ghost,
  Headphones,
  Volume2,
  Eye,
  Search,
  X,
  RefreshCw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Play,
  Calendar,
  Cloud,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'react-toastify';
import Image from 'next/image';

import { Tabs, TabsList, TabsTrigger } from './components/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useGetMediasQuery, useAddMediaMutation, useUpdateMediaMutation, useDeleteMediaMutation } from '@/redux/features/media/mediaSlice';

import imageCompression from 'browser-image-compression';
import { UploadButton } from '@/lib/uploadthing';
import { CustomLink } from '@/components/dashboard-ui/LinkButton';

type MediaType = 'all' | 'video' | 'image' | 'pdf' | 'docx' | 'audio';
type MediaStatus = 'active' | 'trash';

interface MediaItem {
  _id: string;
  url: string;
  name?: string;
  contentType: MediaType;
  status: MediaStatus;
  createdAt: string;
}

export default function MediaDashboard() {
  const [activeTab, setActiveTab] = useState<MediaType>('all');
  const [activeStatus, setActiveStatus] = useState<MediaStatus>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
  const [mediaToDelete, setMediaToDelete] = useState<MediaItem | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetMediasQuery({
    page: currentPage,
    limit: 10,
    q: debouncedSearch,
    contentType: activeTab,
    status: activeStatus,
  });

  const [addMedia] = useAddMediaMutation();
  const [updateMedia] = useUpdateMediaMutation();
  const [deleteMedia] = useDeleteMediaMutation();

  const items = useMemo(() => response?.data || [], [response]);
  const totalItems = response?.total || 0;
  const totalPages = Math.ceil(totalItems / 10);

  const handleUpdateStatus = async (id: string, newStatus: MediaStatus) => {
    setProcessingId(id);
    try {
      await updateMedia({ id, status: newStatus }).unwrap();
      toast.success(`Asset successfully ${newStatus === 'trash' ? 'trashed' : 'restored'}`);
    } catch {
      toast.error('Pessimistic update failure: System sync interrupted');
    } finally {
      setProcessingId(null);
    }
  };

  const initiateDelete = (item: MediaItem) => {
    setMediaToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!mediaToDelete) return;
    const id = mediaToDelete._id;
    setProcessingId(id);
    setIsDeleteDialogOpen(false);
    try {
      await deleteMedia({ id }).unwrap();
      toast.success('Asset purged successfully');
    } catch {
      toast.error('System failure: Purge aborted');
    } finally {
      setProcessingId(null);
      setMediaToDelete(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const toastId = toast.loading('Encrypting and uploading...');
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
        await addMedia({ url: data.data.url, name: file.name, contentType: 'image', status: 'active' }).unwrap();
        toast.update(toastId, { render: 'Asset integrated', type: 'success', isLoading: false, autoClose: 2000 });
        setIsAddDialogOpen(false);
      }
    } catch {
      toast.update(toastId, { render: 'Uplink failed', type: 'error', isLoading: false, autoClose: 2000 });
    }
  };

  return (
    <main className="min-h-screen p-2 bg-transparent blur-4xl text-white font-sans selection:bg-blue-500/30">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-6">
        <header className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:bg-white/15">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-white/80 to-white/30 bg-clip-text text-transparent italic tracking-tighter">
              Media
            </h1>
            <p className="text-xs text-gray-200/50 flex items-center gap-2 font-mono">
              <Cloud size={14} className="text-blue-400 animate-pulse" />
              Total: {totalItems} assets
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <CustomLink href="/dashboard/media/example" variant="outlineGlassy" size="sm">
              <LayoutGrid size={16} className="mr-2" />
              Example
            </CustomLink>
            <Button size="sm" variant="outlineWater" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw size={16} className={`mr-2 ${isFetching ? 'animate-spin' : ''}`} />
              {isFetching ? 'Syncing...' : 'Refresh'}
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)} variant="outlineGlassy" size="sm">
              <Plus size={18} className="" />
              Add
            </Button>
          </div>
        </header>

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-3 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-4">
          <Tabs
            value={activeTab}
            onValueChange={v => {
              setActiveTab(v as MediaType);
              setCurrentPage(1);
            }}
            className="w-full lg:w-auto"
          >
            <TabsList className="bg-transparent h-12 p-1 rounded-lg gap-1">
              {[
                { id: 'all', label: 'All', icon: LayoutGrid },
                { id: 'image', label: 'Images', icon: ImageIcon },
                { id: 'video', label: 'Videos', icon: Video },
                { id: 'audio', label: 'Audio', icon: Headphones },
                { id: 'pdf', label: 'PDF', icon: FileText },
                { id: 'docx', label: 'Docs', icon: FileCode },
              ].map(tab => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="h-8 px-3 rounded-md flex items-center gap-1.5 text-white opacity-40 transition-all duration-300 bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-white/30 backdrop-blur-xl shadow-lg shadow-blue-500/20 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-white/50 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] hover:opacity-100 has-[>svg]:px-2.5 data-[state=active]:opacity-100"
                >
                  <tab.icon size={14} className="mr-2 hidden md:block" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-72 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-white/5 border-white/10 pl-10 h-8 rounded-lg focus:ring-blue-500/20 text-sm placeholder:text-gray-600 transition-all"
                placeholder="Search file signatures..."
              />
            </div>
            <div className="flex p-1 rounded-lg gap-2 w-full sm:w-auto">
              {['active', 'trash'].map(s => (
                <Button
                  key={s}
                  variant="outlineGlassy"
                  size="sm"
                  onClick={() => setActiveStatus(s as MediaStatus)}
                  className={` hover:from-blue-500/30 hover:to-purple-500/30 hover:border-white/50 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] hover:opacity-100 opacity-40 ${activeStatus === s ? 'opacity-100' : 'opacity-40'}`}
                >
                  {s === 'active' ? <HardDrive size={14} className="mr-2" /> : <Trash2 size={14} className="mr-2" />}
                  {s}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <section className="min-h-[60vh] relative">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-6 py-40"
              >
                <div className="relative h-20 w-20">
                  <div className="absolute inset-0 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                  <div className="absolute inset-2 border-4 border-purple-500/10 border-b-purple-500 rounded-full animate-spin-reverse" />
                </div>
                <p className="text-xs font-mono text-gray-400 animate-pulse tracking-[0.5em] uppercase">Loading_Array_Data</p>
              </motion.div>
            ) : items.length > 0 ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
              >
                {items.map((item: MediaItem, idx: number) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group relative backdrop-blur-xl bg-white/10 rounded-2xl overflow-hidden border border-white/20 shadow-lg hover:shadow-2xl hover:bg-white/20 transition-all duration-500 flex flex-col h-full"
                  >
                    <div className="relative aspect-video bg-black/40 overflow-hidden">
                      {item.contentType === 'image' && (
                        <Image
                          src={item.url}
                          alt={item.name || 'asset'}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80"
                          unoptimized
                        />
                      )}
                      {item.contentType === 'video' && (
                        <div className="w-full h-full relative">
                          <video src={item.url} className="w-full h-full object-cover opacity-60" preload="metadata" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
                            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-2xl">
                              <Play size={20} className="text-white fill-white ml-1" />
                            </div>
                          </div>
                        </div>
                      )}
                      {item.contentType === 'audio' && (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                          <Volume2 size={48} className="text-blue-400/40 animate-pulse" />
                        </div>
                      )}
                      {(item.contentType === 'pdf' || item.contentType === 'docx') && (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-red-500/10 to-orange-500/10">
                          {item.contentType === 'pdf' ? (
                            <FileText size={48} className="text-red-400/40" />
                          ) : (
                            <FileCode size={48} className="text-orange-400/40" />
                          )}
                        </div>
                      )}

                      {processingId === item._id && (
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-2">
                          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                          <span className="text-[8px] font-mono text-blue-400 uppercase tracking-tighter">Syncing...</span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center p-4 z-20">
                        <div className="flex gap-1 w-full">
                          <Button
                            size="sm"
                            variant="outlineGlassy"
                            className="min-w-1"
                            // className="flex-1 h-10 bg-white/10 border-white/20 hover:bg-blue-500/20"
                            onClick={() => {
                              setPreviewMedia(item);
                              setIsPreviewDialogOpen(true);
                            }}
                          >
                            <Eye size={14} className="" />
                            Preview
                          </Button>
                          {activeStatus === 'active' ? (
                            <Button
                              size="sm"
                              variant="outlineFire"
                              // className="w-10 h-10 p-0 flex-shrink-0"
                              className="min-w-1"
                              disabled={!!processingId}
                              onClick={() => handleUpdateStatus(item._id, 'trash')}
                            >
                              <Trash2 size={16} />
                            </Button>
                          ) : (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outlineGarden"
                                className="w-10 h-10 p-0"
                                disabled={!!processingId}
                                onClick={() => handleUpdateStatus(item._id, 'active')}
                              >
                                <CheckCircle size={16} />
                              </Button>
                              <Button size="sm" variant="outlineFire" className="w-10 h-10 p-0" disabled={!!processingId} onClick={() => initiateDelete(item)}>
                                <X size={16} />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 flex-1 space-y-3 border-t border-white/5 bg-white/[0.02]">
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-2.5 rounded-xl bg-white/5 border border-white/10 flex-shrink-0 transition-transform group-hover:-rotate-6 group-hover:scale-110`}
                        >
                          {item.contentType === 'video' ? (
                            <Video size={18} className="text-purple-400" />
                          ) : item.contentType === 'image' ? (
                            <ImageIcon size={18} className="text-blue-400" />
                          ) : item.contentType === 'audio' ? (
                            <Headphones size={18} className="text-green-400" />
                          ) : (
                            <FileText size={18} className="text-orange-400" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm text-white/90 truncate group-hover:text-blue-400 transition-colors tracking-tight">
                            {item.name || 'UNNAMED_ASSET'}
                          </p>
                          <p className="text-[10px] text-gray-50/60 flex items-center gap-.5 font-mono justify-start">
                            <Calendar size={12} className="opacity-50" />
                            {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center py-32 px-4"
              >
                <div className="max-w-md w-full backdrop-blur-3xl bg-white/5 border border-white/10 rounded-[2.5rem] p-16 shadow-2xl flex flex-col items-center text-center gap-8 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full group-hover:bg-blue-500/40 transition-colors duration-1000" />
                    <div className="relative p-8 bg-white/5 rounded-full border border-white/20 transform group-hover:rotate-12 transition-transform duration-700">
                      <Ghost className="w-20 h-20 text-white/20" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-black text-white   ">No data found.</h3>
                    <p className="text-xs text-gray-50/80 font-mono leading-relaxed  opacity-60">Ops! Nothing was found! Please try again.</p>
                  </div>
                  <Button onClick={() => refetch()} variant="outlineGlassy" size="sm">
                    <RefreshCw size={16} className="mr-3 text-blue-400" />
                    Refetch
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {totalPages > 1 && (
          <nav className="flex items-center justify-center gap-4 py-16">
            <Button
              variant="outlineGlassy"
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage(prev => Math.max(1, prev - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="h-12 px-6 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 disabled:opacity-20"
            >
              <ChevronLeft size={20} className="mr-2" />
              Prev
            </Button>

            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-1.5 backdrop-blur-md">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const isCurrent = currentPage === pageNum;
                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      setCurrentPage(pageNum);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`min-w-[48px] h-10 rounded-xl text-xs font-black transition-all duration-500 ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-400'
                        : 'text-gray-500 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {pageNum.toString().padStart(2, '0')}
                  </button>
                );
              })}
            </div>

            <Button
              variant="outlineGlassy"
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage(prev => Math.min(totalPages, prev + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="h-12 px-6 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 disabled:opacity-20"
            >
              Next
              <ChevronRight size={20} className="ml-2" />
            </Button>
          </nav>
        )}
      </motion.div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="backdrop-blur-3xl bg-slate-950/80 border border-white/20 text-white shadow-2xl rounded-[2.5rem] max-w-xl p-0 overflow-hidden">
          <DialogHeader className="p-8 pb-0">
            <DialogTitle className="text-3xl font-black bg-gradient-to-r from-white to-white/30 bg-clip-text text-transparent italic tracking-tighter">
              New Ingestion Protocol
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-sm mt-2 font-mono uppercase tracking-widest opacity-60">
              Register source assets to secure cloud storage
            </DialogDescription>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <label className="group relative block p-16 border-2 border-dashed border-white/10 rounded-3xl hover:border-blue-500/50 hover:bg-blue-500/5 cursor-pointer transition-all duration-500">
              <div className="flex flex-col items-center justify-center gap-6">
                <div className="p-5 bg-blue-500/10 rounded-full group-hover:scale-125 group-hover:rotate-12 transition-all duration-700">
                  <ImageIcon className="w-12 h-12 text-blue-400" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-md font-black uppercase tracking-[0.2em] text-white">Direct Image Uplink</p>
                  <p className="text-[10px] text-gray-500 font-mono uppercase opacity-60">Supports JPG, PNG, WEBP via secured API</p>
                </div>
              </div>
              <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
            </label>

            <div className="grid grid-cols-2 gap-4">
              {['video', 'audio', 'pdf', 'docx'].map(type => (
                <div key={type} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
                    {type === 'video' && <Video size={40} />}
                    {type === 'audio' && <Headphones size={40} />}
                    {type === 'pdf' && <FileText size={40} />}
                    {type === 'docx' && <FileCode size={40} />}
                  </div>
                  <UploadButton
                    endpoint={type === 'docx' ? 'documentUploader' : type === 'pdf' ? 'pdfUploader' : type === 'video' ? 'videoUploader' : 'audioUploader'}
                    onClientUploadComplete={res => {
                      if (res?.[0]) {
                        addMedia({ url: res[0].url, name: res[0].name, contentType: type as MediaType, status: 'active' }).unwrap();
                        setIsAddDialogOpen(false);
                        toast.success(`Encrypted ${type.toUpperCase()} Synchronized`);
                      }
                    }}
                    appearance={{
                      button:
                        'w-full bg-blue-600/10 hover:bg-blue-600/30 text-[10px] font-black uppercase tracking-widest h-12 border border-blue-500/20 rounded-xl transition-all',
                      allowedContent: 'hidden',
                    }}
                  />
                  <div className="mt-3 text-center">
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-[0.3em] group-hover:text-blue-400 transition-colors">
                      {type} source
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="backdrop-blur-3xl bg-slate-950/90 border border-white/20 text-white shadow-2xl rounded-[2.5rem] max-w-md p-0 overflow-hidden">
          <div className="p-10 flex flex-col items-center text-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 animate-pulse">
              <AlertTriangle size={40} />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic">Purge Confirmation</DialogTitle>
              <DialogDescription className="text-gray-400 text-xs font-mono uppercase leading-relaxed tracking-wider">
                This procedure is irreversible. Do you wish to permanently purge <span className="text-red-400">&quot;{mediaToDelete?.name}&quot;</span> from
                the core directory?
              </DialogDescription>
            </div>
          </div>
          <DialogFooter className="p-8 bg-white/5 border-t border-white/10 flex flex-row gap-3 sm:justify-center">
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
              variant="outlineGlassy"
              className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-white/5 border-white/10"
            >
              Abort Mission
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="outlineFire"
              className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-red-500/20 border-red-500/50 hover:bg-red-500/40"
            >
              Confirm Purge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[1000px] bg-slate-950/80 backdrop-blur-2xl border mt-8 border-white/10 rounded-[2.5rem] p-0 overflow-hidden shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]">
          <DialogTitle className="sr-only">Object Stream Viewer</DialogTitle>

          {/* Main Preview Area */}
          <div className="aspect-video relative bg-gradient-to-b from-blue-500/5 to-purple-500/5 flex items-center justify-center">
            {/* Background Ambient Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-[20%] -left-[10%] w-72 h-72 bg-blue-500/10 blur-[120px] rounded-full" />
              <div className="absolute -bottom-[20%] -right-[10%] w-72 h-72 bg-purple-500/10 blur-[120px] rounded-full" />
            </div>

            <ScrollArea className="w-full h-full">
              <div className="flex items-center justify-center min-h-[600px] w-full p-6 relative">
                {previewMedia?.contentType === 'image' && (
                  <div className="relative w-full h-full flex items-center justify-center group">
                    <Image
                      src={previewMedia.url}
                      alt={previewMedia.name || 'Images'}
                      fill
                      className="object-contain p-4 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                      unoptimized
                    />
                  </div>
                )}

                {previewMedia?.contentType === 'video' && (
                  <video
                    src={previewMedia.url}
                    controls
                    autoPlay
                    className="w-full h-full max-h-[75vh] rounded-2xl shadow-2xl border border-white/10 bg-black/40"
                  />
                )}

                {previewMedia?.contentType === 'audio' && (
                  <div className="flex flex-col items-center gap-10 w-full py-24">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500/30 blur-3xl animate-pulse rounded-full" />
                      <div className="relative w-44 h-44 rounded-full bg-white/5 backdrop-blur-3xl flex items-center justify-center border border-white/20 shadow-[0_0_40px_rgba(59,130,246,0.2)]">
                        <Headphones size={80} className="text-blue-400/40 animate-bounce" />
                      </div>
                    </div>
                    <audio src={previewMedia.url} controls autoPlay className="w-full max-w-lg h-12 invert opacity-80" />
                  </div>
                )}

                {(previewMedia?.contentType === 'pdf' || previewMedia?.contentType === 'docx') && (
                  <iframe src={previewMedia.url} className="w-full h-[75vh] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm" />
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Footer Info Bar */}
          <div className="p-8 bg-white/[0.03] backdrop-blur-3xl border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="min-w-0 flex-1 space-y-2">
              <h3 className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 truncate uppercase tracking-widest italic leading-none">
                {previewMedia?.name || 'ASSET_SIGNATURE_UNKNOWN'}
              </h3>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-[9px] text-blue-400 font-bold uppercase tracking-tighter">
                  Verified Stream
                </span>
                <p className="text-[10px] text-white/30 font-mono truncate max-w-[300px]">{previewMedia?.url}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                asChild
                className="rounded-xl h-12 px-6 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white transition-all"
              >
                <a
                  href={previewMedia?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                >
                  <ExternalLink size={14} />
                  External Link
                </a>
              </Button>

              <Button
                onClick={() => setIsPreviewDialogOpen(false)}
                className="rounded-xl h-12 px-8 font-black uppercase text-[10px] tracking-widest bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/20 hover:scale-105 transition-all shadow-lg shadow-blue-500/10"
              >
                <X size={14} className="mr-2" />
                Terminate
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
