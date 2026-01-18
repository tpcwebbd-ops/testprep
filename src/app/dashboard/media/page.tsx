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
  PlayCircle,
  Search,
} from 'lucide-react';
import { IoReloadCircleOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import Image from 'next/image';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

import { useGetMediasQuery, useAddMediaMutation, useUpdateMediaMutation, useDeleteMediaMutation } from '@/redux/features/media/mediaSlice';

import imageCompression from 'browser-image-compression';
import { UploadButton } from '@/lib/uploadthing';
import { CustomLink } from '@/components/dashboard-ui/LinkButton';

type MediaType = 'all' | 'video' | 'image' | 'pdf' | 'docx' | 'audio';
type MediaStatus = 'active' | 'trash';

interface MediaItem {
  _id: string;
  url: string;
  display_url?: string;
  name?: string;
  contentType: MediaType;
  status: MediaStatus;
  createdAt: string;
  updatedAt: string;
}

export default function MediaDashboard() {
  const [activeTab, setActiveTab] = useState<MediaType>('all');
  const [activeStatus, setActiveStatus] = useState<MediaStatus>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    limit: itemsPerPage,
    q: debouncedSearch,
    contentType: activeTab,
    status: activeStatus,
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [uploadingType, setUploadingType] = useState<MediaType | null>(null);

  const [newMedia, setNewMedia] = useState({
    url: '',
    name: '',
    contentType: 'image' as MediaType,
    status: 'active' as MediaStatus,
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [addMedia, { isLoading: isAdding }] = useAddMediaMutation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [updateMedia, { isLoading: isUpdating }] = useUpdateMediaMutation();
  const [deleteMedia] = useDeleteMediaMutation();

  const items = useMemo(() => response?.data || [], [response]);
  const totalItems = response?.total || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  console.log('response', response);
  console.log('items', items);
  const handlePageChange = (p: number) => {
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddMedia = async () => {
    if (!newMedia.url) return toast.error('URL is required');
    try {
      await addMedia(newMedia).unwrap();
      toast.success('Media added successfully');
      setIsAddDialogOpen(false);
      setNewMedia({ url: '', name: '', contentType: 'image', status: 'active' });
    } catch {
      toast.error('Failed to add media');
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const openEditDialog = (item: MediaItem) => {
    setEditingMedia(item);
    setIsEditDialogOpen(true);
  };

  const openPreviewDialog = (item: MediaItem) => {
    setPreviewMedia(item);
    setIsPreviewDialogOpen(true);
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUpdateMedia = async () => {
    if (!editingMedia || !editingMedia.url) return toast.error('URL is required');
    try {
      await updateMedia({
        id: editingMedia._id,
        url: editingMedia.url,
        name: editingMedia.name,
        contentType: editingMedia.contentType,
        status: editingMedia.status,
      }).unwrap();
      toast.success('Media updated successfully');
      setIsEditDialogOpen(false);
      setEditingMedia(null);
    } catch {
      toast.error('Failed to update media');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: MediaStatus) => {
    try {
      await updateMedia({ id, status: newStatus }).unwrap();
      toast.success(`Moved to ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDelete = async (id: string) => {
    try {
      await deleteMedia({ id }).unwrap();
      toast.success('Permanently deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingType('image');
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
        toast.success('Image uploaded successfully!');
        setIsAddDialogOpen(false);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Cannot upload the image.');
    } finally {
      e.target.value = '';
      setUploadingType(null);
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCompleteUpload = (res: any, type: MediaType) => {
    if (res && res[0]) {
      addMedia({ url: res[0].url, name: res[0].name || 'unnamed_asset', contentType: type, status: 'active' }).unwrap();
      setUploadingType(null);
      setIsAddDialogOpen(false);
      toast.success(`${type.toUpperCase()} asset registered`);
    }
  };

  return (
    <div className="min-h-screen rounded-md bg-clip-padding backdrop-filter backdrop-blur-[120px] bg-opacity-30 border border-gray-100/50 p-4 md:p-8 text-white relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto relative z-10 space-y-8">
        <header className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="w-full flex flex-col gap-1">
              <h1 className="flex items-end justify-start gap-4">
                <span className="text-5xl font-black uppercase tracking-tighter italic bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                  Vault
                </span>
                <small className="text-xs text-slate-400 font-mono">[{totalItems} Records Found]</small>
              </h1>
            </motion.div>

            <div className="w-full flex flex-wrap gap-3 items-center justify-end">
              <CustomLink href="/dashboard/media/example" variant="outlineGlassy" size="sm">
                Live View
              </CustomLink>
              <Button size="sm" variant="outlineWater" onClick={() => refetch()} disabled={isLoading || isFetching}>
                <IoReloadCircleOutline className={`w-5 h-5 mr-2 ${isFetching ? 'animate-spin' : ''}`} /> Sync
              </Button>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outlineGarden">
                    <Plus className="w-5 h-5 mr-2" /> Import
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] bg-slate-950/90 backdrop-blur-2xl border border-white/10 text-white rounded-3xl">
                  <DialogHeader>
                    <DialogTitle className="uppercase italic tracking-widest">New Asset Protocol</DialogTitle>
                    <DialogDescription className="text-white/40">Select a data type to initiate upload.</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <label className="col-span-2 p-8 border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center gap-4 hover:bg-white/5 cursor-pointer transition-all">
                      <ImageIcon className="w-8 h-8 opacity-40" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Direct Image Upload</span>
                      <input type="file" className="hidden" onChange={handleImageUpload} />
                    </label>
                    {['video', 'audio', 'pdf', 'docx'].map(type => (
                      <div key={type} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center gap-2 group">
                        <UploadButton
                          endpoint={
                            type === 'docx' ? 'documentUploader' : type === 'pdf' ? 'pdfUploader' : type === 'video' ? 'videoUploader' : 'audioUploader'
                          }
                          onClientUploadComplete={res => handleCompleteUpload(res, type as MediaType)}
                          appearance={{ button: 'bg-indigo-600/20 hover:bg-indigo-600/40 text-[10px] font-bold uppercase w-full h-8' }}
                        />
                        <span className="text-[8px] font-bold uppercase opacity-40">{type}</span>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-white/5 p-4 rounded-3xl border border-white/10">
          <Tabs
            value={activeTab}
            onValueChange={v => {
              setActiveTab(v as MediaType);
              setCurrentPage(1);
            }}
            className="w-full lg:w-auto"
          >
            <TabsList className="bg-black/20 p-1 h-12 gap-1 rounded-2xl border border-white/5">
              {[
                { id: 'all', icon: LayoutGrid, label: 'All' },
                { id: 'image', icon: ImageIcon, label: 'Images' },
                { id: 'video', icon: Video, label: 'Videos' },
                { id: 'audio', icon: Headphones, label: 'Audio' },
                { id: 'pdf', icon: FileText, label: 'PDF' },
                { id: 'docx', icon: FileCode, label: 'Docs' },
              ].map(t => (
                <TabsTrigger
                  key={t.id}
                  value={t.id}
                  className="rounded-xl px-4 data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-white/40 transition-all"
                >
                  <t.icon className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">{t.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
              <Input
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Filter by filename..."
                className="bg-black/20 border-white/10 pl-12 h-12 rounded-2xl"
              />
            </div>
            <div className="flex bg-black/20 p-1 rounded-2xl border border-white/5">
              {['active', 'trash'].map(s => (
                <Button
                  key={s}
                  variant="ghost"
                  onClick={() => {
                    setActiveStatus(s as MediaStatus);
                    setCurrentPage(1);
                  }}
                  className={`h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeStatus === s ? 'bg-white/10 text-white' : 'text-white/20'}`}
                >
                  {s === 'active' ? <HardDrive className="w-3 h-3 mr-2" /> : <Trash2 className="w-3 h-3 mr-2" />}
                  {s}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <main className="min-h-[500px] relative">
          <AnimatePresence mode="wait">
            {isFetching ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4"
              >
                <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Accessing Data...</p>
              </motion.div>
            ) : items.length > 0 ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              >
                {items.map((item: MediaItem) => (
                  <motion.div
                    key={item._id}
                    layout
                    className="group relative aspect-square bg-slate-900/50 rounded-3xl overflow-hidden border border-white/5 hover:border-indigo-500/50 transition-all duration-500 shadow-2xl"
                  >
                    {item.contentType === 'image' && (
                      <Image
                        src={item.url}
                        alt={item.name || ''}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        unoptimized
                      />
                    )}
                    {item.contentType === 'video' && (
                      <div className="w-full h-full flex items-center justify-center bg-black/40">
                        <PlayCircle className="w-12 h-12 text-white/20 group-hover:text-indigo-400 transition-colors" />
                        <video
                          src={item.url}
                          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity"
                          muted
                          loop
                          onMouseOver={e => e.currentTarget.play()}
                          onMouseOut={e => {
                            e.currentTarget.pause();
                            e.currentTarget.currentTime = 0;
                          }}
                        />
                      </div>
                    )}
                    {item.contentType === 'audio' && (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-linear-to-br from-indigo-500/10 to-purple-500/10">
                        <Volume2 className="w-10 h-10 text-indigo-400" />
                        <div className="flex gap-1 h-4">
                          {[1, 2, 3, 4].map(i => (
                            <motion.div
                              key={i}
                              animate={{ height: [4, 16, 8, 16, 4] }}
                              transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                              className="w-1 bg-indigo-500/40 rounded-full"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {(item.contentType === 'pdf' || item.contentType === 'docx') && (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                        <div className={`p-4 rounded-2xl ${item.contentType === 'pdf' ? 'bg-red-500/10' : 'bg-blue-500/10'}`}>
                          {item.contentType === 'pdf' ? <FileText className="w-10 h-10 text-red-500" /> : <FileCode className="w-10 h-10 text-blue-500" />}
                        </div>
                        <span className="text-[10px] font-black opacity-40 uppercase">{item.contentType}</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                      <p className="text-[10px] font-black uppercase tracking-widest truncate mb-4">{item.name || 'Unnamed'}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outlineWater" className="flex-1 h-10 rounded-xl" onClick={() => openPreviewDialog(item)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        {activeStatus === 'active' ? (
                          <Button size="sm" variant="outlineFire" className="flex-1 h-10 rounded-xl" onClick={() => handleUpdateStatus(item._id, 'trash')}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button size="sm" variant="outlineGarden" className="flex-1 h-10 rounded-xl" onClick={() => handleUpdateStatus(item._id, 'active')}>
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-40 gap-6 opacity-20">
                <Ghost className="w-24 h-24" />
                <p className="text-sm font-black uppercase tracking-[0.5em]">Sector Empty</p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 py-12">
            <Button variant="outlineGlassy" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className="h-12 w-12 rounded-2xl">
              ←
            </Button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-12 h-12 rounded-2xl font-black text-[10px] transition-all border ${currentPage === i + 1 ? 'bg-indigo-600 border-indigo-400' : 'bg-white/5 border-white/10 text-white/40'}`}
                >
                  {(i + 1).toString().padStart(2, '0')}
                </button>
              ))}
            </div>
            <Button
              variant="outlineGlassy"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="h-12 w-12 rounded-2xl"
            >
              →
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[800px] bg-slate-950/95 border-white/10 rounded-3xl p-0 overflow-hidden">
          <DialogTitle className="hidden"></DialogTitle>
          <div className="aspect-video relative bg-black flex items-center justify-center">
            {previewMedia?.contentType === 'image' && <Image src={previewMedia.url} alt="" fill className="object-contain" unoptimized />}
            {previewMedia?.contentType === 'video' && <video src={previewMedia.url} controls autoPlay className="w-full h-full" />}
            {previewMedia?.contentType === 'audio' && <audio src={previewMedia.url} controls autoPlay className="w-2/3" />}
            {previewMedia?.contentType === 'pdf' && <iframe src={previewMedia.url} className="w-full h-full" />}
            {previewMedia?.contentType === 'docx' && (
              <div className="text-center">
                <FileCode className="w-20 h-20 mx-auto mb-4 opacity-20" />
                <Button asChild variant="outlineGlassy">
                  <a href={previewMedia.url} download>
                    Download Document
                  </a>
                </Button>
              </div>
            )}
          </div>
          <div className="p-6 flex items-center justify-between">
            <div>
              <h3 className="font-black uppercase tracking-widest text-sm">{previewMedia?.name}</h3>
              <p className="text-[10px] text-white/40 font-mono mt-1">{previewMedia?.url}</p>
            </div>
            <Button onClick={() => setIsPreviewDialogOpen(false)} variant="outlineGlassy" className="rounded-xl h-10 px-6 uppercase text-[10px] font-black">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
