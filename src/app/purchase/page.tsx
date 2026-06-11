'use client';

import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  BookOpen,
  Clock,
  FileText,
  MonitorPlay,
  CheckCircle,
  ShoppingCart,
  Tag,
  CreditCard,
  AlertCircle,
  Loader2,
  ChevronRight,
  X,
  Banknote,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useGetCoursesQuery } from '@/redux/features/courses/coursesSlice';
import { useAddEnrollmentMutation } from '@/redux/features/enrollments/enrollmentsSlice';
import { useSession } from '@/lib/auth-client';

interface Course {
  _id: string;
  courseTitle: string;
  courseDescription?: string;
  totalClass?: number;
  totalAssignment?: number;
  totalDuration?: string;
  totalMockTest?: number;
  totalLecture?: number;
  realPrice?: number;
  discountPrice?: number;
  isActive?: boolean;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const STEPS = ['select', 'checkout', 'success'] as const;
type Step = (typeof STEPS)[number];

function PurchasePageContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const urlCourseId = searchParams.get('courseId');
  const urlCheckout = searchParams.get('checkout') === 'true';

  const { data: coursesData, isLoading: coursesLoading, error: coursesError } = useGetCoursesQuery({ page: 1, limit: 50 });
  const [addEnrollment, { isLoading: isSubmitting }] = useAddEnrollmentMutation();

  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [step, setStep] = useState<Step>('select');
  const [isSslSubmitting, setIsSslSubmitting] = useState(false);
  const [isCashSubmitting, setIsCashSubmitting] = useState(false);

