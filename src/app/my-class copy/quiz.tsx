
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question } from './course-data'; // Assuming Question type is exported from course-data

type UserAnswer = {
  questionId: number;
  selectedOption: string;
  correctAnswer: string;
  isCorrect: boolean;
};

interface QuizProps {
  questions: Question[];
  onNext: () => void; // Prop to signal completion
}

const Quiz = ({ questions, onNext }: QuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    setUserAnswers([
      ...userAnswers,
      {
        questionId: currentQuestion.id,
        selectedOption: selectedAnswer,
        correctAnswer: currentQuestion.answer,
        isCorrect: selectedAnswer === currentQuestion.answer,
      },
    ]);

    setSelectedAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const score = userAnswers.filter(answer => answer.isCorrect).length;
      const percentage = Math.round((score / questions.length) * 100);

      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(34, 34, 34);

      doc.text('Quiz Report', 20, 30);

      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text(`Final Score: ${score} out of ${questions.length} (${percentage}%)`, 20, 50);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 60);

      doc.setDrawColor(200, 200, 200);
      doc.line(20, 70, 190, 70);

      let yPosition = 85;

      questions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(`Question ${index + 1}:`, 20, yPosition);
        yPosition += 8;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const questionLines = doc.splitTextToSize(question.question, 170);
        doc.text(questionLines, 20, yPosition);
        yPosition += questionLines.length * 5 + 5;
        if (userAnswer.isCorrect) {
          doc.setTextColor(34, 139, 34);
        } else {
          doc.setTextColor(220, 20, 60);
        }
        doc.text(`Your Answer: ${userAnswer.selectedOption} ${userAnswer.isCorrect ? '✓' : '✗'}`, 20, yPosition);
        yPosition += 8;
        if (!userAnswer.isCorrect) {
          doc.setTextColor(34, 139, 34);
          doc.text(`Correct Answer: ${userAnswer.correctAnswer}`, 20, yPosition);
          yPosition += 8;
        }
        doc.setTextColor(34, 34, 34);
        yPosition += 5;
      });

      doc.save('quiz-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      handleDownloadTextReport();
    }
  };

  const handleDownloadTextReport = () => {
    const score = userAnswers.filter(answer => answer.isCorrect).length;
    let reportContent = `Quiz Report\n`;
    reportContent += `Final Score: ${score} out of ${questions.length}\n`;
    reportContent += `Date: ${new Date().toLocaleDateString()}\n`;
    reportContent += `----------------------------------------\n\n`;

    questions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      reportContent += `Question ${index + 1}: ${question.question}\n`;
      reportContent += `Your Answer: ${userAnswer.selectedOption} ${userAnswer.isCorrect ? '(Correct)' : '(Incorrect)'}\n`;
      reportContent += `Correct Answer: ${userAnswer.correctAnswer}\n\n`;
    });

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quiz-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setIsCompleted(false);
    setQuizFinished(false);
  };

  useEffect(() => {
    if (!quizFinished) {
      onNext(); // Signal that the lecture (quiz) is complete
      setQuizFinished(true); // Ensure it only runs once per completion
    }
  }, [onNext, quizFinished]);

  if (isCompleted) {
    const score = userAnswers.filter(answer => answer.isCorrect).length;
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-3 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="glass-effect rounded-2xl p-6 sm:p-8 lg:p-10"
          >
            <div className="mb-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-2xl sm:h-24 sm:w-24 sm:text-3xl"
              >
                🎉
              </motion.div>
              <h2 className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl lg:text-4xl">
                Quiz Completed!
              </h2>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4 inline-block rounded-full border border-gray-300/30 bg-gray-800/10 px-6 py-3 backdrop-blur-sm"
              >
                <p className="text-lg text-gray-800 sm:text-xl">
                  Your Score:{' '}
                  <span className="font-bold text-blue-600">
                    {score}/{questions.length}
                  </span>
                </p>
                <p className="text-sm text-gray-600 sm:text-base">{percentage}% Accuracy</p>
              </motion.div>
            </div>

            <div className="mb-8 flex justify-center">
              <div className="relative h-32 w-32 sm:h-40 sm:w-40">
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="rgba(156,163,175,0.3)" strokeWidth="8" fill="none" />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - percentage / 100) }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#6366F1" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800 sm:text-3xl">{percentage}%</span>
                </div>
              </div>
            </div>

            <div className="custom-scrollbar mb-8 max-h-72 space-y-4 overflow-y-auto pr-2 sm:max-h-80 lg:max-h-96">
              <AnimatePresence>
                {questions.map((question, index) => {
                  const userAnswer = userAnswers[index];
                  return (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`glass-card rounded-xl border-l-4 p-4 ${
                        userAnswer.isCorrect ? 'border-green-500 bg-green-50/80' : 'border-red-500 bg-red-50/80'
                      }`}
                    >
                      <p className="text-sm font-semibold text-gray-800 sm:text-base">{question.question}</p>
                      <p className={`mt-2 text-xs sm:text-sm ${userAnswer.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                        Your answer: {userAnswer.selectedOption}
                      </p>
                      {!userAnswer.isCorrect && <p className="mt-1 text-xs text-green-700 sm:text-sm">Correct answer: {userAnswer.correctAnswer}</p>}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadReport}
                className="glass-button rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 py-3 px-6 font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl border-blue-300 sm:px-8"
              >
                📄 Download PDF Report
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetQuiz}
                className="glass-button rounded-full border border-gray-300/50 bg-white/60 py-3 px-6 font-semibold text-gray-700 backdrop-blur-sm transition-all duration-300 hover:border-gray-400/50 hover:bg-white/80 sm:px-8"
              >
                🔄 Retake Quiz
              </motion.button>
            </div>
          </motion.div>
        </div>

        <style jsx>{`
          .glass-effect {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(209, 213, 219, 0.3);
            box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
          }
          .glass-card {
            background: rgba(255, 255, 255, 0.6);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(209, 213, 219, 0.2);
          }
          .glass-button {
            backdrop-filter: blur(10px);
            border: 1px solid rgba(209, 213, 219, 0.3);
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(156, 163, 175, 0.2);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(156, 163, 175, 0.5);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(156, 163, 175, 0.7);
          }
        `}</style>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-3 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-2xl lg:max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="glass-effect rounded-2xl p-6 sm:p-8 lg:p-10">
          <div className="mb-6 sm:mb-8">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-xl font-bold text-transparent sm:text-2xl lg:text-3xl">
                Question {currentQuestionIndex + 1}
              </h2>
              <div className="mt-2 text-sm text-gray-600 sm:mt-0 sm:text-base">
                {currentQuestionIndex + 1} of {questions.length}
              </div>
            </div>

            <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200/50 backdrop-blur-sm sm:h-4">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 shadow-lg"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
              <div className="animate-pulse absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
            <p className="mt-2 text-right text-xs text-gray-500 sm:text-sm">{Math.round(progress)}% Complete</p>
          </div>

          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="glass-card mb-6 rounded-xl p-4 sm:mb-8 sm:p-6"
          >
            <p className="text-base font-medium leading-relaxed text-gray-800 sm:text-lg lg:text-xl">{currentQuestion.question}</p>
          </motion.div>

          <div className="mb-6 space-y-3 sm:mb-8 sm:space-y-4">
            <AnimatePresence>
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={option}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedAnswer(option)}
                  className={`w-full transform rounded-xl p-4 text-left transition-all duration-300 sm:p-5 ${
                    selectedAnswer === option
                      ? 'glass-button border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-800 ring-2 ring-blue-500/50 shadow-xl'
                      : 'glass-card border-gray-200/50 bg-white/60 text-gray-700 hover:shadow-lg hover:bg-white/80'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`h-3 w-3 rounded-full border-2 transition-all duration-300 sm:h-4 sm:w-4 ${
                        selectedAnswer === option ? 'border-blue-500 bg-blue-500' : 'border-gray-400'
                      }`}
                    />
                    <span className="text-sm font-medium sm:text-base lg:text-lg">{option}</span>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500 sm:text-sm">{selectedAnswer ? '✓ Answer selected' : 'Select an answer to continue'}</div>
            <motion.button
              whileHover={{ scale: selectedAnswer ? 1.05 : 1 }}
              whileTap={{ scale: selectedAnswer ? 0.95 : 1 }}
              onClick={handleNext}
              disabled={!selectedAnswer}
              className={`glass-button rounded-full py-3 px-6 font-semibold transition-all duration-300 sm:px-8 lg:px-10 ${
                selectedAnswer
                  ? 'cursor-pointer border-blue-300 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl'
                  : 'cursor-not-allowed border-gray-300 bg-gray-200/50 text-gray-400'
              }`}
            >
              {isLastQuestion ? '🏁 Finish Quiz' : '➡️ Next Question'}
            </motion.button>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .glass-effect {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(209, 213, 219, 0.3);
          box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(209, 213, 219, 0.2);
        }
        .glass-button {
          backdrop-filter: blur(10px);
          border: 1px solid rgba(209, 213, 219, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Quiz;
