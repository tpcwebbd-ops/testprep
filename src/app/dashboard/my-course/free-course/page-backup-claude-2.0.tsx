// 'use client';

// import React, { useState, useMemo } from 'react';
// import { useGetCoursesQuery } from '@/redux/features/course/courseSlice';
// import { motion, AnimatePresence, Variants } from 'framer-motion';
// import { Lock, Check, Star, Play, FileText, X, ChevronRight, Trophy, Sparkles, Zap, Award, Target, CheckCircle, ArrowLeft } from 'lucide-react';

// /*
// |-----------------------------------------
// | Types & Interfaces
// |-----------------------------------------
// */

// interface ContentData {
//   uid: string;
//   name: string;
//   description?: string;
//   totalMarks?: number;
//   url?: string;
//   duration?: number;
//   questions?: Array<{
//     id: string;
//     question: string;
//     options: string[];
//     correctAnswer: string;
//   }>;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   [key: string]: any;
// }

// interface CourseContentItem {
//   id: string;
//   key: string;
//   name: string;
//   type: string;
//   heading?: string;
//   data: ContentData;
// }

// interface Course {
//   _id: string;
//   courseName: string;
//   courseDay: string;
//   isActive: boolean;
//   content: CourseContentItem[];
//   createdAt?: string;
//   updatedAt?: string;
//   __v?: number;
// }

// interface ContentProgress {
//   contentId: string;
//   isComplete: boolean;
// }

// interface CourseProgress {
//   courseId: string;
//   completeContent: ContentProgress[];
//   isComplete: boolean;
// }

// interface EnrichedCourse extends Course {
//   status: 'locked' | 'current' | 'completed';
// }

// interface LevelNodeProps {
//   course: EnrichedCourse;
//   index: number;
//   onClick: (course: EnrichedCourse) => void;
//   isLast: boolean;
// }

// /*
// |-----------------------------------------
// | Helper Functions
// |-----------------------------------------
// */

// const getDayNumber = (dayStr: string): number => {
//   const match = dayStr.match(/\d+/);
//   return match ? parseInt(match[0], 10) : 999;
// };

// /*
// |-----------------------------------------
// | Video Player Component
// |-----------------------------------------
// */

// const VideoPlayer = ({ content, onClose, onComplete }: { content: CourseContentItem; onClose: () => void; onComplete: () => void }) => {
//   const [hasWatched, setHasWatched] = useState(false);

//   const handleVideoEnd = () => {
//     setHasWatched(true);
//   };

//   const handleMarkComplete = () => {
//     onComplete();
//     onClose();
//   };

//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
//       >
//         <motion.div
//           initial={{ scale: 0.9, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           exit={{ scale: 0.9, opacity: 0 }}
//           className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
//         >
//           {/* Header */}
//           <div className="bg-gradient-to-r from-red-600 to-pink-600 p-6 text-white">
//             <div className="flex items-center justify-between mb-2">
//               <button onClick={onClose} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition">
//                 <ArrowLeft size={20} />
//                 <span className="font-semibold">Back</span>
//               </button>
//               <motion.button
//                 onClick={onClose}
//                 whileHover={{ scale: 1.1, rotate: 90 }}
//                 whileTap={{ scale: 0.9 }}
//                 className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition"
//               >
//                 <X size={20} />
//               </motion.button>
//             </div>
//             <h2 className="text-2xl font-black">{content.heading || content.name}</h2>
//             <p className="text-red-100 mt-1">{content.data.description}</p>
//           </div>

//           {/* Video Container */}
//           <div className="flex-1 bg-black p-4 flex items-center justify-center">
//             <video src={content.data.url} controls className="w-full h-full max-h-[60vh] rounded-lg" onEnded={handleVideoEnd}>
//               Your browser does not support the video tag.
//             </video>
//           </div>

//           {/* Footer */}
//           <div className="p-6 border-t-2 border-slate-200 bg-white">
//             <div className="flex items-center justify-between">
//               <div className="text-sm text-slate-600">{content.data.duration && <span className="font-semibold">Duration: {content.data.duration}s</span>}</div>
//               <motion.button
//                 onClick={handleMarkComplete}
//                 disabled={!hasWatched}
//                 whileHover={hasWatched ? { scale: 1.05 } : {}}
//                 whileTap={hasWatched ? { scale: 0.95 } : {}}
//                 className={`px-8 py-3 rounded-xl text-sm font-bold transition shadow-lg flex items-center gap-2
//                   ${
//                     hasWatched
//                       ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
//                       : 'bg-slate-300 text-slate-500 cursor-not-allowed'
//                   }`}
//               >
//                 <CheckCircle size={20} />
//                 Mark as Complete
//               </motion.button>
//             </div>
//           </div>
//         </motion.div>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// /*
// |-----------------------------------------
// | Assignment Viewer Component
// |-----------------------------------------
// */

