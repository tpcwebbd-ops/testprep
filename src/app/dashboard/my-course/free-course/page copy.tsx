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
      <div className="w-full aspect-video bg-[#031208] border border-emerald-900/50 rounded-lg overflow-hidden relative group shrink-0 shadow-2xl">
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
            className="absolute inset-0 flex items-center justify-center bg-[#011408]/60 group-hover:bg-[#011408]/40 transition-all cursor-pointer"
            onClick={() => {
              videoRef.current?.play();
              setIsPlaying(true);
            }}
          >
            <div className="w-16 h-16 bg-emerald-900/40 backdrop-blur-md rounded-full flex items-center justify-center border border-emerald-500/40 shadow-[0_0_30px_rgba(4,120,87,0.4)] hover:scale-110 transition-transform">
              <Play fill="#34d399" className="text-emerald-400 ml-1" size={32} />
            </div>
          </div>
        )}
      </div>
      <div className="mt-auto pt-6">
        <button
          onClick={onComplete}
          className="w-full py-4 bg-[#0a2711] border border-emerald-700 hover:bg-emerald-900 hover:border-emerald-500 text-[#ff8a8a] hover:text-white rounded-lg font-bold text-base flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(4,120,87,0.1)] transition-all transform hover:-translate-y-1"
        >
          <CheckCircle size={24} /> Complete Video Task
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
          className="w-32 h-32 bg-[#062611] border-2 border-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(4,120,87,0.3)]"
        >
          <Trophy className="text-emerald-400" size={50} />
        </motion.div>
        <h3 className="text-2xl font-black text-[#ff8a8a] mb-2 tracking-wide">Module Conquered</h3>
        <p className="text-emerald-200/60 font-medium mb-8 text-lg">
          Score: <span className="text-emerald-400 font-bold">{score}</span> / {questions.length}
        </p>
        <button
          onClick={onComplete}
          className="w-full max-w-md py-4 bg-[#0a2711] border border-emerald-700 hover:bg-emerald-900 text-[#ff8a8a] hover:text-white rounded-lg font-bold text-base flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(4,120,87,0.2)] transition-all transform hover:-translate-y-1"
        >
          <CheckCircle size={24} /> Acknowledge Completion
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-3">
          {questions.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-500 ${
                idx === currentQIndex
                  ? 'w-10 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                  : idx < currentQIndex
                    ? 'w-4 bg-emerald-800'
                    : 'w-4 bg-[#0a2711]'
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-4 py-2 rounded-lg">Score: {score}</span>
      </div>

      <div className="mb-6 flex-1">
        <h3 className="text-lg md:text-xl font-bold text-emerald-100 mb-6 leading-relaxed">{currentQ.question}</h3>
        <div className="space-y-4">
          {currentQ.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(opt)}
              disabled={isCorrect !== null}
              className={`w-full p-5 rounded-lg text-left font-medium text-base transition-all border-2 flex justify-between items-center group
                ${
                  selectedOption === opt
                    ? opt === currentQ.correctAnswer
                      ? 'bg-[#062611] border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : 'bg-[#1a0a0a] border-rose-900 text-rose-400 shadow-[0_0_15px_rgba(225,29,72,0.2)]'
                    : isCorrect !== null && opt === currentQ.correctAnswer
                      ? 'bg-[#062611] border-emerald-500 text-emerald-400'
                      : 'bg-[#031208] border-emerald-900 hover:border-emerald-700 text-emerald-200/70 hover:text-emerald-200 hover:bg-[#0a2711]'
                }
              `}
            >
              {opt}
              {selectedOption === opt &&
                (opt === currentQ.correctAnswer ? <Check size={24} className="text-emerald-400" /> : <X size={24} className="text-rose-500" />)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={handleNext}
          disabled={isCorrect === null}
          className={`w-full py-4 rounded-lg font-bold text-base flex items-center justify-center gap-3 transition-all border
            ${
              isCorrect !== null
                ? 'bg-[#0a2711] border-emerald-600 text-[#ff8a8a] shadow-[0_0_20px_rgba(4,120,87,0.2)] hover:bg-emerald-900 hover:text-white hover:-translate-y-1'
                : 'bg-[#031208] border-emerald-950 text-emerald-900 cursor-not-allowed'
            }
          `}
        >
          {currentQIndex === questions.length - 1 ? 'Evaluate Results' : 'Proceed'}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

const GenericViewer = ({ title, icon, onComplete }: { title: string; icon: React.ReactNode; onComplete: () => void }) => {
  return (
    <div className="flex flex-col h-full items-center justify-center text-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-32 h-32 bg-[#062611] border border-emerald-800 text-emerald-400 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(4,120,87,0.2)]"
      >
        {icon}
      </motion.div>
      <h3 className="text-2xl font-bold text-[#ff8a8a] mb-4">{title}</h3>
      <p className="text-emerald-200/60 text-base mb-8 max-w-lg leading-relaxed">
        Assimilate the provided data coordinates. Upon successful integration into your cognitive matrix, finalize the sequence to proceed.
      </p>
      <button
        onClick={onComplete}
        className="w-full max-w-md py-4 bg-[#0a2711] border border-emerald-700 hover:bg-emerald-900 text-[#ff8a8a] hover:text-white rounded-lg font-bold text-base flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(4,120,87,0.2)] transition-all transform hover:-translate-y-1"
      >
        <CheckCircle size={24} /> Sequence Complete
      </button>
    </div>
  );
};

const ActiveTaskOverlay = ({ item, onClose, onComplete }: { item: CourseContentItem; onClose: () => void; onComplete: () => void }) => {
  const parsedContent = parseContentItem(item);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: 10 }}
      className="absolute inset-0 z-50 bg-[#020b05] flex flex-col"
    >
      <div className="p-5 border-b border-emerald-900/50 bg-[#031208] flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 bg-[#0a2711] hover:bg-emerald-900 border border-emerald-800 text-emerald-400 rounded-lg transition-all hover:-rotate-90"
          >
            <X size={20} />
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-emerald-500/70 uppercase tracking-[0.2em]">{item.type}</span>
            <h3 className="font-bold text-emerald-100 text-base line-clamp-1">{item.heading || item.name}</h3>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-[#020b05] flex flex-col items-center">
        <div className="w-full max-w-4xl bg-[#031208] border border-emerald-900/50 p-6 md:p-10 rounded-xl shadow-[0_0_50px_rgba(4,120,87,0.05)] min-h-full flex flex-col">
          {parsedContent.type === 'VIDEO' && <VideoPlayer url={parsedContent.payload.url} onComplete={onComplete} />}
          {parsedContent.type === 'QUIZ' && <QuizPlayer questions={parsedContent.payload.questions} onComplete={onComplete} />}
          {parsedContent.type === 'TEXT' && <GenericViewer title="Data Archive Reading" icon={<BookOpen size={48} />} onComplete={onComplete} />}
          {parsedContent.type === 'DOCUMENT' && <GenericViewer title="Encrypted File Review" icon={<FileBadge size={48} />} onComplete={onComplete} />}

          {parsedContent.type === 'UNKNOWN' && (
            <div className="flex flex-col items-center justify-center text-center py-8 flex-1">
              <AlertCircle size={64} className="text-amber-500/80 mb-6" />
              <h3 className="text-xl font-bold text-amber-200 mb-4">Unrecognized Protocol</h3>
              <p className="text-amber-200/50 text-base mb-8 max-w-md">The data format cannot be decrypted by current interface modules.</p>
              <button
                onClick={onComplete}
                className="px-6 py-3 bg-[#1a1305] border border-amber-900/50 text-amber-400 hover:bg-[#2a1d05] rounded-lg font-bold text-sm transition-colors"
              >
                Override & Continue
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
    if (t.includes('video')) return <Play size={24} className="ml-1" fill="currentColor" />;
    if (t.includes('assignment') || t.includes('quiz')) return <FileText size={24} />;
    if (t.includes('text') || t.includes('article')) return <BookOpen size={24} />;
    if (t.includes('doc') || t.includes('pdf')) return <FileBadge size={24} />;
    return <Star size={24} />;
  };

  const getTaskColor = (type: string, isCompleted: boolean) => {
    if (isCompleted) return 'bg-[#062611] text-emerald-400 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
    const t = type.toLowerCase();
    if (t.includes('video')) return 'bg-[#1a0a0a] text-rose-400 border-rose-900/50';
    if (t.includes('assignment') || t.includes('quiz')) return 'bg-[#0a0a1a] text-indigo-400 border-indigo-900/50';
    if (t.includes('text') || t.includes('article')) return 'bg-[#1a1305] text-amber-400 border-amber-900/50';
    if (t.includes('doc') || t.includes('pdf')) return 'bg-[#0a1a1a] text-cyan-400 border-cyan-900/50';
    return 'bg-[#0a2711] text-emerald-600 border-emerald-900/50';
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
            className="fixed inset-0 bg-[#000502]/90 backdrop-blur-md z-40"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="fixed inset-0 m-auto z-50 w-[95%] sm:w-[90%] max-w-5xl h-[90vh] bg-[#020b05] border border-emerald-900/50 rounded-xl shadow-[0_0_50px_rgba(4,120,87,0.1)] overflow-hidden flex flex-col"
          >
            <div className="relative shrink-0 overflow-hidden border-b border-emerald-900/50 bg-[#031208]">
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#047857_1px,transparent_1px),linear-gradient(to_bottom,#047857_1px,transparent_1px)] bg-[size:24px_24px]" />

              <div className="relative p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                {!activeTask && (
                  <button
                    onClick={onClose}
                    className="absolute top-6 right-6 w-10 h-10 bg-[#0a2711] hover:bg-emerald-900 border border-emerald-800 text-emerald-400 rounded-lg flex items-center justify-center transition-all z-20"
                  >
                    <X size={20} />
                  </button>
                )}

                <div className="z-10 relative w-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[#0a2711] border border-emerald-800 p-2.5 rounded-lg">
                      {progress === 100 ? <Award size={20} className="text-emerald-400" /> : <Zap size={20} className="text-emerald-500" />}
                    </div>
                    <span className="text-sm font-black text-[#ff8a8a] uppercase tracking-[0.2em]">{course.courseName}</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-emerald-50 mb-6 tracking-tight">{course.courseDay}</h2>

                  <div className="w-full bg-[#011408] h-3 rounded-full overflow-hidden border border-emerald-950 shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, type: 'spring' }}
                      className="h-full relative overflow-hidden bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]"
                    >
                      <div className="absolute inset-0 bg-emerald-300/30 animate-pulse" />
                    </motion.div>
                  </div>
                  <div className="flex justify-between mt-3 text-sm font-bold text-emerald-500/80">
                    <span>
                      {completedInThisCourse} / {course.content.length} Systems Online
                    </span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto relative p-4 md:p-8">
              <AnimatePresence mode="wait">
                {activeTask ? (
                  <ActiveTaskOverlay key="active-task" item={activeTask} onClose={() => setActiveTask(null)} onComplete={handleTaskFinish} />
                ) : (
                  <div className="grid gap-4 max-w-4xl mx-auto pb-6">
                    {course.content.length === 0 ? (
                      <div className="text-center py-12 flex flex-col items-center bg-[#031208] border border-emerald-900/30 rounded-xl">
                        <Lock size={48} className="mb-6 text-emerald-900" />
                        <p className="text-base font-medium text-emerald-700">Sector heavily encrypted. Access denied.</p>
                      </div>
                    ) : (
                      course.content.map((item, idx) => {
                        const isCompleted = completedContentIds.includes(item.id);
                        const colors = getTaskColor(item.type, isCompleted);

                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => setActiveTask(item)}
                            className={`
                              group relative overflow-hidden flex items-center p-5 md:p-6 rounded-xl cursor-pointer transition-all duration-300 border
                              ${
                                isCompleted
                                  ? 'bg-[#031208] border-emerald-800 hover:border-emerald-600'
                                  : 'bg-[#031208] border-emerald-900/50 hover:border-emerald-700 hover:bg-[#062611] hover:-translate-y-1'
                              }
                            `}
                          >
                            <div
                              className={`w-14 h-14 rounded-lg flex items-center justify-center mr-6 shrink-0 transition-transform duration-500 group-hover:scale-110 border ${colors}`}
                            >
                              {isCompleted ? <Check size={28} strokeWidth={3} /> : getTaskIcon(item.type)}
                            </div>

                            <div className="flex-1 min-w-0 pr-6">
                              <h4
                                className={`font-bold text-lg truncate mb-2 transition-colors ${isCompleted ? 'text-emerald-400' : 'text-emerald-100 group-hover:text-[#ff8a8a]'}`}
                              >
                                {item.heading || item.name}
                              </h4>
                              <div className="flex flex-wrap items-center gap-3 text-xs">
                                <span
                                  className={`px-3 py-1 rounded-md font-bold uppercase tracking-widest border ${isCompleted ? 'bg-[#062611] text-emerald-500 border-emerald-900' : 'bg-[#0a2711] text-emerald-600 border-emerald-950'}`}
                                >
                                  {item.type}
                                </span>
                                {item.data?.totalMarks && (
                                  <span className="flex items-center gap-1.5 font-bold text-amber-500 bg-[#1a1305] border border-amber-900/50 px-3 py-1 rounded-md">
                                    <Trophy size={14} /> {item.data.totalMarks} Credits
                                  </span>
                                )}
                              </div>
                            </div>

                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 border ${isCompleted ? 'bg-[#062611] text-emerald-500 border-emerald-800' : 'bg-[#031208] text-emerald-800 border-emerald-900/50 group-hover:bg-[#0a2711] group-hover:text-emerald-400 group-hover:border-emerald-700'}`}
                            >
                              <ChevronRight size={20} className={isCompleted ? '' : 'group-hover:translate-x-1 transition-transform'} />
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
              <div className="p-6 md:p-8 border-t border-emerald-900/50 bg-[#031208] shrink-0 z-20">
                <button
                  onClick={onDayComplete}
                  disabled={!allTasksCompleted}
                  className={`
                    w-full py-5 rounded-xl font-black text-base tracking-[0.2em] uppercase transition-all duration-500 flex items-center justify-center gap-3 border
                    ${
                      allTasksCompleted
                        ? 'bg-[#0a2711] border-emerald-500 text-[#ff8a8a] shadow-[0_0_30px_rgba(4,120,87,0.3)] hover:bg-[#062611] hover:text-white transform hover:-translate-y-1'
                        : 'bg-[#011408] border-emerald-950 text-emerald-900 cursor-not-allowed'
                    }
                  `}
                >
                  {allTasksCompleted ? (
                    <>
                      <CheckCircle size={24} /> Confirm Module Synchronization
                    </>
                  ) : (
                    <>
                      <Lock size={24} /> Awaiting Subsystem Activation
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

const TimelineRow = ({
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
  const { status } = course;

  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isCurrent = status === 'current';

  const nodeVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100, delay: index * 0.1 } },
  };

  const lineVariants: Variants = {
    hidden: { scaleX: 0, originX: 0 },
    visible: { scaleX: 1, originX: 0, transition: { duration: 0.5, delay: index * 0.1 + 0.2 } },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100, delay: index * 0.1 + 0.3 } },
  };

  return (
    <div className="relative flex flex-col md:flex-row items-stretch md:items-center w-full mb-12 md:mb-16 group z-10">
      <div className="hidden md:block absolute left-[39px] top-[80px] bottom-[-64px] w-[2px] bg-emerald-900/40 z-0 last:hidden" />
      <div className="md:hidden absolute left-[31px] top-[64px] bottom-[-48px] w-[2px] bg-emerald-900/40 z-0 last:hidden" />

      <motion.div
        variants={nodeVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="flex flex-col items-center md:items-start shrink-0 z-10 relative mb-4 md:mb-0"
      >
        <div
          className={`
          w-16 h-16 md:w-20 md:h-20 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-500
          ${
            isCompleted
              ? 'bg-[#062611] border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
              : isCurrent
                ? 'bg-[#062611] border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.2)] animate-pulse'
                : 'bg-[#020b05] border-emerald-900'
          }
        `}
        >
          <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${isLocked ? 'text-emerald-800' : 'text-[#ff8a8a]'}`}>Task</span>
          <span className={`text-lg md:text-2xl font-black leading-none mt-1 ${isLocked ? 'text-emerald-800' : 'text-[#ff8a8a]'}`}>{index + 1}</span>
        </div>
      </motion.div>

      <div className="hidden md:flex flex-1 items-center px-4 z-0 shrink relative h-20">
        <motion.div
          variants={lineVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full h-[2px] bg-emerald-900/60 relative"
        >
          <div
            className={`absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 border-t-2 border-r-2 rotate-45 ${isCompleted ? 'border-emerald-500' : isCurrent ? 'border-emerald-400' : 'border-emerald-900'}`}
          />

          {(isCompleted || isCurrent) && (
            <motion.div
              className="absolute left-0 top-0 h-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ duration: 1, delay: index * 0.1 + 0.4 }}
              viewport={{ once: true }}
            />
          )}
        </motion.div>
      </div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="w-full md:w-[600px] shrink-0 z-10 pl-16 md:pl-0"
      >
        <button
          onClick={() => !isLocked && onClick(course)}
          disabled={isLocked}
          className={`
            w-full text-left p-6 md:p-8 rounded-xl border-2 transition-all duration-300 relative overflow-hidden flex flex-col
            ${
              isCompleted
                ? 'bg-[#062611] border-emerald-600 hover:border-emerald-400 shadow-[0_0_30px_rgba(4,120,87,0.15)] cursor-pointer hover:-translate-y-1'
                : isCurrent
                  ? 'bg-[#0a2711] border-emerald-500 hover:border-emerald-300 shadow-[0_0_30px_rgba(4,120,87,0.2)] cursor-pointer hover:-translate-y-1'
                  : 'bg-[#020b05] border-emerald-950 opacity-60 cursor-not-allowed'
            }
          `}
        >
          {isCurrent && (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />
          )}

          <div className="flex justify-between items-start mb-4 relative z-10">
            <h3 className={`text-xl md:text-2xl font-black ${isLocked ? 'text-emerald-800' : 'text-[#ff8a8a]'}`}>Module</h3>
            <div
              className={`p-2 rounded-lg ${isCompleted ? 'bg-emerald-900/50 text-emerald-400' : isCurrent ? 'bg-emerald-900/30 text-emerald-300 animate-pulse' : 'bg-[#031208] text-emerald-900'}`}
            >
              {isCompleted ? <CheckCircle size={24} /> : isLocked ? <Lock size={24} /> : <Zap size={24} />}
            </div>
          </div>

          <div className="relative z-10">
            <h4 className={`text-base font-bold mb-2 ${isLocked ? 'text-emerald-900' : 'text-emerald-50'}`}>{course.courseName}</h4>
            <p className={`text-sm line-clamp-2 ${isLocked ? 'text-emerald-950' : 'text-emerald-500/80'}`}>
              {course.content.length > 0 ? course.content[0].heading || `Initiate parameters for ${course.courseDay}` : 'Awaiting data link...'}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between relative z-10">
            <div className={`text-xs font-bold tracking-[0.2em] uppercase ${isLocked ? 'text-emerald-950' : 'text-emerald-600'}`}>
              Phase {index + 1} / {totalItems}
            </div>
            {!isLocked && (
              <div
                className={`flex items-center gap-2 text-sm font-bold transition-transform group-hover:translate-x-2 ${isCompleted ? 'text-emerald-500' : 'text-[#ff8a8a]'}`}
              >
                {isCompleted ? 'Review Data' : 'Initialize'} <ArrowRight size={16} />
              </div>
            )}
          </div>
        </button>
      </motion.div>
    </div>
  );
};

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
      <div className="flex flex-col items-center relative min-h-[500px] w-full pt-10">
        {gameLevels.length > 0 ? (
          <div className="relative w-full max-w-5xl mx-auto flex flex-col">
            {gameLevels.map((course, index) => (
              <TimelineRow key={course._id} course={course} index={index} totalItems={gameLevels.length} onClick={setSelectedCourse} />
            ))}

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 flex flex-col items-center md:items-end justify-center relative z-20 w-full"
            >
              <div className="relative group w-full md:w-[600px]">
                <div
                  className={`absolute -inset-1 rounded-xl blur-xl opacity-30 transition-all duration-500 ${allCourseCompleted ? 'bg-emerald-500 group-hover:opacity-70 animate-pulse' : 'bg-transparent'}`}
                />
                <button
                  disabled={!allCourseCompleted}
                  onClick={triggerCelebration}
                  className={`
                      relative w-full py-8 rounded-xl font-black text-xl uppercase tracking-[0.2em] transition-all duration-500 flex flex-col items-center justify-center gap-4 border-2
                      ${
                        allCourseCompleted
                          ? 'bg-[#062611] border-emerald-400 text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:bg-[#0a2711] hover:text-white hover:-translate-y-2'
                          : 'bg-[#020b05] border-emerald-950 text-emerald-900 cursor-not-allowed'
                      }
                    `}
                >
                  <Trophy size={40} className={allCourseCompleted ? 'text-emerald-400' : 'text-emerald-900'} />
                  Execute Final Sequence
                  {!allCourseCompleted && (
                    <span className="text-xs font-bold text-emerald-900 mt-2 normal-case tracking-normal">Prerequisite nodes unfulfilled</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 px-8 bg-[#031208] border border-emerald-900/30 rounded-2xl shadow-2xl max-w-lg w-full"
          >
            <SearchX size={80} className="text-emerald-900 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-emerald-700 mb-4 tracking-widest uppercase">Void Sector</h3>
            <p className="text-sm text-emerald-800 font-bold tracking-widest">
              Directory &quot;{courseTypeSlug}&quot; yields zero coordinates. Standby for future transmissions.
            </p>
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000502]/95 backdrop-blur-xl overflow-hidden pointer-events-none"
          >
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#047857_1px,transparent_1px),linear-gradient(to_bottom,#047857_1px,transparent_1px)] bg-[size:40px_40px]" />
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
                className="absolute inset-0 bg-emerald-500 rounded-full blur-[120px] opacity-20"
              />
              <Trophy size={120} className="text-emerald-400 mb-6 drop-shadow-[0_0_60px_rgba(52,211,153,0.8)]" />
              <h1 className="text-4xl md:text-6xl font-black text-emerald-50 mb-6 uppercase tracking-[0.3em] drop-shadow-2xl">
                System
                <br />
                Mastered
              </h1>
              <p className="text-lg md:text-xl text-emerald-400 font-bold tracking-[0.2em] uppercase">All nodes successfully integrated.</p>
            </motion.div>

            {Array.from({ length: 60 }).map((_, i) => (
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
                className="absolute w-3 h-3 md:w-5 md:h-5 rounded-sm bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]"
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
      <div className="min-h-screen flex items-center justify-center bg-[#010804] text-emerald-500 p-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-emerald-900 border-t-emerald-400 rounded-full shadow-[0_0_30px_rgba(52,211,153,0.2)]"
        />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#010804] text-rose-500 font-bold text-xl tracking-widest uppercase p-4">
        Critical Error: Connection Severed
      </div>
    );

  return (
    <main className="min-h-screen bg-[#010804] text-emerald-50 overflow-x-hidden relative pb-20 font-sans">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#064e3b20_1px,transparent_1px),linear-gradient(to_bottom,#064e3b20_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-[#010804]/80 to-[#010804]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <header className="mb-16 relative">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-block border-l-4 border-emerald-500 pl-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#0a2711] text-emerald-400 text-xs font-black px-4 py-1.5 rounded-md border border-emerald-800 uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(4,120,87,0.3)]">
                Directive Mode
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-[0.1em] mb-4 uppercase text-[#ff8a8a] drop-shadow-[0_0_15px_rgba(255,138,138,0.2)]">
              {courseTypeSlug ? courseTypeSlug.replace(/-/g, ' ') : 'Operations'}
            </h1>
            <p className="text-sm text-emerald-600 font-bold tracking-widest uppercase max-w-2xl leading-relaxed">
              Systematic progression required to unlock subsequent modules.
            </p>
          </motion.div>
        </header>

        <CourseMapContent coursesData={coursesData} courseTypeSlug={courseTypeSlug} />
      </div>
    </main>
  );
};

export default Page;
