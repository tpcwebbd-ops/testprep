'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, BookOpen, Clock, Award, PlayCircle, FileText, AlertTriangle, RefreshCw, X, DollarSign, Layers, Power } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { useGetCoursesQuery, useAddCourseMutation, useUpdateCourseMutation, useDeleteCourseMutation } from '@/redux/features/courses/coursesSlice';

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

const defaultFormData = {
  courseTitle: '',
  courseDescription: '',
  totalClass: 0,
  totalAssignment: 0,
  totalDuration: '',
  totalMockTest: 0,
  realPrice: 0,
  discountPrice: 0,
  challengeDay: 0,
  totalLecture: 0,
  isActive: true,
};

export default function CoursesPage() {
  const { data: coursesData, isLoading, error, refetch } = useGetCoursesQuery({ page: 1, limit: 100 });
  const [addCourse, { isLoading: isAdding }] = useAddCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<ICourse | null>(null);

  const [isToggleDialogOpen, setIsToggleDialogOpen] = useState(false);
  const [courseToToggle, setCourseToToggle] = useState<ICourse | null>(null);

  const [formData, setFormData] = useState(defaultFormData);

  const courses: ICourse[] = coursesData?.data?.courses || [];
  console.log('courses : ', courses);
  const handleOpenAddModal = () => {
    setModalMode('add');
    setFormData(defaultFormData);
    setCurrentEditId(null);
    setIsFormDialogOpen(true);
  };

  const handleOpenEditModal = (course: ICourse) => {
    setModalMode('edit');
    setFormData({
      courseTitle: course.courseTitle || '',
      courseDescription: course.courseDescription || '',
      totalClass: course.totalClass || 0,
      totalAssignment: course.totalAssignment || 0,
      totalDuration: course.totalDuration || '',
      totalMockTest: course.totalMockTest || 0,
      realPrice: course.realPrice || 0,
      discountPrice: course.discountPrice || 0,
      challengeDay: course.challengeDay || 0,
      totalLecture: course.totalLecture || 0,
      isActive: course.isActive ?? true,
    });
    setCurrentEditId(course._id);
    setIsFormDialogOpen(true);
  };

  const handleSubmitCourse = async () => {
    if (!formData.courseTitle) {
      toast.error('Course Title is required');
      return;
    }
    console.log('formData : ', formData);
    try {
      if (modalMode === 'add') {
        await addCourse({
          ...formData,
          lectureData: {},
        }).unwrap();
        toast.success('Course created successfully');
      } else if (modalMode === 'edit' && currentEditId) {
        await updateCourse({
          id: currentEditId,
          ...formData,
        }).unwrap();
        toast.success('Course updated successfully');
      }

      setFormData(defaultFormData);
      setIsFormDialogOpen(false);
      setCurrentEditId(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error(`Failed to ${modalMode} course`);
    }
  };

  const initiateToggle = (course: ICourse) => {
    setCourseToToggle(course);
    setIsToggleDialogOpen(true);
  };

  const confirmToggleActive = async () => {
    if (!courseToToggle) return;

    try {
      const isCurrentlyActive = courseToToggle.isActive ?? false;
      const updatedStatus = !isCurrentlyActive;

      await updateCourse({
        id: courseToToggle._id,
        isActive: updatedStatus,
      }).unwrap();

      toast.success(`Course ${updatedStatus ? 'activated' : 'deactivated'} successfully`);
      setIsToggleDialogOpen(false);
      setCourseToToggle(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error('Failed to update course status');
    }
  };

  const initiateDelete = (course: ICourse) => {
    setCourseToDelete(course);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!courseToDelete?._id) return;

    try {
      await deleteCourse({ id: courseToDelete._id }).unwrap();
      toast.success('Course deleted successfully');
      setIsDeleteDialogOpen(false);
      setCourseToDelete(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error('Failed to delete course');
    }
  };

  const handleManageClasses = (id: string) => {
    window.open(`/dashboard/courses/edit?id=${id}`, '_blank');
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950 pt-[90px] pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/30 blur-3xl rounded-full animate-pulse" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-2xl">
                <BookOpen className="h-10 w-10 text-white animate-pulse" />
              </div>
            </div>
            <div className="text-white text-xl font-semibold mt-4">Loading courses...</div>
          </motion.div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950 pt-[90px] pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6 max-w-md">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/30 blur-3xl rounded-full" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-2xl">
                <AlertTriangle className="h-10 w-10 text-white" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Failed to Load Courses</h2>
              <p className="text-slate-400 text-sm">We encountered an error while fetching your curriculum.</p>
            </div>
            <Button onClick={() => refetch()} variant="outline" className="gap-2 bg-transparent text-white border-white/20 hover:bg-white/10">
              <RefreshCw className="h-4 w-4" />
              Retry Connection
            </Button>
          </motion.div>
        </div>
      </main>
    );
  }

  const isSaving = isAdding || isUpdating;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950 pt-[90px] pb-20 px-4 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
              Course Management
            </h1>
            <p className="text-emerald-100/60 mt-2 text-sm md:text-base">Curate and manage your educational content effortlessly.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
            <Button onClick={() => refetch()} size="icon" className="bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleOpenAddModal}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white border-none shadow-lg shadow-emerald-500/25"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </motion.div>
        </div>

        {courses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[50vh] border-2 border-dashed border-emerald-500/20 rounded-3xl bg-emerald-950/20 backdrop-blur-sm p-12"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
              <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center shadow-2xl">
                <BookOpen className="h-10 w-10 text-emerald-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 text-center">No Courses Available</h2>
            <p className="text-emerald-100/50 text-center max-w-md mb-8">Start building your curriculum by creating your first course today.</p>
            <Button
              onClick={handleOpenAddModal}
              className="bg-emerald-500 hover:bg-emerald-400 text-white rounded-full px-8 py-6 text-lg shadow-xl shadow-emerald-500/20"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create First Course
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {courses.map(course => (
              <motion.div
                key={course._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`group relative backdrop-blur-xl rounded-3xl border overflow-hidden transition-all flex flex-col ${!course.isActive ? 'bg-slate-900/40 border-white/5 opacity-80' : 'bg-slate-900/60 border-white/10 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10'}`}
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex gap-2">
                  <Button
                    size="icon"
                    onClick={() => handleOpenEditModal(course)}
                    className="h-8 w-8 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 rounded-full backdrop-blur-md border border-blue-500/30"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    onClick={() => initiateDelete(course)}
                    className="h-8 w-8 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-full backdrop-blur-md border border-red-500/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="p-6 pb-0 flex-1 relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                      {course.challengeDay || 0} Days Challenge
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 leading-tight">{course.courseTitle}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-6">{course.courseDescription || 'No description available.'}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-slate-300">
                      <PlayCircle className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm font-medium">{course.totalClass || 0} Classes</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Clock className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm font-medium">{course.totalDuration || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <FileText className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm font-medium">{course.totalAssignment || 0} Tasks</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Award className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm font-medium">{course.totalMockTest || 0} Tests</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto z-10 flex flex-col">
                  <div className="px-6 py-4 bg-slate-950/40 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-slate-500" />
                      <span className="text-sm text-slate-400">{course.totalLecture || 0} Lectures</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500 line-through decoration-red-500/50">${course.realPrice || 0}</span>
                      <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                        ${course.discountPrice || 0}
                      </span>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-slate-950/80 border-t border-white/5 flex items-center justify-between">
                    <Button
                      onClick={() => handleManageClasses(course._id)}
                      className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-all text-sm h-9 px-4"
                    >
                      <Layers className="h-4 w-4 mr-2" /> Manage Classes
                    </Button>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-medium uppercase tracking-wider ${course.isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {course.isActive ? 'Active' : 'Disabled'}
                      </span>
                      <Switch
                        checked={course.isActive ?? false}
                        onCheckedChange={() => initiateToggle(course)}
                        className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-slate-700 border-white/10"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isToggleDialogOpen && courseToToggle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsToggleDialogOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-slate-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div
                className={`flex items-center justify-between p-6 border-b border-white/10 ${courseToToggle.isActive ? 'bg-amber-500/5' : 'bg-emerald-500/5'}`}
              >
                <div className={`flex items-center gap-3 ${courseToToggle.isActive ? 'text-amber-400' : 'text-emerald-400'}`}>
                  <div className={`p-2 rounded-full ${courseToToggle.isActive ? 'bg-amber-500/10' : 'bg-emerald-500/10'}`}>
                    <Power className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold">Confirm Status Change</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsToggleDialogOpen(false)}
                  className="hover:bg-white/10 text-slate-400 hover:text-white rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-6 text-center space-y-4">
                <p className="text-slate-300 text-lg">
                  Are you sure you want to{' '}
                  <span className={`font-bold ${courseToToggle.isActive ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {courseToToggle.isActive ? 'deactivate' : 'activate'}
                  </span>{' '}
                  <br />
                  <span className="font-bold text-white mt-1 block">&quot;{courseToToggle.courseTitle}&quot;?</span>
                </p>
                <p className="text-sm text-slate-500">
                  {courseToToggle.isActive ? 'Deactivating this course will hide it from users.' : 'Activating this course will make it visible to users.'}
                </p>
              </div>

              <div className="p-6 pt-0 flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setIsToggleDialogOpen(false)}
                  className="flex-1 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl h-12"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmToggleActive}
                  className={`flex-1 text-white border-none rounded-xl h-12 font-semibold shadow-lg ${courseToToggle.isActive ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'}`}
                >
                  {courseToToggle.isActive ? 'Deactivate Course' : 'Activate Course'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFormDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 mt-[65px]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setIsFormDialogOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  {modalMode === 'add' ? <Plus className="h-6 w-6 text-emerald-400" /> : <Edit className="h-6 w-6 text-blue-400" />}
                  {modalMode === 'add' ? 'Create New Course' : 'Edit Course Details'}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFormDialogOpen(false)}
                  className="hover:bg-white/10 text-slate-400 hover:text-white rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">
                      Course Title <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      placeholder="e.g. Advanced React Patterns"
                      className="bg-slate-950 border-white/10 text-white placeholder:text-slate-600 focus:border-emerald-500 h-12 rounded-xl"
                      value={formData.courseTitle}
                      onChange={e => setFormData({ ...formData, courseTitle: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Course Description</Label>
                    <textarea
                      placeholder="Detailed description of the course content..."
                      className="w-full bg-slate-950 border border-white/10 text-white placeholder:text-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl p-4 min-h-[100px] outline-none transition-all resize-none"
                      value={formData.courseDescription}
                      onChange={e => setFormData({ ...formData, courseDescription: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Total Duration (e.g., 40 Hours)</Label>
                    <Input
                      className="bg-slate-950 border-white/10 text-white focus:border-emerald-500 h-12 rounded-xl"
                      value={formData.totalDuration}
                      onChange={e => setFormData({ ...formData, totalDuration: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Total Classes</Label>
                    <Input
                      type="number"
                      className="bg-slate-950 border-white/10 text-white focus:border-emerald-500 h-12 rounded-xl"
                      value={formData.totalClass}
                      onChange={e => setFormData({ ...formData, totalClass: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Total Lectures</Label>
                    <Input
                      type="number"
                      className="bg-slate-950 border-white/10 text-white focus:border-emerald-500 h-12 rounded-xl"
                      value={formData.totalLecture}
                      onChange={e => setFormData({ ...formData, totalLecture: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Total Assignments</Label>
                    <Input
                      type="number"
                      className="bg-slate-950 border-white/10 text-white focus:border-emerald-500 h-12 rounded-xl"
                      value={formData.totalAssignment}
                      onChange={e => setFormData({ ...formData, totalAssignment: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Total Mock Tests</Label>
                    <Input
                      type="number"
                      className="bg-slate-950 border-white/10 text-white focus:border-emerald-500 h-12 rounded-xl"
                      value={formData.totalMockTest}
                      onChange={e => setFormData({ ...formData, totalMockTest: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Challenge Days</Label>
                    <Input
                      type="number"
                      className="bg-slate-950 border-white/10 text-white focus:border-emerald-500 h-12 rounded-xl"
                      value={formData.challengeDay}
                      onChange={e => setFormData({ ...formData, challengeDay: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <Label className="text-slate-300">Real Price</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        type="number"
                        className="bg-slate-950 border-white/10 text-white focus:border-emerald-500 h-12 rounded-xl pl-9"
                        value={formData.realPrice}
                        onChange={e => setFormData({ ...formData, realPrice: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 relative">
                    <Label className="text-slate-300">Discount Price</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                      <Input
                        type="number"
                        className="bg-slate-950 border-emerald-500/30 text-white focus:border-emerald-500 h-12 rounded-xl pl-9"
                        value={formData.discountPrice}
                        onChange={e => setFormData({ ...formData, discountPrice: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-slate-950 border border-white/10 rounded-xl p-4 mt-6">
                  <div>
                    <Label className="text-slate-300 text-base">Course Visibility</Label>
                    <p className="text-sm text-slate-500 mt-1">{formData.isActive ? 'Active and visible to all users' : 'Deactivated and hidden from users'}</p>
                  </div>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={checked => setFormData({ ...formData, isActive: checked })}
                    className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-slate-700"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-white/10 bg-slate-950/50 flex justify-end gap-3 mt-auto">
                <Button
                  variant="ghost"
                  onClick={() => setIsFormDialogOpen(false)}
                  className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl h-12 px-6"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitCourse}
                  disabled={!formData.courseTitle || isSaving}
                  className={`${modalMode === 'add' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'} text-white rounded-xl h-12 px-8 font-semibold transition-all shadow-lg`}
                >
                  {isSaving ? 'Processing...' : modalMode === 'add' ? 'Launch Course' : 'Save Changes'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteDialogOpen && courseToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsDeleteDialogOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-slate-900 border border-red-500/20 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-red-500/5">
                <div className="flex items-center gap-3 text-red-400">
                  <div className="p-2 bg-red-500/10 rounded-full">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold">Delete Course</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="hover:bg-white/10 text-slate-400 hover:text-white rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                  <Trash2 className="h-8 w-8 text-red-400" />
                </div>
                <p className="text-slate-300 text-lg">
                  Are you absolutely sure you want to delete <br />
                  <span className="font-bold text-white mt-1 block">&quot;{courseToDelete.courseTitle}&quot;</span>
                </p>
                <p className="text-sm text-slate-500">This action is permanent and cannot be undone. All associated data will be removed.</p>
              </div>

              <div className="p-6 pt-0 flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="flex-1 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl h-12"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white border-none rounded-xl h-12 font-semibold shadow-lg shadow-red-500/20"
                >
                  Delete Permanently
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