// const AssignmentViewer = ({ content, onClose, onComplete }: { content: CourseContentItem; onClose: () => void; onComplete: () => void }) => {
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
//   const [showResults, setShowResults] = useState(false);
//   const [score, setScore] = useState(0);

//   // Extract questions from the nested data structure
//   const questions = useMemo(() => {
//     const allQuestions: Array<{
//       id: string;
//       question: string;
//       options: string[];
//       correctAnswer: string;
//     }> = [];

//     // Check if data has numbered keys (0, 1, 2, etc.) with questions
//     Object.keys(content.data).forEach(key => {
//       if (!isNaN(Number(key)) && content.data[key]?.questions) {
//         allQuestions.push(...content.data[key].questions);
//       }
//     });

//     // Also check for direct questions array
//     if (content.data.questions && Array.isArray(content.data.questions)) {
//       allQuestions.push(...content.data.questions);
//     }

//     return allQuestions;
//   }, [content.data]);

//   const currentQuestion = questions[currentQuestionIndex];

//   const handleSelectAnswer = (answer: string) => {
//     if (showResults) return;
//     setSelectedAnswers(prev => ({
//       ...prev,
//       [currentQuestion.id]: answer,
//     }));
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(prev => prev + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(prev => prev - 1);
//     }
//   };

//   const handleSubmit = () => {
//     let correctCount = 0;
//     questions.forEach(q => {
//       if (selectedAnswers[q.id] === q.correctAnswer) {
//         correctCount++;
//       }
//     });
//     setScore(correctCount);
//     setShowResults(true);
//   };

//   const handleComplete = () => {
//     onComplete();
//     onClose();
//   };

//   if (!questions || questions.length === 0) {
//     return (
//       <AnimatePresence>
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
//         >
//           <div className="bg-white rounded-2xl p-8 text-center">
//             <p className="text-slate-600 font-semibold mb-4">No questions available for this assignment.</p>
//             <button onClick={onClose} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
//               Close
//             </button>
//           </div>
//         </motion.div>
//       </AnimatePresence>
//     );
//   }

//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
//       >
//         <motion.div
//           initial={{ scale: 0.9, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           exit={{ scale: 0.9, opacity: 0 }}
//           className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
//         >
//           {/* Header */}
//           <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
//             <div className="flex items-center justify-between mb-2">
//               <button onClick={onClose} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition">
//                 <ArrowLeft size={20} />
//                 <span className="font-semibold">Back</span>
//               </button>
//               <motion.button
//                 onClick={onClose}
//                 whileHover={{ scale: 1.1, rotate: 90 }}
//                 whileTap={{ scale: 0.9 }}
//                 className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition"
//               >
//                 <X size={20} />
//               </motion.button>
//             </div>
//             <h2 className="text-2xl font-black">{content.heading || content.name}</h2>
//             <p className="text-indigo-100 mt-1">{content.data.description}</p>
//             {content.data.totalMarks && (
//               <div className="mt-2 flex items-center gap-2 text-sm">
//                 <Trophy size={16} />
//                 <span>Total Marks: {content.data.totalMarks}</span>
//               </div>
//             )}
//           </div>

//           {/* Question Container */}
//           <div className="flex-1 overflow-y-auto p-6">
//             {!showResults ? (
//               <motion.div key={currentQuestionIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
//                 <div className="mb-4 flex items-center justify-between">
//                   <span className="text-sm font-bold text-slate-500">
//                     Question {currentQuestionIndex + 1} of {questions.length}
//                   </span>
//                   <div className="flex gap-1">
//                     {questions.map((_, idx) => (
//                       <div
//                         key={idx}
//                         className={`w-2 h-2 rounded-full transition ${
//                           idx === currentQuestionIndex ? 'bg-indigo-600' : selectedAnswers[questions[idx].id] ? 'bg-green-400' : 'bg-slate-300'
//                         }`}
//                       />
//                     ))}
//                   </div>
//                 </div>

//                 <h3 className="text-xl font-bold text-slate-800 mb-6">{currentQuestion.question}</h3>

//                 <div className="space-y-3">
//                   {currentQuestion.options.map((option, idx) => (
//                     <motion.button
//                       key={idx}
//                       onClick={() => handleSelectAnswer(option)}
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       className={`w-full p-4 rounded-xl border-2 text-left transition font-semibold ${
//                         selectedAnswers[currentQuestion.id] === option
//                           ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
//                           : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300'
//                       }`}
//                     >
//                       <span className="mr-3 text-slate-400">{String.fromCharCode(65 + idx)}.</span>
//                       {option}
//                     </motion.button>
//                   ))}
//                 </div>
//               </motion.div>
//             ) : (
//               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
//                 <div className="mb-6">
//                   <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="inline-block">
//                     <Trophy size={80} className="text-yellow-500 mx-auto" />
//                   </motion.div>
//                 </div>
//                 <h3 className="text-3xl font-black text-slate-800 mb-2">Assignment Complete!</h3>
//                 <p className="text-xl font-bold text-indigo-600 mb-6">
//                   Your Score: {score} / {questions.length}
//                 </p>
//                 <div className="bg-slate-50 rounded-xl p-6 mb-6">
//                   <div className="space-y-3">
//                     {questions.map((q, idx) => {
//                       const isCorrect = selectedAnswers[q.id] === q.correctAnswer;
//                       return (
//                         <div
//                           key={q.id}
//                           className={`p-3 rounded-lg ${isCorrect ? 'bg-green-100 border-2 border-green-300' : 'bg-red-100 border-2 border-red-300'}`}
//                         >
//                           <div className="flex items-start gap-2">
//                             {isCorrect ? <CheckCircle size={20} className="text-green-600 mt-1" /> : <X size={20} className="text-red-600 mt-1" />}
//                             <div className="flex-1 text-left">
//                               <p className="font-semibold text-sm text-slate-700">
//                                 Q{idx + 1}: {q.question}
//                               </p>
//                               <p className="text-sm mt-1">
//                                 <span className="text-slate-600">Your answer: </span>
//                                 <span className={isCorrect ? 'text-green-700 font-semibold' : 'text-red-700 font-semibold'}>
//                                   {selectedAnswers[q.id] || 'Not answered'}
//                                 </span>
//                               </p>
//                               {!isCorrect && (
//                                 <p className="text-sm mt-1">
//                                   <span className="text-slate-600">Correct answer: </span>
//                                   <span className="text-green-700 font-semibold">{q.correctAnswer}</span>
//                                 </p>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="p-6 border-t-2 border-slate-200 bg-white">
//             {!showResults ? (
//               <div className="flex items-center justify-between gap-4">
//                 <button
//                   onClick={handlePrevious}
//                   disabled={currentQuestionIndex === 0}
//                   className={`px-6 py-3 rounded-xl font-bold transition ${
//                     currentQuestionIndex === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-600 text-white hover:bg-slate-700'
//                   }`}
//                 >
//                   Previous
//                 </button>
//                 <div className="text-sm text-slate-600 font-semibold">
//                   {Object.keys(selectedAnswers).length} / {questions.length} answered
//                 </div>
//                 {currentQuestionIndex < questions.length - 1 ? (
//                   <button onClick={handleNext} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition">
//                     Next
//                   </button>
//                 ) : (
//                   <button
//                     onClick={handleSubmit}
//                     disabled={Object.keys(selectedAnswers).length !== questions.length}
//                     className={`px-6 py-3 rounded-xl font-bold transition ${
//                       Object.keys(selectedAnswers).length === questions.length
//                         ? 'bg-green-600 text-white hover:bg-green-700'
//                         : 'bg-slate-200 text-slate-400 cursor-not-allowed'
//                     }`}
//                   >
//                     Submit
//                   </button>
//                 )}
//               </div>
//             ) : (
//               <div className="flex justify-center">
//                 <motion.button
//                   onClick={handleComplete}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl text-sm font-bold hover:from-green-700 hover:to-emerald-700 transition shadow-lg flex items-center gap-2"
//                 >
//                   <CheckCircle size={20} />
//                   Mark as Complete & Continue
//                 </motion.button>
//               </div>
//             )}
//           </div>
//         </motion.div>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// /*
// |-----------------------------------------
// | Components
// |-----------------------------------------
// */

// const LevelNode = ({ course, index, onClick, isLast }: LevelNodeProps) => {
//   const isLeft = index % 2 === 0;
//   const { status } = course;
//   const [isHovered, setIsHovered] = useState(false);

//   const nodeVariants: Variants = {
//     hidden: { scale: 0, opacity: 0, y: 50 },
//     visible: {
//       scale: 1,
//       opacity: 1,
//       y: 0,
//       transition: {
//         type: 'spring',
//         stiffness: 260,
//         damping: 20,
//         delay: index * 0.15,
//       },
//     },
//     hover: {
//       scale: 1.15,
//       y: -8,
//       transition: {
//         type: 'spring',
//         stiffness: 400,
//         damping: 10,
//       },
//     },
//   };

//   const pulseVariants: Variants = {
//     pulse: {
//       scale: [1, 1.2, 1],
//       opacity: [0.5, 0.8, 0.5],
//       transition: {
//         duration: 2,
//         repeat: Infinity,
//         ease: 'easeInOut',
//       },
//     },
//   };

//   const glowVariants: Variants = {
//     glow: {
//       boxShadow: ['0 0 20px rgba(59, 130, 246, 0.5)', '0 0 40px rgba(59, 130, 246, 0.8)', '0 0 20px rgba(59, 130, 246, 0.5)'],
//       transition: {
//         duration: 2,
//         repeat: Infinity,
//         ease: 'easeInOut',
//       },
//     },
//   };

//   return (
//     <div className={`relative flex w-full ${isLeft ? 'justify-start md:justify-end md:pr-[52%]' : 'justify-end md:justify-start md:pl-[52%]'} mb-16 md:mb-24`}>
//       {/* Animated Connector Path */}
//       {!isLast && (
//         <div className="absolute top-[4.5rem] md:top-20 left-1/2 -ml-[2px] w-1 h-20 md:h-28 -z-10">
//           <motion.div
//             className={`w-full h-full border-l-4 border-dotted transition-colors duration-500
//               ${status === 'completed' ? 'border-emerald-400' : 'border-slate-300'}`}
//             initial={{ scaleY: 0, originY: 0 }}
//             animate={{ scaleY: 1 }}
//             transition={{ delay: index * 0.15 + 0.3, duration: 0.4 }}
//           />
//         </div>
//       )}

//       {/* The Game Node Button */}
//       <div className="relative">
//         {/* Glow effect for current level */}
//         {status === 'current' && (
//           <motion.div
//             variants={glowVariants}
//             animate="glow"
//             className="absolute inset-0 rounded-full blur-xl"
//             style={{
//               background: 'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, transparent 70%)',
//             }}
//           />
//         )}

//         {/* Pulsing ring for current level */}
//         {status === 'current' && (
//           <motion.div
//             variants={pulseVariants}
//             animate="pulse"
//             className="absolute inset-0 rounded-full border-4 border-blue-400"
//             style={{ width: '100%', height: '100%' }}
//           />
//         )}

//         <motion.button
//           variants={nodeVariants}
//           initial="hidden"
//           animate="visible"
//           whileHover={status !== 'locked' ? 'hover' : undefined}
//           whileTap={status !== 'locked' ? { scale: 0.95 } : undefined}
//           onClick={() => status !== 'locked' && onClick(course)}
//           onHoverStart={() => setIsHovered(true)}
//           onHoverEnd={() => setIsHovered(false)}
//           disabled={status === 'locked'}
//           className={`
//             relative z-10 flex flex-col items-center justify-center
//             w-20 h-20 md:w-28 md:h-28 rounded-full border-b-8 shadow-2xl
//             transition-all duration-300 overflow-hidden
//             ${
//               status === 'completed'
//                 ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-700 text-white'
//                 : status === 'current'
//                   ? 'bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 border-blue-800 text-white'
//                   : 'bg-gradient-to-br from-slate-300 to-slate-400 border-slate-500 text-slate-500 cursor-not-allowed'
//             }
//           `}
//         >
//           {/* Shimmer effect */}
//           {status !== 'locked' && (
//             <motion.div
//               className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
//               animate={{
//                 x: ['-100%', '100%'],
//               }}
//               transition={{
//                 duration: 2,
//                 repeat: Infinity,
//                 repeatDelay: 3,
//                 ease: 'easeInOut',
//               }}
//             />
//           )}

//           {/* Icons */}
//           <div className="relative z-10">
//             {status === 'completed' && (
//               <motion.div
//                 initial={{ scale: 0, rotate: -180 }}
//                 animate={{ scale: 1, rotate: 0 }}
//                 transition={{ type: 'spring', stiffness: 200, delay: index * 0.15 + 0.3 }}
//               >
//                 <Check size={36} strokeWidth={3} className="drop-shadow-lg" />
//               </motion.div>
//             )}
//             {status === 'current' && (
//               <motion.div
//                 animate={{
//                   rotate: isHovered ? 360 : 0,
//                   scale: isHovered ? 1.1 : 1,
//                 }}
//                 transition={{ duration: 0.6 }}
//               >
//                 <Play size={36} fill="currentColor" className="drop-shadow-lg" />
//               </motion.div>
//             )}
//             {status === 'locked' && <Lock size={30} className="opacity-70" />}
//           </div>

//           {/* Sparkles for completed */}
//           {status === 'completed' && (
//             <>
//               <motion.div className="absolute -top-2 -right-2" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
//                 <Sparkles size={16} className="text-yellow-300 fill-yellow-300" />
//               </motion.div>
//               <motion.div className="absolute -bottom-2 -left-2" animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}>
//                 <Sparkles size={12} className="text-yellow-300 fill-yellow-300" />
//               </motion.div>
//             </>
//           )}

//           {/* Level number badge */}
//           <div
//             className={`absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] md:text-xs font-black
//             ${status === 'completed' ? 'bg-emerald-800' : status === 'current' ? 'bg-blue-900' : 'bg-slate-600'} text-white shadow-lg`}
//           >
//             {getDayNumber(course.courseDay)}
//           </div>
//         </motion.button>

//         {/* Floating stars for completed */}
//         {status === 'completed' && (
//           <motion.div
//             className="absolute -top-8 md:-top-10 left-1/2 -translate-x-1/2 flex gap-1"
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.15 + 0.5 }}
//           >
//             <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}>
//               <Star size={12} className="text-yellow-400 fill-yellow-400" />
//             </motion.div>
//             <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}>
//               <Star size={18} className="text-yellow-400 fill-yellow-400" />
//             </motion.div>
//             <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}>
//               <Star size={12} className="text-yellow-400 fill-yellow-400" />
//             </motion.div>
//           </motion.div>
//         )}
//       </div>

