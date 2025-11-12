/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: App Generator, November, 2025
|-----------------------------------------
*/
'use client';

import { useState } from 'react';
import Image from 'next/image';
import ImageUploadManagerSingle from '@/components/dashboard-ui/ImageUploadManagerSingle';

const Page = () => {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const images: string[] = ['https://i.ibb.co/QF6535zc/asus.png', 'https://i.ibb.co/QF6535zc/asus.png'];
  return (
    <main className="min-h-screen bg-gradient-to-br pt-[75px] from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Image Upload Manager</h1>
          <p className="text-white/60">Select and manage your images</p>
        </div>

        <ImageUploadManagerSingle value={selectedImage} onChange={setSelectedImage} label="Featured Image" />

        {selectedImage && (
          <div className="w-full rounded-xl p-6 bg-white/5 backdrop-blur-md border border-white/20 shadow-inner space-y-4">
            <h2 className="text-xl font-semibold text-white/90">Selected Image Preview</h2>

            <div className="relative w-full h-96 rounded-xl overflow-hidden bg-white/10 border border-white/10 shadow-lg">
              <Image src={selectedImage} alt="Selected preview" fill className="object-contain" />
            </div>

            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-sm text-white/60 mb-2">Image URL:</p>
              <p className="text-white/90 break-all font-mono text-xs">{selectedImage}</p>
            </div>
          </div>
        )}

        {!selectedImage && (
          <div className="w-full rounded-xl p-12 bg-white/5 backdrop-blur-md border border-white/20 border-dashed">
            <div className="text-center space-y-2">
              <p className="text-white/60 text-lg">No image selected</p>
              <p className="text-white/40 text-sm">Click &quot;Add Image&quot; above to get started</p>
            </div>
          </div>
        )}
        <div className=" flex flex-col items-center justify-center gap-3 overflow-hidden">
          {images.map(img => (
            <div className="h-[60px] w-4xl border" key={img}>
              <Image src={img} width={1200} height={1200} alt="The Main person" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Page;
