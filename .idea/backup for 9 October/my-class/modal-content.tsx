import { motion } from 'framer-motion';
import { useStore } from './store';
import PreviousButton from './previous-button';
import NextButton from './next-button';

const ModalContent = () => {
  const selectedContent = useStore(state => state.selectedContent);
  const content = selectedContent?.modelCentent || '';

  return (
    <div className="flex w-full flex-col">
      <motion.div
        key={selectedContent?.id} // Key ensures re-animation on content change
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="rounded-lg bg-white p-6 shadow-lg"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <div className="flex w-auto items-center justify-end gap-2 pt-4">
        <PreviousButton />
        <NextButton />
      </div>
    </div>
  );
};

export default ModalContent;
