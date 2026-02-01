'use client';

import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { Calendar, Award, BookOpen, GraduationCap, CheckCircle2, AlertCircle, Timer, ChevronRight } from 'lucide-react';

// --- Types ---
export interface IAssignment1 {
  uid: string;
  name: string;
  description: string;
  totalMarks: number;
  startDate: Date | string;
  endDate: Date | string;
  courseName: string;
  courseClass: string;
  questions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
}

const defaultAssignment: IAssignment1 = {
  uid: 'demo-123',
  name: 'Sample Assignment',
  description: 'No data provided.',
  totalMarks: 0,
  startDate: new Date(),
  endDate: new Date(),
  courseName: 'Unknown Course',
  courseClass: 'Unknown Batch',
  questions: [],
};

interface QueryAssignment1Props {
  data?: string;
}

const QueryAssignment1 = ({ data }: QueryAssignment1Props) => {
  // Initialize with defaultAssignment to ensure structure always exists
  const [assignment, setAssignment] = useState<IAssignment1>(defaultAssignment);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (data) {
      try {
        const parsed = JSON.parse(data);

        // SAFE MERGE: Spread defaultAssignment first, then parsed data.
        // This ensures if 'questions' is missing in 'parsed', it falls back to empty array from default.
        setAssignment({
          ...defaultAssignment,
          ...parsed,
          startDate: parsed.startDate ? new Date(parsed.startDate) : new Date(),
          endDate: parsed.endDate ? new Date(parsed.endDate) : new Date(),
          // Explicitly ensure questions is an array if parsed.questions is null/undefined
          questions: Array.isArray(parsed.questions) ? parsed.questions : [],
        });
      } catch (e) {
        console.error('Failed to parse assignment data', e);
        // Fallback to default on error
        setAssignment(defaultAssignment);
      }
    }
  }, [data]);

  // --- Helpers ---
  const formatDate = (date: Date | string) => {
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return 'Invalid Date';
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return 'Invalid Date';
    }
  };

  const getDuration = () => {
    try {
      const start = new Date(assignment.startDate).getTime();
      const end = new Date(assignment.endDate).getTime();
      const diff = end - start;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      return isNaN(hours) ? '0 Hours' : `${hours} Hours`;
    } catch {
      return 'N/A';
    }
  };

  const handleOptionSelect = (qId: string, option: string) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: option }));
  };

  // --- Animations ---
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  // Safety check: ensure questions exists before rendering
  const safeQuestions = Array.isArray(assignment.questions) ? assignment.questions : [];

  return (
    <div className="min-h-screen w-full bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden relative pb-20">
      {/* --- Background Ambient Effects --- */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-12 md:pt-20"
      >
        {/* --- Header Section --- */}
        <motion.div variants={itemVariants} className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-4">
            <BookOpen size={12} />
            <span>Assignment Overview</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">{assignment.name || 'Untitled Assignment'}</h1>
          <p className="text-slate-400 max-w-3xl text-lg leading-relaxed">{assignment.description || 'No description available.'}</p>
        </motion.div>

        {/* --- Meta Data Grid --- */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {/* Course Card */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-4 rounded-2xl flex flex-col justify-center items-center md:items-start">
            <div className="flex items-center gap-2 text-slate-500 mb-1 text-xs uppercase font-bold tracking-wider">
              <GraduationCap size={14} className="text-indigo-400" />
              <span>Course</span>
            </div>
            <div className="font-semibold text-white truncate w-full text-center md:text-left">{assignment.courseName}</div>
            <div className="text-xs text-slate-400">{assignment.courseClass}</div>
          </div>

          {/* Marks Card */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-4 rounded-2xl flex flex-col justify-center items-center md:items-start">
            <div className="flex items-center gap-2 text-slate-500 mb-1 text-xs uppercase font-bold tracking-wider">
              <Award size={14} className="text-emerald-400" />
              <span>Total Marks</span>
            </div>
            <div className="font-semibold text-white text-2xl">{assignment.totalMarks}</div>
            <div className="text-xs text-slate-400">Points Available</div>
          </div>

          {/* Deadline Card */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-4 rounded-2xl flex flex-col justify-center items-center md:items-start">
            <div className="flex items-center gap-2 text-slate-500 mb-1 text-xs uppercase font-bold tracking-wider">
              <Calendar size={14} className="text-amber-400" />
              <span>Deadline</span>
            </div>
            <div className="font-semibold text-white">{formatDate(assignment.endDate)}</div>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <AlertCircle size={10} /> Closing Soon
            </div>
          </div>

          {/* Duration Card */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-4 rounded-2xl flex flex-col justify-center items-center md:items-start">
            <div className="flex items-center gap-2 text-slate-500 mb-1 text-xs uppercase font-bold tracking-wider">
              <Timer size={14} className="text-blue-400" />
              <span>Duration</span>
            </div>
            <div className="font-semibold text-white">{getDuration()}</div>
            <div className="text-xs text-slate-400">Estimated Time</div>
          </div>
        </motion.div>

        {/* --- Divider --- */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-slate-500 text-sm font-medium uppercase tracking-widest">Questions</span>
          <div className="h-px bg-white/10 flex-1" />
        </motion.div>

        {/* --- Questions List --- */}
        <div className="space-y-8">
          {safeQuestions.length > 0 ? (
            safeQuestions.map((q, index) => {
              // Ensure options is an array
              const safeOptions = Array.isArray(q.options) ? q.options : [];

              return (
                <motion.div
                  key={q.id || index}
                  variants={itemVariants}
                  className="bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-3xl p-6 md:p-8 relative overflow-hidden group hover:border-white/10 transition-all duration-300"
                >
                  {/* Question Number Watermark */}
                  <span className="absolute -top-4 -right-2 text-[120px] font-bold text-white/5 pointer-events-none select-none">{index + 1}</span>

                  <div className="relative z-10">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-lg shrink-0">
                        {index + 1}
                      </div>
                      <h3 className="text-xl text-slate-100 font-medium leading-relaxed pt-1">{q.question || 'No question text provided'}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 md:pl-14">
                      {safeOptions.map((option, optIndex) => {
                        const isSelected = selectedAnswers[q.id] === option;
                        return (
                          <motion.button
                            key={optIndex}
                            onClick={() => handleOptionSelect(q.id, option)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={`
                              relative flex items-center gap-3 p-4 rounded-xl text-left border transition-all duration-300 group/opt
                              ${
                                isSelected
                                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                                  : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200 hover:border-white/10'
                              }
                            `}
                          >
                            <div
                              className={`
                              w-6 h-6 rounded-full border flex items-center justify-center text-[10px] transition-colors
                              ${isSelected ? 'border-indigo-400 bg-indigo-500 text-white' : 'border-slate-600 group-hover/opt:border-slate-400'}
                            `}
                            >
                              {isSelected ? <CheckCircle2 size={14} /> : String.fromCharCode(65 + optIndex)}
                            </div>
                            <span className="text-sm font-medium">{option}</span>

                            {isSelected && (
                              <motion.div
                                layoutId={`selection-${q.id}`}
                                className="absolute inset-0 border-2 border-indigo-500 rounded-xl pointer-events-none"
                              />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-20 opacity-50">
              <BookOpen size={48} className="mx-auto mb-4 text-slate-600" />
              <p>No questions available for this assignment.</p>
            </div>
          )}
        </div>

        {/* --- Footer / Submit Area --- */}
        <motion.div variants={itemVariants} className="mt-16 pb-8 flex justify-end">
          <button className="bg-white text-slate-950 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/10 flex items-center gap-2 group">
            <span>Submit Assignment</span>
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default QueryAssignment1;
