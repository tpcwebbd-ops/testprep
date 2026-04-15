Look at the page.tsx 
```
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
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useGetCoursesQuery } from '@/redux/features/courses/coursesSlice';
import { useGetMyCoursesQuery } from '@/redux/features/my-courses/myCoursesSlice';

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

  const { data: coursesData, isLoading: isCoursesLoading, error: coursesError, refetch: refetchCourses } = useGetCoursesQuery({ page: 1, limit: 100 });

  const {
    data: myCoursesData,
    isLoading: isMyCoursesLoading,
    error: myCoursesError,
    refetch: refetchMyCourses,
  } = useGetMyCoursesQuery({ page: 1, limit: 100 });

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
  };

  const handleEnrollment = async () => {
    setIsEnrolling(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsEnrolling(false);
    setEnrollSuccess(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setEnrollSuccess(false);
    setSelectedCourse(null);
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
                onClick={() => !isEnrolling && setSelectedCourse(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors z-10"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="p-8 relative z-10 flex flex-col h-full">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 mb-6 text-indigo-400 shadow-inner">
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
                    <p className="text-slate-400">Your request for {selectedCourse.courseTitle} is being processed.</p>
                  </div>
                ) : (
                  <>
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

```

here is example of redux/features/enrollments/enrollmentsSlice.ts 
```
/*
|-----------------------------------------
| setting up coursesSlice for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { apiSlice } from '@/redux/api/apiSlice';

export const enrollmentsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getEnrollments: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/api/enrollments/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypeEnrollments' as const, id: 'LIST' }],
    }),
    getEnrollmentById: builder.query({
      query: id => `/api/enrollments/v1?id=${id}`,
      providesTags: (result, error, id) => [{ type: 'tagTypeEnrollments' as const, id }],
    }),
    addEnrollment: builder.mutation({
      query: newEnrollment => ({
        url: '/api/enrollments/v1',
        method: 'POST',
        body: newEnrollment,
      }),
      invalidatesTags: [{ type: 'tagTypeEnrollments' as const, id: 'LIST' }],
    }),
    updateEnrollment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/enrollments/v1`,
        method: 'PUT',
        body: { id, ...data },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'tagTypeEnrollments' as const, id },
        { type: 'tagTypeEnrollments' as const, id: 'LIST' },
      ],
    }),
    deleteEnrollment: builder.mutation({
      query: ({ id }) => ({
        url: `/api/enrollments/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'tagTypeEnrollments' as const, id },
        { type: 'tagTypeEnrollments' as const, id: 'LIST' },
      ],
    }),
    bulkUpdateEnrollments: builder.mutation({
      query: bulkData => ({
        url: `/api/enrollments/v1?bulk=true`,
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeEnrollments' as const, id: 'LIST' }],
    }),
    bulkDeleteEnrollments: builder.mutation({
      query: bulkData => ({
        url: `/api/enrollments/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeEnrollments' as const, id: 'LIST' }],
    }),
  }),
});

export const {
  useGetEnrollmentsQuery,
  useGetEnrollmentByIdQuery,
  useAddEnrollmentMutation,
  useUpdateEnrollmentMutation,
  useDeleteEnrollmentMutation,
  useBulkUpdateEnrollmentsMutation,
  useBulkDeleteEnrollmentsMutation,
} = enrollmentsApi;

```

here is example of 
enrollments/controller.ts
```
/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { FilterQuery } from 'mongoose';

import { withDB } from '@/app/api/utils/db';
import { formatResponse, IResponse } from '@/app/api/utils/utils';

import Enrollment from './model';

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

function isMongoError(error: unknown): error is MongoError {
  return error !== null && typeof error === 'object' && 'code' in error && typeof (error as MongoError).code === 'number';
}

export async function createEnrollment(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const enrollmentData = await req.json();
      const newEnrollment = await Enrollment.create(enrollmentData);
      return formatResponse(newEnrollment, 'Enrollment created successfully', 201);
    } catch (error: unknown) {
      if (isMongoError(error) && error.code === 11000) {
        return formatResponse(null, `Duplicate: ${JSON.stringify(error.keyValue)}`, 409);
      }
      throw error;
    }
  });
}

export async function getEnrollmentById(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'ID is required', 400);
    const enrollment = await Enrollment.findById(id);
    if (!enrollment) return formatResponse(null, 'Not found', 404);
    return formatResponse(enrollment, 'Fetched successfully', 200);
  });
}

