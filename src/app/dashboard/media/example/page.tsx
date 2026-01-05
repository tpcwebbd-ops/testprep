'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, ImageIcon, FileText, FileCode, Music, Database, LayoutGrid } from 'lucide-react';
import { toast } from 'react-toastify';

import ImageUploadManagerSingle from '@/components/dashboard-ui/ImageUploadManagerSingle';
import VideoUploadMangerSingle from '@/components/dashboard-ui/VideoUploadMangerSingle';
import VideoUploadManger from '@/components/dashboard-ui/VideoUploadManger';
import ImageUploadManager from '@/components/dashboard-ui/ImageUploadManager';

import PdfUploadManagerSingle from '@/components/dashboard-ui/PdfUploadManagerSingle';
import PdfUploadManager from '@/components/dashboard-ui/PdfUploadManager';
import DocxUploadManagerSingle from '@/components/dashboard-ui/DocxUploadManagerSingle';
import DocxUploadManager from '@/components/dashboard-ui/DocxUploadManager';
import AudioUploadManagerSingle from '@/components/dashboard-ui/AudioUploadManagerSingle';
import AudioUploadManager from '@/components/dashboard-ui/AudioUploadManager';

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
  const [singlePdf, setSinglePdf] = useState<string>('');
  const [multiplePdfs, setMultiplePdfs] = useState<string[]>([]);
  const [singleDocx, setSingleDocx] = useState<string>('');
  const [multipleDocx, setMultipleDocx] = useState<string[]>([]);
  const [singleAudio, setSingleAudio] = useState<string>('');
  const [multipleAudios, setMultipleAudios] = useState<string[]>([]);

  const handleSingleUpdate = useCallback(
    (setter: React.Dispatch<React.SetStateAction<string>>, label: string) => (newUrl: string) => {
      setter(newUrl);
      if (newUrl) toast.success(`Vault Updated: ${label}`);
    },
    [],
  );

  const handleBatchUpdate = useCallback(
    (setter: React.Dispatch<React.SetStateAction<string[]>>, label: string) => (newUrls: string[]) => {
      setter(newUrls);
      toast.success(`Vault Synced: ${label}`);
    },
    [],
  );

  return (
    <div className="min-h-screen relative overflow-hidden font-sans bg-black/5">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto relative z-10 px-4 py-8 md:py-12">
        <div className="w-full flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <nav>
            <div className="flex flex-wrap items-center gap-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                    relative flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 border
                    ${
                      isActive
                        ? 'bg-white/10 border-white/20 text-white scale-105 shadow-[0_0_20px_rgba(255,255,255,0.05)]'
                        : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/10'
                    }
                  `}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : ''}`} />
                    <span className="font-black tracking-widest text-[10px] uppercase">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
          <CustomLink href="/dashboard/media" variant="outlineGlassy" size="sm">
            Access Master Media
          </CustomLink>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <section className="space-y-6">
              <div className="flex items-center gap-3 px-1">
                <Database className="w-4 h-4 text-indigo-400/60" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Atomic Asset Node</h3>
              </div>

              <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-8 rounded-[2.5rem] hover:border-white/10 transition-all duration-700 shadow-2xl">
                {activeTab === 'image' && <ImageUploadManagerSingle value={singleImage} onChange={handleSingleUpdate(setSingleImage, 'Single Image')} />}
                {activeTab === 'video' && <VideoUploadMangerSingle value={singleVideo} onChange={handleSingleUpdate(setSingleVideo, 'Primary Video')} />}
                {activeTab === 'pdf' && <PdfUploadManagerSingle value={singlePdf} onChange={handleSingleUpdate(setSinglePdf, 'PDF Document')} />}
                {activeTab === 'docx' && <DocxUploadManagerSingle value={singleDocx} onChange={handleSingleUpdate(setSingleDocx, 'Word Document')} />}
                {activeTab === 'audio' && <AudioUploadManagerSingle value={singleAudio} onChange={handleSingleUpdate(setSingleAudio, 'Audio Stream')} />}
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3 px-1">
                <LayoutGrid className="w-4 h-4 text-indigo-400/60" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Cluster Asset Grid</h3>
              </div>

              <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-8 rounded-[2.5rem] hover:border-white/10 transition-all duration-700 shadow-2xl">
                {activeTab === 'image' && <ImageUploadManager value={multipleImages} onChange={handleBatchUpdate(setMultipleImages, 'Image Gallery')} />}
                {activeTab === 'video' && <VideoUploadManger value={multipleVideos} onChange={handleBatchUpdate(setMultipleVideos, 'Video Collection')} />}
                {activeTab === 'pdf' && <PdfUploadManager value={multiplePdfs} onChange={handleBatchUpdate(setMultiplePdfs, 'PDF Library')} />}
                {activeTab === 'docx' && <DocxUploadManager value={multipleDocx} onChange={handleBatchUpdate(setMultipleDocx, 'DOCX Archive')} />}
                {activeTab === 'audio' && <AudioUploadManager value={multipleAudios} onChange={handleBatchUpdate(setMultipleAudios, 'Audio Bank')} />}
              </div>
            </section>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
