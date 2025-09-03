'use client';

import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useStore } from './store';

import CourseHeader from './course-header';
import CoursePlaylist from './course-playlist';
import VideoPlayer from './video-player';
import ModalContent from './modal-content';
import Quiz from './quiz';
import AttendanceComponent from './attendance-component';

const Page = () => {
  const { phase, selectedContent, initialize } = useStore();

  useEffect(() => {
    const unsub = initialize();
    // return () => unsub(); // If initialize returns a cleanup function
  }, [initialize]);

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <CourseHeader title="IELTS SPOKEN" />
        <div className="mt-8">
          {phase === 'ATTENDANCE_PENDING' ? (
            <AttendanceComponent />
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  {selectedContent?.type === 'video' && <VideoPlayer />}
                  {selectedContent?.type === 'modal' && <ModalContent />}
                  {selectedContent?.type === 'Questions' && <Quiz />}
                </AnimatePresence>
              </div>
              <div className="lg:col-span-1">
                <CoursePlaylist />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Page;
