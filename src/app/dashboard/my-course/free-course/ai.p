

and here is media/page.tsx 
```
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

```
Now compy color-combination and style form this page.tsx
Now Your taks is generate a page.tsx with the design, color-combination and implement those features as my following instructions. 
System / Instruction Prompt:
You are an expert Frontend Developer specializing in React, Next.js (App Router), Tailwind CSS, and Framer Motion.
Your task is to build a visually stunning, highly interactive "Gamified Learning Quest" page component. The page acts as a "Campaign Mode" map for an online course, where users progress through daily modules represented as nodes on a winding, glowing path.
Strict Technical Requirements:
Use Next.js (App router) with the 'use client' directive.
Use TypeScript strictly. Define comprehensive interfaces for all data structures (Course, CourseContentItem, ParsedContent, Questions, etc.). Do not leave any any types that could cause build errors.
Use Tailwind CSS for styling.
Use Framer Motion extensively for all animations (page transitions, scroll-linked path drawing, hover effects, modal pops, and a mastery celebration particle effect).
Use Lucide React for icons.
Import useGetCoursesQuery from @/redux/features/course/courseSlice to fetch the course data.
DO NOT include a single comment in the generated codebase.
Ensure the layout is flawlessly responsive across mobile, tablet, and desktop. On desktop, timeline items alternate left and right. On mobile, they align to the left.
Visual & UI Theme:
Background: Deep dark space theme (bg-slate-950) with subtle backdrop blurs, starry texture overlays, and large, blurred glowing orbs (mix-blend-screen).
Gamified Elements: Badges, progress bars, and high-contrast gradients.
States:
Locked: Slate/grey colors, disabled states, Lock icon.
Current: Pulsing blue/indigo neon effects, Zap icon.
Completed: Emerald/teal gradients, checkmarks, Award icon.
Glassmorphism: Modals and cards should use semi-transparent backgrounds with backdrop-blur and subtle borders.
Core Features & Components to Build:
Data Fetching & Parsing:
Fetch data using useGetCoursesQuery({ page: 1, limit: 1000, q: '' }). Show a spinning loader while loading.
Extract the course category from the URL using usePathname().split('/')[3]. Filter the fetched courses by matching the kebab-cased category name to the course name.
Sort courses chronologically by extracting the day number from courseDay (e.g., "Day 1").
The Winding Path (Timeline):
Calculate node states: A node is "completed" if all its tasks are done. The first uncompleted node is "current". All subsequent nodes are "locked".
Use an SVG <path> and framer-motion's useScroll and useSpring to create a winding timeline line that fills with a neon gradient as the user scrolls down the page.
Alternate the layout of timeline cards (Left 30% / Right 70% then Right 70% / Left 30%) on desktop.
Timeline Cards:
Display the Day number, Course Title, Status, and total assignments.
When hovering over an unlocked card, slightly scale it up and lift it on the Y-axis.
Clicking a "current" or "completed" card opens the ContentModal.
Course Content Modal:
A large centered glassmorphic modal with an animated progress bar at the top indicating the completion percentage of the selected day's tasks.
Display a list of tasks. Tasks can be Videos, Quizzes, Text, or Documents.
Clicking a task opens the ActiveTaskOverlay.
Include a "Complete Today's Module" button at the bottom, which is only enabled when all tasks in the modal are marked as completed.
Active Task Overlay (Task Players):
Renders over the task list.
Video Player: Should detect if the URL is a YouTube link and render an iframe, otherwise render a native <video>. Include a custom "Play" overlay cover. Contains a "Complete Video Task" button.
Quiz Player: Renders multiple-choice questions one by one with an interactive progress bar. Validate answers (green for correct, red for incorrect). Show a score/results screen at the end with a "Complete Assignment" button.
Generic Viewers: For text and documents, show an icon and a description with a "Complete Task" button.
Mastery Celebration:
If the user completes the final available module, reveal a massive "Complete Course" button at the bottom of the timeline.
Clicking it triggers a spectacular, fullscreen AnimatePresence celebration with a spinning glowing backdrop, floating particle arrays, and a giant Trophy icon stating "Mastery Achieved".
Data Interfaces (Reference):
Ensure your code parses unstructured backend content safely into distinct VIDEO, QUIZ, TEXT, and DOCUMENT types based on string matching the content's type field, mapping questions and URLs accordingly.