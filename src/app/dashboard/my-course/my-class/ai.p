Look at the my-class/page.tsx 
```
/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, April, 2026
|-----------------------------------------
*/

'use client';

import { useState, Suspense, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Clock,
  ArrowLeft,
  FileText,
  CheckCircle2,
  Youtube,
  Video as VideoIcon,
  HelpCircle,
  ClipboardList,
  Trophy,
  PlayCircle,
  LayoutGrid,
  List,
  X,
  Lock,
  AlertCircle,
  Gamepad2,
  CalendarDays,
  Target,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useGetCourseByIdQuery } from '@/redux/features/courses/coursesSlice';

type ResourceType = 'youtube' | 'video' | 'text' | 'mcq' | 'assignment';

interface IResource {
  id: string;
  type: ResourceType;
  title: string;
  url?: string;
  content?: string;
  mcqData?: {
    question: string;
    options: string[];
    correctAnswerIndex: number;
  };
}

interface IClass {
  id: string;
  title: string;
  description: string;
  duration: string;
  isActive: boolean;
  resources: IResource[];
}

type ClassStatus = 'completed' | 'missed' | 'active' | 'locked';

interface ProcessedClass extends IClass {
  status: ClassStatus;
  day: number;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function StudentCourseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get('courseId');

  const { data: courseResponse, isLoading: isCourseLoading } = useGetCourseByIdQuery(courseId, {
    skip: !courseId,
  });

  const courseData = courseResponse?.data;
  const [classes, setClasses] = useState<ProcessedClass[]>([]);
  const [isGameMode, setIsGameMode] = useState(true);
  const [gridColumns, setGridColumns] = useState<1 | 2 | 3>(3);
  const [selectedClass, setSelectedClass] = useState<ProcessedClass | null>(null);
  const [activeResourceTab, setActiveResourceTab] = useState<string | null>(null);

  useEffect(() => {
    if (courseData?.lectureData) {
      try {
        let parsedData = courseData.lectureData;
        if (typeof parsedData === 'string') parsedData = JSON.parse(parsedData);
        else if (typeof parsedData === 'object' && !Array.isArray(parsedData) && parsedData !== null) parsedData = Object.values(parsedData);

        if (Array.isArray(parsedData)) {
          const processedClasses: ProcessedClass[] = parsedData.map((cls: Partial<IClass>, index: number) => {
            let status: ClassStatus = 'locked';
            if (index === 0) status = 'completed';
            else if (index === 1) status = 'missed';
            else if (index === 2) status = 'active';

            return {
              id: cls?.id || Math.random().toString(36).substring(2, 9),
              title: cls?.title || 'Untitled Class',
              description: cls?.description || '',
              duration: cls?.duration || '',
              isActive: typeof cls?.isActive === 'boolean' ? cls.isActive : true,
              status,
              day: index + 1,
              resources: Array.isArray(cls?.resources)
                ? cls.resources.map((r: Partial<IResource>) => ({
                    id: r.id || Math.random().toString(36).substring(2, 9),
                    type: r.type || 'text',
                    title: r.title || 'Untitled Resource',
                    url: r.url || '',
                    content: r.content || '',
                    mcqData: r.mcqData || { question: '', options: ['Option 1', 'Option 2'], correctAnswerIndex: 0 },
                  }))
                : [],
            };
          });
          setClasses(processedClasses);
        } else {
          setClasses([]);
        }
      } catch {
        setClasses([]);
      }
    }
  }, [courseData]);

  const progressStats = useMemo(() => {
    const total = classes.length;
    const completed = classes.filter(c => c.status === 'completed').length;
    const missed = classes.filter(c => c.status === 'missed').length;
    const remaining = total - completed - missed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, remaining, percentage, missed };
  }, [classes]);

  const openClassModal = (cls: ProcessedClass) => {
    if (cls.status === 'locked') return;
    setSelectedClass(cls);
    setActiveResourceTab(cls.resources.length > 0 ? cls.resources[0].id : null);
  };

  const closeClassModal = () => {
    setSelectedClass(null);
    setActiveResourceTab(null);
  };

  const getResourceIcon = (type: ResourceType, className = 'h-5 w-5') => {
    switch (type) {
      case 'youtube':
        return <Youtube className={`text-red-500 ${className}`} />;
      case 'video':
        return <VideoIcon className={`text-indigo-400 ${className}`} />;
      case 'text':
        return <FileText className={`text-teal-400 ${className}`} />;
      case 'mcq':
        return <HelpCircle className={`text-amber-400 ${className}`} />;
      case 'assignment':
        return <ClipboardList className={`text-fuchsia-400 ${className}`} />;
      default:
        return <FileText className={`text-slate-400 ${className}`} />;
    }
  };

  const courseTitleDisplay = isCourseLoading ? 'Loading Workspace...' : (courseData?.courseTitle ?? 'My Learning Journey');

  return (
    <main className="min-h-screen bg-[#020817] text-slate-200 selection:bg-teal-500/30 overflow-x-hidden font-sans">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-900/20 via-[#020817] to-[#020817] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 relative z-10 space-y-8">
        <header className="flex flex-col xl:flex-row gap-6 justify-between items-start">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6 w-full xl:w-1/2">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push('/dashboard/courses')}
                variant="ghost"
                size="icon"
                className="rounded-full bg-white/5 hover:bg-white/10 text-white backdrop-blur-md h-12 w-12 shrink-0"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-teal-100 to-teal-400 tracking-tight">
                  {courseTitleDisplay}
                </h1>
                <p className="text-teal-400/80 font-medium mt-1 flex items-center gap-2">
                  <Target className="h-4 w-4" /> Enrolled Course View
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-3xl bg-slate-900/50 border border-white/5 backdrop-blur-xl shadow-2xl">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-slate-400 font-medium">Progress</span>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-white">{progressStats.percentage}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressStats.percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1 px-4 border-l border-white/10">
                <span className="text-sm text-slate-400 font-medium">Completed</span>
                <span className="text-2xl font-bold text-emerald-400">{progressStats.completed}</span>
                <span className="text-xs text-slate-500">Classes</span>
              </div>
              <div className="flex flex-col gap-1 px-4 border-l border-white/10">
                <span className="text-sm text-slate-400 font-medium">Missed</span>
                <span className="text-2xl font-bold text-red-400">{progressStats.missed}</span>
                <span className="text-xs text-slate-500">Classes</span>
              </div>
              <div className="flex flex-col gap-1 px-4 border-l border-white/10">
                <span className="text-sm text-slate-400 font-medium">Remaining</span>
                <span className="text-2xl font-bold text-teal-400">{progressStats.remaining}</span>
                <span className="text-xs text-slate-500">Classes</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/50 p-3 rounded-2xl border border-white/5 backdrop-blur-xl w-full xl:w-auto"
          >
            <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto px-4 py-2 bg-slate-950/50 rounded-xl border border-white/5 gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${isGameMode ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                  <Gamepad2 className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white leading-none">Game Mode</span>
                  <span className="text-xs text-slate-400 mt-1">{isGameMode ? 'Active' : 'Disabled'}</span>
                </div>
              </div>
              <Switch checked={isGameMode} onCheckedChange={setIsGameMode} className="data-[state=checked]:bg-amber-500" />
            </div>

            <AnimatePresence>
              {!isGameMode && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex bg-slate-950/50 p-1.5 rounded-xl border border-white/5 overflow-hidden w-full sm:w-auto justify-center"
                >
                  {[
                    { val: 1, icon: <List className="h-5 w-5" />, label: '1' },
                    { val: 2, icon: <LayoutGrid className="h-5 w-5" />, label: '2' },
                    { val: 3, icon: <LayoutGrid className="h-5 w-5" />, label: '3' },
                  ].map(btn => (
                    <button
                      key={btn.val}
                      onClick={() => setGridColumns(btn.val as 1 | 2 | 3)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
                        gridColumns === btn.val ? 'bg-teal-500/20 text-teal-400 font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {btn.icon}
                      <span className="text-sm">{btn.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </header>

        {classes.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-teal-400 font-medium tracking-widest">LOADING CONTENT...</p>
          </div>
        ) : (
          <div className="mt-12 relative">
            {isGameMode ? (
              <div className="relative py-10 max-w-4xl mx-auto flex flex-col items-center">
                <div className="absolute top-0 bottom-0 left-[28px] md:left-1/2 w-1.5 bg-slate-800 -translate-x-1/2 rounded-full overflow-hidden z-0">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${classes.length > 0 ? (classes.filter(c => c.status !== 'locked').length / classes.length) * 100 : 0}%` }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                    className="w-full bg-gradient-to-b from-teal-400 via-emerald-400 to-amber-400"
                  />
                </div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative z-10 flex flex-col items-center justify-center w-24 h-24 rounded-full bg-gradient-to-b from-slate-900 to-slate-950 border-4 border-teal-500 shadow-[0_0_30px_rgba(20,184,166,0.3)] mb-16 ml-[56px] md:ml-0"
                >
                  <Trophy className="h-8 w-8 text-teal-400 mb-1" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">Start Here</span>
                </motion.div>

                <div className="w-full space-y-12 md:space-y-24 flex flex-col items-start md:items-center">
                  {classes.map((cls, index) => {
                    const isLeft = index % 2 === 0;
                    const isLocked = cls.status === 'locked';

                    let nodeColor = 'bg-slate-800 border-slate-700 text-slate-500';
                    let glow = '';
                    let Icon = Lock;

                    if (cls.status === 'completed') {
                      nodeColor = 'bg-emerald-950/80 border-emerald-500 text-emerald-400';
                      glow = 'shadow-[0_0_20px_rgba(16,185,129,0.2)]';
                      Icon = CheckCircle2;
                    } else if (cls.status === 'missed') {
                      nodeColor = 'bg-red-950/80 border-red-500 text-red-400';
                      glow = 'shadow-[0_0_20px_rgba(239,68,68,0.2)]';
                      Icon = AlertCircle;
                    } else if (cls.status === 'active') {
                      nodeColor = 'bg-amber-950/80 border-amber-400 text-amber-400';
                      glow = 'shadow-[0_0_30px_rgba(251,191,36,0.4)] animate-pulse-slow';
                      Icon = PlayCircle;
                    }

                    return (
                      <motion.div
                        key={cls.id}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.1 } } }}
                        className={`relative flex items-center w-full group ml-[56px] md:ml-0 ${isLeft ? 'md:justify-start' : 'md:justify-end'}`}
                      >
                        <div
                          className={`absolute left-[-28px] md:left-1/2 w-14 h-14 -translate-x-1/2 rounded-full border-4 flex items-center justify-center z-10 transition-transform duration-300 ${isLocked ? '' : 'cursor-pointer hover:scale-110'} ${nodeColor} ${glow}`}
                          onClick={() => openClassModal(cls)}
                        >
                          <Icon className="h-6 w-6" />
                        </div>

                        <div className={`w-[calc(100%-40px)] md:w-[calc(50%-50px)] ${isLeft ? 'md:pr-12' : 'md:pl-12 md:ml-auto'}`}>
                          <div
                            onClick={() => openClassModal(cls)}
                            className={`p-6 rounded-3xl border backdrop-blur-sm transition-all duration-300 ${
                              isLocked
                                ? 'bg-slate-900/30 border-white/5 opacity-50 cursor-not-allowed'
                                : 'bg-slate-900/70 border-white/10 hover:border-teal-500/50 hover:bg-slate-800/80 cursor-pointer shadow-xl'
                            } ${cls.status === 'active' ? 'border-amber-500/50 shadow-[0_0_30px_rgba(251,191,36,0.1)]' : ''}`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span
                                className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                                  cls.status === 'completed'
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : cls.status === 'missed'
                                      ? 'bg-red-500/10 text-red-400'
                                      : cls.status === 'active'
                                        ? 'bg-amber-500/10 text-amber-400'
                                        : 'bg-slate-800 text-slate-500'
                                }`}
                              >
                                Day {cls.day}
                              </span>
                              <div className="flex gap-1.5">
                                {cls.resources.map(r => (
                                  <div key={r.id} className="p-1.5 bg-slate-950 rounded-md border border-white/5">
                                    {getResourceIcon(r.type, 'h-3 w-3')}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{cls.title}</h3>
                            <p className="text-sm text-slate-400 line-clamp-2 mb-4">{cls.description || 'No description provided for this session.'}</p>

                            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                              <div className="flex items-center gap-1.5 bg-slate-950/50 px-2.5 py-1.5 rounded-lg">
                                <Clock className="h-3.5 w-3.5 text-teal-500" />
                                {cls.duration || 'TBA'}
                              </div>
                              <div className="flex items-center gap-1.5 bg-slate-950/50 px-2.5 py-1.5 rounded-lg">
                                <BookOpen className="h-3.5 w-3.5 text-teal-500" />
                                {cls.resources.length} Items
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                className={`grid gap-6 ${
                  gridColumns === 1
                    ? 'grid-cols-1 max-w-4xl mx-auto'
                    : gridColumns === 2
                      ? 'grid-cols-1 md:grid-cols-2'
                      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                }`}
              >
                {classes.map(cls => {
                  const isLocked = cls.status === 'locked';
                  return (
                    <motion.div
                      key={cls.id}
                      variants={itemVariants}
                      onClick={() => openClassModal(cls)}
                      className={`group relative flex flex-col h-full bg-slate-900/60 rounded-3xl border backdrop-blur-xl overflow-hidden transition-all duration-300 ${
                        isLocked
                          ? 'border-white/5 opacity-60 grayscale-[50%] cursor-not-allowed'
                          : 'border-white/10 hover:border-teal-500/50 hover:shadow-2xl hover:shadow-teal-500/10 hover:-translate-y-1 cursor-pointer'
                      } ${cls.status === 'active' ? 'ring-2 ring-amber-500/50' : ''}`}
                    >
                      {cls.status === 'completed' && <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/20 blur-2xl z-0 rounded-full" />}
                      {cls.status === 'active' && <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/20 blur-3xl z-0 rounded-full" />}

                      <div className="p-6 relative z-10 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner ${
                                cls.status === 'completed'
                                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                  : cls.status === 'missed'
                                    ? 'bg-red-500/10 border-red-500/20 text-red-400'
                                    : cls.status === 'active'
                                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                      : 'bg-slate-800 border-white/5 text-slate-500'
                              }`}
                            >
                              {cls.status === 'completed' ? (
                                <CheckCircle2 className="h-6 w-6" />
                              ) : cls.status === 'missed' ? (
                                <AlertCircle className="h-6 w-6" />
                              ) : cls.status === 'active' ? (
                                <PlayCircle className="h-6 w-6" />
                              ) : (
                                <Lock className="h-6 w-6" />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Class {cls.day}</span>
                              <span
                                className={`text-xs font-bold px-2 py-0.5 rounded text-center w-fit ${
                                  cls.status === 'completed'
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : cls.status === 'missed'
                                      ? 'bg-red-500/20 text-red-300'
                                      : cls.status === 'active'
                                        ? 'bg-amber-500/20 text-amber-300'
                                        : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {cls.status.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 leading-tight group-hover:text-teal-400 transition-colors">
                          {cls.title}
                        </h3>
                        <p className="text-sm text-slate-400 line-clamp-3 mb-6 flex-1">{cls.description}</p>

                        <div className="flex items-center justify-between pt-5 border-t border-white/5 mt-auto">
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-950/50 px-3 py-1.5 rounded-lg border border-white/5">
                            <CalendarDays className="h-4 w-4 text-teal-500" />
                            {cls.duration || 'Flexible'}
                          </div>

                          <div className="flex -space-x-2 overflow-hidden">
                            {cls.resources.slice(0, 4).map((r, i) => (
                              <div
                                key={r.id + i}
                                className="inline-block h-8 w-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center relative z-[4] hover:z-10 hover:-translate-y-1 transition-transform"
                              >
                                {getResourceIcon(r.type, 'h-3.5 w-3.5')}
                              </div>
                            ))}
                            {cls.resources.length > 4 && (
                              <div className="inline-block h-8 w-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center relative z-0">
                                <span className="text-[10px] font-bold text-white">+{cls.resources.length - 4}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedClass && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full h-full flex flex-col lg:flex-row bg-[#020817] text-white overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

              <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-white/10 bg-slate-950/80 flex flex-col shrink-0 relative z-10 h-[30vh] lg:h-full">
                <div className="p-6 border-b border-white/10 flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-teal-400 tracking-widest uppercase mb-1 block">Class {selectedClass.day}</span>
                    <h2 className="text-xl font-bold leading-tight line-clamp-2">{selectedClass.title}</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeClassModal}
                    className="shrink-0 rounded-full bg-white/5 hover:bg-white/10 hover:text-red-400 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2 mb-3">Course Material</h3>
                  {selectedClass.resources.length === 0 ? (
                    <div className="p-4 text-center text-slate-500 text-sm border border-dashed border-white/10 rounded-xl bg-white/5">
                      No resources available for this class yet.
                    </div>
                  ) : (
                    selectedClass.resources.map(resource => {
                      const isActive = activeResourceTab === resource.id;
                      return (
                        <button
                          key={resource.id}
                          onClick={() => setActiveResourceTab(resource.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 border ${
                            isActive
                              ? 'bg-teal-500/10 border-teal-500/30 shadow-[inset_0_0_20px_rgba(20,184,166,0.1)]'
                              : 'border-transparent hover:bg-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className={`p-2 rounded-lg shrink-0 ${isActive ? 'bg-teal-500/20' : 'bg-slate-900'}`}>{getResourceIcon(resource.type)}</div>
                          <div className="flex flex-col overflow-hidden">
                            <span className={`text-sm font-semibold truncate ${isActive ? 'text-teal-400' : 'text-slate-200'}`}>{resource.title}</span>
                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{resource.type}</span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                <div className="p-4 border-t border-white/10 bg-slate-950">
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
                    onClick={closeClassModal}
                  >
                    <CheckCircle2 className="h-5 w-5 mr-2" /> Mark as Completed
                  </Button>
                </div>
              </div>

              <div className="flex-1 bg-[#020817] relative z-10 overflow-y-auto custom-scrollbar h-[70vh] lg:h-full">
                {activeResourceTab ? (
                  <div className="p-6 lg:p-12 max-w-5xl mx-auto h-full flex flex-col">
                    {selectedClass.resources.map(resource => {
                      if (resource.id !== activeResourceTab) return null;

                      return (
                        <motion.div key={resource.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-full space-y-6">
                          <div className="flex items-center gap-4 pb-6 border-b border-white/10 shrink-0">
                            <div className="p-3 bg-slate-900 border border-white/10 rounded-2xl shadow-inner">{getResourceIcon(resource.type, 'h-8 w-8')}</div>
                            <div>
                              <h2 className="text-2xl md:text-4xl font-black text-white">{resource.title}</h2>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-bold text-slate-300 uppercase tracking-widest">
                                  {resource.type}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex-1 min-h-0 bg-slate-900/40 border border-white/5 rounded-3xl p-6 lg:p-8 overflow-y-auto backdrop-blur-sm shadow-2xl">
                            {(resource.type === 'youtube' || resource.type === 'video') && (
                              <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center relative group">
                                {resource.url ? (
                                  <iframe
                                    src={resource.url.includes('watch?v=') ? resource.url.replace('watch?v=', 'embed/') : resource.url}
                                    className="w-full h-full"
                                    allowFullScreen
                                  />
                                ) : (
                                  <div className="flex flex-col items-center text-slate-500">
                                    <VideoIcon className="h-16 w-16 mb-4 opacity-50" />
                                    <p className="font-medium">Video source not provided</p>
                                  </div>
                                )}
                              </div>
                            )}

                            {(resource.type === 'text' || resource.type === 'assignment') && (
                              <div className="prose prose-invert prose-teal max-w-none text-slate-300 leading-relaxed space-y-4">
                                {resource.content ? (
                                  <div dangerouslySetInnerHTML={{ __html: resource.content }} />
                                ) : (
                                  <div className="flex flex-col items-center justify-center h-64 text-slate-500 border-2 border-dashed border-white/10 rounded-2xl">
                                    <FileText className="h-12 w-12 mb-4 opacity-50" />
                                    <p>No textual content available.</p>
                                  </div>
                                )}
                              </div>
                            )}

                            {resource.type === 'mcq' && resource.mcqData && (
                              <div className="max-w-3xl mx-auto space-y-8">
                                <div className="bg-slate-950 p-6 lg:p-8 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden">
                                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-6 leading-relaxed">{resource.mcqData.question}</h3>
                                  <div className="space-y-3">
                                    {resource.mcqData.options.map((opt, idx) => (
                                      <button
                                        key={idx}
                                        className="w-full text-left p-4 rounded-xl border border-white/10 bg-slate-900/50 hover:bg-slate-800 hover:border-amber-500/50 hover:shadow-[0_0_15px_rgba(251,191,36,0.1)] transition-all duration-200 flex items-center gap-4 group"
                                      >
                                        <div className="w-8 h-8 rounded-full bg-slate-950 border border-white/10 flex items-center justify-center text-sm font-bold text-slate-400 group-hover:text-amber-400 group-hover:border-amber-500/50 shrink-0">
                                          {String.fromCharCode(65 + idx)}
                                        </div>
                                        <span className="text-slate-300 group-hover:text-white font-medium">{opt}</span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex justify-end">
                                  <Button className="bg-amber-600 hover:bg-amber-500 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-amber-500/20">
                                    Submit Answer
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8 text-center space-y-4">
                    <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center border border-white/5 mb-4 shadow-inner">
                      <BookOpen className="h-10 w-10 text-slate-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-400">Select a Resource</h3>
                    <p className="max-w-md">
                      Choose an item from the left sidebar to start learning. You can watch videos, read materials, and complete assignments.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function StudentCoursePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#020817] flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full border-4 border-teal-500 border-t-transparent animate-spin shadow-[0_0_30px_rgba(20,184,166,0.4)]" />
            <p className="text-teal-400 font-bold tracking-[0.2em] text-lg">INITIALIZING SYSTEM</p>
          </div>
        </div>
      }
    >
      <StudentCourseContent />
    </Suspense>
  );
}
```


and here is example of my-course/page.tsx 
```
'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Clock,
  Award,
  PlayCircle,
  AlertTriangle,
  RefreshCw,
  User,
  Mail,
  CalendarCheck,
  Activity,
  Unlock,
  Lock,
  X,
  Loader2,
  Sparkles,
  CheckCircle,
  Info,
  Clock4,
  ExternalLink,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useGetCoursesQuery } from '@/redux/features/courses/coursesSlice';
import { useGetMyCoursesQuery } from '@/redux/features/my-courses/myCoursesSlice';
import { useGetEnrollmentsQuery, useAddEnrollmentMutation } from '@/redux/features/enrollments/enrollmentsSlice';
import { useSession } from '@/lib/auth-client';

interface ICourse {
  _id: string;
  courseTitle: string;
  courseDescription?: string;
  totalClass?: number;
  totalAssignment?: number;
  totalDuration?: string;
  totalMockTest?: number;
  realPrice?: number;
  discountPrice?: number;
  challengeDay?: number;
  totalLecture?: number;
  isActive?: boolean;
}

interface IMyCourse {
  _id: string;
  courseId: ICourse | string;
  progress?: number;
  enrolledAt?: string;
}

interface IEnrollment {
  _id: string;
  studentEmail: string;
  enrollCoursesIDS: string[];
  paymentStatus: string; // 'pending' | 'completed' | 'failed' | 'refunded'
  studentsStatus: string; // 'blocked' | 'pending' | 'complete' | 'running'
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function MyCoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState<string>('');
  const session = useSession();
  const user = session?.data?.user;

  const studentInfo = {
    name: user?.name || '',
    email: user?.email || '',
  };

  // Queries
  const { data: coursesData, isLoading: isCoursesLoading, error: coursesError, refetch: refetchCourses } = useGetCoursesQuery({ page: 1, limit: 100 });

  // MyCourses Query (Used for Attendance stats)
  const {
    data: myCoursesData,
    isLoading: isMyCoursesLoading,
    error: myCoursesError,
    refetch: refetchMyCourses,
  } = useGetMyCoursesQuery({ page: 1, limit: 100 });

  // Enrollments Query for the current user (Used for categorizing sections)
  const {
    data: enrollmentsData,
    isLoading: isEnrollmentsLoading,
    error: enrollmentsError,
    refetch: refetchEnrollments,
  } = useGetEnrollmentsQuery({ page: 1, limit: 100, q: studentInfo.email });

  // Mutation
  const [addEnrollment] = useAddEnrollmentMutation();

  const isLoading = isCoursesLoading || isMyCoursesLoading || isEnrollmentsLoading;
  const error = coursesError || myCoursesError || enrollmentsError;

  // Categorize courses based on Enrollments Data
  const { activeCourses, pendingCourses, availableCourses, hasData } = useMemo(() => {
    const allCourses: ICourse[] = coursesData?.data?.courses || [];
    const myCoursesList: IMyCourse[] = myCoursesData?.data?.myCourses || [];
    const userEnrollments: IEnrollment[] = enrollmentsData?.data?.enrollments || [];

    const active: ICourse[] = [];
    const pending: ICourse[] = [];
    const available: ICourse[] = [];

    allCourses.forEach(course => {
      // Find if the course exists in any of the user's enrollments
      const relatedEnrollments = userEnrollments.filter(e => e.enrollCoursesIDS?.includes(course._id));

      if (relatedEnrollments.length > 0) {
        // Check if there is an active enrollment (payment: completed & student: running)
        const isActive = relatedEnrollments.some(e => e.paymentStatus === 'completed' && e.studentsStatus === 'running');

        if (isActive) {
          active.push(course);
        } else {
          // Exists in enrollments but not active (e.g., pending payment or pending student status)
          pending.push(course);
        }
      } else if (course.isActive) {
        // Not found in any enrollments
        available.push(course);
      }
    });

    return {
      activeCourses: active,
      pendingCourses: pending,
      availableCourses: available,
      hasData: myCoursesList.length > 0,
    };
  }, [coursesData, myCoursesData, enrollmentsData]);

  const displayAttendance = {
    todaysAttendance: hasData ? 'Present' : 'In-complete',
    totalAttendance: hasData ? 142 : 0,
  };

  // Reset errors and success state when modal closes/opens
  useEffect(() => {
    if (!selectedCourse) {
      setEnrollmentError('');
      setEnrollSuccess(false);
    }
  }, [selectedCourse]);

  const handleRefetch = () => {
    refetchCourses();
    refetchMyCourses();
    refetchEnrollments();
  };

  const handleAttendClass = (courseId: string) => {
    // Open the class link in a new tab
    window.open(`/dashboard/my-course/my-class?courseId=${courseId}`, '_blank');
  };

  const handleEnrollment = async () => {
    if (!selectedCourse) return;

    setIsEnrolling(true);
    setEnrollmentError('');

    try {
      // Check if user already applied
      const userEnrollments: IEnrollment[] = enrollmentsData?.data?.enrollments || [];
      const alreadyApplied = userEnrollments.some(enrollment => enrollment.enrollCoursesIDS?.includes(selectedCourse._id));

      if (alreadyApplied) {
        setEnrollmentError('You already applied for this enrollment. Please wait for approval.');
        setIsEnrolling(false);
        return;
      }

      // Submit post request via RTK Mutation
      const payload = {
        studentName: studentInfo.name,
        studentEmail: studentInfo.email,
        enrollCoursesIDS: [selectedCourse._id],
        realPrice: selectedCourse.realPrice || 0,
        discountPrice: selectedCourse.discountPrice || 0,
        paymentAmount: selectedCourse.discountPrice || 0,
        studentsStatus: 'pending',
        paymentStatus: 'pending',
      };

      await addEnrollment(payload).unwrap();

      // Handle Success
      setEnrollSuccess(true);
      refetchEnrollments(); // Update cache

      // Auto close modal after showing success state
      setTimeout(() => {
        setEnrollSuccess(false);
        setSelectedCourse(null);
      }, 2500);
    } catch (err) {
      console.error('Failed to enroll:', err);
      setEnrollmentError('Something went wrong during enrollment. Try again later.');
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 pt-[90px] pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full animate-pulse" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-2xl">
                <BookOpen className="h-10 w-10 text-white animate-pulse" />
              </div>
            </div>
            <div className="text-white text-xl font-semibold mt-4">Loading your journey...</div>
          </motion.div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 pt-[90px] pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6 max-w-md">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/30 blur-3xl rounded-full" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-2xl">
                <AlertTriangle className="h-10 w-10 text-white" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Oops! Something went wrong</h2>
              <p className="text-slate-400 text-sm">We could not load your courses at the moment.</p>
            </div>
            <Button onClick={handleRefetch} variant="outline" className="gap-2 bg-transparent text-white border-white/20 hover:bg-white/10">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 pt-[90px] pb-20 px-4 md:px-8 overflow-hidden relative">
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent" />
          <div className="relative p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                    {studentInfo.name}
                  </h1>
                  <div className="flex items-center gap-2 text-slate-400 text-sm md:text-base mt-1">
                    <Mail className="h-4 w-4 text-indigo-400" />
                    <span>{studentInfo.email}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="flex items-center gap-4 bg-slate-950/50 rounded-2xl p-4 border border-white/5 shadow-inner flex-1 md:flex-initial">
                <div className={`p-2 rounded-xl ${hasData ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                  <CalendarCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Today&apos;s Status</p>
                  <p className={`text-lg font-bold ${hasData ? 'text-emerald-400' : 'text-orange-400'}`}>{displayAttendance.todaysAttendance}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-950/50 rounded-2xl p-4 border border-white/5 shadow-inner flex-1 md:flex-initial">
                <div className={`p-2 rounded-xl ${hasData ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'}`}>
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Attendance</p>
                  <p className={`text-lg font-bold ${hasData ? 'text-blue-400' : 'text-slate-400'}`}>{displayAttendance.totalAttendance} Days</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- SECTION 1: Active Enrolled Courses --- */}
        <section>
          <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
            <Unlock className="h-6 w-6 text-indigo-400" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">Active Enrolled Courses</h2>
          </div>

          {activeCourses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-[30vh] border border-dashed border-indigo-500/30 rounded-3xl bg-indigo-950/20 p-8"
            >
              <BookOpen className="h-12 w-12 text-indigo-400/50 mb-4" />
              <p className="text-slate-400 text-center max-w-md">You don&apos;t have any active courses yet.</p>
            </motion.div>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCourses.map(course => (
                <motion.div
                  key={`active-${course._id}`}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.01 }}
                  className="group relative bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-indigo-500/20 overflow-hidden shadow-xl shadow-indigo-500/5 flex flex-col"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="p-6 pb-4 flex-1 relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Enrolled
                      </span>
                      <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        {course.challengeDay || 0} Days
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{course.courseTitle}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2 mb-6">{course.courseDescription || 'No description available.'}</p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <PlayCircle className="h-4 w-4 text-indigo-400" />
                        <span className="text-sm font-medium">{course.totalClass || 0} Classes</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Clock className="h-4 w-4 text-indigo-400" />
                        <span className="text-sm font-medium">{course.totalDuration || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto z-10 p-6 pt-4 border-t border-white/5 bg-slate-950/40">
                    <Button
                      onClick={() => handleAttendClass(course._id)}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-12 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all font-semibold"
                    >
                      Attend Class
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* --- SECTION 2: Pending/Requested Courses --- */}
        {pendingCourses.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4 mt-8">
              <Clock4 className="h-6 w-6 text-orange-400" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">Pending Requests</h2>
            </div>

            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingCourses.map(course => (
                <motion.div
                  key={`pending-${course._id}`}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="group relative bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-orange-500/20 overflow-hidden hover:border-orange-500/40 hover:bg-slate-900/80 transition-all duration-300 flex flex-col"
                >
                  <div className="p-6 pb-4 flex-1 relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-300 bg-orange-500/10 border border-orange-500/20 rounded-full flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" /> Pending Approval
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{course.courseTitle}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2 mb-6">{course.courseDescription || 'No description available.'}</p>
                  </div>

                  <div className="mt-auto z-10 p-6 pt-4 border-t border-white/5 bg-slate-950/40">
                    <Button
                      onClick={() => setSelectedCourse(course)}
                      variant="outline"
                      className="w-full bg-transparent text-orange-400 border-orange-500/30 hover:bg-orange-500/10 rounded-xl h-12 transition-all font-medium"
                    >
                      Request Enrollment
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* --- SECTION 3: Available Courses --- */}
        <section>
          <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4 mt-8">
            <Lock className="h-6 w-6 text-slate-400" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">Available Courses</h2>
          </div>

          {availableCourses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-[30vh] border border-dashed border-white/10 rounded-3xl bg-slate-900/20 p-8"
            >
              <Award className="h-12 w-12 text-slate-500 mb-4" />
              <p className="text-slate-400 text-center max-w-md">You have enrolled or requested in all available courses! Incredible dedication.</p>
            </motion.div>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCourses.map(course => (
                <motion.div
                  key={`available-${course._id}`}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="group relative bg-slate-900/40 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden hover:border-slate-500/30 hover:bg-slate-900/60 transition-all duration-300 flex flex-col grayscale-[20%] hover:grayscale-0"
                >
                  <div className="p-6 pb-4 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-800 border border-slate-700 rounded-full">
                        {course.challengeDay || 0} Days
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 opacity-90">{course.courseTitle}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2 mb-6">{course.courseDescription || 'No description available.'}</p>

                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div className="flex items-center gap-2 text-slate-400">
                        <PlayCircle className="h-4 w-4 text-slate-500" />
                        <span className="text-sm font-medium">{course.totalClass || 0} Classes</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="h-4 w-4 text-slate-500" />
                        <span className="text-sm font-medium">{course.totalDuration || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex flex-col">
                    <div className="px-6 py-4 bg-slate-950/30 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-slate-600" />
                        <span className="text-sm text-slate-400">{course.totalLecture || 0} Lectures</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500 line-through">৳{course.realPrice || 0}</span>
                        <span className="text-2xl font-bold text-white">৳{course.discountPrice || 0}</span>
                      </div>
                    </div>
                    <div className="px-6 pb-6 pt-2 bg-slate-950/30">
                      <Button
                        onClick={() => setSelectedCourse(course)}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-white/10 rounded-xl h-12 transition-all group-hover:border-indigo-500/50 group-hover:text-indigo-300 font-semibold"
                      >
                        Enroll Now
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </div>

      {/* Enrollment Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => !isEnrolling && setSelectedCourse(null)} // Closes when clicking outside
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-slate-900 border border-indigo-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/20 w-full max-w-md relative"
              onClick={e => e.stopPropagation()} // Prevents clicks inside the modal from bubbling to the backdrop
            >
              {/* Pointer-events-none to prevent gradient from capturing clicks on the close button */}
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-transparent pointer-events-none" />

              <button
                type="button"
                onClick={() => !isEnrolling && setSelectedCourse(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors z-20 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="p-8 relative z-10 flex flex-col h-full">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 mb-6 text-indigo-400 shadow-inner">
                  {enrollSuccess ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-emerald-400">
                      <CheckCircle className="h-8 w-8" />
                    </motion.div>
                  ) : (
                    <Sparkles className="h-8 w-8" />
                  )}
                </div>

                {enrollSuccess ? (
                  <div className="text-center py-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Enrollment Requested!</h3>
                    <p className="text-slate-400">Your request for {selectedCourse.courseTitle} has been submitted successfully.</p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{selectedCourse.courseTitle}</h3>
                    <p className="text-slate-400 text-sm mb-8 line-clamp-3">
                      {selectedCourse.courseDescription || 'Get ready to unlock your potential with this comprehensive course.'}
                    </p>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/50 border border-white/5 mb-6">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Course Price</p>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 line-through text-sm">৳{selectedCourse.realPrice || 0}</span>
                          <span className="text-xl font-bold text-white">৳{selectedCourse.discountPrice || 0}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Duration</p>
                        <span className="text-slate-300 font-medium text-sm">{selectedCourse.challengeDay || 0} Days</span>
                      </div>
                    </div>

                    <AnimatePresence>
                      {enrollmentError && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: -10 }}
                          animate={{ opacity: 1, height: 'auto', y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-6 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex gap-3 text-orange-400"
                        >
                          <Info className="h-5 w-5 shrink-0 mt-0.5" />
                          <p className="text-sm font-medium">{enrollmentError}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Button
                      onClick={handleEnrollment}
                      disabled={isEnrolling}
                      className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/25 transition-all text-lg font-semibold"
                    >
                      {isEnrolling ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Confirm Enrollment'
                      )}
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

```

and update it with the following instructions.
1. Make sure user have enrolled this course. and also make sure the student status is running. if it is not then show a UI to contact the admin to resolve the problem.
