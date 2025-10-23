'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import type { AboutItem, ChildData } from './page';

// 🔹 Default SVG for missing images
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

// 🔹 Floating Shape (background animation)
const FloatingShape: React.FC<{ delay: number; duration: number; x: string; y: string }> = ({ delay, duration, x, y }) => (
  <div
    className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-sky-400/10 to-blue-500/10 blur-3xl animate-float"
    style={{
      left: x,
      top: y,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
    }}
  />
);

// 🔹 Modal
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  item: AboutItem | ChildData;
}> = ({ isOpen, onClose, item }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-sky-950 via-blue-900 to-sky-950 rounded-3xl shadow-2xl border-2 border-sky-400/40 animate-scaleIn"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-red-500/30 hover:bg-red-500/50 text-white transition-all duration-300 hover:scale-110 hover:rotate-90 border border-red-400/50"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="p-8">
          <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
            <div className="flex-shrink-0 w-full md:w-48 h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-sky-400/30">
              {item.image ? (
                <Image width={400} height={400} src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <DefaultSVG className="w-full h-full" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-300 mb-3">{item.name}</h2>
              <p className="text-sky-50 leading-relaxed">{item.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 🔹 Card Component
const AboutCard: React.FC<{ item: AboutItem; index: number }> = ({ item, index }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isEven = index % 2 === 0;

  return (
    <>
      <article
        className="group relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-sky-900/30 via-blue-900/20 to-sky-900/30 backdrop-blur-xl border-2 border-sky-400/30 hover:border-sky-400/60 transition-all duration-700 hover:shadow-2xl hover:shadow-sky-500/30 cursor-pointer animate-slideIn"
        style={{ animationDelay: `${index * 150}ms` }}
        onClick={() => setIsModalOpen(true)}
      >
        <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-0`}>
          <div className="relative w-full md:w-1/2 h-64 md:h-80 overflow-hidden">
            {item.image ? (
              <Image
                width={400}
                height={400}
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <DefaultSVG className="w-full h-full" />
            )}
          </div>
          <div className="relative z-10 w-full md:w-1/2 p-6 flex flex-col justify-center">
            <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-200 mb-3">{item.name}</h3>
            <p className="text-sky-100 leading-relaxed line-clamp-5">{item.description}</p>
          </div>
        </div>
      </article>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} item={item} />
    </>
  );
};

// 🔹 Main Client Component
export default function AboutClient({ aboutData }: { aboutData: AboutItem[] }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen py-10 px-4 bg-gradient-to-br from-slate-950 via-sky-950 to-blue-950 relative overflow-hidden">
      <FloatingShape delay={0} duration={20} x="10%" y="10%" />
      <FloatingShape delay={4} duration={25} x="80%" y="70%" />

      <section className="relative z-10 mx-auto max-w-7xl">
        <div className={`text-center mb-12 transition-all ${scrolled ? 'opacity-90 scale-98' : 'opacity-100 scale-100'}`}>
          <div className="inline-block mb-4 px-6 py-2 rounded-full bg-sky-500/20 border-2 border-sky-400/40">
            <span className="text-sky-300 text-sm font-bold uppercase tracking-wider">Welcome to TestPrep Centre</span>
          </div>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-200 to-sky-300">About TestPrep Centre</h1>
        </div>

        <div className="space-y-10">
          {aboutData.map((item, index) => (
            <AboutCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </section>
    </main>
  );
}
