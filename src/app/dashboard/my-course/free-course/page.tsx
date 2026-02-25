'use client';

import React, { useState, useMemo, useRef } from 'react';
import { usePathname } from 'next/navigation';
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
  Zap,
  Award,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  SearchX,
  BookOpen,
  FileBadge,
} from 'lucide-react';
import { useGetCoursesQuery } from '@/redux/features/course/courseSlice';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface ContentData {
  uid?: string;
  name?: string;
  url?: string;
  questions?: Question[];
  totalMarks?: number;
  description?: string;
  [key: string]: unknown;
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
}

interface EnrichedCourse extends Course {
  status: 'locked' | 'current' | 'completed';
  progressPercentage: number;
}

type VideoPayload = { url: string; description: string };
type QuizPayload = { questions: Question[] };
type TextPayload = { text: string };
type DocPayload = { url: string };

type ParsedContent =
  | { type: 'VIDEO'; payload: VideoPayload }
  | { type: 'QUIZ'; payload: QuizPayload }
  | { type: 'TEXT'; payload: TextPayload }
  | { type: 'DOCUMENT'; payload: DocPayload }
  | { type: 'UNKNOWN'; payload: null };

const ITEM_HEIGHT = 200;
const LOGICAL_WIDTH = 200;
const CENTER_X = 100;
const SWAY_AMPLITUDE = 40;
const SVG_Y_OFFSET = 16;

const getDayNumber = (dayStr: string): number => {
  const match = dayStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : 999;
};

const extractYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const toKebabCase = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-');
};

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

  if (typeStr.includes('assignment') || typeStr.includes('quiz')) {
    let questions: Question[] = [];

    if (Array.isArray(item.data.questions)) {
      questions = item.data.questions;
    } else {
      Object.values(item.data).forEach((val: unknown) => {
        if (val && typeof val === 'object' && 'questions' in val && Array.isArray((val as Record<string, unknown>).questions)) {
          questions = [...questions, ...((val as Record<string, unknown>).questions as Question[])];
        }
      });
    }

    if (questions.length === 0) {
      questions = [
        {
          id: 'mock1',
          question: 'Are you ready to complete this assignment?',
          options: ['Yes', 'No'],
          correctAnswer: 'Yes',
        },
      ];
    }

    return { type: 'QUIZ', payload: { questions } };
  }

  if (typeStr.includes('text') || typeStr.includes('article')) {
    return {
      type: 'TEXT',
      payload: { text: item.data.description || 'Please read the provided materials carefully.' },
    };
  }

  if (typeStr.includes('doc') || typeStr.includes('pdf')) {
    return {
      type: 'DOCUMENT',
      payload: { url: item.data.url || '#' },
    };
  }

  return { type: 'UNKNOWN', payload: null };
};

