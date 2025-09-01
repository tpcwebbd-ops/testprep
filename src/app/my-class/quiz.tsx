/*
|-----------------------------------------
| Quiz Component (Enhanced with Glassmorphism & PDF)
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, September, 2025
|-----------------------------------------
*/
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question } from './page'; // Adjust path if needed

// Define a type for storing the user's answers for better type safety
type UserAnswer = {
  questionId: number;
  selectedOption: string;
  correctAnswer: string;
  isCorrect: boolean;
};

// Props for the Quiz component
interface QuizProps {
  questions: Question[];
}

const Quiz = ({ questions }: QuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // This function now handles moving to the next question or finishing the quiz
  const handleNext = () => {
    if (selectedAnswer === null) return; // Don't proceed without an answer

    // Record the user's answer
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

    // Reset selected answer for the next question
    setSelectedAnswer(null);

    // Check if it's the last question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions are answered, show the results view
      setIsCompleted(true);
    }
  };

  // Function to generate and download the PDF report
  const handleDownloadReport = async () => {
    try {
      const score = userAnswers.filter(answer => answer.isCorrect).length;
      const percentage = Math.round((score / questions.length) * 100);

      // Create PDF content using jsPDF
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();

      // Set fonts and colors
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(34, 34, 34);

      // Title
      doc.text('Quiz Report', 20, 30);

      // Score summary
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text(`Final Score: ${score} out of ${questions.length} (${percentage}%)`, 20, 50);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 60);

      // Draw a line
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 70, 190, 70);

      let yPosition = 85;

      // Questions and answers
      questions.forEach((question, index) => {
        const userAnswer = userAnswers[index];

        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }

        // Question number and text
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(`Question ${index + 1}:`, 20, yPosition);
        yPosition += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const questionLines = doc.splitTextToSize(question.question, 170);
        doc.text(questionLines, 20, yPosition);
        yPosition += questionLines.length * 5 + 5;

        // User's answer
        if (userAnswer.isCorrect) {
          doc.setTextColor(34, 139, 34);
        } else {
          doc.setTextColor(220, 20, 60);
        }
        // doc.setTextColor(userAnswer.isCorrect ? 34, 139, 34 : 220, 20, 60);
        doc.text(`Your Answer: ${userAnswer.selectedOption} ${userAnswer.isCorrect ? '✓' : '✗'}`, 20, yPosition);
        yPosition += 8;

        // Correct answer if wrong
        if (!userAnswer.isCorrect) {
          doc.setTextColor(34, 139, 34);
          doc.text(`Correct Answer: ${userAnswer.correctAnswer}`, 20, yPosition);
          yPosition += 8;
        }

        doc.setTextColor(34, 34, 34);
        yPosition += 5;
      });

      // Save the PDF
      doc.save('quiz-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to text download if PDF fails
      handleDownloadTextReport();
    }
  };

  // Fallback function for text download
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
  };

  // Render the Results View when the quiz is completed
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
            {/* Results Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="mx-auto mb-6 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-2xl sm:text-3xl"
              >
                🎉
              </motion.div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                Quiz Completed!
              </h2>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-4 inline-block rounded-full bg-gray-800/10 px-6 py-3 backdrop-blur-sm border border-gray-300/30"
              >
                <p className="text-lg sm:text-xl text-gray-800">
                  Your Score:{' '}
                  <span className="font-bold text-blue-600">
                    {score}/{questions.length}
                  </span>
                </p>
                <p className="text-sm sm:text-base text-gray-600">{percentage}% Accuracy</p>
              </motion.div>
            </div>

            {/* Progress Ring */}
            <div className="flex justify-center mb-8">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
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
                  <span className="text-2xl sm:text-3xl font-bold text-gray-800">{percentage}%</span>
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="mb-8 max-h-72 sm:max-h-80 lg:max-h-96 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence>
                {questions.map((question, index) => {
                  const userAnswer = userAnswers[index];
                  return (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`glass-card rounded-xl p-4 border-l-4 ${
                        userAnswer.isCorrect ? 'border-green-500 bg-green-50/80' : 'border-red-500 bg-red-50/80'
                      }`}
                    >
                      <p className="font-semibold text-gray-800 text-sm sm:text-base">{question.question}</p>
                      <p className={`mt-2 text-xs sm:text-sm ${userAnswer.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                        Your answer: {userAnswer.selectedOption}
                      </p>
                      {!userAnswer.isCorrect && <p className="mt-1 text-xs sm:text-sm text-green-700">Correct answer: {userAnswer.correctAnswer}</p>}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadReport}
                className="glass-button bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 sm:px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl border-blue-300"
              >
                📄 Download PDF Report
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetQuiz}
                className="glass-button bg-white/60 hover:bg-white/80 text-gray-700 font-semibold py-3 px-6 sm:px-8 rounded-full transition-all duration-300 backdrop-blur-sm border border-gray-300/50 hover:border-gray-400/50"
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

  // Render the Question View while the quiz is in progress
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-3 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-2xl lg:max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="glass-effect rounded-2xl p-6 sm:p-8 lg:p-10">
          {/* Progress Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                Question {currentQuestionIndex + 1}
              </h2>
              <div className="text-sm sm:text-base text-gray-600 mt-2 sm:mt-0">
                {currentQuestionIndex + 1} of {questions.length}
              </div>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="relative h-3 sm:h-4 w-full rounded-full bg-gray-200/50 backdrop-blur-sm overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 shadow-lg"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 text-right">{Math.round(progress)}% Complete</p>
          </div>

          {/* Question Card */}
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="glass-card rounded-xl p-4 sm:p-6 mb-6 sm:mb-8"
          >
            <p className="text-base sm:text-lg lg:text-xl text-gray-800 font-medium leading-relaxed">{currentQuestion.question}</p>
          </motion.div>

          {/* Options */}
          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
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
                  className={`w-full rounded-xl p-4 sm:p-5 text-left transition-all duration-300 transform ${
                    selectedAnswer === option
                      ? 'glass-button bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-800 ring-2 ring-blue-500/50 shadow-xl border-blue-200'
                      : 'glass-card bg-white/60 hover:bg-white/80 text-gray-700 hover:shadow-lg border-gray-200/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 transition-all duration-300 ${
                        selectedAnswer === option ? 'bg-blue-500 border-blue-500' : 'border-gray-400'
                      }`}
                    />
                    <span className="text-sm sm:text-base lg:text-lg font-medium">{option}</span>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <div className="text-gray-500 text-xs sm:text-sm">{selectedAnswer ? '✓ Answer selected' : 'Select an answer to continue'}</div>
            <motion.button
              whileHover={{ scale: selectedAnswer ? 1.05 : 1 }}
              whileTap={{ scale: selectedAnswer ? 0.95 : 1 }}
              onClick={handleNext}
              disabled={!selectedAnswer}
              className={`glass-button font-semibold py-3 px-6 sm:px-8 lg:px-10 rounded-full transition-all duration-300 ${
                selectedAnswer
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl cursor-pointer border-blue-300'
                  : 'bg-gray-200/50 text-gray-400 cursor-not-allowed border-gray-300'
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
