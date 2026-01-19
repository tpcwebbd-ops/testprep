'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, ImageIcon, FileText, FileCode, Music, Database, LayoutGrid } from 'lucide-react';
import { toast } from 'react-toastify';

import ImageUploadManagerSingle from '@/components/dashboard-ui/media/ImageUploadManagerSingle';
import VideoUploadMangerSingle from '@/components/dashboard-ui/media/VideoUploadMangerSingle';
import VideoUploadManger from '@/components/dashboard-ui/media/VideoUploadManger';
import ImageUploadManager from '@/components/dashboard-ui/media/ImageUploadManager';

import { CustomLink } from '@/components/dashboard-ui/LinkButton';
import PdfUploadManagerSingle from '@/components/dashboard-ui/PdfUploadManagerSingle';
import DocxUploadManagerSingle from '@/components/dashboard-ui/DocxUploadManagerSingle';
import AudioUploadManagerSingle from '@/components/dashboard-ui/AudioUploadManagerSingle';
import PdfUploadManager from '@/components/dashboard-ui/PdfUploadManager';
import DocxUploadManager from '@/components/dashboard-ui/DocxUploadManager';
import AudioUploadManager from '@/components/dashboard-ui/AudioUploadManager';

type TabType = 'image' | 'video' | 'pdf' | 'docx' | 'audio';

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ElementType;
}

const tabs: TabConfig[] = [
  { id: 'image', label: 'Image', icon: ImageIcon },
  { id: 'video', label: 'Video', icon: Video },
  { id: 'pdf', label: 'PDF', icon: FileText },
  { id: 'docx', label: 'DOCX', icon: FileCode },
  { id: 'audio', label: 'Audio', icon: Music },
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
  const [multipleDocxs, setMultipleDocxs] = useState<string[]>([]);

  const [singleAudio, setSingleAudio] = useState<string>('');
  const [multipleAudios, setMultipleAudios] = useState<string[]>([]);

  const handleUpdate = useCallback((type: string, isMultiple: boolean, value: string | string[]) => {
    toast.success(`Vault Synced: ${type.toUpperCase()} ${isMultiple ? 'Collection' : 'Node'}`);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black/5">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto relative z-10 px-4 py-8 md:py-12">
        <div className="w-full flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <nav className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <div className="flex items-center gap-2 whitespace-nowrap">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                    relative flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-500 border
                    ${
                      isActive
                        ? 'bg-indigo-500/10 border-indigo-500/50 text-white shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                        : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/20'
                    }
                  `}
                  >
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-indigo-400' : 'text-white/20'}`} />
                    <span className="font-black tracking-widest text-[10px] uppercase">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
          <CustomLink href="/dashboard/media" variant="outlineGlassy" size="sm">
            MEDIA CENTER
          </CustomLink>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -20 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10"
          >
            <section className="space-y-6">
              <div className="flex items-center gap-4 px-2">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <Database className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Primary Asset</h3>
                  <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Single Entry Node</p>
                </div>
              </div>

              <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl transition-all duration-500 hover:border-white/10">
                {activeTab === 'image' && (
                  <ImageUploadManagerSingle
                    value={singleImage}
                    onChange={val => {
                      setSingleImage(val);
                      handleUpdate('image', false, val);
                    }}
                  />
                )}
                {activeTab === 'video' && (
                  <VideoUploadMangerSingle
                    value={singleVideo}
                    onChange={val => {
                      setSingleVideo(val);
                      handleUpdate('video', false, val);
                    }}
                  />
                )}
                {activeTab === 'pdf' && (
                  <PdfUploadManagerSingle
                    value={singlePdf}
                    onChange={val => {
                      setSinglePdf(val);
                      handleUpdate('pdf', false, val);
                    }}
                  />
                )}
                {activeTab === 'docx' && (
                  <DocxUploadManagerSingle
                    value={singleDocx}
                    onChange={val => {
                      setSingleDocx(val);
                      handleUpdate('docx', false, val);
                    }}
                  />
                )}
                {activeTab === 'audio' && (
                  <AudioUploadManagerSingle
                    value={singleAudio}
                    onChange={val => {
                      setSingleAudio(val);
                      handleUpdate('audio', false, val);
                    }}
                  />
                )}
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4 px-2">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <LayoutGrid className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Gallery Cluster</h3>
                  <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Multi-Asset Data Grid</p>
                </div>
              </div>

              <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl transition-all duration-500 hover:border-white/10">
                {activeTab === 'image' && (
                  <ImageUploadManager
                    value={multipleImages}
                    onChange={val => {
                      setMultipleImages(val);
                      handleUpdate('image', true, val);
                    }}
                  />
                )}
                {activeTab === 'video' && (
                  <VideoUploadManger
                    value={multipleVideos}
                    onChange={val => {
                      setMultipleVideos(val);
                      handleUpdate('video', true, val);
                    }}
                  />
                )}
                {activeTab === 'pdf' && (
                  <PdfUploadManager
                    value={multiplePdfs}
                    onChange={val => {
                      setMultiplePdfs(val);
                      handleUpdate('pdf', true, val);
                    }}
                  />
                )}
                {activeTab === 'docx' && (
                  <DocxUploadManager
                    value={multipleDocxs}
                    onChange={val => {
                      setMultipleDocxs(val);
                      handleUpdate('docx', true, val);
                    }}
                  />
                )}
                {activeTab === 'audio' && (
                  <AudioUploadManager
                    value={multipleAudios}
                    onChange={val => {
                      setMultipleAudios(val);
                      handleUpdate('audio', true, val);
                    }}
                  />
                )}
              </div>
            </section>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
