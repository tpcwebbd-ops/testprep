'use client';

import React, { useState, useMemo } from 'react';
import { useGetCoursesQuery } from '@/redux/features/course/courseSlice';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Lock, Check, Star, Play, FileText, X, ChevronRight, Trophy } from 'lucide-react';

/*
|-----------------------------------------
| Types & Interfaces
|-----------------------------------------
*/

interface ContentData {
  uid: string;
  name: string;
  description?: string;
  totalMarks?: number;
  url?: string;
  [key: string]: any;
}

interface CourseContentItem {
  id: string;
  key: string;
  name: string;
  type: string;
  heading?: string;
  data: ContentData;
}

interface Course {
  _id: string;
  courseName: string;
  courseDay: string;
  isActive: boolean;
  content: CourseContentItem[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface ContentProgress {
  contentId: string;
  isComplete: boolean;
}

interface CourseProgress {
  courseId: string;
  completeContent: ContentProgress[];
  isComplete: boolean;
}

interface EnrichedCourse extends Course {
  status: 'locked' | 'current' | 'completed';
}

interface LevelNodeProps {
  course: EnrichedCourse;
  index: number;
  onClick: (course: EnrichedCourse) => void;
  isLast: boolean;
}

/*
|-----------------------------------------
| Helper Functions
|-----------------------------------------
*/

const getDayNumber = (dayStr: string): number => {
  const match = dayStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : 999;
};

/*
|-----------------------------------------
| Components
|-----------------------------------------
*/

const LevelNode = ({ course, index, onClick, isLast }: LevelNodeProps) => {
  const isLeft = index % 2 === 0;
  const { status } = course;

  // FIX: Explicitly separate transitions for scale (spring) and rotate (tween/keyframes)
  const nodeVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: 'spring', stiffness: 260, damping: 20, delay: index * 0.1 },
    },
    hover: {
      scale: 1.1,
      rotate: status === 'current' ? [0, -5, 5, 0] : 0,
      transition: {
        scale: { type: 'spring', stiffness: 300 },
        rotate: { type: 'tween', duration: 0.4, ease: 'easeInOut' },
      },
    },
  };

  const starVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className={`relative flex w-full ${isLeft ? 'justify-start md:justify-end pr-0 md:pr-[50%]' : 'justify-end md:justify-start pl-0 md:pl-[50%]'} mb-24`}>
      {/* Connector Line (The Path) */}
      {!isLast && (
        <div
          className={`absolute top-20 h-28 w-1 border-l-4 border-dotted 
          ${status === 'completed' ? 'border-green-500' : 'border-slate-300'}
          left-1/2 -ml-[2px] -z-10`}
        />
      )}

      {/* The Button */}
      <motion.button
        variants={nodeVariants}
        initial="hidden"
        animate="visible"
        whileHover={status !== 'locked' ? 'hover' : undefined}
        whileTap={status !== 'locked' ? { scale: 0.9 } : undefined}
        onClick={() => status !== 'locked' && onClick(course)}
        disabled={status === 'locked'}
        className={`
          relative z-10 flex flex-col items-center justify-center
          w-20 h-20 md:w-24 md:h-24 rounded-full border-b-8 shadow-xl transition-colors duration-300
          ${
            status === 'completed'
              ? 'bg-green-500 border-green-700 text-white'
              : status === 'current'
                ? 'bg-blue-500 border-blue-700 text-white ring-4 ring-blue-200'
                : 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed'
          }
        `}
      >
        {status === 'completed' && <Check size={32} strokeWidth={3} />}
        {status === 'current' && <Play size={32} fill="currentColor" />}
        {status === 'locked' && <Lock size={28} />}

        {/* Stars decoration for completed */}
        {status === 'completed' && (
          <motion.div variants={starVariants} initial="hidden" animate="visible" className="absolute -top-6 flex gap-1">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <Star size={20} className="text-yellow-400 fill-yellow-400 -mt-2" />
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
          </motion.div>
        )}
      </motion.button>

      {/* Label Tooltip */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 + index * 0.1 }}
        className={`absolute top-5 ${isLeft ? 'left-24 md:left-auto md:right-[calc(50%+4rem)] text-left md:text-right' : 'right-24 md:right-auto md:left-[calc(50%+4rem)] text-right md:text-left'} 
          min-w-[120px]`}
      >
        <h3 className="font-black text-slate-700 text-lg leading-tight uppercase tracking-wide">{course.courseDay}</h3>
        <p className="text-xs font-medium text-slate-500 truncate max-w-[150px] bg-white/80 px-2 py-1 rounded-md inline-block shadow-sm backdrop-blur-sm border border-slate-100">
          {course.courseName}
        </p>
      </motion.div>
    </div>
  );
};

