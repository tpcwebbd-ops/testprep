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
