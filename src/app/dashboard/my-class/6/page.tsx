'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, CheckCircle } from 'lucide-react';

const videoList = [
  { id: 1, title: 'Introduction to IELTS', url: 'https://www.youtube.com/embed/Ug2msKmnVW4?si=gQ8a9AerBS79puvm' },
  { id: 2, title: 'IELTS Speaking Tips', url: 'https://www.youtube.com/embed/WHg2Jz9z6-c?si=gQ8a9AerBS79puvm' },
  { id: 3, title: 'Listening Practice Test', url: 'https://www.youtube.com/embed/M8Rzp2gzKX8?si=gQ8a9AerBS79puvm' },
  { id: 4, title: 'Writing Task 2 Guide', url: 'https://www.youtube.com/embed/vGYa1QH6fQw?si=gQ8a9AerBS79puvm' },
  { id: 5, title: 'Reading Skills Explained', url: 'https://www.youtube.com/embed/x1pHH3S7xz4?si=gQ8a9AerBS79puvm' },
];

const lecture = [
  {id:1, title: "Introduction to IELTS", contentType: "video", url: "https://www.youtube.com/embed/Ug2msKmnVW4?si=gQ8a9AerBS79puvm"}, 
  {id:2, title: "Your Task", contentType: "pdf", url: "https://www.youtube.com/embed/Ug2msKmnVW4?si=gQ8a9AerBS79puvm"}
]

export default function ClassRoomPage() {
  const [selectedVideo, setSelectedVideo] = useState(videoList[0]);
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    alert('🎉 Congratulations! You completed this class.');
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row gap-6 p-6 bg-gradient-to-br from-indigo-900 via-blue-900 to-black text-white">
      {/* Left: Video Player */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 p-4 shadow-lg"
      >
        <div className="relative w-full aspect-video rounded-xl overflow-hidden">
          <iframe
            src={selectedVideo.url}
            title={selectedVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="w-full h-full rounded-xl"
          ></iframe>
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-wide text-center md:text-left">{selectedVideo.title}</h2>
      </motion.div>

      {/* Right: Video List */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="w-full md:w-80 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 p-4 flex flex-col justify-between shadow-lg"
      >
        <div>
          <h3 className="text-xl font-semibold mb-4 text-center md:text-left">Todays Class</h3>

          <div className="space-y-2 overflow-y-auto max-h-[60vh] pr-2 scrollbar-thin scrollbar-thumb-white/20">
            {videoList.map(video => (
              <motion.div
                key={video.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedVideo(video)}
                className={`flex items-center gap-3 cursor-pointer rounded-xl px-3 py-2 transition-all ${
                  selectedVideo.id === video.id
                    ? 'bg-blue-500/30 border border-blue-400/50 shadow-md shadow-blue-500/30'
                    : 'hover:bg-white/10 border border-transparent'
                }`}
              >
                <PlayCircle className="w-5 h-5 text-blue-300" />
                <p className="text-sm truncate">{video.title}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Complete Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleComplete}
          disabled={completed}
          className={`mt-6 w-full py-3 rounded-xl font-medium text-lg transition-all ${
            completed
              ? 'bg-green-600/30 text-green-300 border border-green-400/40 cursor-not-allowed'
              : 'bg-blue-600/40 hover:bg-blue-600/60 border border-blue-400/40'
          }`}
        >
          {completed ? (
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" /> Completed
            </div>
          ) : (
            'Mark as Complete'
          )}
        </motion.button>
      </motion.div>
    </main>
  );
}
