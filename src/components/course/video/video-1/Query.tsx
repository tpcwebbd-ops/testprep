// components/video/Query.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Calendar, Clock, Share2, MoreHorizontal, Maximize2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockVideo1 } from './data';

const Query = () => {
  const video = mockVideo1;

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-12 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-5xl"
      >
        <Card className="relative overflow-hidden bg-slate-900/40 border-slate-800/60 backdrop-blur-2xl group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-50" />

          <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-0">
            <div className="lg:col-span-3 relative aspect-video bg-black overflow-hidden group/player">
              <video
                src={video.url || 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                className="w-full h-full object-cover opacity-80 group-hover/player:opacity-100 transition-opacity duration-700"
                controls
              />
              <div className="absolute top-4 left-4 flex gap-2 pointer-events-none">
                <Badge className="bg-black/60 backdrop-blur-md border-white/10 text-white font-normal px-3 py-1">Live Preview</Badge>
              </div>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover/player:opacity-100 transition-opacity duration-300">
                <Button size="icon" variant="secondary" className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20">
                  <Maximize2 className="w-4 h-4 text-white" />
                </Button>
              </div>
            </div>

            <div className="lg:col-span-2 p-6 md:p-10 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                    <h2 className="text-3xl font-bold text-white tracking-tight mb-2">{video.name}</h2>
                    <div className="flex flex-wrap gap-3">
                      <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 flex gap-1.5 items-center">
                        <Clock className="w-3 h-3" /> {video.duration}s
                      </Badge>
                      <Badge variant="outline" className="border-slate-700 text-slate-400 flex gap-1.5 items-center">
                        <Calendar className="w-3 h-3" /> {new Date(video.startDate).toLocaleDateString()}
                      </Badge>
                    </div>
                  </motion.div>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/5">
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </div>

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-slate-400 leading-relaxed text-lg">
                  {video.description}
                </motion.p>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/50">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Release</p>
                    <p className="text-sm text-slate-300">{new Date(video.startDate).toDateString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Expires</p>
                    <p className="text-sm text-slate-300">{new Date(video.endDate).toDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 flex items-center gap-3">
                <Button className="flex-1 h-12 bg-white text-slate-950 hover:bg-indigo-50 font-bold rounded-xl transition-all shadow-xl shadow-white/5 active:scale-95">
                  <Play className="w-4 h-4 mr-2 fill-current" /> Watch Now
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-slate-800 hover:bg-white/5 text-slate-400">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="h-1 w-full bg-slate-900 rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 1, delay: 1 }}
                className="h-full w-full bg-gradient-to-r from-indigo-500 to-purple-500"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Query;
