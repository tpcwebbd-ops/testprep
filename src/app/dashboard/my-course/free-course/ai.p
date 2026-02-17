Look at the page.tsx 
```
'use client';

import React, { useState, useMemo } from 'react';
import { useGetCoursesQuery } from '@/redux/features/course/courseSlice';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Lock, Check, Star, Play, FileText, X, ChevronRight, Trophy, Sparkles, Zap, Award, Target } from 'lucide-react';

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  const [isHovered, setIsHovered] = useState(false);

  const nodeVariants: Variants = {
    hidden: { scale: 0, opacity: 0, y: 50 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: index * 0.15,
      },
    },
    hover: {
      scale: 1.15,
      y: -8,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const pulseVariants: Variants = {
    pulse: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const glowVariants: Variants = {
    glow: {
      boxShadow: ['0 0 20px rgba(59, 130, 246, 0.5)', '0 0 40px rgba(59, 130, 246, 0.8)', '0 0 20px rgba(59, 130, 246, 0.5)'],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className={`relative flex w-full ${isLeft ? 'justify-start md:justify-end md:pr-[52%]' : 'justify-end md:justify-start md:pl-[52%]'} mb-16 md:mb-24`}>
      {/* Animated Connector Path */}
      {!isLast && (
        <div className="absolute top-[4.5rem] md:top-20 left-1/2 -ml-[2px] w-1 h-20 md:h-28 -z-10">
          <motion.div
            className={`w-full h-full border-l-4 border-dotted transition-colors duration-500
              ${status === 'completed' ? 'border-emerald-400' : 'border-slate-300'}`}
            initial={{ scaleY: 0, originY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: index * 0.15 + 0.3, duration: 0.4 }}
          />
        </div>
      )}

      {/* The Game Node Button */}
      <div className="relative">
        {/* Glow effect for current level */}
        {status === 'current' && (
          <motion.div
            variants={glowVariants}
            animate="glow"
            className="absolute inset-0 rounded-full blur-xl"
            style={{
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, transparent 70%)',
            }}
          />
        )}

        {/* Pulsing ring for current level */}
        {status === 'current' && (
          <motion.div
            variants={pulseVariants}
            animate="pulse"
            className="absolute inset-0 rounded-full border-4 border-blue-400"
            style={{ width: '100%', height: '100%' }}
          />
        )}

        <motion.button
          variants={nodeVariants}
          initial="hidden"
          animate="visible"
          whileHover={status !== 'locked' ? 'hover' : undefined}
          whileTap={status !== 'locked' ? { scale: 0.95 } : undefined}
          onClick={() => status !== 'locked' && onClick(course)}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          disabled={status === 'locked'}
          className={`
            relative z-10 flex flex-col items-center justify-center
            w-20 h-20 md:w-28 md:h-28 rounded-full border-b-8 shadow-2xl 
            transition-all duration-300 overflow-hidden
            ${
              status === 'completed'
                ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-700 text-white'
                : status === 'current'
                  ? 'bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 border-blue-800 text-white'
                  : 'bg-gradient-to-br from-slate-300 to-slate-400 border-slate-500 text-slate-500 cursor-not-allowed'
            }
          `}
        >
          {/* Shimmer effect */}
          {status !== 'locked' && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: 'easeInOut',
              }}
            />
          )}

          {/* Icons */}
          <div className="relative z-10">
            {status === 'completed' && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: index * 0.15 + 0.3 }}
              >
                <Check size={36} strokeWidth={3} className="drop-shadow-lg" />
              </motion.div>
            )}
            {status === 'current' && (
              <motion.div
                animate={{
                  rotate: isHovered ? 360 : 0,
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{ duration: 0.6 }}
              >
                <Play size={36} fill="currentColor" className="drop-shadow-lg" />
              </motion.div>
            )}
            {status === 'locked' && <Lock size={30} className="opacity-70" />}
          </div>

          {/* Sparkles for completed */}
          {status === 'completed' && (
            <>
              <motion.div className="absolute -top-2 -right-2" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
                <Sparkles size={16} className="text-yellow-300 fill-yellow-300" />
              </motion.div>
              <motion.div className="absolute -bottom-2 -left-2" animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}>
                <Sparkles size={12} className="text-yellow-300 fill-yellow-300" />
              </motion.div>
            </>
          )}

          {/* Level number badge */}
          <div
            className={`absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] md:text-xs font-black
            ${status === 'completed' ? 'bg-emerald-800' : status === 'current' ? 'bg-blue-900' : 'bg-slate-600'} text-white shadow-lg`}
          >
            {getDayNumber(course.courseDay)}
          </div>
        </motion.button>

        {/* Floating stars for completed */}
        {status === 'completed' && (
          <motion.div
            className="absolute -top-8 md:-top-10 left-1/2 -translate-x-1/2 flex gap-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 + 0.5 }}
          >
            <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}>
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
            </motion.div>
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}>
              <Star size={18} className="text-yellow-400 fill-yellow-400" />
            </motion.div>
            <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}>
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Label Card - Improved Responsive Design */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -30 : 30, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ delay: 0.4 + index * 0.1, type: 'spring', stiffness: 100 }}
        className={`absolute top-3 md:top-5 
          ${isLeft ? 'left-24 md:left-auto md:right-[calc(52%+1.5rem)] md:text-right' : 'right-24 md:right-auto md:left-[calc(52%+1.5rem)] md:text-left'}`}
      >
        <div
          className={`inline-block bg-white rounded-xl shadow-lg border-2 p-3 md:p-4 min-w-[140px] md:min-w-[180px] backdrop-blur-sm
          ${
            status === 'completed'
              ? 'border-emerald-300 bg-emerald-50/90'
              : status === 'current'
                ? 'border-blue-300 bg-blue-50/90'
                : 'border-slate-200 bg-white/90'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            {status === 'completed' && <Award size={14} className="text-emerald-600" />}
            {status === 'current' && <Zap size={14} className="text-blue-600" />}
            {status === 'locked' && <Lock size={14} className="text-slate-400" />}
            <h3
              className={`font-black text-sm md:text-base uppercase tracking-wide
              ${status === 'completed' ? 'text-emerald-700' : status === 'current' ? 'text-blue-700' : 'text-slate-500'}`}
            >
              {course.courseDay}
            </h3>
          </div>
          <p
            className={`text-xs font-semibold leading-tight max-w-[160px]
            ${status === 'completed' ? 'text-emerald-600' : status === 'current' ? 'text-blue-600' : 'text-slate-500'}`}
          >
            {course.courseName}
          </p>
          {course.content.length > 0 && (
            <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-slate-400">
              <Target size={10} />
              <span>{course.content.length} Tasks</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const ContentModal = ({ course, isOpen, onClose }: { course: EnrichedCourse | null; isOpen: boolean; onClose: () => void }) => {
  if (!isOpen || !course) return null;

  const completedCount = course.content.filter(() => false).length; // You can implement actual completion check
  const totalCount = course.content.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 m-auto z-50 w-[95%] sm:w-[90%] max-w-2xl h-fit max-h-[90vh] bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Animated Header */}
            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-6 md:p-8 text-white relative overflow-hidden">
              {/* Animated background elements */}
              <motion.div
                className="absolute top-0 right-0 opacity-10"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Play size={150} fill="currentColor" />
              </motion.div>

              <motion.div
                className="absolute bottom-0 left-0 opacity-10"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles size={100} fill="currentColor" />
              </motion.div>

              {/* Close button */}
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 md:p-2.5 transition backdrop-blur-md z-10"
              >
                <X size={20} />
              </motion.button>

              {/* Content */}
              <div className="relative z-10">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 mb-3"
                >
                  <div className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/30">
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {course.status === 'completed' ? '✓ Completed' : course.status === 'current' ? '▶ Active' : '🔒 Locked'}
                    </span>
                  </div>
                  {course.status === 'completed' && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.3 }}>
                      <Trophy size={24} className="text-yellow-300" />
                    </motion.div>
                  )}
                </motion.div>

                <motion.h2
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-4xl font-black tracking-tight mb-2"
                >
                  {course.courseDay}
                </motion.h2>

                <motion.p
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="opacity-90 font-semibold text-blue-100 text-base md:text-lg"
                >
                  {course.courseName}
                </motion.p>

                {/* Progress bar */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ delay: 0.7, duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"
                  />
                </motion.div>
                <p className="text-xs text-blue-100 mt-1 font-medium">
                  {completedCount} of {totalCount} tasks completed
                </p>
              </div>
            </div>

            {/* Body - Task List */}
            <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar bg-gradient-to-b from-slate-50 to-white flex-1">
              {course.content.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-16 text-slate-400 text-center"
                >
                  <div className="bg-slate-100 p-6 rounded-full mb-4">
                    <Lock size={40} />
                  </div>
                  <p className="font-bold text-lg mb-1">No Missions Available</p>
                  <p className="text-sm">This level is still being prepared.</p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {course.content.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      className="group flex items-center p-4 rounded-xl bg-white border-2 border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer"
                    >
                      {/* Icon */}
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className={`
                          w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mr-4 shrink-0 
                          transition-transform group-hover:scale-110
                          ${
                            item.type.toLowerCase().includes('video')
                              ? 'bg-gradient-to-br from-red-100 to-red-200 text-red-600'
                              : 'bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-600'
                          }
                        `}
                      >
                        {item.type.toLowerCase().includes('video') ? <Play size={22} fill="currentColor" /> : <FileText size={22} />}
                      </motion.div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 text-sm md:text-base mb-1 truncate pr-2">{item.heading || item.name}</h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-semibold text-slate-500 capitalize px-2 py-0.5 bg-slate-100 rounded">{item.type}</span>
                          {item.data?.totalMarks && (
                            <span className="font-bold text-orange-600 flex items-center gap-1">
                              <Trophy size={12} />
                              {item.data.totalMarks} pts
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Arrow */}
                      <motion.div
                        className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors shrink-0"
                        whileHover={{ x: 5 }}
                      >
                        <ChevronRight size={20} />
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 md:p-6 border-t-2 border-slate-200 bg-white flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-sm text-slate-500 font-semibold flex items-center gap-2">
                <Target size={16} className="text-blue-500" />
                <span>{course.content.length} Total Tasks</span>
              </div>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg shadow-blue-200"
              >
                Continue Journey →
              </motion.button>
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

  // User Progress Mock Data
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

    const rawCourses: Course[] = Array.isArray(coursesData) ? coursesData : coursesData.courses || [];
    const sorted = [...rawCourses].sort((a, b) => getDayNumber(a.courseDay) - getDayNumber(b.courseDay));

    return sorted.map((course, index) => {
      const progress = completeContent.find(p => p.courseId === course._id);
      const isThisComplete = progress?.isComplete || false;

      let status: 'locked' | 'current' | 'completed' = 'locked';

      if (isThisComplete) {
        status = 'completed';
      } else {
        if (index === 0) {
          status = 'current';
        } else {
          const prevCourse = sorted[index - 1];
          const prevProgress = completeContent.find(p => p.courseId === prevCourse._id);

          if (prevProgress?.isComplete) {
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="rounded-full h-16 w-16 border-4 border-slate-200 border-t-blue-500 mb-4"
          />
          <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-slate-600 font-bold text-lg">
            Loading Your Adventure...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <X size={32} className="text-red-600" />
          </div>
          <h2 className="text-2xl font-black text-red-600 mb-2">Oops!</h2>
          <p className="text-slate-600 font-medium">Failed to load your course map. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-x-hidden relative pb-20">
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[120px]"
        />

        {/* Animated Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Enhanced Header */}
        <header className="text-center mb-12 md:mb-20 relative">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
            className="inline-block relative"
          >
            {/* Floating trophy */}
            <motion.div
              className="absolute -top-8 -right-12 md:-right-16"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Trophy size={56} className="text-yellow-400 drop-shadow-2xl" />
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-blue-600 to-indigo-600 tracking-tighter mb-3">
              YOUR QUEST
            </h1>
            <p className="text-slate-600 font-bold text-base md:text-lg flex items-center justify-center gap-2">
              <Sparkles size={18} className="text-yellow-500" />
              Complete each level to unlock the next
              <Sparkles size={18} className="text-yellow-500" />
            </p>
          </motion.div>
        </header>

        {/* Game Map Container */}
        <div className="flex flex-col items-center relative min-h-[500px]">
          {/* Start Point */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.3 }}
            className="mb-6 flex flex-col items-center z-20"
          >
            <motion.div
              animate={{
                boxShadow: ['0 0 20px rgba(16, 185, 129, 0.5)', '0 0 40px rgba(16, 185, 129, 0.8)', '0 0 20px rgba(16, 185, 129, 0.5)'],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-2.5 rounded-full text-xs md:text-sm font-black uppercase tracking-widest shadow-lg"
            >
              🚀 Start Here
            </motion.div>
            <div className="h-8 w-1 border-l-4 border-dotted border-emerald-400 mt-2" />
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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, type: 'spring' }}
              className="mt-8 flex flex-col items-center z-20"
            >
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="relative"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-yellow-400 blur-2xl rounded-full"
                />
                <Trophy size={64} className="text-yellow-500 relative z-10 drop-shadow-2xl" />
              </motion.div>
              <motion.div
                animate={{
                  boxShadow: ['0 0 20px rgba(251, 191, 36, 0.5)', '0 0 40px rgba(251, 191, 36, 0.8)', '0 0 20px rgba(251, 191, 36, 0.5)'],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 text-yellow-900 px-6 py-2 rounded-full text-xs md:text-sm font-black uppercase tracking-wider mt-5 shadow-lg"
              >
                🏆 Victory Awaits
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modal */}
      <ContentModal course={selectedCourse} isOpen={!!selectedCourse} onClose={() => setSelectedCourse(null)} />

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </main>
  );
};

export default Page;
```

and here is example of coursesData = 
```

{
    "courses": [
        {
            "_id": "693a985755fe2dff9a139197",
            "courseName": "free-course",
            "courseDay": "Day 02",
            "isActive": true,
            "content": [
                {
                    "id": "Assignments-assignment-uid-1-1771324131282",
                    "key": "assignment-uid-1",
                    "name": "Assignments assignment-uid-1",
                    "type": "Assignments",
                    "heading": "Assignments: assignment uid 1",
                    "data": {
                        "0": {
                            "uid": "assign-ielts-001",
                            "name": "IELTS Reading: Environmental Impacts",
                            "description": "Read the passage regarding climate change and answer the multiple-choice questions to test your comprehension skills.",
                            "totalMarks": 10,
                            "startDate": "2023-10-01T03:00:00.000Z",
                            "endDate": "2023-10-05T17:59:00.000Z",
                            "courseName": "IELTS Academic Prep",
                            "courseClass": "Batch A-24",
                            "questions": [
                                {
                                    "id": "q1",
                                    "question": "What is the primary cause of rising sea levels mentioned in the text?",
                                    "options": [
                                        "Thermal expansion",
                                        "Heavy rainfall",
                                        "Tectonic movements",
                                        "Solar flares"
                                    ],
                                    "correctAnswer": "Thermal expansion"
                                },
                                {
                                    "id": "q2",
                                    "question": "According to the author, which sector contributes most to carbon emissions?",
                                    "options": [
                                        "Agriculture",
                                        "Transportation",
                                        "Energy production",
                                        "Manufacturing"
                                    ],
                                    "correctAnswer": "Energy production"
                                }
                            ]
                        },
                        "1": {
                            "uid": "assign-grammar-002",
                            "name": "Advanced Grammar: Conditionals",
                            "description": "A quiz designed to test your mastery of Zero, First, Second, and Third conditionals in complex sentences.",
                            "totalMarks": 20,
                            "startDate": "2023-10-02T04:00:00.000Z",
                            "endDate": "2023-10-04T12:00:00.000Z",
                            "courseName": "English Grammar 101",
                            "courseClass": "Intermediate Group",
                            "questions": [
                                {
                                    "id": "q1",
                                    "question": "Select the correct form: If I ___ you, I would accept the offer.",
                                    "options": [
                                        "was",
                                        "were",
                                        "am",
                                        "have been"
                                    ],
                                    "correctAnswer": "were"
                                },
                                {
                                    "id": "q2",
                                    "question": "Complete: Had she known about the traffic, she ___ left earlier.",
                                    "options": [
                                        "would have",
                                        "will have",
                                        "would",
                                        "had"
                                    ],
                                    "correctAnswer": "would have"
                                }
                            ]
                        },
                        "2": {
                            "uid": "assign-vocab-003",
                            "name": "Academic Vocabulary List 1",
                            "description": "Identify synonyms and correct usage of high-frequency academic words used in IELTS Writing Task 2.",
                            "totalMarks": 15,
                            "startDate": "2023-10-06T02:00:00.000Z",
                            "endDate": "2023-10-08T16:00:00.000Z",
                            "courseName": "Vocabulary Builder",
                            "courseClass": "All Batches",
                            "questions": [
                                {
                                    "id": "q1",
                                    "question": "Choose the best synonym for \"Ameliorate\".",
                                    "options": [
                                        "Worsen",
                                        "Improve",
                                        "Calculate",
                                        "Ignore"
                                    ],
                                    "correctAnswer": "Improve"
                                },
                                {
                                    "id": "q2",
                                    "question": "Which word best fits: The government implemented a new ___ to boost the economy.",
                                    "options": [
                                        "paradigm",
                                        "strategy",
                                        "hypothesis",
                                        "analysis"
                                    ],
                                    "correctAnswer": "strategy"
                                }
                            ]
                        },
                        "3": {
                            "uid": "assign-listen-004",
                            "name": "Listening Section 1: Form Filling",
                            "description": "Listen to the conversation between a hotel receptionist and a guest. Fill in the missing details regarding the booking.",
                            "totalMarks": 10,
                            "startDate": "2023-10-07T03:00:00.000Z",
                            "endDate": "2023-10-07T05:00:00.000Z",
                            "courseName": "IELTS Intensive",
                            "courseClass": "Weekend Batch",
                            "questions": [
                                {
                                    "id": "q1",
                                    "question": "What is the guest's arrival date?",
                                    "options": [
                                        "12th March",
                                        "21st March",
                                        "2nd March",
                                        "22nd March"
                                    ],
                                    "correctAnswer": "21st March"
                                },
                                {
                                    "id": "q2",
                                    "question": "How much is the deposit fee?",
                                    "options": [
                                        "$50",
                                        "$15",
                                        "$55",
                                        "$500"
                                    ],
                                    "correctAnswer": "$50"
                                }
                            ]
                        },
                        "4": {
                            "uid": "assign-math-005",
                            "name": "Quantitative Reasoning: Algebra",
                            "description": "Solve the following linear and quadratic equations. Time limit is strict for this assignment.",
                            "totalMarks": 50,
                            "startDate": "2023-10-10T08:00:00.000Z",
                            "endDate": "2023-10-12T08:00:00.000Z",
                            "courseName": "General GRE Prep",
                            "courseClass": "Math Squad",
                            "questions": [
                                {
                                    "id": "q1",
                                    "question": "Solve for x: 2x + 5 = 15",
                                    "options": [
                                        "5",
                                        "10",
                                        "2.5",
                                        "7.5"
                                    ],
                                    "correctAnswer": "5"
                                },
                                {
                                    "id": "q2",
                                    "question": "What is the value of x if x^2 - 9 = 0 and x > 0?",
                                    "options": [
                                        "3",
                                        "-3",
                                        "9",
                                        "81"
                                    ],
                                    "correctAnswer": "3"
                                }
                            ]
                        },
                        "5": {
                            "uid": "assign-write-006",
                            "name": "Writing Task 1: Bar Charts",
                            "description": "Analyze the structure of a report describing a bar chart. Identify the correct overview statement.",
                            "totalMarks": 20,
                            "startDate": "2023-10-15T03:00:00.000Z",
                            "endDate": "2023-10-20T17:59:00.000Z",
                            "courseName": "IELTS Academic Prep",
                            "courseClass": "Batch B-12",
                            "questions": [
                                {
                                    "id": "q1",
                                    "question": "Which sentence serves as the best Overview?",
                                    "options": [
                                        "The chart shows that 50% of people like coffee.",
                                        "Overall, coffee consumption increased while tea consumption remained stable.",
                                        "In 1990, coffee was 20 dollars.",
                                        "The x-axis represents the years from 1990 to 2000."
                                    ],
                                    "correctAnswer": "Overall, coffee consumption increased while tea consumption remained stable."
                                }
                            ]
                        },
                        "6": {
                            "uid": "assign-speak-007",
                            "name": "Speaking Part 2: Cue Card Theory",
                            "description": "Test your understanding of how to structure your 2-minute speech for Part 2.",
                            "totalMarks": 10,
                            "startDate": "2023-10-11T04:00:00.000Z",
                            "endDate": "2023-10-11T14:00:00.000Z",
                            "courseName": "Spoken English Pro",
                            "courseClass": "Evening Shift",
                            "questions": [
                                {
                                    "id": "q1",
                                    "question": "How much time do you get to prepare notes before speaking?",
                                    "options": [
                                        "30 seconds",
                                        "1 minute",
                                        "2 minutes",
                                        "5 minutes"
                                    ],
                                    "correctAnswer": "1 minute"
                                },
                                {
                                    "id": "q2",
                                    "question": "Should you stop speaking before the examiner interrupts you?",
                                    "options": [
                                        "Yes, keep it short",
                                        "No, keep speaking until stopped",
                                        "Yes, exactly at 1 minute",
                                        "No, speak for 5 minutes"
                                    ],
                                    "correctAnswer": "No, keep speaking until stopped"
                                }
                            ]
                        },
                        "7": {
                            "uid": "assign-sci-008",
                            "name": "General Science: Biology Basics",
                            "description": "A fundamental quiz on cell structure and functions for GED preparation.",
                            "totalMarks": 25,
                            "startDate": "2023-10-18T02:00:00.000Z",
                            "endDate": "2023-10-25T10:00:00.000Z",
                            "courseName": "GED Prep",
                            "courseClass": "Science Group",
                            "questions": [
                                {
                                    "id": "q1",
                                    "question": "Which organelle is known as the powerhouse of the cell?",
                                    "options": [
                                        "Nucleus",
                                        "Ribosome",
                                        "Mitochondria",
                                        "Golgi Apparatus"
                                    ],
                                    "correctAnswer": "Mitochondria"
                                },
                                {
                                    "id": "q2",
                                    "question": "What is the process by which plants make food?",
                                    "options": [
                                        "Respiration",
                                        "Photosynthesis",
                                        "Digestion",
                                        "Fermentation"
                                    ],
                                    "correctAnswer": "Photosynthesis"
                                }
                            ]
                        },
                        "8": {
                            "uid": "assign-gen-009",
                            "name": "IELTS General: Letter Writing",
                            "description": "Understand the difference between Formal, Semi-formal, and Informal letters.",
                            "totalMarks": 15,
                            "startDate": "2023-11-01T03:00:00.000Z",
                            "endDate": "2023-11-03T17:59:00.000Z",
                            "courseName": "IELTS General Training",
                            "courseClass": "GT-05",
                            "questions": [
                                {
                                    "id": "q1",
                                    "question": "Which salutation is appropriate for a formal letter where the name is unknown?",
                                    "options": [
                                        "Dear John,",
                                        "Dear Sir/Madam,",
                                        "Hi There,",
                                        "Dear Mr. Smith,"
                                    ],
                                    "correctAnswer": "Dear Sir/Madam,"
                                },
                                {
                                    "id": "q2",
                                    "question": "How should you sign off a formal letter starting with \"Dear Sir/Madam\"?",
                                    "options": [
                                        "Yours sincerely,",
                                        "Best regards,",
                                        "Yours faithfully,",
                                        "Love,"
                                    ],
                                    "correctAnswer": "Yours faithfully,"
                                }
                            ]
                        },
                        "9": {
                            "uid": "assign-hist-010",
                            "name": "Modern History: World War II",
                            "description": "Timeline and key events analysis of the Second World War.",
                            "totalMarks": 30,
                            "startDate": "2023-10-20T06:00:00.000Z",
                            "endDate": "2023-10-30T06:00:00.000Z",
                            "courseName": "History 101",
                            "courseClass": "Humanities",
                            "questions": [
                                {
                                    "id": "q1",
                                    "question": "In which year did World War II end?",
                                    "options": [
                                        "1944",
                                        "1945",
                                        "1939",
                                        "1950"
                                    ],
                                    "correctAnswer": "1945"
                                },
                                {
                                    "id": "q2",
                                    "question": "Which event triggered the start of the war?",
                                    "options": [
                                        "Attack on Pearl Harbor",
                                        "Invasion of Poland",
                                        "D-Day",
                                        "Bombing of London"
                                    ],
                                    "correctAnswer": "Invasion of Poland"
                                }
                            ]
                        },
                        "uid": "",
                        "name": "Assignment 2",
                        "description": "description ",
                        "totalMarks": 3,
                        "startDate": "2026-02-17T10:28:57.439Z",
                        "endDate": "2026-02-17T10:28:57.439Z",
                        "courseName": "IELTS",
                        "courseClass": "Batch 22",
                        "questions": [
                            {
                                "id": "q-1771324164330",
                                "question": "Questions 1",
                                "options": [
                                    "Option 1",
                                    "Option 2",
                                    "Option 3",
                                    "Option 4"
                                ],
                                "correctAnswer": "Option 3"
                            },
                            {
                                "id": "q-1771324193234",
                                "question": "Question 2",
                                "options": [
                                    "Option 1",
                                    "Option 2",
                                    "Option 3",
                                    "Option 4"
                                ],
                                "correctAnswer": "Option 3"
                            },
                            {
                                "id": "q-1771324217874",
                                "question": "Question 3",
                                "options": [
                                    "Option 1",
                                    "Option 2"
                                ],
                                "correctAnswer": "Option 1"
                            }
                        ]
                    }
                },
                {
                    "id": "Videos-video-uid-1-1771324132802",
                    "key": "video-uid-1",
                    "name": "Videos video-uid-1",
                    "type": "Videos",
                    "heading": "Videos: video uid 1",
                    "data": {
                        "uid": "video-uid-1",
                        "name": "The First Video",
                        "url": "https://utfs.io/f/dOs5X2bT3NyAqXqJorQ6ByOtrk5gXKP3MSI8FlAHQmdR29wv",
                        "description": "This is the first video",
                        "duration": 60,
                        "startDate": "2023-01-01T00:00:00.000Z",
                        "endDate": "2023-01-02T00:00:00.000Z"
                    }
                },
                {
                    "id": "Videos-video-uid-1-1771324133346",
                    "key": "video-uid-1",
                    "name": "Videos video-uid-1",
                    "type": "Videos",
                    "heading": "Videos: video uid 1",
                    "data": {
                        "uid": "video-uid-1",
                        "name": "Video 1",
                        "url": "https://utfs.io/f/dOs5X2bT3NyAqXqJorQ6ByOtrk5gXKP3MSI8FlAHQmdR29wv",
                        "description": "This is the first video",
                        "duration": 60,
                        "startDate": "2023-01-01T00:00:00.000Z",
                        "endDate": "2023-01-02T00:00:00.000Z"
                    }
                }
            ],
            "createdAt": "2025-12-11T10:09:27.867Z",
            "updatedAt": "2026-02-17T10:31:33.269Z",
            "__v": 0
        },
        {
            "_id": "693a985355fe2dff9a139193",
            "courseName": "free-course",
            "courseDay": "Day 01",
            "isActive": true,
            "content": [
                {
                    "id": "video-video-uid-1-1766560822726",
                    "key": "video-uid-1",
                    "name": "Video video-uid-1",
                    "type": "video",
                    "heading": "Video: video uid 1",
                    "data": {
                        "uid": "video-uid-1",
                        "name": "Video 1",
                        "url": "https://www.youtube.com/watch?v=1234567890",
                        "description": "This is the first video",
                        "duration": 60,
                        "startDate": "2023-01-01T00:00:00.000Z",
                        "endDate": "2023-01-02T00:00:00.000Z"
                    }
                },
                {
                    "id": "Videos-video-uid-1-1766664024187",
                    "key": "video-uid-1",
                    "name": "Videos video-uid-1",
                    "type": "Videos",
                    "heading": "Videos: video uid 1",
                    "data": {
                        "uid": "video-uid-1",
                        "name": "Video 1",
                        "url": "https://utfs.io/f/dOs5X2bT3NyARqF1F3a3pN65JPYXMGaLKZcuqFAVB2d01DUO",
                        "description": "This is the first video",
                        "duration": 60,
                        "startDate": "2023-01-01T00:00:00.000Z",
                        "endDate": "2023-01-02T00:00:00.000Z"
                    }
                },
                {
                    "id": "Assignments-assignment-uid-1-1771313648025",
                    "key": "assignment-uid-1",
                    "name": "Assignments assignment-uid-1",
                    "type": "Assignments",
                    "heading": "Assignments: assignment uid 1",
                    "data": {
                        "0": {
                            "uid": "assign-ielts-001",
                            "name": "IELTS Reading: Environmental Impacts",
                            "description": "Read the passage regarding climate change and answer the multiple-choice questions to test your comprehension skills.",
                            "totalMarks": 10,
                            "startDate": "2023-10-01T03:00:00.000Z",
                            "endDate": "2023-10-05T17:59:00.000Z",
                            "courseName": "IELTS Academic Prep",
                            "courseClass": "Batch A-24",
                            "questions": [
                                {
                                    "id": "q1",
                                    "question": "What is the primary cause of rising sea levels mentioned in the text?",
                                    "options": [
                                        "Thermal expansion",
                                        "Heavy rainfall",
                                        "Tectonic movements",
                                        "Solar flares"
                                    ],
                                    "correctAnswer": "Thermal expansion"
                                },
                                {
                                    "id": "q2",
                                    "question": "According to the author, which sector contributes most to carbon emissions?",
                                    "options": [
                                        "Agriculture",
                                        "Transportation",
                                        "Energy production",
                                        "Manufacturing"
                                    ],
                                    "correctAnswer": "Energy production"
                                }
                            ]
                        },
                        "1": {
                            "uid": "assign-grammar-002",
                            "name": "Advanced Grammar: Conditionals",
                            "description": "A quiz designed to test your mastery of Zero, First, Second, and Third conditionals in complex sentences.",
                            "totalMarks": 20,
                            "startDate": "2023-10-02T04:00:00.000Z",
                            "endDate": "2023-10-04T12:00:00.000Z",
                            "courseName": "English Grammar 101",
                            "courseClass": "Intermediate Group",
                            "questions": [
                                {
                                    "id": "q1",
                                    "question": "Select the correct form: If I ___ you, I would accept the offer.",
                                    "options": [
                                        "was",
                                        "were",
                                        "am",
                                        "have been"
                                    ],
                                    "correctAnswer": "were"
                                },
                                {
                                    "id": "q2",
                                    "question": "Complete: Had she known about the traffic, she ___ left earlier.",
                                    "options": [
                                        "would have",
                                        "will have",
                                        "would",
                                        "had"
                                    ],
                                    "correctAnswer": "would have"
                                }
                            ]
                        },
                        "2": {
                            "uid": "assign-vocab-003",
                            "name": "Academic Vocabulary List 1",
                            "description": "Identify synonyms and correct usage of high-frequency academic words used in IELTS Writing Task 2.",
                            "totalMarks": 15,
                            "startDate": "2023-10-06T02:00:00.000Z",
                            "endDate": "2023-10-08T16:00:00.000Z",
                            "courseName": "Vocabulary Builder",
                            "courseClass": "All Batches",
                            "questions": [
                                {
                                    "id": "q1",
                                    "question": "Choose the best synonym for \"Ameliorate\".",
                                    "options": [
                                        "Worsen",
                                        "Improve",
                                        "Calculate",
                                        "Ignore"
                                    ],
                                    "correctAnswer": "Improve"
                                },
                                {
                                    "id": "q2",
                                    "question": "Which word best fits: The government implemented a new ___ to boost the economy.",
                                    "options": [
                                        "paradigm",
                                        "strategy",
                                        "hypothesis",
                                        "analysis"
                                    ],
                                    "correctAnswer": "strategy"
                                }
                            ]
                        },
                        "3": {
                            "uid": "assign-listen-004",
                            "name": "Listening Section 1: Form Filling",
                            "description": "Listen to the conversation between a hotel receptionist and a guest. Fill in the missing details regarding the booking.",
                            "totalMarks": 10,
                            "startDate": "2023-10-07T03:00:00.000Z",
                            "endDate": "2023-10-07T05:00:00.000Z",
                            "courseName": "IELTS Intensive",
                            "courseClass": "Weekend Batch",
                            "questions": [
                                {
                                    "id": "q1",
                                    "question": "What is the guest's arrival date?",
                                    "options": [
                                        "12th March",
                                        "21st March",
                                        "2nd March",
                                        "22nd March"
                                    ],
                                    "correctAnswer": "21st March"
                                },
                                {
                                    "id": "q2",
                                    "question": "How much is the deposit fee?",
                                    "options": [
                                        "$50",
                                        "$15",
                                        "$55",
                                        "$500"
                                    ],
                                    "correctAnswer": "$50"
                                }
                            ]
                        },
                        "4": {
                            "uid": "assign-math-005",
                            "name": "Quantitative Reasoning: Algebra",
                            "description": "Solve the following linear and quadratic equations. Time limit is strict for this assignment.",
                            "totalMarks": 50,
                            "startDate": "2023-10-10T08:00:00.000Z",
                            "endDate": "2023-10-12T08:00:00.000Z",
                            "courseName": "General GRE Prep",
                            "courseClass": "Math Squad",
                            "questions": [
                                {
                                    "id": "q1",
                                    "question": "Solve for x: 2x + 5 = 15",
                                    "options": [
                                        "5",
                                        "10",
                                        "2.5",
                                        "7.5"
                                    ],
                                    "correctAnswer": "5"
                                },
                                {
                                    "id": "q2",
                                    "question": "What is the value of x if x^2 - 9 = 0 and x > 0?",
                                    "options": [
                                        "3",
                                        "-3",
                                        "9",
                                        "81"
                                    ],
                                    "correctAnswer": "3"
                                }
                            ]
                        },
                        "5": {
                            "uid": "assign-write-006",
                            "name": "Writing Task 1: Bar Charts",
                            "description": "Analyze the structure of a report describing a bar chart. Identify the correct overview statement.",
                            "totalMarks": 20,
                            "startDate": "2023-10-15T03:00:00.000Z",
                            "endDate": "2023-10-20T17:59:00.000Z",
                            "courseName": "IELTS Academic Prep",
                            "courseClass": "Batch B-12",
                            "questions": [
                                {
                                    "id": "q1",
                                    "question": "Which sentence serves as the best Overview?",
                                    "options": [
                                        "The chart shows that 50% of people like coffee.",
                                        "Overall, coffee consumption increased while tea consumption remained stable.",
                                        "In 1990, coffee was 20 dollars.",
                                        "The x-axis represents the years from 1990 to 2000."
                                    ],
                                    "correctAnswer": "Overall, coffee consumption increased while tea consumption remained stable."
                                }
                            ]
                        },
                        "6": {
                            "uid": "assign-speak-007",
                            "name": "Speaking Part 2: Cue Card Theory",
                            "description": "Test your understanding of how to structure your 2-minute speech for Part 2.",
                            "totalMarks": 10,
                            "startDate": "2023-10-11T04:00:00.000Z",
                            "endDate": "2023-10-11T14:00:00.000Z",
                            "courseName": "Spoken English Pro",
                            "courseClass": "Evening Shift",
                            "questions": [
                                {
                                    "id": "q1",
                                    "question": "How much time do you get to prepare notes before speaking?",
                                    "options": [
                                        "30 seconds",
                                        "1 minute",
                                        "2 minutes",
                                        "5 minutes"
                                    ],
                                    "correctAnswer": "1 minute"
                                },
                                {
                                    "id": "q2",
                                    "question": "Should you stop speaking before the examiner interrupts you?",
                                    "options": [
                                        "Yes, keep it short",
                                        "No, keep speaking until stopped",
                                        "Yes, exactly at 1 minute",
                                        "No, speak for 5 minutes"
                                    ],
                                    "correctAnswer": "No, keep speaking until stopped"
                                }
                            ]
                        },
                        "7": {
                            "uid": "assign-sci-008",
                            "name": "General Science: Biology Basics",
                            "description": "A fundamental quiz on cell structure and functions for GED preparation.",
                            "totalMarks": 25,
                            "startDate": "2023-10-18T02:00:00.000Z",
                            "endDate": "2023-10-25T10:00:00.000Z",
                            "courseName": "GED Prep",
                            "courseClass": "Science Group",
                            "questions": [
                                {
                                    "id": "q1",
                                    "question": "Which organelle is known as the powerhouse of the cell?",
                                    "options": [
                                        "Nucleus",
                                        "Ribosome",
                                        "Mitochondria",
                                        "Golgi Apparatus"
                                    ],
                                    "correctAnswer": "Mitochondria"
                                },
                                {
                                    "id": "q2",
                                    "question": "What is the process by which plants make food?",
                                    "options": [
                                        "Respiration",
                                        "Photosynthesis",
                                        "Digestion",
                                        "Fermentation"
                                    ],
                                    "correctAnswer": "Photosynthesis"
                                }
                            ]
                        },
                        "8": {
                            "uid": "assign-gen-009",
                            "name": "IELTS General: Letter Writing",
                            "description": "Understand the difference between Formal, Semi-formal, and Informal letters.",
                            "totalMarks": 15,
                            "startDate": "2023-11-01T03:00:00.000Z",
                            "endDate": "2023-11-03T17:59:00.000Z",
                            "courseName": "IELTS General Training",
                            "courseClass": "GT-05",
                            "questions": [
                                {
                                    "id": "q1",
                                    "question": "Which salutation is appropriate for a formal letter where the name is unknown?",
                                    "options": [
                                        "Dear John,",
                                        "Dear Sir/Madam,",
                                        "Hi There,",
                                        "Dear Mr. Smith,"
                                    ],
                                    "correctAnswer": "Dear Sir/Madam,"
                                },
                                {
                                    "id": "q2",
                                    "question": "How should you sign off a formal letter starting with \"Dear Sir/Madam\"?",
                                    "options": [
                                        "Yours sincerely,",
                                        "Best regards,",
                                        "Yours faithfully,",
                                        "Love,"
                                    ],
                                    "correctAnswer": "Yours faithfully,"
                                }
                            ]
                        },
                        "9": {
                            "uid": "assign-hist-010",
                            "name": "Modern History: World War II",
                            "description": "Timeline and key events analysis of the Second World War.",
                            "totalMarks": 30,
                            "startDate": "2023-10-20T06:00:00.000Z",
                            "endDate": "2023-10-30T06:00:00.000Z",
                            "courseName": "History 101",
                            "courseClass": "Humanities",
                            "questions": [
                                {
                                    "id": "q1",
                                    "question": "In which year did World War II end?",
                                    "options": [
                                        "1944",
                                        "1945",
                                        "1939",
                                        "1950"
                                    ],
                                    "correctAnswer": "1945"
                                },
                                {
                                    "id": "q2",
                                    "question": "Which event triggered the start of the war?",
                                    "options": [
                                        "Attack on Pearl Harbor",
                                        "Invasion of Poland",
                                        "D-Day",
                                        "Bombing of London"
                                    ],
                                    "correctAnswer": "Invasion of Poland"
                                }
                            ]
                        },
                        "uid": "",
                        "name": "Assignment 1",
                        "description": "description of assignment ",
                        "totalMarks": 2,
                        "startDate": "2026-02-18T16:37:00.000Z",
                        "endDate": "2026-02-19T04:38:00.000Z",
                        "courseName": "Free Course",
                        "courseClass": "Batch 1",
                        "questions": [
                            {
                                "id": "q-1771313712752",
                                "question": "Question 1",
                                "options": [
                                    "Option 1",
                                    "Option 2",
                                    "Option 3",
                                    "Option 4"
                                ],
                                "correctAnswer": ""
                            },
                            {
                                "id": "q-1771313778744",
                                "question": "Question 1",
                                "options": [
                                    "Option 1",
                                    "Option 1",
                                    "Option 1",
                                    "Option 1"
                                ],
                                "correctAnswer": "Option 1"
                            }
                        ]
                    }
                }
            ],
            "createdAt": "2025-12-11T10:09:23.606Z",
            "updatedAt": "2026-02-17T07:37:43.566Z",
            "__v": 0
        },
        {
            "_id": "694d1068812e4d5acaff47e5",
            "courseName": "free-course",
            "courseDay": "Day 20",
            "isActive": true,
            "content": [],
            "createdAt": "2025-12-25T10:22:32.139Z",
            "updatedAt": "2025-12-27T12:58:40.758Z",
            "__v": 0
        },
        {
            "_id": "694fd7f8e99f28944d137d49",
            "courseName": "free-course",
            "courseDay": "Day 97",
            "isActive": true,
            "content": [],
            "createdAt": "2025-12-27T12:58:32.337Z",
            "updatedAt": "2025-12-27T12:58:32.337Z",
            "__v": 0
        },
        {
            "_id": "694d120d812e4d5acaff47fb",
            "courseName": "free-course",
            "courseDay": "Day 23",
            "isActive": true,
            "content": [],
            "createdAt": "2025-12-25T10:29:33.572Z",
            "updatedAt": "2025-12-25T10:29:33.572Z",
            "__v": 0
        },
        {
            "_id": "694b89a1fce0458effdb7bdf",
            "courseName": "free-course",
            "courseDay": "Day 16",
            "isActive": true,
            "content": [],
            "createdAt": "2025-12-24T06:35:13.171Z",
            "updatedAt": "2025-12-24T06:35:13.171Z",
            "__v": 0
        },
        {
            "_id": "694a73d09a791cd6666e8e6a",
            "courseName": "free-course",
            "courseDay": "Day 03",
            "isActive": true,
            "content": [],
            "createdAt": "2025-12-23T10:49:52.290Z",
            "updatedAt": "2025-12-23T10:49:52.290Z",
            "__v": 0
        },
        {
            "_id": "694a73c09a791cd6666e8e66",
            "courseName": "free-course",
            "courseDay": "Day 94",
            "isActive": true,
            "content": [],
            "createdAt": "2025-12-23T10:49:36.288Z",
            "updatedAt": "2025-12-23T10:49:36.288Z",
            "__v": 0
        },
        {
            "_id": "693a983a55fe2dff9a13918a",
            "courseName": "online-spoken",
            "courseDay": "Day 03",
            "isActive": true,
            "content": [],
            "createdAt": "2025-12-11T10:08:58.719Z",
            "updatedAt": "2025-12-11T10:08:58.719Z",
            "__v": 0
        },
        {
            "_id": "693a97fa55fe2dff9a139184",
            "courseName": "online-spoken",
            "courseDay": "Day 100",
            "isActive": true,
            "content": [],
            "createdAt": "2025-12-11T10:07:54.166Z",
            "updatedAt": "2025-12-11T10:07:54.166Z",
            "__v": 0
        },
        {
            "_id": "693a968955fe2dff9a139139",
            "courseName": "online-spoken",
            "courseDay": "Day 02",
            "isActive": true,
            "content": [],
            "createdAt": "2025-12-11T10:01:45.600Z",
            "updatedAt": "2025-12-11T10:01:45.600Z",
            "__v": 0
        },
        {
            "_id": "693a967d55fe2dff9a13912b",
            "courseName": "online-spoken",
            "courseDay": "Day 01",
            "isActive": true,
            "content": [],
            "createdAt": "2025-12-11T10:01:33.792Z",
            "updatedAt": "2025-12-11T10:01:33.792Z",
            "__v": 0
        }
    ],
    "total": 12,
    "page": 1,
    "limit": 1000
}
``` 
Now implement those features 
1. Inside pop-up when I click Video then it will play Video. and also make it as marked.
2. If I click Assignment then it will take assignment based on question and also make it as marked.
3. After complete all task the module will marked as complete and the next module will not disabled. 
