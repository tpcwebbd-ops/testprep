'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Plus, Trash2, RefreshCcw, Image as ImageIcon, Loader2, X, CheckCircle, AlertCircle, UploadCloud, Link as LinkIcon } from 'lucide-react';
import imageCompression from 'browser-image-compression';

// --- Types ---
interface MediaItem {
  _id: string;
  url: string;
  display_url?: string;
  delete_url?: string;
  author_email?: string;
  status: 'active' | 'trash';
  createdAt: string;
  updatedAt: string;
}

type TabType = 'active' | 'trash';

interface ApiResponse {
  data?: MediaItem | MediaItem[];
  message: string;
}

// --- Main Page Component ---
export default function MediaGalleryPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const fetchMedia = useCallback(async () => {
    try {
      const res = await fetch('/api/media');
      const json: ApiResponse = await res.json();
      if (Array.isArray(json.data)) {
        setMediaItems(json.data);
      }
    } catch {
      showNotification('error', 'Failed to load media.');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleAddMedia = async (newItem: MediaItem) => {
    setMediaItems(prev => [newItem, ...prev]);
    showNotification('success', 'Image added successfully');
    setIsAddModalOpen(false);
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'trash' : 'active';
    setMediaItems(prev => prev.map(item => (item._id === id ? { ...item, status: newStatus } : item)));

    try {
      const res = await fetch('/api/media', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update');
      showNotification('success', `Moved to ${newStatus === 'active' ? 'Active' : 'Trash'}`);
    } catch {
      setMediaItems(prev => prev.map(item => (item._id === id ? { ...item, status: currentStatus as 'active' | 'trash' } : item)));
      showNotification('error', 'Update failed.');
    }
  };

  const handleDelete = async (id: string) => {
    const originalItems = [...mediaItems];
    setMediaItems(prev => prev.filter(item => item._id !== id));
    try {
      const res = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to delete');
      showNotification('success', 'Deleted permanently');
    } catch {
      setMediaItems(originalItems);
      showNotification('error', 'Delete failed.');
    }
  };

  const filteredItems = mediaItems.filter(item => item.status === activeTab);

  return (
    <div className="min-h-screen backdrop-blur-xl text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="relative p-1 bg-white rounded-xl flex items-center shadow-sm border border-neutral-200">
            {(['active', 'trash'] as TabType[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 z-10 ${
                  activeTab === tab ? 'text-white' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-neutral-900 rounded-lg shadow-md"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 capitalize flex items-center gap-2">
                  {tab === 'active' ? <CheckCircle size={16} /> : <Trash2 size={16} />}
                  {tab}
                </span>
              </button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddModalOpen(true)}
            className="group flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-neutral-500/20 transition-all hover:bg-neutral-800"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Add Image
          </motion.button>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 text-neutral-400 animate-spin" />
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.map(item => (
                <MediaCard key={item._id} item={item} onToggle={() => handleToggleStatus(item._id, item.status)} onDelete={() => handleDelete(item._id)} />
              ))}
            </AnimatePresence>

            {filteredItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-20 text-neutral-400 border-2 border-dashed border-neutral-200 rounded-3xl bg-white/50"
              >
                <ImageIcon className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg font-medium text-neutral-500">No {activeTab} media found</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Modals & Toasts */}
      <AnimatePresence>
        {isAddModalOpen && (
          <AddImageModal onClose={() => setIsAddModalOpen(false)} onSuccess={handleAddMedia} onError={msg => showNotification('error', msg)} />
        )}
        {notification && <NotificationToast type={notification.type} message={notification.message} />}
      </AnimatePresence>
    </div>
  );
}

// --- Sub-Components ---

function MediaCard({ item, onToggle, onDelete }: { item: MediaItem; onToggle: () => void; onDelete: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-white border border-neutral-200 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="relative w-full h-full bg-neutral-100">
        <Image
          src={item.url || item.display_url || ''}
          alt="Media content"
          fill
          unoptimized
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-between gap-2 z-10">
        <button
          onClick={onToggle}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors backdrop-blur-md ${
            item.status === 'active'
              ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-white'
              : 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white'
          }`}
        >
          {item.status === 'active' ? (
            <>
              <Trash2 size={14} /> Deactivate
            </>
          ) : (
            <>
              <RefreshCcw size={14} /> Restore
            </>
          )}
        </button>

        {item.status === 'trash' && (
          <button
            onClick={onDelete}
            className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-600 hover:text-white transition-colors backdrop-blur-md"
            title="Delete Permanently"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-white/90 backdrop-blur-md text-xs font-medium text-neutral-900 border border-neutral-200 shadow-sm z-10">
        {new Date(item.createdAt).toLocaleDateString()}
      </div>
    </motion.div>
  );
}

function AddImageModal({ onClose, onSuccess, onError }: { onClose: () => void; onSuccess: (item: MediaItem) => void; onError: (msg: string) => void }) {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setIsSubmitting(true);
    try {
      // Post URL to DB
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, display_url: url, status: 'active' }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to add URL');
      onSuccess(json.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      onError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSubmitting(true);
    try {
      // Compress
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });

      // Upload to ImgBB
      const formData = new FormData();
      formData.append('image', compressedFile);
      const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });
      const imgbbData = await imgbbRes.json();

      if (!imgbbData.success) throw new Error('ImgBB Upload Failed');

      // Save to DB
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: imgbbData.data.url,
          display_url: imgbbData.data.display_url,
          delete_url: imgbbData.data.delete_url,
          status: 'active',
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      onSuccess(json.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      onError(err.message || 'Upload failed');
    } finally {
      setIsSubmitting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg bg-white border border-neutral-100 rounded-3xl p-0 shadow-2xl relative overflow-hidden flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-6 pb-2 flex justify-between items-center border-b border-neutral-100">
          <h2 className="text-xl font-bold text-neutral-900">Add New Media</h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full text-neutral-400 hover:text-neutral-900 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 pt-6 gap-4">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'upload' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <UploadCloud size={18} /> Upload File
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'url' ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <LinkIcon size={18} /> Direct Link
          </button>
        </div>

        {/* Body */}
        <div className="p-8">
          {activeTab === 'upload' ? (
            <div
              onClick={() => !isSubmitting && fileInputRef.current?.click()}
              className={`
                group cursor-pointer border-2 border-dashed rounded-2xl h-48 flex flex-col items-center justify-center gap-4 transition-all
                ${isSubmitting ? 'border-neutral-200 bg-neutral-50 cursor-wait' : 'border-neutral-300 hover:border-neutral-900 hover:bg-neutral-50'}
              `}
            >
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={isSubmitting} />

              {isSubmitting ? (
                <div className="flex flex-col items-center gap-3 text-neutral-400">
                  <Loader2 className="animate-spin w-8 h-8 text-neutral-900" />
                  <span className="text-sm font-medium">Compressing & Uploading...</span>
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-full bg-neutral-100 group-hover:bg-white group-hover:shadow-md transition-all">
                    <UploadCloud className="w-8 h-8 text-neutral-500 group-hover:text-neutral-900" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-neutral-700">Click to upload</p>
                    <p className="text-sm text-neutral-400 mt-1">SVG, PNG, JPG or GIF</p>
                  </div>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={handleUrlSubmit} className="flex flex-col gap-4">
              <div className="relative">
                <LinkIcon className="absolute top-1/2 -translate-y-1/2 left-4 text-neutral-400" size={18} />
                <input
                  type="url"
                  required
                  autoFocus
                  placeholder="https://example.com/image.jpg"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/20 transition-all placeholder:text-neutral-400"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !url}
                className="w-full py-4 rounded-xl font-bold bg-neutral-900 text-white shadow-lg shadow-neutral-900/20 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : 'Import Image'}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function NotificationToast({ type, message }: { type: 'success' | 'error'; message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: 20, x: '-50%' }}
      className={`fixed bottom-8 left-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-full shadow-xl backdrop-blur-md border ${
        type === 'success' ? 'bg-emerald-50/90 border-emerald-200 text-emerald-700' : 'bg-red-50/90 border-red-200 text-red-700'
      }`}
    >
      {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      <span className="font-medium text-sm">{message}</span>
    </motion.div>
  );
}
