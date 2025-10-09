/*
|-----------------------------------------
| setting up BackToCourse for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, August, 2025
|-----------------------------------------
*/

'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const BackToCourse = () => {
  const handleBackToCourses = (): void => {
    window.location.href = '/course';
  };

  return (
    <main>
      <Button onClick={handleBackToCourses} className="inline-flex items-center space-x-2 text-white/80 hover:text-white mb-8 transition-colors duration-300">
        <ArrowRight className="w-5 h-5 rotate-180" />
        <span>Back to Courses</span>
      </Button>
    </main>
  );
};
export default BackToCourse;
