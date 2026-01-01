'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid,
  Video,
  Image as ImageIcon,
  FileText,
  FileCode,
  Trash2,
  CheckCircle,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  HardDrive,
  Ghost,
} from 'lucide-react';
import { toast } from 'react-toastify';
import Image from 'next/image';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ImageUploadManager from '@/components/dashboard-ui/ImageUploadManager';
import VideoUploadManager from '@/components/dashboard-ui/VideoUploadManger';

type MediaType = 'all' | 'video' | 'image' | 'pdf' | 'docx';
type MediaStatus = 'active' | 'trash' | 'upload';

interface MediaItem {
  _id: string;
  url: string;
  display_url?: string;
  mediaType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function MediaDashboard() {
  const [activeTab, setActiveTab] = useState<MediaType>('all');
  const [activeStatus, setActiveStatus] = useState<MediaStatus>('active');
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/media');
      const result = await res.json();
      if (res.ok) {
        setItems(result.data);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load media');
      toast.error('Error fetching library');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/media', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setItems(prev => prev.map(item => (item._id === id ? { ...item, status: newStatus } : item)));
        toast.success(`Moved to ${newStatus}`);
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setItems(prev => prev.filter(item => item._id !== id));
        toast.success('Permanently deleted');
      }
    } catch {
      toast.error('Delete failed');
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchType = activeTab === 'all' || item.mediaType === activeTab;
      const matchStatus = item.status === activeStatus;
      const matchSearch = item.url.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchStatus && matchSearch;
    });
  }, [items, activeTab, activeStatus, searchQuery]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => setCurrentPage(1), [activeTab, activeStatus, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4 md:p-8 lg:p-12 text-white overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">Media</h1>
          </motion.div>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-indigo-400 transition-colors" />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search assets..."
              className="pl-12 bg-white/5 border-white/10 rounded-2xl h-12 focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-xl transition-all"
            />
          </div>
        </header>

        <Tabs defaultValue="all" className="w-full" onValueChange={v => setActiveTab(v as MediaType)}>
          <TabsList className="bg-white/5 border border-white/10 p-1.5 h-auto rounded-[2rem] backdrop-blur-[120px] flex-wrap justify-start sm:justify-center overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Media', icon: LayoutGrid },
              { id: 'image', label: 'Images', icon: ImageIcon },
              { id: 'video', label: 'Videos', icon: Video },
              { id: 'pdf', label: 'PDFs', icon: FileText },
              { id: 'docx', label: 'Docs', icon: FileCode },
            ].map(tab => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="rounded-full px-6 py-2.5 data-[state=active]:bg-indigo-500 data-[state=active]:text-white transition-all duration-500 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2"
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <section className="space-y-6">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            {[
              { id: 'active', label: 'Active Library', icon: HardDrive },
              { id: 'trash', label: 'Archived', icon: Trash2 },
              { id: 'upload', label: 'Add Content', icon: Plus, disabled: activeTab === 'all' },
            ].map(status => (
              <Button
                key={status.id}
                disabled={status.disabled}
                onClick={() => setActiveStatus(status.id as MediaStatus)}
                variant="ghost"
                className={`
                  rounded-2xl px-6 h-11 border transition-all duration-300 gap-2 whitespace-nowrap uppercase text-[10px] font-black tracking-widest
                  ${
                    activeStatus === status.id
                      ? 'bg-white/10 border-white/20 text-white shadow-xl'
                      : 'border-transparent text-white/40 hover:text-white hover:bg-white/5'
                  }
                  ${status.disabled ? 'opacity-30 cursor-not-allowed' : ''}
                `}
              >
                <status.icon className={`w-4 h-4 ${activeStatus === status.id ? 'text-indigo-400' : ''}`} />
                {status.label}
              </Button>
            ))}
          </div>

          <div className="min-h-[500px] w-full bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-[120px] p-6 md:p-10 transition-all">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-96 flex flex-col items-center justify-center gap-4"
                >
                  <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                  <p className="text-white/40 font-bold tracking-widest uppercase text-xs animate-pulse">Syncing Library</p>
                </motion.div>
              ) : activeStatus === 'upload' ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto py-10">
                  {activeTab === 'image' && (
                    <ImageUploadManager
                      value={[]}
                      onChange={urls => {
                        fetchMedia();
                        setActiveStatus('active');
                      }}
                    />
                  )}
                  {activeTab === 'video' && (
                    <VideoUploadManager
                      value={[]}
                      onChange={urls => {
                        fetchMedia();
                        setActiveStatus('active');
                      }}
                    />
                  )}
                  {['pdf', 'docx'].includes(activeTab) && (
                    <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-[3rem]">
                      <p className="text-white/40 uppercase font-black">Coming Soon</p>
                      <p className="text-[10px] text-white/20">Document engine is being optimized.</p>
                    </div>
                  )}
                </motion.div>
              ) : paginatedItems.length > 0 ? (
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  <AnimatePresence>
                    {paginatedItems.map((item, idx) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group relative"
                      >
                        <Card className="bg-white/5 border-white/10 rounded-[2rem] overflow-hidden group-hover:border-indigo-500/50 transition-all duration-500 shadow-2xl">
                          <div className="relative aspect-square">
                            {item.mediaType === 'video' ? (
                              <video src={item.url} className="w-full h-full object-cover" />
                            ) : (
                              <Image src={item.url} alt="Media" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-5">
                              <div className="flex gap-2 justify-end">
                                {item.status === 'active' ? (
                                  <Button
                                    size="icon"
                                    onClick={() => handleUpdateStatus(item._id, 'trash')}
                                    className="rounded-xl bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white backdrop-blur-md"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                ) : (
                                  <>
                                    <Button
                                      size="icon"
                                      onClick={() => handleUpdateStatus(item._id, 'active')}
                                      className="rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-500 hover:text-white backdrop-blur-md"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      onClick={() => handleDelete(item._id)}
                                      className="rounded-xl bg-rose-600/40 hover:bg-rose-600 text-white backdrop-blur-md"
                                    >
                                      <AlertCircle className="w-4 h-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="absolute top-4 left-4">
                              <Badge className="bg-white/10 backdrop-blur-md border-white/20 text-[8px] uppercase font-black px-2 py-0.5">
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
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-96 flex flex-col items-center justify-center gap-6 opacity-40">
                  <div className="p-8 rounded-full bg-white/5 border border-white/10">
                    <Ghost className="w-16 h-16 text-indigo-400" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold uppercase tracking-widest italic">No Assets found</h3>
                    <p className="text-xs text-white/50 mt-2">Adjust your filters or initiate a new upload.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {totalPages > 1 && activeStatus !== 'upload' && (
            <div className="flex items-center justify-center gap-4 py-8">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="bg-white/5 border-white/10 rounded-xl hover:bg-indigo-500 transition-all"
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Previous
              </Button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-bold text-xs transition-all ${
                      currentPage === i + 1 ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 scale-110' : 'bg-white/5 text-white/40 hover:bg-white/10'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="bg-white/5 border-white/10 rounded-xl hover:bg-indigo-500 transition-all"
              >
                Next <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