  const [form, setForm] = useState({
    studentName: '',
    studentEmail: '',
    paymentMethod: 'SSLCommerz',
    couponCode: '',
  });

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (session?.user) {
      setForm(f => ({ ...f, studentName: session.user.name || '', studentEmail: session.user.email || '' }));
    }
  }, [session]);

  const courses: Course[] = useMemo(() => coursesData?.data?.courses || [], [coursesData]);

  useEffect(() => {
    if (courses.length > 0 && !hasInitialized.current) {
      let initialIds: string[] = [];
      if (urlCourseId && courses.some(c => c._id === urlCourseId)) {
        initialIds = [urlCourseId];
      } else if (courses.length > 0) {
        initialIds = [courses[0]._id];
      }
      setSelectedCourseIds(initialIds);
      if (urlCheckout && initialIds.length > 0) setStep('checkout');
      hasInitialized.current = true;
    }
  }, [courses, urlCourseId, urlCheckout]);

  const selectedCourses = courses.filter(c => selectedCourseIds.includes(c._id));
  const totalReal = selectedCourses.reduce((sum, c) => sum + (c.realPrice || 0), 0);
  const payAmount = selectedCourses.reduce((sum, c) => sum + (c.discountPrice != null && c.discountPrice > 0 ? c.discountPrice : c.realPrice || 0), 0);
  const totalDiscount = totalReal > payAmount ? totalReal - payAmount : 0;

  const toggleCourse = (id: string) => setSelectedCourseIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

  const removeCourse = (id: string) => setSelectedCourseIds(prev => prev.filter(x => x !== id));

  const handleCheckout = () => {
    if (selectedCourseIds.length === 0) {
      toast.error('Select at least one course');
      return;
    }
    setStep('checkout');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentName.trim() || !form.studentEmail.trim()) {
      toast.error('Name and email required');
      return;
    }
    if (selectedCourseIds.length === 0) {
      toast.error('No courses selected');
      return;
    }
    setIsSslSubmitting(true);
    try {
      const res = await fetch('/api/payment/sslcommerz/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: form.studentName.trim(),
          studentEmail: form.studentEmail.trim(),
          enrollCoursesIDS: selectedCourseIds,
          realPrice: totalReal,
          discountPrice: totalDiscount,
          paymentAmount: payAmount,
          couponCode: form.couponCode.trim() || null,
        }),
      });
      const data = await res.json();
      if (data?.ok && data?.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        toast.error(data?.message || 'Payment init failed');
      }
    } catch {
      toast.error('Something went wrong. Try again.');
    } finally {
      setIsSslSubmitting(false);
    }
  };

  const handleCashPayment = async () => {
    if (selectedCourseIds.length === 0) {
      toast.error('Select at least one course');
      return;
    }
    if (!form.studentName.trim() || !form.studentEmail.trim()) {
      toast.error('Name and email required');
      return;
    }
    setIsCashSubmitting(true);
    try {
      const res = await addEnrollment({
        studentName: form.studentName.trim(),
        studentEmail: form.studentEmail.trim(),
        studentsStatus: 'running',
        enrollCoursesIDS: selectedCourseIds,
        realPrice: totalReal,
        discountPrice: totalDiscount,
        paymentAmount: payAmount,
        paymentMethod: 'Cash',
        couponCode: form.couponCode.trim() || null,
        checkedbyEmail: '',
        paymentStatus: 'pending',
      }).unwrap();
      if (res?.ok) setStep('success');
      else toast.error(res?.message || 'Cash enrollment failed');
    } catch {
      toast.error('Something went wrong. Try again.');
    } finally {
      setIsCashSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* ── Header ── */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mb-16 pt-4"
      >
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-amber-400 mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Secure Enrollment Portal
        </div>
        <h1 className="text-[clamp(3rem,8vw,7rem)] font-black leading-[0.9] tracking-tighter text-white mb-5">
          Check<span className="text-stroke">out</span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-lg leading-relaxed">
          Select your curriculum, review your order, and complete your enrollment in three steps.
        </p>
      </motion.header>

      {/* ── Step Indicator ── */}
      <div className="flex items-center gap-0 mb-14 overflow-x-auto pb-1">
        {STEPS.map((s, i) => {
          const done = STEPS.indexOf(step) > i;
          const active = step === s;
          return (
            <React.Fragment key={s}>
              <div
                className={`flex items-center gap-3 px-5 py-3 rounded-full text-sm font-bold tracking-wide transition-all duration-300 whitespace-nowrap ${
                  active
                    ? 'bg-amber-400 text-zinc-900'
                    : done
                      ? 'bg-zinc-800 text-amber-400 border border-zinc-700'
                      : 'bg-transparent text-zinc-600 border border-zinc-800'
                }`}
              >
                {done ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs leading-none border-current">{i + 1}</span>
                )}
                <span className="capitalize">{s}</span>
              </div>
              {i < 2 && <div className={`w-8 h-px mx-1 flex-shrink-0 transition-colors duration-300 ${done ? 'bg-amber-400/40' : 'bg-zinc-800'}`} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* ── Content ── */}
      <AnimatePresence mode="wait">
        {/* SELECT */}
        {step === 'select' && (
          <motion.div key="select" initial="hidden" animate="show" exit={{ opacity: 0, filter: 'blur(8px)', transition: { duration: 0.3 } }} variants={stagger}>
            {coursesLoading && (
              <div className="flex flex-col items-center justify-center py-40 gap-6">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 border border-zinc-700 rounded-full" />
                  <div className="absolute inset-0 border border-amber-400 rounded-full border-t-transparent animate-spin" />
                </div>
                <span className="text-zinc-500 text-sm tracking-widest uppercase font-semibold">Loading curriculum…</span>
              </div>
            )}

            {coursesError && (
              <motion.div variants={fadeUp} className="flex flex-col items-center py-24 gap-4 text-center border border-red-900/40 bg-red-950/20 rounded-2xl">
                <AlertCircle className="w-10 h-10 text-red-500" />
                <p className="text-red-400 font-bold text-lg">Failed to load courses. Please refresh.</p>
              </motion.div>
            )}

            {!coursesLoading && !coursesError && courses.length === 0 && (
              <motion.div variants={fadeUp} className="text-center py-32 text-zinc-600 border border-zinc-800 rounded-2xl">
                <BookOpen className="w-16 h-16 mx-auto mb-5 opacity-20" />
                <p className="text-xl font-bold">No courses available.</p>
              </motion.div>
            )}

            {courses.length > 0 && (
              <>
                <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
                  {courses
                    .filter(c => c.isActive !== false)
                    .map((course, idx) => {
                      const selected = selectedCourseIds.includes(course._id);
                      const price = course.discountPrice && course.discountPrice > 0 ? course.discountPrice : course.realPrice;
                      return (
                        <motion.article
                          key={course._id}
                          variants={fadeUp}
                          custom={idx}
                          onClick={() => toggleCourse(course._id)}
                          whileHover={{ y: -4 }}
                          className={`group relative flex flex-col cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 ${
                            selected ? 'border-amber-400 bg-zinc-900' : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-600'
                          }`}
                        >
                          {/* top accent line */}
                          <div className={`h-0.5 w-full transition-all duration-300 ${selected ? 'bg-amber-400' : 'bg-zinc-800 group-hover:bg-zinc-600'}`} />

                          {/* index number watermark */}
                          <span className="absolute top-5 right-6 text-5xl font-black text-zinc-800 select-none leading-none tabular-nums">
                            {String(idx + 1).padStart(2, '0')}
                          </span>

                          <div className="p-7 flex flex-col flex-grow">
                            <div className="flex items-start justify-between mb-5 pr-12">
                              <h3
                                className={`text-xl font-black leading-snug transition-colors ${selected ? 'text-white' : 'text-zinc-200 group-hover:text-white'}`}
                              >
                                {course.courseTitle}
                              </h3>
                            </div>

                            {course.courseDescription && <p className="text-zinc-500 text-sm mb-6 line-clamp-2 leading-relaxed">{course.courseDescription}</p>}

                            <div className="space-y-2.5 mb-7 mt-auto">
                              {course.totalDuration && (
                                <div className="flex items-center gap-3 text-zinc-400 text-xs font-semibold">
                                  <Clock className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" />
                                  {course.totalDuration}
                                </div>
                              )}
                              {course.totalClass != null && (
                                <div className="flex items-center gap-3 text-zinc-400 text-xs font-semibold">
                                  <MonitorPlay className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" />
                                  {course.totalClass} Classes
                                </div>
                              )}
                              {course.totalMockTest != null && (
                                <div className="flex items-center gap-3 text-zinc-400 text-xs font-semibold">
                                  <FileText className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" />
                                  {course.totalMockTest} Mock Tests
                                </div>
                              )}
                            </div>

                            {/* Price row */}
                            <div className="flex items-end justify-between border-t border-zinc-800 pt-5">
                              <div>
                                {price != null && price > 0 ? (
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black text-white">৳{price}</span>
                                    {course.discountPrice && course.discountPrice > 0 && course.realPrice && course.realPrice > 0 && (
                                      <span className="text-sm text-zinc-600 line-through font-medium">৳{course.realPrice}</span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-sm text-zinc-600 italic">Price on request</span>
                                )}
                                {course.discountPrice && course.discountPrice > 0 && course.realPrice && course.realPrice > course.discountPrice && (
                                  <span className="text-xs font-bold text-emerald-400 mt-0.5 block">Save ৳{course.realPrice - course.discountPrice}</span>
                                )}
                              </div>

                              <div
                                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                                  selected ? 'bg-amber-400 border-amber-400' : 'border-zinc-700 group-hover:border-zinc-500'
                                }`}
                              >
                                {selected ? (
                                  <CheckCircle className="w-5 h-5 text-zinc-900" />
                                ) : (
                                  <span className="w-2 h-2 rounded-full bg-zinc-600 group-hover:bg-zinc-400 transition-colors" />
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.article>
                      );
                    })}
                </motion.div>

                {/* Sticky bar */}
                <AnimatePresence>
                  {selectedCourseIds.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 32 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 32 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="sticky bottom-6 z-50 border border-zinc-700/60 bg-zinc-900/95 backdrop-blur-xl rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-[0_8px_60px_-10px_rgba(0,0,0,0.8)]"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2.5">
                          {selectedCourseIds.length} course{selectedCourseIds.length > 1 ? 's' : ''} selected
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedCourses.map(c => (
                            <motion.span
                              key={c._id}
                              initial={{ opacity: 0, scale: 0.85 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.85 }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-full text-xs font-bold"
                            >
                              {c.courseTitle}
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  removeCourse(c._id);
                                }}
                                className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-red-500/20 hover:text-red-400 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-6 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-xs text-zinc-600 font-semibold uppercase tracking-wider">Total</p>
                          <p className="text-2xl font-black text-white tabular-nums">৳{payAmount}</p>
                        </div>
                        <button
                          onClick={handleCheckout}
                          className="group flex items-center gap-2 px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-zinc-900 font-black rounded-xl transition-all duration-200 text-sm tracking-wide shadow-lg shadow-amber-400/20"
                        >
                          Checkout
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </motion.div>
        )}

        {/* CHECKOUT */}
        {step === 'checkout' && (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 xl:grid-cols-12 gap-7 items-start"
          >
            {/* Order Summary */}
            <aside className="xl:col-span-4 space-y-5">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7">
                <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">Order Summary</h2>
                <div className="space-y-3 mb-8">
                  {selectedCourses.map(c => (
                    <div key={c._id} className="flex items-start justify-between gap-4 py-3 border-b border-zinc-800 last:border-0">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <BookOpen className="w-4 h-4 text-zinc-500" />
                        </div>
                        <span className="text-sm font-semibold text-zinc-300 leading-snug">{c.courseTitle}</span>
                      </div>
                      <span className="text-sm font-black text-white flex-shrink-0">
                        ৳{(c.discountPrice && c.discountPrice > 0 ? c.discountPrice : c.realPrice) || 0}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-zinc-950 rounded-xl p-5 space-y-3">
                  {totalReal > payAmount && (
                    <>
                      <div className="flex justify-between text-sm text-zinc-500">
                        <span>Subtotal</span>
                        <span className="line-through">৳{totalReal}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-emerald-400">
                        <span>Discount</span>
                        <span>−৳{totalReal - payAmount}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-center pt-3 border-t border-zinc-800">
                    <span className="text-sm font-bold text-zinc-400">Total Due</span>
                    <span className="text-4xl font-black text-amber-400 tabular-nums">৳{payAmount}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep('select')}
                className="w-full py-3 text-sm font-bold text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800/60 rounded-xl transition-colors flex items-center justify-center gap-2 border border-zinc-800"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Modify Selection
              </button>
            </aside>

            {/* Form side */}
            <div className="xl:col-span-8 space-y-5">
              <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7 md:p-9 space-y-8">
                <div>
                  <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">Student Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {(
                      [
                        { label: 'Full Name', key: 'studentName', type: 'text', placeholder: 'John Doe' },
                        { label: 'Email Address', key: 'studentEmail', type: 'email', placeholder: 'hello@example.com' },
                      ] as const
                    ).map(f => (
                      <div key={f.key}>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">{f.label}</label>
                        <input
                          type={f.type}
                          required
                          value={form[f.key]}
                          onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                          placeholder={f.placeholder}
                          className="w-full px-5 py-4 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/10 outline-none text-white placeholder-zinc-700 font-semibold text-base transition-all"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-zinc-800 pt-7">
                  <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
                    <CreditCard className="w-4 h-4" /> Payment Method
                  </label>
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-amber-400 bg-amber-400/5">
                    <div className="w-10 h-10 rounded-lg bg-amber-400/10 flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">SSLCommerz</p>
                      <p className="text-xs text-zinc-500 font-semibold">Card · bKash · Nagad · Rocket · Bank</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-800 pt-7">
                  <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
                    <Tag className="w-4 h-4" /> Coupon Code
                  </label>
                  <input
                    type="text"
                    value={form.couponCode}
                    onChange={e => setForm(f => ({ ...f, couponCode: e.target.value }))}
                    placeholder="PROMO CODE"
                    className="w-full px-5 py-4 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/10 outline-none text-white placeholder-zinc-700 font-bold text-sm tracking-widest uppercase transition-all"
                  />
                </div>

                <div className="flex items-start gap-3 p-4 bg-zinc-950 rounded-xl border border-zinc-800 text-xs font-semibold text-zinc-500">
                  <AlertCircle className="w-4 h-4 text-zinc-600 flex-shrink-0 mt-0.5" />
                  Online enrollments require admin review. Access is activated upon payment verification.
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isCashSubmitting || isSslSubmitting}
                  className="w-full py-5 bg-amber-400 hover:bg-amber-300 disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-900 font-black rounded-xl shadow-lg shadow-amber-400/10 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-3 text-base tracking-wide"
                >
                  {isSslSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
                  {isSslSubmitting ? 'Processing…' : `Pay with SSLCommerz — ৳${payAmount}`}
                </button>
              </form>

              {/* Cash option */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Banknote className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">Pay In Person</h3>
                    <p className="text-xs text-zinc-600 font-semibold">Walk-in cash payment at office</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed mb-5">
                  Select this for direct cash payment. Status will be set to{' '}
                  <span className="font-bold text-amber-400/80 bg-amber-400/10 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider mx-0.5">running</span>{' '}
                  pending final confirmation.
                </p>
                <button
                  type="button"
                  onClick={handleCashPayment}
                  disabled={isCashSubmitting || isSubmitting}
                  className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-800/50 text-zinc-300 hover:text-white disabled:text-zinc-600 font-bold rounded-xl transition-all flex items-center justify-center gap-2.5 text-sm border border-zinc-700"
                >
                  {isCashSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Banknote className="w-4 h-4" />}
                  {isCashSubmitting ? 'Registering…' : 'Confirm Cash Registration'}
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* SUCCESS */}
        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: 'spring', bounce: 0.35 }}
            className="max-w-2xl mx-auto text-center py-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.1 }}
              className="w-24 h-24 rounded-full bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center mx-auto mb-10"
            >
              <CheckCircle className="w-12 h-12 text-emerald-400" />
            </motion.div>

            <h2 className="text-5xl font-black text-white mb-4 tracking-tight">You&apos;re in.</h2>
            <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
              Your enrollment has been recorded. Our team will verify payment and activate your access shortly.
            </p>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-7 py-5 mb-10 inline-block text-left">
              <p className="text-xs text-zinc-600 font-semibold uppercase tracking-widest mb-1">Confirmation sent to</p>
              <p className="text-white font-black text-lg truncate">{form.studentEmail}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/courses"
                className="group inline-flex items-center gap-2 px-9 py-4 bg-amber-400 hover:bg-amber-300 text-zinc-900 font-black rounded-xl transition-all duration-200 text-sm tracking-wide shadow-lg shadow-amber-400/10 hover:-translate-y-0.5"
              >
                Explore More Courses
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <button
                onClick={() => {
                  setStep('select');
                  setSelectedCourseIds([]);
                }}
                className="inline-flex items-center justify-center px-9 py-4 bg-transparent border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white font-bold rounded-xl transition-all duration-200 text-sm hover:-translate-y-0.5"
              >
                Register Another
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PurchasePage() {
  return (
    <main className="min-h-screen bg-zinc-950 relative overflow-hidden pt-24 pb-32 px-4 md:px-8 flex flex-col items-center">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[-20%] right-[-15%] w-[700px] h-[700px] rounded-full bg-amber-500/[0.04] blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-15%] w-[700px] h-[700px] rounded-full bg-indigo-500/[0.04] blur-[120px]" />
        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.4) 1px,transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />
      </div>

      <style jsx global>{`
        .text-stroke {
          -webkit-text-stroke: 2px #fbbf24;
          color: transparent;
        }
      `}</style>

      <Suspense
        fallback={
          <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 w-full">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border border-zinc-800 rounded-full" />
              <div className="absolute inset-0 border border-amber-400 rounded-full border-t-transparent animate-spin" />
            </div>
            <p className="text-zinc-600 text-sm tracking-widest uppercase font-semibold">Initializing…</p>
          </div>
        }
      >
        <PurchasePageContent />
      </Suspense>
    </main>
  );
}