//       {/* Label Card - Improved Responsive Design */}
//       <motion.div
//         initial={{ opacity: 0, x: isLeft ? -30 : 30, scale: 0.9 }}
//         animate={{ opacity: 1, x: 0, scale: 1 }}
//         transition={{ delay: 0.4 + index * 0.1, type: 'spring', stiffness: 100 }}
//         className={`absolute top-3 md:top-5
//           ${isLeft ? 'left-24 md:left-auto md:right-[calc(52%+1.5rem)] md:text-right' : 'right-24 md:right-auto md:left-[calc(52%+1.5rem)] md:text-left'}`}
//       >
//         <div
//           className={`inline-block bg-white rounded-xl shadow-lg border-2 p-3 md:p-4 min-w-[140px] md:min-w-[180px] backdrop-blur-sm
//           ${
//             status === 'completed'
//               ? 'border-emerald-300 bg-emerald-50/90'
//               : status === 'current'
//                 ? 'border-blue-300 bg-blue-50/90'
//                 : 'border-slate-200 bg-white/90'
//           }`}
//         >
//           <div className="flex items-center gap-2 mb-1">
//             {status === 'completed' && <Award size={14} className="text-emerald-600" />}
//             {status === 'current' && <Zap size={14} className="text-blue-600" />}
//             {status === 'locked' && <Lock size={14} className="text-slate-400" />}
//             <h3
//               className={`font-black text-sm md:text-base uppercase tracking-wide
//               ${status === 'completed' ? 'text-emerald-700' : status === 'current' ? 'text-blue-700' : 'text-slate-500'}`}
//             >
//               {course.courseDay}
//             </h3>
//           </div>
//           <p
//             className={`text-xs font-semibold leading-tight max-w-[160px]
//             ${status === 'completed' ? 'text-emerald-600' : status === 'current' ? 'text-blue-600' : 'text-slate-500'}`}
//           >
//             {course.courseName}
//           </p>
//           {course.content.length > 0 && (
//             <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-slate-400">
//               <Target size={10} />
//               <span>{course.content.length} Tasks</span>
//             </div>
//           )}
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// const ContentModal = ({
//   course,
//   isOpen,
//   onClose,
//   completedContent,
//   onContentComplete,
// }: {
//   course: EnrichedCourse | null;
//   isOpen: boolean;
//   onClose: () => void;
//   completedContent: ContentProgress[];
//   onContentComplete: (contentId: string) => void;
// }) => {
//   const [selectedContent, setSelectedContent] = useState<CourseContentItem | null>(null);
//   const [viewMode, setViewMode] = useState<'list' | 'video' | 'assignment'>('list');

