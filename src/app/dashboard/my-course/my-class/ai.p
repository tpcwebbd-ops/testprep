look at the page.tsx 
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
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useGetCourseByIdQuery } from '@/redux/features/courses/coursesSlice';
import { useGetEnrollmentsQuery } from '@/redux/features/enrollments/enrollmentsSlice';
import { useGetMyCoursesQuery, useUpdateMyCourseMutation, useAddMyCourseMutation } from '@/redux/features/my-courses/myCoursesSlice';
import { useSession } from '@/lib/auth-client';

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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function StudentCourseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get('courseId');

  const session = useSession();
  const userEmail = session?.data?.user?.email || '';
  const userName = session?.data?.user?.name || 'Student';

  // API Hooks
  const { data: enrollmentsData, isLoading: isEnrollmentsLoading } = useGetEnrollmentsQuery({ page: 1, limit: 100, q: userEmail }, { skip: !userEmail });
  const { data: courseResponse, isLoading: isCourseLoading } = useGetCourseByIdQuery(courseId, { skip: !courseId });
  const { data: myCoursesData } = useGetMyCoursesQuery({ page: 1, limit: 100, q: userEmail }, { skip: !userEmail });

  const [updateMyCourse, { isLoading: isUpdatingCourse }] = useUpdateMyCourseMutation();
  const [addMyCourse, { isLoading: isAddingCourse }] = useAddMyCourseMutation();

  const isSavingProgress = isUpdatingCourse || isAddingCourse;
  const courseData = courseResponse?.data;

  // Local States
  const [classes, setClasses] = useState<ProcessedClass[]>([]);
  const [isGameMode, setIsGameMode] = useState(true);
  const [gridColumns, setGridColumns] = useState<1 | 2 | 3>(3);
  const [selectedClass, setSelectedClass] = useState<ProcessedClass | null>(null);
  const [activeResourceTab, setActiveResourceTab] = useState<string | null>(null);

  // Progress/Activity States
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});
  const [mcqSubmitted, setMcqSubmitted] = useState<Record<string, boolean>>({});
  const [viewedResources, setViewedResources] = useState<Set<string>>(new Set());
  const [autoNextCountdown, setAutoNextCountdown] = useState<number | null>(null);

  // Celebration Overlay State
  const [showCelebration, setShowCelebration] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Bottom Taskbar States
  const [isTaskbarVisible, setIsTaskbarVisible] = useState(true);
  const [isStatsExpanded, setIsStatsExpanded] = useState(false);

  const timelineBottomRef = useRef<HTMLDivElement>(null);

  // Access Checks & Record Fetch
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
        console.error('Failed to add completion state.', err);
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
      console.error('Failed to update status', err);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeResourceTab, mcqSubmitted, selectedClass]);

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

  const handleHtmlContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    if (anchor) {
      e.preventDefault();
      window.location.href = anchor.href;
    }
  };

  const renderStatsPanel = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
      <div className="flex flex-col gap-2 pb-6 lg:pb-0 lg:pr-8 col-span-2 lg:col-span-1 border-b lg:border-b-0 border-white/10">
        <span className="text-xs md:text-sm text-slate-400 font-bold tracking-wider uppercase flex items-center gap-2">
          <Target className="w-4 h-4 text-teal-500" /> Completion Progress
        </span>
        <div className="flex items-end gap-2 mt-1">
          <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
            {progressStats.percentage}%
          </span>
        </div>
        <div className="w-full bg-slate-900 h-2.5 rounded-full mt-3 overflow-hidden shadow-inner border border-white/5">
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

      <div className="flex flex-col gap-1 lg:px-8 pt-6 lg:pt-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-emerald-500/10 rounded-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-xs md:text-sm text-slate-400 font-bold tracking-wider uppercase">Mastered</span>
        </div>
        <span className="text-3xl md:text-4xl font-black text-emerald-400">{progressStats.completed}</span>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Modules Done</span>
      </div>

      <div className="flex flex-col gap-1 lg:px-8 pt-6 lg:pt-0 border-l border-white/10 pl-6 lg:border-l-0 lg:pl-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-amber-500/10 rounded-md">
            <PlayCircle className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-xs md:text-sm text-slate-400 font-bold tracking-wider uppercase">In Progress</span>
        </div>
        <span className="text-3xl md:text-4xl font-black text-amber-400">{progressStats.active}</span>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Active Modules</span>
      </div>

      <div className="flex flex-col gap-1 lg:px-8 pt-6 lg:pt-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-slate-800 rounded-md">
            <Lock className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-xs md:text-sm text-slate-400 font-bold tracking-wider uppercase">Locked Ahead</span>
        </div>
        <span className="text-3xl md:text-4xl font-black text-slate-300">{progressStats.remaining}</span>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Modules Left</span>
      </div>
    </div>
  );

  const isLoading = isCourseLoading || isEnrollmentsLoading;
  const courseTitleDisplay = isCourseLoading ? 'Loading Workspace...' : (courseData?.courseTitle ?? 'My Learning Journey');

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#020817] flex items-center justify-center p-4">
        <div className="animate-pulse flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-full border-4 border-teal-500 border-t-transparent animate-spin shadow-[0_0_30px_rgba(20,184,166,0.4)]" />
          <p className="text-teal-400 font-bold tracking-[0.2em] text-lg">INITIALIZING SYSTEM</p>
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
          className="relative z-10 max-w-lg w-full bg-slate-900/80 backdrop-blur-xl border border-red-500/20 rounded-3xl p-8 md:p-10 text-center shadow-2xl shadow-red-500/10"
        >
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-black text-white mb-3 tracking-tight">Access Restricted</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            You currently do not have active access to this course. This might be because your enrollment is pending approval, payment is incomplete, or your
            student status is inactive.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push('/dashboard/my-course')}
              variant="outline"
              className="bg-transparent border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 h-12 px-6 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Return to Courses
            </Button>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen mt-[65px] bg-[#020817] text-slate-200 selection:bg-teal-500/30 overflow-x-hidden font-sans pb-32 md:pb-48 relative select-none">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-900/20 via-[#020817] to-[#020817] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 lg:pt-16 relative z-10 space-y-8">
        <AnimatePresence>
          {!isGameMode && (
            <motion.header
              initial={{ opacity: 0, y: -50, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -50, height: 0 }}
              className="relative w-full mb-8"
            >
              <div className="bg-slate-900/60 backdrop-blur-3xl border border-teal-500/30 rounded-[2rem] shadow-[0_0_50px_rgba(20,184,166,0.15)] overflow-hidden flex flex-col relative">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 translate-x-1/3" />

                <div className="p-6 md:p-8 lg:p-10 flex flex-col xl:flex-row gap-8 justify-between items-start xl:items-center relative z-10">
                  <div className="flex items-start md:items-center gap-5 md:gap-6 w-full xl:w-auto">
                    <Button
                      onClick={() => router.push('/dashboard/my-course')}
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-slate-800/50 hover:bg-slate-700 text-white border border-white/5 h-12 w-12 md:h-14 md:w-14 shrink-0 transition-transform hover:-translate-x-1 shadow-lg mt-1 md:mt-0"
                    >
                      <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div>
                      <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-teal-100 to-teal-400 tracking-tight leading-tight">
                        {courseTitleDisplay}
                      </h1>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-950/50 p-2 md:p-3 rounded-2xl border border-white/10 shrink-0 w-full xl:w-auto overflow-x-auto custom-scrollbar justify-start xl:justify-end shadow-inner">
                    <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-900/80 rounded-xl border border-white/5 transition-all hover:bg-slate-800">
                      <div className="p-1.5 md:p-2 rounded-lg transition-colors bg-slate-800 text-slate-400">
                        <Gamepad2 className="h-4 w-4 md:h-5 md:w-5" />
                      </div>
                      <div className="flex flex-col mr-2 shrink-0">
                        <span className="text-sm font-bold text-white leading-none">Game Mode</span>
                        <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Disabled</span>
                      </div>
                      <Switch checked={isGameMode} onCheckedChange={setIsGameMode} className="data-[state=checked]:bg-amber-500 ml-2" />
                    </div>

                    <div className="flex gap-1">
                      {[
                        { val: 1, icon: <List className="h-4 w-4 md:h-5 md:w-5" /> },
                        { val: 2, icon: <LayoutGrid className="h-4 w-4 md:h-5 md:w-5" /> },
                        { val: 3, icon: <LayoutGrid className="h-4 w-4 md:h-5 md:w-5" /> },
                      ].map((btn, i) => (
                        <button
                          key={i}
                          onClick={() => setGridColumns(btn.val as 1 | 2 | 3)}
                          className={`flex items-center justify-center h-11 w-11 md:h-12 md:w-12 rounded-xl transition-all ${
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

                <div className="bg-slate-950/40 border-t border-white/5 p-6 md:p-8 lg:px-10 relative z-10">{renderStatsPanel()}</div>
              </div>
            </motion.header>
          )}
        </AnimatePresence>

        {classes.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-teal-400 font-medium tracking-widest">NO CONTENT AVAILABLE</p>
          </div>
        ) : (
          <div className="mt-12 relative">
            {isGameMode ? (
              <div className="relative py-10 max-w-4xl mx-auto flex flex-col items-center">
                <div className="absolute top-[50px] bottom-[50px] left-[28px] md:left-1/2 w-1.5 bg-slate-800 -translate-x-1/2 rounded-full overflow-hidden z-0">
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
                  className={`relative z-10 flex flex-col items-center justify-center w-28 h-28 rounded-full border-4 shadow-[0_0_30px_rgba(245,158,11,0.3)] mb-16 ml-[56px] md:ml-0 transition-colors duration-1000 ${progressStats.percentage === 100 ? 'bg-gradient-to-b from-amber-400 to-orange-500 border-amber-200' : 'bg-gradient-to-b from-slate-900 to-slate-950 border-amber-500'}`}
                >
                  <Award className={`h-8 w-8 mb-1 ${progressStats.percentage === 100 ? 'text-white' : 'text-amber-400'}`} />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider text-center leading-tight ${progressStats.percentage === 100 ? 'text-white' : 'text-white'}`}
                  >
                    Completed
                    <br />
                    Your Goal!
                  </span>
                </motion.div>

                <div className="w-full space-y-12 md:space-y-24 flex flex-col items-start md:items-center">
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
                        viewport={{ once: true, margin: '-100px' }}
                        variants={{
                          hidden: { opacity: 0, y: 50 },
                          visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } },
                        }}
                        className={`relative flex items-center w-full group ml-[56px] md:ml-0 ${isLeft ? 'md:justify-start' : 'md:justify-end'}`}
                      >
                        <div
                          className={`absolute left-[-28px] md:left-1/2 w-14 h-14 -translate-x-1/2 rounded-full border-4 flex items-center justify-center z-10 transition-transform duration-300 ${
                            isLocked ? '' : 'cursor-pointer hover:scale-110'
                          } ${nodeColor} ${glow}`}
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
                                    : cls.status === 'active'
                                      ? 'bg-amber-500/10 text-amber-400'
                                      : 'bg-slate-800 text-slate-500'
                                }`}
                              >
                                Module {cls.day}
                              </span>
                              <div className="flex gap-1.5">
                                {cls.resources.map(r => (
                                  <div key={r.id} className="p-1.5 bg-slate-950 rounded-md border border-white/5">
                                    {getResourceIcon(r.type, 'h-3 w-3')}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <h3 className={`text-xl font-bold mb-2 line-clamp-2 ${cls.status === 'completed' ? 'text-emerald-300' : 'text-white'}`}>
                              {cls.title}
                            </h3>
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

                <motion.div
                  ref={timelineBottomRef}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  className="relative z-10 flex flex-col items-center justify-center w-28 h-28 rounded-full bg-gradient-to-b from-slate-900 to-slate-950 border-4 border-teal-500 shadow-[0_0_30px_rgba(20,184,166,0.3)] mt-16 ml-[56px] md:ml-0"
                >
                  <Rocket className="h-8 w-8 text-teal-400 mb-1" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider text-center leading-tight">
                    Start Your
                    <br />
                    Journey
                  </span>
                </motion.div>
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
                                  : cls.status === 'active'
                                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                    : 'bg-slate-800 border-white/5 text-slate-500'
                              }`}
                            >
                              {cls.status === 'completed' ? (
                                <CheckCircle2 className="h-6 w-6" />
                              ) : cls.status === 'active' ? (
                                <PlayCircle className="h-6 w-6" />
                              ) : (
                                <Lock className="h-6 w-6" />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Module {cls.day}</span>
                              <span
                                className={`text-xs font-bold px-2 py-0.5 rounded text-center w-fit ${
                                  cls.status === 'completed'
                                    ? 'bg-emerald-500/20 text-emerald-300'
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

                        <h3
                          className={`text-xl font-bold mb-3 line-clamp-2 leading-tight transition-colors ${cls.status === 'completed' ? 'text-emerald-400' : 'text-white group-hover:text-teal-400'}`}
                        >
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
        {isGameMode && isTaskbarVisible && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-[60] bg-slate-950/90 backdrop-blur-2xl border-t border-teal-500/30 shadow-[0_-10px_50px_rgba(20,184,166,0.15)]"
          >
            <div className="absolute left-1/2 -translate-x-1/2 -top-6 z-[61]">
              <button
                onClick={() => setIsStatsExpanded(!isStatsExpanded)}
                className="bg-slate-900 border border-teal-500/50 p-2.5 rounded-full shadow-[0_0_15px_rgba(20,184,166,0.4)] hover:bg-slate-800 hover:text-teal-400 transition-colors animate-bounce text-white focus:outline-none"
              >
                <motion.div animate={{ rotate: isStatsExpanded ? 180 : 0 }}>
                  <ChevronUp className="w-5 h-5" />
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
                  <div className="p-6 md:p-8 max-w-7xl mx-auto">{renderStatsPanel()}</div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="h-[72px] md:h-[88px] w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 max-w-[1600px] mx-auto">
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <Button
                  onClick={() => router.push('/dashboard/my-course')}
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-slate-800/80 hover:bg-slate-700 text-white border border-white/5 h-10 w-10 md:h-12 md:w-12 shrink-0 transition-transform hover:-translate-x-1 shadow-lg"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex flex-col min-w-0 hidden sm:flex overflow-hidden">
                  <h2 className="text-sm md:text-base lg:text-lg font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-teal-100 to-teal-400 truncate leading-tight">
                    {courseTitleDisplay}
                  </h2>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center gap-3 shrink-0 hidden md:flex">
                <Target className="w-5 h-5 text-teal-500 shrink-0" />
                <div className="flex items-center gap-2">
                  <span className="text-xl lg:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                    {progressStats.percentage}%
                  </span>
                  <span className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Completed</span>
                </div>
                <div className="h-2 w-full max-w-[120px] lg:max-w-[200px] bg-slate-800 rounded-full overflow-hidden shadow-inner border border-white/5 ml-2 relative">
                  <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full" style={{ width: `${progressStats.percentage}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 sm:gap-4 flex-1">
                <div className="flex items-center gap-1.5 md:hidden bg-slate-900/80 px-2 py-1 rounded-lg border border-white/5 shrink-0">
                  <Target className="w-3.5 h-3.5 text-teal-500" />
                  <span className="text-xs font-black text-emerald-400">{progressStats.percentage}%</span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 bg-slate-900/80 px-2 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-white/5 shadow-inner shrink-0">
                  <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  <span className="text-[10px] sm:text-xs font-bold text-slate-300 hidden xl:block uppercase tracking-widest">Game Mode</span>
                  <Switch checked={isGameMode} onCheckedChange={setIsGameMode} className="data-[state=checked]:bg-amber-500 scale-[0.7] sm:scale-100" />
                </div>

                <div className="w-px h-6 sm:h-8 bg-white/10 hidden sm:block shrink-0"></div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsTaskbarVisible(false)}
                  className="rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors h-8 w-8 sm:h-10 sm:w-10 shrink-0"
                  aria-label="Close Taskbar"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
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
            className="fixed bottom-6 right-6 z-50 bg-teal-600 p-4 rounded-full shadow-[0_0_30px_rgba(13,148,136,0.6)] text-white hover:bg-teal-500 transition-all hover:scale-110 active:scale-95"
            aria-label="Show Dashboard Taskbar"
          >
            <LayoutGrid className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedClass && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-[65px] inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full h-full flex bg-[#020817] text-white overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

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
                className={`absolute lg:relative top-0 left-0 h-full w-[85%] sm:w-80 bg-slate-950/95 lg:bg-slate-950/80 border-r border-white/10 flex flex-col shrink-0 z-[70] lg:z-10 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none ${
                  isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
              >
                <div className="p-6 border-b border-white/10 flex items-start justify-between bg-slate-950">
                  <div>
                    <span className="text-xs font-bold text-teal-400 tracking-widest uppercase mb-1 block">Module {selectedClass.day}</span>
                    <h2 className="text-xl font-bold leading-tight line-clamp-2">{selectedClass.title}</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
                        closeClassModal();
                      } else {
                        setIsMobileSidebarOpen(false);
                      }
                    }}
                    className="shrink-0 rounded-full bg-white/5 hover:bg-white/10 hover:text-red-400 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2 mb-3">Course Material</h3>
                  {selectedClass.resources.length === 0 ? (
                    <div className="p-4 text-center text-slate-500 text-sm border border-dashed border-white/10 rounded-xl bg-white/5">
                      No resources available.
                    </div>
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
                          className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all duration-200 border ${
                            isActive
                              ? 'bg-teal-500/10 border-teal-500/30 shadow-[inset_0_0_20px_rgba(20,184,166,0.1)]'
                              : 'border-transparent hover:bg-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className={`p-2 rounded-lg shrink-0 ${isActive ? 'bg-teal-500/20' : 'bg-slate-900'}`}>{getResourceIcon(resource.type)}</div>
                            <div className="flex flex-col overflow-hidden">
                              <span className={`text-sm font-semibold truncate ${isActive ? 'text-teal-400' : 'text-slate-200'}`}>{resource.title}</span>
                              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{resource.type}</span>
                            </div>
                          </div>
                          {isResourceCompleted && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 ml-2" />}
                        </button>
                      );
                    })
                  )}
                </div>

                <div className="p-4 border-t border-white/10 bg-slate-950">
                  <Button
                    className={`w-full font-bold h-12 rounded-xl shadow-lg transition-all ${
                      selectedClass.status === 'completed'
                        ? 'bg-emerald-600/50 border border-emerald-500/50 text-emerald-100 hover:bg-emerald-600/70'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
                    }`}
                    onClick={handleMarkAsComplete}
                    disabled={isSavingProgress}
                  >
                    {isSavingProgress ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <CheckCircle2 className="h-5 w-5 mr-2" />}
                    {selectedClass.status === 'completed' ? 'Re-complete Module' : 'Mark Module as Completed'}
                  </Button>
                </div>
              </div>

              <div className="flex-1 bg-[#020817] relative z-10 overflow-y-auto custom-scrollbar h-full w-full flex flex-col">
                <div className="lg:hidden sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between p-4 shadow-xl">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-1.5 bg-teal-500/20 text-teal-400 rounded-lg shrink-0">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-bold text-white truncate">
                      {selectedClass.resources.find(r => r.id === activeResourceTab)?.title || 'Overview'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMobileSidebarOpen(true)}
                      className="rounded-xl bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 hover:text-teal-300 h-10 w-10"
                    >
                      <AlignRight className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={closeClassModal}
                      className="rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 h-10 w-10"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {activeResourceTab ? (
                  <div className="p-4 sm:p-6 lg:p-12 max-w-5xl mx-auto h-full flex flex-col w-full">
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
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex flex-col h-full space-y-4 lg:space-y-6"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-4 lg:pb-6 border-b border-white/10 shrink-0">
                            <div className="p-3 bg-slate-900 border border-white/10 rounded-2xl shadow-inner w-fit">
                              {getResourceIcon(resource.type, 'h-6 w-6 sm:h-8 sm:w-8')}
                            </div>
                            <div>
                              <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-white leading-tight">{resource.title}</h2>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-widest">
                                  {resource.type}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex-1 min-h-0 bg-slate-900/40 border border-white/5 rounded-3xl p-4 sm:p-6 lg:p-8 overflow-y-auto backdrop-blur-sm shadow-2xl relative">
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
                                    <VideoIcon className="h-12 w-12 mb-4 opacity-50" />
                                    <p className="font-medium text-sm">Video source missing.</p>
                                  </div>
                                )}
                              </div>
                            )}

                            {(resource.type === 'text' || resource.type === 'assignment') && (
                              <div
                                className="prose prose-invert prose-sm sm:prose-base prose-teal max-w-none text-slate-300 leading-relaxed space-y-4 select-none"
                                onClick={handleHtmlContentClick}
                              >
                                {resource.content ? (
                                  <div dangerouslySetInnerHTML={{ __html: resource.content }} />
                                ) : (
                                  <div className="flex flex-col items-center justify-center h-48 text-slate-500 border-2 border-dashed border-white/10 rounded-2xl">
                                    <FileText className="h-10 w-10 mb-4 opacity-50" />
                                    <p className="text-sm">No textual content provided.</p>
                                  </div>
                                )}
                                {resource.url && (
                                  <div className="mt-8 pt-6 border-t border-white/10">
                                    <a
                                      href={resource.url}
                                      target="_self"
                                      className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 hover:text-teal-300 text-sm font-semibold border border-teal-500/20 hover:border-teal-500/50 rounded-xl transition-all"
                                    >
                                      <ExternalLink className="h-4 w-4" /> Open External Resource
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}

                            {resource.type === 'mcq' && resource.mcqData && (
                              <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 select-none">
                                <div className="bg-slate-950 p-5 sm:p-6 lg:p-8 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden">
                                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-6 leading-relaxed">{resource.mcqData.question}</h3>
                                  <div className="space-y-3">
                                    {resource.mcqData.options.map((opt, idx) => {
                                      const isSelected = mcqAnswers[resource.id] === idx;
                                      const isSubmitted = mcqSubmitted[resource.id];
                                      const isCorrect = idx === resource?.mcqData?.correctAnswerIndex;

                                      let btnClass = 'w-full text-left p-3 sm:p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 group ';
                                      let circleClass =
                                        'w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 transition-colors ';

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
                                          btnClass += 'bg-amber-500/20 border-amber-500/50 text-white shadow-[0_0_15px_rgba(251,191,36,0.15)]';
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
                                          <span className="text-sm font-medium">{opt}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4">
                                  <div className="text-sm font-medium w-full sm:w-auto text-center sm:text-left flex flex-col justify-center">
                                    {mcqSubmitted[resource.id] &&
                                      (mcqAnswers[resource.id] === resource.mcqData.correctAnswerIndex ? (
                                        <span className="text-emerald-400 flex items-center justify-center sm:justify-start gap-2">
                                          <CheckCircle2 className="w-5 h-5" /> Correct Answer!
                                        </span>
                                      ) : (
                                        <span className="text-red-400 flex items-center justify-center sm:justify-start gap-2">
                                          <X className="w-5 h-5" /> Incorrect. Try again.
                                        </span>
                                      ))}
                                    {mcqSubmitted[resource.id] && autoNextCountdown !== null && (
                                      <span className="text-teal-400/80 text-xs mt-2 animate-pulse flex items-center">
                                        <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> Moving on in {autoNextCountdown}s...
                                      </span>
                                    )}
                                  </div>
                                  <Button
                                    disabled={mcqAnswers[resource.id] === undefined || mcqSubmitted[resource.id]}
                                    onClick={() => setMcqSubmitted(prev => ({ ...prev, [resource.id]: true }))}
                                    className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-white font-bold h-12 px-8 rounded-xl shadow-lg"
                                  >
                                    Submit Answer
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="pt-2 sm:pt-4 mt-auto border-t border-white/10 flex items-center justify-between shrink-0">
                            <Button
                              variant="outline"
                              onClick={handlePrev}
                              disabled={!hasPrev}
                              className="bg-transparent border-white/10 text-slate-300 hover:bg-white/5 disabled:opacity-30 h-10 sm:h-12 px-4 sm:px-6 rounded-xl"
                            >
                              <ChevronLeft className="w-4 h-4 sm:mr-2" />
                              <span className="hidden sm:inline">Previous</span>
                            </Button>

                            {hasNext ? (
                              <Button
                                variant="outline"
                                onClick={handleNext}
                                className="bg-transparent border-white/10 text-slate-300 hover:bg-white/5 h-10 sm:h-12 px-4 sm:px-6 rounded-xl relative overflow-hidden group"
                              >
                                {autoNextCountdown !== null && mcqSubmitted[resource.id] && (
                                  <div
                                    className="absolute inset-0 bg-teal-500/10 group-hover:bg-teal-500/20 transition-all z-0"
                                    style={{ width: `${(5 - autoNextCountdown) * 20}%` }}
                                  />
                                )}
                                <span className="hidden sm:inline relative z-10">Next Resource</span>
                                <ChevronRight className="w-4 h-4 sm:ml-2 relative z-10" />
                              </Button>
                            ) : (
                              <Button
                                onClick={handleMarkAsComplete}
                                disabled={isSavingProgress}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium h-10 sm:h-12 px-4 sm:px-6 rounded-xl shadow-lg transition-all relative overflow-hidden group"
                              >
                                {autoNextCountdown !== null && mcqSubmitted[resource.id] && (
                                  <div
                                    className="absolute inset-0 bg-emerald-400/20 transition-all z-0"
                                    style={{ width: `${(5 - autoNextCountdown) * 20}%` }}
                                  />
                                )}
                                {isSavingProgress ? (
                                  <Loader2 className="w-4 h-4 sm:mr-2 animate-spin relative z-10" />
                                ) : (
                                  <CheckCircle2 className="w-4 h-4 sm:mr-2 relative z-10" />
                                )}
                                <span className="hidden sm:inline relative z-10">
                                  {selectedClass.status === 'completed' ? 'Module Re-completed' : 'Complete Module'}
                                </span>
                                <span className="inline sm:hidden relative z-10">Complete</span>
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8 text-center space-y-4">
                    <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center border border-white/5 mb-4 shadow-inner">
                      <BookOpen className="h-8 w-8 text-slate-600" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-400">Select a Resource</h3>
                    <p className="max-w-md text-sm">Choose an item from the sidebar to start learning and unlocking your potential.</p>
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
            {[...Array(40)].map((_, i) => (
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
                className={`absolute w-3 h-3 rounded-full ${
                  ['bg-amber-400', 'bg-emerald-400', 'bg-teal-400', 'bg-fuchsia-400', 'bg-orange-500'][i % 5]
                } shadow-[0_0_15px_currentColor]`}
                style={{ top: 0, left: 0 }}
              />
            ))}

            <motion.div
              initial={{ scale: 0.5, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="relative z-10 flex flex-col items-center text-center p-8 md:p-12 w-[90%] max-w-2xl bg-slate-900/50 border border-amber-500/30 rounded-3xl shadow-[0_0_100px_rgba(245,158,11,0.2)] backdrop-blur-xl"
            >
              <motion.div
                animate={{ rotateY: 360, y: [-10, 10, -10] }}
                transition={{
                  rotateY: { duration: 4, repeat: Infinity, ease: 'linear' },
                  y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                }}
                className="w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(245,158,11,0.6)] mb-8 border-4 border-amber-200"
              >
                <Trophy className="w-16 h-16 md:w-24 md:h-24 text-white" />
              </motion.div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500 mb-4 tracking-tight leading-tight">
                CONGRATULATIONS!
              </h2>

              <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
                You have successfully completed <strong className="text-white">{courseData?.courseTitle || 'the course'}</strong>. Your dedication and hard work
                have paid off. Keep pushing the boundaries of your knowledge!
              </p>

              <Button
                onClick={() => {
                  setShowCelebration(false);
                  router.push('/dashboard/my-course');
                }}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-8 h-14 rounded-xl text-lg transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(245,158,11,0.3)]"
              >
                Continue Your Journey
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

Implement those features in this page.tsx 
1. Remove padding and margin as much as you can. 
2. In model every content render with scroll bar looks bad. fix it.
3. make it responsive for mobile, desktop, and laptop.