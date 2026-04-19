Look at the page.tsx 
```
'use client';

import { useState, Suspense, useEffect, useMemo, useRef } from 'react';
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
  PlayCircle,
  LayoutGrid,
  List,
  X,
  Lock,
  Gamepad2,
  CalendarDays,
  Target,
  ShieldAlert,
  ExternalLink,
  AlignRight,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Loader2,
  Rocket,
  Award,
  Trophy,
  Headphones,
  File,
  Download,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useGetCourseByIdQuery } from '@/redux/features/courses/coursesSlice';
import { useGetEnrollmentsQuery } from '@/redux/features/enrollments/enrollmentsSlice';
import { useGetMyCoursesQuery, useUpdateMyCourseMutation, useAddMyCourseMutation } from '@/redux/features/my-courses/myCoursesSlice';
import { useSession } from '@/lib/auth-client';

type ResourceType = 'youtube' | 'video' | 'text' | 'mcq' | 'assignment' | 'audio' | 'pdf' | 'docx';

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

interface IEnrollment {
  _id: string;
  studentEmail: string;
  enrollCoursesIDS: string[];
  paymentStatus: string;
  studentsStatus: string;
}

type ClassStatus = 'completed' | 'active' | 'locked';

interface ProcessedClass extends IClass {
  status: ClassStatus;
  day: number;
}

interface IAttendanceData {
  ClassName: string;
  status: 'complete' | 'incomplete';
  completeDate?: string;
}

interface IAttendance {
  courseID: string;
  data: IAttendanceData[];
}

interface IMyCourseDoc {
  _id: string;
  studentName?: string;
  studentEmail?: string;
  courseId: string;
  progress: number;
  attenDance: IAttendance[];
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

function StudentCourseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get('courseId');

  const session = useSession();
  const userEmail = session?.data?.user?.email || '';
  const userName = session?.data?.user?.name || 'Student';

  const { data: enrollmentsData, isLoading: isEnrollmentsLoading } = useGetEnrollmentsQuery({ page: 1, limit: 100, q: userEmail }, { skip: !userEmail });
  const { data: courseResponse, isLoading: isCourseLoading } = useGetCourseByIdQuery(courseId, { skip: !courseId });
  const { data: myCoursesData } = useGetMyCoursesQuery({ page: 1, limit: 100, q: userEmail }, { skip: !userEmail });

  const [updateMyCourse, { isLoading: isUpdatingCourse }] = useUpdateMyCourseMutation();
  const [addMyCourse, { isLoading: isAddingCourse }] = useAddMyCourseMutation();

  const isSavingProgress = isUpdatingCourse || isAddingCourse;
  const courseData = courseResponse?.data;

  const [classes, setClasses] = useState<ProcessedClass[]>([]);
  const [isGameMode, setIsGameMode] = useState(true);
  const [gridColumns, setGridColumns] = useState<1 | 2 | 3>(3);
  const [selectedClass, setSelectedClass] = useState<ProcessedClass | null>(null);
  const [activeResourceTab, setActiveResourceTab] = useState<string | null>(null);

  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});
  const [mcqSubmitted, setMcqSubmitted] = useState<Record<string, boolean>>({});
  const [viewedResources, setViewedResources] = useState<Set<string>>(new Set());
  const [autoNextCountdown, setAutoNextCountdown] = useState<number | null>(null);

  const [showCelebration, setShowCelebration] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isTaskbarVisible, setIsTaskbarVisible] = useState(true);
  const [isStatsExpanded, setIsStatsExpanded] = useState(false);

  const timelineBottomRef = useRef<HTMLDivElement>(null);

  const hasAccess = useMemo(() => {
    if (!enrollmentsData?.data?.enrollments || !courseId) return false;
    return enrollmentsData.data.enrollments.some(
      (e: IEnrollment) => e.enrollCoursesIDS?.includes(courseId) && e.paymentStatus === 'completed' && e.studentsStatus === 'running',
    );
  }, [enrollmentsData, courseId]);

  const myCourseDoc = useMemo<IMyCourseDoc | null>(() => {
    if (!myCoursesData?.data?.myCourses) return null;
    return myCoursesData.data.myCourses.find((c: IMyCourseDoc) => c.courseId === courseId) || null;
  }, [myCoursesData, courseId]);

  useEffect(() => {
    if (courseData?.lectureData) {
      try {
        let parsedData = courseData.lectureData;
        if (typeof parsedData === 'string') parsedData = JSON.parse(parsedData);
        else if (typeof parsedData === 'object' && !Array.isArray(parsedData) && parsedData !== null) parsedData = Object.values(parsedData);

        if (Array.isArray(parsedData)) {
          let foundActive = false;

          const processedClasses: ProcessedClass[] = parsedData.map((cls: Partial<IClass>, index: number) => {
            const title = cls?.title || 'Untitled Class';
            const courseAtt = myCourseDoc?.attenDance?.find((a: IAttendance) => a.courseID === courseId);
            const classAtt = courseAtt?.data?.find((d: IAttendanceData) => d.ClassName === title);

            let status: ClassStatus = 'locked';

            if (classAtt?.status === 'complete') {
              status = 'completed';
            } else if (!foundActive) {
              status = 'active';
              foundActive = true;
            }

            return {
              id: cls?.id || Math.random().toString(36).substring(2, 9),
              title,
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
  }, [courseData, myCourseDoc, courseId]);

  const progressStats = useMemo(() => {
    const total = classes.length;
    const completed = classes.filter(c => c.status === 'completed').length;
    const active = classes.filter(c => c.status === 'active').length;
    const remaining = total - completed - active;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, remaining, percentage, active };
  }, [classes]);

  const openClassModal = (cls: ProcessedClass) => {
    if (cls.status === 'locked') return;
    setSelectedClass(cls);
    setActiveResourceTab(cls.resources.length > 0 ? cls.resources[0].id : null);
    setIsMobileSidebarOpen(true);
  };

  const closeClassModal = () => {
    setSelectedClass(null);
    setActiveResourceTab(null);
    setIsMobileSidebarOpen(false);
  };

  useEffect(() => {
    if (activeResourceTab) {
      setViewedResources(prev => {
        const next = new Set(prev);
        next.add(activeResourceTab);
        return next;
      });
    }
  }, [activeResourceTab]);

  useEffect(() => {
    if (isGameMode && classes.length > 0) {
      const timer = setTimeout(() => {
        timelineBottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isGameMode, classes.length]);

  const handleMarkAsComplete = async () => {
    if (!selectedClass || !courseId) return;

    const currentTitle = selectedClass.title;
    const previousProgress = progressStats.percentage;

    if (!myCourseDoc) {
      const newAttendance: IAttendance[] = [
        {
          courseID: courseId,
          data: [{ ClassName: currentTitle, status: 'complete', completeDate: new Date().toISOString() }],
        },
      ];

      const initialProgress = classes.length > 0 ? Math.round((1 / classes.length) * 100) : 0;

      try {
        await addMyCourse({
          studentName: userName,
          studentEmail: userEmail,
          courseId: courseId,
          progress: initialProgress,
          attenDance: newAttendance,
        }).unwrap();

        closeClassModal();
        if (initialProgress >= 100 && previousProgress < 100) setShowCelebration(true);
      } catch (err) {
        console.error(err);
      }
      return;
    }

    const newAttendance: IAttendance[] = JSON.parse(JSON.stringify(myCourseDoc.attenDance || []));
    let courseAtt = newAttendance.find(a => a.courseID === courseId);

    if (!courseAtt) {
      courseAtt = { courseID: courseId, data: [] };
      newAttendance.push(courseAtt);
    }

    const classData = courseAtt.data.find(d => d.ClassName === currentTitle);
    if (classData) {
      classData.status = 'complete';
      classData.completeDate = new Date().toISOString();
    } else {
      courseAtt.data.push({ ClassName: currentTitle, status: 'complete', completeDate: new Date().toISOString() });
    }

    const totalClasses = classes.length;
    const completedClassesCount = courseAtt.data.filter(d => d.status === 'complete').length;
    const newProgress = totalClasses > 0 ? Math.round((completedClassesCount / totalClasses) * 100) : 0;

    try {
      await updateMyCourse({ id: myCourseDoc._id, attenDance: newAttendance, progress: newProgress }).unwrap();
      closeClassModal();
      if (newProgress >= 100 && previousProgress < 100) setShowCelebration(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    if (activeResourceTab && mcqSubmitted[activeResourceTab]) {
      setAutoNextCountdown(5);

      interval = setInterval(() => {
        setAutoNextCountdown(prev => (prev !== null && prev > 1 ? prev - 1 : null));
      }, 1000);

      timeout = setTimeout(() => {
        const currentIndex = selectedClass?.resources.findIndex(r => r.id === activeResourceTab);
        if (currentIndex !== undefined && currentIndex !== -1 && selectedClass) {
          const hasNext = currentIndex < selectedClass.resources.length - 1;
          if (hasNext) {
            setActiveResourceTab(selectedClass.resources[currentIndex + 1].id);
          } else {
            handleMarkAsComplete();
          }
        }
      }, 5000);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      setAutoNextCountdown(null);
    };
  }, [activeResourceTab, mcqSubmitted, selectedClass]);

  const getResourceIcon = (type: ResourceType, className = 'h-4 w-4') => {
    switch (type) {
      case 'youtube':
        return <Youtube className={`text-red-500 ${className}`} />;
      case 'video':
        return <VideoIcon className={`text-indigo-400 ${className}`} />;
      case 'audio':
        return <Headphones className={`text-purple-400 ${className}`} />;
      case 'pdf':
        return <FileText className={`text-rose-400 ${className}`} />;
      case 'docx':
        return <File className={`text-blue-400 ${className}`} />;
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

  const handleHtmlContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    if (anchor) {
      e.preventDefault();
      window.location.href = anchor.href;
    }
  };

  const renderStatsPanel = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
      <div className="flex flex-col gap-1 pb-4 lg:pb-0 lg:pr-4 col-span-2 lg:col-span-1 border-b lg:border-b-0 border-white/10">
        <span className="text-[10px] md:text-xs text-slate-400 font-bold tracking-wider uppercase flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-teal-500" /> Completion Progress
        </span>
        <div className="flex items-end gap-2">
          <span className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
            {progressStats.percentage}%
          </span>
        </div>
        <div className="w-full bg-slate-900 h-2 rounded-full mt-2 overflow-hidden shadow-inner border border-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressStats.percentage}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] relative"
          >
            <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/20 blur-md" />
          </motion.div>
        </div>
      </div>

      <div className="flex flex-col gap-1 lg:px-6 pt-4 lg:pt-0">
        <div className="flex items-center gap-1.5">
          <div className="p-1 bg-emerald-500/10 rounded-md">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="text-[10px] md:text-xs text-slate-400 font-bold tracking-wider uppercase">Mastered</span>
        </div>
        <span className="text-2xl md:text-3xl font-black text-emerald-400">{progressStats.completed}</span>
      </div>

      <div className="flex flex-col gap-1 lg:px-6 pt-4 lg:pt-0 border-l border-white/10 pl-4 lg:border-l-0 lg:pl-6">
        <div className="flex items-center gap-1.5">
          <div className="p-1 bg-amber-500/10 rounded-md">
            <PlayCircle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="text-[10px] md:text-xs text-slate-400 font-bold tracking-wider uppercase">In Progress</span>
        </div>
        <span className="text-2xl md:text-3xl font-black text-amber-400">{progressStats.active}</span>
      </div>

      <div className="flex flex-col gap-1 lg:px-6 pt-4 lg:pt-0">
        <div className="flex items-center gap-1.5">
          <div className="p-1 bg-slate-800 rounded-md">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <span className="text-[10px] md:text-xs text-slate-400 font-bold tracking-wider uppercase">Locked</span>
        </div>
        <span className="text-2xl md:text-3xl font-black text-slate-300">{progressStats.remaining}</span>
      </div>
    </div>
  );

  const isLoading = isCourseLoading || isEnrollmentsLoading;
  const courseTitleDisplay = isCourseLoading ? 'Loading Workspace...' : (courseData?.courseTitle ?? 'My Learning Journey');

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#020817] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-teal-500 border-t-transparent animate-spin shadow-[0_0_30px_rgba(20,184,166,0.4)]" />
          <p className="text-teal-400 font-bold tracking-[0.2em] text-sm">INITIALIZING</p>
        </div>
      </main>
    );
  }

  if (!hasAccess) {
    return (
      <main className="min-h-screen mt-[65px] bg-[#020817] text-slate-200 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-[#020817] to-[#020817] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative z-10 max-w-lg w-full bg-slate-900/80 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 text-center shadow-2xl"
        >
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Access Restricted</h1>
          <p className="text-sm text-slate-400 mb-6">
            You do not have active access to this course. Ensure your enrollment is approved and payment is complete.
          </p>
          <Button
            onClick={() => router.push('/dashboard/my-course')}
            variant="outline"
            className="bg-transparent border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 h-10 px-6 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Return to Courses
          </Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen mt-[65px] bg-[#020817] text-slate-200 selection:bg-teal-500/30 overflow-x-hidden font-sans pb-20 relative select-none">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-900/20 via-[#020817] to-[#020817] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-2 sm:px-4 pt-4 md:pt-6 relative z-10 space-y-4 md:space-y-6">
        <AnimatePresence>
          {!isGameMode && (
            <motion.header
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="relative w-full"
            >
              <div className="bg-slate-900/60 backdrop-blur-3xl border border-teal-500/30 rounded-[1.5rem] overflow-hidden flex flex-col relative">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />

                <div className="p-4 md:p-6 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center relative z-10">
                  <div className="flex items-center gap-3 w-full xl:w-auto">
                    <Button
                      onClick={() => router.push('/dashboard/my-course')}
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-slate-800/50 hover:bg-slate-700 text-white border border-white/5 h-10 w-10 shrink-0 transition-transform hover:-translate-x-1"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-teal-100 to-teal-400 tracking-tight leading-tight line-clamp-1">
                      {courseTitleDisplay}
                    </h1>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-950/50 p-1.5 rounded-xl border border-white/10 shrink-0 w-full xl:w-auto overflow-x-auto custom-scrollbar shadow-inner">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 rounded-lg border border-white/5">
                      <Gamepad2 className="h-4 w-4 text-slate-400" />
                      <div className="flex flex-col shrink-0">
                        <span className="text-xs font-bold text-white leading-none">Game Mode</span>
                      </div>
                      <Switch checked={isGameMode} onCheckedChange={setIsGameMode} className="data-[state=checked]:bg-amber-500 ml-1 scale-75 md:scale-90" />
                    </div>

                    <div className="flex gap-1 ml-auto xl:ml-0">
                      {[
                        { val: 1, icon: <List className="h-4 w-4" /> },
                        { val: 2, icon: <LayoutGrid className="h-4 w-4" /> },
                        { val: 3, icon: <LayoutGrid className="h-4 w-4" /> },
                      ].map((btn, i) => (
                        <button
                          key={i}
                          onClick={() => setGridColumns(btn.val as 1 | 2 | 3)}
                          className={`flex items-center justify-center h-9 w-9 rounded-lg transition-all ${
                            gridColumns === btn.val
                              ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30 shadow-[inset_0_0_15px_rgba(20,184,166,0.1)]'
                              : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                          }`}
                        >
                          {btn.icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/40 border-t border-white/5 p-4 md:px-6 relative z-10">{renderStatsPanel()}</div>
              </div>
            </motion.header>
          )}
        </AnimatePresence>

        {classes.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[30vh]">
            <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-teal-400 text-sm font-medium tracking-widest">NO CONTENT</p>
          </div>
        ) : (
          <div className="mt-4 relative">
            {isGameMode ? (
              <div className="relative py-4 max-w-4xl mx-auto flex flex-col items-center">
                <div className="absolute top-[30px] bottom-[30px] left-[20px] md:left-1/2 w-1 md:w-1.5 bg-slate-800 -translate-x-1/2 rounded-full overflow-hidden z-0">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${classes.length > 0 ? (progressStats.completed / classes.length) * 100 : 0}%` }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                    className="absolute bottom-0 w-full bg-gradient-to-t from-teal-400 via-emerald-400 to-amber-400 origin-bottom"
                  />
                </div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`relative z-10 flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full border-4 shadow-[0_0_30px_rgba(245,158,11,0.3)] mb-8 ml-[40px] md:ml-0 transition-colors duration-1000 ${progressStats.percentage === 100 ? 'bg-gradient-to-b from-amber-400 to-orange-500 border-amber-200' : 'bg-gradient-to-b from-slate-900 to-slate-950 border-amber-500'}`}
                >
                  <Award className={`h-6 w-6 md:h-8 md:w-8 mb-0.5 ${progressStats.percentage === 100 ? 'text-white' : 'text-amber-400'}`} />
                  <span
                    className={`text-[8px] md:text-[10px] font-bold uppercase tracking-wider text-center leading-tight ${progressStats.percentage === 100 ? 'text-white' : 'text-white'}`}
                  >
                    Goal
                  </span>
                </motion.div>

                <div className="w-full space-y-6 md:space-y-12 flex flex-col items-start md:items-center">
                  {[...classes].reverse().map(cls => {
                    const originalIndex = classes.findIndex(c => c.id === cls.id);
                    const isLeft = originalIndex % 2 === 0;
                    const isLocked = cls.status === 'locked';

                    let nodeColor = 'bg-slate-800 border-slate-700 text-slate-500';
                    let glow = '';
                    let Icon = Lock;

                    if (cls.status === 'completed') {
                      nodeColor = 'bg-emerald-950/80 border-emerald-500 text-emerald-400';
                      glow = 'shadow-[0_0_20px_rgba(16,185,129,0.2)]';
                      Icon = CheckCircle2;
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
                        viewport={{ once: true, margin: '-50px' }}
                        variants={{
                          hidden: { opacity: 0, y: 30 },
                          visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.05 } },
                        }}
                        className={`relative flex items-center w-full group ml-[40px] md:ml-0 ${isLeft ? 'md:justify-start' : 'md:justify-end'}`}
                      >
                        <div
                          className={`absolute left-[-20px] md:left-1/2 w-10 h-10 md:w-12 md:h-12 -translate-x-1/2 rounded-full border-2 md:border-4 flex items-center justify-center z-10 transition-transform duration-300 ${
                            isLocked ? '' : 'cursor-pointer hover:scale-110'
                          } ${nodeColor} ${glow}`}
                          onClick={() => openClassModal(cls)}
                        >
                          <Icon className="h-4 w-4 md:h-5 md:w-5" />
                        </div>

                        <div className={`w-[calc(100%-30px)] md:w-[calc(50%-40px)] ${isLeft ? 'md:pr-8' : 'md:pl-8 md:ml-auto'}`}>
                          <div
                            onClick={() => openClassModal(cls)}
                            className={`p-4 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
                              isLocked
                                ? 'bg-slate-900/30 border-white/5 opacity-50 cursor-not-allowed'
                                : 'bg-slate-900/70 border-white/10 hover:border-teal-500/50 hover:bg-slate-800/80 cursor-pointer shadow-lg'
                            } ${cls.status === 'active' ? 'border-amber-500/50 shadow-[0_0_20px_rgba(251,191,36,0.1)]' : ''}`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className={`text-[10px] md:text-xs font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                                  cls.status === 'completed'
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : cls.status === 'active'
                                      ? 'bg-amber-500/10 text-amber-400'
                                      : 'bg-slate-800 text-slate-500'
                                }`}
                              >
                                Mod {cls.day}
                              </span>
                              <div className="flex gap-1">
                                {cls.resources.map(r => (
                                  <div key={r.id} className="p-1 bg-slate-950 rounded border border-white/5">
                                    {getResourceIcon(r.type, 'h-3 w-3')}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <h3
                              className={`text-sm md:text-base font-bold mb-1 line-clamp-1 ${cls.status === 'completed' ? 'text-emerald-300' : 'text-white'}`}
                            >
                              {cls.title}
                            </h3>
                            <p className="text-xs text-slate-400 line-clamp-2 mb-3">{cls.description || 'No description provided.'}</p>

                            <div className="flex items-center gap-3 text-[10px] md:text-xs font-medium text-slate-500">
                              <div className="flex items-center gap-1 bg-slate-950/50 px-2 py-1 rounded-md">
                                <Clock className="h-3 w-3 text-teal-500" />
                                {cls.duration || 'TBA'}
                              </div>
                              <div className="flex items-center gap-1 bg-slate-950/50 px-2 py-1 rounded-md">
                                <BookOpen className="h-3 w-3 text-teal-500" />
                                {cls.resources.length}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <motion.div
                  ref={timelineBottomRef}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  className="relative z-10 flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-b from-slate-900 to-slate-950 border-4 border-teal-500 shadow-[0_0_30px_rgba(20,184,166,0.3)] mt-8 ml-[40px] md:ml-0"
                >
                  <Rocket className="h-6 w-6 md:h-8 md:w-8 text-teal-400 mb-0.5" />
                  <span className="text-[8px] md:text-[10px] font-bold text-white uppercase tracking-wider text-center leading-tight">Start</span>
                </motion.div>
              </div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                className={`grid gap-3 sm:gap-4 ${
                  gridColumns === 1
                    ? 'grid-cols-1 max-w-4xl mx-auto'
                    : gridColumns === 2
                      ? 'grid-cols-1 md:grid-cols-2'
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                }`}
              >
                {classes.map(cls => {
                  const isLocked = cls.status === 'locked';
                  return (
                    <motion.div
                      key={cls.id}
                      variants={itemVariants}
                      onClick={() => openClassModal(cls)}
                      className={`group relative flex flex-col h-full bg-slate-900/60 rounded-2xl border backdrop-blur-xl overflow-hidden transition-all duration-300 ${
                        isLocked
                          ? 'border-white/5 opacity-60 grayscale-[50%] cursor-not-allowed'
                          : 'border-white/10 hover:border-teal-500/50 hover:shadow-lg hover:-translate-y-1 cursor-pointer'
                      } ${cls.status === 'active' ? 'ring-1 ring-amber-500/50' : ''}`}
                    >
                      {cls.status === 'completed' && <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/20 blur-xl z-0 rounded-full" />}
                      {cls.status === 'active' && <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/20 blur-2xl z-0 rounded-full" />}

                      <div className="p-4 relative z-10 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 border shadow-inner ${
                                cls.status === 'completed'
                                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                  : cls.status === 'active'
                                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                    : 'bg-slate-800 border-white/5 text-slate-500'
                              }`}
                            >
                              {cls.status === 'completed' ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : cls.status === 'active' ? (
                                <PlayCircle className="h-4 w-4" />
                              ) : (
                                <Lock className="h-4 w-4" />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mod {cls.day}</span>
                            </div>
                          </div>
                        </div>

                        <h3
                          className={`text-base font-bold mb-1 line-clamp-2 leading-tight transition-colors ${cls.status === 'completed' ? 'text-emerald-400' : 'text-white group-hover:text-teal-400'}`}
                        >
                          {cls.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 mb-4 flex-1">{cls.description}</p>

                        <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-auto">
                          <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 bg-slate-950/50 px-2 py-1 rounded-md border border-white/5">
                            <CalendarDays className="h-3 w-3 text-teal-500" />
                            {cls.duration || 'Flexible'}
                          </div>

                          <div className="flex -space-x-1 overflow-hidden">
                            {cls.resources.slice(0, 3).map((r, i) => (
                              <div
                                key={r.id + i}
                                className="inline-block h-6 w-6 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center relative z-[4] hover:z-10 hover:-translate-y-0.5 transition-transform"
                              >
                                {getResourceIcon(r.type, 'h-3 w-3')}
                              </div>
                            ))}
                            {cls.resources.length > 3 && (
                              <div className="inline-block h-6 w-6 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center relative z-0">
                                <span className="text-[8px] font-bold text-white">+{cls.resources.length - 3}</span>
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
        {isGameMode && isTaskbarVisible && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-[60] bg-slate-950/90 backdrop-blur-2xl border-t border-teal-500/30 shadow-[0_-10px_50px_rgba(20,184,166,0.15)]"
          >
            <div className="absolute left-1/2 -translate-x-1/2 -top-4 z-[61]">
              <button
                onClick={() => setIsStatsExpanded(!isStatsExpanded)}
                className="bg-slate-900 border border-teal-500/50 p-1.5 rounded-full shadow-[0_0_15px_rgba(20,184,166,0.4)] hover:bg-slate-800 hover:text-teal-400 transition-colors text-white focus:outline-none"
              >
                <motion.div animate={{ rotate: isStatsExpanded ? 180 : 0 }}>
                  <ChevronUp className="w-4 h-4" />
                </motion.div>
              </button>
            </div>

            <AnimatePresence>
              {isStatsExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-b border-white/5"
                >
                  <div className="p-4 max-w-7xl mx-auto">{renderStatsPanel()}</div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="h-[60px] md:h-[70px] w-full px-2 sm:px-4 flex items-center justify-between gap-2 max-w-[1600px] mx-auto">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <Button
                  onClick={() => router.push('/dashboard/my-course')}
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-slate-800/80 hover:bg-slate-700 text-white border border-white/5 h-8 w-8 md:h-10 md:w-10 shrink-0 transition-transform hover:-translate-x-1"
                >
                  <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
                <div className="flex flex-col min-w-0 hidden sm:flex overflow-hidden">
                  <h2 className="text-xs md:text-sm font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-teal-100 to-teal-400 truncate leading-tight">
                    {courseTitleDisplay}
                  </h2>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center gap-2 shrink-0 hidden md:flex">
                <Target className="w-4 h-4 text-teal-500 shrink-0" />
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                    {progressStats.percentage}%
                  </span>
                </div>
                <div className="h-1.5 w-full max-w-[100px] bg-slate-800 rounded-full overflow-hidden border border-white/5 ml-2 relative">
                  <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full" style={{ width: `${progressStats.percentage}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 flex-1">
                <div className="flex items-center gap-1 md:hidden bg-slate-900/80 px-2 py-1 rounded-md border border-white/5 shrink-0">
                  <Target className="w-3 h-3 text-teal-500" />
                  <span className="text-[10px] font-black text-emerald-400">{progressStats.percentage}%</span>
                </div>

                <div className="flex items-center gap-1 bg-slate-900/80 px-2 py-1 rounded-lg border border-white/5 shrink-0">
                  <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
                  <Switch checked={isGameMode} onCheckedChange={setIsGameMode} className="data-[state=checked]:bg-amber-500 scale-[0.6]" />
                </div>

                <div className="w-px h-5 bg-white/10 hidden sm:block shrink-0"></div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsTaskbarVisible(false)}
                  className="rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-400 h-7 w-7 md:h-8 md:w-8 shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isGameMode && !isTaskbarVisible && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsTaskbarVisible(true)}
            className="fixed bottom-4 right-4 z-50 bg-teal-600 p-3 rounded-full shadow-[0_0_20px_rgba(13,148,136,0.6)] text-white hover:bg-teal-500 transition-all hover:scale-105 active:scale-95"
          >
            <LayoutGrid className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedClass && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-[65px] pt-4 inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full h-full flex bg-[#020817] text-white overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

              <AnimatePresence>
                {isMobileSidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileSidebarOpen(false)}
                  />
                )}
              </AnimatePresence>

              <div
                className={`absolute lg:relative top-0 left-0 h-full w-[85%] sm:w-[320px] bg-slate-950/95 lg:bg-slate-950/80 border-r border-white/10 flex flex-col shrink-0 z-[70] lg:z-10 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none ${
                  isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
              >
                <div className="p-4 border-b border-white/10 flex items-start justify-between shrink-0">
                  <div>
                    <span className="text-[10px] font-bold text-teal-400 tracking-widest uppercase mb-0.5 block">Mod {selectedClass.day}</span>
                    <h2 className="text-base font-bold leading-tight line-clamp-2">{selectedClass.title}</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (typeof window !== 'undefined' && window.innerWidth >= 1024) closeClassModal();
                      else setIsMobileSidebarOpen(false);
                    }}
                    className="shrink-0 rounded-full bg-white/5 hover:bg-white/10 hover:text-red-400 h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2 mb-2 mt-2">Materials</h3>
                  {selectedClass.resources.length === 0 ? (
                    <div className="p-3 text-center text-slate-500 text-xs border border-dashed border-white/10 rounded-lg">No resources.</div>
                  ) : (
                    selectedClass.resources.map(resource => {
                      const isActive = activeResourceTab === resource.id;
                      const isResourceCompleted = selectedClass.status === 'completed' || viewedResources.has(resource.id);

                      return (
                        <button
                          key={resource.id}
                          onClick={() => {
                            setActiveResourceTab(resource.id);
                            if (typeof window !== 'undefined' && window.innerWidth < 1024) setIsMobileSidebarOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all duration-200 border ${
                            isActive ? 'bg-teal-500/10 border-teal-500/30 shadow-[inset_0_0_15px_rgba(20,184,166,0.1)]' : 'border-transparent hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <div className={`p-1.5 rounded-md shrink-0 ${isActive ? 'bg-teal-500/20' : 'bg-slate-900'}`}>{getResourceIcon(resource.type)}</div>
                            <div className="flex flex-col overflow-hidden">
                              <span className={`text-xs font-semibold truncate ${isActive ? 'text-teal-400' : 'text-slate-200'}`}>{resource.title}</span>
                              <span className="text-[9px] text-slate-500 uppercase font-bold">{resource.type}</span>
                            </div>
                          </div>
                          {isResourceCompleted && <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0 ml-1" />}
                        </button>
                      );
                    })
                  )}
                </div>

                <div className="p-3 border-t border-white/10 shrink-0">
                  <Button
                    className={`w-full font-bold h-10 rounded-lg transition-all text-xs ${
                      selectedClass.status === 'completed'
                        ? 'bg-emerald-600/50 border border-emerald-500/50 text-emerald-100 hover:bg-emerald-600/70'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                    onClick={handleMarkAsComplete}
                    disabled={isSavingProgress}
                  >
                    {isSavingProgress ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                    {selectedClass.status === 'completed' ? 'Re-complete Module' : 'Complete Module'}
                  </Button>
                </div>
              </div>

              <div className="flex-1 flex flex-col relative z-10 w-full h-full overflow-hidden">
                <div className="lg:hidden shrink-0 sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between p-2 sm:p-3">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="p-1 bg-teal-500/20 text-teal-400 rounded-md shrink-0">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold text-white truncate">
                      {selectedClass.resources.find(r => r.id === activeResourceTab)?.title || 'Overview'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMobileSidebarOpen(true)}
                      className="rounded-lg bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 h-8 w-8"
                    >
                      <AlignRight className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={closeClassModal} className="rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 h-8 w-8">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {activeResourceTab ? (
                  <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col overflow-hidden p-2 sm:p-4">
                    {selectedClass.resources.map(resource => {
                      if (resource.id !== activeResourceTab) return null;

                      const currentIndex = selectedClass.resources.findIndex(r => r.id === activeResourceTab);
                      const hasPrev = currentIndex > 0;
                      const hasNext = currentIndex < selectedClass.resources.length - 1;

                      const handlePrev = () => {
                        if (hasPrev) setActiveResourceTab(selectedClass.resources[currentIndex - 1].id);
                      };
                      const handleNext = () => {
                        if (hasNext) setActiveResourceTab(selectedClass.resources[currentIndex + 1].id);
                      };

                      return (
                        <motion.div
                          key={resource.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex flex-col h-full overflow-hidden w-full"
                        >
                          <div className="flex items-center gap-3 pb-3 border-b border-white/10 shrink-0 mb-3">
                            <div className="p-2 bg-slate-900 border border-white/10 rounded-lg shadow-inner hidden sm:block">
                              {getResourceIcon(resource.type, 'h-6 w-6')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h2 className="text-lg sm:text-xl font-black text-white leading-tight truncate">{resource.title}</h2>
                              <span className="inline-block mt-1 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                                {resource.type}
                              </span>
                            </div>
                          </div>

                          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar bg-slate-900/40 rounded-xl p-3 sm:p-4 md:p-6 border border-white/5">
                            {(resource.type === 'youtube' || resource.type === 'video') && (
                              <div className="w-full max-w-4xl mx-auto aspect-video bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center">
                                {resource.url ? (
                                  <iframe
                                    src={resource.url.includes('watch?v=') ? resource.url.replace('watch?v=', 'embed/') : resource.url}
                                    className="w-full h-full"
                                    allowFullScreen
                                  />
                                ) : (
                                  <div className="flex flex-col items-center text-slate-500">
                                    <VideoIcon className="h-8 w-8 mb-2 opacity-50" />
                                    <p className="text-xs">Video source missing.</p>
                                  </div>
                                )}
                              </div>
                            )}

                            {resource.type === 'audio' && (
                              <div className="w-full max-w-2xl mx-auto bg-slate-900 rounded-xl p-6 md:p-8 border border-white/10 shadow-2xl flex flex-col items-center justify-center gap-6">
                                <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center border-2 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                                  <Headphones className="w-10 h-10 text-purple-400" />
                                </div>
                                <div className="text-center space-y-2">
                                  <h3 className="text-lg font-bold text-white">{resource.title}</h3>
                                  <p className="text-sm text-slate-400">Listen to the audio lesson</p>
                                </div>
                                {resource.url ? (
                                  <audio controls className="w-full h-12 outline-none rounded-full" controlsList="nodownload">
                                    <source src={resource.url} />
                                    Your browser does not support the audio element.
                                  </audio>
                                ) : (
                                  <p className="text-xs text-slate-500">Audio source missing.</p>
                                )}
                              </div>
                            )}

                            {resource.type === 'pdf' && (
                              <div className="w-full h-full min-h-[60vh] max-w-5xl mx-auto bg-slate-950 rounded-xl overflow-hidden border border-white/10 shadow-2xl flex flex-col">
                                {resource.url ? (
                                  <iframe src={`${resource.url}#view=FitH`} className="w-full flex-1 min-h-[60vh]" title={resource.title} />
                                ) : (
                                  <div className="flex flex-col items-center justify-center flex-1 text-slate-500">
                                    <FileText className="h-8 w-8 mb-2 opacity-50" />
                                    <p className="text-xs">PDF source missing.</p>
                                  </div>
                                )}
                                {resource.url && (
                                  <div className="p-4 border-t border-white/10 bg-slate-900 flex justify-end">
                                    <a
                                      href={resource.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold rounded-lg transition-all"
                                    >
                                      <ExternalLink className="h-4 w-4" /> Open PDF Externally
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}

                            {resource.type === 'docx' && (
                              <div className="w-full h-full min-h-[60vh] max-w-5xl mx-auto bg-slate-950 rounded-xl overflow-hidden border border-white/10 shadow-2xl flex flex-col">
                                {resource.url ? (
                                  <iframe
                                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(resource.url)}`}
                                    className="w-full flex-1 min-h-[60vh]"
                                    title={resource.title}
                                  />
                                ) : (
                                  <div className="flex flex-col items-center justify-center flex-1 text-slate-500 bg-slate-900">
                                    <File className="h-8 w-8 mb-2 opacity-50" />
                                    <p className="text-xs">Document source missing.</p>
                                  </div>
                                )}
                                {resource.url && (
                                  <div className="p-4 border-t border-white/10 bg-slate-900 flex justify-between items-center">
                                    <p className="text-xs text-slate-500">If the document doesn't load, try downloading it.</p>
                                    <a
                                      href={resource.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-xs font-semibold rounded-lg transition-all"
                                    >
                                      <Download className="h-4 w-4" /> Download DOCX
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}

                            {(resource.type === 'text' || resource.type === 'assignment') && (
                              <div
                                className="prose prose-invert prose-sm sm:prose-base max-w-none text-slate-300 leading-relaxed"
                                onClick={handleHtmlContentClick}
                              >
                                {resource.content ? (
                                  <div dangerouslySetInnerHTML={{ __html: resource.content }} />
                                ) : (
                                  <div className="flex flex-col items-center justify-center h-32 text-slate-500 border-2 border-dashed border-white/10 rounded-xl">
                                    <FileText className="h-8 w-8 mb-2 opacity-50" />
                                    <p className="text-xs">No text provided.</p>
                                  </div>
                                )}
                                {resource.url && (
                                  <div className="mt-6 pt-4 border-t border-white/10">
                                    <a
                                      href={resource.url}
                                      target="_self"
                                      className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 text-xs font-semibold rounded-lg transition-all"
                                    >
                                      <ExternalLink className="h-3 w-3" /> Open External
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}

                            {resource.type === 'mcq' && resource.mcqData && (
                              <div className="max-w-2xl mx-auto space-y-4">
                                <div className="bg-slate-950 p-4 sm:p-6 rounded-xl border border-white/10 relative overflow-hidden">
                                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                                  <h3 className="text-base sm:text-lg font-bold text-white mb-4">{resource.mcqData.question}</h3>
                                  <div className="space-y-2">
                                    {resource.mcqData.options.map((opt, idx) => {
                                      const isSelected = mcqAnswers[resource.id] === idx;
                                      const isSubmitted = mcqSubmitted[resource.id];
                                      const isCorrect = idx === resource?.mcqData?.correctAnswerIndex;

                                      let btnClass = 'w-full text-left p-2.5 sm:p-3 rounded-lg border transition-all flex items-center gap-2 group ';
                                      let circleClass =
                                        'w-6 h-6 sm:w-7 sm:h-7 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 transition-colors ';

                                      if (isSubmitted) {
                                        if (isCorrect) {
                                          btnClass += 'bg-emerald-500/20 border-emerald-500/50 text-white';
                                          circleClass += 'bg-emerald-500 text-white border-emerald-500';
                                        } else if (isSelected && !isCorrect) {
                                          btnClass += 'bg-red-500/20 border-red-500/50 text-white';
                                          circleClass += 'bg-red-500 text-white border-red-500';
                                        } else {
                                          btnClass += 'bg-slate-900/50 border-white/5 text-slate-500 opacity-50';
                                          circleClass += 'bg-slate-950 border-white/5 text-slate-600';
                                        }
                                      } else {
                                        if (isSelected) {
                                          btnClass += 'bg-amber-500/20 border-amber-500/50 text-white shadow-[0_0_10px_rgba(251,191,36,0.15)]';
                                          circleClass += 'bg-amber-500 text-white border-amber-500';
                                        } else {
                                          btnClass += 'bg-slate-900/50 border-white/10 text-slate-300 hover:bg-slate-800 hover:border-amber-500/50';
                                          circleClass +=
                                            'bg-slate-950 border-white/10 text-slate-400 group-hover:text-amber-400 group-hover:border-amber-500/50';
                                        }
                                      }

                                      return (
                                        <button
                                          key={idx}
                                          disabled={isSubmitted}
                                          onClick={() => setMcqAnswers(prev => ({ ...prev, [resource.id]: idx }))}
                                          className={btnClass}
                                        >
                                          <div className={circleClass}>{String.fromCharCode(65 + idx)}</div>
                                          <span className="text-xs sm:text-sm font-medium">{opt}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                                  <div className="text-xs font-medium w-full sm:w-auto text-center sm:text-left flex flex-col justify-center">
                                    {mcqSubmitted[resource.id] &&
                                      (mcqAnswers[resource.id] === resource.mcqData.correctAnswerIndex ? (
                                        <span className="text-emerald-400 flex items-center justify-center sm:justify-start gap-1">
                                          <CheckCircle2 className="w-4 h-4" /> Correct Answer!
                                        </span>
                                      ) : (
                                        <span className="text-red-400 flex items-center justify-center sm:justify-start gap-1">
                                          <X className="w-4 h-4" /> Incorrect.
                                        </span>
                                      ))}
                                    {mcqSubmitted[resource.id] && autoNextCountdown !== null && (
                                      <span className="text-teal-400/80 text-[10px] mt-1 flex items-center">
                                        <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Next in {autoNextCountdown}s...
                                      </span>
                                    )}
                                  </div>
                                  <Button
                                    disabled={mcqAnswers[resource.id] === undefined || mcqSubmitted[resource.id]}
                                    onClick={() => setMcqSubmitted(prev => ({ ...prev, [resource.id]: true }))}
                                    className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-white font-bold h-10 px-6 rounded-lg text-xs"
                                  >
                                    Submit
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between shrink-0">
                            <Button
                              variant="outline"
                              onClick={handlePrev}
                              disabled={!hasPrev}
                              className="bg-transparent border-white/10 text-slate-300 hover:bg-white/5 disabled:opacity-30 h-10 px-3 sm:px-4 rounded-lg text-xs"
                            >
                              <ChevronLeft className="w-4 h-4 sm:mr-1" />
                              <span className="hidden sm:inline">Prev</span>
                            </Button>

                            {hasNext ? (
                              <Button
                                variant="outline"
                                onClick={handleNext}
                                className="bg-transparent border-white/10 text-slate-300 hover:bg-white/5 h-10 px-3 sm:px-4 rounded-lg relative overflow-hidden group text-xs"
                              >
                                {autoNextCountdown !== null && mcqSubmitted[resource.id] && (
                                  <div
                                    className="absolute inset-0 bg-teal-500/10 group-hover:bg-teal-500/20 transition-all z-0"
                                    style={{ width: `${(5 - autoNextCountdown) * 20}%` }}
                                  />
                                )}
                                <span className="hidden sm:inline relative z-10">Next</span>
                                <ChevronRight className="w-4 h-4 sm:ml-1 relative z-10" />
                              </Button>
                            ) : (
                              <Button
                                onClick={handleMarkAsComplete}
                                disabled={isSavingProgress}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium h-10 px-3 sm:px-4 rounded-lg shadow-lg relative overflow-hidden group text-xs"
                              >
                                {isSavingProgress ? (
                                  <Loader2 className="w-4 h-4 sm:mr-1 animate-spin relative z-10" />
                                ) : (
                                  <CheckCircle2 className="w-4 h-4 sm:mr-1 relative z-10" />
                                )}
                                <span className="hidden sm:inline relative z-10">{selectedClass.status === 'completed' ? 'Done' : 'Complete'}</span>
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 p-4 text-center">
                    <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center border border-white/5 mb-3 shadow-inner">
                      <BookOpen className="h-6 w-6 text-slate-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-400">Select Resource</h3>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl overflow-hidden"
          >
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                initial={{ opacity: 1, x: '50vw', y: '50vh', scale: 0 }}
                animate={{
                  x: `${Math.random() * 100}vw`,
                  y: `${Math.random() * 100}vh`,
                  scale: [0, Math.random() * 1.5 + 0.5, 0],
                  rotate: Math.random() * 360,
                }}
                transition={{ duration: 2 + Math.random() * 3, ease: 'easeOut', repeat: Infinity }}
                className={`absolute w-2 h-2 rounded-full ${
                  ['bg-amber-400', 'bg-emerald-400', 'bg-teal-400', 'bg-fuchsia-400', 'bg-orange-500'][i % 5]
                } shadow-[0_0_10px_currentColor]`}
                style={{ top: 0, left: 0 }}
              />
            ))}

            <motion.div
              initial={{ scale: 0.5, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="relative z-10 flex flex-col items-center text-center p-6 md:p-10 w-[90%] max-w-lg bg-slate-900/80 border border-amber-500/30 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.2)] backdrop-blur-xl"
            >
              <motion.div
                animate={{ rotateY: 360, y: [-5, 5, -5] }}
                transition={{
                  rotateY: { duration: 4, repeat: Infinity, ease: 'linear' },
                  y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                }}
                className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.5)] mb-6 border-4 border-amber-200"
              >
                <Trophy className="w-12 h-12 md:w-16 md:h-16 text-white" />
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500 mb-3 leading-tight">
                COMPLETED!
              </h2>

              <p className="text-sm md:text-base text-slate-300 mb-6 leading-relaxed">
                You successfully finished <strong className="text-white">{courseData?.courseTitle || 'the course'}</strong>. Keep up the excellent work!
              </p>

              <Button
                onClick={() => {
                  setShowCelebration(false);
                  router.push('/dashboard/my-course');
                }}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 h-12 rounded-lg text-sm transition-transform hover:scale-105 active:scale-95 shadow-lg"
              >
                Continue Journey
              </Button>
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
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-teal-500 border-t-transparent animate-spin shadow-[0_0_30px_rgba(20,184,166,0.4)]" />
            <p className="text-teal-400 font-bold tracking-[0.2em] text-sm">INITIALIZING</p>
          </div>
        </div>
      }
    >
      <StudentCourseContent />
    </Suspense>
  );
}
```

when I open this page, it will always go down. but I want to scroll -> running class,( for show in UI. )