'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

interface IData {
  sectionUid: string;
  name: string;
  image: string;
  University: string;
  subject: string;
  description: string;
}

const data: IData[] = [
  {
    sectionUid: 'uuid-001',
    name: 'Jaswanth Vishnumolakala',
    image: 'https://i.ibb.co.com/KpGnqS3D/nature.jpg',
    University: 'University of Buckingham',
    subject: 'BSc Computing (AI & Robotics)',
    description:
      "Jaswanth achieved a First Class Bachelor's degree. His time at the university was transformative, fostering both personal and professional growth.",
  },
  {
    sectionUid: 'uuid-002',
    name: 'Sarah Jenkins',
    image: 'https://i.ibb.co.com/KpGnqS3D/nature.jpg',
    University: 'Stanford University',
    subject: 'MSc Computer Science',
    description:
      'Sarah led the Google Developer Student Club and published three research papers on Machine Learning. She is now working as a Lead AI Researcher at OpenAI.',
  },
  {
    sectionUid: 'uuid-003',
    name: 'Michael Chen',
    image: 'https://i.ibb.co.com/KpGnqS3D/nature.jpg',
    University: 'MIT',
    subject: 'BEng Electrical Engineering',
    description:
      'Michael developed a patent-pending solar technology during his junior year. His dedication to sustainable energy has earned him the Green Tech Innovator Award.',
  },
  {
    sectionUid: 'uuid-004',
    name: 'Emily Rodriguez',
    image: 'https://i.ibb.co.com/KpGnqS3D/nature.jpg',
    University: 'University of Oxford',
    subject: 'BA Philosophy & Economics',
    description:
      'Graduating with honors, Emily was an active member of the debate society. She has since launched a non-profit organization focused on economic literacy for youth.',
  },
  {
    sectionUid: 'uuid-005',
    name: 'David Okonjo',
    image: 'https://i.ibb.co.com/KpGnqS3D/nature.jpg',
    University: 'Imperial College London',
    subject: 'MSc Biotechnology',
    description:
      "David's thesis on CRISPR gene editing was published in Nature. He credits the state-of-the-art labs at Imperial for accelerating his career in biotech.",
  },
  {
    sectionUid: 'uuid-006',
    name: 'Priya Patel',
    image: 'https://i.ibb.co.com/KpGnqS3D/nature.jpg',
    University: 'National University of Singapore',
    subject: 'BArch Architecture',
    description:
      'Priya won the International Sustainable Design competition. Her architectural designs blend modern aesthetics with traditional eco-friendly materials.',
  },
  {
    sectionUid: 'uuid-007',
    name: 'James Wilson',
    image: 'https://i.ibb.co.com/KpGnqS3D/nature.jpg',
    University: 'University of Melbourne',
    subject: 'BSc Marine Biology',
    description:
      'Spending months on the Great Barrier Reef, James conducted critical research on coral bleaching. He is now a leading advocate for ocean conservation.',
  },
  {
    sectionUid: 'uuid-008',
    name: 'Anita Singh',
    image: 'https://i.ibb.co.com/KpGnqS3D/nature.jpg',
    University: 'University of Toronto',
    subject: 'MBA Finance',
    description:
      'Anita finished top of her class and secured a position at a major investment bank. She mentors young women aiming for leadership roles in finance.',
  },
  {
    sectionUid: 'uuid-009',
    name: 'Robert Fox',
    image: 'https://i.ibb.co.com/KpGnqS3D/nature.jpg',
    University: 'ETH Zurich',
    subject: 'MSc Physics',
    description:
      "Robert's work on quantum entanglement theory has been cited over 500 times. He is currently pursuing his PhD and teaching undergraduate physics.",
  },
  {
    sectionUid: 'uuid-010',
    name: 'Sophie Dubois',
    image: 'https://i.ibb.co.com/KpGnqS3D/nature.jpg',
    University: 'Sorbonne University',
    subject: 'BA Art History',
    description:
      'Sophie curated a successful exhibition on Renaissance art during her final year. She now works with the Louvre Museum in Paris as an associate curator.',
  },
];

