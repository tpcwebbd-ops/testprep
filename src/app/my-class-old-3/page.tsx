/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, September, 2025
|-----------------------------------------
*/
'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { isSameDay } from 'date-fns';

import CourseHeader from './course-header';
import { allCourseData, ClassItem } from './course-data';
import CoursePlaylist, { AttendanceRecord } from './course-playlist';
import VideoPlayer from './video-player';
import ModalContent from './modal-content';
import Quiz from './quiz';
import AttendancePrompt from './attendance-prompt';

const allLectures = allCourseData.flatMap(course => course.classList);

const Page = () => {
  const [phase, setPhase] = useState<'ATTENDANCE_PENDING' | 'LECTURE_IN_PROGRESS' | 'LECTURE_COMPLETED'>('ATTENDANCE_PENDING');
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [selectedContent, setSelectedContent] = useState<ClassItem | null>(null);
  const [unlockedLectures, setUnlockedLectures] = useState<ClassItem[]>([]);
  const [todaysLecture, setTodaysLecture] = useState<ClassItem | null>(null);

  useEffect(() => {
    // Load attendance from localStorage
    const savedAttendance = JSON.parse(localStorage.getItem('attendance') || '[]') as AttendanceRecord[];
    setAttendance(savedAttendance);

    const today = new Date();
    const todaysRecord = savedAttendance.find(record => isSameDay(new Date(record.date), today));

    if (todaysRecord) {
      // Attendance for today exists
      const savedPhase = (localStorage.getItem('todaysPhase') as typeof phase) || 'LECTURE_IN_PROGRESS';
      setPhase(savedPhase);

      const lecture = allLectures.find(l => l.id === todaysRecord.lectureId) || null;
      setTodaysLecture(lecture);
      setSelectedContent(lecture);
    }

    // Update unlocked lectures based on all attendance records
    const unlocked = allLectures.filter(lecture => savedAttendance.some(record => record.lectureId === lecture.id));
    console.log('allLectures ', allLectures);
    setUnlockedLectures(unlocked);
  }, []);

  const updateLocalStorage = (newAttendance: AttendanceRecord[], newPhase: typeof phase) => {
    localStorage.setItem('attendance', JSON.stringify(newAttendance));
    localStorage.setItem('todaysPhase', newPhase);
    setAttendance(newAttendance);
    setPhase(newPhase);
  };

  const handleAttendanceSubmit = () => {
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
      updateLocalStorage(newAttendance, 'LECTURE_IN_PROGRESS');
      setUnlockedLectures([...unlockedLectures, nextLecture]);
      setTodaysLecture(nextLecture);
      setSelectedContent(nextLecture);
    }
  };

  const handleLectureComplete = () => {
    updateLocalStorage(attendance, 'LECTURE_COMPLETED');
  };

  const handleNextLecture = () => {
    alert('You are ready for the next day! Please come back tomorrow to submit your attendance for the next lecture.');
    // In a real app, you might guide them to a dashboard or summary page.
  };

  const handleSelectContent = (content: ClassItem) => {
    setSelectedContent(content);
  };

  const handlePrevious = () => {
    if (!selectedContent) return;
    const currentIndex = unlockedLectures.findIndex(l => l.id === selectedContent.id);
    if (currentIndex > 0) {
      setSelectedContent(unlockedLectures[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (!selectedContent) return;
    const currentIndex = unlockedLectures.findIndex(l => l.id === selectedContent.id);
    if (currentIndex < unlockedLectures.length - 1) {
      setSelectedContent(unlockedLectures[currentIndex + 1]);
    } else if (phase !== 'LECTURE_COMPLETED') {
      handleLectureComplete();
    }
  };

  const nextFromModal = () => {
    console.log(' invoke from modal');
  };
  const afterfinishedQuiz = () => {
    console.log(' invoke from afterfinishedQuiz');
  };
  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <CourseHeader title="IELTS SPOKEN" />
        <div className="mt-8">
          {phase === 'ATTENDANCE_PENDING' ? (
            <AttendancePrompt onAttend={handleAttendanceSubmit} />
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  {selectedContent?.type === 'video' && selectedContent.videoUrl && (
                    <VideoPlayer videoUrl={selectedContent.videoUrl} onNext={handleNext} onPrevious={handlePrevious} />
                  )}
                  {selectedContent?.type === 'modal' && selectedContent.modelCentent && (
                    <ModalContent content={selectedContent.modelCentent} nextFromModal={nextFromModal} onNext={handleNext} onPrevious={handlePrevious} />
                  )}
                  {selectedContent?.type === 'Questions' && selectedContent.questionsData && (
                    <Quiz questions={selectedContent.questionsData} onNext={afterfinishedQuiz} />
                  )}
                </AnimatePresence>
              </div>
              <div className="lg:col-span-1">
                <CoursePlaylist
                  unlockedLectures={unlockedLectures}
                  todaysLecture={todaysLecture}
                  onSelectContent={handleSelectContent}
                  selectedContentId={selectedContent?.id || 0}
                  phase={phase}
                  attendance={attendance}
                  onNextLecture={handleNextLecture}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Page;
