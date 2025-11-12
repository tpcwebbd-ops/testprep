/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: App Generator, November, 2025
|-----------------------------------------
*/
'use client';

import Image from 'next/image';

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
  const images: string[] = ['https://i.ibb.co.com/KpGnqS3D/nature.jpg', 'https://i.ibb.co.com/KpGnqS3D/nature.jpg'];
  return (
    <main className="min-h-screen bg-gradient-to-br pt-[75px] from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col items-center justify-center gap-3 overflow-hidden relative ">
          {images.map((img, index) => (
            <div className="p-8" key={index}>
              <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
                <div className="flex-shrink-0 w-full md:w-48 h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-sky-400/30">
                  {img ? (
                    <Image width={400} height={400} src={img} alt={img} className="w-full h-full object-cover" />
                  ) : (
                    <DefaultSVG className="w-full h-full" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Page;
