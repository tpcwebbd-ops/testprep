'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadButton } from '@/lib/uploadthing';
import { Video, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadedVideo {
  url: string;
  name: string;
  key: string;
  uploadedAt: string;
}

const Page = () => {
  const [uploadedVideos, setUploadedVideos] = useState<UploadedVideo[]>([]);

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Video Management System</h1>

      <Tabs defaultValue="admin" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="admin">Admin</TabsTrigger>
          <TabsTrigger value="client">Client</TabsTrigger>
        </TabsList>

        <TabsContent value="admin" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Videos</CardTitle>
              <CardDescription>Upload MP4 video files</CardDescription>
            </CardHeader>
            <CardContent>
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
                    setUploadedVideos(prev => [...prev, ...newVideos]);
                  }
                }}
                onUploadError={(error: Error) => {
                  alert(`Upload error: ${error.message}`);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="client" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Videos</CardTitle>
              <CardDescription>View and play uploaded videos</CardDescription>
            </CardHeader>
            <CardContent>
              {uploadedVideos.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No videos uploaded yet</p>
              ) : (
                <div className="space-y-6">
                  {uploadedVideos.map(video => (
                    <div key={video.key} className="border rounded-lg overflow-hidden">
                      <video controls className="w-full aspect-video bg-black" src={video.url}>
                        Your browser does not support the video tag.
                      </video>
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Video className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{video.name}</p>
                            <p className="text-sm text-muted-foreground">{new Date(video.uploadedAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => window.open(video.url, '_blank')}>
                          <Play className="h-4 w-4 mr-2" />
                          Open
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Page;
