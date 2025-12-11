'use client';

import { useEffect, useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Eye, ExternalLink, GraduationCap, X, AlertTriangle, RefreshCw, Calendar, BookOpen, Layers } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetCoursesQuery, useAddCourseMutation, useUpdateCourseMutation, useDeleteCourseMutation } from '@/redux/features/course/courseSlice';
import { toast } from 'sonner';

interface ICourse {
  _id: string;
  courseName: string;
  courseDay: string;
  isActive: boolean;
  [key: string]: unknown;
}

const CourseBuilderPage = () => {
  const { data: coursesData, isLoading, error, refetch } = useGetCoursesQuery({ page: 1, limit: 100 });

  const [addCourse, { isLoading: isAdding }] = useAddCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<ICourse | null>(null);
  const [formData, setFormData] = useState({ courseName: '', courseDay: '' });

  useEffect(() => {
    const rawCourses = coursesData?.data?.courses || [];

    if (rawCourses.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const normalizedList: ICourse[] = rawCourses.map((item: any) => ({
        ...item,
        _id: item._id,
        isActive: item.isActive ?? true,
        courseName: item.courseName || 'Untitled Course',
        courseDay: item.courseDay || 'Day 0',
      }));
      setCourses(normalizedList);
    } else {
      setCourses([]);
    }
  }, [coursesData]);

  const sortedCourses = useMemo(() => {
    return [...courses].sort((a, b) => a.courseDay.localeCompare(b.courseDay, undefined, { numeric: true }));
  }, [courses]);

  const handleSaveCourse = async () => {
    if (!formData.courseName || !formData.courseDay) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await addCourse({
        courseName: formData.courseName,
        courseDay: formData.courseDay,
        isActive: true,
        content: [],
      }).unwrap();

      toast.success('Course created successfully');
      setFormData({ courseName: '', courseDay: '' });
      setIsAddDialogOpen(false);
    } catch (err) {
      toast.error('Failed to create course');
      console.error(err);
    }
  };

  const handleEdit = (id: string) => {
    window.open(`/dashboard/course-builder/edit-course?id=${id}`, '_blank');
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
    } catch (err) {
      toast.error('Failed to delete course');
      console.error(err);
    }
  };

  const handlePreview = (id: string) => {
    window.open(`/dashboard/course-builder/preview-course?id=${id}`, '_blank');
  };

  const handleLiveLink = (day: string) => {
    window.open(`/courses/${day}`, '_blank');
  };

  const handleToggleActive = async (course: ICourse) => {
    if (!course._id) return;

    try {
      const updatedStatus = !course.isActive;
      setCourses(prev => prev.map(p => (p._id === course._id ? { ...p, isActive: updatedStatus } : p)));

      await updateCourse({
        id: course._id,
        isActive: updatedStatus,
      }).unwrap();

      toast.success(`Course ${updatedStatus ? 'activated' : 'deactivated'}`);
    } catch (err) {
      setCourses(prev => prev.map(p => (p._id === course._id ? { ...p, isActive: !course.isActive } : p)));
      toast.error('Failed to update course status');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 pt-[90px] pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full animate-pulse" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-2xl">
                <GraduationCap className="h-10 w-10 text-white animate-bounce duration-3000" />
              </div>
            </div>
            <div className="text-white text-xl font-semibold">Loading courses...</div>
            <div className="text-slate-400 text-sm">Organizing your curriculum</div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    const errorMessage =
      'status' in error ? `Error ${error.status}: ${JSON.stringify(error.data)}` : 'message' in error ? error.message : 'An unexpected error occurred';

    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 pt-[90px] pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-500 max-w-md">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/30 blur-3xl rounded-full" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-2xl">
                <AlertTriangle className="h-10 w-10 text-white" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Failed to Load Courses</h2>
              <p className="text-slate-400 text-sm">We encountered an error while fetching your curriculum.</p>
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-left w-full overflow-hidden">
                <p className="text-red-400 text-xs font-mono break-all">{errorMessage}</p>
              </div>
            </div>
            <Button onClick={() => refetch()} variant="outlineGlassy" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry Connection
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 pt-[90px] pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Course Builder</h1>
            <p className="text-slate-400 mt-1 text-sm">Structure your learning path, manage days, and content.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => refetch()} variant="outlineGlassy" size="icon" title="Refresh Data">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)} variant="outlineGlassy" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Course Day
            </Button>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="animate-in fade-in zoom-in-95 duration-700 flex flex-col items-center justify-center min-h-[50vh] border-2 border-dashed border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm p-12">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full animate-pulse" />
              <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-2xl">
                <BookOpen className="h-12 w-12 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3 text-center">No Courses Yet</h2>
            <p className="text-slate-400 text-center max-w-md mb-8 text-lg">Start building your curriculum by adding your first course day.</p>
            <Button onClick={() => setIsAddDialogOpen(true)} variant="outlineGlassy" size="lg">
              <Plus className="h-5 w-5" />
              Create First Course
            </Button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 mb-6 text-slate-300">
              <Layers className="h-5 w-5 text-indigo-400" />
              <h2 className="text-lg font-semibold tracking-wide">All Courses</h2>
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-slate-400">{courses.length}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedCourses.map(course => (
                <div
                  key={course._id}
                  className={`
                    relative group overflow-hidden rounded-xl border backdrop-blur-md transition-all duration-300 flex flex-col
                    ${
                      course.isActive
                        ? 'bg-slate-900/60 border-white/10 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10'
                        : 'bg-slate-900/30 border-white/5 opacity-70 grayscale-[0.5] hover:opacity-100 hover:grayscale-0'
                    }
                  `}
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="p-5 flex-1 flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className={`p-1.5 rounded-md shrink-0 ${course.isActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700/20 text-slate-500'}`}>
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <h3 className="font-bold text-slate-100 truncate text-lg" title={course.courseName}>
                          {course.courseName}
                        </h3>
                      </div>
                      <Switch
                        checked={course.isActive}
                        onCheckedChange={() => handleToggleActive(course)}
                        className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-white/50 shrink-0"
                      />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-400 bg-black/20 p-2 rounded-lg border border-white/5 w-fit">
                      <Calendar className="h-3.5 w-3.5 text-pink-400" />
                      <span className="font-mono">{course.courseDay}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 border-t border-white/5 flex items-center justify-between gap-2">
                    <div className="flex gap-1 w-full">
                      <Button size="sm" variant="outlineGlassy" className="flex-1 h-9" onClick={() => handleEdit(course._id)} title="Edit Content">
                        <Edit className="h-4 w-4 mr-1" />
                        <span className="sr-only xl:not-sr-only text-xs">Edit</span>
                      </Button>
                      <Button size="sm" variant="outlineGlassy" className="h-9 w-9 p-0" onClick={() => handlePreview(course._id)} title="Preview">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outlineGlassy" className="h-9 w-9 p-0" onClick={() => handleLiveLink(course.courseDay)} title="Visit Live">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="outlineFire"
                      className="h-9 w-9 p-0 text-red-400 hover:text-red-200 border-red-500/20 hover:bg-red-500/10"
                      onClick={() => initiateDelete(course)}
                      title="Delete Course"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isAddDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 ring-1 ring-white/10">
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-indigo-400" />
                New Course
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAddDialogOpen(false)}
                className="hover:bg-white/10 text-slate-400 hover:text-white rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="courseName" className="text-slate-300">
                  Course Name
                </Label>
                <Input
                  id="courseName"
                  placeholder="e.g. Introduction to React"
                  className="bg-slate-950 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all"
                  value={formData.courseName}
                  onChange={e => setFormData({ ...formData, courseName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseDay" className="text-slate-300">
                  Course Day / ID
                </Label>
                <Input
                  id="courseDay"
                  placeholder="e.g. Day 01"
                  className="bg-slate-950 border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all font-mono"
                  value={formData.courseDay}
                  onChange={e => setFormData({ ...formData, courseDay: e.target.value })}
                />
              </div>
            </div>
            <div className="p-6 pt-2 flex justify-end gap-3 bg-white/5">
              <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)} className="text-slate-400 hover:text-white hover:bg-white/5">
                Cancel
              </Button>
              <Button
                onClick={handleSaveCourse}
                disabled={!formData.courseName || !formData.courseDay || isAdding}
                className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
              >
                {isAdding ? 'Creating...' : 'Create Course'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {isDeleteDialogOpen && courseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-red-500/20 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 ring-1 ring-red-500/10">
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-red-500/5">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Delete Course?</h2>
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

            <div className="p-6">
              <p className="text-slate-300 text-lg">
                Are you sure you want to delete <span className="font-bold text-white">{courseToDelete.courseName}</span>?
              </p>
              <p className="text-sm text-slate-500 mt-2">
                This will permanently remove <span className="font-mono text-slate-400">{courseToDelete.courseDay}</span> and all its content. This action
                cannot be undone.
              </p>
            </div>

            <div className="p-6 pt-2 flex justify-end gap-3 bg-white/5">
              <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} className="text-slate-400 hover:text-white hover:bg-white/5">
                Cancel
              </Button>
              <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-500 text-white border-none shadow-lg shadow-red-500/20">
                Delete Course
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CourseBuilderPage;
