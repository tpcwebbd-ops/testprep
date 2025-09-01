/*
|-----------------------------------------
| Modal Content Component
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, September, 2025
|-----------------------------------------
*/
import { motion } from 'framer-motion';

const ModalContent = ({ content }: { content: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.3 }}
    className="rounded-lg bg-white p-6 shadow-lg"
    dangerouslySetInnerHTML={{ __html: content }}
  />
);

export default ModalContent;