//   if (!isOpen || !course) return null;

//   const completedCount = course.content.filter(item => completedContent.some(cc => cc.contentId === item.id && cc.isComplete)).length;
//   const totalCount = course.content.length;
//   const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

//   const isContentComplete = (contentId: string) => {
//     return completedContent.some(cc => cc.contentId === contentId && cc.isComplete);
//   };

//   const handleContentClick = (content: CourseContentItem) => {
//     setSelectedContent(content);
//     if (content.type.toLowerCase().includes('video')) {
//       setViewMode('video');
//     } else if (content.type.toLowerCase().includes('assignment')) {
//       setViewMode('assignment');
//     }
//   };

//   const handleContentComplete = () => {
//     if (selectedContent) {
//       onContentComplete(selectedContent.id);
//       setSelectedContent(null);
//       setViewMode('list');
//     }
//   };

//   const handleBackToList = () => {
//     setSelectedContent(null);
//     setViewMode('list');
//   };

//   // Show video or assignment viewer
//   if (viewMode === 'video' && selectedContent) {
//     return <VideoPlayer content={selectedContent} onClose={handleBackToList} onComplete={handleContentComplete} />;
//   }

//   if (viewMode === 'assignment' && selectedContent) {
//     return <AssignmentViewer content={selectedContent} onClose={handleBackToList} onComplete={handleContentComplete} />;
//   }

