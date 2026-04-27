'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle, Clock, FileText, MonitorPlay, PlayCircle, Star, Users, Video } from 'lucide-react';
import Link from 'next/link';

interface Course {
  _id: string;
  courseTitle: string;
  courseDescription?: string;
  totalClass?: number;
  totalAssignment?: number;
  totalDuration?: string;
  totalMockTest?: number;
  realPrice?: number;
  discountPrice?: number;
}

const benefits = [
  {
    title: 'Live & Recorded Classes',
    description: 'Learn at your own pace or join interactive live sessions with expert instructors.',
    icon: MonitorPlay,
    accent: 'from-sky-500/20 to-sky-500/5',
    iconColor: 'text-sky-400',
  },
  {
    title: 'Expert Instructors',
    description: 'Learn from the top educators in Bangladesh with years of proven experience.',
    icon: Users,
    accent: 'from-violet-500/20 to-violet-500/5',
    iconColor: 'text-violet-400',
  },
  {
    title: 'Premium Study Materials',
    description: 'Get exclusive access to assignments, mock tests, and lecture sheets.',
    icon: BookOpen,
    accent: 'from-emerald-500/20 to-emerald-500/5',
    iconColor: 'text-emerald-400',
  },
  {
    title: 'Affordable Excellence',
    description: 'World-class education at a price that every student in Bangladesh can afford.',
    icon: Star,
    accent: 'from-amber-500/20 to-amber-500/5',
    iconColor: 'text-amber-400',
  },
];

const checklistItems = ['Interactive Live Sessions with Q&A', 'High-Quality Recorded Videos for Revision', 'Comprehensive Assignments & Mock Tests'];

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const riseUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.7 } },
};

