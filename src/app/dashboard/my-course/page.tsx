'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Clock,
  Award,
  PlayCircle,
  AlertTriangle,
  RefreshCw,
  User,
  Mail,
  CalendarCheck,
  Activity,
  Unlock,
  X,
  Loader2,
  Sparkles,
  CheckCircle,
  Info,
  Clock4,
  ArrowRight,
  Trophy,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useGetCoursesQuery } from '@/redux/features/courses/coursesSlice';
import { useGetMyCoursesQuery } from '@/redux/features/my-courses/myCoursesSlice';
import { useGetEnrollmentsQuery, useAddEnrollmentMutation } from '@/redux/features/enrollments/enrollmentsSlice';
import { useSession } from '@/lib/auth-client';

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lectureData?: any;
}

interface ICourseWithProgress extends ICourse {
  progress: number;
}

interface IAttendanceData {
  ClassName: string;
  status: 'complete' | 'incomplete';
  completeDate?: string;
}

interface IAttendance {
  courseID: string;
  data: IAttendanceData[];
}

interface IMyCourse {
  _id: string;
  courseId: ICourse | string;
  progress?: number;
  enrolledAt?: string;
  attenDance?: IAttendance[];
}

interface IEnrollment {
  _id: string;
  studentEmail: string;
  enrollCoursesIDS: string[];
  paymentStatus: string;
  studentsStatus: string;
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
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState<string>('');
  const session = useSession();
  const user = session?.data?.user;

  const studentInfo = {
    name: user?.name || '',
    email: user?.email || '',
  };

  // Queries
  const { data: coursesData, isLoading: isCoursesLoading, error: coursesError, refetch: refetchCourses } = useGetCoursesQuery({ page: 1, limit: 100 });
  console.log('coursesData', coursesData);
  const {
    data: myCoursesData,
    isLoading: isMyCoursesLoading,
    error: myCoursesError,
    refetch: refetchMyCourses,
  } = useGetMyCoursesQuery({ page: 1, limit: 100, q: studentInfo.email }, { skip: !studentInfo.email });

  const {
    data: enrollmentsData,
    isLoading: isEnrollmentsLoading,
    error: enrollmentsError,
    refetch: refetchEnrollments,
  } = useGetEnrollmentsQuery({ page: 1, limit: 100, q: studentInfo.email }, { skip: !studentInfo.email });

  // Mutation
  const [addEnrollment] = useAddEnrollmentMutation();

  const isLoading = isCoursesLoading || isMyCoursesLoading || isEnrollmentsLoading;
  const error = coursesError || myCoursesError || enrollmentsError;

