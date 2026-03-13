look at the uploadthings/page.tsx 
```
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, ImageIcon, FileText, FileCode, Music, Database, LayoutGrid, VideoIcon } from 'lucide-react';

import { CustomLink } from '@/components/common/LinkButton';

import ImageUploadManagerSingle from '../uploadthings/components/ImageUploadMangerSingle';
import ImageUploadManager from '../uploadthings/components/ImageUploadManger';
import VideoUploadMangerSingle from '../uploadthings/components/VideoUploadMangerSingle';
import VideoUploadManger from '../uploadthings/components/VideoUploadManger';
import PdfUploadManagerSingle from '../uploadthings/components/PdfUploadManagerSingle';
import PdfUploadManager from '../uploadthings/components/PdfUploadManager';
import DocxUploadManagerSingle from '../uploadthings/components/DocxUploadManagerSingle';
import DocxUploadManager from '../uploadthings/components/DocxUploadManager';
import AudioUploadManagerSingle from '../uploadthings/components/AudioUploadManagerSingle';
import AudioUploadManager from '../uploadthings/components/AudioUploadManager';
import { Button } from '@/components/ui/button';

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

  const [singleImage, setSingleImage] = useState<{ url: string; name: string }>({ url: '', name: '' });
  const [multipleImages, setMultipleImages] = useState<{ url: string; name: string }[]>([]);

  const [singleVideo, setSingleVideo] = useState<{ url: string; name: string }>({ url: '', name: '' });
  const [multipleVideos, setMultipleVideos] = useState<{ url: string; name: string }[]>([]);

  const [singlePdf, setSinglePdf] = useState<{ url: string; name: string }>({ url: '', name: '' });
  const [multiplePdfs, setMultiplePdfs] = useState<{ url: string; name: string }[]>([]);

  const [singleDocx, setSingleDocx] = useState<{ url: string; name: string }>({ url: '', name: '' });
  const [multipleDocxs, setMultipleDocxs] = useState<{ url: string; name: string }[]>([]);

  const [singleAudio, setSingleAudio] = useState<{ url: string; name: string }>({ url: '', name: '' });
  const [multipleAudios, setMultipleAudios] = useState<{ url: string; name: string }[]>([]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[400px] md:w-[800px] h-[800px] bg-indigo-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] md:w-[800px] h-[800px] bg-blue-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto relative z-10 px-4 py-8 md:py-12">
        <header className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 shadow-2xl flex flex-col lg:flex-row justify-between items-center mb-12 gap-6 transition-all hover:bg-white/15">
          <nav className="w-full lg:w-auto">
            <div className="flex items-center gap-2 p-1 bg-transparent h-12 rounded-lg flex-wrap">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <Button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      px-4 rounded-md flex items-center gap-2 transition-all duration-300 border backdrop-blur-xl whitespace-nowrap
                      ${
                        isActive
                          ? 'opacity-100 bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-white/50 shadow-xl shadow-purple-500/30 scale-[1.02] text-white'
                          : 'opacity-40 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-white/30 text-white hover:opacity-100 hover:border-white/50'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-bold text-xs uppercase tracking-tight">{tab.label}</span>
                  </Button>
                );
              })}
            </div>
          </nav>
          <div className="mt-8 md:mt-0 flex items-end justify-end gap-2">
            <CustomLink href="/dashboard/media/example/imagebb" variant="outlineGlassy">
              <ImageIcon size={16} className="" />
              Image BB
            </CustomLink>
            <CustomLink href="/dashboard/media/example/yt-videos" variant="outlineGlassy">
              <VideoIcon size={16} className="" />
              YT Video
            </CustomLink>
            <CustomLink href="/dashboard/media" variant="outlineGlassy">
              <LayoutGrid size={16} className="" />
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

              <div className="backdrop-blur-xl bg-white/10 border border-white/60 p-8 rounded-xl shadow-2xl transition-all duration-500 hover:bg-white/15 min-h-[380px]">
                {activeTab === 'image' && (
                  <ImageUploadManagerSingle
                    value={singleImage}
                    onChange={val => {
                      setSingleImage(val);
                    }}
                  />
                )}
                {activeTab === 'video' && (
                  <VideoUploadMangerSingle
                    value={singleVideo}
                    onChange={val => {
                      setSingleVideo(val);
                    }}
                  />
                )}
                {activeTab === 'pdf' && (
                  <PdfUploadManagerSingle
                    value={singlePdf}
                    onChange={val => {
                      setSinglePdf(val);
                    }}
                  />
                )}
                {activeTab === 'docx' && (
                  <DocxUploadManagerSingle
                    value={singleDocx}
                    onChange={val => {
                      setSingleDocx(val);
                    }}
                  />
                )}
                {activeTab === 'audio' && (
                  <AudioUploadManagerSingle
                    value={singleAudio}
                    onChange={val => {
                      setSingleAudio(val);
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

              <div className="backdrop-blur-xl bg-white/10 border border-white/60 p-8 rounded-xl shadow-2xl transition-all duration-500 hover:bg-white/15 min-h-[380px]">
                {activeTab === 'image' && (
                  <ImageUploadManager
                    value={multipleImages}
                    onChange={val => {
                      setMultipleImages([...val]);
                    }}
                  />
                )}
                {activeTab === 'video' && (
                  <VideoUploadManger
                    value={multipleVideos}
                    onChange={val => {
                      setMultipleVideos(val);
                    }}
                  />
                )}
                {activeTab === 'pdf' && (
                  <PdfUploadManager
                    value={multiplePdfs}
                    onChange={val => {
                      setMultiplePdfs(val);
                    }}
                  />
                )}
                {activeTab === 'docx' && (
                  <DocxUploadManager
                    value={multipleDocxs}
                    onChange={val => {
                      setMultipleDocxs(val);
                    }}
                  />
                )}
                {activeTab === 'audio' && (
                  <AudioUploadManager
                    value={multipleAudios}
                    onChange={val => {
                      setMultipleAudios(val);
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

```

