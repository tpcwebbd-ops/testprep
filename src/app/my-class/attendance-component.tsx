'use client';

import { format } from 'date-fns';
import { motion, Variants } from 'framer-motion';
import { useStore } from './store';
import { useState, useEffect } from 'react';

// Motivational titles for English learning courses
const motivationalTitles = [
  "Today's your day to shine in English! ✨",
  'Every word you learn opens new doors! 🚪',
  "Practice makes perfect - you've got this! 💪",
  'Your English journey starts with one step! 🌟',
  'Believe in yourself and your abilities! 🎯',
  'Success in IELTS begins with dedication! 📚',
  'Spoken English mastery is within reach! 🗣️',
  "PTE excellence starts with today's effort! 🎭",
  'GRE success is built one day at a time! 🏗️',
  'Your potential in English is limitless! 🚀',
  'Confidence grows with every lesson! 🌱',
  "Today's practice shapes tomorrow's success! ⭐",
  'Master English, master your future! 🎓',
  'Your dedication will lead to fluency! 🏆',
  'Every mistake is a step toward perfection! 📈',
  'Embrace the challenge, celebrate the progress! 🎉',
  'English fluency is your superpower! ⚡',
  'Dreams become reality through persistence! 💫',
  "You're closer to your goal than yesterday! 🎯",
  'Excellence in English starts right now! ⏰',
];

// Generate daily motivational title based on date
const getDailyMotivationalTitle = (): string => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return motivationalTitles[dayOfYear % motivationalTitles.length];
};

const AttendanceComponent: React.FC = () => {
  const { time, handleAttendanceSubmit } = useStore();
  const [motivationalTitle, setMotivationalTitle] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setMotivationalTitle(getDailyMotivationalTitle());
  }, []);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  const formattedDate = format(time, 'eeee, MMMM do, yyyy');
  const formattedTime = format(time, 'h:mm:ss a');

  // Floating animation variants
  const floatingVariants: Variants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        ease: 'easeInOut',
        repeat: Infinity,
      },
    },
  };

  const pulseVariants: Variants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        ease: 'easeInOut',
        repeat: Infinity,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [-100, 100, -100],
            y: [-50, 50, -50],
          }}
          transition={{
            duration: 20,
            ease: 'linear',
            repeat: Infinity,
          }}
          className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [100, -100, 100],
            y: [50, -50, 50],
          }}
          transition={{
            duration: 25,
            ease: 'linear',
            repeat: Infinity,
          }}
          className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-200/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [-50, 150, -50],
            y: [100, -100, 100],
          }}
          transition={{
            duration: 30,
            ease: 'linear',
            repeat: Infinity,
          }}
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-200/20 rounded-full blur-xl"
        />
      </div>

      <div className="relative flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.8,
            ease: 'easeOut',
            type: 'spring',
            bounce: 0.4,
          }}
          className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl"
        >
          {/* Main glass card */}
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-white/30 shadow-2xl shadow-blue-500/10"
          >
            {/* Glass effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent" />

            {/* Content */}
            <div className="relative p-6 sm:p-8 md:p-10 lg:p-12 text-center">
              {/* Animated welcome section */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="mb-6 sm:mb-8">
                <motion.h1
                  variants={pulseVariants}
                  animate="animate"
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2"
                >
                  Welcome Back!
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 font-medium px-2"
                >
                  {motivationalTitle}
                </motion.p>
              </motion.div>

              {/* Course badges */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8"
              >
                {['IELTS', 'Spoken English', 'PTE', 'GRE'].map((course, index) => (
                  <motion.span
                    key={course}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 + index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg backdrop-blur-sm"
                  >
                    {course}
                  </motion.span>
                ))}
              </motion.div>

              {/* Date and time display */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="mb-8 sm:mb-10 p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-50/50 to-blue-50/50 backdrop-blur-sm border border-white/40"
              >
                <motion.p
                  className="text-base sm:text-lg md:text-xl font-medium text-slate-700 mb-2"
                  animate={{
                    color: ['#334155', '#1e40af', '#334155'],
                  }}
                  transition={{
                    duration: 3,
                    ease: 'easeInOut',
                    repeat: Infinity,
                  }}
                >
                  {formattedDate}
                </motion.p>
                <motion.p
                  className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    ease: 'easeInOut',
                    repeat: Infinity,
                  }}
                >
                  {formattedTime}
                </motion.p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Bangladesh Standard Time</p>
              </motion.div>

              {/* Attendance button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.6, type: 'spring', bounce: 0.6 }}
                className="flex justify-center"
              >
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    y: -2,
                    boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAttendanceSubmit}
                  className="relative group px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg md:text-xl font-bold text-white bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden transition-all duration-300"
                >
                  {/* Button background animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Button shimmer effect */}
                  <motion.div
                    animate={{
                      x: [-100, 100],
                    }}
                    transition={{
                      duration: 2,
                      ease: 'linear',
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                  />

                  <span className="relative flex items-center gap-2">📚 Submit Attendance →</span>
                </motion.button>
              </motion.div>

              {/* Motivational footer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 0.8 }}
                className="mt-6 sm:mt-8 text-xs sm:text-sm text-slate-500 italic"
              >
                &quot;Your English journey starts with today&quot;s commitment!&quot;
              </motion.p>
            </div>

            {/* Decorative elements */}
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                ease: 'linear' as const,
                repeat: Infinity,
              }}
              className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl"
            />
            <motion.div
              animate={{
                rotate: [360, 0],
              }}
              transition={{
                duration: 25,
                ease: 'linear' as const,
                repeat: Infinity,
              }}
              className="absolute -bottom-10 -left-10 w-16 h-16 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-xl"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AttendanceComponent;
