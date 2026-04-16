'use client';

import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect, Suspense } from 'react';
import { CheckCircle, Lock, AlertCircle, PlayCircle, FileText, CheckSquare, UploadCloud, X, LayoutGrid, List, Grid3X3, ChevronRight } from 'lucide-react';

// Assuming standard path according to your context
import { useGetMyCourseByIdQuery } from '@/redux/features/my-courses/myCoursesSlice';

// --- Interfaces based on your mongoose schema ---
interface IClassData {
  _id?: string;
  ClassName: string;
  status: 'complete' | 'incomplete';
  completeDate?: string | Date;
}

interface IAttendance {
  courseID: string;
  data: IClassData[];
}

interface IMyCourse {
  _id: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  progress: number;
  enrolledAt: string;
  attenDance: IAttendance[];
}

// --- Main Page Component ---
const ClassContent = () => {
  const searchParams = useSearchParams();
  const myCourseId = searchParams.get('courseId');

  // Local State
  const [isGameMode, setIsGameMode] = useState<boolean>(true);
  const [gridCols, setGridCols] = useState<number>(3);
  const [selectedClass, setSelectedClass] = useState<IClassData | null>(null);
  const [activeTab, setActiveTab] = useState<'video' | 'notice' | 'mcq' | 'assignment'>('video');

  // Fetch real data via Redux RTK query
  const {
    data: response,
    isLoading,
    isError,
  } = useGetMyCourseByIdQuery(myCourseId, {
    skip: !myCourseId,
  });
  console.log('response', response);
  console.log('myCourseId', myCourseId);
  
  const myCourse: IMyCourse | undefined = response?.data;

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (selectedClass) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedClass]);

  if (!myCourseId) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500">
        <p className="text-xl font-semibold">Please select a course to view classes.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError || !myCourse) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 text-red-500">
        <p className="text-xl font-semibold">Failed to load course details.</p>
      </div>
    );
  }

  const classesData = myCourse.attenDance?.[0]?.data || [];
  const totalClasses = classesData.length;
  const completedClasses = classesData.filter(c => c.status === 'complete').length;
  const remainingClasses = totalClasses - completedClasses;
  const progressPercent = totalClasses > 0 ? Math.round((completedClasses / totalClasses) * 100) : 0;

  // Find the first uncompleted class index for sequencing logic
  const activeClassIndex = classesData.findIndex(c => c.status !== 'complete');

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4 md:p-8 font-sans transition-colors duration-300">
      {/* --- TOP BAR --- */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-10 border border-gray-100 dark:border-gray-700">
        {/* 1. Summary Box */}
        <div className="flex items-center gap-6 mb-4 md:mb-0 w-full md:w-auto">
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200 dark:text-gray-700"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-indigo-500 transition-all duration-1000 ease-out"
                strokeDasharray={`${progressPercent}, 100`}
                strokeWidth="3"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-lg text-indigo-600 dark:text-indigo-400">{progressPercent}%</div>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">Your Progress</h2>
            <div className="flex gap-4 mt-2 text-sm font-medium">
              <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                <CheckCircle size={16} /> {completedClasses} Complete
              </span>
              <span className="text-orange-500 flex items-center gap-1">
                <ChevronRight size={16} /> {remainingClasses} Remain
              </span>
            </div>
          </div>
        </div>

        {/* 2. Controls / Toggle Switches */}
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto justify-between">
          {/* Grid Selectors (Only visible in Normal Mode) */}
          <AnimatePresence>
            {!isGameMode && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1"
              >
                {[
                  { val: 1, icon: <List size={20} /> },
                  { val: 2, icon: <LayoutGrid size={20} /> },
                  { val: 3, icon: <Grid3X3 size={20} /> },
                ].map(opt => (
                  <button
                    key={opt.val}
                    onClick={() => setGridCols(opt.val)}
                    className={`p-2 rounded-md transition-all ${gridCols === opt.val ? 'bg-white dark:bg-gray-800 shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    {opt.icon}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Game Mode Switch */}
          <label className="flex items-center cursor-pointer select-none">
            <span className="mr-3 font-semibold text-gray-700 dark:text-gray-200">Normal Mode</span>
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={isGameMode} onChange={() => setIsGameMode(!isGameMode)} />
              <div
                className={`block w-14 h-8 rounded-full transition-colors duration-300 ${isGameMode ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gray-300 dark:bg-gray-600'}`}
              ></div>
              <div
                className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 flex items-center justify-center shadow-md ${isGameMode ? 'transform translate-x-6' : ''}`}
              ></div>
            </div>
            <span className="ml-3 font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">Game Mode</span>
          </label>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="w-full max-w-6xl mx-auto relative">
        <AnimatePresence mode="wait">
          {/* GAME MODE VIEW */}
          {isGameMode ? (
            <motion.div
              key="game-mode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center py-10 relative"
            >
              {/* Central connecting line */}
              <div className="absolute top-10 bottom-10 w-1.5 bg-gray-200 dark:bg-gray-700 rounded-full left-1/2 transform -translate-x-1/2 z-0" />

              {/* Start Here Node */}
              <div className="relative z-10 flex flex-col items-center mb-12">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 shadow-xl shadow-orange-500/30 flex items-center justify-center text-white font-bold text-center border-4 border-white dark:border-gray-900 animate-pulse">
                  Start
                </div>
              </div>

              {classesData.map((cls, idx) => {
                const isComplete = cls.status === 'complete';
                const isActive = idx === activeClassIndex;
                const isLocked = idx > activeClassIndex;

                // Simulate "Late" condition: Assuming each class is meant for 1 day sequentially
                const expectedDate = new Date(new Date(myCourse.enrolledAt).getTime() + idx * 24 * 60 * 60 * 1000);
                const isLate = isActive && new Date() > expectedDate;

                // Determine styling based on sequential conditions
                let nodeBg = 'bg-gray-300 dark:bg-gray-700 text-gray-500'; // Locked
                let borderColor = 'border-gray-200 dark:border-gray-800';
                let Icon = Lock;
                let ringColor = '';

                if (isComplete) {
                  nodeBg = 'bg-green-500 text-white';
                  borderColor = 'border-green-200 dark:border-green-900';
                  Icon = CheckCircle;
                  ringColor = 'ring-green-500/50';
                } else if (isActive) {
                  nodeBg = isLate ? 'bg-red-500 text-white' : 'bg-blue-500 text-white';
                  borderColor = isLate ? 'border-red-200 dark:border-red-900' : 'border-blue-200 dark:border-blue-900';
                  Icon = isLate ? AlertCircle : PlayCircle;
                  ringColor = isLate ? 'ring-red-500/50' : 'ring-blue-500/50';
                }

                return (
                  <motion.div
                    key={cls._id || idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className={`relative z-10 flex items-center mb-16 w-full ${idx % 2 === 0 ? 'justify-start md:pr-[50%]' : 'justify-end md:pl-[50%]'} md:-mr-0 md:-ml-0`}
                  >
                    {/* Alternate Left/Right Cards for Desktop */}
                    <div className={`flex items-center gap-6 w-full md:w-[90%] ${idx % 2 === 0 ? 'flex-row-reverse md:flex-row' : 'flex-row'}`}>
                      {/* Class Details Card */}
                      <div
                        className={`flex-1 p-5 rounded-xl shadow-lg border ${isLocked ? 'bg-white/50 dark:bg-gray-800/50 opacity-60' : 'bg-white dark:bg-gray-800 cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1'}`}
                        onClick={() => !isLocked && setSelectedClass(cls)}
                      >
                        <h3 className="font-bold text-lg mb-1">{cls.ClassName}</h3>
                        <p className="text-sm opacity-80">
                          {isComplete
                            ? `Completed on: ${new Date(cls.completeDate || Date.now()).toLocaleDateString()}`
                            : isLate
                              ? 'Missed deadline (Still accessible)'
                              : isLocked
                                ? 'Locked until previous is complete'
                                : 'Currently Active'}
                        </p>
                      </div>

                      {/* Circle Node */}
                      <div
                        className={`w-16 h-16 shrink-0 rounded-full flex items-center justify-center border-4 shadow-lg transition-all duration-300 ${nodeBg} ${borderColor} ${!isLocked && 'cursor-pointer hover:scale-110'} ${isActive && 'ring-4 ring-offset-2 ' + ringColor}`}
                        onClick={() => !isLocked && setSelectedClass(cls)}
                      >
                        <Icon size={28} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            /* NORMAL MODE VIEW */
            <motion.div
              key="normal-mode"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`grid gap-6 ${
                gridCols === 1 ? 'grid-cols-1' : gridCols === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              }`}
            >
              {classesData.map((cls, idx) => {
                const isComplete = cls.status === 'complete';
                const isLocked = idx > activeClassIndex; // Even in normal mode, logic dictates seq lock

                return (
                  <div
                    key={cls._id || idx}
                    onClick={() => !isLocked && setSelectedClass(cls)}
                    className={`group relative overflow-hidden rounded-2xl p-6 border transition-all duration-300 ${
                      isLocked
                        ? 'bg-gray-100 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed'
                        : 'bg-white dark:bg-gray-800 border-indigo-100 dark:border-indigo-900/50 shadow-md hover:shadow-xl hover:-translate-y-1 cursor-pointer'
                    }`}
                  >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none" />

                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`p-3 rounded-lg ${isComplete ? 'bg-green-100 text-green-600' : isLocked ? 'bg-gray-200 text-gray-500' : 'bg-indigo-100 text-indigo-600'}`}
                      >
                        {isComplete ? <CheckCircle size={24} /> : isLocked ? <Lock size={24} /> : <PlayCircle size={24} />}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Class {idx + 1}</span>
                    </div>

                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors">{cls.ClassName}</h3>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                      {isComplete ? 'Status: Completed' : isLocked ? 'Status: Locked' : 'Status: Ready to start'}
                    </p>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- FULL SCREEN MODAL --- */}
      <AnimatePresence>
        {selectedClass && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full h-full bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row overflow-hidden shadow-2xl"
            >
              {/* Modal Sidebar Tabs */}
              <div className="w-full md:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-auto md:h-full shrink-0 pt-6 md:pt-10 relative">
                {/* Mobile Close Btn (Top Left) */}
                <button
                  onClick={() => setSelectedClass(null)}
                  className="absolute top-4 right-4 md:hidden p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-200"
                >
                  <X size={20} />
                </button>

                <div className="px-6 mb-8">
                  <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-full mb-3">
                    {selectedClass.status === 'complete' ? 'Completed' : 'Active'}
                  </span>
                  <h2 className="text-2xl font-bold leading-tight">{selectedClass.ClassName}</h2>
                </div>

                <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible px-4 md:px-0 gap-2 md:gap-0">
                  {[
                    { id: 'video', label: 'Lecture Video', icon: PlayCircle },
                    { id: 'notice', label: 'Class Notice', icon: FileText },
                    { id: 'mcq', label: 'Take MCQ', icon: CheckSquare },
                    { id: 'assignment', label: 'Assignment', icon: UploadCloud },
                  ].map(tab => {
                    const isActiveTab = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-3 w-auto md:w-full px-6 py-4 text-left transition-all border-b-2 md:border-b-0 md:border-l-4 whitespace-nowrap ${
                          isActiveTab
                            ? 'bg-indigo-50 dark:bg-gray-700 border-indigo-600 text-indigo-700 dark:text-indigo-400 font-semibold'
                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <tab.icon size={20} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Modal Content Area */}
              <div className="flex-1 overflow-y-auto relative p-6 md:p-12">
                {/* Desktop Close Btn (Top Right) */}
                <button
                  onClick={() => setSelectedClass(null)}
                  className="hidden md:flex absolute top-8 right-8 p-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
                >
                  <X size={24} />
                </button>

                <div className="max-w-4xl mx-auto h-full mt-10 md:mt-0">
                  {/* DYNAMIC CONTENT BASED ON ACTIVE TAB */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="h-full flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl"
                    >
                      {activeTab === 'video' && (
                        <>
                          <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-500 rounded-full flex items-center justify-center mb-6">
                            <PlayCircle size={48} className="ml-2" />
                          </div>
                          <h3 className="text-3xl font-bold mb-4">Lecture Video Hub</h3>
                          <p className="text-gray-500 max-w-md">
                            Watch the recording for &quot;{selectedClass.ClassName}&quot;. All lecture resources will be synced below.
                          </p>
                          <button className="mt-8 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold transition-all shadow-lg shadow-indigo-500/30">
                            Play Video
                          </button>
                        </>
                      )}

                      {activeTab === 'notice' && (
                        <>
                          <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/50 text-orange-500 rounded-full flex items-center justify-center mb-6">
                            <FileText size={48} />
                          </div>
                          <h3 className="text-3xl font-bold mb-4">Class Notices</h3>
                          <p className="text-gray-500 max-w-md">Important announcements, slide links, and external resources provided by the instructor.</p>
                        </>
                      )}

                      {activeTab === 'mcq' && (
                        <>
                          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/50 text-green-500 rounded-full flex items-center justify-center mb-6">
                            <CheckSquare size={48} />
                          </div>
                          <h3 className="text-3xl font-bold mb-4">Mock Test (MCQ)</h3>
                          <p className="text-gray-500 max-w-md">Test your knowledge immediately after the lecture to ensure maximum retention.</p>
                          <button className="mt-8 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold transition-all shadow-lg shadow-green-500/30">
                            Start Quiz
                          </button>
                        </>
                      )}

                      {activeTab === 'assignment' && (
                        <>
                          <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/50 text-purple-500 rounded-full flex items-center justify-center mb-6">
                            <UploadCloud size={48} />
                          </div>
                          <h3 className="text-3xl font-bold mb-4">Submit Assignment</h3>
                          <p className="text-gray-500 max-w-md">Upload your project files or write your solutions for peer and mentor evaluation.</p>
                          <div className="mt-8 w-full max-w-sm border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                            <span className="text-indigo-600 font-semibold">Click to upload</span> or drag and drop
                          </div>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

// NextJS Suspense Wrapper to handle `useSearchParams` client-side warning dynamically safely
export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <ClassContent />
    </Suspense>
  );
}
