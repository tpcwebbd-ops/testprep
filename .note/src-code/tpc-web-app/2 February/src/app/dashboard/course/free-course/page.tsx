'use client';

import { useState, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, ExternalLink, GraduationCap, AlertTriangle, RefreshCw, BookOpen, Layers, LayoutGrid } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
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
  const pathname = usePathname();
  const router = useRouter();

  const courseCategory = useMemo(() => {
    return pathname?.split('/').pop() || '';
  }, [pathname]);

  const formattedCategoryTitle = useMemo(() => {
    return courseCategory.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }, [courseCategory]);

  const {
    data: coursesData,
    isLoading,
    error,
    refetch,
  } = useGetCoursesQuery({
    page: 1,
    limit: 1000,
    q: courseCategory,
  });

  const [addCourse, { isLoading: isAdding }] = useAddCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();

  const courses = useMemo(() => {
    const rawCourses = (coursesData as { courses?: ICourse[] })?.courses || [];
    const filtered = rawCourses.filter(item => (item.courseName || '').toLowerCase() === courseCategory.toLowerCase());

    return filtered
      .map(item => ({
        ...item,
        isActive: item.isActive ?? true,
        courseDay: item.courseDay || 'Day 00',
      }))
      .sort((a, b) => {
        const numA = parseInt(a.courseDay.replace(/\D/g, '')) || 0;
        const numB = parseInt(b.courseDay.replace(/\D/g, '')) || 0;
        return numA - numB;
      });
  }, [coursesData, courseCategory]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedCourseToEdit, setSelectedCourseToEdit] = useState<ICourse | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<ICourse | null>(null);
  const [selectedDayNum, setSelectedDayNum] = useState<string>('');

  const availableDays = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => {
      const num = i + 1;
      const label = `Day ${num.toString().padStart(2, '0')}`;
      return { value: num.toString(), label };
    });
  }, []);

  const daysForDropdown = useMemo(() => {
    const existingDays = new Set(courses.map(c => c.courseDay));
    return availableDays.filter(d => !existingDays.has(d.label));
  }, [availableDays, courses]);

  const handleOpenAddDialog = () => {
    setSelectedDayNum('');
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = (course: ICourse) => {
    const { courseDay, courseName } = course || {};
    window.open(`/dashboard/course/${courseName}/edit?courseDay=${courseDay.replaceAll(' ', '-')}&courseName=${courseName}`, '_blank');
  };

  const handleSaveDay = async () => {
    if (!selectedDayNum) {
      toast.error('Please select a day');
      return;
    }

    const dayLabel = `Day ${selectedDayNum.padStart(2, '0')}`;
    const exists = courses.some(c => c.courseDay === dayLabel);
    if (exists) {
      toast.error(`${dayLabel} already exists!`);
      return;
    }

    try {
      await addCourse({
        courseName: courseCategory,
        courseDay: dayLabel,
        isActive: true,
        content: [],
      }).unwrap();

      toast.success(`${dayLabel} created successfully`);
      setIsAddDialogOpen(false);
      setSelectedDayNum('');
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error('Failed to create day');
    }
  };

  const handleUpdateDay = async () => {
    if (!selectedCourseToEdit || !selectedDayNum) return;

    const dayLabel = `Day ${selectedDayNum.padStart(2, '0')}`;
    const exists = courses.some(c => c.courseDay === dayLabel && c._id !== selectedCourseToEdit._id);

    if (exists) {
      toast.error(`${dayLabel} already exists!`);
      return;
    }

    try {
      await updateCourse({
        id: selectedCourseToEdit._id,
        courseDay: dayLabel,
      }).unwrap();

      toast.success('Day updated successfully');
      setIsEditDialogOpen(false);
      setSelectedCourseToEdit(null);
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error('Failed to update day');
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
      toast.success('Day deleted successfully');
      setIsDeleteDialogOpen(false);
      setCourseToDelete(null);
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error('Failed to delete day');
    }
  };

  const handleToggleActive = async (course: ICourse) => {
    if (!course._id) return;
    try {
      const updatedStatus = !course.isActive;
      await updateCourse({ id: course._id, isActive: updatedStatus }).unwrap();
      refetch();
      toast.success(`${course.courseDay} ${updatedStatus ? 'activated' : 'deactivated'}`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/course-builder/edit?id=${id}`);
  };

  const handlePreview = (id: string) => {
    window.open(`/dashboard/course-builder/preview-course?id=${id}`, '_blank');
  };

  const handleLiveLink = (day: string) => {
    window.open(`/courses/${courseCategory}/${day.replace(/\s+/g, '-').toLowerCase()}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-6">
          <div className="relative">
            <GraduationCap className="h-16 w-16 text-white/40 animate-pulse" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              className="absolute -inset-2 border-t-2 border-r-2 border-purple-400 rounded-full"
            />
          </div>
          <p className="text-white/60 font-medium tracking-widest uppercase text-sm">Building Curriculum...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl text-center max-w-md shadow-2xl">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Sync Failed</h2>
          <p className="text-white/60 mb-6">We couldn&apos;t retrieve the course structure. Please check your connection.</p>
          <Button onClick={() => refetch()} className="bg-white/10 hover:bg-white/20 text-white border border-white/20 w-full">
            <RefreshCw className="h-4 w-4 mr-2" /> Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-20 px-4 md:px-10 lg:px-16 pt-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-2">
            <div className="flex items-center gap-3 text-purple-400 mb-1">
              <LayoutGrid size={18} />
              <span className="text-xs font-bold tracking-[0.2em] uppercase">Course Architecture</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{formattedCategoryTitle}</h1>
            <p className="text-white/50 flex items-center gap-2 text-sm">
              <span className="bg-white/10 px-2 py-0.5 rounded text-white/80 font-mono">{courseCategory}</span>
              <span>•</span>
              <span>{courses.length} active modules found</span>
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
            <Button onClick={() => refetch()} className="min-w-1" variant="outlineGlassy" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={handleOpenAddDialog} className="min-w-1" variant="outlineGlassy" size="sm">
              <Plus className="h-4 w-4 mr-2 stroke-[3px]" />
              New Day
            </Button>
          </motion.div>
        </header>

        {courses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[45vh] bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-12 text-center"
          >
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6 border border-white/10">
              <BookOpen className="h-10 w-10 text-white/40" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Empty Curriculum</h2>
            <p className="text-white/50 mb-8 max-w-sm">No days have been structured for this course yet. Start by defining Day 01.</p>
            <Button onClick={handleOpenAddDialog} size="lg" className="bg-white text-black hover:bg-white/90 rounded-2xl px-8 font-bold">
              Add First Day
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {courses.map((course, index) => (
                <motion.div
                  key={course._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group relative flex flex-col rounded-3xl border backdrop-blur-xl transition-all duration-500 overflow-hidden ${
                    course.isActive
                      ? 'bg-white/10 border-white/20 hover:border-white/40 shadow-2xl shadow-black/20'
                      : 'bg-white/5 border-white/5 grayscale opacity-60'
                  }`}
                >
                  <div className="p-6 flex-1 space-y-5">
                    <div className="flex justify-between items-start">
                      <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                        <span className="text-xl font-black text-white">{course.courseDay.replace(/\D/g, '')}</span>
                      </div>
                      <Switch checked={course.isActive} onCheckedChange={() => handleToggleActive(course)} className="data-[state=checked]:bg-emerald-400" />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white leading-tight mb-1">{course.courseDay}</h3>
                      <p className="text-xs text-white/40 font-medium tracking-wider uppercase">Content Module</p>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 border-t border-white/10 grid grid-cols-5 gap-2">
                    <Button onClick={() => handleOpenEditDialog(course)} variant="outlineGlassy" size="sm" className="min-w-1">
                      <Edit size={18} />
                    </Button>
                    <Button variant="outlineGlassy" size="sm" className="min-w-1" onClick={() => handleEdit(course._id)}>
                      <BookOpen size={18} />
                    </Button>
                    <Button variant="outlineGlassy" size="sm" className="min-w-1" onClick={() => handlePreview(course._id)}>
                      <Eye size={18} />
                    </Button>
                    <Button variant="outlineGlassy" size="sm" className="min-w-1" onClick={() => handleLiveLink(course.courseDay)}>
                      <ExternalLink size={18} />
                    </Button>
                    <Button variant="outlineFire" size="sm" className="min-w-1" onClick={() => initiateDelete(course)}>
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[450px] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] text-white shadow-2xl p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl border border-white/20">
                <Plus size={20} className="text-purple-400" />
              </div>
              New Course Day
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
              <Layers className="text-white/40" size={24} />
              <div>
                <Label className="text-[10px] uppercase tracking-widest text-white/40 block mb-0.5">Destination</Label>
                <p className="font-semibold text-white/90">{formattedCategoryTitle}</p>
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-medium text-white/60 ml-1">Select Schedule Position</Label>
              <select
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all appearance-none cursor-pointer"
                value={selectedDayNum}
                onChange={e => setSelectedDayNum(e.target.value)}
              >
                <option value="" disabled className="bg-slate-900">
                  Choose a day...
                </option>
                {daysForDropdown.map(day => (
                  <option key={day.value} value={day.value} className="bg-slate-900 text-white">
                    {day.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter className="gap-2 flex">
            <Button onClick={() => setIsAddDialogOpen(false)} variant="outlineGlassy" size="sm" className="min-w-1">
              Discard
            </Button>
            <Button onClick={handleSaveDay} disabled={!selectedDayNum || isAdding} variant="outlineGlassy" size="sm" className="min-w-1">
              {isAdding ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Confirm Day'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[450px] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] text-white shadow-2xl p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl border border-white/20">
                <Edit size={20} className="text-blue-400" />
              </div>
              Update Sequence
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-white/60 ml-1">Relocate Day Number</Label>
              <select
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 appearance-none cursor-pointer"
                value={selectedDayNum}
                onChange={e => setSelectedDayNum(e.target.value)}
              >
                {selectedCourseToEdit && (
                  <option value={selectedCourseToEdit.courseDay.replace(/\D/g, '')} className="bg-slate-900">
                    {selectedCourseToEdit.courseDay} (Current)
                  </option>
                )}
                {availableDays.map(day => {
                  const isTaken = courses.some(c => c.courseDay === day.label && c._id !== selectedCourseToEdit?._id);
                  return isTaken ? null : (
                    <option key={day.value} value={day.value} className="bg-slate-900">
                      {day.label}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)} className="text-white/60 hover:text-white hover:bg-white/5 rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleUpdateDay} disabled={isUpdating} className="bg-blue-500 text-white hover:bg-blue-600 rounded-xl font-bold px-8 border-none">
              {isUpdating ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Save Position'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[450px] bg-white/10 backdrop-blur-2xl border border-red-500/20 rounded-[2rem] text-white shadow-2xl p-8">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="text-red-400" size={28} />
            </div>
            <DialogTitle className="text-2xl font-bold text-center">Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-white/60 leading-relaxed">
              Are you sure you want to remove <span className="text-white font-bold">{courseToDelete?.courseDay}</span>? This will erase all content modules
              nested within this day.
            </p>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-3 mt-4">
            <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} className="w-full text-white/60 hover:bg-white/5 rounded-xl">
              Abort
            </Button>
            <Button onClick={confirmDelete} className="w-full bg-red-500 text-white hover:bg-red-600 rounded-xl font-bold py-6">
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default CourseBuilderPage;
