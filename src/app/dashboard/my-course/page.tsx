'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Clock,
  Award,
  PlayCircle,
  FileText,
  AlertTriangle,
  RefreshCw,
  User,
  Mail,
  CalendarCheck,
  Activity,
  Unlock,
  Lock,
  ArrowRight,
  X,
  Loader2,
  Sparkles,
  CheckCircle,
  Info,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useGetCoursesQuery } from '@/redux/features/courses/coursesSlice';
import { useGetMyCoursesQuery } from '@/redux/features/my-courses/myCoursesSlice';
import { useGetEnrollmentsQuery, useAddEnrollmentMutation } from '@/redux/features/enrollments/enrollmentsSlice';

interface ICourse {
  _id: string;
  courseTitle: string;
  courseDescription?: string;
  totalClass?: number;
  totalAssignment?: number;
  totalDuration?: string;
  totalMockTest?: number;
  realPrice?: number;
  discountPrice?: number;
  challengeDay?: number;
  totalLecture?: number;
  isActive?: boolean;
}

interface IMyCourse {
  _id: string;
  courseId: ICourse | string;
  progress?: number;
  enrolledAt?: string;
}

interface IEnrollment {
  _id: string;
  courseId: string | ICourse;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function MyCoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const { data: coursesData, isLoading: isCoursesLoading, error: coursesError, refetch: refetchCourses } = useGetCoursesQuery({ page: 1, limit: 100 });

  const {
    data: myCoursesData,
    isLoading: isMyCoursesLoading,
    error: myCoursesError,
    refetch: refetchMyCourses,
  } = useGetMyCoursesQuery({ page: 1, limit: 100 });

  const { data: enrollmentsData, refetch: refetchEnrollments } = useGetEnrollmentsQuery({ page: 1, limit: 100 });
  const [addEnrollment] = useAddEnrollmentMutation();

  const isLoading = isCoursesLoading || isMyCoursesLoading;
  const error = coursesError || myCoursesError;

  const { enrolledCourses, notEnrolledCourses, hasData } = useMemo(() => {
    const allCourses: ICourse[] = coursesData?.data?.courses || [];
    const myCoursesList: IMyCourse[] = myCoursesData?.data?.myCourses || [];

    const enrolledCourseIds = new Set(myCoursesList.map(mc => (typeof mc.courseId === 'string' ? mc.courseId : mc.courseId._id)));

    const enrolled = allCourses.filter(c => enrolledCourseIds.has(c._id));
    const notEnrolled = allCourses.filter(c => !enrolledCourseIds.has(c._id) && c.isActive);

    return {
      enrolledCourses: enrolled,
      notEnrolledCourses: notEnrolled,
      hasData: myCoursesList.length > 0,
    };
  }, [coursesData, myCoursesData]);

  const studentInfo = {
    name: 'Toufiquer Rahman',
    email: 'toufiquer.0@gmail.com',
    todaysAttendance: hasData ? 'Present' : 'In-complete',
    totalAttendance: hasData ? 142 : 0,
  };

  const handleRefetch = () => {
    refetchCourses();
    refetchMyCourses();
    refetchEnrollments();
  };

