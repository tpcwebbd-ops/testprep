'use client';

import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { BookOpen, Check, CheckCircle, Clock, FileText, MonitorPlay, PlayCircle, Star, Users, Video, ArrowRight } from 'lucide-react';
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
  isActive?: boolean;
  level?: string;
  levelColorClass?: string;
  features?: string[];
  popular?: boolean;
  schedule?: string[];
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
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const riseUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.7 } },
};

function CourseCard({ course }: { course: Course }) {
  const price = course.discountPrice && course.discountPrice > 0
    ? `৳${course.discountPrice}`
    : course.realPrice && course.realPrice > 0
    ? `৳${course.realPrice}`
    : undefined;

  const level = course.level || 'Course';
  const levelColorClass = course.levelColorClass || 'bg-blue-100 text-blue-700';
  const features = course.features && course.features.length > 0 ? course.features : [];
  const schedule = course.schedule && course.schedule.length > 0 ? course.schedule : [];
  const popular = course.popular ?? false;

  return (
    <div
      className={`relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border flex flex-col h-full ${
        popular ? 'border-red-200 ring-2 ring-red-100' : 'border-gray-100'
      }`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-1.5 rounded-full text-xs font-bold shadow-lg uppercase tracking-wider flex items-center gap-1">
            <span>🔥 Most Popular</span>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start space-x-4">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center shrink-0">
            <BookOpen className="w-7 h-7 text-red-500" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-2">{course.courseTitle}</h3>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${levelColorClass}`}>{level}</span>
          </div>
        </div>
      </div>

      {price && (
        <div className="mb-6 pb-6 border-b border-gray-100">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-red-500 tracking-tight">{price}</span>
            <span className="text-gray-400 text-sm font-medium">/ course</span>
            {course.discountPrice && course.discountPrice > 0 && course.realPrice && course.realPrice > 0 && (
              <span className="ml-2 text-sm text-gray-400 line-through">৳{course.realPrice}</span>
            )}
          </div>
        </div>
      )}

      {course.courseDescription && (
        <p className="text-gray-600 mb-6 leading-relaxed text-sm flex-grow">{course.courseDescription}</p>
      )}

      {schedule.length > 0 && (
        <div className="mb-6 bg-red-50/50 p-4 rounded-xl border border-red-100/50">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center text-sm">
            <Clock className="w-4 h-4 mr-2 text-red-500" />
            Class Schedule
          </h4>
          <div className="space-y-2">
            {schedule.map((time, index) => (
              <div key={index} className="flex items-center text-gray-600 text-xs font-medium">
                <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2.5"></div>
                {time}
              </div>
            ))}
          </div>
        </div>
      )}

      {features.length > 0 && (
        <div className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-gray-600 text-sm font-medium">{feature}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-8 mt-auto">
        {course.totalDuration && (
          <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
            <div className="text-lg font-bold text-gray-900 mb-0.5">{course.totalDuration}</div>
            <div className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">Duration</div>
          </div>
        )}
        {course.totalClass != null && (
          <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
            <div className="text-lg font-bold text-gray-900 mb-0.5">{course.totalClass}+</div>
            <div className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">Classes</div>
          </div>
        )}
        {course.totalMockTest != null && (
          <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <FileText className="w-4 h-4 text-gray-700" />
              <div className="text-lg font-bold text-gray-900">{course.totalMockTest}</div>
            </div>
            <div className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">Mock Tests</div>
          </div>
        )}
        {course.totalAssignment != null && (
          <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
            <div className="text-lg font-bold text-gray-900 mb-0.5">{course.totalAssignment}</div>
            <div className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">Assignments</div>
          </div>
        )}
      </div>

      <Link
        href={`/purchase?courseId=${course._id}&checkout=true`}
        className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center group ${
          popular
            ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg hover:shadow-red-500/30'
            : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-red-500 hover:text-red-500'
        }`}
      >
        Enroll Now
        <ArrowRight
          className={`w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1 ${popular ? 'text-white' : 'text-gray-400 group-hover:text-red-500'}`}
        />
      </Link>
    </div>
  );
}

export default function CoursesPageClient({ courses }: { courses: Course[] }) {
  const [isVisible] = useState(true);

  return (
    <main className="min-h-screen pt-12 text-white selection:bg-sky-500/30 selection:text-white overflow-x-hidden">
      {/* ── COURSES ── */}
      <section
        id="courses"
        className="py-20 px-4 md:px-8 bg-gradient-to-br from-red-50 via-orange-50 to-pink-50"
      >
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center mb-16 transform transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
              Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
                Popular
              </span>{' '}
              Courses
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
              Choose the right course for your learning goals
            </p>
          </div>

          {courses.length === 0 ? (
            <div className="flex items-center justify-center py-32 text-slate-400">
              <span className="text-sm">No courses available.</span>
            </div>
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {courses.map((course, index) => (
                <motion.div
                  key={course._id}
                  variants={riseUp}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-28 relative overflow-hidden bg-[#0a0a0f]">
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
      <section className="py-28 relative bg-[#0d0d18]">
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