const SnakeLine = ({ count, viewportHeight }: { count: number; viewportHeight: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const totalHeight = count * viewportHeight;

  const generateReelPath = () => {
    const width = 200;
    const center = width / 2;
    const amplitude = 80;

    let d = `M ${center} 0`;

    for (let i = 0; i < count; i++) {
      const boxTop = i * viewportHeight;
      const boxCenter = boxTop + viewportHeight / 2;

      if (i === 0) {
        d = `M ${center} ${boxCenter}`;
      } else {
        const prevBoxCenter = (i - 1) * viewportHeight + viewportHeight / 2;
        const direction = i % 2 === 0 ? 1 : -1;
        const controlX = center + amplitude * direction;

        d += ` C ${controlX} ${prevBoxCenter + viewportHeight / 2}, 
                  ${controlX} ${boxCenter - viewportHeight / 2}, 
                  ${center} ${boxCenter}`;
      }
    }
    d += ` L ${center} ${totalHeight}`;
    return d;
  };

  const pathString = generateReelPath();

  return (
    <div ref={containerRef} className="absolute left-1/2 top-0 -translate-x-1/2 w-[200px] h-full hidden md:block z-0 pointer-events-none">
      <svg className="w-full h-full overflow-visible" viewBox={`0 0 200 ${totalHeight}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="neonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.2" />
            <stop offset="20%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#d946ef" />
            <stop offset="80%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path d={pathString} fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="4" strokeLinecap="round" />

        <motion.path
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
          d={pathString}
          fill="none"
          stroke="url(#neonGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeOpacity="0.5"
          filter="url(#glow)"
        />

        <motion.path
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
          d={pathString}
          fill="none"
          stroke="url(#neonGradient)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

const ReelStory = ({ item, index }: { item: IData; index: number }) => {
  const isEven = index % 2 === 0;
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5, once: false });

  return (
    <section ref={ref} className="h-screen w-full snap-center snap-always flex items-center justify-center relative overflow-hidden">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-30 pointer-events-none">
        <motion.div
          animate={isInView ? { scale: [1, 1.5, 1], opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative"
        >
          <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)] z-20 relative" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-indigo-400 animate-ping opacity-50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-indigo-500/20 blur-xl" />
        </motion.div>
      </div>

      <div
        className={`w-full max-w-7xl mx-auto px-4 md:px-12 flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center justify-between h-full`}
      >
        <div className={`w-full md:w-[45%] h-full flex items-center justify-center ${isEven ? 'md:justify-end md:pr-16' : 'md:justify-start md:pl-16'}`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: isEven ? -50 : 50, rotateY: isEven ? 20 : -20 }}
            animate={isInView ? { opacity: 1, scale: 1, x: 0, rotateY: 0 } : {}}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.3 }}
            className="relative w-64 md:w-72 aspect-[3/4] group"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900">
              <Image src={item.image} alt={item.name} fill unoptimized className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-0 left-0 w-full p-4 md:hidden">
                <p className="text-white font-bold text-lg">{item.name}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div
          className={`w-full md:w-[45%] flex flex-col justify-center items-center md:items-start text-center md:text-left ${isEven ? 'md:pl-16' : 'md:pr-16 md:items-end md:text-right'}`}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-md"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold tracking-widest uppercase mb-4">
              {item.University}
            </span>
            <h2 className="hidden md:block text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">{item.name}</h2>
            <h3 className="text-xl text-fuchsia-300 font-serif italic mb-6">{item.subject}</h3>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">{item.description}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white text-slate-950 rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all"
            >
              View Profile
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default function SuccessStoriesReel() {
  const [vpHeight, setVpHeight] = useState(0);

  useEffect(() => {
    setVpHeight(window.innerHeight);
    const handleResize = () => setVpHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <main className="bg-slate-950 text-slate-100 overflow-hidden relative selection:bg-fuchsia-500/30">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-900/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-900/20 rounded-full blur-[100px]" />
      </div>

      <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth scrollbar-hide">
        <section className="h-screen w-full snap-center flex flex-col items-center justify-center relative z-10 text-center px-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white mb-6">
              SUCCESS
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">STORIES</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-xl mx-auto mb-12">Scroll down to witness the journey of excellence. One story at a time.</p>
            <div className="animate-bounce text-slate-500 flex flex-col items-center gap-2">
              <span className="text-xs uppercase tracking-widest">Scroll</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </motion.div>
        </section>

        <div className="relative w-full">
          {vpHeight > 0 && <SnakeLine count={data.length} viewportHeight={vpHeight} />}

          {data.map((item, index) => (
            <ReelStory key={item.sectionUid} item={item} index={index} />
          ))}
        </div>

        <section className="h-screen w-full snap-center flex items-center justify-center bg-slate-900 z-20 relative">
          <div className="text-center px-4">
            <h2 className="text-5xl font-bold mb-8">Be The Next Story</h2>
            <button className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform">
              Apply Now
            </button>
          </div>
        </section>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}
