'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, ImageIcon, FileText, FileCode, Music, Database, Ghost, LayoutGrid } from 'lucide-react';
import { toast } from 'react-toastify';

import ImageUploadManagerSingle from '@/components/dashboard-ui/media/ImageUploadManagerSingle';
import VideoUploadMangerSingle from '@/components/dashboard-ui/media/VideoUploadMangerSingle';
import VideoUploadManger from '@/components/dashboard-ui/media/VideoUploadManger';
import ImageUploadManager from '@/components/dashboard-ui/media/ImageUploadManager';

import { CustomLink } from '@/components/dashboard-ui/LinkButton';

type TabType = 'image' | 'video' | 'pdf' | 'docx' | 'audio';

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ElementType;
  color: string;
}

const tabs: TabConfig[] = [
  { id: 'image', label: 'Image', icon: ImageIcon, color: 'from-blue-500/20 to-indigo-500/20' },
  { id: 'video', label: 'Video', icon: Video, color: 'from-purple-500/20 to-pink-500/20' },
  { id: 'pdf', label: 'PDF', icon: FileText, color: 'from-red-500/20 to-orange-500/20' },
  { id: 'docx', label: 'DOCX', icon: FileCode, color: 'from-sky-500/20 to-cyan-500/20' },
  { id: 'audio', label: 'Audio', icon: Music, color: 'from-emerald-500/20 to-teal-500/20' },
];

export default function AssetManagementPage() {
  const [activeTab, setActiveTab] = useState<TabType>('image');
  const [singleImage, setSingleImage] = useState<string>('');
  const [multipleImages, setMultipleImages] = useState<string[]>([]);
  const [singleVideo, setSingleVideo] = useState<string>('');
  const [multipleVideos, setMultipleVideos] = useState<string[]>([]);

  const handleSingleImageUpdate = useCallback(async (newUrl: string) => {
    setSingleImage(newUrl);
    if (newUrl) {
      toast.success('Vault Updated: Single Image');
    }
  }, []);

  const handleMultipleImagesUpdate = useCallback(async (newUrls: string[]) => {
    setMultipleImages(newUrls);
    toast.success('Vault Synced: Image Gallery');
  }, []);

  const handleSingleVideoUpdate = useCallback(async (newUrl: string) => {
    setSingleVideo(newUrl);
    if (newUrl) {
      toast.success('Vault Updated: Primary Video');
    }
  }, []);

  const handleMultipleVideosUpdate = useCallback(async (newUrls: string[]) => {
    setMultipleVideos(newUrls);
    toast.success('Vault Synced: Video Collection');
  }, []);

  return (
    <div className="min-h-screen   relative overflow-hidden font-sans  ">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px]   blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px]   blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto relative z-10 px-4 py-8 md:py-12">
        <div className="w-full flex items-center justify-between mb-12">
          <nav className="">
            <div className="flex flex-wrap items-center gap-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                    relative flex items-center gap-2 px-5 py-2.5 rounded-sm transition-all duration-300 border
                    ${
                      isActive
                        ? 'bg-green-400/10 border-white text-white scale-105'
                        : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:border-white/30'
                    }
                  `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-bold tracking-tight text-[11px] uppercase">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
          <CustomLink href="/dashboard/media" variant="outlineGlassy" size="sm">
            Media
          </CustomLink>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <section className="space-y-6">
              <div className="flex items-center gap-3 px-1">
                <Database className="w-5 h-5 text-indigo-400/60" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Single Assect</h3>
              </div>

              <div className="bg-slate-900/40 backdrop-blur-[120px] bg-opacity-30 border border-gray-100/10 p-8 rounded-2xl hover:border-indigo-500/50 transition-all duration-700 shadow-2xl">
                {activeTab === 'image' && <ImageUploadManagerSingle value={singleImage} onChange={handleSingleImageUpdate} />}
                {activeTab === 'video' && <VideoUploadMangerSingle value={singleVideo} onChange={handleSingleVideoUpdate} />}
                {activeTab !== 'image' && activeTab !== 'video' && <Placeholder type={activeTab} mode="Single" />}
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3 px-1">
                <LayoutGrid className="w-5 h-5 text-indigo-400/60" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Multiple Assect</h3>
              </div>

              <div className="bg-slate-900/40 backdrop-blur-[120px] bg-opacity-30 border border-gray-100/10 p-8 rounded-2xl hover:border-indigo-500/50 transition-all duration-700 shadow-2xl">
                {activeTab === 'image' && <ImageUploadManager value={multipleImages} onChange={handleMultipleImagesUpdate} />}
                {activeTab === 'video' && <VideoUploadManger value={multipleVideos} onChange={handleMultipleVideosUpdate} />}
                {activeTab !== 'image' && activeTab !== 'video' && <Placeholder type={activeTab} mode="Batch" />}
              </div>
            </section>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const Placeholder = ({ type, mode }: { type: string; mode: string }) => (
  <div className="flex flex-col items-center justify-center text-center p-12 min-h-[300px]">
    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
      <Ghost className="w-16 h-16 text-white/5 mb-6" />
    </motion.div>
    <h4 className="text-xl font-black uppercase tracking-widest italic text-white/20">
      {mode} {type}
    </h4>
    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/10 mt-2">Calibration required for this signal type</p>
    <div className="mt-8 px-6 py-2 rounded-full border border-white/5 bg-white/[0.02] text-[9px] font-black uppercase tracking-widest text-white/20">
      Awaiting Deployment
    </div>
  </div>
);