export default function CoursesPageClient({ courses }: { courses: Course[] }) {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white selection:bg-sky-500/30 selection:text-white overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col justify-center pt-20 pb-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-sky-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] rounded-full bg-violet-500/10 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-5xl">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-300 text-xs font-semibold tracking-widest uppercase mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              Admissions Open — 2026 Batches
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl sm:text-6xl lg:text-[80px] font-black leading-[1.05] tracking-tight mb-8"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Master English.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-300 to-violet-400">Ace Every Exam.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-lg text-white/50 max-w-xl mb-12 leading-relaxed"
            >
              Bangladesh&apos;s premier platform for IELTS and English language learning — combining live instruction with on-demand flexibility.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.38 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="#courses"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-sky-500/25 hover:shadow-sky-400/40 hover:-translate-y-0.5"
              >
                Explore Courses
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#about"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-semibold text-sm transition-all duration-200"
              >
                <PlayCircle className="w-4 h-4" />
                Watch Demo
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="absolute bottom-16 right-8 hidden lg:block"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 text-center min-w-[140px]">
              <p className="text-4xl font-black text-sky-300 tracking-tight">10k+</p>
              <p className="text-xs text-white/40 mt-1 font-medium uppercase tracking-wider">Students Placed</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
        </motion.div>
      </section>

      {/* ── COURSES ── */}
      <section id="courses" className="py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0d0d18] to-[#0a0a0f]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-16">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sky-400 text-xs font-bold uppercase tracking-[0.2em] mb-3"
            >
              Programs
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-black text-white tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Our Popular Courses
            </motion.h2>
          </div>

          {courses.length === 0 ? (
            <div className="flex items-center justify-center py-32 text-white/30">
              <span className="text-sm">No courses available.</span>
            </div>
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {courses.map(course => (
                <motion.div
                  key={course._id}
                  variants={riseUp}
                  whileHover={{ y: -6 }}
                  className="group relative flex flex-col bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden hover:border-sky-500/40 hover:bg-white/[0.055] transition-all duration-300"
                >
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-sky-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-base font-bold text-white mb-1.5 leading-snug">{course.courseTitle}</h3>
                    {course.courseDescription && <p className="text-white/40 text-xs mb-5 line-clamp-2 leading-relaxed">{course.courseDescription}</p>}

                    <div className="flex items-baseline gap-2 mb-6">
                      {course.discountPrice && course.discountPrice > 0 ? (
                        <>
                          <span className="text-2xl font-extrabold text-sky-300">৳{course.discountPrice}</span>
                          {course.realPrice && course.realPrice > 0 && <span className="text-sm text-white/25 line-through">৳{course.realPrice}</span>}
                        </>
                      ) : course.realPrice && course.realPrice > 0 ? (
                        <span className="text-2xl font-extrabold text-sky-300">৳{course.realPrice}</span>
                      ) : (
                        <span className="text-xs text-white/30 italic">Price on request</span>
                      )}
                    </div>

                    <ul className="space-y-2.5 flex-1">
                      {course.totalDuration && (
                        <li className="flex items-center gap-2.5 text-white/50 text-xs">
                          <Clock className="w-3.5 h-3.5 shrink-0 text-white/30" />
                          {course.totalDuration}
                        </li>
                      )}
                      {course.totalClass != null && (
                        <li className="flex items-center gap-2.5 text-white/50 text-xs">
                          <MonitorPlay className="w-3.5 h-3.5 shrink-0 text-white/30" />
                          {course.totalClass} Classes
                        </li>
                      )}
                      {course.totalMockTest != null && (
                        <li className="flex items-center gap-2.5 text-white/50 text-xs">
                          <FileText className="w-3.5 h-3.5 shrink-0 text-white/30" />
                          {course.totalMockTest} Mock Tests
                        </li>
                      )}
                      {course.totalAssignment != null && (
                        <li className="flex items-center gap-2.5 text-white/50 text-xs">
                          <BookOpen className="w-3.5 h-3.5 shrink-0 text-white/30" />
                          {course.totalAssignment} Assignments
                        </li>
                      )}
                    </ul>

                    <Link
                      href={`/purchase?courseId=${course._id}&checkout=true`}
                      className="mt-6 block w-full py-2.5 rounded-xl text-center text-sm font-semibold bg-sky-500/10 hover:bg-sky-500 text-sky-300 hover:text-white border border-sky-500/20 hover:border-sky-500 transition-all duration-200"
                    >
                      Enroll Now
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-28 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-500/8 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={fadeIn} className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden bg-white/[0.03] border border-white/10 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 to-violet-500/5" />
                <Video className="w-16 h-16 text-white/10" />
                <button className="absolute z-10 bg-white/10 hover:bg-sky-500/80 backdrop-blur-sm border border-white/20 p-5 rounded-full transition-all duration-200 hover:scale-105 hover:border-sky-400/50">
                  <PlayCircle className="w-7 h-7 text-white" />
                </button>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-5 -right-5 hidden md:block bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-5 py-4"
              >
                <p className="text-2xl font-black text-sky-300">10k+</p>
                <p className="text-[11px] text-white/40 font-medium uppercase tracking-wider mt-0.5">Successful Students</p>
              </motion.div>
            </motion.div>

            <motion.div variants={riseUp}>
              <p className="text-sky-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">About</p>
              <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Why Learn with TestPrep Center?
              </h2>
              <p className="text-white/45 text-base leading-relaxed mb-8">
                We bridge the gap between ambition and achievement. Based in Bangladesh, our mission is to provide world-class education at an accessible price
                — whether you prefer flexible recordings or immersive live classes.
              </p>
              <ul className="space-y-4">
                {checklistItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <span className="text-white/65 text-sm font-medium leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0d0d18] to-[#0a0a0f]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-xl mb-16">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sky-400 text-xs font-bold uppercase tracking-[0.2em] mb-3"
            >
              Why Us
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              The TestPrep Advantage
            </motion.h2>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {benefits.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={i}
                  variants={riseUp}
                  className="group p-6 rounded-2xl border border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.05] transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.accent} flex items-center justify-center mb-5`}>
                    <Icon className={`w-5 h-5 ${benefit.iconColor}`} />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-white/40 text-xs leading-relaxed">{benefit.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&display=swap');
      `}</style>
    </main>
  );
}
