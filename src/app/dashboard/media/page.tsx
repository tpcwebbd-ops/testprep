'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  ImageIcon,
  FileText,
  FileCode,
  Trash2,
  CheckCircle,
  Plus,
  Loader2,
  AlertCircle,
  HardDrive,
  Ghost,
  XIcon,
  Edit2,
  Music,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { IoReloadCircleOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import Image from 'next/image';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useGetMediasQuery, useAddMediaMutation, useUpdateMediaMutation, useDeleteMediaMutation } from '@/redux/features/media/mediaSlice';

import imageCompression from 'browser-image-compression';
import { UploadButton } from '@/lib/uploadthing';

type MediaType = 'all' | 'video' | 'image' | 'pdf' | 'docx' | 'audio';
type MediaStatus = 'active' | 'trash';

interface MediaItem {
  _id: string;
  url: string;
  display_url?: string;
  contentType: MediaType;
  status: MediaStatus;
  createdAt: string;
  updatedAt: string;
}

export default function MediaDashboard() {
  const [activeTab, setActiveTab] = useState<MediaType>('all');
  const [activeStatus, setActiveStatus] = useState<MediaStatus>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);

  const [uploadingType, setUploadingType] = useState<MediaType | null>(null);

  const [newMedia, setNewMedia] = useState({
    url: '',
    contentType: 'image' as MediaType,
    status: 'active' as MediaStatus,
  });

  const { data: response, isLoading, isFetching, refetch } = useGetMediasQuery({});
  const [addMedia, { isLoading: isAdding }] = useAddMediaMutation();
  const [updateMedia, { isLoading: isUpdating }] = useUpdateMediaMutation();
  const [deleteMedia] = useDeleteMediaMutation();

  const items = useMemo<MediaItem[]>(() => response?.data || [], [response?.data]);

  const handleAddMedia = async () => {
    if (!newMedia.url) return toast.error('URL is required');
    try {
      await addMedia(newMedia).unwrap();
      toast.success('Media added successfully');
      setIsAddDialogOpen(false);
      setNewMedia({ url: '', contentType: 'image', status: 'active' });
    } catch {
      toast.error('Failed to add media');
    }
  };

  const openEditDialog = (item: MediaItem) => {
    setEditingMedia(item);
    setIsEditDialogOpen(true);
  };

  const handleUpdateMedia = async () => {
    if (!editingMedia || !editingMedia.url) return toast.error('URL is required');
    try {
      await updateMedia({
        id: editingMedia._id,
        url: editingMedia.url,
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

  const handleDelete = async (id: string) => {
    try {
      await deleteMedia(id).unwrap();
      toast.success('Permanently deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const filteredItems = useMemo<MediaItem[]>(() => {
    return items.filter((item: MediaItem) => {
      const matchType = activeTab === 'all' || item.contentType === activeTab;
      const matchStatus = item.status === activeStatus;
      const matchSearch = item.url.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchStatus && matchSearch;
    });
  }, [items, activeTab, activeStatus, searchQuery]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = useMemo<MediaItem[]>(() => {
    return filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredItems, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingType('image');
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      const formData = new FormData();
      formData.append('image', compressedFile);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        await addMedia({ url: data.data.url, contentType: 'image', status: 'active' }).unwrap();
        toast.success('Image uploaded successfully!');
        setIsAddDialogOpen(false);
      } else {
        throw new Error(data.error.message || 'Image upload failed.');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Cannot upload the image.');
    } finally {
      e.target.value = '';
      setUploadingType(null);
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCompleteUpload = (res: any, type: MediaType) => {
    if (res && res[0]) {
      const newUrl = res[0].url;
      addMedia({ url: newUrl, contentType: type, status: 'active' }).unwrap();
      setUploadingType(null);
      setIsAddDialogOpen(false);
      toast.success(`${type.toUpperCase()} asset registered`);
    }
  };

  const uploadSections = [
    { type: 'video' as MediaType, icon: Video, endpoint: 'videoUploader' as const, label: 'Video' },
    { type: 'audio' as MediaType, icon: Music, endpoint: 'audioUploader' as const, label: 'Audio' },
    { type: 'pdf' as MediaType, icon: FileText, endpoint: 'pdfUploader' as const, label: 'PDF' },
    { type: 'docx' as MediaType, icon: FileCode, endpoint: 'documentUploader' as const, label: 'DOCX' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 selection:bg-indigo-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-6xl font-black italic tracking-tighter bg-gradient-to-br from-white via-white to-white/20 bg-clip-text text-transparent uppercase leading-none mb-2">
              Vault.01
            </h1>
            <p className="text-indigo-400 font-mono text-xs tracking-[0.3em] uppercase opacity-60">System Assets Interface / {filteredItems.length} Total</p>
          </motion.div>

          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant="outline"
              size="lg"
              className="bg-white/5 border-white/10 hover:bg-white/10 backdrop-blur-md rounded-full px-6"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <IoReloadCircleOutline className={`w-5 h-5 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
              Sync
            </Button>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20 rounded-full px-8">
                  <Plus className="w-5 h-5 mr-2" />
                  Import Asset
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl bg-slate-950/90 border-white/10 backdrop-blur-2xl text-white rounded-3xl p-0 overflow-hidden shadow-2xl">
                <DialogHeader className="p-8 pb-4">
                  <DialogTitle className="text-2xl font-black italic uppercase tracking-tight">Access Port</DialogTitle>
                  <DialogDescription className="text-slate-400 uppercase text-[10px] tracking-widest font-bold">
                    Upload new digital signatures to the mainframe
                  </DialogDescription>
                </DialogHeader>

                <div className="px-8 py-4 space-y-6">
                  {newMedia.url ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                      <div className="aspect-video relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 group">
                        {newMedia.contentType === 'image' && <Image src={newMedia.url} alt="Preview" fill className="object-contain" unoptimized />}
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-4 right-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setNewMedia({ ...newMedia, url: '' })}
                        >
                          <XIcon className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Select value={newMedia.contentType} onValueChange={(v: MediaType) => setNewMedia({ ...newMedia, contentType: v })}>
                          <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-2xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-white/10 text-white">
                            <SelectItem value="image">Image</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="audio">Audio</SelectItem>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="docx">Word Doc</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={newMedia.status} onValueChange={(v: MediaStatus) => setNewMedia({ ...newMedia, status: v })}>
                          <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-2xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-white/10 text-white">
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="trash">Trash</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <label className="col-span-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl hover:border-indigo-500/50 hover:bg-white/5 transition-all cursor-pointer group">
                        {uploadingType === 'image' ? (
                          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                        ) : (
                          <>
                            <ImageIcon className="w-8 h-8 mb-2 opacity-40 group-hover:opacity-100 transition-opacity" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Global Image Upload</span>
                          </>
                        )}
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </label>

                      {uploadSections.map(sec => (
                        <div
                          key={sec.type}
                          className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 relative min-h-[140px] hover:bg-white/10 transition-colors"
                        >
                          <AnimatePresence mode="wait">
                            {uploadingType === sec.type ? (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                                <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mb-2" />
                                <span className="text-[8px] font-bold uppercase tracking-tighter text-indigo-400">Syncing {sec.label}</span>
                              </motion.div>
                            ) : (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center w-full">
                                <sec.icon className="w-6 h-6 mb-2 opacity-40" />
                                <span className="text-[10px] font-black uppercase tracking-widest mb-3">{sec.label}</span>
                                <UploadButton
                                  endpoint={sec.endpoint}
                                  appearance={{
                                    button:
                                      'w-full h-9 bg-white/5 hover:bg-indigo-600/20 text-white border border-white/10 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all',
                                    allowedContent: 'hidden',
                                  }}
                                  onUploadBegin={() => setUploadingType(sec.type)}
                                  onClientUploadComplete={res => handleCompleteUpload(res, sec.type)}
                                  onUploadError={err => {
                                    setUploadingType(null);
                                    toast.error(err.message);
                                  }}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <DialogFooter className="p-8 pt-4 border-t border-white/5 mt-4">
                  <Button
                    onClick={handleAddMedia}
                    disabled={isAdding || !!uploadingType}
                    className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black uppercase tracking-[0.2em] text-xs"
                  >
                    {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Finalize Sequence'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          <Tabs value={activeTab} onValueChange={v => setActiveTab(v as MediaType)} className="flex-1">
            <TabsList className="bg-white/5 p-1.5 h-auto rounded-2xl border border-white/5 backdrop-blur-xl">
              {['all', 'image', 'video', 'audio', 'pdf', 'docx'].map(tab => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="rounded-xl px-6 py-2.5 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-slate-950 transition-all"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search data-streams..."
              className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 text-sm focus-visible:ring-indigo-500/50 backdrop-blur-md"
            />
          </div>
        </div>

        <section className="space-y-8 min-h-[600px]">
          <div className="flex items-center gap-2">
            {['active', 'trash'].map(status => (
              <Button
                key={status}
                onClick={() => setActiveStatus(status as MediaStatus)}
                variant="ghost"
                className={`rounded-full h-10 px-6 text-[10px] font-black uppercase tracking-widest border transition-all ${
                  activeStatus === status
                    ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400 shadow-lg shadow-indigo-500/10'
                    : 'border-transparent text-white/40 hover:text-white'
                }`}
              >
                {status === 'active' ? <HardDrive className="w-3.5 h-3.5 mr-2" /> : <Trash2 className="w-3.5 h-3.5 mr-2" />}
                {status}
              </Button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {isLoading || isFetching ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-[500px]"
              >
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-t-2 border-indigo-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-b-2 border-purple-500 animate-spin-reverse" />
                  </div>
                </div>
                <p className="mt-8 text-xs font-black uppercase tracking-[0.5em] text-white/20 animate-pulse">Syncing Mainframe</p>
              </motion.div>
            ) : paginatedItems.length > 0 ? (
              <motion.div key="grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {paginatedItems.map((item, idx) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="group relative aspect-square bg-slate-900 rounded-[2rem] overflow-hidden border border-white/5 hover:border-indigo-500/50 transition-all duration-500 shadow-2xl"
                  >
                    <div className="absolute inset-0 z-10 p-4">
                      <Badge className="bg-slate-950/80 backdrop-blur-md border-white/10 text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                        {item.contentType}
                      </Badge>
                    </div>

                    <div className="w-full h-full relative">
                      {item.contentType === 'video' ? (
                        <video
                          src={item.url}
                          className="w-full h-full object-cover"
                          muted
                          onMouseOver={e => e.currentTarget.play()}
                          onMouseOut={e => {
                            e.currentTarget.pause();
                            e.currentTarget.currentTime = 0;
                          }}
                        />
                      ) : item.contentType === 'audio' ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-500/5">
                          <Music className="w-12 h-12 text-indigo-400 opacity-20" />
                          <audio
                            src={item.url}
                            controls
                            className="w-[80%] h-6 scale-75 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0"
                          />
                        </div>
                      ) : item.contentType === 'pdf' || item.contentType === 'docx' ? (
                        <div className="w-full h-full flex items-center justify-center bg-slate-950/50">
                          {item.contentType === 'pdf' ? <FileText className="w-12 h-12 opacity-20" /> : <FileCode className="w-12 h-12 opacity-20" />}
                        </div>
                      ) : (
                        <Image
                          src={item.url}
                          alt="Vault Asset"
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          unoptimized
                        />
                      )}
                    </div>

                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 p-6">
                      <Button variant="outline" size="sm" className="w-full bg-white/5 border-white/10 rounded-xl" onClick={() => openEditDialog(item)}>
                        <Edit2 className="w-3.5 h-3.5 mr-2" /> Modify
                      </Button>
                      {item.status === 'active' ? (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border-none rounded-xl"
                          onClick={() => handleUpdateStatus(item._id, 'trash')}
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-2" /> Trash
                        </Button>
                      ) : (
                        <div className="w-full space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full bg-emerald-500/10 text-emerald-500 border-emerald-500/20 rounded-xl"
                            onClick={() => handleUpdateStatus(item._id, 'active')}
                          >
                            <CheckCircle className="w-3.5 h-3.5 mr-2" /> Restore
                          </Button>
                          <Button variant="destructive" size="sm" className="w-full bg-red-600 rounded-xl" onClick={() => handleDelete(item._id)}>
                            <AlertCircle className="w-3.5 h-3.5 mr-2" /> Purge
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-[500px] text-center border-2 border-dashed border-white/5 rounded-[3rem]"
              >
                <Ghost className="w-24 h-24 text-white/5 mb-6" />
                <h3 className="text-2xl font-black uppercase tracking-widest text-white/20 italic">No Echoes Found</h3>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/10 mt-2">Zero records detected in current quadrant</p>
              </motion.div>
            )}
          </AnimatePresence>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-8 py-20">
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="w-14 h-14 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-14 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      currentPage === i + 1
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-2xl scale-110 z-10'
                        : 'bg-white/5 border-white/5 text-white/20 hover:text-white'
                    }`}
                  >
                    {(i + 1).toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="w-14 h-14 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          )}
        </section>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-slate-950/95 border-white/10 backdrop-blur-2xl text-white rounded-[2.5rem] p-8 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Manifest Update</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Stream URI</label>
              <Input
                value={editingMedia?.url || ''}
                onChange={e => editingMedia && setEditingMedia({ ...editingMedia, url: e.target.value })}
                className="h-14 bg-white/5 border-white/10 rounded-2xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Class</label>
                <Select
                  value={editingMedia?.contentType}
                  onValueChange={(v: MediaType) => editingMedia && setEditingMedia({ ...editingMedia, contentType: v })}
                >
                  <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white">
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="docx">Word Doc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">State</label>
                <Select value={editingMedia?.status} onValueChange={(v: MediaStatus) => editingMedia && setEditingMedia({ ...editingMedia, status: v })}>
                  <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="trash">Trash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleUpdateMedia}
              disabled={isUpdating}
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black uppercase tracking-widest text-xs"
            >
              {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Override Settings'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
