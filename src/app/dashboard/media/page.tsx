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
} from 'lucide-react';
import { IoReloadCircleOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import Image from 'next/image';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useGetMediasQuery, useAddMediaMutation, useUpdateMediaMutation, useDeleteMediaMutation } from '@/redux/features/media/mediaSlice';

type MediaType = 'all' | 'video' | 'image' | 'pdf' | 'docx';
type MediaStatus = 'active' | 'trash';

interface MediaItem {
  _id: string;
  url: string;
  display_url?: string;
  mediaType: MediaType;
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
  const [newMedia, setNewMedia] = useState({
    url: '',
    mediaType: 'image' as MediaType,
    status: 'active' as MediaStatus,
  });

  const { data: response, isLoading, isFetching, refetch } = useGetMediasQuery({});
  const [addMedia, { isLoading: isAdding }] = useAddMediaMutation();
  const [updateMedia] = useUpdateMediaMutation();
  const [deleteMedia] = useDeleteMediaMutation();

  const items = useMemo<MediaItem[]>(() => response?.data || [], [response?.data]);

  const handleAddMedia = async () => {
    if (!newMedia.url) return toast.error('URL is required');
    try {
      await addMedia(newMedia).unwrap();
      toast.success('Media added successfully');
      setIsAddDialogOpen(false);
      setNewMedia({ url: '', mediaType: 'image', status: 'active' });
    } catch {
      toast.error('Failed to add media');
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
      const matchType = activeTab === 'all' || item.mediaType === activeTab;
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

  return (
    <div className="min-h-screen bg-[#020617] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4 md:p-8 text-white relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto relative z-10 space-y-8">
        <header className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="w-full flex flex-col gap-1">
              <h1 className="text-5xl font-black uppercase tracking-tighter italic bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                Media Vault
              </h1>
              <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-indigo-400/60">Encrypted Asset Management • {filteredItems.length} Records</p>
            </motion.div>

            <div className="w-full flex flex-wrap gap-3 items-center justify-end">
              <Button
                size="sm"
                variant="outlineWater"
                className="bg-white/5 backdrop-blur-2xl border-white/10 hover:bg-white/10 transition-all rounded-2xl px-6 h-12"
                onClick={() => {
                  refetch();
                  toast.info('Vault Synchronized');
                }}
                disabled={isLoading || isFetching}
              >
                <IoReloadCircleOutline className={`w-5 h-5 mr-2 ${isFetching ? 'animate-spin' : ''}`} /> Sync
              </Button>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outlineGarden" className="rounded-2xl px-6 h-12 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    <Plus className="w-5 h-5 mr-2" /> Intake Asset
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-950/90 backdrop-blur-[120px] border-white/10 text-white rounded-[3rem] sm:max-w-md shadow-2xl">
                  <DialogHeader className="space-y-2">
                    <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter">New Registration</DialogTitle>
                    <DialogDescription className="text-slate-500 font-medium">Link external cloud storage directly to your vault.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400/60 ml-1">Cloud URI</label>
                      <div className="relative group">
                        <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                        <Input
                          placeholder="https://cloud.storage/asset.webp"
                          className="bg-white/5 border-white/10 pl-12 h-14 rounded-2xl focus:ring-indigo-500 transition-all"
                          value={newMedia.url}
                          onChange={e => setNewMedia({ ...newMedia, url: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400/60 ml-1">Asset Classification</label>
                        <Select value={newMedia.mediaType} onValueChange={(v: MediaType) => setNewMedia({ ...newMedia, mediaType: v })}>
                          <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-2xl">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-white/10 text-white rounded-2xl">
                            <SelectItem value="image">Image Component</SelectItem>
                            <SelectItem value="video">Cinematic Stream</SelectItem>
                            <SelectItem value="pdf">Portable Document</SelectItem>
                            <SelectItem value="docx">Legacy Word Doc</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400/60 ml-1">Initial Permissions</label>
                        <Select value={newMedia.status} onValueChange={(v: MediaStatus) => setNewMedia({ ...newMedia, status: v })}>
                          <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-2xl">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-white/10 text-white rounded-2xl">
                            <SelectItem value="active">Active Deployment</SelectItem>
                            <SelectItem value="trash">Restricted Archive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button
                      className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all"
                      onClick={handleAddMedia}
                      disabled={isAdding}
                    >
                      {isAdding ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-3" /> Execute Deployment
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-2xl group">
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by unique identifier or origin..."
              className="bg-white/5 border-white/10 h-16 pl-14 rounded-3xl focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-3xl transition-all text-lg font-medium"
            />
            <LayoutGrid className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
          </motion.div>
        </header>

        <Tabs value={activeTab} onValueChange={v => setActiveTab(v as MediaType)} className="w-full">
          <TabsList className="bg-white/5 border border-white/10 p-2 h-16 rounded-3xl backdrop-blur-3xl flex w-full max-w-4xl mx-auto overflow-x-auto no-scrollbar gap-2 shadow-inner">
            {[
              { id: 'all', label: 'Universal', icon: LayoutGrid },
              { id: 'image', label: 'Images', icon: ImageIcon },
              { id: 'video', label: 'Videos', icon: Video },
              { id: 'pdf', label: 'PDFs', icon: FileText },
              { id: 'docx', label: 'Docs', icon: FileCode },
            ].map(tab => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex-1 rounded-2xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-2xl transition-all duration-500 text-[10px] font-black uppercase tracking-widest gap-2 h-full"
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden md:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <section className="space-y-8 pb-20">
          <div className="flex items-center gap-4">
            {[
              { id: 'active', label: 'Operational', icon: HardDrive },
              { id: 'trash', label: 'Quarantine', icon: Trash2 },
            ].map(status => (
              <Button
                key={status.id}
                onClick={() => setActiveStatus(status.id as MediaStatus)}
                variant="ghost"
                className={`rounded-full px-8 h-12 border transition-all duration-500 gap-3 text-[10px] font-black uppercase tracking-[0.2em] ${
                  activeStatus === status.id
                    ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-lg'
                    : 'border-white/5 text-white/30 hover:text-white hover:bg-white/5'
                }`}
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

          <div className="min-h-[600px] w-full bg-white/5 border border-white/10 rounded-[4rem] backdrop-blur-[150px] p-8 md:p-12 transition-all relative">
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
                        <Card className="bg-slate-900/40 border-white/10 rounded-[2.5rem] overflow-hidden hover:border-indigo-500/50 transition-all duration-700 hover:shadow-[0_40px_80px_rgba(79,70,229,0.25)] relative">
                          <div className="relative aspect-square">
                            {item.mediaType === 'video' ? (
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
                                  <Button
                                    size="icon"
                                    onClick={() => handleUpdateStatus(item._id, 'trash')}
                                    className="h-12 w-12 rounded-2xl bg-amber-500/20 hover:bg-amber-500 text-amber-500 hover:text-white backdrop-blur-xl transition-all shadow-xl"
                                  >
                                    <Trash2 className="w-6 h-6" />
                                  </Button>
                                ) : (
                                  <>
                                    <Button
                                      size="icon"
                                      onClick={() => handleUpdateStatus(item._id, 'active')}
                                      className="h-12 w-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl"
                                    >
                                      <CheckCircle className="w-6 h-6" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="destructive"
                                      onClick={() => handleDelete(item._id)}
                                      className="h-12 w-12 rounded-2xl shadow-2xl"
                                    >
                                      <AlertCircle className="w-6 h-6" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="absolute top-5 left-5">
                              <Badge className="bg-indigo-600/90 text-[8px] uppercase font-black px-4 py-1.5 border-none shadow-2xl rounded-full tracking-widest">
                                {item.mediaType}
                              </Badge>
                            </div>
                          </div>
                        </Card>
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
