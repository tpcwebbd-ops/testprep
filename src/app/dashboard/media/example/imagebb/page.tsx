'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon, Database, LayoutGrid, Upload } from 'lucide-react';
import { toast } from 'react-toastify';

import ImageUploadManagerSingle from '@/components/dashboard-ui/media/imagebb/ImageUploadManagerSingle';
import ImageUploadManager from '@/components/dashboard-ui/media/imagebb/ImageUploadManager';

import { CustomLink } from '@/components/dashboard-ui/LinkButton';
import { Button } from '@/components/ui/button';

type TabType = 'image';

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ElementType;
}

const tabs: TabConfig[] = [{ id: 'image', label: 'Image', icon: ImageIcon }];

export default function AssetManagementPage() {
  const [activeTab, setActiveTab] = useState<TabType>('image');

  const [singleImage, setSingleImage] = useState<{ url: string; name: string }>({ url: '', name: '' });
  const [multipleImages, setMultipleImages] = useState<string[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUpdate = useCallback((type: string, isMultiple: boolean, url: string | string[]) => {
    toast.success(`Vault Synced: ${type.toUpperCase()} ${isMultiple ? 'Collection' : 'Node'}`);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto relative z-10 px-4 py-8 md:py-12">
        <header className="backdrop-blur-xl bg-white/10 border border-white/40 rounded-xl p-4 shadow-2xl flex flex-col lg:flex-row justify-between items-center mb-12 gap-6 transition-all ">
          <nav className="w-full lg:w-auto overflow-x-auto">
            <div className="flex items-center gap-2 p-1 bg-transparent h-12 rounded-lg">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <Button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    variant="outlineGlassy"
                    size="sm"
                    className={`
                      ${isActive ? 'opacity-100  scale-[1.02] ' : 'opacity-40 hover:opacity-100 hover:border-white/50'}
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-bold text-xs uppercase tracking-tight">{tab.label}</span>
                  </Button>
                );
              })}
            </div>
          </nav>
          <div className=" flex items-end justify-end gap-2">
            <CustomLink href="/dashboard/media/example/uploadthings" variant="outlineGlassy">
              <Upload size={16} className="" />
              Uploadthings
            </CustomLink>
            <CustomLink href="/dashboard/media" variant="outlineGlassy">
              <LayoutGrid size={16} className="mr-2" />
              MEDIA
            </CustomLink>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <section className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <Database className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-white via-white/80 to-white/30 bg-clip-text text-transparent italic tracking-tighter">
                    Single Asset
                  </h3>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/10 border border-white/60 p-8 rounded-xl shadow-2xl transition-all duration-500 hover:bg-white/15 h-[380px]">
                {activeTab === 'image' && (
                  <ImageUploadManagerSingle
                    value={singleImage}
                    onChange={val => {
                      setSingleImage({ url: val.url, name: val.name });
                      handleUpdate('image', false, val.url);
                    }}
                  />
                )}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <LayoutGrid className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-white via-white/80 to-white/30 bg-clip-text text-transparent italic tracking-tighter">
                    Multiple Asset
                  </h3>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/10 border border-white/60 p-8 rounded-xl shadow-2xl transition-all duration-500 hover:bg-white/15 h-[380px]">
                {activeTab === 'image' && (
                  <ImageUploadManager
                    value={multipleImages}
                    onChange={val => {
                      setMultipleImages(val);
                      handleUpdate('image', true, val);
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
