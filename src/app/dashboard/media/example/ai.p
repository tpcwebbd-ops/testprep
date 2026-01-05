Look at the query and mutation from this page.tsx
```
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
  Save,
  Edit2,
  Headphones,
  Music,
  Volume2,
  Eye,
  Download,
  Type,
  PlayCircle,
  FileSearch,
  LinkIcon,
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);

  const [uploadingType, setUploadingType] = useState<MediaType | null>(null);

  const [newMedia, setNewMedia] = useState({
    url: '',
    name: '',
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
      setNewMedia({ url: '', name: '', contentType: 'image', status: 'active' });
    } catch {
      toast.error('Failed to add media');
    }
  };

  const openEditDialog = (item: MediaItem) => {
    setEditingMedia(item);
    setIsEditDialogOpen(true);
  };

  const openPreviewDialog = (item: MediaItem) => {
    setPreviewMedia(item);
    setIsPreviewDialogOpen(true);
  };

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
      const matchSearch = (item.name || item.url).toLowerCase().includes(searchQuery.toLowerCase());
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
      const fileName = res[0].name || 'unnamed_asset';
      addMedia({ url: newUrl, name: fileName, contentType: type, status: 'active' }).unwrap();
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
              <CustomLink href="/dashboard/media/example" variant="outlineGlassy" size="sm">
                Example
              </CustomLink>
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
                              {newMedia.name || newMedia.url.split('/').pop()}
                            </span>
                          </div>
                        )}
                        <button
                          onClick={() => setNewMedia({ ...newMedia, url: '', name: '' })}
                          className="absolute top-3 right-3 p-2 bg-red-500/20 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">Asset Name</label>
                          <Input
                            value={newMedia.name}
                            onChange={e => setNewMedia({ ...newMedia, name: e.target.value })}
                            className="bg-white/10 border-white/20 h-12 rounded-xl text-white/80"
                            placeholder="Enter asset name"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-1">Change Type</label>
                            <Select value={newMedia.contentType} onValueChange={(v: MediaType) => setNewMedia({ ...newMedia, contentType: v })}>
                              <SelectTrigger className="bg-white/10 border border-white/20 h-12 rounded-xl text-white/80">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-900/90 backdrop-blur-3xl text-white rounded-xl">
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
                              <SelectTrigger className="bg-white/10 border border-white/20 h-12 rounded-xl text-white/80">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-900/90 backdrop-blur-3xl text-white rounded-xl">
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="trash">Trash</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-6 py-8">
                      <div className="grid grid-cols-2 gap-4">
                        <label
                          htmlFor="single-image-upload"
                          className={`col-span-2 flex flex-col items-center justify-center gap-3 p-8 rounded-2xl cursor-pointer bg-linear-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-xl hover:border-white/40 hover:bg-white/10 transition-all duration-500 group ${uploadingType === 'image' ? 'opacity-50 cursor-wait' : ''}`}
                        >
                          {uploadingType === 'image' ? (
                            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-white/20 group-hover:text-white" />
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

                        {['video', 'audio', 'pdf', 'docx'].map(type => (
                          <div
                            key={type}
                            className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-linear-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-xl hover:border-white/40 hover:bg-white/10 transition-all duration-500 group relative min-h-[140px]"
                          >
                            <AnimatePresence mode="wait">
                              {uploadingType === type ? (
                                <motion.div
                                  key={`${type}-loading`}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="flex flex-col items-center gap-2"
                                >
                                  <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                                  <span className="text-[8px] font-bold uppercase text-indigo-400">Uploading {type.toUpperCase()}</span>
                                </motion.div>
                              ) : (
                                <motion.div
                                  key={`${type}-idle`}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="flex flex-col items-center gap-2 text-center w-full"
                                >
                                  {type === 'video' && <Video className="w-6 h-6 text-white/20 group-hover:text-white" />}
                                  {type === 'audio' && <Music className="w-6 h-6 text-white/20 group-hover:text-white" />}
                                  {type === 'pdf' && <FileText className="w-6 h-6 text-white/20 group-hover:text-white" />}
                                  {type === 'docx' && <FileCode className="w-6 h-6 text-white/20 group-hover:text-white" />}
                                  <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">{type}</span>
                                  <UploadButton
                                    endpoint={
                                      type === 'docx'
                                        ? 'documentUploader'
                                        : type === 'pdf'
                                          ? 'pdfUploader'
                                          : type === 'video'
                                            ? 'videoUploader'
                                            : 'audioUploader'
                                    }
                                    appearance={{
                                      button:
                                        'bg-transparent text-white text-[10px] font-bold px-4 h-8 rounded-lg border-white/10 border hover:bg-white/5 transition-all w-full',
                                      allowedContent: 'hidden',
                                    }}
                                    onUploadBegin={() => setUploadingType(type as MediaType)}
                                    onClientUploadComplete={res => handleCompleteUpload(res, type as MediaType)}
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
                    </div>
                  )}
                  <DialogFooter className="mt-4 border-t border-white/10 pt-4">
                    <Button
                      variant="outlineGlassy"
                      size="sm"
                      onClick={handleAddMedia}
                      disabled={isAdding || !!uploadingType}
                      className="w-full h-12 rounded-xl border-white/10"
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
          <DialogContent className="sm:max-w-[500px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl text-white">
            <DialogHeader className="border-b border-white/10 pb-3">
              <DialogTitle className="text-lg font-semibold uppercase italic">Edit Asset</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/60">Asset Name</label>
                <div className="relative group">
                  <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    className="bg-white/10 border-white/20 pl-12 h-14 rounded-xl"
                    value={editingMedia?.name || ''}
                    onChange={e => editingMedia && setEditingMedia({ ...editingMedia, name: e.target.value })}
                    placeholder="Asset label"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/60">Cloud URI</label>
                <div className="relative group">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    className="bg-white/10 border-white/20 pl-12 h-14 rounded-xl"
                    value={editingMedia?.url || ''}
                    onChange={e => editingMedia && setEditingMedia({ ...editingMedia, url: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/60">Classification</label>
                  <Select
                    value={editingMedia?.contentType}
                    onValueChange={(v: MediaType) => editingMedia && setEditingMedia({ ...editingMedia, contentType: v })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 h-14 rounded-xl text-white/80">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900/90 text-white">
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="docx">Word Doc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/60">Permissions</label>
                  <Select value={editingMedia?.status} onValueChange={(v: MediaStatus) => editingMedia && setEditingMedia({ ...editingMedia, status: v })}>
                    <SelectTrigger className="bg-white/10 border-white/20 h-14 rounded-xl text-white/80">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900/90 text-white">
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="trash">Trash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter className="border-t border-white/10 pt-4">
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

        <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
          <DialogContent className="sm:max-w-[90vw] md:max-w-[800px] h-fit max-h-[90vh] bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl text-white overflow-hidden flex flex-col p-0">
            <DialogHeader className="p-6 border-b border-white/10 flex flex-row items-center justify-between">
              <div>
                <DialogTitle className="text-lg font-semibold uppercase italic truncate max-w-[500px]">{previewMedia?.name || 'Data Preview'}</DialogTitle>
                <DialogDescription className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                  {previewMedia?.contentType} Asset Stream
                </DialogDescription>
              </div>
            </DialogHeader>
            <div className="flex-1 bg-black/20 relative min-h-[400px] flex items-center justify-center p-4">
              {previewMedia?.contentType === 'image' && <Image src={previewMedia.url} alt="Preview" fill className="object-contain p-4" unoptimized />}
              {previewMedia?.contentType === 'video' && (
                <video src={previewMedia.url} className="max-w-full max-h-full aspect-video rounded-xl shadow-2xl border border-white/5" controls autoPlay />
              )}
              {previewMedia?.contentType === 'audio' && (
                <div className="flex flex-col items-center gap-8 w-full">
                  <div className="w-48 h-48 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 relative group">
                    <Music className="w-20 h-20 text-indigo-400 animate-pulse" />
                    <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full opacity-50" />
                  </div>
                  <audio src={previewMedia.url} controls className="w-full max-w-md h-12" autoPlay />
                </div>
              )}
              {previewMedia?.contentType === 'pdf' && (
                <iframe src={`${previewMedia.url}#toolbar=0`} className="w-full h-[60vh] rounded-xl border border-white/10" />
              )}
              {previewMedia?.contentType === 'docx' && (
                <div className="flex flex-col items-center gap-6">
                  <div className="w-32 h-32 rounded-3xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <FileCode className="w-16 h-16 text-blue-400" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-sm font-bold opacity-60">Word Document Previewing Unavailable in Browser</p>
                    <Button asChild variant="outlineGlassy" className="rounded-full">
                      <a href={previewMedia.url} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-2" /> Download Document
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter className="p-4 border-t border-white/10 flex flex-row gap-3">
              <Button variant="ghost" onClick={() => setIsPreviewDialogOpen(false)} className="text-[10px] uppercase font-black tracking-widest text-white/40">
                Close Signal
              </Button>
              <Button asChild variant="outlineGlassy" className="h-10 px-6 rounded-xl border-white/10">
                <a
                  href={previewMedia?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest"
                >
                  <LinkIcon className="w-3 h-3" /> External Link
                </a>
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
                  className="bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-white/30 text-white/50 h-8 hover:scale-[1.02] transition-all data-[state=active]:border-white data-[state=active]:bg-green-400/20"
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-2xl group">
            <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search media by name..." className="pl-14" />
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
                className={`h-8 transition-all ${activeStatus === status.id ? ' border-green-50 text-green-50' : ' '}`}
              >
                <status.icon className="w-4 h-4" /> {status.label}
              </Button>
            ))}
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
                  <Loader2 className="w-20 h-20 text-indigo-500 animate-spin" />
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
                        <div className="bg-slate-900/40 border-white/10 overflow-hidden hover:border-indigo-500/50 transition-all duration-700 hover:shadow-[0_40px_80px_rgba(79,70,229,0.25)] relative rounded-2xl">
                          <div className="relative aspect-square">
                            {item.contentType === 'video' && (
                              <div className="w-full h-full relative group/video">
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
                                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-100 group-hover/video:opacity-0 transition-opacity duration-500">
                                  <div className="relative">
                                    <PlayCircle className="w-12 h-12 text-white/40" />
                                    <div className="absolute inset-0 border-2 border-indigo-500/30 rounded-full animate-ping" />
                                  </div>
                                </div>
                                <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 bg-red-500/80 rounded text-[8px] font-bold uppercase tracking-tighter opacity-0 group-hover/video:opacity-100 transition-all">
                                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Live Preview
                                </div>
                              </div>
                            )}

                            {item.contentType === 'image' && (
                              <Image
                                src={item.url}
                                alt={item.name || 'Vault'}
                                fill
                                sizes="(max-width: 768px) 50vw, 20vw"
                                className="object-cover transition-transform duration-1000 group-hover:scale-125"
                                unoptimized
                              />
                            )}

                            {item.contentType === 'audio' && (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-indigo-900/20 to-slate-900 gap-4 group-hover:bg-indigo-900/30 transition-colors duration-500">
                                <div className="relative">
                                  <div className="absolute inset-[-12px] border border-indigo-400/20 rounded-full animate-[spin_10s_linear_infinite]" />
                                  <div className="absolute inset-[-6px] border border-indigo-400/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                                  <Volume2 className="w-12 h-12 text-indigo-400 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex items-end gap-1 h-3">
                                  {[1, 2, 3, 4, 5].map(i => (
                                    <motion.div
                                      key={i}
                                      animate={{ height: [4, 12, 6, 12, 4] }}
                                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                                      className="w-1 bg-indigo-500/60 rounded-full"
                                    />
                                  ))}
                                </div>
                              </div>
                            )}

                            {item.contentType === 'pdf' && (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-red-900/20 to-slate-900 gap-3 group-hover:from-red-900/40 transition-all duration-700">
                                <div className="relative p-6 bg-red-500/5 rounded-2xl border border-red-500/10 group-hover:border-red-500/30 transition-all">
                                  <FileText className="w-12 h-12 text-red-500/50 group-hover:text-red-400 transition-colors" />
                                  <div className="absolute -bottom-2 -right-2 bg-red-500 text-[8px] font-black px-1.5 py-0.5 rounded italic">PDF</div>
                                </div>
                                <div className="h-0.5 w-12 bg-linear-to-r from-transparent via-red-500/40 to-transparent group-hover:w-20 transition-all duration-500" />
                              </div>
                            )}

                            {item.contentType === 'docx' && (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-blue-900/20 to-slate-900 gap-3 group-hover:from-blue-900/40 transition-all duration-700">
                                <div className="relative p-6 bg-blue-500/5 rounded-2xl border border-blue-500/10 group-hover:border-blue-500/30 transition-all">
                                  <FileSearch className="w-12 h-12 text-blue-500/50 group-hover:text-blue-400 transition-colors" />
                                  <div className="absolute -bottom-2 -right-2 bg-blue-500 text-[8px] font-black px-1.5 py-0.5 rounded italic">DOC</div>
                                </div>
                                <div className="h-0.5 w-12 bg-linear-to-r from-transparent via-blue-500/40 to-transparent group-hover:w-20 transition-all duration-500" />
                              </div>
                            )}

                            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                              <Badge className="bg-indigo-600/90 text-[8px] uppercase font-black px-4 py-1.5 border-none rounded-full tracking-widest">
                                {item.contentType}
                              </Badge>
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4">
                              <p className="text-[10px] font-black uppercase tracking-widest text-white mb-3 truncate border-l-2 border-indigo-500 pl-2">
                                {item.name || 'UNNAMED_ASSET'}
                              </p>
                              <div className="flex flex-col gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => openPreviewDialog(item)}
                                  variant="outlineWater"
                                  className="w-full flex items-center justify-center gap-2"
                                >
                                  <Eye className="w-4 h-4" /> Preview
                                </Button>
                                <div className="flex gap-2">
                                  {item.status === 'active' ? (
                                    <>
                                      <Button size="sm" onClick={() => openEditDialog(item)} variant="outlineGlassy" className="flex-1">
                                        <Edit2 className="w-4 h-4" />
                                      </Button>
                                      <Button size="sm" onClick={() => handleUpdateStatus(item._id, 'trash')} variant="outlineFire" className="flex-1">
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Button size="sm" onClick={() => handleUpdateStatus(item._id, 'active')} variant="outlineGlassy" className="flex-1">
                                        <CheckCircle className="w-4 h-4" />
                                      </Button>
                                      <Button size="sm" onClick={() => handleDelete(item._id)} variant="outlineFire" className="flex-1">
                                        <AlertCircle className="w-4 h-4" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
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
                  <Ghost className="w-32 h-32 text-white/5 animate-bounce" />
                  <div className="text-center space-y-4">
                    <h3 className="text-4xl font-black uppercase tracking-[0.4em] italic text-white/10">Zero Assets</h3>
                    <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/5">
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
                    className={`w-14 h-14 rounded-2xl font-black text-[10px] transition-all border ${currentPage === i + 1 ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-white/5 border-white/5 text-white/20'}`}
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
```

and implement those query and mutation in this components
```
// ImageUploadManager.tsx

'use client';

import Image from 'next/image';
import { Plus, X, UploadCloud } from 'lucide-react';
import { toast } from 'react-toastify';
import { useEffect, useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/dialog';

interface InternalImageDialogProps {
  onImageSelect: (newImage: string) => void;
  selectedImages: string[];
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
}

const InternalImageDialog = ({ onImageSelect, selectedImages, maxSizeMB = 1, maxWidthOrHeight = 1920 }: InternalImageDialogProps) => {
  const [allAvailableImages, setAllAvailableImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/media/v1');
      if (!response.ok) throw new Error('Failed to fetch images.');
      const data = await response.json();

      if (!data?.data || !Array.isArray(data.data)) {
        setAllAvailableImages([]);
        return;
      }
      // console.log('data.data : ', data.data);
      const imageUrls: string[] = data.data
        .filter((i: { url: string; contentType: string }) => i.contentType === 'image')
        .map((i: { url: string; contentType: string }) => i.url);
      setAllAvailableImages(imageUrls);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not fetch images.');
      setAllAvailableImages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const options = {
        maxSizeMB,
        maxWidthOrHeight,
        useWebWorker: true,
        fileType: 'image/jpeg' as const,
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
        const newImageUrl = data.data.url;
        await fetch('/api/media/v1', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            delete_url: data.data.delete_url,
            url: newImageUrl,
            display_url: data.data.display_url,
          }),
        });
        toast.success('Image uploaded successfully!');
        onImageSelect(newImageUrl);
        setAllAvailableImages(prev => [newImageUrl, ...prev]);
      } else {
        throw new Error(data.error.message || 'Image upload failed.');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Cannot upload the image.');
    } finally {
      setIsLoading(false);
      e.target.value = '';
    }
  };

  return (
    <ScrollArea className="w-full h-[60vh] p-4 bg-white/5 backdrop-blur-md rounded-xl">
      <header className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
        <h2 className="text-white/90 font-semibold">Select an Image</h2>
        <Button asChild variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition mr-8">
          <label htmlFor="image-upload" className="cursor-pointer flex items-center gap-2 text-white/90">
            <UploadCloud className="w-4 h-4" />
            Upload
          </label>
        </Button>
        <Input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isLoading} />
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-48 text-white/70">Loading images...</div>
      ) : allAvailableImages.length > 0 ? (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {allAvailableImages.map(imageUrl => {
            const isSelected = selectedImages.includes(imageUrl);
            return (
              <DialogClose asChild key={imageUrl}>
                <div
                  onClick={() => !isSelected && onImageSelect(imageUrl)}
                  className={`
                    relative w-full aspect-square rounded-xl overflow-hidden
                    bg-white/10 backdrop-blur-sm
                    border border-white/10 shadow
                    transition-all duration-300
                    ${isSelected ? 'opacity-50 cursor-not-allowed ring-2 ring-emerald-400/70' : 'cursor-pointer hover:scale-[1.05] hover:shadow-xl'}
                  `}
                >
                  <Image src={imageUrl} fill alt="Media" className="object-cover" />
                </div>
              </DialogClose>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-white/60 py-10">No images found.</div>
      )}
    </ScrollArea>
  );
};

interface ImageUploadManagerProps {
  value: string[];
  onChange: (newValues: string[]) => void;
  label?: string;
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
}

export default function ImageUploadManager({ value, onChange, label = 'Images', maxSizeMB = 1, maxWidthOrHeight = 1920 }: ImageUploadManagerProps) {
  const handleAddImage = (newImageUrl: string) => {
    if (!value.includes(newImageUrl)) {
      onChange([newImageUrl, ...value]);
    } else toast.info('Image already selected!');
  };

  const handleRemoveImage = (imageToRemove: string) => {
    onChange(value.filter(imageUrl => imageUrl !== imageToRemove));
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-white/90 font-semibold drop-shadow">{label}</h2>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outlineWater" size="sm" className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20 transition text-white/90">
              <Plus className="w-4 h-4" /> Add Image
            </Button>
          </DialogTrigger>

          <DialogContent
            className="
              max-w-3xl p-0 rounded-2xl
              bg-white/10 backdrop-blur-lg
              border border-white/20 shadow-2xl
              transition-all duration-300
            "
          >
            <InternalImageDialog onImageSelect={handleAddImage} selectedImages={value} maxSizeMB={maxSizeMB} maxWidthOrHeight={maxWidthOrHeight} />
          </DialogContent>
        </Dialog>
      </div>

      <div
        className="
          w-full min-h-[220px] rounded-xl p-4
          bg-white/5 backdrop-blur-md
          border border-white/20 shadow-inner
          flex items-center justify-center
          transition-all duration-300
        "
      >
        {value.length > 0 ? (
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4   gap-3">
            {value.map(imageUrl => (
              <div
                key={imageUrl}
                className="
                  relative w-full aspect-square rounded-xl overflow-hidden
                  bg-white/10 border border-white/10 backdrop-blur-sm
                  shadow-lg hover:scale-[1.03] hover:shadow-2xl
                  transition-all duration-300 group
                "
              >
                <Image src={imageUrl} alt="Selected media" fill className="object-cover" />

                <button
                  onClick={() => handleRemoveImage(imageUrl)}
                  className="
                    absolute top-1 right-1 bg-red-600 text-white w-6 h-6
                    rounded-full flex items-center justify-center
                    opacity-0 group-hover:opacity-100 transition-opacity
                  "
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-white/60">
            <p>No images selected.</p>
            <p className="text-sm">Click &quot;Add Image&quot; to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
}

```

and here is ImageUploadManagerSingle.tsx 
```
'use client';

import Image from 'next/image';
import { Plus, X, UploadCloud, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { useEffect, useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface InternalImageDialogProps {
  onImageSelect: (newImage: string) => void;
  selectedImage: string;
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
}

const InternalImageDialog = ({ onImageSelect, selectedImage, maxSizeMB = 1, maxWidthOrHeight = 1920 }: InternalImageDialogProps) => {
  const [allAvailableImages, setAllAvailableImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/media/v1');
      if (!response.ok) throw new Error('Failed to fetch images.');
      const data = await response.json();

      if (!data?.data || !Array.isArray(data.data)) {
        setAllAvailableImages([]);
        return;
      }

      const imageUrls: string[] = data.data.filter((i: { url: string; contentType: string }) => i.contentType === 'image').map((i: { url: string }) => i.url);
      setAllAvailableImages(imageUrls);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not fetch images.');
      setAllAvailableImages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const options = {
        maxSizeMB,
        maxWidthOrHeight,
        useWebWorker: true,
        fileType: 'image/jpeg' as const,
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
        const newImageUrl = data.data.url;
        await fetch('/api/media/v1', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            delete_url: data.data.delete_url,
            url: newImageUrl,
            display_url: data.data.display_url,
          }),
        });
        toast.success('Image uploaded successfully!');
        onImageSelect(newImageUrl);
        setAllAvailableImages(prev => [newImageUrl, ...prev]);
      } else {
        throw new Error(data.error.message || 'Image upload failed.');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Cannot upload the image.');
    } finally {
      setIsLoading(false);
      e.target.value = '';
    }
  };

  return (
    <ScrollArea className="w-full h-[60vh] p-4 bg-white/5 backdrop-blur-md rounded-xl">
      <header className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
        <h2 className="text-white/90 font-semibold">Select an Image</h2>
        <Button asChild variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition mr-8 text-white/90">
          <label htmlFor="single-image-upload" className="cursor-pointer flex items-center gap-2">
            <UploadCloud className="w-4 h-4" />
            Upload
          </label>
        </Button>
        <Input id="single-image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isLoading} />
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center h-48 text-white/70">Loading images...</div>
      ) : allAvailableImages.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {allAvailableImages.map(imageUrl => {
            const isSelected = selectedImage === imageUrl;
            return (
              <div
                key={imageUrl}
                onClick={() => onImageSelect(imageUrl)}
                className={`
                  relative w-full aspect-square rounded-xl overflow-hidden
                  bg-white/10 backdrop-blur-sm
                  border border-white/10 shadow
                  transition-all duration-300
                  ${isSelected ? 'ring-2 ring-emerald-400/70 scale-[0.98]' : 'cursor-pointer hover:scale-[1.05] hover:shadow-xl'}
                `}
              >
                <Image src={imageUrl} fill alt="Media" className="object-cover" />
                {isSelected && (
                  <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                    <div className="bg-emerald-500 text-white rounded-full p-1 shadow-lg">
                      <Plus className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-white/60 py-10">No images found.</div>
      )}
    </ScrollArea>
  );
};

interface ImageUploadManagerProps {
  value: string;
  onChange: (newValue: string) => void;
  label?: string;
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
}

export default function ImageUploadManagerSingle({ value, onChange, label = 'Image', maxSizeMB = 1, maxWidthOrHeight = 1920 }: ImageUploadManagerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleImageSelect = (newImageUrl: string) => {
    onChange(newImageUrl);
    setIsOpen(false);
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-white/90 font-semibold drop-shadow">{label}</h2>

        {value && (
          <Button variant="ghost" size="sm" onClick={() => onChange('')} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 transition h-8">
            Clear
          </Button>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div
            className={`
              group relative w-full min-h-[220px] rounded-xl overflow-hidden
              bg-white/5 backdrop-blur-md
              border border-white/20 shadow-inner
              flex items-center justify-center
              transition-all duration-300 cursor-pointer
              ${!value ? 'hover:bg-white/10 hover:border-white/30' : ''}
            `}
          >
            {value ? (
              <>
                {value && (
                  <div
                    className="
              relative w-full max-w-sm aspect-square rounded-xl overflow-hidden
              bg-white/10 border border-white/10 backdrop-blur-sm
              shadow-lg
              transition-all duration-300 group
            "
                  >
                    <Image src={value} alt="Selected image" fill className="object-cover" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="bg-white/90 text-black hover:bg-white">
                      <RefreshCw className="w-4 h-4 mr-2" /> Change
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleRemoveImage}>
                      <X className="w-4 h-4 mr-2" /> Remove
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 text-white/50 group-hover:text-white/80 transition-colors">
                <div className="p-4 rounded-full bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Click to select an image</p>
                  <p className="text-xs opacity-70">Supports JPG, PNG, WEBP</p>
                </div>
              </div>
            )}
          </div>
        </DialogTrigger>

        <DialogContent
          className="
            max-w-3xl p-0 rounded-2xl
            bg-white/10 backdrop-blur-lg
            border border-white/20 shadow-2xl
            transition-all duration-300
          "
        >
          <InternalImageDialog onImageSelect={handleImageSelect} selectedImage={value} maxSizeMB={maxSizeMB} maxWidthOrHeight={maxWidthOrHeight} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
``` 

Now your taks is implement mutation and query in mutation in this two component 1. ImageUploadManager and 2. ImageUploadManagerSingle