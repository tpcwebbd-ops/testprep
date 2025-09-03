/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, September, 2025
|-----------------------------------------
*/
'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import CourseHeader from './course-header';
import { courseData } from './course-data';
import CoursePlaylist from './course-playlist';
import VideoPlayer from './video-player';
import ModalContent from './modal-content';
import Quiz from './quiz';

export type ClassItem = {
  id: number;
  title: string;
  duration: string;
  modelCentent?: string;
  videoUrl?: string;
  questionsData?: Question[];
  type: 'modal' | 'video' | 'Questions';
};

export type Question = {
  id: number;
  question: string;
  options: string[];
  answer: string;
};

const Page = () => {
  const [selectedContent, setSelectedContent] = useState<ClassItem>(
    courseData[0].classList[1], // Default to the first video
  );

  const handleSelectContent = (content: ClassItem) => {
    setSelectedContent(content);
  };

  const onPrevious = () => {};
  const onNext = () => { };
  
  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <CourseHeader title="IELTS SPOKEN" />
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selectedContent.type === 'video' && selectedContent.videoUrl && (
                <VideoPlayer videoUrl={selectedContent.videoUrl} onNext={onNext} onPrevious={onPrevious} />
              )}
              {selectedContent.type === 'modal' && selectedContent.modelCentent && <ModalContent content={selectedContent.modelCentent} />}
              {selectedContent.type === 'Questions' && selectedContent.questionsData && <Quiz questions={selectedContent.questionsData} />}
            </AnimatePresence>
          </div>
          <div className="lg:col-span-1">
            <CoursePlaylist courseData={courseData} onSelectContent={handleSelectContent} selectedContentId={selectedContent.id} />
          </div>
        </div>
      </div>
    </main>
  );
};
export default Page;
