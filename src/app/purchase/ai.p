look at the url = "/purchase?courseId=69dc1ef4293d681a7431e78c&checkout=true"

and here is example of page.tsx 
```
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

const PAYMENT_METHODS = ['Card', 'PayPal', 'Bank Transfer', 'bKash', 'Nagad'];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, type: 'spring', bounce: 0.4 } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

function PurchasePageContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const urlCourseId = searchParams.get('courseId');

  const { data: coursesData, isLoading: coursesLoading, error: coursesError } = useGetCoursesQuery({ page: 1, limit: 50 });
  const [addEnrollment, { isLoading: isSubmitting }] = useAddEnrollmentMutation();

  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [step, setStep] = useState<'select' | 'checkout' | 'success'>('select');
  const [isCashSubmitting, setIsCashSubmitting] = useState(false);

  const [form, setForm] = useState({
    studentName: '',
    studentEmail: '',
    paymentMethod: 'Card',
    couponCode: '',
  });

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (session?.user) {
      setForm(f => ({
        ...f,
        studentName: session.user.name || '',
        studentEmail: session.user.email || '',
      }));
    }
  }, [session]);

  const courses: Course[] = useMemo(() => coursesData?.data?.courses || [], [coursesData]);

  useEffect(() => {
    if (courses.length > 0 && !hasInitialized.current) {
      if (urlCourseId && courses.some(c => c._id === urlCourseId)) {
        setSelectedCourseIds([urlCourseId]);
      } else {
        setSelectedCourseIds([courses[0]._id]);
      }
      hasInitialized.current = true;
    }
  }, [courses, urlCourseId]);

  const selectedCourses = courses.filter(c => selectedCourseIds.includes(c._id));
  const totalReal = selectedCourses.reduce((sum, c) => sum + (c.realPrice || 0), 0);
  const totalDiscount = selectedCourses.reduce((sum, c) => sum + (c.discountPrice || 0), 0);
  const payAmount = totalDiscount > 0 ? totalDiscount : totalReal;

  const toggleCourse = (id: string) => {
    setSelectedCourseIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const removeCourse = (id: string) => {
    setSelectedCourseIds(prev => prev.filter(x => x !== id));
  };

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

    try {
      const payload = {
        studentName: form.studentName.trim(),
        studentEmail: form.studentEmail.trim(),
        studentsStatus: 'pending',
        enrollCoursesIDS: selectedCourseIds,
        realPrice: totalReal,
        discountPrice: totalDiscount,
        paymentAmount: payAmount,
        paymentMethod: form.paymentMethod,
        couponCode: form.couponCode.trim() || null,
        checkedbyEmail: '',
        paymentStatus: 'pending',
      };

      const res = await addEnrollment(payload).unwrap();
      if (res?.ok) {
        setStep('success');
      } else {
        toast.error(res?.message || 'Purchase failed');
      }
    } catch {
      toast.error('Something went wrong. Try again.');
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
      const payload = {
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
      };
      const res = await addEnrollment(payload).unwrap();
      if (res?.ok) {
        setStep('success');
      } else {
        toast.error(res?.message || 'Cash enrollment failed');
      }
    } catch {
      toast.error('Something went wrong. Try again.');
    } finally {
      setIsCashSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto relative z-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }} className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-md border border-blue-100 text-blue-700 font-bold text-sm mb-6 shadow-sm">
          <ShoppingCart className="w-4 h-4" />
          Secure Enrollment
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight">
          Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Course</span>
        </h1>
        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium">
          Transform your future. Select the courses you wish to master and proceed to checkout.
        </p>
      </motion.div>

      <div className="flex items-center justify-center gap-2 mb-12">
        {(['select', 'checkout', 'success'] as const).map((s, i) => (
          <React.Fragment key={s}>
            <motion.div
              initial={false}
              animate={{ scale: step === s ? 1.05 : 1 }}
              className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full transition-all duration-300 shadow-sm ${
                step === s
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-200'
                  : i < ['select', 'checkout', 'success'].indexOf(step)
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    : 'bg-white text-slate-400 border border-slate-200'
              }`}
            >
              {i < ['select', 'checkout', 'success'].indexOf(step) ? <CheckCircle className="w-4 h-4" /> : <span>{i + 1}</span>}
              <span className="capitalize">{s}</span>
            </motion.div>
            {i < 2 && <ChevronRight className="w-5 h-5 text-slate-300" />}
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 'select' && (
          <motion.div key="select" initial="hidden" animate="show" exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }} variants={staggerContainer}>
            {coursesLoading && (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <span className="mt-4 text-slate-500 text-lg font-medium">Curating courses...</span>
              </div>
            )}

            {coursesError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-24 text-red-500 bg-red-50 rounded-3xl border border-red-100"
              >
                <AlertCircle className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-bold mb-2">Connection Interrupted</h3>
                <p className="text-red-400">Failed to load courses. Please refresh the page.</p>
              </motion.div>
            )}

            {!coursesLoading && !coursesError && courses.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-32 text-slate-400 bg-white rounded-3xl border border-slate-100 shadow-sm"
              >
                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-xl font-medium text-slate-500">No courses available at the moment.</p>
              </motion.div>
            )}

            {courses.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {courses
                    .filter(c => c.isActive !== false)
                    .map(course => {
                      const selected = selectedCourseIds.includes(course._id);
                      return (
                        <motion.div
                          key={course._id}
                          variants={fadeInUp}
                          whileHover={{ y: -8, scale: 1.01 }}
                          onClick={() => toggleCourse(course._id)}
                          className={`group relative bg-white/80 backdrop-blur-xl rounded-3xl cursor-pointer transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl ${
                            selected ? 'border-2 border-blue-500 ring-4 ring-blue-500/10' : 'border-2 border-white hover:border-blue-200'
                          }`}
                        >
                          {selected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full flex items-center justify-center z-10 shadow-lg shadow-blue-500/30"
                            >
                              <CheckCircle className="w-5 h-5 text-white" />
                            </motion.div>
                          )}

                          <div className="p-8">
                            <h3 className="text-xl font-black text-slate-900 mb-3 pr-10 leading-tight group-hover:text-blue-600 transition-colors">
                              {course.courseTitle}
                            </h3>
                            {course.courseDescription && <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">{course.courseDescription}</p>}

                            <div className="space-y-3 mb-8 bg-slate-50/50 p-4 rounded-2xl">
                              {course.totalDuration && (
                                <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                  </div>
                                  {course.totalDuration}
                                </div>
                              )}
                              {course.totalClass != null && (
                                <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                    <MonitorPlay className="w-4 h-4 text-indigo-600" />
                                  </div>
                                  {course.totalClass} Classes
                                </div>
                              )}
                              {course.totalMockTest != null && (
                                <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-4 h-4 text-purple-600" />
                                  </div>
                                  {course.totalMockTest} Mock Tests
                                </div>
                              )}
                            </div>

                            <div className="flex items-end gap-3 mt-auto">
                              {course.discountPrice != null && course.discountPrice > 0 ? (
                                <>
                                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                    ৳{course.discountPrice}
                                  </span>
                                  {course.realPrice != null && course.realPrice > 0 && (
                                    <span className="text-slate-400 font-medium line-through mb-1">৳{course.realPrice}</span>
                                  )}
                                </>
                              ) : course.realPrice != null && course.realPrice > 0 ? (
                                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                  ৳{course.realPrice}
                                </span>
                              ) : (
                                <span className="text-sm font-semibold text-slate-400 italic">Price on request</span>
                              )}
                            </div>
                          </div>

                          <div
                            className={`px-8 py-4 text-center text-sm font-bold transition-all duration-300 ${selected ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'bg-slate-50 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600'}`}
                          >
                            {selected ? 'Course Selected' : 'Select This Course'}
                          </div>
                        </motion.div>
                      );
                    })}
                </div>

                <AnimatePresence>
                  {selectedCourseIds.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 40, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 40, scale: 0.95 }}
                      transition={{ type: 'spring', bounce: 0.3 }}
                      className="sticky bottom-8 z-40 bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ring-1 ring-slate-200/50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                            {selectedCourseIds.length}
                          </span>
                          <p className="text-slate-900 font-bold">Courses Selected</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedCourses.map(c => (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              key={c._id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-bold"
                            >
                              {c.courseTitle}
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  removeCourse(c._id);
                                }}
                                className="w-5 h-5 flex items-center justify-center rounded-full bg-slate-200 hover:bg-red-500 hover:text-white transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </motion.span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-6 w-full md:w-auto">
                        <div className="text-right hidden sm:block">
                          <p className="text-sm font-semibold text-slate-400">Total Payable</p>
                          <p className="text-2xl font-black text-slate-900">৳{payAmount}</p>
                        </div>
                        <button
                          onClick={handleCheckout}
                          className="flex-1 md:flex-none px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-2xl shadow-lg shadow-blue-500/30 transition-all hover:shadow-blue-500/50 hover:-translate-y-1 flex items-center justify-center gap-3 text-lg"
                        >
                          Proceed to Checkout <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </motion.div>
        )}

        {step === 'checkout' && (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, x: 20, filter: 'blur(5px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 p-8">
                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-blue-600" /> Order Summary
                </h2>
                <div className="space-y-4 mb-8">
                  {selectedCourses.map(c => (
                    <div key={c._id} className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-sm font-bold text-slate-700 leading-snug">{c.courseTitle}</span>
                      </div>
                      <span className="text-base font-black text-slate-900 flex-shrink-0 mt-0.5">
                        ৳{(c.discountPrice && c.discountPrice > 0 ? c.discountPrice : c.realPrice) || 0}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-6">
                  {totalReal > totalDiscount && totalDiscount > 0 && (
                    <div className="flex justify-between text-sm font-semibold text-slate-500 mb-3">
                      <span>Original Price</span>
                      <span className="line-through decoration-slate-300">৳{totalReal}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-xl font-black text-slate-900 pt-3 border-t border-slate-200/60">
                    <span>Total</span>
                    <span className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">৳{payAmount}</span>
                  </div>
                </div>

                <button
                  onClick={() => setStep('select')}
                  className="w-full py-3 text-sm font-bold text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" /> Modify Selection
                </button>
              </div>

              <div className="lg:col-span-3 space-y-6">
                <form
                  onSubmit={handleSubmit}
                  className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 p-8 space-y-6"
                >
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Student Details</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        required
                        value={form.studentName}
                        onChange={e => setForm(f => ({ ...f, studentName: e.target.value }))}
                        placeholder="John Doe"
                        className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-900 placeholder-slate-400 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        required
                        value={form.studentEmail}
                        onChange={e => setForm(f => ({ ...f, studentEmail: e.target.value }))}
                        placeholder="hello@example.com"
                        className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-900 placeholder-slate-400 font-medium"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4">
                      <CreditCard className="w-5 h-5 text-blue-500" /> Payment Method
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {PAYMENT_METHODS.map(method => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, paymentMethod: method }))}
                          className={`py-3 px-4 rounded-2xl border-2 text-sm font-bold transition-all ${
                            form.paymentMethod === method
                              ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                              : 'border-slate-100 text-slate-500 hover:border-blue-200 hover:bg-blue-50/30'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                      <Tag className="w-5 h-5 text-blue-500" /> Coupon Code <span className="text-slate-400 font-medium text-xs">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={form.couponCode}
                      onChange={e => setForm(f => ({ ...f, couponCode: e.target.value }))}
                      placeholder="ENTER CODE"
                      className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-900 placeholder-slate-400 font-bold uppercase tracking-wide"
                    />
                  </div>

                  <div className="bg-amber-50/80 border-2 border-amber-100 rounded-2xl p-5 text-sm font-medium text-amber-800 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" />
                    <p>Your enrollment requires administrative review. Upon verification, your course access will be activated immediately.</p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-black rounded-2xl shadow-xl shadow-blue-500/30 transition-all hover:shadow-blue-500/50 hover:-translate-y-1 flex items-center justify-center gap-3 text-lg"
                  >
                    {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShoppingCart className="w-6 h-6" />}
                    {isSubmitting ? 'Processing Order...' : `Complete Purchase — ৳${payAmount}`}
                  </button>
                </form>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200/60 rounded-3xl p-8 shadow-lg shadow-amber-100/50"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-amber-100">
                      <Banknote className="w-7 h-7 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-amber-900">Pay In Person</h3>
                      <p className="text-sm font-semibold text-amber-700/80">Immediate enrollment activation</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-amber-800 mb-6 leading-relaxed">
                    Select this option for direct cash payments. The student profile will be configured to{' '}
                    <strong className="bg-amber-200/50 px-2 py-0.5 rounded text-amber-900">running</strong>, pending final payment confirmation by our
                    administrative team.
                  </p>
                  <button
                    type="button"
                    onClick={handleCashPayment}
                    disabled={isCashSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-amber-300 disabled:to-amber-400 text-white font-black rounded-2xl shadow-lg shadow-amber-500/30 transition-all hover:shadow-amber-500/50 hover:-translate-y-1 flex items-center justify-center gap-3 text-lg"
                  >
                    {isCashSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Banknote className="w-6 h-6" />}
                    {isCashSubmitting ? 'Processing...' : `Confirm Cash Registration`}
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
            className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/50 max-w-3xl mx-auto"
          >
            <div className="relative mb-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                className="w-32 h-32 bg-gradient-to-tr from-emerald-400 to-teal-400 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 relative z-10"
              >
                <CheckCircle className="w-16 h-16 text-white" />
              </motion.div>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                className="absolute inset-0 bg-emerald-400 rounded-full z-0"
              />
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Registration Complete!</h2>
            <p className="text-slate-500 text-lg md:text-xl mb-3 max-w-lg font-medium leading-relaxed">
              Your enrollment request has been successfully recorded. Our administrative team will review your payment and authorize course access shortly.
            </p>
            <div className="bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl mb-10">
              <p className="text-slate-600 text-sm font-medium">
                Confirmation details have been sent to <strong className="text-slate-900 block mt-1 text-base">{form.studentEmail}</strong>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/courses"
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-2xl transition-all hover:-translate-y-1 shadow-lg shadow-blue-500/30 flex items-center justify-center"
              >
                Explore More Courses
              </Link>
              <button
                onClick={() => {
                  setStep('select');
                  setSelectedCourseIds([]);
                }}
                className="px-10 py-4 bg-white border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-black rounded-2xl transition-all flex items-center justify-center"
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
    <main className="min-h-screen bg-[#f8fafc] relative overflow-hidden pt-24 pb-32 px-4 md:px-8">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50/80 to-transparent -z-10 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-blue-400/5 blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-indigo-400/5 blur-[120px] -z-10 pointer-events-none" />

      <Suspense
        fallback={
          <div className="min-h-[60vh] flex flex-col items-center justify-center w-full">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
            </div>
            <p className="text-xl font-bold text-slate-400 animate-pulse">Initializing Interface...</p>
          </div>
        }
      >
        <PurchasePageContent />
      </Suspense>
    </main>
  );
}

```

If found checkout=true in url then auto display checkout options. skip select option. 