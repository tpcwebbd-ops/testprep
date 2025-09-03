/*
|-----------------------------------------
| Modal Content Component
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, September, 2025
|-----------------------------------------
*/
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const ModalContent = ({ content, onNext, onPrevious }: { content: string; nextFromModal: () => void; onPrevious: () => void; onNext: () => void }) => (
  <div className="w-full flex flex-col">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg bg-white p-6 shadow-lg"
      dangerouslySetInnerHTML={{ __html: content }}
    />
    <div className="flex w-auto items-center justify-end gap-2">
      <Button
        disabled
        onClick={onPrevious}
        className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
      >
        <ArrowLeft size={16} />
        Previous
      </Button>
      <Button onClick={onNext} className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600">
        Next
        <ArrowRight size={16} />
      </Button>
    </div>
  </div>
);

export default ModalContent;
