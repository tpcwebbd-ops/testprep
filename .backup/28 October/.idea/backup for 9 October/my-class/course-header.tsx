'use client';

import { format } from 'date-fns';
import { useStore } from './store';

const CourseHeader = ({ title }: { title: string }) => {
  const time = useStore(state => state.time);

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
