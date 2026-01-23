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
  ArchiveRestore,
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
import { CustomLink } from '@/components/common/LinkButton';
import Link from 'next/link';

type MediaType = 'all' | 'video' | 'image' | 'pdf' | 'docx' | 'audio';
type MediaStatus = 'active' | 'trash';

interface MediaItem {
  _id: string;
  url: string;
  name?: string;
  contentType: MediaType;
  status: MediaStatus;
  uploaderPlace: string;
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
      toast.success('Deleted successfully');
    } catch {
      toast.error('System failure: Delete aborted');
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
        await addMedia({ url: data.data.url, name: file.name, contentType: 'image', status: 'active', uploaderPlace: 'imageBB' }).unwrap();
        toast.update(toastId, { render: 'Asset integrated', type: 'success', isLoading: false, autoClose: 2000 });
        setIsAddDialogOpen(false);
      }
    } catch {
      toast.update(toastId, { render: 'Uplink failed', type: 'error', isLoading: false, autoClose: 2000 });
    }
  };

  return (
    <main className="min-h-screen p-2 bg-transparent text-white font-sans selection:bg-blue-500/30">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-6">
        {/* HEADER SECTION */}
        <header className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-sm p-4 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:bg-white/15">
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
            <CustomLink href="/dashboard/media/example/uploadthings" variant="outlineGlassy" size="sm">
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

        {/* FILTER BAR SECTION */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-sm p-3 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-4">
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
                  className="h-8 px-3 rounded-md flex items-center gap-1.5 text-white opacity-40 transition-all duration-300 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/30 backdrop-blur-xl shadow-lg shadow-blue-500/20 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-white/50 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] hover:opacity-100 has-[svg]:px-2.5 data-[state=active]:opacity-100"
                >
                  <tab.icon size={14} className="mr-2 hidden md:block" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-72 group border border-white/50 rounded-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-50 group-focus-within:text-white transition-colors" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-white/5 border-white/10 pl-10 h-8 rounded-lg focus:ring-white/20 text-sm placeholder:text-gray-50 text-white transition-all"
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
                  className={`transition-all duration-300 border-white/20 ${activeStatus === s ? 'bg-white/20 opacity-100 shadow-lg' : 'opacity-40 hover:opacity-100'}`}
                >
                  {s === 'active' ? <HardDrive size={14} className="mr-2" /> : <Trash2 size={14} className="mr-2" />}
                  {s === 'active' ? 'Active' : 'Trash'}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* ASSET GRID SECTION */}
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
                  <div className="absolute inset-0 border-4 border-white/10 border-t-white rounded-full animate-spin" />
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
                    className="group relative backdrop-blur-xl bg-white/10 rounded-sm overflow-hidden border border-white/20 shadow-lg hover:shadow-2xl hover:bg-white/20 transition-all duration-500 flex flex-col h-full"
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
                        <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-white/5">
                          <Volume2 size={48} className="text-white/20 animate-pulse" />
                        </div>
                      )}
                      {(item.contentType === 'pdf' || item.contentType === 'docx') && (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-white/5">
                          <FileText size={48} className="text-white/20" />
                        </div>
                      )}

                      {processingId === item._id && (
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-2">
                          <Loader2 className="w-8 h-8 text-white animate-spin" />
                          <span className="text-[8px] font-mono text-white uppercase tracking-tighter">Syncing...</span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center p-4 z-20">
                        <div className="flex gap-1 w-full">
                          <Button
                            size="sm"
                            variant="outlineGlassy"
                            className="min-w-1"
                            onClick={() => {
                              setPreviewMedia(item);
                              setIsPreviewDialogOpen(true);
                            }}
                          >
                            <Eye size={14} className="mr-1" />
                            Preview
                          </Button>
                          {activeStatus === 'active' ? (
                            <Button
                              size="sm"
                              disabled={!!processingId}
                              title="Preview"
                              variant="outlineFire"
                              className="min-w-1"
                              onClick={() => handleUpdateStatus(item._id, 'trash')}
                            >
                              <Trash2 size={16} />
                            </Button>
                          ) : (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                className="min-w-1"
                                variant="outlineGarden"
                                title="Restore"
                                disabled={!!processingId}
                                onClick={() => handleUpdateStatus(item._id, 'active')}
                              >
                                <ArchiveRestore size={16} />
                              </Button>
                              <Button
                                size="sm"
                                title="Delete"
                                variant="outlineFire"
                                className="min-w-1"
                                disabled={!!processingId}
                                onClick={() => initiateDelete(item)}
                              >
                                <X size={16} />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 flex-1 space-y-3 border-t border-white/5 bg-white/[0.02]">
                      <div className="flex items-start gap-4">
                        <div className="p-2.5 rounded-sm bg-white/5 border border-white/10 flex-shrink-0">
                          <Cloud size={18} className="text-white/50" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm text-white/90 truncate group-hover:text-white transition-colors tracking-tight">
                            {item.name || 'Name Unavailable'}
                          </p>
                          <p className="text-[10px] text-gray-200/60 flex items-center gap-1 font-mono uppercase">
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
                <div className="max-w-md w-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-sm p-16 shadow-2xl flex flex-col items-center text-center gap-8 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full" />
                    <div className="relative p-8 bg-white/5 rounded-full border border-white/20">
                      <Ghost className="w-20 h-20 text-white/20" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">No data found</h3>
                    <p className="text-xs text-gray-200/40 font-mono leading-relaxed">System scan complete: No records match the current filter parameters.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <nav className="flex items-center justify-center gap-4 py-16">
            <Button
              variant="outlineGlassy"
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage(prev => Math.max(1, prev - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="h-12 px-6 rounded-sm bg-white/5 border-white/10 text-white"
            >
              <ChevronLeft size={20} className="mr-2" />
              Prev
            </Button>

            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-sm p-1.5 backdrop-blur-md">
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
                    className={`min-w-[48px] h-10 rounded-sm text-xs font-black transition-all duration-500 ${
                      isCurrent ? 'bg-white/20 text-white shadow-lg border border-white/40' : 'text-gray-500 hover:bg-white/10 hover:text-white'
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
              className="h-12 px-6 rounded-sm bg-white/5 border-white/10 text-white"
            >
              Next
              <ChevronRight size={20} className="ml-2" />
            </Button>
          </nav>
        )}
      </motion.div>

      {/* 1. ADD ASSET DIALOG */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="backdrop-blur-xl mt-8 bg-white/10 border border-white/20 shadow-2xl   max-w-xl p-0 overflow-hidden text-white">
          <DialogHeader className="p-4 pb-0 pl-6">
            <DialogTitle className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-white/80 to-white/30 bg-clip-text text-transparent italic tracking-tighter">
              Upload a new assect
            </DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>
          </DialogHeader>
          <div className="p-8 space-y-6 -mt-8">
            <div className="grid grid-cols-2 gap-4">
              <label className="p-2 border-2 border-dashed border-white/50 rounded-sm hover:border-white/80 hover:bg-white/5 cursor-pointer transition-all duration-500">
                <div className="flex flex-col items-center justify-center gap-1">
                  <ImageIcon className="w-12 h-12 text-white/80" />
                  <div className="text-center flex flex-col">
                    <p className="text-sm text-white">Image</p>
                    <small className="text-[8px] text-slate-50/50">Image BB</small>
                  </div>
                </div>
                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
              </label>
              <div className="p-4 bg-white/5 border border-white/10 rounded-sm hover:bg-white/10 transition-all group relative overflow-hidden">
                <UploadButton
                  endpoint={'imageUploader'}
                  onClientUploadComplete={res => {
                    if (res?.[0]) {
                      addMedia({ url: res[0].url, name: res[0].name, contentType: 'image' as MediaType, status: 'active' }).unwrap();
                      setIsAddDialogOpen(false);
                      toast.success(`Image Successfully Uploaded`);
                    }
                  }}
                  appearance={{
                    button:
                      'w-full bg-white/10 hover:bg-white/20 text-[10px] font-black uppercase tracking-widest h-12 border border-white/20 rounded-sm transition-all text-white',
                    allowedContent: 'hidden',
                  }}
                />
                <div className="mt-3 text-center flex flex-col">
                  <span className="text-[9px] font-mono text-gray-200/40= group-hover:text-white transition-colors">Image</span>
                  <small className="text-[8px] text-slate-50/50">Upload Things</small>
                </div>
              </div>
              {['video', 'audio', 'pdf', 'docx'].map(type => (
                <div key={type} className="p-4 bg-white/5 border border-white/10 rounded-sm hover:bg-white/10 transition-all group relative overflow-hidden">
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
                        'w-full bg-white/10 hover:bg-white/20 text-[10px] font-black uppercase tracking-widest h-12 border border-white/20 rounded-sm transition-all text-white',
                      allowedContent: 'hidden',
                    }}
                  />
                  <div className="mt-3 text-center">
                    <span className="text-[9px] font-mono text-gray-200/40 group-hover:text-white transition-colors">{type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 2. DELETE DIALOG */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="backdrop-blur-xl mt-8 bg-white/10 border border-white/20 shadow-2xl   max-w-md p-0 overflow-hidden text-white">
          <div className="p-10 flex flex-col items-center text-center gap-6">
            <div className="w-20 h-20 rounded-sm bg-rose-200 border border-white/20 flex items-center justify-center text-rose-500 animate-pulse">
              <AlertTriangle size={40} />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-rose-500 via-rose-300 to-rose-600 bg-clip-text text-transparent">
                Confirmation Delete?
              </DialogTitle>
              <span className="block text-sm">This procedure is irreversible.</span>
              <DialogDescription className="text-gray-200/50 text-xs font-mono uppercase leading-relaxed tracking-wider">
                <span className="text-white font-bold">
                  &quot;{mediaToDelete?.name?.length && mediaToDelete?.name?.length > 50 ? mediaToDelete?.name?.slice(50) : mediaToDelete?.name}&quot;
                </span>
                ?
              </DialogDescription>
            </div>
          </div>
          <DialogFooter className="p-2  bg-white/5 border-t border-white/10 flex flex-row gap-3 items-center justify-end">
            <Button onClick={() => setIsDeleteDialogOpen(false)} size="sm" variant="outlineGlassy">
              Abort
            </Button>
            <Button onClick={handleConfirmDelete} size="sm" variant="outlineFire">
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. ASSET PREVIEW DIALOG */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[1000px] mt-8 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl p-0 overflow-hidden text-white h-[80vh]">
          <DialogTitle className="sr-only">Object Stream Viewer</DialogTitle>

          <div className="relative bg-white/5 flex items-center justify-center">
            <ScrollArea className="w-full h-[60vh]">
              <div className="flex items-center justify-center min-h-[400px] w-full p-6 relative">
                {previewMedia?.contentType === 'image' && (
                  <Image src={previewMedia.url} alt={previewMedia.name || 'Images'} fill className="object-contain p-4" unoptimized />
                )}
                {previewMedia?.contentType === 'video' && (
                  <video src={previewMedia.url} controls autoPlay className="w-full h-full max-h-[75vh] rounded-sm shadow-2xl border border-white/10" />
                )}
                {previewMedia?.contentType === 'audio' && (
                  <div className="flex flex-col items-center gap-10 w-full py-24">
                    <Volume2 size={80} className="text-white/20 animate-bounce" />
                    <audio src={previewMedia.url} controls autoPlay className="w-full max-w-lg h-12 invert opacity-80" />
                  </div>
                )}
                {(previewMedia?.contentType === 'pdf' || previewMedia?.contentType === 'docx') && (
                  <iframe src={previewMedia.url} className="w-full h-[75vh] rounded-sm border border-white/10 bg-white/5 backdrop-blur-sm" />
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="p-8 py-0 bg-white/5 backdrop-blur-2xl border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="min-w-0 flex-1 space-y-1">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-white/80 to-white/30 bg-clip-text text-transparent italic tracking-tighter uppercase">
                {previewMedia?.name || 'ASSET_SIGNATURE_UNKNOWN'}
              </h3>
              <p className="text-[10px] text-gray-200/40 font-mono truncate max-w-[400px]">URI: {previewMedia?.url}</p>
            </div>

            <div className="flex gap-4">
              <Button asChild variant="glassyInfo">
                <Link
                  href={previewMedia?.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                >
                  <ExternalLink size={14} /> Open
                </Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
