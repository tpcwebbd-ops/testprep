
'use client';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const AttendanceComponent = ({ onAttend }: { onAttend: () => void }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = format(time, 'eeee, MMMM do, yyyy');
  const formattedTime = format(time, 'h:mm:ss a');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex h-[60vh] w-full flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-lg"
    >
      <h2 className="text-3xl font-bold text-gray-800">Welcome!</h2>
      <p className="mt-2 text-gray-600">Please submit your attendance to begin today&apos;s lecture.</p>
      <div className="my-6 text-center text-lg text-gray-700">
        <p>{formattedDate}</p>
        <p className="font-semibold text-blue-600">{formattedTime} (BST)</p>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAttend}
        className="transform rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-3 text-lg font-semibold text-white shadow-md transition-all hover:shadow-lg"
      >
        Submit Attendance
      </motion.button>
    </motion.div>
  );
};

export default AttendanceComponent;
