'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle, Clock, FileText, Loader2, MonitorPlay, PlayCircle, Star, Users, Video } from 'lucide-react';
import Link from 'next/link';

import { useGetCoursesQuery } from '@/redux/features/courses/coursesSlice';


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
}

const benefits = [
  {
    title: 'Live & Recorded Classes',
    description: 'Learn at your own pace or join interactive live sessions with expert instructors.',
    icon: <MonitorPlay className="w-6 h-6 text-blue-600" />,
  },
  {
    title: 'Expert Instructors',
    description: 'Learn from the top educators in Bangladesh with years of proven experience.',
    icon: <Users className="w-6 h-6 text-blue-600" />,
  },
  {
    title: 'Premium Study Materials',
    description: 'Get exclusive access to assignments, mock tests, and lecture sheets.',
    icon: <BookOpen className="w-6 h-6 text-blue-600" />,
  },
  {
    title: 'Affordable Excellence',
    description: 'World-class education at a price that every student in Bangladesh can afford.',
    icon: <Star className="w-6 h-6 text-blue-600" />,
  },
];

// --- Animation Variants (Typed to fix TypeScript errors) ---
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const Page = () => {
  const { data: coursesData } = useGetCoursesQuery({ page: 1, limit: 50 });
  const courses: Course[] = (coursesData?.data?.courses || []).filter((c: Course) => c.isActive !== false);

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-200">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-slate-50 opacity-70"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mb-6"
            >
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              Admissions Open for 2026 Batches
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight"
            >
              Master English & Ace Your Exams with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">TestPrep Center</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto"
            >
              Bangladesh&apos;s premier platform for IELTS and English language learning. Experience high-quality live and recorded classes designed to
              guarantee your success.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a
                href="#courses"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                Explore Courses <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#about"
                className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 hover:border-blue-200 hover:bg-blue-50 text-slate-700 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              >
                <PlayCircle className="w-5 h-5 text-blue-600" /> Watch Demo
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeInUp} className="relative">
              <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden shadow-xl relative border border-slate-200 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-transparent z-10" />
                <Video className="w-20 h-20 text-slate-300 relative z-0" />
                <button className="absolute z-20 bg-white/90 backdrop-blur p-4 rounded-full shadow-lg hover:scale-110 transition-transform">
                  <PlayCircle className="w-8 h-8 text-blue-600" />
                </button>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:block">
                <p className="text-3xl font-bold text-blue-600">10k+</p>
                <p className="text-sm text-slate-500 font-medium">Successful Students</p>
              </div>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Why Learn with TestPrep Center?</h2>
              <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                We bridge the gap between ambition and success. Based in Bangladesh, our mission is to provide world-class education at an affordable price.
                Whether you prefer the flexibility of recorded videos or the interaction of live classes, we have you covered.
              </p>
              <ul className="space-y-4">
                {['Interactive Live Sessions with Q&A', 'High-Quality Recorded Videos for Revision', 'Comprehensive Assignments & Mock Tests'].map(
                  (item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                      <span className="text-slate-700 font-medium">{item}</span>
                    </li>
                  ),
                )}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- COURSES SECTION --- */}
      <section id="courses" className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold text-slate-900 mb-4"
            >
              Our Popular Courses
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 max-w-2xl mx-auto"
            >
              Choose the perfect program designed for your age and goals. Enroll now and unlock a huge discount!
            </motion.p>
          </div>

          {courses.length === 0 ? (
            <div className="flex items-center justify-center py-24 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mr-3 text-blue-400" />
              <span className="text-lg">Loading courses...</span>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-50px' }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {courses.map(course => (
                <motion.div
                  key={course._id}
                  variants={fadeInUp}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col relative"
                >
                  <div className="p-6 grow">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{course.courseTitle}</h3>
                    {course.courseDescription && (
                      <p className="text-slate-500 text-sm mb-3 line-clamp-2">{course.courseDescription}</p>
                    )}
                    <div className="flex items-baseline gap-2 mb-6">
                      {course.discountPrice && course.discountPrice > 0 ? (
                        <>
                          <span className="text-3xl font-extrabold text-blue-600">৳{course.discountPrice}</span>
                          {course.realPrice && course.realPrice > 0 && (
                            <span className="text-lg text-slate-400 line-through font-medium">৳{course.realPrice}</span>
                          )}
                        </>
                      ) : course.realPrice && course.realPrice > 0 ? (
                        <span className="text-3xl font-extrabold text-blue-600">৳{course.realPrice}</span>
                      ) : (
                        <span className="text-sm text-slate-400 italic">Price on request</span>
                      )}
                    </div>

                    <div className="space-y-4 mb-8">
                      {course.totalDuration && (
                        <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <Clock className="w-4 h-4" />
                          </div>
                          Duration: {course.totalDuration}
                        </div>
                      )}
                      {course.totalClass != null && (
                        <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <MonitorPlay className="w-4 h-4" />
                          </div>
                          Total Classes: {course.totalClass}
                        </div>
                      )}
                      {course.totalMockTest != null && (
                        <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <FileText className="w-4 h-4" />
                          </div>
                          Mock Tests: {course.totalMockTest}
                        </div>
                      )}
                      {course.totalAssignment != null && (
                        <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          Assignments: {course.totalAssignment}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 pt-0 mt-auto">
                    <Link
                      href={`/purchase?courseId=${course._id}`}
                      className="w-full py-3 rounded-xl font-semibold transition-colors bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 flex items-center justify-center"
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

      {/* --- BENEFITS SECTION --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">The TestPrep Center Advantage</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Everything you need to succeed, packed into one single platform.</p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors"
              >
                <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 border border-slate-100">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- FINAL CTA SECTION --- */}
      <section className="py-20 bg-blue-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-900 opacity-20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Ready to Transform Your Future?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-blue-100 mb-10"
          >
            Join thousands of successful students across Bangladesh. Grab the discounted offers before they expire!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-slate-100 transition-colors shadow-xl">
              Get Started Today
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-blue-700 text-white border border-blue-500 rounded-xl font-bold text-lg hover:bg-blue-800 transition-colors">
              Contact Support
            </button>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Page;
