/*
|-----------------------------------------
| Video Player Component
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, September, 2025
|-----------------------------------------
*/
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, AlertTriangle, Maximize, Minimize } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface VideoPlayerProps {
  videoUrl: string;
  onPrevious: () => void;
  onNext: () => void;
}

const WarningContent = () => (
  <>
    <p className="mb-4">
      TestPrep এর সাথে সম্পৃক্ত যেকোনো ভিডিও, টেক্সট বা কনটেন্ট অন্য কারো সঙ্গে অর্থের বিনিময়ে বা বিনামূল্যে আদান-প্রদান বা শেয়ার করা, কারও সাথে ইমেইল-একাউন্ট
      পাসওয়ার্ড শেয়ার করা আইনত দন্ডনীয় অপরাধ। এজন্য অন্তত ৫ বছর থেকে শুরু করে সর্বোচ্চ ১৪ বছরের জেল হতে পারে। শুধু তাই না, একই সাথে ৫ লাখ টাকা থেকে শুরু করে
      সর্বোচ্চ ৫০ লাখ টাকা জরিমানাও গুনতে হতে পারে।
    </p>
    <p className="mb-4">
      সাইবার সিকিউরিটি কেইসে কাউকে গ্রেফতার করার জন্য কোনো মামলার প্রয়োজন হয় না। এমনকি কোনো ওয়ারেন্টও ইস্যু করতে হয় না। সরাসরি গ্রেফতার করে হাজতে নিয়ে যাওয়া হয়।
      সুতরাং সামান্য কিছু টাকার জন্য দুই নাম্বারি করতে গিয়ে কত বছর জেলে থাকতে হবে, সেটাও একবার ভালো করে হিসাব করে নিও!!
    </p>
    <p className="mb-4">
      অন্য নামে একাউন্ট খুলে অথবা ফেইসবুকে ফেইক একাউন্ট করে অথবা ইনকগনিটো মুডে একাউন্ট খুললে তোমাকে ট্র‍্যাক করা যাবে না। এমনটা যদি ভেবে থাকো তাহলে তুমি বোকার
      স্বর্গে বাস করছো। তোমার ISP, তোমার IP এড্রেস, তোমার ফোন এর প্রত্যেকটা কল, প্রত্যেকটা মেসেজ রেকর্ড থাকে। শুধু সেটাই না, ফেইসবুক, জিমেইল, গুগোল সরকারের
      সাইবার ক্রাইম টিম কে যেকোনো ডিলিটেড তথ্য সাথে সাথে প্রোভাইড করা হয়ে থাকে। এছাড়াও তোমার একাউন্ট কোন আইপি এড্রেস থেকে লগইন করা হয়েছে বা কোন জায়গা লগইন করা
      হয়েছে সেটাও আমাদের সার্ভারে আছে। সুতরাং একটু চেষ্টা করলেই, ২৪ ঘন্টার মধ্যে তোমাকে ধরে ফেলার ফেলার ক্ষমতা সাইবার ক্রিমিনাল ডিপার্টমেন্ট রাখে।
    </p>
    <p className="mb-4">
      আমরা অনেকদিন ধরে চিন্তা করছি দুই-একজনকে কোর্স চুরি করে বিক্রি করার জন্য দৃষ্টান্তমূলক শাস্তি দিব। যেন দেশের অন্য সবাই সেটা দেখে সতর্ক হয়ে যায়। সুতরাং,
      তুমি যদি নিজেকে ১৫ বছর জেলের ভিতরে দেখতে না চাও, তাহলে আমাদের কোর্স এর ভিডিও ডাউনলোড করে কারো সাথে অর্থের বিনিময়ে বা বিনামূল্যে দেয়া থেকে বিরত থাকো। তোমার
      ভাব-মূর্তি এবং তোমার ফ্যামিলি&apos;র কথা চিন্তা করো।
    </p>
    <p>একবার ফেঁসে গেলে কিন্তু কেউ তোমাকে বাঁচাতে আসবে না।</p>
  </>
);

const VideoPlayer = ({ videoUrl, onPrevious, onNext }: VideoPlayerProps) => {
  const [popup, setPopup] = useState({ visible: false, top: '50%', left: '50%' });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Effect for the email popup
  useEffect(() => {
    const interval = setInterval(() => {
      const top = `${Math.random() * 80 + 10}%`;
      const left = `${Math.random() * 80 + 10}%`;
      setPopup({ visible: true, top, left });
      setTimeout(() => setPopup(prev => ({ ...prev, visible: false })), 1500);
    }, 5000);
    return () => clearInterval(interval);
  }, [videoUrl]);

  // Effect to handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullScreen = () => {
    if (!playerContainerRef.current) return;

    if (!isFullscreen) {
      playerContainerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full rounded-lg bg-slate-100 p-4">
      <div ref={playerContainerRef} className="relative aspect-video bg-black">
        <iframe
          width="100%"
          height="100%"
          src={videoUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          className="rounded-lg shadow-2xl"
        ></iframe>
        <AnimatePresence>
          {popup.visible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              style={{ top: popup.top, left: popup.left }}
              className="pointer-events-none absolute z-10 text-[8px] font-bold text-red-500"
            >
              toufiquer.0@gmail.com
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={toggleFullScreen}
          className="absolute bottom-2 right-2 z-10 flex items-center gap-2 rounded-lg  px-3 py-1 text-white transition-colors hover:bg-opacity-75"
        >
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>
      </div>

      <div className="mt-4 flex w-full items-center justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600">
              <AlertTriangle size={16} />
              Caution
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Warning</DialogTitle>
              <DialogDescription>Please read the following carefully.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              <WarningContent />
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <div className="flex w-auto items-center justify-end gap-2">
          <button onClick={onPrevious} className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300">
            <ArrowLeft size={16} />
            Previous
          </button>
          <button onClick={onNext} className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600">
            Next
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoPlayer;
