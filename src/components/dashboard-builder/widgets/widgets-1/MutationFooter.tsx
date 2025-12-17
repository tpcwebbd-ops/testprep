'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Save,
  Plus,
  Trash2,
  X,
  Calendar,
  BookOpen,
  FileText,
  HelpCircle,
  CheckCircle,
  Clock,
  Layout,
  ListChecks,
  AlertCircle,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import { IAssignment1 } from './data';

const defaultAssignment: IAssignment1 = {
  uid: '',
  name: '',
  description: '',
  totalMarks: 0,
  startDate: new Date(),
  endDate: new Date(),
  courseName: '',
  courseClass: '',
  questions: [],
};

interface MutationAssignment1Props {
  data?: string; // JSON string of IAssignment1
  onSave?: (assignment: IAssignment1) => Promise<void> | void;
}

const MutationAssignment1 = ({ data, onSave }: MutationAssignment1Props) => {
  const router = useRouter();
  const [assignment, setAssignment] = useState<IAssignment1>(defaultAssignment);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  // Initialize data
  useEffect(() => {
    if (data) {
      try {
        const parsed = JSON.parse(data);
        // Ensure dates are converted back to Date objects from JSON strings
        setAssignment({
          ...defaultAssignment,
          ...parsed,
          startDate: parsed.startDate ? new Date(parsed.startDate) : new Date(),
          endDate: parsed.endDate ? new Date(parsed.endDate) : new Date(),
        });
      } catch (e) {
        console.error('Failed to parse assignment data', e);
      }
    } else {
      // Generate a random UID for new assignments
      setAssignment(prev => ({ ...prev, uid: `assign-${Date.now()}` }));
    }
  }, [data]);

  // --- Handlers ---

  const handleSave = async () => {
    // Basic Validation
    if (!assignment.name || !assignment.courseName) {
      toast.error('Please fill in the Assignment Name and Course Name.');
      return;
    }
    if (assignment.questions.length === 0) {
      toast.warning('Please add at least one question.');
      return;
    }

    setIsSaving(true);
    try {
      if (onSave) await onSave(assignment);
      toast.success('Assignment saved successfully!');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save assignment.');
    } finally {
      setIsSaving(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = (field: keyof IAssignment1, value: any) => {
    setAssignment(prev => ({ ...prev, [field]: value }));
  };

  // Date Handler
  const updateDate = (field: 'startDate' | 'endDate', value: string) => {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      setAssignment(prev => ({ ...prev, [field]: date }));
    }
  };

  // --- Question Management ---

  const addQuestion = () => {
    const newId = `q-${Date.now()}`;
    setAssignment(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: newId,
          question: '',
          options: ['', '', '', ''], // Default 4 empty options
          correctAnswer: '',
        },
      ],
    }));
    setExpandedQuestion(newId);
  };

  const removeQuestion = (qId: string) => {
    setAssignment(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== qId),
    }));
  };

  const toggleExpand = (qId: string) => {
    setExpandedQuestion(expandedQuestion === qId ? null : qId);
  };

  const updateQuestionText = (qId: string, text: string) => {
    setAssignment(prev => ({
      ...prev,
      questions: prev.questions.map(q => (q.id === qId ? { ...q, question: text } : q)),
    }));
  };

  const updateCorrectAnswer = (qId: string, answer: string) => {
    setAssignment(prev => ({
      ...prev,
      questions: prev.questions.map(q => (q.id === qId ? { ...q, correctAnswer: answer } : q)),
    }));
  };

  // --- Option Management ---

  const updateOption = (qId: string, index: number, value: string) => {
    setAssignment(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id !== qId) return q;
        const newOptions = [...q.options];
        newOptions[index] = value;
        return { ...q, options: newOptions };
      }),
    }));
  };

  const addOption = (qId: string) => {
    setAssignment(prev => ({
      ...prev,
      questions: prev.questions.map(q => (q.id === qId ? { ...q, options: [...q.options, ''] } : q)),
    }));
  };

  const removeOption = (qId: string, index: number) => {
    setAssignment(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id !== qId) return q;
        const newOptions = q.options.filter((_, i) => i !== index);
        return { ...q, options: newOptions };
      }),
    }));
  };

  // --- Date Formatting Helper for Inputs ---
  const toInputString = (date: Date) => {
    try {
      return date.toISOString().slice(0, 16); // format: YYYY-MM-DDTHH:mm
    } catch {
      return '';
    }
  };

  const styles = {
    card: 'bg-slate-900/40 border border-white/5 rounded-3xl p-6 backdrop-blur-md shadow-xl overflow-hidden relative group',
    input:
      'w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all text-slate-100 placeholder:text-slate-600 text-sm',
    textarea:
      'w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all text-slate-100 placeholder:text-slate-600 text-sm min-h-[100px] resize-none',
    label: 'flex items-center gap-2 text-xs font-bold text-indigo-200/60 uppercase tracking-widest mb-2',
    sectionHeader: 'flex items-center gap-2 text-indigo-400 uppercase text-xs font-bold tracking-widest mb-6',
    addButton:
      'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest hover:bg-indigo-500/20 transition-all',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 pb-32">
      <ToastContainer position="bottom-right" theme="dark" toastClassName="bg-slate-900 border border-white/10 text-slate-200" />

      {/* Close Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => router.back()}
        className="fixed top-6 right-6 z-50 p-3 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-full text-slate-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/50 transition-all shadow-lg group"
      >
        <X size={24} className="group-hover:text-red-200" />
      </motion.button>

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-emerald-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8 relative z-10">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest"
          >
            <Sparkles size={12} />
            <span>Curriculum Management</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
            Assignment Builder
          </h1>
          <p className="text-slate-400 max-w-2xl text-lg">Create comprehensive assignments, set evaluation criteria, and manage deadlines for your students.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: General Info */}
          <div className="lg:col-span-5 space-y-6">
            {/* Basic Info Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={styles.card}>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className={styles.sectionHeader}>
                <FileText size={14} />
                <span>Basic Details</span>
              </div>
              <div className="space-y-4 relative z-10">
                <div>
                  <label className={styles.label}>Assignment Name</label>
                  <input
                    type="text"
                    value={assignment.name}
                    onChange={e => updateField('name', e.target.value)}
                    className={styles.input}
                    placeholder="e.g., IELTS Reading Mock Test 1"
                  />
                </div>
                <div>
                  <label className={styles.label}>Description</label>
                  <textarea
                    value={assignment.description}
                    onChange={e => updateField('description', e.target.value)}
                    className={styles.textarea}
                    placeholder="Instructions for students..."
                  />
                </div>
                <div>
                  <label className={styles.label}>Total Marks</label>
                  <div className="relative">
                    <ListChecks className="absolute top-3.5 left-3 text-slate-500" size={16} />
                    <input
                      type="number"
                      value={assignment.totalMarks}
                      onChange={e => updateField('totalMarks', Number(e.target.value))}
                      className={`${styles.input} pl-10`}
                      placeholder="100"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Course & Class Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={styles.card}>
              <div className={styles.sectionHeader}>
                <GraduationCap size={14} />
                <span>Academic Context</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                <div>
                  <label className={styles.label}>Course Name</label>
                  <input
                    type="text"
                    value={assignment.courseName}
                    onChange={e => updateField('courseName', e.target.value)}
                    className={styles.input}
                    placeholder="e.g., IELTS Academic"
                  />
                </div>
                <div>
                  <label className={styles.label}>Class / Batch</label>
                  <input
                    type="text"
                    value={assignment.courseClass}
                    onChange={e => updateField('courseClass', e.target.value)}
                    className={styles.input}
                    placeholder="e.g., Batch A-24"
                  />
                </div>
              </div>
            </motion.div>

            {/* Schedule Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={styles.card}>
              <div className={styles.sectionHeader}>
                <Calendar size={14} />
                <span>Schedule Timeline</span>
              </div>
              <div className="space-y-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={styles.label}>Start Date</label>
                    <div className="relative">
                      <Clock className="absolute top-3.5 left-3 text-slate-500" size={16} />
                      <input
                        type="datetime-local"
                        value={toInputString(assignment.startDate)}
                        onChange={e => updateDate('startDate', e.target.value)}
                        className={`${styles.input} pl-10 [color-scheme:dark]`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={styles.label}>End Date</label>
                    <div className="relative">
                      <Clock className="absolute top-3.5 left-3 text-slate-500" size={16} />
                      <input
                        type="datetime-local"
                        value={toInputString(assignment.endDate)}
                        onChange={e => updateDate('endDate', e.target.value)}
                        className={`${styles.input} pl-10 [color-scheme:dark]`}
                      />
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex gap-3 items-start">
                  <AlertCircle className="text-indigo-400 mt-0.5 shrink-0" size={16} />
                  <p className="text-xs text-indigo-200/80 leading-relaxed">
                    Students will be able to access the assignment between these dates. Ensure the duration is sufficient.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Questions Builder */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`${styles.card} min-h-[500px] border-indigo-500/20`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />

              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-2 text-indigo-400 uppercase text-xs font-bold tracking-widest">
                  <HelpCircle size={14} />
                  <span>Questions ({assignment.questions.length})</span>
                </div>
                <button onClick={addQuestion} className={styles.addButton}>
                  <Plus size={14} /> Add Question
                </button>
              </div>

              <div className="space-y-4 relative z-10">
                <AnimatePresence>
                  {assignment.questions.map((q, index) => (
                    <motion.div
                      key={q.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`border rounded-xl transition-all duration-300 overflow-hidden ${
                        expandedQuestion === q.id
                          ? 'bg-slate-900/80 border-indigo-500/40 shadow-lg shadow-indigo-900/20'
                          : 'bg-slate-950/30 border-white/5 hover:border-white/10'
                      }`}
                    >
                      {/* Question Header (Click to expand) */}
                      <div onClick={() => toggleExpand(q.id)} className="p-4 flex items-center gap-4 cursor-pointer select-none">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                            expandedQuestion === q.id ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${!q.question ? 'text-slate-500 italic' : 'text-slate-200'}`}>
                            {q.question || 'New Question...'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                          {expandedQuestion === q.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {expandedQuestion === q.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-white/5 p-4 space-y-5 bg-slate-950/20"
                          >
                            {/* Question Text */}
                            <div>
                              <label className={styles.label}>Question Text</label>
                              <textarea
                                value={q.question}
                                onChange={e => updateQuestionText(q.id, e.target.value)}
                                className={`${styles.input} min-h-[80px]`}
                                placeholder="Enter your question here..."
                              />
                            </div>

                            {/* Options */}
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <label className={styles.label}>Options</label>
                                <button
                                  onClick={e => {
                                    e.stopPropagation();
                                    addOption(q.id);
                                  }}
                                  className="text-[10px] text-indigo-300 hover:text-indigo-200 flex items-center gap-1 uppercase font-bold tracking-wider"
                                >
                                  <Plus size={10} /> Add Option
                                </button>
                              </div>
                              <div className="space-y-2">
                                {q.options.map((opt, i) => (
                                  <div key={i} className="flex gap-2 items-center group/opt">
                                    <div className="shrink-0 w-6 h-6 rounded-full border border-white/10 bg-slate-900 flex items-center justify-center text-[10px] text-slate-500 font-mono">
                                      {String.fromCharCode(65 + i)}
                                    </div>
                                    <input
                                      value={opt}
                                      onChange={e => updateOption(q.id, i, e.target.value)}
                                      className={`${styles.input} py-2 text-xs`}
                                      placeholder={`Option ${i + 1}`}
                                    />
                                    <button
                                      onClick={() => removeOption(q.id, i)}
                                      className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover/opt:opacity-100"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Correct Answer Selection */}
                            <div className="bg-indigo-500/5 rounded-xl p-3 border border-indigo-500/10">
                              <label className={styles.label}>Correct Answer</label>
                              <div className="relative">
                                <CheckCircle className="absolute top-3.5 left-3 text-emerald-500" size={16} />
                                <select
                                  value={q.correctAnswer}
                                  onChange={e => updateCorrectAnswer(q.id, e.target.value)}
                                  className={`${styles.input} pl-10 appearance-none cursor-pointer`}
                                >
                                  <option value="" disabled>
                                    Select correct answer
                                  </option>
                                  {q.options.map(
                                    (opt, i) =>
                                      opt && (
                                        <option key={i} value={opt}>
                                          {String.fromCharCode(65 + i)}: {opt.substring(0, 50)}
                                          {opt.length > 50 ? '...' : ''}
                                        </option>
                                      ),
                                  )}
                                </select>
                                <div className="absolute top-4 right-4 pointer-events-none">
                                  <ChevronDown size={14} className="text-slate-500" />
                                </div>
                              </div>
                            </div>

                            {/* Delete Question Button */}
                            <div className="flex justify-end pt-2">
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  removeQuestion(q.id);
                                }}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 text-xs font-bold hover:bg-red-500/10 transition-colors"
                              >
                                <Trash2 size={14} /> Remove Question
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Empty State */}
                {assignment.questions.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-500 border border-dashed border-white/5 rounded-2xl bg-slate-950/20">
                    <BookOpen size={48} className="mb-4 opacity-20" />
                    <p className="font-medium text-lg text-slate-400">No questions added</p>
                    <p className="text-sm mb-6">Start building your assignment by adding questions.</p>
                    <button onClick={addQuestion} className={styles.addButton}>
                      <Plus size={16} /> Add First Question
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating Save Bar */}
      <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl shadow-black/50 pointer-events-auto flex items-center gap-4"
        >
          <div className="hidden md:flex flex-col px-4 border-r border-white/10 pr-6 mr-2">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Layout size={14} className="text-indigo-400" /> {assignment.questions.length} Questions
            </span>
            <span className="text-xs text-slate-400">Total Marks: {assignment.totalMarks}</span>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-white text-slate-950 hover:bg-indigo-50 hover:text-indigo-900 px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
            <span>{isSaving ? 'Saving...' : 'Save Assignment'}</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default MutationAssignment1;
