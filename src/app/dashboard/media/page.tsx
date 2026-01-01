'use client';

import React, { useState, useMemo } from 'react';
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
  Loader2,
  AlertCircle,
  HardDrive,
  Ghost,
  XIcon,
  Link,
  Save,
  Edit2,
  Headphones,
  Music,
  Volume2,
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
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
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
                <span className="text-5xl text-clip font-black uppercase tracking-tighter italic bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                  Media
                </span>
                <small className="text-xs text-slate-200 font-normal">{filteredItems.length} Records</small>
              </h1>
            </motion.div>

            <div className="w-full flex flex-wrap gap-3 items-center justify-end">
              <Button
                size="sm"
                variant="outlineWater"
                onClick={() => {
                  refetch();
                  toast.info('Vault Synchronized');
                }}
                disabled={isLoading || isFetching}
              >
                <IoReloadCircleOutline className={`w-5 h-5 mr-2 ${isFetching ? 'animate-spin' : ''}`} /> Reload
              </Button>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outlineGarden">
                    <Plus className="w-5 h-5 mr-2" /> Add Media
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl mt-8 rounded-2xl text-white transition-all duration-300 overflow-y-auto max-h-[90vh]">
                  <DialogHeader className="border-b border-white/10 pb-3">
                    <DialogTitle className="text-lg font-semibold tracking-wide text-white/90 uppercase italic">Import Media</DialogTitle>
                    <DialogDescription className="text-white/50 text-xs font-medium">Choose a media file to import.</DialogDescription>
                  </DialogHeader>

                  {newMedia.url ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 py-6">
                      <div className="relative group aspect-video w-full rounded-2xl overflow-hidden bg-white/5 border border-white/20 flex items-center justify-center backdrop-blur-md">
                        {newMedia.contentType === 'image' && <Image src={newMedia.url} alt="Preview" fill className="object-contain p-2" unoptimized />}
                        {newMedia.contentType === 'video' && <video src={newMedia.url} className="w-full h-full object-contain" controls />}
                        {newMedia.contentType === 'audio' && (
                          <div className="flex flex-col items-center gap-4">
                            <Headphones className="w-16 h-16 text-emerald-400/60 animate-pulse" />
                            <audio src={newMedia.url} controls className="h-8" />
                          </div>
                        )}
                        {(newMedia.contentType === 'pdf' || newMedia.contentType === 'docx') && (
                          <div className="flex flex-col items-center gap-3">
                            {newMedia.contentType === 'pdf' ? (
                              <FileText className="w-16 h-16 text-red-400/60" />
                            ) : (
                              <FileCode className="w-16 h-16 text-blue-400/60" />
                            )}
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 truncate max-w-[200px]">
                              {newMedia.url.split('/').pop()}
                            </span>
                          </div>
                        )}

                        <button
                          onClick={() => setNewMedia({ ...newMedia, url: '' })}
                          className="absolute top-3 right-3 p-2 bg-red-500/20 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">Change Type</label>
                          <Select value={newMedia.contentType} onValueChange={(v: MediaType) => setNewMedia({ ...newMedia, contentType: v })}>
                            <SelectTrigger className="bg-white/10 border border-white/20 h-12 rounded-xl focus:ring-0 text-white/80">
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900/90 backdrop-blur-3xl border-white/10 text-white rounded-xl">
                              <SelectItem value="image">Image</SelectItem>
                              <SelectItem value="video">Video</SelectItem>
                              <SelectItem value="audio">Audio</SelectItem>
                              <SelectItem value="pdf">PDF</SelectItem>
                              <SelectItem value="docx">Word Doc</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">Permissions</label>
                          <Select value={newMedia.status} onValueChange={(v: MediaStatus) => setNewMedia({ ...newMedia, status: v })}>
                            <SelectTrigger className="bg-white/10 border border-white/20 h-12 rounded-xl focus:ring-0 text-white/80">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900/90 backdrop-blur-3xl border-white/10 text-white rounded-xl">
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="trash">Trash</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-6 py-8">
                      <div className="grid grid-cols-2 gap-4">
                        <label
                          htmlFor="single-image-upload"
                          className={` col-span-2
                            flex flex-col items-center justify-center gap-3 p-8 rounded-2xl cursor-pointer
                            bg-linear-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-xl 
                            hover:border-white/40 hover:bg-white/10 transition-all duration-500 group
                            ${uploadingType === 'image' ? 'opacity-50 cursor-wait' : ''}
                          `}
                        >
                          {uploadingType === 'image' ? (
                            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-white/20 group-hover:text-white transition-colors" />
                          )}
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Upload Image</span>
                          <input
                            id="single-image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={!!uploadingType}
                          />
                        </label>

                        <div className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-linear-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-xl hover:border-white/40 hover:bg-white/10 transition-all duration-500 group relative min-h-[140px]">
                          <AnimatePresence mode="wait">
                            {uploadingType === 'video' ? (
                              <motion.div
                                key="video-loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center gap-2"
                              >
                                <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                                <span className="text-[8px] font-bold uppercase text-indigo-400">Uploading Video</span>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="video-idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center gap-2 text-center w-full"
                              >
                                <Video className="w-6 h-6 text-white/20 group-hover:text-white transition-colors" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">Video</span>
                                <UploadButton
                                  endpoint="videoUploader"
                                  appearance={{
                                    button:
                                      'bg-transparent text-white text-[10px] font-bold px-4 h-8 rounded-lg border-white/10 border hover:bg-white/5 transition-all w-full',
                                    allowedContent: 'hidden',
                                  }}
                                  onUploadBegin={() => setUploadingType('video')}
                                  onClientUploadComplete={res => handleCompleteUpload(res, 'video')}
                                  onUploadError={err => {
                                    setUploadingType(null);
                                    toast.error(err.message);
                                  }}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-linear-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-xl hover:border-white/40 hover:bg-white/10 transition-all duration-500 group relative min-h-[140px]">
                          <AnimatePresence mode="wait">
                            {uploadingType === 'audio' ? (
                              <motion.div
                                key="audio-loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center gap-2"
                              >
                                <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                                <span className="text-[8px] font-bold uppercase text-indigo-400">Uploading Audio</span>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="audio-idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center gap-2 text-center w-full"
                              >
                                <Music className="w-6 h-6 text-white/20 group-hover:text-white transition-colors" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">Audio</span>
                                <UploadButton
                                  endpoint="audioUploader"
                                  appearance={{
                                    button:
                                      'bg-transparent text-white text-[10px] font-bold px-4 h-8 rounded-lg border-white/10 border hover:bg-white/5 transition-all w-full',
                                    allowedContent: 'hidden',
                                  }}
                                  onUploadBegin={() => setUploadingType('audio')}
                                  onClientUploadComplete={res => handleCompleteUpload(res, 'audio')}
                                  onUploadError={err => {
                                    setUploadingType(null);
                                    toast.error(err.message);
                                  }}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-linear-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-xl hover:border-white/40 hover:bg-white/10 transition-all duration-500 group relative min-h-[140px]">
                          <AnimatePresence mode="wait">
                            {uploadingType === 'pdf' ? (
                              <motion.div
                                key="pdf-loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center gap-2"
                              >
                                <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                                <span className="text-[8px] font-bold uppercase text-indigo-400">Uploading PDF</span>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="pdf-idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center gap-2 text-center w-full"
                              >
                                <FileText className="w-6 h-6 text-white/20 group-hover:text-white transition-colors" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">PDF</span>
                                <UploadButton
                                  endpoint="pdfUploader"
                                  appearance={{
                                    button:
                                      'bg-transparent text-white text-[10px] font-bold px-4 h-8 rounded-lg border-white/10 border hover:bg-white/5 transition-all w-full',
                                    allowedContent: 'hidden',
                                  }}
                                  onUploadBegin={() => setUploadingType('pdf')}
                                  onClientUploadComplete={res => handleCompleteUpload(res, 'pdf')}
                                  onUploadError={err => {
                                    setUploadingType(null);
                                    toast.error(err.message);
                                  }}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-linear-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-xl hover:border-white/40 hover:bg-white/10 transition-all duration-500 group relative min-h-[140px]">
                          <AnimatePresence mode="wait">
                            {uploadingType === 'docx' ? (
                              <motion.div
                                key="docx-loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center gap-2"
                              >
                                <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                                <span className="text-[8px] font-bold uppercase text-indigo-400">Uploading DOCX</span>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="docx-idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center gap-2 text-center w-full"
                              >
                                <FileCode className="w-6 h-6 text-white/20 group-hover:text-white transition-colors" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">DOCX</span>
                                <UploadButton
                                  endpoint="documentUploader"
                                  appearance={{
                                    button:
                                      'bg-transparent text-white text-[10px] font-bold px-4 h-8 rounded-lg border-white/10 border hover:bg-white/5 transition-all w-full',
                                    allowedContent: 'hidden',
                                  }}
                                  onUploadBegin={() => setUploadingType('docx')}
                                  onClientUploadComplete={res => handleCompleteUpload(res, 'docx')}
                                  onUploadError={err => {
                                    setUploadingType(null);
                                    toast.error(err.message);
                                  }}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  )}

                  <DialogFooter className="mt-4 border-t border-white/10 pt-4">
                    <Button
                      variant="outlineGlassy"
                      size="sm"
                      onClick={handleAddMedia}
                      disabled={isAdding || !!uploadingType}
                      className="w-full h-12 rounded-xl border-white/10 hover:border-white/30"
                    >
                      {isAdding ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <div className="flex items-center gap-2 uppercase font-black tracking-widest text-[10px]">
                          <Save className="w-4 h-4" /> Finalize Selection
                        </div>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent
            className="sm:max-w-[500px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl 
                       rounded-2xl text-white transition-all duration-300"
          >
            <DialogHeader className="border-b border-white/10 pb-3">
              <DialogTitle className="text-lg font-semibold tracking-wide text-white/90 uppercase italic">Edit Asset</DialogTitle>
              <DialogDescription className="text-white/50 text-xs font-medium">Modify the parameters of this stored digital signature.</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">Cloud URI</label>
                <div className="relative group">
                  <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-white transition-colors" />
                  <Input
                    placeholder="Update URL"
                    className="bg-white/10 border border-white/20 placeholder:text-white/30 text-white 
                               rounded-xl focus-visible:ring-0 focus:border-white/40 backdrop-blur-md pl-12 h-14"
                    value={editingMedia?.url || ''}
                    onChange={e => editingMedia && setEditingMedia({ ...editingMedia, url: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">Classification</label>
                  <Select
                    value={editingMedia?.contentType}
                    onValueChange={(v: MediaType) => editingMedia && setEditingMedia({ ...editingMedia, contentType: v })}
                  >
                    <SelectTrigger className="bg-white/10 border border-white/20 h-14 rounded-xl focus:ring-0 text-white/80">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900/90 backdrop-blur-3xl border-white/10 text-white rounded-xl">
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="docx">Word Doc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">Permissions</label>
                  <Select value={editingMedia?.status} onValueChange={(v: MediaStatus) => editingMedia && setEditingMedia({ ...editingMedia, status: v })}>
                    <SelectTrigger className="bg-white/10 border border-white/20 h-14 rounded-xl focus:ring-0 text-white/80">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900/90 backdrop-blur-3xl border-white/10 text-white rounded-xl">
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="trash">Trash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter className="mt-4 border-t border-white/10 pt-4">
              <Button variant="outlineGlassy" size="sm" onClick={handleUpdateMedia} disabled={isUpdating}>
                {isUpdating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-3" /> Update Asset
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="w-full gap-2 flex items-center justify-between">
          <Tabs value={activeTab} onValueChange={v => setActiveTab(v as MediaType)}>
            <TabsList className="bg-transparent gap-2">
              {[
                { id: 'all', label: 'All', icon: LayoutGrid },
                { id: 'image', label: 'Images', icon: ImageIcon },
                { id: 'video', label: 'Videos', icon: Video },
                { id: 'audio', label: 'Audio', icon: Headphones },
                { id: 'pdf', label: 'PDFs', icon: FileText },
                { id: 'docx', label: 'Docs', icon: FileCode },
              ].map(tab => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-white/30 text-white/50 backdrop-blur-xl shadow-lg shadow-blue-500/20 hover:from-blue-500/30 hover:to-purple-500/30 h-8 hover:border-white/50 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] transition-all duration-300 data-[state=active]:border-white data-[state=active]:text-green-100 data-[state=active]:bg-green-400/20"
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-2xl group">
            <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search media..." className="pl-14" />
            <LayoutGrid className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
          </motion.div>
        </div>

        <section className="space-y-8 pb-20">
          <div className="flex items-center gap-4">
            {[
              { id: 'active', label: 'Active', icon: HardDrive },
              { id: 'trash', label: 'Trash', icon: Trash2 },
            ].map(status => (
              <Button
                key={status.id}
                onClick={() => setActiveStatus(status.id as MediaStatus)}
                variant="outlineGlassy"
                className={`bg-linear-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl shadow-lg shadow-blue-500/20 hover:from-blue-500/30 hover:to-purple-500/30 h-8 hover:border-white/50 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] transition-all duration-300 ${activeStatus === status.id ? ' border-green-50 text-green-50' : ' '}`}
              >
                <status.icon className="w-4 h-4" /> {status.label}
              </Button>
            ))}

            {searchQuery && (
              <Badge
                variant="secondary"
                className="flex items-center gap-3 pl-4 pr-2 py-2 text-[10px] font-black uppercase tracking-widest bg-indigo-500/10 border-indigo-500/30 text-indigo-400 rounded-full"
              >
                <span>Filtered: {searchQuery}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-indigo-500/20" onClick={() => setSearchQuery('')}>
                  <XIcon className="h-4 h-4" />
                </Button>
              </Badge>
            )}
          </div>

          <div className="min-h-[600px] w-full transition-all relative">
            <AnimatePresence mode="wait">
              {isLoading || isFetching ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-6"
                >
                  <div className="relative">
                    <Loader2 className="w-20 h-20 text-indigo-500 animate-spin" />
                    <div className="absolute inset-0 blur-3xl bg-indigo-500/30 animate-pulse rounded-full" />
                  </div>
                  <p className="text-white/20 font-black tracking-[0.5em] uppercase text-xs">Authenticating Vault Data</p>
                </motion.div>
              ) : paginatedItems.length > 0 ? (
                <motion.div key="grid" layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
                  <AnimatePresence mode="popLayout">
                    {paginatedItems.map((item: MediaItem, idx: number) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                        className="group"
                      >
                        <div className="bg-slate-900/40 border-white/10 overflow-hidden hover:border-indigo-500/50 transition-all duration-700 hover:shadow-[0_40px_80px_rgba(79,70,229,0.25)] relative">
                          <div className="relative aspect-square">
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
                              <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-500/10 gap-3 group/audio">
                                <div className="relative">
                                  <Volume2 className="w-16 h-16 text-indigo-400 opacity-40 group-hover/audio:opacity-100 transition-all duration-500" />
                                  <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full -z-10"
                                  />
                                </div>
                                <audio
                                  src={item.url}
                                  controls
                                  className="w-[85%] h-8 opacity-0 group-hover/audio:opacity-100 transition-all duration-500 translate-y-2 group-hover/audio:translate-y-0"
                                />
                              </div>
                            ) : (
                              <Image
                                src={item.url}
                                alt="Vault"
                                fill
                                sizes="(max-width: 768px) 50vw, 20vw"
                                className="object-cover transition-transform duration-1000 group-hover:scale-125"
                                unoptimized
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                              <div className="flex gap-4 justify-center items-center">
                                {item.status === 'active' ? (
                                  <div className="w-full flex gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() => openEditDialog(item)}
                                      variant="outlineGlassy"
                                      className="flex items-center justify-start gap-2"
                                    >
                                      <Edit2 className="w-6 h-6" /> Edit
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => handleUpdateStatus(item._id, 'trash')}
                                      variant="outlineFire"
                                      className="flex items-center justify-start gap-2 pl-2"
                                    >
                                      <Trash2 className="w-6 h-6" /> Delete
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="w-full flex flex-col gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() => handleUpdateStatus(item._id, 'active')}
                                      variant="outlineGlassy"
                                      className="flex items-center justify-start gap-2"
                                    >
                                      <CheckCircle className="w-6 h-6" /> Restore
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => handleDelete(item._id)}
                                      variant="outlineFire"
                                      className="flex items-center justify-start gap-2"
                                    >
                                      <AlertCircle className="w-6 h-6" /> Permanently Delete
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="absolute top-5 left-5">
                              <Badge className="bg-indigo-600/90 text-[8px] uppercase font-black px-4 py-1.5 border-none shadow-2xl rounded-full tracking-widest">
                                {item.contentType}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-[500px] flex flex-col items-center justify-center gap-10"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full animate-pulse" />
                    <Ghost className="w-32 h-32 text-white/5 relative z-10 animate-bounce" />
                  </div>
                  <div className="text-center space-y-4 relative z-10">
                    <h3 className="text-4xl font-black uppercase tracking-[0.4em] italic text-white/10">Zero Assets</h3>
                    <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/5 max-w-sm mx-auto leading-loose">
                      No detectable signatures found in this quadrant of the vault.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-6 pt-12">
              <Button
                variant="outlineWater"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="rounded-2xl border-white/10 h-14 px-8 font-black uppercase tracking-widest text-xs"
              >
                Prev
              </Button>
              <div className="flex gap-3">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-14 h-14 rounded-2xl font-black text-[10px] transition-all border ${currentPage === i + 1 ? 'bg-indigo-600 border-indigo-400 text-white shadow-2xl scale-125 z-10' : 'bg-white/5 border-white/5 text-white/20 hover:text-white hover:bg-white/10'}`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </button>
                ))}
              </div>
              <Button
                variant="outlineWater"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="rounded-2xl border-white/10 h-14 px-8 font-black uppercase tracking-widest text-xs"
              >
                Next
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
