// components/video-management/Admin.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadButton } from '@/lib/uploadthing';
import { Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVideoStore } from './store/useVideoStore';

const Admin = () => {
  const { uploadedVideos, addVideos, removeVideo, clearAllVideos } = useVideoStore();

  return (
    <div className="space-y-6">
      <Card className="bg-transparent backdrop-blur-md border-white/20 shadow-2xl overflow-hidden">
        <CardHeader className="relative">
          <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Upload Videos</CardTitle>
          <CardDescription className="text-gray-600">
            Upload MP4 video files to your library ({uploadedVideos.length} video{uploadedVideos.length !== 1 ? 's' : ''} uploaded)
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <div className="border-2 border-dashed border-purple-300/50 rounded-2xl p-12 bg-transparent backdrop-blur-sm hover:border-purple-400/70 transition-all duration-300 hover:shadow-xl">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="h-20 w-20 rounded-full bg-transparent backdrop-blur-lg border border-purple-500/30 flex items-center justify-center shadow-lg animate-pulse">
                <Upload className="h-10 w-10 text-purple-600" />
              </div>
              <UploadButton
                endpoint="videoUploader"
                onClientUploadComplete={res => {
                  if (res) {
                    const newVideos = res.map(file => ({
                      url: file.url,
                      name: file.name,
                      key: file.key,
                      uploadedAt: new Date().toISOString(),
                    }));
                    addVideos(newVideos);
                  }
                }}
                onUploadError={(error: Error) => {
                  alert(`Upload error: ${error.message}`);
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {uploadedVideos.length > 0 && (
        <Card className="bg-transparent backdrop-blur-md border-white/20 shadow-2xl overflow-hidden">
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Manage Videos</CardTitle>
                <CardDescription className="text-gray-600">Delete individual videos or clear all</CardDescription>
              </div>
              <Button
                variant="destructive"
                onClick={clearAllVideos}
                className="bg-transparent backdrop-blur-md border border-red-500/30 hover:border-red-600/50 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-3">
              {uploadedVideos.map((video, index) => (
                <div
                  key={video.key}
                  className="flex items-center justify-between p-4 bg-transparent backdrop-blur-md rounded-xl border border-white/20 hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-left"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-transparent backdrop-blur-lg border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                      <Upload className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{video.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(video.uploadedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeVideo(video.key)}
                    className="text-red-600 hover:text-red-700 hover:bg-transparent hover:backdrop-blur-sm"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Admin;