const VideoPlayer = ({ url, onComplete }: { url: string; onComplete: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const youtubeId = extractYoutubeId(url);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="w-full aspect-video bg-black rounded-sm overflow-hidden relative group shrink-0 shadow-2xl">
        {youtubeId ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&enablejsapi=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setIsPlaying(true)}
          />
        ) : (
          <video ref={videoRef} src={url} controls className="w-full h-full object-cover" onPlay={() => setIsPlaying(true)} />
        )}

        {!isPlaying && !youtubeId && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all cursor-pointer"
            onClick={() => {
              videoRef.current?.play();
              setIsPlaying(true);
            }}
          >
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-xl hover:scale-110 transition-transform">
              <Play fill="white" className="text-white ml-1" size={24} />
            </div>
          </div>
        )}
      </div>
      <div className="mt-auto pt-4">
        <button
          onClick={onComplete}
          className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-sm font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-500/30 transition-all transform hover:-translate-y-1"
        >
          <CheckCircle size={20} /> Complete Video Task
        </button>
      </div>
    </div>
  );
};

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
    }
  };

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-4 shadow-2xl shadow-emerald-200"
        >
          <Trophy className="text-emerald-500" size={40} />
        </motion.div>
        <h3 className="text-xl font-black text-zinc-800 mb-2">Quiz Completed!</h3>
        <p className="text-sm text-zinc-500 font-medium mb-4">
          You scored <span className="text-emerald-600 font-bold">{score}</span> out of {questions.length}
        </p>
        <button
          onClick={onComplete}
          className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-sm font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-1"
        >
          <CheckCircle size={20} /> Complete Assignment
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {questions.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-500 ${
                idx === currentQIndex ? 'w-8 bg-violet-500' : idx < currentQIndex ? 'w-4 bg-emerald-400' : 'w-4 bg-zinc-200'
              }`}
            />
          ))}
        </div>
        <span className="text-xs font-bold text-zinc-400 bg-zinc-100 px-3 py-1 rounded-full">Score: {score}</span>
      </div>

      <div className="mb-4 flex-1">
        <h3 className="text-base md:text-lg font-bold text-zinc-800 mb-4 leading-tight">{currentQ.question}</h3>
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(opt)}
              disabled={isCorrect !== null}
              className={`w-full p-4 rounded-sm text-left font-semibold text-sm transition-all border-2 flex justify-between items-center group
                ${
                  selectedOption === opt
                    ? opt === currentQ.correctAnswer
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md'
                      : 'bg-red-50 border-red-500 text-red-700 shadow-md'
                    : isCorrect !== null && opt === currentQ.correctAnswer
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                      : 'bg-white border-zinc-200 hover:border-violet-300 text-zinc-600 hover:shadow-md hover:-translate-y-0.5'
                }
              `}
            >
              {opt}
              {selectedOption === opt &&
                (opt === currentQ.correctAnswer ? <Check size={20} className="text-emerald-600" /> : <X size={20} className="text-red-600" />)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-4">
        <button
          onClick={handleNext}
          disabled={isCorrect === null}
          className={`w-full py-4 rounded-sm font-bold text-sm flex items-center justify-center gap-2 transition-all
            ${
              isCorrect !== null
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30 hover:bg-violet-500 hover:-translate-y-1'
                : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
            }
          `}
        >
          {currentQIndex === questions.length - 1 ? 'See Results' : 'Next Question'}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

const GenericViewer = ({ title, icon, onComplete }: { title: string; icon: React.ReactNode; onComplete: () => void }) => {
  return (
    <div className="flex flex-col h-full items-center justify-center text-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-24 h-24 bg-violet-50 text-violet-500 rounded-full flex items-center justify-center mb-4 shadow-inner"
      >
        {icon}
      </motion.div>
      <h3 className="text-lg font-bold text-zinc-800 mb-4">{title}</h3>
      <p className="text-zinc-500 text-sm mb-4 max-w-md">
        Review the materials carefully. Once you have understood the content, mark this task as complete to continue your journey.
      </p>
      <button
        onClick={onComplete}
        className="w-full max-w-md py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-sm font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-500/30 transition-all transform hover:-translate-y-1"
      >
        <CheckCircle size={20} /> Complete Task
      </button>
    </div>
  );
};

const ActiveTaskOverlay = ({ item, onClose, onComplete }: { item: CourseContentItem; onClose: () => void; onComplete: () => void }) => {
  const parsedContent = parseContentItem(item);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="absolute inset-0 z-50 bg-zinc-50 flex flex-col"
    >
      <div className="p-4 border-b border-zinc-200 bg-white flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-full transition-all hover:-rotate-90">
            <X size={16} />
          </button>
          <div className="flex flex-col">
            <span className="text-xs font-black text-violet-500 uppercase tracking-widest">{item.type}</span>
            <h3 className="font-bold text-zinc-800 text-sm line-clamp-1">{item.heading || item.name}</h3>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-zinc-50 flex flex-col items-center">
        <div className="w-full max-w-3xl bg-white p-4 rounded-sm shadow-xl border border-zinc-100 min-h-full flex flex-col">
          {parsedContent.type === 'VIDEO' && <VideoPlayer url={parsedContent.payload.url} onComplete={onComplete} />}

          {parsedContent.type === 'QUIZ' && <QuizPlayer questions={parsedContent.payload.questions} onComplete={onComplete} />}

          {parsedContent.type === 'TEXT' && <GenericViewer title="Reading Material" icon={<BookOpen size={40} />} onComplete={onComplete} />}

          {parsedContent.type === 'DOCUMENT' && <GenericViewer title="Document Review" icon={<FileBadge size={40} />} onComplete={onComplete} />}

          {parsedContent.type === 'UNKNOWN' && (
            <div className="flex flex-col items-center justify-center text-center py-4 flex-1">
              <AlertCircle size={40} className="text-amber-400 mb-4" />
              <h3 className="text-base font-bold text-zinc-700 mb-2">Unsupported Content</h3>
              <p className="text-zinc-500 text-sm mb-4 max-w-sm">This content format is not fully supported in this view.</p>
              <button onClick={onComplete} className="px-4 py-2 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-sm font-bold text-sm transition-colors">
                Mark Complete Anyway
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ContentModal = ({
  course,
  isOpen,
  onClose,
  completedContentIds,
  onTaskComplete,
  onDayComplete,
}: {
  course: EnrichedCourse | null;
  isOpen: boolean;
  onClose: () => void;
  completedContentIds: string[];
  onTaskComplete: (contentId: string) => void;
  onDayComplete: () => void;
}) => {
  const [activeTask, setActiveTask] = useState<CourseContentItem | null>(null);

  if (!isOpen || !course) return null;

  const courseContentIds = course.content.map(c => c.id);
  const completedInThisCourse = courseContentIds.filter(id => completedContentIds.includes(id)).length;
  const progress = course.content.length > 0 ? (completedInThisCourse / course.content.length) * 100 : 0;
  const allTasksCompleted = completedInThisCourse === course.content.length && course.content.length > 0;

  const handleTaskFinish = () => {
    if (activeTask) {
      onTaskComplete(activeTask.id);
      setActiveTask(null);
    }
  };

  const getTaskIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('video')) return <Play size={20} className="ml-1" fill="currentColor" />;
    if (t.includes('assignment') || t.includes('quiz')) return <FileText size={20} />;
    if (t.includes('text') || t.includes('article')) return <BookOpen size={20} />;
    if (t.includes('doc') || t.includes('pdf')) return <FileBadge size={20} />;
    return <Star size={20} />;
  };

  const getTaskColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('video')) return 'bg-red-50 text-red-500 border-red-200';
    if (t.includes('assignment') || t.includes('quiz')) return 'bg-violet-50 text-violet-500 border-violet-200';
    if (t.includes('text') || t.includes('article')) return 'bg-purple-50 text-purple-500 border-purple-200';
    if (t.includes('doc') || t.includes('pdf')) return 'bg-orange-50 text-orange-500 border-orange-200';
    return 'bg-zinc-50 text-zinc-500 border-zinc-200';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !activeTask && onClose()}
            className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md z-40"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            className="fixed inset-0 m-auto z-50 w-[95%] sm:w-[90%] max-w-4xl h-[90vh] bg-white rounded-sm shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="relative shrink-0 overflow-hidden">
              <div
                className={`absolute inset-0 transition-colors duration-700 ${
                  progress === 100 ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-violet-900 to-fuchsia-800'
                }`}
              />
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

              <div className="relative p-4 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
                {!activeTask && (
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md transition-all z-20"
                  >
                    <X size={16} />
                  </button>
                )}

                <div className="z-10 relative w-full">
                  <div className="flex items-center gap-2 mb-4 opacity-90">
                    {progress === 100 ? (
                      <div className="bg-white/20 p-2 rounded-sm backdrop-blur-sm">
                        <Award size={16} className="text-yellow-300" />
                      </div>
                    ) : (
                      <div className="bg-white/20 p-2 rounded-sm backdrop-blur-sm">
                        <Zap size={16} className="text-violet-200" />
                      </div>
                    )}
                    <span className="text-xs font-bold uppercase tracking-widest">{course.courseName}</span>
                  </div>
                  <h2 className="text-2xl font-black mb-4 tracking-tight">{course.courseDay}</h2>

                  <div className="w-full bg-black/30 h-2 rounded-full overflow-hidden backdrop-blur-sm border border-white/20 shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, type: 'spring' }}
                      className={`h-full relative overflow-hidden ${progress === 100 ? 'bg-gradient-to-r from-emerald-300 to-white' : 'bg-gradient-to-r from-violet-400 to-fuchsia-300'}`}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </motion.div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs font-bold opacity-90">
                    <span>
                      {completedInThisCourse} of {course.content.length} Tasks Complete
                    </span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-zinc-50 relative p-4">
              <AnimatePresence mode="wait">
                {activeTask ? (
                  <ActiveTaskOverlay key="active-task" item={activeTask} onClose={() => setActiveTask(null)} onComplete={handleTaskFinish} />
                ) : (
                  <div className="grid gap-4 max-w-3xl mx-auto pb-4">
                    {course.content.length === 0 ? (
                      <div className="text-center py-4 opacity-50 flex flex-col items-center">
                        <Lock size={40} className="mb-4 text-zinc-300" />
                        <p className="text-sm font-medium">Content locked or coming soon.</p>
                      </div>
                    ) : (
                      course.content.map((item, idx) => {
                        const isCompleted = completedContentIds.includes(item.id);
                        const colors = getTaskColor(item.type);

                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => setActiveTask(item)}
                            className={`
                              group relative overflow-hidden flex items-center p-4 rounded-sm cursor-pointer transition-all duration-300 border-2
                              ${
                                isCompleted
                                  ? 'bg-emerald-50/80 border-emerald-200 hover:border-emerald-300 shadow-sm'
                                  : 'bg-white border-zinc-100 hover:border-violet-400 hover:shadow-xl hover:-translate-y-1'
                              }
                            `}
                          >
                            <div
                              className={`
                              w-12 h-12 rounded-sm flex items-center justify-center mr-4 shrink-0 transition-transform duration-500 group-hover:scale-110 shadow-sm border
                              ${isCompleted ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white border-emerald-400 shadow-emerald-200' : colors}
                            `}
                            >
                              {isCompleted ? <Check size={24} strokeWidth={3} /> : getTaskIcon(item.type)}
                            </div>

                            <div className="flex-1 min-w-0 pr-4">
                              <h4
                                className={`font-bold text-sm truncate mb-1 transition-colors ${isCompleted ? 'text-emerald-900' : 'text-zinc-800 group-hover:text-violet-700'}`}
                              >
                                {item.heading || item.name}
                              </h4>
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span
                                  className={`px-2 py-1 rounded-full font-bold uppercase tracking-wider ${isCompleted ? 'bg-emerald-200/50 text-emerald-800' : 'bg-zinc-100 text-zinc-500'}`}
                                >
                                  {item.type}
                                </span>
                                {item.data?.totalMarks && (
                                  <span className="flex items-center gap-1 font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-full">
                                    <Trophy size={12} /> {item.data.totalMarks} Points
                                  </span>
                                )}
                              </div>
                            </div>

                            <div
                              className={`
                              w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                              ${isCompleted ? 'text-emerald-500 bg-emerald-100' : 'text-zinc-300 bg-zinc-50 group-hover:bg-violet-100 group-hover:text-violet-600'}
                            `}
                            >
                              <ChevronRight size={16} className={isCompleted ? '' : 'group-hover:translate-x-1 transition-transform'} />
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
              <div className="p-4 border-t border-zinc-200 bg-white shrink-0 z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                <button
                  onClick={onDayComplete}
                  disabled={!allTasksCompleted}
                  className={`
                    w-full py-4 rounded-sm font-black text-sm tracking-wide uppercase transition-all duration-500 flex items-center justify-center gap-2
                    ${
                      allTasksCompleted
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-xl shadow-emerald-500/30 transform hover:-translate-y-1'
                        : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                    }
                  `}
                >
                  {allTasksCompleted ? (
                    <>
                      <CheckCircle size={20} /> Complete Today&apos;s Module
                    </>
                  ) : (
                    <>
                      <Lock size={20} /> Complete All Tasks to Finish Day
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const TimelineItem = ({
  course,
  index,
  totalItems,
  onClick,
}: {
  course: EnrichedCourse;
  index: number;
  totalItems: number;
  onClick: (course: EnrichedCourse) => void;
}) => {
  const isEven = index % 2 === 0;
  const dotPosition = isEven ? '30%' : '70%';
  const { status, progressPercentage } = course;

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 200, damping: 20, delay: index * 0.1 },
    },
    hover: {
      y: -10,
      scale: 1.02,
      transition: { duration: 0.3 },
    },
  };

  const statusColors = {
    completed: 'from-emerald-900 via-emerald-800 to-teal-900 border-emerald-500 shadow-emerald-500/20 text-emerald-100',
    current: 'from-zinc-900 via-violet-950 to-zinc-900 border-violet-500 shadow-violet-500/30 text-violet-100',
    locked: 'from-zinc-900 via-zinc-800 to-zinc-900 border-zinc-700 text-zinc-400 opacity-80',
  };

  const getGradientClass = statusColors[status];

  return (
    <div className="relative w-full md:mb-0 mb-4 last:mb-0" style={{ height: 'auto', minHeight: `${ITEM_HEIGHT}px` }}>
      <div className="hidden md:block absolute w-full top-0" style={{ height: ITEM_HEIGHT }}>
        <div className="absolute top-1/2 -translate-y-1/2 z-20 flex items-center justify-center" style={{ left: `calc(${dotPosition} - 12px)` }}>
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.2 + index * 0.1 }}
            className={`
              w-6 h-6 rounded-full border-4 shadow-xl relative z-20 flex items-center justify-center
              ${
                status === 'completed'
                  ? 'bg-emerald-500 border-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.8)]'
                  : status === 'current'
                    ? 'bg-violet-500 border-violet-200 shadow-[0_0_20px_rgba(139,92,246,0.8)]'
                    : 'bg-zinc-700 border-zinc-500'
              }
            `}
          >
            {status === 'completed' && <Check size={12} strokeWidth={4} className="text-white" />}
            {status === 'locked' && <Lock size={10} strokeWidth={3} className="text-zinc-400" />}
          </motion.div>
          {status === 'current' && (
            <motion.div
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute w-6 h-6 bg-violet-500 rounded-full"
            />
          )}
        </div>

        {isEven ? (
          <>
            <div className="absolute top-1/2 -translate-y-1/2 flex justify-end pr-16 w-[30%]" style={{ left: 0 }}>
              <div className="text-right">
                <h3 className="text-lg font-black text-white drop-shadow-lg">{course.courseDay}</h3>
                <div className="flex flex-col items-end gap-2 mt-2">
                  <p
                    className={`text-xs font-bold uppercase tracking-widest ${status === 'completed' ? 'text-emerald-400' : status === 'current' ? 'text-violet-400' : 'text-zinc-500'}`}
                  >
                    {status}
                  </p>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-sm bg-white/5 border border-white/10 text-white/50 tracking-widest shadow-sm">
                    PHASE {index + 1} / {totalItems}
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 pl-16 w-[70%]" style={{ left: '30%' }}>
              <TimelineCard
                course={course}
                status={status}
                progress={progressPercentage}
                variants={cardVariants}
                gradient={getGradientClass}
                onClick={() => onClick(course)}
              />
            </div>
          </>
        ) : (
          <>
            <div className="absolute top-1/2 -translate-y-1/2 pr-16 w-[70%] flex justify-end" style={{ left: 0 }}>
              <TimelineCard
                course={course}
                status={status}
                progress={progressPercentage}
                variants={cardVariants}
                gradient={getGradientClass}
                onClick={() => onClick(course)}
                align="right"
              />
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 pl-16 w-[30%]" style={{ left: '70%' }}>
              <div className="text-left">
                <h3 className="text-lg font-black text-white drop-shadow-lg">{course.courseDay}</h3>
                <div className="flex flex-col items-start gap-2 mt-2">
                  <p
                    className={`text-xs font-bold uppercase tracking-widest ${status === 'completed' ? 'text-emerald-400' : status === 'current' ? 'text-violet-400' : 'text-zinc-500'}`}
                  >
                    {status}
                  </p>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-sm bg-white/5 border border-white/10 text-white/50 tracking-widest shadow-sm">
                    PHASE {index + 1} / {totalItems}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="md:hidden flex flex-col pl-10 relative">
        <div
          className={`absolute left-4 top-10 w-4 h-4 -translate-x-1/2 rounded-full border-2 z-20
          ${
            status === 'completed'
              ? 'bg-emerald-500 border-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.8)]'
              : status === 'current'
                ? 'bg-violet-500 border-violet-200 shadow-[0_0_15px_rgba(139,92,246,0.8)]'
                : 'bg-zinc-700 border-zinc-500'
          }
        `}
        />
        {status === 'current' && (
          <motion.div
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute left-4 top-10 w-4 h-4 -translate-x-1/2 bg-violet-500 rounded-full z-10"
          />
        )}

        <div className="mb-4">
          <h3 className="text-lg font-black text-white">{course.courseDay}</h3>
          <div className="flex items-center gap-2 mt-2">
            <p
              className={`text-xs font-bold uppercase tracking-widest ${status === 'completed' ? 'text-emerald-400' : status === 'current' ? 'text-violet-400' : 'text-zinc-500'}`}
            >
              {status}
            </p>
            <span className="text-[10px] font-bold px-2 py-1 rounded-sm bg-white/5 border border-white/10 text-white/50 tracking-widest shadow-sm">
              PHASE {index + 1} / {totalItems}
            </span>
          </div>
        </div>
        <TimelineCard
          course={course}
          status={status}
          progress={progressPercentage}
          variants={cardVariants}
          gradient={getGradientClass}
          onClick={() => onClick(course)}
        />
      </div>
    </div>
  );
};

const TimelineCard = ({
  course,
  status,
  progress,
  variants,
  gradient,
  onClick,
  align = 'left',
}: {
  course: EnrichedCourse;
  status: string;
  progress: number;
  variants: Variants;
  gradient: string;
  onClick: () => void;
  align?: 'left' | 'right';
}) => (
  <motion.button
    variants={variants}
    initial="hidden"
    whileInView="visible"
    whileHover={status !== 'locked' ? 'hover' : undefined}
    whileTap={status !== 'locked' ? { scale: 0.98 } : undefined}
    viewport={{ once: true, margin: '-100px' }}
    onClick={() => status !== 'locked' && onClick()}
    disabled={status === 'locked'}
    className={`
      relative w-full max-w-lg p-4 rounded-sm border border-white/10 shadow-2xl overflow-hidden group text-left
      bg-gradient-to-br ${gradient} backdrop-blur-md
      ${status !== 'locked' ? 'cursor-pointer' : 'cursor-not-allowed'}
    `}
  >
    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    {status === 'current' && (
      <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
        <motion.div
          className="h-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.8)]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1 }}
        />
      </div>
    )}

    <div className={`flex flex-col h-full relative z-10 ${align === 'right' && 'items-end text-right'}`}>
      <div className={`flex items-center gap-2 mb-4 ${align === 'right' && 'flex-row-reverse'}`}>
        <div
          className={`
          w-10 h-10 rounded-sm flex items-center justify-center shadow-lg
          ${
            status === 'completed'
              ? 'bg-emerald-400/20 text-emerald-300'
              : status === 'current'
                ? 'bg-violet-400/20 text-violet-300'
                : 'bg-zinc-700/50 text-zinc-500'
          }
        `}
        >
          {status === 'completed' ? <Award size={20} /> : status === 'locked' ? <Lock size={20} /> : <Zap size={20} />}
        </div>
        <div>
          <h4 className="text-base font-black text-white tracking-tight">{course.courseName}</h4>
          <span className="text-xs font-semibold opacity-80">{course.content.length} Assignments</span>
        </div>
      </div>

      <p className={`text-xs leading-relaxed line-clamp-2 mt-2 ${status === 'locked' ? 'text-zinc-500' : 'text-zinc-300'}`}>
        {course.content.length > 0 ? course.content[0].heading || `Explore the materials for ${course.courseDay}` : 'No content available yet.'}
      </p>

      {status !== 'locked' && (
        <div
          className={`mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${status === 'completed' ? 'text-emerald-300' : 'text-violet-300'}`}
        >
          {status === 'completed' ? 'Review Content' : 'Continue Module'}
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </div>
      )}
    </div>
  </motion.button>
);

const CourseMapContent = ({ coursesData, courseTypeSlug }: { coursesData: unknown; courseTypeSlug: string }) => {
  const [selectedCourse, setSelectedCourse] = useState<EnrichedCourse | null>(null);
  const [completedContentIds, setCompletedContentIds] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const gameLevels = useMemo<EnrichedCourse[]>(() => {
    const rawData = coursesData as { courses?: Course[] } | Course[];
    const rawCourses: Course[] = Array.isArray(rawData) ? rawData : rawData?.courses || [];

    let filteredCourses = rawCourses;
    if (courseTypeSlug) {
      filteredCourses = rawCourses.filter(c => toKebabCase(c.courseName) === courseTypeSlug);
    }

    const sorted = [...filteredCourses].sort((a, b) => getDayNumber(a.courseDay) - getDayNumber(b.courseDay));

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
  }, [coursesData, completedContentIds, courseTypeSlug]);

  const allCourseCompleted = gameLevels.length > 0 && gameLevels.every(level => level.status === 'completed');

  const totalHeight = Math.max(gameLevels.length * ITEM_HEIGHT + 200, 600);

  const getProgressRatio = () => {
    if (gameLevels.length === 0) return 0;
    if (allCourseCompleted) return 1;

    const activeIndex = gameLevels.findIndex(level => level.status === 'current');
    const targetIndex = activeIndex !== -1 ? activeIndex : 0;

    const nodeY = targetIndex * ITEM_HEIGHT + ITEM_HEIGHT / 2 + SVG_Y_OFFSET;
    return nodeY / totalHeight;
  };

  const progressRatio = getProgressRatio();

  const generatePath = () => {
    let path = `M ${CENTER_X} 0 `;
    path += `L ${CENTER_X} ${SVG_Y_OFFSET} `;

    gameLevels.forEach((_, index) => {
      const isEven = index % 2 === 0;
      const targetX = isEven ? CENTER_X - SWAY_AMPLITUDE : CENTER_X + SWAY_AMPLITUDE;
      const currentY = index * ITEM_HEIGHT + ITEM_HEIGHT / 2 + SVG_Y_OFFSET;
      const prevY = index === 0 ? SVG_Y_OFFSET : (index - 1) * ITEM_HEIGHT + ITEM_HEIGHT / 2 + SVG_Y_OFFSET;
      const prevX = index === 0 ? CENTER_X : isEven ? CENTER_X + SWAY_AMPLITUDE : CENTER_X - SWAY_AMPLITUDE;

      const cp1Y = prevY + (currentY - prevY) * 0.5;
      const cp2Y = currentY - (currentY - prevY) * 0.5;

      path += `C ${prevX} ${cp1Y}, ${targetX} ${cp2Y}, ${targetX} ${currentY} `;
    });

    const lastY = (gameLevels.length > 0 ? gameLevels.length - 1 : 0) * ITEM_HEIGHT + ITEM_HEIGHT / 2 + SVG_Y_OFFSET;
    const lastX = (gameLevels.length > 0 ? gameLevels.length - 1 : 0) % 2 === 0 ? CENTER_X - SWAY_AMPLITUDE : CENTER_X + SWAY_AMPLITUDE;

    path += `C ${lastX} ${lastY + 100}, ${CENTER_X} ${lastY + 100}, ${CENTER_X} ${totalHeight}`;
    return path;
  };

  const handleTaskComplete = (contentId: string) => {
    if (!completedContentIds.includes(contentId)) {
      setCompletedContentIds(prev => [...prev, contentId]);
    }
  };

  const handleDayComplete = () => {
    setSelectedCourse(null);
  };

  const triggerCelebration = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 8000);
  };

  return (
    <>
      <div className="flex flex-col items-center relative min-h-[500px] w-full">
        {gameLevels.length > 0 ? (
          <div className="relative w-full max-w-5xl">
            <div className="absolute left-0 top-0 w-full hidden md:block pointer-events-none z-0">
              <svg
                className="w-full h-full overflow-visible"
                viewBox={`0 0 ${LOGICAL_WIDTH} ${totalHeight}`}
                preserveAspectRatio="none"
                style={{ height: totalHeight }}
              >
                <defs>
                  <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#c084fc" stopOpacity="0.2" />
                    <stop offset="20%" stopColor="#a855f7" />
                    <stop offset="50%" stopColor="#d946ef" />
                    <stop offset="80%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
                  </linearGradient>
                  <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <path d={generatePath()} fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="4" strokeLinecap="round" />

                <motion.path
                  animate={{ pathLength: progressRatio }}
                  initial={{ pathLength: 0 }}
                  transition={{ duration: 1.5, type: 'spring', bounce: 0.2 }}
                  d={generatePath()}
                  fill="none"
                  stroke="url(#pathGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  filter="url(#neonGlow)"
                />

                <motion.path
                  animate={{ pathLength: progressRatio }}
                  initial={{ pathLength: 0 }}
                  transition={{ duration: 1.5, type: 'spring', bounce: 0.2 }}
                  d={generatePath()}
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="absolute left-[22px] top-4 bottom-4 w-1 bg-zinc-800 md:hidden z-0 rounded-full overflow-hidden">
              <motion.div
                className="w-full bg-gradient-to-b from-violet-500 via-fuchsia-500 to-emerald-500"
                initial={{ height: 0 }}
                animate={{ height: `${progressRatio * 100}%` }}
                transition={{ duration: 1.5, type: 'spring', bounce: 0.2 }}
              />
            </div>

            <div className="relative pt-4 z-10 w-full">
              {gameLevels.map((course, index) => (
                <TimelineItem key={course._id} course={course} index={index} totalItems={gameLevels.length} onClick={setSelectedCourse} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 flex flex-col items-center justify-center relative z-20"
            >
              <div className="relative group w-full max-w-sm">
                <div
                  className={`absolute -inset-1 rounded-sm blur-xl opacity-50 transition-all duration-500 ${allCourseCompleted ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 group-hover:opacity-100 animate-pulse' : 'bg-zinc-800'}`}
                />
                <button
                  disabled={!allCourseCompleted}
                  onClick={triggerCelebration}
                  className={`
                      relative w-full py-4 rounded-sm font-black text-lg uppercase tracking-widest transition-all duration-500 flex flex-col items-center justify-center gap-2 border-2
                      ${
                        allCourseCompleted
                          ? 'bg-zinc-900 border-emerald-400 text-white shadow-2xl hover:bg-zinc-800 hover:scale-105'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed'
                      }
                    `}
                >
                  <Trophy size={32} className={allCourseCompleted ? 'text-emerald-400 mb-2' : 'text-zinc-700 mb-2'} />
                  Complete Course
                  {!allCourseCompleted && (
                    <span className="text-xs font-bold text-zinc-500 mt-2 normal-case tracking-normal">Finish all modules to unlock</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-4 px-4 bg-zinc-900/50 backdrop-blur-md rounded-sm border border-zinc-800 shadow-2xl max-w-lg w-full"
          >
            <SearchX size={60} className="text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-4">No Quests Found</h3>
            <p className="text-xs text-zinc-400">The realm of &quot;{courseTypeSlug}&quot; is currently empty. Check back soon for new adventures.</p>
          </motion.div>
        )}
      </div>

      <ContentModal
        course={selectedCourse}
        isOpen={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
        completedContentIds={completedContentIds}
        onTaskComplete={handleTaskComplete}
        onDayComplete={handleDayComplete}
      />

      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/90 backdrop-blur-xl overflow-hidden pointer-events-none"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-spin-slow" />
            <motion.div
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.5, duration: 1 }}
              className="relative flex flex-col items-center text-center z-10 p-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-emerald-400 to-cyan-400 rounded-full blur-[100px] opacity-50"
              />
              <Trophy size={100} className="text-yellow-400 mb-4 drop-shadow-[0_0_50px_rgba(250,204,21,0.8)]" />
              <h1 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase tracking-widest drop-shadow-2xl">
                Mastery
                <br />
                Achieved
              </h1>
              <p className="text-base text-emerald-300 font-bold tracking-wide">You have conquered the entire course!</p>
            </motion.div>

            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: '50vw',
                  y: '100vh',
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x: `${Math.random() * 100}vw`,
                  y: `${Math.random() * -100}vh`,
                  scale: Math.random() * 2,
                  opacity: 0,
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  ease: 'easeOut',
                  delay: Math.random() * 0.5,
                }}
                className="absolute w-4 h-4 rounded-sm bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-[0_0_10px_rgba(250,204,21,0.8)]"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Page = () => {
  const pathName = usePathname();
  const courseTypeSlug = pathName.split('/')[3] || '';

  const { data: coursesData, isLoading, error } = useGetCoursesQuery({ page: 1, limit: 1000, q: '' }) as { data: unknown; isLoading: boolean; error: unknown };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full"
        />
      </div>
    );

  if (error)
    return <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-red-500 font-bold text-lg p-4">Error loading course map.</div>;

  return (
    <main className="min-h-screen bg-zinc-950 text-white overflow-x-hidden relative pb-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/3 right-1/4 w-[800px] h-[800px] bg-fuchsia-600/10 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-4">
        <header className="text-center mb-8 relative">
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="inline-block">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="bg-violet-500/20 text-violet-300 text-xs font-black px-4 py-2 rounded-full border border-violet-500/30 uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                Campaign Mode
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-4 uppercase bg-clip-text text-transparent bg-gradient-to-b from-white via-violet-100 to-violet-400 drop-shadow-lg">
              {courseTypeSlug ? courseTypeSlug.replace(/-/g, ' ') : 'Courses'}
            </h1>
            <p className="text-sm text-violet-200/70 font-medium max-w-2xl mx-auto leading-relaxed">Finish your daily task to complete your journey.</p>
          </motion.div>
        </header>

        <CourseMapContent coursesData={coursesData} courseTypeSlug={courseTypeSlug} />
      </div>
    </main>
  );
};

export default Page;