//   // Show content list
//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           {/* Backdrop */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={onClose}
//             className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-40"
//           />

//           {/* Modal */}
//           <motion.div
//             initial={{ scale: 0.5, opacity: 0, y: 100 }}
//             animate={{ scale: 1, opacity: 1, y: 0 }}
//             exit={{ scale: 0.5, opacity: 0, y: 100 }}
//             transition={{ type: 'spring', damping: 25, stiffness: 300 }}
//             className="fixed inset-0 m-auto z-50 w-[95%] sm:w-[90%] max-w-2xl h-fit max-h-[90vh] bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
//           >
//             {/* Animated Header */}
//             <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-6 md:p-8 text-white relative overflow-hidden">
//               {/* Animated background elements */}
//               <motion.div
//                 className="absolute top-0 right-0 opacity-10"
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
//               >
//                 <Play size={150} fill="currentColor" />
//               </motion.div>

//               <motion.div
//                 className="absolute bottom-0 left-0 opacity-10"
//                 animate={{ rotate: -360 }}
//                 transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
//               >
//                 <Sparkles size={100} fill="currentColor" />
//               </motion.div>

//               {/* Close button */}
//               <motion.button
//                 onClick={onClose}
//                 whileHover={{ scale: 1.1, rotate: 90 }}
//                 whileTap={{ scale: 0.9 }}
//                 className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 md:p-2.5 transition backdrop-blur-md z-10"
//               >
//                 <X size={20} />
//               </motion.button>

