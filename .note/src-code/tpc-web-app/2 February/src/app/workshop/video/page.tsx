// app/video-management/page.tsx
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Video, Sparkles } from 'lucide-react';
import Admin from './Admin';
import Client from './Client';

const Page = () => {
  return (
    <main className="min-h-screen relative overflow-hidden bg-transparent">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM4ODg4ODgiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNGgydjJoLTJ2LTJ6bTAtNGgydjJoLTJ2LTJ6bTAtNGgydjJoLTJ2LTJ6bTAtNGgydjJoLTJ2LTJ6bTAtNGgydjJoLTJ2LTJ6bTAtNGgydjJoLTJ2LTJ6bTAtNGgydjJoLTJ2LTJ6bTAtNGgydjJoLTJ2LTJ6bS0yIDBoLTJ2Mmgydi0yem0tNCAwaC0ydjJoMnYtMnptLTQgMGgtMnYyaDJ2LTJ6bS00IDBoLTJ2Mmgydi0yem0tNCAwSDE0djJoMnYtMnptLTQgMGgtMnYyaDJ2LTJ6bS00IDBoLTJ2Mmgydi0yem0tNCAwSDZ2Mmgydi0yem0tNCAwSDJ2Mmgydi0yem0yOCAzMnYyaC0ydi0yaDJ6bTQgMHYyaC0ydi0yaDJ6bTQgMHYyaC0ydi0yaDJ6bTQgMHYyaC0ydi0yaDJ6bTQgMHYyaC0ydi0yaDJ6bTQgMHYyaC0ydi0yaDJ6bTQgMHYyaC0ydi0yaDJ6bTQgMHYyaC0ydi0yaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />

      <div className="container mx-auto py-12 px-4 relative z-10">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-transparent backdrop-blur-md border border-white/20 mb-4">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Video Management</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Video Management System
          </h1>
          <p className="text-gray-600 text-lg">Upload, manage, and share your videos seamlessly</p>
        </div>

        <Tabs defaultValue="admin" className="w-full max-w-6xl mx-auto">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-transparent backdrop-blur-md border border-white/20 p-1 rounded-2xl">
            <TabsTrigger
              value="admin"
              className="rounded-xl data-[state=active]:bg-transparent data-[state=active]:backdrop-blur-lg data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Upload className="h-4 w-4 mr-2" />
              Admin
            </TabsTrigger>
            <TabsTrigger
              value="client"
              className="rounded-xl data-[state=active]:bg-transparent data-[state=active]:backdrop-blur-lg data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Video className="h-4 w-4 mr-2" />
              Client
            </TabsTrigger>
          </TabsList>

          <TabsContent value="admin" className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Admin />
          </TabsContent>

          <TabsContent value="client" className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Client />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default Page;
