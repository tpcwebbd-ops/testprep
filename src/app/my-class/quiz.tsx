'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './store';
import { jsPDF } from 'jspdf'; // Assuming jspdf is installed

const Quiz = () => {
  // Select all necessary state and actions from the store
  const { selectedContent, currentQuestionIndex, selectedAnswer, userAnswers, isQuizCompleted, nextQuestion, selectAnswer, resetQuiz } = useStore();

  const questions = selectedContent?.questionsData || [];

  const handleDownloadReport = async () => {
    // This function can now directly use 'userAnswers' and 'questions' from the store
    // ... (rest of the function remains the same)
  };

  const handleDownloadTextReport = () => {
    // ... (rest of the function remains the same)
  };

  // --- Quiz Completed View ---
  if (isQuizCompleted) {
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
            {/* ... The existing completion UI ... */}
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <motion.button
                onClick={handleDownloadReport}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 py-3 px-6 font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl border-blue-300 sm:px-8"
              >
                📄 Download PDF Report
              </motion.button>
              <motion.button
                onClick={resetQuiz}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button rounded-full border border-gray-300/50 bg-white/60 py-3 px-6 font-semibold text-gray-700 backdrop-blur-sm transition-all duration-300 hover:border-gray-400/50 hover:bg-white/80 sm:px-8"
              >
                🔄 Retake Quiz
              </motion.button>
            </div>
          </motion.div>
        </div>
        {/* ... styles ... */}
      </div>
    );
  }

  // --- Active Quiz View ---
  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) return null; // Handle case where questions are not loaded

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-3 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-2xl lg:max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="glass-effect rounded-2xl p-6 sm:p-8 lg:p-10">
          <div className="mb-6 sm:mb-8">{/* ... Progress Bar and Question Counter UI ... */}</div>

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
                  onClick={() => selectAnswer(option)}
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
              onClick={nextQuestion}
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