and here is youtube/page.tsx 
```
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  Database,
  LayoutGrid,
  Upload,
  VideoIcon,
  Youtube,
  Plus,
  X,
  Search,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Film,
  PlayCircle,
  Code,
} from 'lucide-react';

import { CustomLink } from '@/components/common/LinkButton';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useGetMediasQuery } from '@/redux/features/media/mediaSlice';

interface VideoAsset {
  url: string;
  name: string;
}

const InternalVideoVault = ({ onVideoSelect, selectedVideos }: { onVideoSelect: (video: VideoAsset) => void; selectedVideos: string[] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [iframeCode, setIframeCode] = useState('');

  const mockVideos = [
    { name: 'Cinematic Nature', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { name: 'Product Showcase', url: 'https://www.youtube.com/embed/active-v2' },
    { name: 'Tutorial Series', url: 'https://www.youtube.com/embed/active-v3' },
  ];

  const handleImportYT = () => {
    if (!iframeCode) return;
    const match = iframeCode.match(/src="([^"]+)"/);
    const url = match ? match[1] : iframeCode;

    console.log('Processed URL for Database:', url);

    onVideoSelect({
      url: url,
      name: `Imported Asset ${new Date().toLocaleTimeString()}`,
    });
    setIframeCode('');
  };

  return (
    <div className="flex flex-col h-[90vh] md:h-[80vh] backdrop-blur-[150px] rounded-sm overflow-hidden bg-white/2 shadow-2xl">
      <DialogHeader className="p-6 border-b border-white/5 bg-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 -mt-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="SEARCH VIDEO VAULT..."
              className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-12 pr-4 text-[11px] font-black uppercase tracking-[0.2em] text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-white/20"
            />
          </div>
          <div className="hidden">
            <DialogTitle> </DialogTitle>
            <DialogDescription> </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="flex-1 relative overflow-hidden">
        <ScrollArea className="h-full w-full p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {mockVideos.map((video, idx) => {
              const isSelected = selectedVideos.includes(video.url);
              return (
                <motion.div
                  key={video.url}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => onVideoSelect(video)}
                  className="flex flex-col gap-3 group cursor-pointer"
                >
                  <div
                    className={`relative aspect-video rounded-sm overflow-hidden border transition-all duration-500 ${isSelected ? 'border-indigo-500 scale-[0.98]' : 'border-white/20 hover:scale-[1.02]'}`}
                  >
                    <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                      <PlayCircle className="w-10 h-10 text-white/20 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    {isSelected && (
                      <div className="absolute inset-0 bg-indigo-600/20 backdrop-blur-[3px] flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="px-1">
                    <p className="text-xs font-bold text-white/60 group-hover:text-white truncate uppercase tracking-tighter">{video.name}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      <div className="p-6 border-t border-white/5 bg-white/5 space-y-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Code className="w-3.5 h-3.5 text-indigo-400" />
            <label className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Import iFrame Embed Code</label>
          </div>
          <div className="space-y-3">
            <textarea
              value={iframeCode}
              onChange={e => setIframeCode(e.target.value)}
              placeholder='<iframe width="560" height="315" src="..." ...></iframe>'
              className="w-full bg-black/40 border border-white/10 rounded-sm p-3 text-[11px] font-mono text-indigo-300 focus:outline-none focus:border-indigo-500/50 min-h-[80px] transition-all resize-none"
            />
            <Button
              variant="outlineGlassy"
              size="sm"
              onClick={handleImportYT}
              className="w-full md:w-auto bg-indigo-500/10 border-indigo-500/30 hover:bg-indigo-500/20"
            >
              <Youtube className="w-3.5 h-3.5 mr-2" />
              PROCESS & IMPORT ASSET
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Button variant="outlineGlassy" size="sm" className="px-2 h-8">
              <ChevronLeft size={16} />
            </Button>
            <div className="bg-white/5 px-3 py-1 rounded-sm border border-white/10 text-[10px]">1 / 1</div>
            <Button variant="outlineGlassy" size="sm" className="px-2 h-8">
              <ChevronRight size={16} />
            </Button>
          </div>
          <p className="text-[10px] text-white/40 uppercase font-bold">Vault Status: Active</p>
        </div>
      </div>
    </div>
  );
};

export default function VideoManagementPage() {
  const [singleVideo, setSingleVideo] = useState<VideoAsset | null>(null);
  const [multipleVideos, setMultipleVideos] = useState<VideoAsset[]>([]);
  const [isSingleDialogOpen, setIsSingleDialogOpen] = useState(false);
  const [isMultiDialogOpen, setIsMultiDialogOpen] = useState(false);

  const toggleMultiVideo = (video: VideoAsset) => {
    setMultipleVideos(prev => (prev.some(v => v.url === video.url) ? prev.filter(v => v.url !== video.url) : [...prev, video]));
  };

  interface MediaItem {
    _id: string;
    name: string;
    url: string;
    status: string;
    contentType: string;
    createdAt: string;
    updatedAt: string;
  }

  interface MediaResponse {
    data: MediaItem[];
    total: number;
    page: number;
    limit: number;
  }
  const {
    data: response,
    isLoading: isFetching,
    isFetching: isRefetching,
  } = useGetMediasQuery({
    page: 1,
    limit: 10,
    q: '',
    contentType: 'all',
    status: 'active',
  }) as { data: MediaResponse | undefined; isLoading: boolean; isFetching: boolean };
  console.log(' response : ', response);
  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto relative z-10 px-4 py-8 md:py-12">
        <header className="backdrop-blur-xl bg-white/10 border border-white/40 rounded-xl p-4 shadow-2xl flex flex-col lg:flex-row justify-between items-center mb-12 gap-6">
          <nav className="w-full lg:w-auto">
            <Button variant="outlineGlassy" size="sm" className="opacity-100 scale-[1.02]">
              <VideoIcon className="w-4 h-4" />
              <span className="font-bold text-xs uppercase tracking-tight">YT Video Pipeline</span>
            </Button>
          </nav>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <CustomLink href="/dashboard/media/example/uploadthings" variant="outlineGlassy">
              <Upload size={16} /> Uploadthings
            </CustomLink>
            <CustomLink href="/dashboard/media/example/imagebb" variant="outlineGlassy">
              <Database size={16} /> Image BB
            </CustomLink>
            <CustomLink href="/dashboard/media" variant="outlineGlassy">
              <LayoutGrid size={16} /> Media
            </CustomLink>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <Video className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-white via-white/80 to-white/30 bg-clip-text text-transparent italic tracking-tighter">
                Single Asset Deployment
              </h3>
            </div>

            <div className="backdrop-blur-xl bg-white/10 border border-white/60 p-8 rounded-xl shadow-2xl min-h-[440px]">
              <div className="space-y-4 w-full h-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Film className="w-3.5 h-3.5 text-white/60" />
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">Main Feature</label>
                  </div>
                  {singleVideo && (
                    <Button variant="outlineFire" size="sm" onClick={() => setSingleVideo(null)}>
                      <X className="w-3.5 h-3.5" /> Release Asset
                    </Button>
                  )}
                </div>

                <Dialog open={isSingleDialogOpen} onOpenChange={setIsSingleDialogOpen}>
                  <DialogTrigger asChild>
                    <div className="group relative w-full aspect-video rounded-sm border border-white/50 bg-white/2 hover:border-indigo-500/30 transition-all duration-700 cursor-pointer overflow-hidden flex flex-col items-center justify-center">
                      {singleVideo ? (
                        <div className="w-full h-full relative">
                          <iframe src={singleVideo.url} className="w-full h-full pointer-events-none" frameBorder="0" />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex flex-col items-center justify-center">
                            <PlayCircle className="w-12 h-12 text-indigo-500" />
                            <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-white">{singleVideo.name}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center space-y-4">
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 5, repeat: Infinity }}
                            className="w-16 h-16 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center mx-auto"
                          >
                            <VideoIcon className="w-8 h-8 text-white/10" />
                          </motion.div>
                          <div>
                            <p className="text-[11px] font-black uppercase tracking-widest text-white/90">Null Selection</p>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">Initialize from Vault</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </DialogTrigger>
                  <DialogContent className="bg-transparent p-0 shadow-none border-white/50 border rounded-sm max-w-5xl w-[95vw]">
                    <InternalVideoVault
                      selectedVideos={singleVideo ? [singleVideo.url] : []}
                      onVideoSelect={v => {
                        setSingleVideo(v);
                        setIsSingleDialogOpen(false);
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <LayoutGrid className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-white via-white/80 to-white/30 bg-clip-text text-transparent italic tracking-tighter">
                Batch Collection
              </h3>
            </div>

            <div className="backdrop-blur-xl bg-white/10 border border-white/60 p-8 rounded-xl shadow-2xl min-h-[440px]">
              <div className="space-y-4 w-full h-full">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <LayoutGrid className="w-3.5 h-3.5 text-white/60" />
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">Queue</label>
                    </div>
                    <span className="text-[8px] font-bold text-white/40 tracking-widest">{multipleVideos.length} NODES LINKED</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {multipleVideos.length > 0 && (
                      <Button variant="outlineFire" size="sm" onClick={() => setMultipleVideos([])}>
                        <X className="w-3.5 h-3.5" /> Purge Queue
                      </Button>
                    )}
                    <Dialog open={isMultiDialogOpen} onOpenChange={setIsMultiDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outlineGlassy" size="sm">
                          <Plus className="w-3.5 h-3.5" /> ADD NODES
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-transparent p-0 shadow-none border-white/50 border rounded-sm max-w-5xl w-[95vw]">
                        <InternalVideoVault selectedVideos={multipleVideos.map(v => v.url)} onVideoSelect={toggleMultiVideo} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <ScrollArea className="h-[300px] w-full border border-white/20 rounded-sm bg-black/20 p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <AnimatePresence mode="popLayout">
                      {multipleVideos.length > 0 ? (
                        multipleVideos.map((video, idx) => (
                          <motion.div
                            key={video.url + idx}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative aspect-video bg-white/5 border border-white/10 rounded-sm flex items-center justify-center group overflow-hidden"
                          >
                            <iframe src={video.url} className="w-full h-full pointer-events-none" frameBorder="0" />
                            <div className="absolute inset-0 bg-black/60 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                              <PlayCircle className="w-6 h-6 text-white/40" />
                              <Button
                                variant="outlineFire"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => setMultipleVideos(prev => prev.filter(v => v.url !== video.url))}
                              >
                                <X size={14} />
                              </Button>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 backdrop-blur-md border-t border-white/5">
                              <p className="text-[9px] font-black truncate text-white/90 uppercase tracking-widest">{video.name}</p>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4 opacity-20">
                          <Film size={48} className="animate-pulse" />
                          <div className="text-center">
                            <p className="text-[10px] font-black tracking-[0.3em] uppercase">Pipeline Empty</p>
                            <p className="text-[8px] font-bold uppercase mt-1">Select assets to begin</p>
                          </div>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

```

Now your task is update youtube/page.tsx with the following instructions.
1. Please use YTVideoUploadManager.tsx from "./components/YTVideoUploadManager"
2. Please use YTVideoUploadManagerSingle.tsx from "./components/YTVideoUploadManagerSingle"
3. Only use those two items.
4. Do not use other style or color-combinations.