  const handleEnrollment = async () => {
    if (!selectedCourse) return;

    setIsEnrolling(true);

    const enrollmentsList: IEnrollment[] =
      (enrollmentsData as { data?: { enrollments?: IEnrollment[] } })?.data?.enrollments || (enrollmentsData as { data?: IEnrollment[] })?.data || [];

    const hasApplied = enrollmentsList.some(e => {
      const eCourseId = typeof e.courseId === 'string' ? e.courseId : e.courseId._id;
      return eCourseId === selectedCourse._id;
    });

    if (hasApplied) {
      setAlreadyApplied(true);
      setIsEnrolling(false);
      await new Promise(resolve => setTimeout(resolve, 3000));
      setAlreadyApplied(false);
      setSelectedCourse(null);
      return;
    }

    try {
      await addEnrollment({ courseId: selectedCourse._id }).unwrap();
      setEnrollSuccess(true);
      await new Promise(resolve => setTimeout(resolve, 2500));
      setEnrollSuccess(false);
      setSelectedCourse(null);
    } catch (err) {
      setIsEnrolling(false);
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleCloseModal = () => {
    if (!isEnrolling) {
      setSelectedCourse(null);
      setAlreadyApplied(false);
      setEnrollSuccess(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 pt-[90px] pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full animate-pulse" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-2xl">
                <BookOpen className="h-10 w-10 text-white animate-pulse" />
              </div>
            </div>
            <div className="text-white text-xl font-semibold mt-4">Loading your journey...</div>
          </motion.div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 pt-[90px] pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6 max-w-md">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/30 blur-3xl rounded-full" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-2xl">
                <AlertTriangle className="h-10 w-10 text-white" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Oops! Something went wrong</h2>
              <p className="text-slate-400 text-sm">We could not load your courses at the moment.</p>
            </div>
            <Button onClick={handleRefetch} variant="outline" className="gap-2 bg-transparent text-white border-white/20 hover:bg-white/10">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 pt-[90px] pb-20 px-4 md:px-8 overflow-hidden relative">
      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent" />
          <div className="relative p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                    {studentInfo.name}
                  </h1>
                  <div className="flex items-center gap-2 text-slate-400 text-sm md:text-base mt-1">
                    <Mail className="h-4 w-4 text-indigo-400" />
                    <span>{studentInfo.email}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="flex items-center gap-4 bg-slate-950/50 rounded-2xl p-4 border border-white/5 shadow-inner flex-1 md:flex-initial">
                <div className={`p-2 rounded-xl ${hasData ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                  <CalendarCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Today&apos;s Status</p>
                  <p className={`text-lg font-bold ${hasData ? 'text-emerald-400' : 'text-orange-400'}`}>{studentInfo.todaysAttendance}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-950/50 rounded-2xl p-4 border border-white/5 shadow-inner flex-1 md:flex-initial">
                <div className={`p-2 rounded-xl ${hasData ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'}`}>
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Attendance</p>
                  <p className={`text-lg font-bold ${hasData ? 'text-blue-400' : 'text-slate-400'}`}>{studentInfo.totalAttendance} Days</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <section>
          <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
            <Unlock className="h-6 w-6 text-indigo-400" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">My Enrolled Courses</h2>
          </div>

          {enrolledCourses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-[30vh] border border-dashed border-indigo-500/30 rounded-3xl bg-indigo-950/20 p-8"
            >
              <BookOpen className="h-12 w-12 text-indigo-400/50 mb-4" />
              <p className="text-slate-400 text-center max-w-md">
                You haven&apos;t enrolled in any courses yet. Explore our available courses below to get started on your journey.
              </p>
            </motion.div>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map(course => (
                <motion.div
                  key={`enrolled-${course._id}`}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.01 }}
                  className="group relative bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-indigo-500/20 overflow-hidden shadow-xl shadow-indigo-500/5 flex flex-col"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="p-6 pb-4 flex-1 relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                        Enrolled
                      </span>
                      <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        {course.challengeDay || 0} Days
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{course.courseTitle}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2 mb-6">{course.courseDescription || 'No description available.'}</p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <PlayCircle className="h-4 w-4 text-indigo-400" />
                        <span className="text-sm font-medium">{course.totalClass || 0} Classes</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Clock className="h-4 w-4 text-indigo-400" />
                        <span className="text-sm font-medium">{course.totalDuration || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <FileText className="h-4 w-4 text-indigo-400" />
                        <span className="text-sm font-medium">{course.totalAssignment || 0} Tasks</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Award className="h-4 w-4 text-indigo-400" />
                        <span className="text-sm font-medium">{course.totalMockTest || 0} Tests</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto z-10 p-6 pt-4 border-t border-white/5 bg-slate-950/40">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-12 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
                      Continue Learning
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        <section>
          <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
            <Lock className="h-6 w-6 text-slate-400" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">Available Courses</h2>
          </div>

          {notEnrolledCourses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-[30vh] border border-dashed border-white/10 rounded-3xl bg-slate-900/20 p-8"
            >
              <Award className="h-12 w-12 text-slate-500 mb-4" />
              <p className="text-slate-400 text-center max-w-md">You have enrolled in all available courses! Incredible dedication.</p>
            </motion.div>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notEnrolledCourses.map(course => (
                <motion.div
                  key={`available-${course._id}`}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="group relative bg-slate-900/40 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden hover:border-slate-500/30 hover:bg-slate-900/60 transition-all duration-300 flex flex-col grayscale-[20%] hover:grayscale-0"
                >
                  <div className="p-6 pb-4 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-800 border border-slate-700 rounded-full">
                        {course.challengeDay || 0} Days
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 opacity-90">{course.courseTitle}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2 mb-6">{course.courseDescription || 'No description available.'}</p>

                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div className="flex items-center gap-2 text-slate-400">
                        <PlayCircle className="h-4 w-4 text-slate-500" />
                        <span className="text-sm font-medium">{course.totalClass || 0} Classes</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="h-4 w-4 text-slate-500" />
                        <span className="text-sm font-medium">{course.totalDuration || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex flex-col">
                    <div className="px-6 py-4 bg-slate-950/30 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-slate-600" />
                        <span className="text-sm text-slate-400">{course.totalLecture || 0} Lectures</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500 line-through">৳{course.realPrice || 0}</span>
                        <span className="text-2xl font-bold text-white">৳{course.discountPrice || 0}</span>
                      </div>
                    </div>
                    <div className="px-6 pb-6 pt-2 bg-slate-950/30">
                      <Button
                        onClick={() => setSelectedCourse(course)}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-white/10 rounded-xl h-12 transition-all group-hover:border-indigo-500/50 group-hover:text-indigo-300"
                      >
                        Enroll Now
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </div>

      <AnimatePresence>
        {selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-slate-900 border border-indigo-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/20 w-full max-w-md relative"
            >
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-transparent" />

              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors z-10"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="p-8 relative z-10 flex flex-col h-full">
                {alreadyApplied ? (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30 mb-6 text-orange-400 shadow-inner">
                      <Info className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Already Applied</h3>
                    <p className="text-slate-400 text-sm">You have already submitted an enrollment request for {selectedCourse.courseTitle}.</p>
                  </motion.div>
                ) : enrollSuccess ? (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 mb-6 text-emerald-400 shadow-inner">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Enrollment Requested!</h3>
                    <p className="text-slate-400 text-sm">Your request for {selectedCourse.courseTitle} is being processed successfully.</p>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 mb-6 text-indigo-400 shadow-inner">
                      <Sparkles className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{selectedCourse.courseTitle}</h3>
                    <p className="text-slate-400 text-sm mb-8 line-clamp-3">
                      {selectedCourse.courseDescription || 'Get ready to unlock your potential with this comprehensive course.'}
                    </p>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/50 border border-white/5 mb-8">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Course Price</p>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 line-through text-sm">৳{selectedCourse.realPrice || 0}</span>
                          <span className="text-xl font-bold text-white">৳{selectedCourse.discountPrice || 0}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Duration</p>
                        <span className="text-slate-300 font-medium text-sm">{selectedCourse.challengeDay || 0} Days</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleEnrollment}
                      disabled={isEnrolling}
                      className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/25 transition-all text-lg font-semibold"
                    >
                      {isEnrolling ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Confirm Enrollment'
                      )}
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
