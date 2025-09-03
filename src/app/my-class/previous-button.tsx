'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useStore } from './store';

const PreviousButton = () => {
  const handlePrevious = useStore(state => state.handlePrevious);

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handlePrevious}
      className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
    >
      <ArrowLeft size={16} />
      Previous
    </motion.button>
  );
};

export default PreviousButton;
