import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import PreviousButton from './previous-button';
import NextButton from './next-button';

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
      <PreviousButton />
      <NextButton />
    </div>
  </div>
);

export default ModalContent;