//               {/* Content */}
//               <div className="relative z-10">
//                 <motion.div
//                   initial={{ y: -20, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ delay: 0.2 }}
//                   className="flex items-center gap-2 mb-3"
//                 >
//                   <div className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/30">
//                     <span className="text-xs font-bold uppercase tracking-wider">
//                       {course.status === 'completed' ? '✓ Completed' : course.status === 'current' ? '▶ Active' : '🔒 Locked'}
//                     </span>
//                   </div>
//                   {course.status === 'completed' && (
//                     <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.3 }}>
//                       <Trophy size={24} className="text-yellow-300" />
//                     </motion.div>
//                   )}
//                 </motion.div>

//                 <motion.h2
//                   initial={{ y: -20, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ delay: 0.3 }}
//                   className="text-3xl md:text-4xl font-black tracking-tight mb-2"
//                 >
//                   {course.courseDay}
//                 </motion.h2>

//                 <motion.p
//                   initial={{ y: -20, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ delay: 0.4 }}
//                   className="opacity-90 font-semibold text-blue-100 text-base md:text-lg"
//                 >
//                   {course.courseName}
//                 </motion.p>

//                 {/* Progress bar */}
//                 <motion.div
//                   initial={{ scaleX: 0, opacity: 0 }}
//                   animate={{ scaleX: 1, opacity: 1 }}
//                   transition={{ delay: 0.5 }}
//                   className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden backdrop-blur-sm"
//                 >
//                   <motion.div
//                     initial={{ width: 0 }}
//                     animate={{ width: `${progress}%` }}
//                     transition={{ delay: 0.7, duration: 0.8, ease: 'easeOut' }}
//                     className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"
//                   />
//                 </motion.div>
//                 <p className="text-xs text-blue-100 mt-1 font-medium">
//                   {completedCount} of {totalCount} tasks completed
//                 </p>
//               </div>
//             </div>

//             {/* Body - Task List */}
//             <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar bg-gradient-to-b from-slate-50 to-white flex-1">
//               {course.content.length === 0 ? (
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="flex flex-col items-center justify-center py-16 text-slate-400 text-center"
//                 >
//                   <div className="bg-slate-100 p-6 rounded-full mb-4">
//                     <Lock size={40} />
//                   </div>
//                   <p className="font-bold text-lg mb-1">No Missions Available</p>
//                   <p className="text-sm">This level is still being prepared.</p>
//                 </motion.div>
//               ) : (
//                 <div className="space-y-3">
//                   {course.content.map((item, idx) => {
//                     const isComplete = isContentComplete(item.id);
//                     return (
//                       <motion.div
//                         key={item.id}
//                         initial={{ opacity: 0, x: -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ delay: 0.1 * idx }}
//                         whileHover={{ scale: 1.02, x: 4 }}
//                         onClick={() => handleContentClick(item)}
//                         className={`group flex items-center p-4 rounded-xl bg-white border-2 shadow-sm hover:shadow-lg transition-all cursor-pointer
//                           ${isComplete ? 'border-green-400 bg-green-50' : 'border-slate-200 hover:border-blue-400'}
//                         `}
//                       >
//                         {/* Icon */}
//                         <motion.div
//                           whileHover={{ rotate: 360 }}
//                           transition={{ duration: 0.5 }}
//                           className={`
//                             w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mr-4 shrink-0
//                             transition-transform group-hover:scale-110
//                             ${
//                               isComplete
//                                 ? 'bg-gradient-to-br from-green-100 to-green-200 text-green-600'
//                                 : item.type.toLowerCase().includes('video')
//                                   ? 'bg-gradient-to-br from-red-100 to-red-200 text-red-600'
//                                   : 'bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-600'
//                             }
//                           `}
//                         >
//                           {isComplete ? (
//                             <CheckCircle size={22} />
//                           ) : item.type.toLowerCase().includes('video') ? (
//                             <Play size={22} fill="currentColor" />
//                           ) : (
//                             <FileText size={22} />
//                           )}
//                         </motion.div>

//                         {/* Content */}
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center gap-2 mb-1">
//                             <h4 className="font-bold text-slate-800 text-sm md:text-base truncate pr-2">{item.heading || item.name}</h4>
//                             {isComplete && <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">✓ DONE</span>}
//                           </div>
//                           <div className="flex flex-wrap items-center gap-2 text-xs">
//                             <span className="font-semibold text-slate-500 capitalize px-2 py-0.5 bg-slate-100 rounded">{item.type}</span>
//                             {item.data?.totalMarks && (
//                               <span className="font-bold text-orange-600 flex items-center gap-1">
//                                 <Trophy size={12} />
//                                 {item.data.totalMarks} pts
//                               </span>
//                             )}
//                           </div>
//                         </div>

