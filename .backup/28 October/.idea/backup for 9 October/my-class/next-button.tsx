'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useStore } from './store';

const NextButton = () => {
  const handleNext = useStore(state => state.handleNext);

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleNext}
      className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
    >
      Next
      <ArrowRight size={16} />
    </motion.button>
  );
};

export default NextButton;