  // Categorize courses and calculate accurate dynamic attendance & progress
  const { runningCourses, completedCourses, pendingCourses, availableCourses, totalAttendanceDays, isPresentToday } = useMemo(() => {
    const allCourses: ICourse[] = coursesData?.data?.courses || [];
    const myCoursesList: IMyCourse[] = myCoursesData?.data?.myCourses || [];
    const userEnrollments: IEnrollment[] = enrollmentsData?.data?.enrollments || [];

    const running: ICourseWithProgress[] = [];
    const completed: ICourseWithProgress[] = [];
    const pending: ICourse[] = [];
    const available: ICourse[] = [];

    // Calculate Total unique attendance days across all courses
    const totalDaysSet = new Set<string>();

    myCoursesList.forEach(mc => {
      if (mc.attenDance && Array.isArray(mc.attenDance)) {
        mc.attenDance.forEach(att => {
          if (att.data && Array.isArray(att.data)) {
            att.data.forEach(d => {
              if (d.status === 'complete' && d.completeDate) {
                // Get the YYYY-MM-DD portion for distinct day tracking
                const dateStr = new Date(d.completeDate).toISOString().split('T')[0];
                totalDaysSet.add(dateStr);
              }
            });
          }
        });
      }
    });

    const todayStr = new Date().toISOString().split('T')[0];
    const isPresentToday = totalDaysSet.has(todayStr);

    allCourses.forEach(course => {
      const relatedEnrollments = userEnrollments.filter(e => e.enrollCoursesIDS?.includes(course._id));

      // Match the correct tracking progress record for this course
      const myCourseRecord = myCoursesList.find(mc => {
        const mcId = typeof mc.courseId === 'string' ? mc.courseId : (mc.courseId as ICourse)?._id;
        return mcId === course._id;
      });

      if (relatedEnrollments.length > 0) {
        // Active enrollment criteria
        const isActive = relatedEnrollments.some(e => e.paymentStatus === 'completed' && e.studentsStatus === 'running');

        if (isActive) {
          let calculatedProgress = myCourseRecord?.progress || 0;

          // Dynamic logic mirrored from my-class/page.tsx for 100% accurate progress
          if (course.lectureData) {
            try {
              let parsedData = course.lectureData;
              if (typeof parsedData === 'string') parsedData = JSON.parse(parsedData);
              else if (typeof parsedData === 'object' && !Array.isArray(parsedData) && parsedData !== null) {
                parsedData = Object.values(parsedData);
              }

              if (Array.isArray(parsedData) && parsedData.length > 0) {
                const totalClasses = parsedData.length;
                let completedCount = 0;

                const courseAtt = myCourseRecord?.attenDance?.find((a: IAttendance) => a.courseID === course._id);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                parsedData.forEach((cls: any) => {
                  const title = cls?.title || 'Untitled Class';
                  const classAtt = courseAtt?.data?.find((d: IAttendanceData) => d.ClassName === title);
                  if (classAtt?.status === 'complete') {
                    completedCount++;
                  }
                });

                calculatedProgress = Math.round((completedCount / totalClasses) * 100);
              }
            } catch (err) {
              console.error('Failed to parse lectureData for dynamic progress calculation', err);
            }
          }

          if (calculatedProgress >= 100) {
            completed.push({ ...course, progress: 100 });
          } else {
            running.push({ ...course, progress: calculatedProgress });
          }
        } else {
          // Exists in enrollments but is pending approval or payment
          pending.push(course);
        }
      } else if (course.isActive) {
        // Not found in any enrollments, fully available
        available.push(course);
      }
    });

    return {
      runningCourses: running,
      completedCourses: completed,
      pendingCourses: pending,
      availableCourses: available,
      totalAttendanceDays: totalDaysSet.size,
      isPresentToday,
      hasData: myCoursesList.length > 0 || userEnrollments.length > 0,
    };
  }, [coursesData, myCoursesData, enrollmentsData]);

  const displayAttendance = {
    todaysAttendance: isPresentToday ? 'Present' : 'Incomplete',
    totalAttendance: totalAttendanceDays,
  };

  // Reset errors and success state when modal closes/opens
  useEffect(() => {
    if (!selectedCourse) {
      setEnrollmentError('');
      setEnrollSuccess(false);
    }
  }, [selectedCourse]);

  const handleRefetch = () => {
    refetchCourses();
    refetchMyCourses();
    refetchEnrollments();
  };

  const handleAttendClass = (courseId: string) => {
    router.push(`/dashboard/my-course/my-class?courseId=${courseId}`);
  };

