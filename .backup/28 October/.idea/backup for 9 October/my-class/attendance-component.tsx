'use client';

import { format } from 'date-fns';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-200/20 rounded-full blur-xl" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-200/20 rounded-full blur-xl" />
      </div>

      <div className="relative flex items-center justify-center min-h-screen">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
          {/* Main glass card */}
          <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl border border-white/30 shadow-2xl shadow-blue-500/10">
            {/* Glass effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent" />

            {/* Content */}
            <div className="relative p-6 sm:p-8 md:p-10 lg:p-12 text-center">
              {/* Welcome section */}
              <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Welcome Back!
                </h1>

                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 font-medium px-2">{motivationalTitle}</p>
              </div>

              {/* Course badges */}
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                {['IELTS', 'Spoken English', 'PTE', 'GRE'].map(course => (
                  <span
                    key={course}
                    className="px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg backdrop-blur-sm hover:scale-110 hover:-translate-y-0.5 transition-transform duration-200"
                  >
                    {course}
                  </span>
                ))}
              </div>

              {/* Date and time display */}
              <div className="mb-8 sm:mb-10 p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-50/50 to-blue-50/50 backdrop-blur-sm border border-white/40">
                <p className="text-base sm:text-lg md:text-xl font-medium text-slate-700 mb-2">{formattedDate}</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">{formattedTime}</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Bangladesh Standard Time</p>
              </div>

              {/* Attendance button */}
              <div className="flex justify-center">
                <button
                  onClick={handleAttendanceSubmit}
                  className="relative group px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg md:text-xl font-bold text-white bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-2xl"
                >
                  {/* Button background hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <span className="relative flex items-center gap-2">📚 Submit Attendance →</span>
                </button>
              </div>

              {/* Motivational footer */}
              <p className="mt-6 sm:mt-8 text-xs sm:text-sm text-slate-500 italic">&quot;Your English journey starts with today&quot;s commitment!&quot;</p>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl" />
            <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceComponent;
