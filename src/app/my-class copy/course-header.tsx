'use client';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

const CourseHeader = ({ title }: { title: string }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = format(time, 'eeee, MMMM do, yyyy');
  const formattedTime = format(time, 'h:mm:ss a');

  return (
    <div className="flex flex-col items-center justify-between rounded-lg bg-white p-4 shadow-md sm:flex-row">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <div className="mt-2 text-center text-sm text-gray-600 sm:mt-0 sm:text-right">
        <p>{formattedDate}</p>
        <p className="font-semibold text-blue-600">{formattedTime} (BST)</p>
      </div>
    </div>
  );
};

export default CourseHeader;