//                         {/* Arrow */}
//                         <motion.div
//                           className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors
//                             ${isComplete ? 'bg-green-100 text-green-600' : 'bg-slate-100 group-hover:bg-blue-500 group-hover:text-white'}
//                           `}
//                           whileHover={{ x: 5 }}
//                         >
//                           <ChevronRight size={20} />
//                         </motion.div>
//                       </motion.div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             {/* Footer */}
//             <div className="p-4 md:p-6 border-t-2 border-slate-200 bg-white flex flex-col sm:flex-row justify-between items-center gap-3">
//               <div className="text-sm text-slate-500 font-semibold flex items-center gap-2">
//                 <Target size={16} className="text-blue-500" />
//                 <span>
//                   {completedCount}/{totalCount} Completed
//                 </span>
//               </div>
//               <motion.button
//                 onClick={onClose}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg shadow-blue-200"
//               >
//                 Continue Journey →
//               </motion.button>
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// };

// const Page = () => {
//   const { data: coursesData, isLoading, error } = useGetCoursesQuery({ page: 1, limit: 1000, q: '' });
//   const [selectedCourse, setSelectedCourse] = useState<EnrichedCourse | null>(null);

//   // User Progress State - This would typically come from your backend/Redux
//   const [completeContent, setCompleteContent] = useState<CourseProgress[]>([
//     {
//       courseId: '693a985355fe2dff9a139193',
//       completeContent: [
//         { contentId: 'video-video-uid-1-1766560822726', isComplete: true },
//         { contentId: 'Videos-video-uid-1-1766664024187', isComplete: true },
//       ],
//       isComplete: false,
//     },
//   ]);

//   // Handle content completion
//   const handleContentComplete = (courseId: string, contentId: string) => {
//     setCompleteContent(prev => {
//       const courseProgress = prev.find(p => p.courseId === courseId);

//       if (courseProgress) {
//         // Update existing course progress
//         const updatedContent = courseProgress.completeContent.some(c => c.contentId === contentId)
//           ? courseProgress.completeContent
//           : [...courseProgress.completeContent, { contentId, isComplete: true }];

//         // Check if all content is complete
//         const course = gameLevels.find(c => c._id === courseId);
//         const isComplete = course ? updatedContent.length === course.content.length : false;

//         return prev.map(p => (p.courseId === courseId ? { ...p, completeContent: updatedContent, isComplete } : p));
//       } else {
//         // Add new course progress
//         const course = gameLevels.find(c => c._id === courseId);
//         const isComplete = course ? course.content.length === 1 : false;

//         return [
//           ...prev,
//           {
//             courseId,
//             completeContent: [{ contentId, isComplete: true }],
//             isComplete,
//           },
//         ];
//       }
//     });
//   };

//   // Logic to determine level status
//   const gameLevels = useMemo<EnrichedCourse[]>(() => {
//     if (!coursesData || (!Array.isArray(coursesData.courses) && !Array.isArray(coursesData))) return [];

//     const rawCourses: Course[] = Array.isArray(coursesData) ? coursesData : coursesData.courses || [];
//     const sorted = [...rawCourses].sort((a, b) => getDayNumber(a.courseDay) - getDayNumber(b.courseDay));

//     return sorted.map((course, index) => {
//       const progress = completeContent.find(p => p.courseId === course._id);
//       const isThisComplete = progress?.isComplete || false;

//       let status: 'locked' | 'current' | 'completed' = 'locked';

//       if (isThisComplete) {
//         status = 'completed';
//       } else {
//         if (index === 0) {
//           status = 'current';
//         } else {
//           const prevCourse = sorted[index - 1];
//           const prevProgress = completeContent.find(p => p.courseId === prevCourse._id);

//           if (prevProgress?.isComplete) {
//             status = 'current';
//           } else {
//             status = 'locked';
//           }
//         }
//       }

//       return { ...course, status };
//     });
//   }, [coursesData, completeContent]);

//   const handleNodeClick = (course: EnrichedCourse) => {
//     setSelectedCourse(course);
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
//             className="rounded-full h-16 w-16 border-4 border-slate-200 border-t-blue-500 mb-4"
//           />
//           <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-slate-600 font-bold text-lg">
//             Loading Your Adventure...
//           </motion.p>
//         </motion.div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
//         <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
//           <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//             <X size={32} className="text-red-600" />
//           </div>
//           <h2 className="text-2xl font-black text-red-600 mb-2">Oops!</h2>
//           <p className="text-slate-600 font-medium">Failed to load your course map. Please try again.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-x-hidden relative pb-20">
//       {/* Enhanced Background Elements */}
//       <div className="fixed inset-0 pointer-events-none overflow-hidden">
//         <motion.div
//           animate={{
//             scale: [1, 1.2, 1],
//             opacity: [0.3, 0.5, 0.3],
//           }}
//           transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
//           className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-[120px]"
//         />
//         <motion.div
//           animate={{
//             scale: [1, 1.3, 1],
//             opacity: [0.3, 0.6, 0.3],
//           }}
//           transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
//           className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[120px]"
//         />

