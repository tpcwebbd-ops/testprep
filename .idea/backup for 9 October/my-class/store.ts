import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { isSameDay } from 'date-fns';
import { allCourseData, ClassItem } from './course-data';

// Define types that were previously component-specific
export interface AttendanceRecord {
  id: number;
  date: string;
  lectureId: number;
  lectureTitle: string;
}

type UserAnswer = {
  questionId: number;
  selectedOption: string;
  correctAnswer: string;
  isCorrect: boolean;
};

// Define the shape of your store's state and actions
interface AppState {
  // Core App State
  phase: 'ATTENDANCE_PENDING' | 'LECTURE_IN_PROGRESS' | 'LECTURE_COMPLETED';
  attendance: AttendanceRecord[];
  selectedContent: ClassItem | null;
  unlockedLectures: ClassItem[];
  todaysLecture: ClassItem | null;
  time: Date;

  // Quiz State
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  userAnswers: UserAnswer[];
  isQuizCompleted: boolean;

  // Actions
  initialize: () => void;
  handleAttendanceSubmit: () => void;
  handleLectureComplete: () => void;
  handleNextLecture: () => void;
  handleSelectContent: (content: ClassItem) => void;
  handlePrevious: () => void;
  handleNext: () => void;
  nextQuestion: () => void;
  selectAnswer: (answer: string) => void;
  resetQuiz: () => void;
}

const allLectures = allCourseData.flatMap(course => course.classList);

export const useStore = create<AppState>()(
  devtools((set, get) => ({
    // Initial State
    phase: 'ATTENDANCE_PENDING',
    attendance: [],
    selectedContent: null,
    unlockedLectures: [],
    todaysLecture: null,
    time: new Date(),
    currentQuestionIndex: 0,
    selectedAnswer: null,
    userAnswers: [],
    isQuizCompleted: false,

    // Actions
    selectAnswer: answer => set({ selectedAnswer: answer }),

    initialize: () => {
      const savedAttendance = JSON.parse(localStorage.getItem('attendance') || '[]') as AttendanceRecord[];
      const today = new Date();
      const todaysRecord = savedAttendance.find(record => isSameDay(new Date(record.date), today));

      if (todaysRecord) {
        const savedPhase = (localStorage.getItem('todaysPhase') as AppState['phase']) || 'LECTURE_IN_PROGRESS';
        const lecture = allLectures.find(l => l.id === todaysRecord.lectureId) || null;
        set({
          phase: savedPhase,
          todaysLecture: lecture,
          selectedContent: lecture,
        });
      }

      const unlocked = allLectures.filter(lecture => savedAttendance.some(record => record.lectureId === lecture.id));
      set({ attendance: savedAttendance, unlockedLectures: unlocked });

      // Set up the timer
      const timer = setInterval(() => set({ time: new Date() }), 1000);
      return () => clearInterval(timer);
    },

    handleAttendanceSubmit: () => {
      const { attendance } = get();
      const nextLectureIndex = attendance.length;
      if (nextLectureIndex < allLectures.length) {
        const nextLecture = allLectures[nextLectureIndex];
        const newRecord: AttendanceRecord = {
          id: attendance.length + 1,
          date: new Date().toISOString(),
          lectureId: nextLecture.id,
          lectureTitle: nextLecture.title,
        };
        const newAttendance = [...attendance, newRecord];
        localStorage.setItem('attendance', JSON.stringify(newAttendance));
        localStorage.setItem('todaysPhase', 'LECTURE_IN_PROGRESS');
        set(state => ({
          attendance: newAttendance,
          phase: 'LECTURE_IN_PROGRESS',
          unlockedLectures: [...state.unlockedLectures, nextLecture],
          todaysLecture: nextLecture,
          selectedContent: nextLecture,
        }));
      }
    },

    handleLectureComplete: () => {
      localStorage.setItem('todaysPhase', 'LECTURE_COMPLETED');
      set({ phase: 'LECTURE_COMPLETED' });
    },

    handleNextLecture: () => {
      alert('You are ready for the next day! Please come back tomorrow to submit your attendance for the next lecture.');
    },

    handleSelectContent: content => set({ selectedContent: content }),

    handlePrevious: () => {
      const { selectedContent, unlockedLectures } = get();
      if (!selectedContent) return;
      const currentIndex = unlockedLectures.findIndex(l => l.id === selectedContent.id);
      if (currentIndex > 0) {
        set({ selectedContent: unlockedLectures[currentIndex - 1] });
      }
    },

    handleNext: () => {
      const { selectedContent, unlockedLectures, phase, handleLectureComplete } = get();
      if (!selectedContent) return;
      const currentIndex = unlockedLectures.findIndex(l => l.id === selectedContent.id);
      if (currentIndex < unlockedLectures.length - 1) {
        set({ selectedContent: unlockedLectures[currentIndex + 1] });
      } else if (phase !== 'LECTURE_COMPLETED') {
        handleLectureComplete();
      }
    },

    nextQuestion: () => {
      const { selectedAnswer, selectedContent, currentQuestionIndex, userAnswers, handleLectureComplete } = get();
      if (selectedAnswer === null || !selectedContent?.questionsData) return;

      const currentQuestion = selectedContent.questionsData[currentQuestionIndex];
      const newUserAnswers = [
        ...userAnswers,
        {
          questionId: currentQuestion.id,
          selectedOption: selectedAnswer,
          correctAnswer: currentQuestion.answer,
          isCorrect: selectedAnswer === currentQuestion.answer,
        },
      ];

      if (currentQuestionIndex < selectedContent.questionsData.length - 1) {
        set({
          userAnswers: newUserAnswers,
          selectedAnswer: null,
          currentQuestionIndex: currentQuestionIndex + 1,
        });
      } else {
        set({
          userAnswers: newUserAnswers,
          selectedAnswer: null,
          isQuizCompleted: true,
        });
        handleLectureComplete(); // Mark lecture as complete after the quiz
      }
    },

    resetQuiz: () =>
      set({
        currentQuestionIndex: 0,
        selectedAnswer: null,
        userAnswers: [],
        isQuizCompleted: false,
      }),
  })),
);
