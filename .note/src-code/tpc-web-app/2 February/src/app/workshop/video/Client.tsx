// components/video-management/Client.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Video } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import { useVideoStore } from './store/useVideoStore';
import { UploadedVideo } from './store/type';

const Client = () => {
  const { uploadedVideos } = useVideoStore();
  const [selectedVideo, setSelectedVideo] = useState<UploadedVideo | null>(null);

  return (
    <Card className="bg-transparent backdrop-blur-md border-white/20 shadow-2xl overflow-hidden">
      <CardHeader className="relative">
        <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">Uploaded Videos</CardTitle>
        <CardDescription className="text-gray-600">View and play your video collection</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        {uploadedVideos.length === 0 ? (
          <div className="text-center py-16">
            <div className="h-24 w-24 rounded-full bg-transparent backdrop-blur-lg border border-gray-400/30 flex items-center justify-center mx-auto mb-4 opacity-50">
              <Video className="h-12 w-12 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No videos uploaded yet</p>
            <p className="text-gray-400 text-sm mt-2">Upload your first video to get started</p>
          </div>
        ) : (
          <div className="space-y-6">
            {selectedVideo && (
              <div className="mb-8">
                <VideoPlayer video={selectedVideo} onBack={() => setSelectedVideo(null)} />
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {uploadedVideos.map((video, index) => (
                <button
                  key={video.key}
                  onClick={() => setSelectedVideo(video)}
                  className="group relative bg-transparent backdrop-blur-md rounded-xl overflow-hidden border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 text-left"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative aspect-video bg-transparent backdrop-blur-sm overflow-hidden">
                    <video className="w-full h-full object-cover" src={video.url} preload="metadata" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full bg-transparent backdrop-blur-md border border-white/30 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-xl">
                        <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-purple-600 border-b-8 border-b-transparent ml-1" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-transparent backdrop-blur-lg border border-purple-500/30 flex items-center justify-center flex-shrink-0 shadow-md">
                        <Video className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate group-hover:text-purple-600 transition-colors">{video.name}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(video.uploadedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Client;