//         {/* Animated Grid */}
//         <div
//           className="absolute inset-0 opacity-[0.03]"
//           style={{
//             backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)',
//             backgroundSize: '40px 40px',
//           }}
//         />
//       </div>

//       <div className="relative z-10 max-w-3xl mx-auto px-4 py-8 md:py-12">
//         {/* Enhanced Header */}
//         <header className="text-center mb-12 md:mb-20 relative">
//           <motion.div
//             initial={{ y: -50, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
//             className="inline-block relative"
//           >
//             {/* Floating trophy */}
//             <motion.div
//               className="absolute -top-8 -right-12 md:-right-16"
//               animate={{
//                 y: [0, -10, 0],
//                 rotate: [0, 5, 0, -5, 0],
//               }}
//               transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
//             >
//               <Trophy size={56} className="text-yellow-400 drop-shadow-2xl" />
//             </motion.div>

//             <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-blue-600 to-indigo-600 tracking-tighter mb-3">
//               YOUR QUEST
//             </h1>
//             <p className="text-slate-600 font-bold text-base md:text-lg flex items-center justify-center gap-2">
//               <Sparkles size={18} className="text-yellow-500" />
//               Complete each level to unlock the next
//               <Sparkles size={18} className="text-yellow-500" />
//             </p>
//           </motion.div>
//         </header>

//         {/* Game Map Container */}
//         <div className="flex flex-col items-center relative min-h-[500px]">
//           {/* Start Point */}
//           <motion.div
//             initial={{ scale: 0, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ type: 'spring', delay: 0.3 }}
//             className="mb-6 flex flex-col items-center z-20"
//           >
//             <motion.div
//               animate={{
//                 boxShadow: ['0 0 20px rgba(16, 185, 129, 0.5)', '0 0 40px rgba(16, 185, 129, 0.8)', '0 0 20px rgba(16, 185, 129, 0.5)'],
//               }}
//               transition={{ duration: 2, repeat: Infinity }}
//               className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-2.5 rounded-full text-xs md:text-sm font-black uppercase tracking-widest shadow-lg"
//             >
//               🚀 Start Here
//             </motion.div>
//             <div className="h-8 w-1 border-l-4 border-dotted border-emerald-400 mt-2" />
//           </motion.div>

//           {/* Levels */}
//           <div className="w-full relative">
//             {gameLevels.map((course, index) => (
//               <LevelNode key={course._id} course={course} index={index} onClick={handleNodeClick} isLast={index === gameLevels.length - 1} />
//             ))}
//           </div>

//           {/* End Point */}
//           {gameLevels.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 1.5, type: 'spring' }}
//               className="mt-8 flex flex-col items-center z-20"
//             >
//               <motion.div
//                 animate={{
//                   rotate: 360,
//                 }}
//                 transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
//                 className="relative"
//               >
//                 <motion.div
//                   animate={{
//                     scale: [1, 1.2, 1],
//                     opacity: [0.4, 0.7, 0.4],
//                   }}
//                   transition={{ duration: 2, repeat: Infinity }}
//                   className="absolute inset-0 bg-yellow-400 blur-2xl rounded-full"
//                 />
//                 <Trophy size={64} className="text-yellow-500 relative z-10 drop-shadow-2xl" />
//               </motion.div>
//               <motion.div
//                 animate={{
//                   boxShadow: ['0 0 20px rgba(251, 191, 36, 0.5)', '0 0 40px rgba(251, 191, 36, 0.8)', '0 0 20px rgba(251, 191, 36, 0.5)'],
//                 }}
//                 transition={{ duration: 2, repeat: Infinity }}
//                 className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 text-yellow-900 px-6 py-2 rounded-full text-xs md:text-sm font-black uppercase tracking-wider mt-5 shadow-lg"
//               >
//                 🏆 Victory Awaits
//               </motion.div>
//             </motion.div>
//           )}
//         </div>
//       </div>

//       {/* Modal */}
//       {selectedCourse && (
//         <ContentModal
//           course={selectedCourse}
//           isOpen={!!selectedCourse}
//           onClose={() => setSelectedCourse(null)}
//           completedContent={completeContent.find(p => p.courseId === selectedCourse._id)?.completeContent || []}
//           onContentComplete={contentId => handleContentComplete(selectedCourse._id, contentId)}
//         />
//       )}

//       {/* Custom Scrollbar Styles */}
//       <style jsx global>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 8px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: #f1f5f9;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #cbd5e1;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #94a3b8;
//         }
//       `}</style>
//     </main>
//   );
// };

// export default Page;
