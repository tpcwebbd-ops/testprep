look at the page.tsx 
```
'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useGetCoursesQuery } from '@/redux/features/course/courseSlice';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Lock,
  Check,
  Star,
  Play,
  FileText,
  X,
  ChevronRight,
  Trophy,
  Sparkles,
  Zap,
  Award,
  RotateCcw,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

/*
|-----------------------------------------
| Types & Interfaces
|-----------------------------------------
*/

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface ContentData {
  uid?: string;
  name?: string;
  url?: string; // For videos
  questions?: Question[]; // For direct assignments
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // To handle nested "0", "1" assignment objects
}

interface CourseContentItem {
  id: string;
  key: string;
  name: string;
  type: string; // 'Videos', 'Assignments', 'video'
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
}

interface EnrichedCourse extends Course {
  status: 'locked' | 'current' | 'completed';
  progressPercentage: number;
}

// Discriminated Union for Content Payload
type VideoPayload = { url: string; description: string };
type QuizPayload = { questions: Question[] };

type ParsedContent = { type: 'VIDEO'; payload: VideoPayload } | { type: 'QUIZ'; payload: QuizPayload } | { type: 'UNKNOWN'; payload: null };

/*
|-----------------------------------------
| Helper Functions
|-----------------------------------------
*/

const getDayNumber = (dayStr: string): number => {
  const match = dayStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : 999;
};

const extractYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// Helper to normalize content data with strict typing
const parseContentItem = (item: CourseContentItem): ParsedContent => {
  const typeStr = item.type.toLowerCase();

  if (typeStr.includes('video')) {
    return {
      type: 'VIDEO',
      payload: {
        url: item.data.url || '',
        description: item.data.description || '',
      },
    };
  }

  if (typeStr.includes('assignment')) {
    let questions: Question[] = [];

    if (Array.isArray(item.data.questions)) {
      questions = item.data.questions;
    } else {
      // Search for nested objects containing questions using unknown + type narrowing
      Object.values(item.data).forEach((val: unknown) => {
        // Safe type check for the nested structure
        if (val && typeof val === 'object' && 'questions' in val && Array.isArray((val as { questions: unknown[] }).questions)) {
          questions = [...questions, ...(val as { questions: Question[] }).questions];
        }
      });
    }

    // Fallback if empty (mocking questions for demo if data is missing)
    if (questions.length === 0) {
      questions = [{ id: 'mock1', question: 'Is this a placeholder question?', options: ['Yes', 'No'], correctAnswer: 'Yes' }];
    }

    return { type: 'QUIZ', payload: { questions } };
  }

  return { type: 'UNKNOWN', payload: null };
};

/*
|-----------------------------------------
| Sub-Components
|-----------------------------------------
*/

// --- Video Player Component ---
const VideoPlayer = ({ url, onComplete }: { url: string; onComplete: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const youtubeId = extractYoutubeId(url);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-complete logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setTimeout(() => {
        // Enable this line to auto-complete after 5s
        // onComplete();
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, onComplete]);

  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden relative group">
      {youtubeId ? (
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&enablejsapi=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsPlaying(true)}
        />
      ) : (
        <video ref={videoRef} src={url} controls className="w-full h-full" onPlay={() => setIsPlaying(true)} onEnded={onComplete} />
      )}

      {!isPlaying && !youtubeId && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all cursor-pointer"
          onClick={() => {
            videoRef.current?.play();
            setIsPlaying(true);
          }}
        >
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-xl">
            <Play fill="white" className="text-white ml-1" size={32} />
          </div>
        </div>
      )}

      <motion.button
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2 }}
        onClick={onComplete}
        className="absolute bottom-4 right-4 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg z-20"
      >
        <CheckCircle size={16} /> Mark as Watched
      </motion.button>
    </div>
  );
};

// --- Quiz Component ---
const QuizPlayer = ({ questions, onComplete }: { questions: Question[]; onComplete: () => void }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentQ = questions[currentQIndex];

  const handleOptionSelect = (opt: string) => {
    if (isCorrect !== null) return;
    setSelectedOption(opt);
    const correct = opt === currentQ.correctAnswer;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      setShowResult(true);
      setTimeout(onComplete, 1500);
    }
  };

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
          <Trophy className="text-emerald-600" size={40} />
        </motion.div>
        <h3 className="text-2xl font-bold text-slate-800">Quiz Completed!</h3>
        <p className="text-slate-500 font-medium">
          You scored {score} out of {questions.length}
        </p>
        <p className="text-emerald-600 font-bold mt-2 animate-pulse">Assignment Marked Complete!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[60vh]">
      <div className="flex justify-between items-center mb-4 text-sm font-bold text-slate-400">
        <span>
          Question {currentQIndex + 1} / {questions.length}
        </span>
        <span>Score: {score}</span>
      </div>

      <div className="mb-6">
        <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-4">{currentQ.question}</h3>
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(opt)}
              disabled={isCorrect !== null}
              className={`w-full p-4 rounded-xl text-left font-medium transition-all border-2 flex justify-between items-center
                ${
                  selectedOption === opt
                    ? opt === currentQ.correctAnswer
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                      : 'bg-red-50 border-red-500 text-red-700'
                    : isCorrect !== null && opt === currentQ.correctAnswer
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                      : 'bg-white border-slate-200 hover:border-blue-300 text-slate-600'
                }
              `}
            >
              {opt}
              {selectedOption === opt && (opt === currentQ.correctAnswer ? <Check size={20} /> : <X size={20} />)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <button
          onClick={handleNext}
          disabled={isCorrect === null}
          className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
            ${isCorrect !== null ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
          `}
        >
          {currentQIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

// --- Active Task Modal Overlay ---
const ActiveTaskOverlay = ({ item, onClose, onComplete }: { item: CourseContentItem; onClose: () => void; onComplete: () => void }) => {
  // Use the parsed object which has the discriminated union type
  const parsedContent = parseContentItem(item);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      className="absolute inset-0 z-50 bg-white flex flex-col"
    >
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition">
            <RotateCcw size={18} className="text-slate-500" />
          </button>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">{item.type}</span>
            <h3 className="font-bold text-slate-800 line-clamp-1">{item.heading || item.name}</h3>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-slate-50/50 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl bg-white p-4 md:p-6 rounded-2xl shadow-xl border border-slate-100">
          {parsedContent.type === 'VIDEO' && <VideoPlayer url={parsedContent.payload.url} onComplete={onComplete} />}

          {parsedContent.type === 'QUIZ' && <QuizPlayer questions={parsedContent.payload.questions} onComplete={onComplete} />}

          {parsedContent.type === 'UNKNOWN' && (
            <div className="text-center py-10">
              <AlertCircle size={40} className="mx-auto text-amber-500 mb-2" />
              <p>Content type not supported.</p>
              <button onClick={onComplete} className="mt-4 underline text-blue-500">
                Skip & Mark Complete
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/*
|-----------------------------------------
| Main Components
|-----------------------------------------
*/

const LevelNode = ({
  course,
  index,
  onClick,
  isLast,
}: {
  course: EnrichedCourse;
  index: number;
  onClick: (course: EnrichedCourse) => void;
  isLast: boolean;
}) => {
  const isLeft = index % 2 === 0;
  const { status, progressPercentage } = course;
  const [isHovered, setIsHovered] = useState(false);

  const nodeVariants: Variants = {
    hidden: { scale: 0, opacity: 0, y: 50 },
    visible: { scale: 1, opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20, delay: index * 0.1 } },
    hover: { scale: 1.15, y: -8, transition: { type: 'spring', stiffness: 400, damping: 10 } },
  };

  return (
    <div className={`relative flex w-full ${isLeft ? 'justify-start md:justify-end md:pr-[52%]' : 'justify-end md:justify-start md:pl-[52%]'} mb-16 md:mb-24`}>
      {!isLast && (
        <div className="absolute top-[4.5rem] md:top-20 left-1/2 -ml-[1px] w-0.5 h-20 md:h-28 -z-10">
          <motion.div
            className={`w-full h-full border-l-2 border-dashed transition-colors duration-500 ${status === 'completed' ? 'border-emerald-400' : 'border-slate-300'}`}
            initial={{ scaleY: 0, originY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: index * 0.15 + 0.3, duration: 0.4 }}
          />
        </div>
      )}

      <div className="relative group">
        {status === 'current' && (
          <>
            <motion.div
              animate={{ boxShadow: ['0 0 0 0px rgba(59, 130, 246, 0.4)', '0 0 0 20px rgba(59, 130, 246, 0)'] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-blue-500 opacity-20"
            />
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full blur opacity-75 animate-pulse" />
          </>
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
            w-20 h-20 md:w-28 md:h-28 rounded-full border-4 shadow-xl 
            transition-all duration-300 overflow-hidden bg-white
            ${
              status === 'completed'
                ? 'border-emerald-500 text-emerald-600'
                : status === 'current'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-slate-300 text-slate-400 grayscale bg-slate-100'
            }
          `}
        >
          {status === 'current' && (
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" fill="transparent" stroke="#e2e8f0" strokeWidth="8" />
              <motion.circle
                cx="50"
                cy="50"
                r="46"
                fill="transparent"
                stroke="#3b82f6"
                strokeWidth="8"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progressPercentage / 100 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                strokeLinecap="round"
                className="drop-shadow-md"
              />
            </svg>
          )}

          <div className="relative z-10 flex flex-col items-center">
            {status === 'completed' ? (
              <Check size={32} strokeWidth={4} />
            ) : status === 'locked' ? (
              <Lock size={28} />
            ) : (
              <Play size={32} fill="currentColor" className={isHovered ? 'scale-110 transition-transform' : ''} />
            )}

            <div
              className={`mt-1 text-[10px] md:text-xs font-black uppercase tracking-widest ${status === 'completed' ? 'text-emerald-700' : 'text-slate-500'}`}
            >
              {getDayNumber(course.courseDay)}
            </div>
          </div>
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 + index * 0.1 }}
        className={`absolute top-4 md:top-6 ${isLeft ? 'right-[calc(100%+1rem)] md:right-[calc(52%+14rem)] text-right' : 'left-[calc(100%+14rem)] md:left-[calc(52%+1rem)] text-left'} min-w-[140px] z-0 hidden sm:block`}
      >
        <h3 className={`font-bold text-sm ${status === 'completed' ? 'text-emerald-600' : status === 'current' ? 'text-blue-600' : 'text-slate-400'}`}>
          {course.courseDay}
        </h3>
        <p className="text-xs text-slate-500 font-semibold truncate max-w-[150px]">{course.courseName}</p>
        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 justify-end">
          {status === 'completed' && <Star size={10} className="text-yellow-400 fill-yellow-400" />}
          {course.content.length} Tasks
        </div>
      </motion.div>
    </div>
  );
};

const ContentModal = ({
  course,
  isOpen,
  onClose,
  completedContentIds,
  onTaskComplete,
}: {
  course: EnrichedCourse | null;
  isOpen: boolean;
  onClose: () => void;
  completedContentIds: string[];
  onTaskComplete: (contentId: string) => void;
}) => {
  const [activeTask, setActiveTask] = useState<CourseContentItem | null>(null);

  if (!isOpen || !course) return null;

  const courseContentIds = course.content.map(c => c.id);
  const completedInThisCourse = courseContentIds.filter(id => completedContentIds.includes(id)).length;
  const progress = course.content.length > 0 ? (completedInThisCourse / course.content.length) * 100 : 0;

  const handleTaskClick = (item: CourseContentItem) => {
    setActiveTask(item);
  };

  const handleTaskFinish = () => {
    if (activeTask) {
      onTaskComplete(activeTask.id);
      setActiveTask(null);
    }
  };

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
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            className="fixed inset-0 m-auto z-50 w-[95%] sm:w-[90%] max-w-3xl h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div
              className={`p-6 md:p-8 text-white relative overflow-hidden shrink-0 transition-colors duration-500
              ${progress === 100 ? 'bg-gradient-to-br from-emerald-500 to-green-600' : 'bg-gradient-to-br from-blue-600 to-indigo-700'}
            `}
            >
              <button onClick={onClose} className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-full backdrop-blur-md transition">
                <X size={20} />
              </button>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 opacity-90">
                  {progress === 100 ? <Award size={18} className="text-yellow-300" /> : <Zap size={18} className="text-blue-200" />}
                  <span className="text-xs font-bold uppercase tracking-wider">{course.courseName}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-4">{course.courseDay}</h2>

                <div className="bg-black/20 h-3 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={`h-full ${progress === 100 ? 'bg-white' : 'bg-yellow-400'}`}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs font-medium opacity-80">
                  <span>
                    {completedInThisCourse} / {course.content.length} Completed
                  </span>
                  <span>{Math.round(progress)}%</span>
                </div>
              </div>
              <Sparkles className="absolute bottom-0 right-0 text-white/10 w-32 h-32 -mb-8 -mr-8" />
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 relative">
              <AnimatePresence mode="wait">
                {activeTask ? (
                  <ActiveTaskOverlay key="active-task" item={activeTask} onClose={() => setActiveTask(null)} onComplete={handleTaskFinish} />
                ) : (
                  <div className="space-y-3 pb-20">
                    {course.content.length === 0 ? (
                      <div className="text-center py-20 opacity-50">
                        <Lock size={48} className="mx-auto mb-2" />
                        <p>Content locked or coming soon.</p>
                      </div>
                    ) : (
                      course.content.map((item, idx) => {
                        const isCompleted = completedContentIds.includes(item.id);
                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => handleTaskClick(item)}
                            className={`
                              group flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all
                              ${
                                isCompleted
                                  ? 'bg-emerald-50/50 border-emerald-200 hover:bg-emerald-50'
                                  : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-md'
                              }
                            `}
                          >
                            <div
                              className={`
                              w-12 h-12 rounded-full flex items-center justify-center mr-4 shrink-0 transition-transform group-hover:scale-110
                              ${
                                isCompleted
                                  ? 'bg-emerald-500 text-white'
                                  : item.type.toLowerCase().includes('video')
                                    ? 'bg-red-100 text-red-500'
                                    : 'bg-blue-100 text-blue-500'
                              }
                            `}
                            >
                              {isCompleted ? (
                                <Check size={20} strokeWidth={3} />
                              ) : item.type.toLowerCase().includes('video') ? (
                                <Play size={20} fill="currentColor" />
                              ) : (
                                <FileText size={20} />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className={`font-bold text-sm md:text-base truncate ${isCompleted ? 'text-emerald-900' : 'text-slate-800'}`}>
                                {item.heading || item.name}
                              </h4>
                              <div className="flex items-center gap-2 text-xs mt-1">
                                <span
                                  className={`px-2 py-0.5 rounded font-semibold capitalize ${isCompleted ? 'bg-emerald-200/50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
                                >
                                  {item.type}
                                </span>
                                {item.data?.totalMarks && (
                                  <span className="text-orange-500 flex items-center gap-1 font-bold">
                                    <Trophy size={10} /> {item.data.totalMarks} pts
                                  </span>
                                )}
                              </div>
                            </div>

                            <div
                              className={`
                              w-8 h-8 rounded-full flex items-center justify-center transition-colors
                              ${isCompleted ? 'text-emerald-500' : 'text-slate-300 group-hover:text-blue-500'}
                            `}
                            >
                              <ChevronRight size={20} />
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {!activeTask && (
              <div className="p-4 border-t bg-white shrink-0 z-10">
                <button onClick={onClose} className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition">
                  Back to Map
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Page = () => {
  const { data: coursesData, isLoading, error } = useGetCoursesQuery({ page: 1, limit: 1000, q: '' });
  const [selectedCourse, setSelectedCourse] = useState<EnrichedCourse | null>(null);
  console.log('coursesData', coursesData);
  // Initialize with some data for demo or pull from DB
  const [completedContentIds, setCompletedContentIds] = useState<string[]>(['video-video-uid-1-1766560822726']);

  const gameLevels = useMemo<EnrichedCourse[]>(() => {
    if (!coursesData) return [];

    // Safety check for unknown API structure structure
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawCourses: Course[] = Array.isArray(coursesData) ? coursesData : (coursesData as any).courses || [];

    const sorted = [...rawCourses].sort((a, b) => getDayNumber(a.courseDay) - getDayNumber(b.courseDay));

    let isPrevCompleted = true;

    return sorted.map(course => {
      const totalContent = course.content.length;
      const completedCount = course.content.filter(c => completedContentIds.includes(c.id)).length;
      const isComplete = totalContent > 0 && completedCount === totalContent;
      const progressPercentage = totalContent > 0 ? (completedCount / totalContent) * 100 : 0;

      let status: 'locked' | 'current' | 'completed' = 'locked';

      if (isComplete) {
        status = 'completed';
        isPrevCompleted = true;
      } else if (isPrevCompleted) {
        status = 'current';
        isPrevCompleted = false;
      } else {
        status = 'locked';
        isPrevCompleted = false;
      }

      return { ...course, status, progressPercentage };
    });
  }, [coursesData, completedContentIds]);

  const handleNodeClick = (course: EnrichedCourse) => {
    setSelectedCourse(course);
  };

  const handleTaskComplete = (contentId: string) => {
    if (!completedContentIds.includes(contentId)) {
      setCompletedContentIds(prev => [...prev, contentId]);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-blue-500 font-bold">Loading Map...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading courses.</div>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-x-hidden relative pb-20 select-none">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-full opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '30px 30px' }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-[20%] -right-[20%] w-[800px] h-[800px] bg-blue-300/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-[20%] -left-[20%] w-[800px] h-[800px] bg-purple-300/20 rounded-full blur-[100px]"
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-20 relative">
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-block">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200 uppercase tracking-widest">
                Campaign Mode
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tight mb-2">LEARNING QUEST</h1>
            <p className="text-slate-500 font-medium">Complete tasks to unlock new days</p>
          </motion.div>
        </header>

        <div className="flex flex-col items-center relative min-h-[500px]">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-8 z-20">
            <div className="bg-emerald-500 text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-emerald-200 flex items-center gap-2">
              <Play size={16} fill="white" /> START
            </div>
            <div className="h-8 w-0.5 bg-emerald-300 mx-auto mt-2" />
          </motion.div>

          <div className="w-full relative">
            {gameLevels.map((course, index) => (
              <LevelNode key={course._id} course={course} index={index} onClick={handleNodeClick} isLast={index === gameLevels.length - 1} />
            ))}
          </div>

          {gameLevels.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-8 flex flex-col items-center opacity-50">
              <div className="h-8 w-0.5 border-l-2 border-dotted border-slate-300 mb-2" />
              <Trophy size={40} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">Victory</span>
            </motion.div>
          )}
        </div>
      </div>

      <ContentModal
        course={selectedCourse}
        isOpen={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
        completedContentIds={completedContentIds}
        onTaskComplete={handleTaskComplete}
      />
    </main>
  );
};

export default Page;
```

and here is url = "http://localhost:3000/dashboard/my-course/free-course" 

Now Your task is 
1. get "free-course" from params.
2. filter courseName by the params.