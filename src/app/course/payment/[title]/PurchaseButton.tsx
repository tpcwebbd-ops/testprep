/*
|-----------------------------------------
| setting up PurchaseButton for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, August, 2025
|-----------------------------------------
*/

'use client';

import { ShoppingCart } from 'lucide-react';
import { Course } from './page';
import { Button } from '@/components/ui/button';

const PurchaseButton = ({ course }: { course: Course }) => {
  const handlePurchase = (): void => {
    window.location.href = `/course/payment/${course.courseName}`;
  };

  return (
    <main>
      <Button
        onClick={handlePurchase}
        disabled={!course.enrolmentStatus}
        className={`w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
          course.enrolmentStatus
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        type="button"
      >
        <ShoppingCart className="w-6 h-6" />
        <span>{course.enrolmentStatus ? 'Enroll Now' : 'Enrollment Closed'}</span>
      </Button>
    </main>
  );
};
export default PurchaseButton;
