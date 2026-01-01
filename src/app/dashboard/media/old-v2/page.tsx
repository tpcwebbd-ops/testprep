'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Files, Trash2, Archive, Plus, Search, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ImageUploadManager from '@/components/dashboard-ui/ImageUploadManager';
import VideoUploadManager from '@/components/dashboard-ui/VideoUploadManger';

type MediaType = 'all' | 'video' | 'image' | 'pdf' | 'docx';
type Status = 'active' | 'trash';

interface MediaItem {
  _id: string;
  url: string;
  display_url?: string;
  mediaType: 'video' | 'image' | 'pdf' | 'docx';
  status: Status;
  createdAt: string;
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<MediaType>('all');
  const [statusTab, setStatusTab] = useState<Status>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      if (res.ok) {
        setItems(data.data || []);
      } else {
        toast.error(data.message || 'Failed to fetch media');
      }
    } catch {
      toast.error('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesType = activeTab === 'all' || item.mediaType === activeTab;
      const matchesStatus = item.status === statusTab;
      const matchesSearch = item.url.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesStatus && matchesSearch;
    });
  }, [items, activeTab, statusTab, searchQuery]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleUpdateStatus = async (id: string, newStatus: Status) => {
    try {
      const res = await fetch('/api/media', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setItems(prev => prev.map(i => (i._id === id ? { ...i, status: newStatus } : i)));
        toast.success(`Moved to ${newStatus}`);
      }
    } catch {
      toast.error('Operation failed');
    }
  };

  const handleDeletePermanent = async (id: string) => {
    try {
      const res = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setItems(prev => prev.filter(i => i._id !== id));
        toast.success('Deleted permanently');
      }
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0f172a] to-[#0f172a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-[120px] bg-white/5 p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
              Studio<span className="text-indigo-500">Assets</span>
            </h1>
            <p className="text-white/40 text-sm font-medium tracking-widest uppercase">Central Media Repository</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-indigo-400 transition-colors" />
              <Input
                placeholder="Search assets..."
                className="pl-10 w-64 bg-white/5 border-white/10 text-white rounded-xl focus:ring-indigo-500/50"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  disabled={activeTab === 'all'}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-6 py-6 font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Media
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-[#1e293b]/90 backdrop-blur-xl border-white/10 rounded-3xl text-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black italic uppercase">Upload {activeTab}</DialogTitle>
                </DialogHeader>
                <div className="p-4">
                  {activeTab === 'image' && (
                    <ImageUploadManager
                      value={[]}
                      onChange={urls => {
                        fetchData();
                      }}
                    />
                  )}
                  {activeTab === 'video' && (
                    <VideoUploadManager
                      value={[]}
                      onChange={urls => {
                        fetchData();
                      }}
                    />
                  )}
                  {(activeTab === 'pdf' || activeTab === 'docx') && (
                    <div className="p-12 border-2 border-dashed border-white/10 rounded-3xl text-center">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-white/20" />
                      <p className="text-white/40">Uploader for {activeTab} coming soon.</p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
              {(['all', 'video', 'image', 'pdf', 'docx'] as MediaType[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                  }}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                    activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
              {(['active', 'trash'] as Status[]).map(s => (
                <button
                  key={s}
                  onClick={() => {
                    setStatusTab(s);
                    setCurrentPage(1);
                  }}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                    statusTab === s ? 'bg-rose-600/20 text-rose-500 border border-rose-500/20' : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {s === 'trash' ? <Trash2 className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[400px] relative">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-64 gap-4"
                >
                  <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                  <p className="text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px]">Indexing Assets</p>
                </motion.div>
              ) : currentItems.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                >
                  {currentItems.map((item, idx) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group relative aspect-square rounded-[2rem] bg-white/5 border border-white/10 overflow-hidden backdrop-blur-md hover:border-indigo-500/50 transition-all duration-500"
                    >
                      {item.mediaType === 'image' ? (
                        <img src={item.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : item.mediaType === 'video' ? (
                        <video src={item.url} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-indigo-500/10">
                          <FileText className="w-12 h-12 text-indigo-400" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => window.open(item.url, '_blank')}
                              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                            {statusTab === 'active' ? (
                              <button
                                onClick={() => handleUpdateStatus(item._id, 'trash')}
                                className="p-2 bg-rose-500/20 hover:bg-rose-500 rounded-xl text-rose-500 hover:text-white transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(item._id, 'active')}
                                  className="p-2 bg-emerald-500/20 hover:bg-emerald-500 rounded-xl text-emerald-500 hover:text-white transition-all"
                                >
                                  <Archive className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeletePermanent(item._id)}
                                  className="p-2 bg-rose-600 hover:bg-rose-700 rounded-xl text-white transition-all"
                                >
                                  <XIcon className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{item.mediaType}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-96 bg-white/5 rounded-[3rem] border border-white/5 border-dashed"
                >
                  <Files className="w-16 h-16 text-white/10 mb-4" />
                  <h3 className="text-xl font-bold text-white/60">No Assets Identified</h3>
                  <p className="text-white/20 text-sm mt-2">Adjust filters or initialize a new upload sequence.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-8">
              <Button
                variant="ghost"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="text-white hover:bg-white/10 rounded-xl"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-bold transition-all ${
                      currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <Button
                variant="ghost"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="text-white hover:bg-white/10 rounded-xl"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
