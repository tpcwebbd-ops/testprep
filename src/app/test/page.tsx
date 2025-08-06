/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: webapp, August, 2025
|-----------------------------------------
*/
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Zod schema for form validation
const ieltsTestSchema = z.object({
  readingQuestion: z.string().nonempty({ message: 'Please select an answer.' }),
  writingQuestion: z.string().min(20, { message: 'Answer must be at least 20 characters long.' }),
});

type IeltsTestFormInputs = z.infer<typeof ieltsTestSchema>;

const ComingSoonWithIeltsTest = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [showTest, setShowTest] = useState(false);
  const [testResult, setTestResult] = useState<{ score: number; total: number } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IeltsTestFormInputs>({
    resolver: zodResolver(ieltsTestSchema),
  });

  const launchDate = new Date('2025-12-31T00:00:00');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = launchDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const onTestSubmit: SubmitHandler<IeltsTestFormInputs> = data => {
    let score = 0;
    if (data.readingQuestion === 'B') {
      score++;
    }
    // Simple check for writing question, in a real scenario this would be more complex
    if (data.writingQuestion.length > 20) {
      score++;
    }
    setTestResult({ score, total: 2 });
    setShowTest(false);
  };

  const restartTest = () => {
    setTestResult(null);
    setShowTest(true);
    reset();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 overflow-hidden">
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Coming Soon</h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300">Our new website is on its way to provide you with an amazing experience.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="flex space-x-4 md:space-x-8 mt-8 text-center"
      >
        <div>
          <span className="text-4xl md:text-6xl font-bold">{timeLeft.days}</span>
          <span className="block text-sm text-gray-400">Days</span>
        </div>
        <div>
          <span className="text-4xl md:text-6xl font-bold">{timeLeft.hours}</span>
          <span className="block text-sm text-gray-400">Hours</span>
        </div>
        <div>
          <span className="text-4xl md:text-6xl font-bold">{timeLeft.minutes}</span>
          <span className="block text-sm text-gray-400">Minutes</span>
        </div>
        <div>
          <span className="text-4xl md:text-6xl font-bold">{timeLeft.seconds}</span>
          <span className="block text-sm text-gray-400">Seconds</span>
        </div>
      </motion.div>

      <AnimatePresence>
        {!showTest && !testResult && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-12 text-center"
          >
            <h2 className="text-2xl font-semibold mb-4">Ready for a challenge?</h2>
            <button
              onClick={() => setShowTest(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Take a Mini IELTS Test
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTest && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl mt-8 bg-gray-800 p-8 rounded-lg shadow-2xl"
          >
            <h2 className="text-3xl font-bold text-center mb-6">IELTS Practice Test</h2>
            <form onSubmit={handleSubmit(onTestSubmit)}>
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Reading Section</h3>
                <p className="mb-4 text-gray-300">Read the passage and answer the question below.</p>
                <p className="italic bg-gray-700 p-4 rounded-md text-gray-300">
                  "The advancements in artificial intelligence are growing at an exponential rate, leading to significant changes in various industries. While
                  some view this as a threat to human employment, others see it as an opportunity for unprecedented growth and innovation."
                </p>
                <p className="mt-4 font-semibold">What is the main idea of the passage?</p>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center">
                    <input type="radio" {...register('readingQuestion')} value="A" className="form-radio h-5 w-5 text-purple-600" />
                    <span className="ml-2 text-gray-300">AI is a definitive threat to all jobs.</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" {...register('readingQuestion')} value="B" className="form-radio h-5 w-5 text-purple-600" />
                    <span className="ml-2 text-gray-300">The growth of AI presents both challenges and opportunities.</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" {...register('readingQuestion')} value="C" className="form-radio h-5 w-5 text-purple-600" />
                    <span className="ml-2 text-gray-300">AI has no impact on the job market.</span>
                  </label>
                </div>
                {errors.readingQuestion && <p className="text-red-500 mt-2">{errors.readingQuestion.message}</p>}
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Writing Section (Task 2)</h3>
                <p className="mb-2 text-gray-300">Write a short response (min. 20 characters) to the following question:</p>
                <p className="font-semibold mb-4">"What are the benefits of international travel?"</p>
                <textarea
                  {...register('writingQuestion')}
                  rows={4}
                  className="w-full p-2 bg-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                ></textarea>
                {errors.writingQuestion && <p className="text-red-500 mt-2">{errors.writingQuestion.message}</p>}
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  Submit Answers
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {testResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md mt-8 bg-gray-800 p-8 rounded-lg shadow-2xl text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Test Complete!</h2>
            <p className="text-xl text-gray-300 mb-4">
              You scored <span className="text-5xl font-bold text-purple-400">{testResult.score}</span> out of {testResult.total}
            </p>
            <button
              onClick={restartTest}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ComingSoonWithIeltsTest;
