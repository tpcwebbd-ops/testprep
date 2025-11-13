/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: App Generator, November, 2025
|-----------------------------------------
*/
'use client';

import ImageUploadManagerSingle from '@/components/dashboard-ui/ImageUploadManagerSingle';
import Image from 'next/image';
import { useState } from 'react';

const DefaultSVG: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0ea5e9" />
      </linearGradient>
    </defs>
    <rect width="200" height="200" rx="24" fill="url(#grad1)" opacity="0.2" />
    <circle cx="100" cy="100" r="60" fill="none" stroke="#38bdf8" strokeWidth="3" opacity="0.6" />
    <circle cx="100" cy="100" r="40" fill="none" stroke="#0ea5e9" strokeWidth="2" opacity="0.8" />
  </svg>
);

const Page = () => {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const images: string[] = ['https://i.ibb.co.com/PGXYXwTq/img.jpg', 'https://i.ibb.co.com/KpGnqS3D/nature.jpg', 'https://i.ibb.co/ynTn8rt0/images.jpg'];
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
        {/* <div className="flex flex-col items-center justify-center gap-3 overflow-hidden relative ">
          {images.map((img, index) => (
            <div className="p-8" key={index}>
              <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
                <div className="flex-shrink-0 w-[1200px] h-[1400px] rounded-2xl overflow-hidden shadow-2xl border-4 border-sky-400/30">
                  {img ? (
                    <Image width={1400} height={1400} src={img} alt={img} className="w-full h-full object-cover" />
                  ) : (
                    <DefaultSVG className="w-full h-full" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </main>
  );
};

export default Page;
