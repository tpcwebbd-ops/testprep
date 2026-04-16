'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetEnrollmentsQuery, useUpdateEnrollmentMutation } from '@/redux/features/enrollments/enrollmentsSlice';
import { useGetMyCoursesQuery } from '@/redux/features/my-courses/myCoursesSlice';
import { useGetCoursesQuery } from '@/redux/features/courses/coursesSlice';
import { Eye, Edit3, X, CheckCircle, AlertTriangle, Activity, Calendar, Users, PhoneCall, Loader2, SearchX } from 'lucide-react';

// === Types ===
type Category = 'absent' | 'running' | 'complete' | 'failed';

interface CourseDetails {
  courseId: string;
  title: string;
  startDate: string;
  status: Category;
  progress: number;
  attendedInLast50Hours?: boolean;
}

interface StudentSummary {
  id: string;
  name: string;
  email: string;
  enrollmentStatus: string;
  callStatus: string;
  category: Category;
  courses: CourseDetails[];
  averageProgress: number;
}

export default function StudentDashboard() {
  // === Data Fetching ===
  const { data: enrollData, isLoading: load1 } = useGetEnrollmentsQuery({ limit: 5000 });
  const { data: myCourseData, isLoading: load2 } = useGetMyCoursesQuery({ limit: 5000 });
  const { data: coursesData, isLoading: load3 } = useGetCoursesQuery({ limit: 5000 });
  const [updateEnrollment, { isLoading: isUpdating }] = useUpdateEnrollmentMutation();

  // === State ===
  const [activeTab, setActiveTab] = useState<Category | 'all'>('all');
  const [viewStudent, setViewStudent] = useState<StudentSummary | null>(null);
  const [editStudent, setEditStudent] = useState<StudentSummary | null>(null);
  const [editForm, setEditForm] = useState({ studentsStatus: '', callStatus: '' });

  // === Core Logic & Data Processing ===
  const students = useMemo(() => {
    const enrollments = enrollData?.data?.enrollments || [];
    const myCourses = myCourseData?.data?.myCourses || [];
    const courses = coursesData?.data?.courses || [];

    if (!enrollments.length) return [];

    // Define Base Dates (Dynamic mapping targeting the last 50 hours)
    const NOW = new Date();
    const FIFTY_HOURS_AGO = new Date(NOW.getTime() - 50 * 60 * 60 * 1000);

    const studentMap = new Map<string, StudentSummary>();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    enrollments.forEach((en: any) => {
      if (!studentMap.has(en.studentEmail)) {
        studentMap.set(en.studentEmail, {
          id: en._id,
          name: en.studentName || 'Unknown Student',
          email: en.studentEmail,
          enrollmentStatus: en.studentsStatus || 'pending',
          callStatus: en.callStatus || 'Pending',
          category: 'running',
          courses: [],
          averageProgress: 0,
        });
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    myCourses.forEach((mc: any) => {
      const student = studentMap.get(mc.studentEmail);
      if (student) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const courseInfo = courses.find((c: any) => c._id === mc.courseId);
        const challengeDays = courseInfo?.challengeDay || 30; // default to 30 if null
        const enrolledAt = new Date(mc.enrolledAt);
        const deadline = new Date(enrolledAt);
        deadline.setDate(deadline.getDate() + challengeDays);

        let courseStatus: Category = 'running';

        // Check if Failed or Complete
        if (mc.progress >= 100) {
          courseStatus = 'complete';
        } else if (NOW > deadline) {
          courseStatus = 'failed';
        }

        // Attendance logic targeting the last 50 hours strictly
        let attendedInLast50Hours = false;
        if (mc.attenDance && Array.isArray(mc.attenDance)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          mc.attenDance.forEach((att: any) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            att.data?.forEach((d: any) => {
              if (d.status === 'complete' && d.completeDate) {
                const dDate = new Date(d.completeDate);
                if (dDate >= FIFTY_HOURS_AGO && dDate <= NOW) {
                  attendedInLast50Hours = true;
                }
              }
            });
          });
        }

        student.courses.push({
          courseId: mc.courseId,
          title: courseInfo?.courseTitle || 'Unnamed Course',
          startDate: mc.enrolledAt,
          status: courseStatus,
          progress: mc.progress || 0,
          attendedInLast50Hours,
        });
      }
    });

    // 3. Final Overall Categorization & Progress Calculation
    return Array.from(studentMap.values()).map(student => {
      let overallCategory: Category = 'running';

      const hasFailed = student.courses.some(c => c.status === 'failed');
      const allComplete = student.courses.length > 0 && student.courses.every(c => c.status === 'complete');
      const isEnrollmentComplete = student.enrollmentStatus === 'complete';
      const isRunning = student.enrollmentStatus === 'running' || student.courses.some(c => c.status === 'running');
      const attendedRecentlyOverall = student.courses.some(c => c.attendedInLast50Hours);

      // Prioritize failed/complete status before mapping running vs absent
      if (hasFailed) {
        overallCategory = 'failed';
      } else if (allComplete || isEnrollmentComplete) {
        overallCategory = 'complete';
      } else if (isRunning) {
        // Here is the 50 hours logic application
        overallCategory = attendedRecentlyOverall ? 'running' : 'absent';
      } else {
        overallCategory = student.enrollmentStatus === 'blocked' ? 'failed' : 'running';
      }

      // Calculate overall progress average
      const totalProgress = student.courses.reduce((acc, curr) => acc + curr.progress, 0);
      const avgProgress = student.courses.length > 0 ? Math.round(totalProgress / student.courses.length) : 0;

      return { ...student, category: overallCategory, averageProgress: avgProgress };
    });
  }, [enrollData, myCourseData, coursesData]);

  // === Filtering ===
  const filteredStudents = useMemo(() => {
    return activeTab === 'all' ? students : students.filter(s => s.category === activeTab);
  }, [students, activeTab]);

  // === Summaries ===
  const summary = {
    total: students.length,
    absent: students.filter(s => s.category === 'absent').length,
    complete: students.filter(s => s.category === 'complete').length,
    failed: students.filter(s => s.category === 'failed').length,
  };

  // === Handlers ===
  const handleEditSave = async () => {
    if (editStudent) {
      await updateEnrollment({
        id: editStudent.id,
        studentsStatus: editForm.studentsStatus,
        callStatus: editForm.callStatus,
      });
      setEditStudent(null);
    }
  };

  const openEditModal = (student: StudentSummary) => {
    setEditStudent(student);
    setEditForm({
      studentsStatus: student.enrollmentStatus,
      callStatus: student.callStatus,
    });
  };

  // === Loading State ===
  if (load1 || load2 || load3) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-950">
        <Loader2 className="mb-4 h-14 w-14 animate-spin text-indigo-500" />
        <p className="animate-pulse text-lg font-medium text-slate-400">Loading student data...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-4 font-sans text-slate-100 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-10 text-center md:text-left">
          <h1 className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
            Student Monitoring Hub
          </h1>
          <p className="mt-2 text-slate-400 text-lg">Track attendances, monitor progress, and manage course statuses dynamically.</p>
        </header>

        {/* Dashboard Summary Cards */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard title="Total Students" value={summary.total} icon={<Users />} color="bg-indigo-500/10 text-indigo-400 border-indigo-500/30" />
          <SummaryCard title="Absent (Last 50h)" value={summary.absent} icon={<AlertTriangle />} color="bg-amber-500/10 text-amber-400 border-amber-500/30" />
          <SummaryCard
            title="Success / Complete"
            value={summary.complete}
            icon={<CheckCircle />}
            color="bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
          />
          <SummaryCard title="Failed Students" value={summary.failed} icon={<X />} color="bg-rose-500/10 text-rose-400 border-rose-500/30" />
        </div>

        {/* Tabs */}
        <div className="mb-8 flex flex-wrap gap-3">
          {['all', 'running', 'absent', 'complete', 'failed'].map(tab => (
            <button
              key={tab}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={() => setActiveTab(tab as any)}
              className={`rounded-full px-6 py-2.5 text-sm font-semibold capitalize transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Students Grid */}
        <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
            {filteredStudents.map(student => (
              <motion.div
                key={student.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.3 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md transition-all hover:border-indigo-500/50 hover:shadow-indigo-500/10"
              >
                <div>
                  <div className="mb-5 flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-lg font-bold uppercase text-white shadow-inner">
                        {student.name.charAt(0)}
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="truncate text-lg font-semibold text-slate-100">{student.name}</h3>
                        <p className="truncate text-xs text-slate-400">{student.email}</p>
                      </div>
                    </div>
                    <CategoryBadge category={student.category} />
                  </div>

                  {/* Stunning Progress Bar */}
                  <div className="mb-6">
                    <div className="mb-2 flex items-end justify-between text-xs">
                      <span className="font-medium text-slate-400">Overall Progress</span>
                      <span className="font-bold text-indigo-400">{student.averageProgress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${student.averageProgress}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        className={`h-full rounded-full ${
                          student.averageProgress === 100
                            ? 'bg-emerald-500'
                            : student.category === 'failed'
                              ? 'bg-rose-500'
                              : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="mb-6 grid grid-cols-2 gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-2 rounded-lg bg-slate-800/50 p-2">
                      <Activity className="h-4 w-4 text-indigo-400" />
                      <span>{student.courses.length} Courses</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-slate-800/50 p-2">
                      <PhoneCall className="h-4 w-4 text-purple-400" />
                      <span className="truncate">{student.callStatus}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setViewStudent(student)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-800 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-700 hover:text-white"
                  >
                    <Eye className="h-4 w-4" /> View
                  </button>
                  <button
                    onClick={() => openEditModal(student)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/40"
                  >
                    <Edit3 className="h-4 w-4" /> Edit
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* EYE-CATCHING NOT FOUND SECTION */}
        {filteredStudents.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 flex flex-col items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/40 p-16 text-center shadow-2xl backdrop-blur-md"
          >
            <div className="relative mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-slate-800/50 shadow-inner">
              <SearchX className="h-14 w-14 text-indigo-400 opacity-80" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-500/30"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
                className="absolute -inset-4 rounded-full border border-purple-500/20"
              />
            </div>
            <h3 className="mb-3 text-3xl font-extrabold text-white">No Students Found</h3>
            <p className="max-w-md text-lg text-slate-400">
              We couldn&apos;t find any student records matching the <span className="font-semibold text-indigo-400">&apos;{activeTab}&apos;</span> category.
            </p>
          </motion.div>
        )}
      </div>

      {/* === MODALS === */}

      {/* View Modal */}
      <AnimatePresence>
        {viewStudent && (
          <ModalOverlay onClose={() => setViewStudent(null)}>
            <div className="mb-6 border-b border-slate-700/50 pb-5">
              <h2 className="text-2xl font-extrabold text-white">Student Overview</h2>
              <p className="text-slate-400 text-sm mt-1">
                {viewStudent.name} &bull; {viewStudent.email}
              </p>
            </div>

            <div className="mb-2 space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Enrolled Courses</h3>
              {viewStudent.courses.length > 0 ? (
                viewStudent.courses.map((course, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 transition-colors hover:bg-slate-800/50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-slate-100">{course.title}</h4>
                        <p className="flex items-center gap-1 text-xs text-slate-400 mt-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          Enrolled: {new Date(course.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <CategoryBadge category={course.status} />
                    </div>
                    {/* Course Progress */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-500 font-medium">Course Completion</span>
                        <span className="text-indigo-300 font-bold">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress}%` }}
                          transition={{ duration: 0.8 }}
                          className={`h-1.5 rounded-full ${course.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl bg-slate-800/50 p-6 text-center text-sm text-slate-400">No active course enrollments found.</div>
              )}
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editStudent && (
          <ModalOverlay onClose={() => setEditStudent(null)}>
            <div className="mb-6 border-b border-slate-700/50 pb-5">
              <h2 className="text-2xl font-extrabold text-white">Edit Status</h2>
              <p className="text-slate-400 mt-1">
                Updating details for <span className="font-semibold text-slate-200">{editStudent.name}</span>
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold tracking-wide text-slate-300">Enrollment Status</label>
                <select
                  value={editForm.studentsStatus}
                  onChange={e => setEditForm({ ...editForm, studentsStatus: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/50 p-3.5 text-white outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="running">Running</option>
                  <option value="complete">Complete</option>
                  <option value="pending">Pending</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold tracking-wide text-slate-300">Call Status</label>
                <select
                  value={editForm.callStatus}
                  onChange={e => setEditForm({ ...editForm, callStatus: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/50 p-3.5 text-white outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Not Answered">Not Answered</option>
                  <option value="Follow Up">Follow Up</option>
                </select>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setEditStudent(null)}
                  className="rounded-xl bg-slate-800 px-6 py-3 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  disabled={isUpdating}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/50 disabled:opacity-70"
                >
                  {isUpdating ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* Global Style for scrollbar in modal */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `,
        }}
      />
    </main>
  );
}

// === Micro Components ===

const SummaryCard = ({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex items-center justify-between rounded-2xl border p-6 ${color} backdrop-blur-md shadow-lg`}
  >
    <div>
      <p className="mb-1 text-xs font-bold uppercase tracking-wider opacity-80">{title}</p>
      <h4 className="text-4xl font-black tracking-tight">{value}</h4>
    </div>
    <div className="rounded-full bg-white/5 p-4 shadow-inner backdrop-blur-sm">{icon}</div>
  </motion.div>
);

const CategoryBadge = ({ category }: { category: Category }) => {
  const styles = {
    running: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    absent: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    complete: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    failed: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  return <span className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${styles[category]}`}>{category}</span>;
};

const ModalOverlay = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
    />
    <motion.div
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0, y: 20 }}
      className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-800 p-6 shadow-2xl sm:p-8"
    >
      <button
        onClick={onClose}
        className="absolute right-5 top-5 rounded-full bg-slate-900/50 p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
      >
        <X className="h-5 w-5" />
      </button>
      {children}
    </motion.div>
  </div>
);