const ContentModal = ({ course, isOpen, onClose }: { course: EnrichedCourse | null; isOpen: boolean; onClose: () => void }) => {
  if (!isOpen || !course) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 m-auto z-50 w-[90%] max-w-lg h-fit max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Play size={100} fill="currentColor" />
              </div>
              <button onClick={onClose} className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition backdrop-blur-md">
                <X size={20} />
              </button>

              <div className="relative z-10">
                <span className="inline-block px-3 py-1 bg-blue-500/50 border border-blue-400/30 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                  Level Unlocked
                </span>
                <h2 className="text-3xl font-black tracking-tight">{course.courseDay}</h2>
                <p className="opacity-90 font-medium text-blue-100">{course.courseName}</p>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50 flex-1">
              {course.content.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center">
                  <div className="bg-slate-200 p-4 rounded-full mb-3">
                    <Lock size={32} />
                  </div>
                  <p className="font-medium">No missions available for this day yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {course.content.map(item => (
                    <div
                      key={item.id}
                      className="group flex items-center p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div
                        className={`
                        w-12 h-12 rounded-xl flex items-center justify-center mr-4 shrink-0 transition-transform group-hover:scale-110
                        ${item.type.toLowerCase().includes('video') ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-indigo-500'}
                      `}
                      >
                        {item.type.toLowerCase().includes('video') ? <Play size={20} fill="currentColor" /> : <FileText size={20} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 text-sm truncate pr-2">{item.heading || item.name}</h4>
                        <p className="text-xs text-slate-500 font-medium capitalize flex items-center gap-1">
                          {item.type}
                          {item.data?.totalMarks && <span className="text-orange-500">• {item.data.totalMarks} Marks</span>}
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-white flex justify-between items-center">
              <div className="text-xs text-slate-400 font-medium">{course.content.length} Tasks available</div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-900 transition shadow-lg shadow-slate-200"
              >
                Continue Journey
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Page = () => {
  const { data: coursesData, isLoading, error } = useGetCoursesQuery({ page: 1, limit: 1000, q: '' });
  const [selectedCourse, setSelectedCourse] = useState<EnrichedCourse | null>(null);

  // User Progress Mock Data (As per prompt)
  const completeContent: CourseProgress[] = [
    {
      courseId: '693a985355fe2dff9a139193',
      completeContent: [
        { contentId: 'video-video-uid-1-1766560822726', isComplete: true },
        { contentId: 'Videos-video-uid-1-1766664024187', isComplete: true },
        { contentId: 'Assignments-assignment-uid-1-1771313648025', isComplete: false },
      ],
      isComplete: false,
    },
    {
      courseId: '694d1068812e4d5acaff47e5',
      completeContent: [],
      isComplete: false,
    },
  ];

  // Logic to determine level status
  const gameLevels = useMemo<EnrichedCourse[]>(() => {
    if (!coursesData || (!Array.isArray(coursesData.courses) && !Array.isArray(coursesData))) return [];

    // Handle both array direct return or { courses: [...] } return structure
    const rawCourses: Course[] = Array.isArray(coursesData) ? coursesData : coursesData.courses || [];

    // 1. Sort by Day Number
    const sorted = [...rawCourses].sort((a, b) => getDayNumber(a.courseDay) - getDayNumber(b.courseDay));

    // 2. Map status
    return sorted.map((course, index) => {
      // Check if this specific course is completed in user progress
      const progress = completeContent.find(p => p.courseId === course._id);
      const isThisComplete = progress?.isComplete || false;

      let status: 'locked' | 'current' | 'completed' = 'locked';

      if (isThisComplete) {
        status = 'completed';
      } else {
        if (index === 0) {
          // First level is 'current' if not complete
          status = 'current';
        } else {
          // Check previous course status
          const prevCourse = sorted[index - 1];
          const prevProgress = completeContent.find(p => p.courseId === prevCourse._id);

          if (prevProgress?.isComplete) {
            // If previous is complete, this one is unlocked
            status = 'current';
          } else {
            status = 'locked';
          }
        }
      }

      return { ...course, status };
    });
  }, [coursesData, completeContent]);

  const handleNodeClick = (course: EnrichedCourse) => {
    setSelectedCourse(course);
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-500 mb-4"></div>
          <p className="text-slate-400 font-medium animate-pulse">Loading Map...</p>
        </div>
      </div>
    );

  if (error) return <div className="p-20 text-red-500 text-center font-bold">Failed to load game data.</div>;

  return (
    <main className="min-h-screen bg-slate-50 overflow-x-hidden relative selection:bg-blue-200 font-sans pb-20">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-[100px]" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        ></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-20 relative">
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="inline-block relative"
          >
            <div className="absolute -top-6 -right-8">
              <Trophy size={48} className="text-yellow-400 drop-shadow-lg transform rotate-12" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-800 tracking-tighter mb-2">
              COURSE<span className="text-blue-600">MAP</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg">Clear the path to master the skill.</p>
          </motion.div>
        </header>

        {/* Game Map Container */}
        <div className="flex flex-col items-center relative min-h-[500px]">
          {/* Start Point */}
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-6 flex flex-col items-center z-20">
            <div className="bg-emerald-500 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-emerald-200">
              Start Here
            </div>
            <div className="h-8 w-1 border-l-4 border-dotted border-emerald-300 mt-2"></div>
          </motion.div>

          {/* Levels */}
          <div className="w-full relative">
            {gameLevels.map((course, index) => (
              <LevelNode key={course._id} course={course} index={index} onClick={handleNodeClick} isLast={index === gameLevels.length - 1} />
            ))}
          </div>

          {/* End Point */}
          {gameLevels.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="mt-4 flex flex-col items-center z-20"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-40 rounded-full animate-pulse"></div>
                <Trophy size={56} className="text-yellow-500 relative z-10 drop-shadow-xl" />
              </div>
              <div className="bg-white border border-yellow-200 text-yellow-700 px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mt-4 shadow-sm">
                Final Goal
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Pop-up Modal */}
      <ContentModal course={selectedCourse} isOpen={!!selectedCourse} onClose={() => setSelectedCourse(null)} />
    </main>
  );
};

export default Page;
/*



*/