export async function getEnrollments(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '1000');
    const skip = (page - 1) * limit;
    const searchQuery = url.searchParams.get('q');
    let filter: FilterQuery<unknown> = {};

    if (searchQuery) {
      filter = {
        $or: [
          { studentName: { $regex: searchQuery, $options: 'i' } },
          { studentEmail: { $regex: searchQuery, $options: 'i' } },
          { couponCode: { $regex: searchQuery, $options: 'i' } },
        ],
      };
    }

    const enrollments = await Enrollment.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit);
    const total = await Enrollment.countDocuments(filter);
    return formatResponse({ enrollments, total, page, limit }, 'Fetched successfully', 200);
  });
}

export async function getAllEnrollments(): Promise<IResponse> {
  return withDB(async () => {
    const page = 1;
    const limit = 1000;
    const skip = (page - 1) * limit;
    const filter: FilterQuery<unknown> = {};
    const enrollments = await Enrollment.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit);
    const total = await Enrollment.countDocuments(filter);
    return formatResponse({ enrollments, total, page, limit }, 'Fetched successfully', 200);
  });
}

export async function updateEnrollment(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      if (!id) return formatResponse(null, 'ID is required', 400);
      const updated = await Enrollment.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: false,
      });
      if (!updated) return formatResponse(null, 'Not found', 404);

      return formatResponse(updated, 'Updated successfully', 200);
    } catch (error: unknown) {
      if (isMongoError(error) && error.code === 11000) {
        return formatResponse(null, `Duplicate: ${JSON.stringify(error.keyValue)}`, 409);
      }
      throw error;
    }
  });
}

export async function deleteEnrollment(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { id } = await req.json();
    if (!id) return formatResponse(null, 'ID required', 400);
    const deleted = await Enrollment.findByIdAndDelete(id);
    if (!deleted) return formatResponse(null, 'Not found', 404);
    return formatResponse({ deletedCount: 1 }, 'Deleted successfully', 200);
  });
}

```
enrollments/model.ts
```
/*
|-----------------------------------------
| setting up Model for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Testprep , April, 2026
|-----------------------------------------
*/

import mongoose, { Schema } from 'mongoose';

const enrollmentSchema = new Schema(
  {
    studentName: { type: String },
    studentEmail: { type: String },
    studentsStatus: { type: String, default: 'active', enum: ['blocked', 'pending', 'complete', 'running'] },
    enrollmentDate: { type: Date, default: Date.now },
    enrollCoursesIDS: [{ type: String }],
    realPrice: { type: Number },
    discountPrice: { type: Number, default: 0 },
    paymentAmount: { type: Number },
    paymentMethod: { type: String },
    couponCode: { type: String, default: null },
    checkedbyEmail: { type: String },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  },
  { _id: true, timestamps: true },
);

enrollmentSchema.index({ studentEmail: 1 });
enrollmentSchema.index({ studentName: 1 });
enrollmentSchema.index({ couponCode: 1 });

export default mongoose.models.Enrollment || mongoose.model('Enrollment', enrollmentSchema);

```
enrollments/route.ts
```
/*
|-----------------------------------------
| setting up Route for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { revalidatePath } from 'next/cache';

import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { formatResponse, IResponse } from '@/app/api/utils/jwt-verify';
import { isUserHasAccessByRole, IWantAccess } from '@/app/api/utils/is-user-has-access-by-role';

import { getEnrollments, createEnrollment, updateEnrollment, deleteEnrollment, getEnrollmentById } from './controller';

export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'enrollments',
      access: 'read',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const id = new URL(req.url).searchParams.get('id');
  const result: IResponse = id ? await getEnrollmentById(req) : await getEnrollments(req);
  return formatResponse(result.data, result.message, result.status);
}

export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'enrollments',
      access: 'create',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const result = await createEnrollment(req);
  if (result.status === 200 || result.status === 201) {
    revalidatePath('/enrollments');
  }
  return formatResponse(result.data, result.message, result.status);
}

export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'enrollments',
      access: 'update',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const result = await updateEnrollment(req);
  if (result.status === 200) {
    revalidatePath('/enrollments');
  }
  return formatResponse(result.data, result.message, result.status);
}

export async function DELETE(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'enrollments',
      access: 'delete',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const result = await deleteEnrollment(req);
  if (result.status === 200) {
    revalidatePath('/enrollments');
  }
  return formatResponse(result.data, result.message, result.status);
}

```


Now your task is implement those features in this page.tsx 
1. When I click confirm Enrollment inside model then it will invoke a post request in enrollments throw redux. before the post request it check If I already apply for enrollments. if yes then only Show You already apply for enrollment. if not then post request. 

Now generate page.tsx 