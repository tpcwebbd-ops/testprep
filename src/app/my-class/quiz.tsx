/*
|-----------------------------------------
| Quiz Component
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, September, 2025
|-----------------------------------------
*/
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question } from './page'; // Adjust path if needed

const Quiz = ({ questions }: { questions: Question[] }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [result, setResult] = useState<'Correct' | 'Incorrect' | ''>('');
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAnswerSelect = (option: string) => {
    if (result) return; // Prevent changing answer after submission
    setSelectedAnswer(option);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    if (selectedAnswer === questions[currentQuestionIndex].answer) {
      setResult('Correct');
    } else {
      setResult('Incorrect');
    }
  };

  const handleNextQuestion = () => {
    setResult('');
    setSelectedAnswer(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  if (isCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex h-full flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-xl"
      >
        <h2 className="text-2xl font-bold text-green-500">You have completed the quiz!</h2>
        <p className="mt-2 text-gray-600">Great job!</p>
      </motion.div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg bg-white p-6 shadow-xl">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Question {currentQuestionIndex + 1}/{questions.length}
        </h2>
        <p className="mt-2 text-gray-700">{currentQuestion.question}</p>
      </div>

      <div className="my-6 space-y-3">
        {currentQuestion.options.map(option => (
          <motion.button
            key={option}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAnswerSelect(option)}
            className={`w-full rounded-md p-3 text-left transition-all duration-200 ${
              selectedAnswer === option ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-blue-100'
            } ${result && option === currentQuestion.answer ? 'border-2 border-green-500' : ''} ${
              result && selectedAnswer === option && option !== currentQuestion.answer ? 'border-2 border-red-500' : ''
            }`}
          >
            {option}
          </motion.button>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <AnimatePresence>
          {result && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-lg font-bold ${result === 'Correct' ? 'text-green-500' : 'text-red-500'}`}
            >
              {result}
            </motion.p>
          )}
        </AnimatePresence>
        {!result ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="rounded-md bg-blue-600 px-6 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            Submit
          </button>
        ) : (
          <button onClick={handleNextQuestion} className="rounded-md bg-green-600 px-6 py-2 font-semibold text-white transition hover:bg-green-700">
            {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Quiz;
