import { create } from 'zustand';
import { isSameDay } from 'date-fns';
import { allCourseData, ClassItem } from './course-data';
import { AttendanceRecord } from './course-playlist';

const allLectures = allCourseData.flatMap(course => course.classList);

interface AppState {
  phase: 'ATTENDANCE_PENDING' | 'LECTURE_IN_PROGRESS' | 'LECTURE_COMPLETED';
  attendance: AttendanceRecord[];
  selectedContent: ClassItem | null;
  unlockedLectures: ClassItem[];
  todaysLecture: ClassItem | null;
  time: Date;
  setPhase: (phase: AppState['phase']) => void;
  setAttendance: (attendance: AttendanceRecord[]) => void;
  setSelectedContent: (content: ClassItem | null) => void;
  setUnlockedLectures: (lectures: ClassItem[]) => void;
  setTodaysLecture: (lecture: ClassItem | null) => void;
  initialize: () => void;
  updateLocalStorage: (newAttendance: AttendanceRecord[], newPhase: AppState['phase']) => void;
  handleAttendanceSubmit: () => void;
  handleLectureComplete: () => void;
  handleNextLecture: () => void;
  handleSelectContent: (content: ClassItem) => void;
  handlePrevious: () => void;
  handleNext: () => void;
  nextFromModal: () => void;
  afterfinishedQuiz: () => void;
  setTime: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  phase: 'ATTENDANCE_PENDING',
  attendance: [],
  selectedContent: null,
  unlockedLectures: [],
  todaysLecture: null,
  time: new Date(),

  setPhase: phase => set({ phase }),
  setAttendance: attendance => set({ attendance }),
  setSelectedContent: selectedContent => set({ selectedContent }),
  setUnlockedLectures: unlockedLectures => set({ unlockedLectures }),
  setTodaysLecture: todaysLecture => set({ todaysLecture }),

  initialize: () => {
    const savedAttendance = JSON.parse(localStorage.getItem('attendance') || '[]') as AttendanceRecord[];
    set({ attendance: savedAttendance });

    const today = new Date();
    const todaysRecord = savedAttendance.find(record => isSameDay(new Date(record.date), today));

    if (todaysRecord) {
      const savedPhase = (localStorage.getItem('todaysPhase') as AppState['phase']) || 'LECTURE_IN_PROGRESS';
      set({ phase: savedPhase });

      const lecture = allLectures.find(l => l.id === todaysRecord.lectureId) || null;
      set({ todaysLecture: lecture, selectedContent: lecture });
    }

    const unlocked = allLectures.filter(lecture => savedAttendance.some(record => record.lectureId === lecture.id));
    set({ unlockedLectures: unlocked });

    setInterval(() => get().setTime(), 1000);
  },

  updateLocalStorage: (newAttendance, newPhase) => {
    localStorage.setItem('attendance', JSON.stringify(newAttendance));
    localStorage.setItem('todaysPhase', newPhase);
    set({ attendance: newAttendance, phase: newPhase });
  },

  handleAttendanceSubmit: () => {
    const { attendance, unlockedLectures } = get();
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
      get().updateLocalStorage(newAttendance, 'LECTURE_IN_PROGRESS');
      set({
        unlockedLectures: [...unlockedLectures, nextLecture],
        todaysLecture: nextLecture,
        selectedContent: nextLecture,
      });
    }
  },

  handleLectureComplete: () => {
    get().updateLocalStorage(get().attendance, 'LECTURE_COMPLETED');
  },

  handleNextLecture: () => {
    alert('You are ready for the next day! Please come back tomorrow to submit your attendance for the next lecture.');
  },

  handleSelectContent: content => {
    set({ selectedContent: content });
  },

  handlePrevious: () => {
    const { selectedContent, unlockedLectures } = get();
    if (!selectedContent) return;
    const currentIndex = unlockedLectures.findIndex(l => l.id === selectedContent.id);
    if (currentIndex > 0) {
      set({ selectedContent: unlockedLectures[currentIndex - 1] });
    }
  },

  handleNext: () => {
    const { selectedContent, unlockedLectures, phase } = get();
    if (!selectedContent) return;
    const currentIndex = unlockedLectures.findIndex(l => l.id === selectedContent.id);
    if (currentIndex < unlockedLectures.length - 1) {
      set({ selectedContent: unlockedLectures[currentIndex + 1] });
    } else if (phase !== 'LECTURE_COMPLETED') {
      get().handleLectureComplete();
    }
  },

  nextFromModal: () => {
    console.log('invoke from modal');
  },

  afterfinishedQuiz: () => {
    console.log('invoke from afterfinishedQuiz');
  },

  setTime: () => {
    set({ time: new Date() });
  },
}));
