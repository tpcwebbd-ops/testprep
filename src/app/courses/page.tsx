'use client';

import React, { useRef, useState } from 'react';
import { motion, Variants, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Clock,
  FileText,
  MonitorPlay,
  Star,
  Users,
  Zap,
  Award,
  TrendingUp,
  ChevronDown,
  Play,
  CheckCircle,
  Sparkles,
  Globe,
  Shield,
  Heart,
} from 'lucide-react';
import { useGetCoursesQuery } from '@/redux/features/courses/coursesSlice';

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'backOut' } },
};

const FloatingOrb = ({ style }: { style: React.CSSProperties }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={style}
    animate={{ y: [0, -24, 0], scale: [1, 1.08, 1] }}
    transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, ease: 'easeInOut' }}
  />
);

const stats = [
  { label: 'সক্রিয় শিক্ষার্থী', value: '১২,০০০+', icon: Users, color: '#E8006F' },
  { label: 'কোর্স সম্পন্ন', value: '৯৮%', icon: CheckCircle, color: '#00D4A1' },
  { label: 'বিশেষজ্ঞ মেন্টর', value: '৫০+', icon: Star, color: '#FF9500' },
  { label: 'ক্যারিয়ার প্লেসমেন্ট', value: '৮৫%', icon: TrendingUp, color: '#7C3AED' },
];

const features = [
  {
    icon: Zap,
    title: 'লাইভ মেন্টরশিপ',
    desc: 'প্রতি সপ্তাহে অভিজ্ঞ মেন্টরদের সাথে সরাসরি সেশন',
    color: '#E8006F',
    bg: 'rgba(232,0,111,0.1)',
  },
  {
    icon: Globe,
    title: 'আজীবন অ্যাক্সেস',
    desc: 'একবার ভর্তি হলে সব কোর্স ম্যাটেরিয়াল চিরকালের জন্য',
    color: '#00D4A1',
    bg: 'rgba(0,212,161,0.1)',
  },
  {
    icon: Award,
    title: 'সার্টিফিকেট',
    desc: 'শিল্পে স্বীকৃত পেশাদার সার্টিফিকেট পান',
    color: '#FF9500',
    bg: 'rgba(255,149,0,0.1)',
  },
  {
    icon: Shield,
    title: '৩০ দিনের গ্যারান্টি',
    desc: 'সন্তুষ্ট না হলে সম্পূর্ণ অর্থ ফেরত পাবেন',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.1)',
  },
];

