'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, CheckCircle2 } from 'lucide-react';

// Mock data
const myClassData = Array.from({ length: 80 }, (_, i) => {
  const id = i + 1;
  const titles = ['Intro', 'Spoken', 'Listening', 'Writing', 'Reading'];
  return {
    id,
    day: id,
    idComplete: id <= 5, // 👈 Example: first 5 are completed
    title: titles[(id - 1) % titles.length],
    path: `/dashboard/my-class/${id}`,
  };
});

const Page = () => {
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const router = useRouter();

  // ✅ Find last completed day
  const lastCompleted = Math.max(...myClassData.filter(d => d.idComplete).map(d => d.day), 0);

  // ✅ Filter data to show only: completed + next day
  const visibleClasses = myClassData.filter(d => d.day <= lastCompleted + 1);

  const handleClick = (day: number) => {
    const prevDay = myClassData.find(d => d.day === day - 1);
    const current = myClassData.find(d => d.day === day);

    if (day === 1 || prevDay?.idComplete) {
      setActiveDay(day);
      setTimeout(() => router.push(current?.path || '/'), 300);
    } else {
      alert(`Please complete Day ${day - 1} first.`);
    }
  };

  return (
    <main className="min-h-screen py-5 bg-gradient-to-br from-blue-900 via-indigo-900 to-black text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-semibold text-center mb-10 tracking-wide">🎓 My IELTS Class Progress</h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {visibleClasses.map(item => {
            const locked = item.day !== 1 && !myClassData.find(d => d.day === item.day - 1)?.idComplete;
            const isActive = activeDay === item.day;

            return (
              <motion.div
                key={item.id}
                whileHover={!locked ? { scale: 1.05 } : {}}
                whileTap={!locked ? { scale: 0.97 } : {}}
                onClick={() => !locked && handleClick(item.day)}
                className={`relative cursor-pointer backdrop-blur-md rounded-2xl border border-white/20 p-4 flex flex-col items-center justify-center text-center transition-all duration-300 ${
                  locked
                    ? 'bg-white/10 text-gray-400 cursor-not-allowed'
                    : isActive
                      ? 'bg-blue-500/40 border-blue-300/60 shadow-lg shadow-blue-500/30'
                      : item.idComplete
                        ? 'bg-green-500/30 border-green-400/40'
                        : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  {item.idComplete ? (
                    <CheckCircle2 className="w-5 h-5 text-green-300" />
                  ) : locked ? (
                    <Lock className="w-5 h-5 text-gray-400" />
                  ) : (
                    <div className="w-5 h-5" />
                  )}
                  <h3 className="text-lg font-medium">Day {item.day}</h3>
                </div>
                <p className="text-sm opacity-80">{item.title}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default Page;