  const handleEnrollment = async () => {
    if (!selectedCourse) return;

    setIsEnrolling(true);
    setEnrollmentError('');

    try {
      const userEnrollments: IEnrollment[] = enrollmentsData?.data?.enrollments || [];
      const alreadyApplied = userEnrollments.some(enrollment => enrollment.enrollCoursesIDS?.includes(selectedCourse._id));

      if (alreadyApplied) {
        setEnrollmentError('You already applied for this enrollment. Please wait for approval.');
        setIsEnrolling(false);
        return;
      }

      const payload = {
        studentName: studentInfo.name,
        studentEmail: studentInfo.email,
        enrollCoursesIDS: [selectedCourse._id],
        realPrice: selectedCourse.realPrice || 0,
        discountPrice: selectedCourse.discountPrice || 0,
        paymentAmount: selectedCourse.discountPrice || 0,
        studentsStatus: 'pending',
        paymentStatus: 'pending',
      };

      await addEnrollment(payload).unwrap();

      setEnrollSuccess(true);
      refetchEnrollments(); // Update cache

      setTimeout(() => {
        setEnrollSuccess(false);
        setSelectedCourse(null);
      }, 2500);
    } catch (err) {
      console.error('Failed to enroll:', err);
      setEnrollmentError('Something went wrong during enrollment. Try again later.');
    } finally {
      setIsEnrolling(false);
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
        {/* ========================================================= */}
        {/* Header Profile Section */}
        {/* ========================================================= */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent pointer-events-none" />
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
                <div className={`p-2 rounded-xl ${isPresentToday ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                  <CalendarCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Today&apos;s Status</p>
                  <p className={`text-lg font-bold ${isPresentToday ? 'text-emerald-400' : 'text-orange-400'}`}>{displayAttendance.todaysAttendance}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-950/50 rounded-2xl p-4 border border-white/5 shadow-inner flex-1 md:flex-initial">
                <div className={`p-2 rounded-xl ${displayAttendance.totalAttendance > 0 ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'}`}>
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Attendance</p>
                  <p className={`text-lg font-bold ${displayAttendance.totalAttendance > 0 ? 'text-blue-400' : 'text-slate-400'}`}>
                    {displayAttendance.totalAttendance} Days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ========================================================= */}
        {/* SECTION 1: Active Running Courses (Indigo Theme) */}
        {/* ========================================================= */}
        <section>
          <div className="flex items-center gap-3 mb-8 border-b border-indigo-500/30 pb-4">
            <Unlock className="h-6 w-6 text-indigo-400" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">Running Courses</h2>
          </div>

          {runningCourses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-[20vh] border border-dashed border-indigo-500/30 rounded-3xl bg-indigo-950/10 p-8"
            >
              <BookOpen className="h-12 w-12 text-indigo-400/50 mb-4" />
              <p className="text-slate-400 text-center max-w-md">No active courses in progress right now.</p>
            </motion.div>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {runningCourses.map(course => (
                <motion.div
                  key={`running-${course._id}`}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.01 }}
                  className="group relative bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-indigo-500/30 overflow-hidden shadow-xl shadow-indigo-500/10 flex flex-col"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="p-6 pb-4 flex-1 relative z-10 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 rounded-full flex items-center gap-1">
                        <PlayCircle className="h-3 w-3" /> In Progress
                      </span>
                      <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-200 bg-indigo-900 border border-indigo-700 rounded-full">
                        {course.challengeDay || 0} Days
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{course.courseTitle}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2 mb-6 flex-1">{course.courseDescription || 'No description available.'}</p>

                    {/* Accurate Progress Bar inside Card */}
                    <div className="mt-auto mb-4">
                      <div className="flex justify-between text-xs mb-1.5 font-bold">
                        <span className="text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Activity className="w-3 h-3 text-indigo-500" /> Course Progress
                        </span>
                        <span className="text-indigo-400">{course.progress}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-800/80 rounded-full overflow-hidden shadow-inner border border-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress}%` }}
                          transition={{ duration: 1.2, ease: 'easeOut' }}
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 relative"
                        >
                          <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/20 blur-sm" />
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  <div className="z-10 p-6 pt-4 border-t border-indigo-500/20 bg-slate-950/60">
                    <Button
                      onClick={() => handleAttendClass(course._id)}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-12 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all font-semibold"
                    >
                      Resume Learning
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* ========================================================= */}
        {/* SECTION 2: Completed Courses (Emerald Theme) */}
        {/* ========================================================= */}
        {completedCourses.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8 border-b border-emerald-500/30 pb-4 mt-8">
              <Trophy className="h-6 w-6 text-emerald-400" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">Completed Courses</h2>
            </div>

            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedCourses.map(course => (
                <motion.div
                  key={`completed-${course._id}`}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.01 }}
                  className="group relative bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-emerald-500/30 overflow-hidden shadow-xl shadow-emerald-500/10 flex flex-col"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="p-6 pb-4 flex-1 relative z-10 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Mastered
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{course.courseTitle}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2 mb-6 flex-1">{course.courseDescription || 'No description available.'}</p>

                    {/* Progress Bar inside Card (100%) */}
                    <div className="mt-auto mb-4">
                      <div className="flex justify-between text-xs mb-1.5 font-bold">
                        <span className="text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-500" /> Status
                        </span>
                        <span className="text-emerald-400">100%</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-800/80 rounded-full overflow-hidden shadow-inner border border-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `100%` }}
                          transition={{ duration: 1.5, ease: 'easeOut' }}
                          className="h-full rounded-full bg-emerald-500 relative"
                        >
                          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%] animate-pulse" />
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  <div className="z-10 p-6 pt-4 border-t border-emerald-500/20 bg-slate-950/60">
                    <Button
                      onClick={() => handleAttendClass(course._id)}
                      variant="outline"
                      className="w-full bg-transparent border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 rounded-xl h-12 transition-all font-semibold"
                    >
                      Review Course
                      <BookOpen className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* ========================================================= */}
        {/* SECTION 3: Pending/Requested Courses (Orange Theme) */}
        {/* ========================================================= */}
        {pendingCourses.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8 border-b border-orange-500/30 pb-4 mt-8">
              <Clock4 className="h-6 w-6 text-orange-400" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">Pending Requests</h2>
            </div>

            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingCourses.map(course => (
                <motion.div
                  key={`pending-${course._id}`}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="group relative bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-orange-500/30 overflow-hidden hover:border-orange-500/50 hover:bg-slate-900/80 transition-all duration-300 flex flex-col"
                >
                  <div className="p-6 pb-4 flex-1 relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-300 bg-orange-500/20 border border-orange-500/30 rounded-full flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" /> Pending Approval
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{course.courseTitle}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2 mb-6">{course.courseDescription || 'No description available.'}</p>
                  </div>

                  <div className="mt-auto z-10 p-6 pt-4 border-t border-orange-500/20 bg-slate-950/40">
                    <Button disabled variant="outline" className="w-full bg-orange-500/5 border-orange-500/30 text-orange-400/50 rounded-xl h-12">
                      Waiting for Admin
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* ========================================================= */}
        {/* SECTION 4: Available Courses (Purple/Slate Theme) */}
        {/* ========================================================= */}
        <section>
          <div className="flex items-center gap-3 mb-8 border-b border-purple-500/30 pb-4 mt-8">
            <Sparkles className="h-6 w-6 text-purple-400" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">Available Courses</h2>
          </div>

          {availableCourses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-[20vh] border border-dashed border-purple-500/20 rounded-3xl bg-slate-900/20 p-8"
            >
              <Award className="h-12 w-12 text-slate-500 mb-4" />
              <p className="text-slate-400 text-center max-w-md">You have enrolled or requested in all available courses! Incredible dedication.</p>
            </motion.div>
          ) : (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCourses.map(course => (
                <motion.div
                  key={`available-${course._id}`}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="group relative bg-slate-900/40 backdrop-blur-sm rounded-3xl border border-purple-500/20 overflow-hidden hover:border-purple-500/40 hover:bg-slate-900/60 transition-all duration-300 flex flex-col"
                >
                  <div className="p-6 pb-4 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple-300 bg-purple-500/10 border border-purple-500/20 rounded-full">
                        {course.challengeDay || 0} Days
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 opacity-90">{course.courseTitle}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2 mb-6">{course.courseDescription || 'No description available.'}</p>

                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div className="flex items-center gap-2 text-slate-400">
                        <PlayCircle className="h-4 w-4 text-purple-400" />
                        <span className="text-sm font-medium">{course.totalClass || 0} Classes</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="h-4 w-4 text-purple-400" />
                        <span className="text-sm font-medium">{course.totalDuration || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex flex-col">
                    <div className="px-6 py-4 bg-slate-950/30 border-t border-purple-500/20 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-purple-400" />
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
                        className="w-full bg-purple-600 hover:bg-purple-500 text-white rounded-xl h-12 shadow-lg shadow-purple-500/20 transition-all font-semibold"
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

      {/* ========================================================= */}
      {/* Enrollment Modal (Available Courses) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => !isEnrolling && setSelectedCourse(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-slate-900 border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/20 w-full max-w-md relative"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-purple-600/20 via-fuchsia-600/20 to-transparent pointer-events-none" />

              <button
                type="button"
                onClick={() => !isEnrolling && setSelectedCourse(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors z-20 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="p-8 relative z-10 flex flex-col h-full">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 mb-6 text-purple-400 shadow-inner">
                  {enrollSuccess ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-emerald-400">
                      <CheckCircle className="h-8 w-8" />
                    </motion.div>
                  ) : (
                    <Sparkles className="h-8 w-8" />
                  )}
                </div>

                {enrollSuccess ? (
                  <div className="text-center py-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Enrollment Requested!</h3>
                    <p className="text-slate-400">Your request for {selectedCourse.courseTitle} has been submitted successfully.</p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{selectedCourse.courseTitle}</h3>
                    <p className="text-slate-400 text-sm mb-8 line-clamp-3">
                      {selectedCourse.courseDescription || 'Get ready to unlock your potential with this comprehensive course.'}
                    </p>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/50 border border-white/5 mb-6">
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

                    <AnimatePresence>
                      {enrollmentError && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: -10 }}
                          animate={{ opacity: 1, height: 'auto', y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-6 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex gap-3 text-orange-400"
                        >
                          <Info className="h-5 w-5 shrink-0 mt-0.5" />
                          <p className="text-sm font-medium">{enrollmentError}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Button
                      onClick={handleEnrollment}
                      disabled={isEnrolling}
                      className="w-full h-14 bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-lg shadow-purple-500/25 transition-all text-lg font-semibold"
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
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