const testimonials = [
  {
    name: 'রাহেলা আক্তার',
    role: 'ফ্রন্টএন্ড ডেভেলপার, Grameenphone',
    text: 'এই প্ল্যাটফর্মের কোর্সগুলো আমার ক্যারিয়ার সম্পূর্ণ বদলে দিয়েছে। মাত্র ৬ মাসে চাকরি পেয়েছি!',
    rating: 5,
    avatar: 'RA',
    color: '#E8006F',
  },
  {
    name: 'তানভীর হাসান',
    role: 'ব্যাকএন্ড ইঞ্জিনিয়ার, bKash',
    text: 'লাইভ সেশন এবং মেন্টরশিপ অসাধারণ। প্রশ্ন করলে তাৎক্ষণিক উত্তর পাই।',
    rating: 5,
    avatar: 'TH',
    color: '#7C3AED',
  },
  {
    name: 'সুমাইয়া ইসলাম',
    role: 'UI/UX ডিজাইনার, Pathao',
    text: 'প্র্যাকটিক্যাল প্রজেক্টগুলো পোর্টফোলিও তৈরিতে অনেক সাহায্য করেছে।',
    rating: 5,
    avatar: 'SI',
    color: '#00D4A1',
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CourseCard = ({ course, index }: { course: any; index: number }) => {
  const accentColors = ['#E8006F', '#7C3AED', '#FF9500', '#00D4A1'];
  const accent = accentColors[index % accentColors.length];
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={fadeInUp}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -10, scale: 1.02 }}
      className="relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm"
      style={{
        boxShadow: hovered ? `0 30px 60px -10px ${accent}40, 0 0 0 1px ${accent}30` : '0 8px 32px rgba(0,0,0,0.3)',
        transition: 'box-shadow 0.4s ease',
      }}
    >
      {/* Gradient top bar */}
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />

      {/* Glowing icon */}
      <div className="p-7 pb-0">
        <motion.div
          animate={hovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
          style={{ background: `${accent}20`, boxShadow: hovered ? `0 0 20px ${accent}50` : 'none' }}
        >
          <BookOpen className="w-7 h-7" style={{ color: accent }} />
        </motion.div>

        <h3 className="text-xl font-bold text-white mb-2 leading-snug">{course.courseTitle}</h3>
        <p className="text-sm text-white/50 line-clamp-2 mb-6">{course.courseDescription}</p>
      </div>

      {/* Stats */}
      <div className="px-7 flex-grow space-y-3 mb-6">
        {[
          { icon: Clock, label: 'সময়কাল', value: course.totalDuration },
          { icon: MonitorPlay, label: 'ক্লাস', value: course.totalClass },
          { icon: FileText, label: 'অ্যাসাইনমেন্ট', value: `${course.totalAssignment}টি` },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center justify-between text-sm">
            <span className="text-white/40 flex items-center gap-2">
              <Icon className="w-3.5 h-3.5" /> {label}
            </span>
            <span className="font-semibold text-white/80">{value}</span>
          </div>
        ))}
      </div>

      {/* Price + CTA */}
      <div className="px-7 pb-7 pt-5 border-t border-white/8">
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-black text-white">৳{course.discountPrice}</span>
          <span className="text-sm text-white/30 line-through">৳{course.realPrice}</span>
          <span className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${accent}25`, color: accent }}>
            সাশ্রয়!
          </span>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300"
          style={{
            background: hovered ? accent : 'rgba(255,255,255,0.07)',
            color: hovered ? '#fff' : 'rgba(255,255,255,0.7)',
            border: `1px solid ${hovered ? accent : 'rgba(255,255,255,0.1)'}`,
          }}
        >
          এখনই ভর্তি হন <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Ambient glow */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{ background: `radial-gradient(circle at 50% 0%, ${accent}15, transparent 70%)` }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Page = () => {
  const { data, isLoading } = useGetCoursesQuery({ page: 1, limit: 100 });
  const courses = data?.data?.courses || [];
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <main className="min-h-screen font-sans overflow-x-hidden" style={{ background: '#0D0118', color: '#FAF7FF' }}>
      {/* ── COURSES ── */}
      <section id="courses" className="py-24 px-4 relative">
        {/* Section background glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.1) 0%, transparent 70%)' }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: '#7C3AED' }}>
              আমাদের প্রোগ্রাম
            </p>
            <h2 className="text-4xl md:text-5xl font-black mb-4">সকল কোর্স</h2>
            <p className="text-white/40 max-w-xl mx-auto">তোমার লক্ষ্য অনুযায়ী সঠিক কোর্সটি বেছে নাও এবং আজই যাত্রা শুরু করো।</p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-96 rounded-3xl animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
              ))}
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7"
            >
              {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                courses.map((course: any, i: number) => (
                  <CourseCard key={course._id} course={course} index={i} />
                ))
              }
            </motion.div>
          )}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(232,0,111,0.05) 50%, transparent)' }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: '#FF9500' }}>
              শিক্ষার্থীদের কথা
            </p>
            <h2 className="text-4xl md:text-5xl font-black">তারা যা বলছে</h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-7"
          >
            {testimonials.map(({ name, role, text, rating, avatar, color }) => (
              <motion.div
                key={name}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                className="p-7 rounded-2xl flex flex-col gap-5"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <div className="flex gap-1">
                  {Array(rating)
                    .fill(0)
                    .map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" style={{ color: '#FF9500' }} />
                    ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed flex-grow">&ldquo;{text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/6">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${color}, ${color}80)` }}
                  >
                    {avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{name}</div>
                    <div className="text-xs text-white/40">{role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-14 rounded-[2.5rem] text-center overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(232,0,111,0.15), rgba(124,58,237,0.15))',
              border: '1px solid rgba(232,0,111,0.2)',
            }}
          >
            <FloatingOrb
              style={{ width: 300, height: 300, top: -80, right: -80, background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)' }}
            />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                আর দেরি নয়,{' '}
                <span style={{ background: 'linear-gradient(135deg, #E8006F, #FF9500)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  শুরু করো আজই!
                </span>
              </h2>
              <p className="text-white/50 mb-10 max-w-xl mx-auto">
                প্রতিটি দিন অপেক্ষা করা মানে আরো একটি সুযোগ মিস করা। তোমার স্বপ্নের ক্যারিয়ার তোমার জন্য অপেক্ষা করছে।
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-10 py-5 rounded-2xl font-black text-white text-lg inline-flex items-center gap-3"
                style={{
                  background: 'linear-gradient(135deg, #E8006F, #7C3AED)',
                  boxShadow: '0 20px 50px rgba(232,0,111,0.4)',
                }}
                onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
              >
                বিনামূল্যে শুরু করুন <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center overflow-hidden">
        {/* Background orbs */}
        <FloatingOrb
          style={{ width: 500, height: 500, top: -100, left: -150, background: 'radial-gradient(circle, rgba(232,0,111,0.18) 0%, transparent 70%)' }}
        />
        <FloatingOrb
          style={{ width: 400, height: 400, bottom: -50, right: -100, background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)' }}
        />
        <FloatingOrb
          style={{ width: 300, height: 300, top: '40%', left: '60%', background: 'radial-gradient(circle, rgba(0,212,161,0.12) 0%, transparent 70%)' }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-semibold"
            style={{
              background: 'rgba(232,0,111,0.12)',
              border: '1px solid rgba(232,0,111,0.3)',
              color: '#E8006F',
            }}
          >
            <Sparkles className="w-4 h-4" />
            বাংলাদেশের সেরা অনলাইন লার্নিং প্ল্যাটফর্ম
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl font-black leading-[1.05] mb-6"
          >
            তোমার স্বপ্নের{' '}
            <span
              className="relative inline-block"
              style={{
                background: 'linear-gradient(135deg, #E8006F 0%, #FF9500 50%, #7C3AED 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ক্যারিয়ার
            </span>{' '}
            <br />
            গড়ো আজই
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            বিশেষজ্ঞ মেন্টরদের গাইডেন্সে প্র্যাকটিক্যাল দক্ষতা অর্জন করো এবং টেক ইন্ডাস্ট্রিতে তোমার স্থান নিশ্চিত করো।
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white text-base transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #E8006F, #7C3AED)',
                boxShadow: '0 10px 40px rgba(232,0,111,0.35)',
              }}
              onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Play className="w-4 h-4 fill-white" />
              কোর্স দেখুন
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white/70 text-base border border-white/10 hover:border-white/30 hover:text-white transition-all duration-300">
              <Heart className="w-4 h-4" />
              সফলতার গল্প
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="flex flex-col items-center gap-2 text-white/30 text-xs"
          >
            <span>নিচে স্ক্রোল করুন</span>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── DIAGONAL RIP DIVIDER (signature element) ── */}
      <div className="relative h-20 -mt-1" style={{ background: '#0D0118' }}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          <path d="M0,0 L1440,0 L1440,30 Q720,80 0,30 Z" fill="rgba(232,0,111,0.06)" />
        </svg>
      </div>

      {/* ── STATS STRIP ── */}
      <section className="py-16 px-4 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map(({ label, value, icon: Icon, color }) => (
              <motion.div
                key={label}
                variants={scaleIn}
                className="relative p-6 rounded-2xl text-center overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: `${color}20` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div className="text-3xl font-black mb-1" style={{ color }}>
                  {value}
                </div>
                <div className="text-xs text-white/40">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: '#E8006F' }}>
              কেন আমরা?
            </p>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              শেখার অভিজ্ঞতা যা
              <br />
              <span style={{ color: '#00D4A1' }}>সত্যিই কাজে আসে</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">
              আমাদের কোর্সগুলো শুধু তত্ত্ব নয়, বাস্তব প্রজেক্ট এবং শিল্প-মানের প্র্যাকটিসের উপর ভিত্তি করে তৈরি।
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map(({ icon: Icon, title, desc, color, bg }) => (
              <motion.div
                key={title}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                className="p-7 rounded-2xl group cursor-default transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{ background: bg }}
                >
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Page;
