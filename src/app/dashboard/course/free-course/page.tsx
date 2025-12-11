'use client';

import { useState, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Eye, ExternalLink, GraduationCap, X, AlertTriangle, RefreshCw, Calendar, BookOpen, Layers } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
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
  const pathname = usePathname();
  const router = useRouter();

  // 1. Extract Course Category from URL
  const courseCategory = useMemo(() => {
    return pathname?.split('/').pop() || '';
  }, [pathname]);

  const formattedCategoryTitle = useMemo(() => {
    return courseCategory.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }, [courseCategory]);

  // 2. Fetch Data
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

  // 3. Derived State (Replaces the buggy useEffect/useState sync)
  const courses = useMemo(() => {
    const rawCourses = coursesData?.courses || [];
    console.log('coursesData', coursesData);
    // Filter strictly by category to ensure we don't show mixed data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filtered = rawCourses.filter((item: any) => (item.courseName || '').toLowerCase() === courseCategory.toLowerCase());

    // Sort by Day Number (Day 01, Day 02...)
    return (
      filtered
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((item: any) => ({
          ...item,
          _id: item._id,
          isActive: item.isActive ?? true,
          courseName: item.courseName,
          courseDay: item.courseDay || 'Day 00',
        }))
        .sort((a: ICourse, b: ICourse) => {
          const numA = parseInt(a.courseDay.replace(/\D/g, '')) || 0;
          const numB = parseInt(b.courseDay.replace(/\D/g, '')) || 0;
          return numA - numB;
        })
    );
  }, [coursesData, courseCategory]);

  // Modal States
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Selection States
  const [selectedCourseToEdit, setSelectedCourseToEdit] = useState<ICourse | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<ICourse | null>(null);

  // Form State
  const [selectedDayNum, setSelectedDayNum] = useState<string>('');

  // Dropdown Logic
  const availableDays = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => {
      const num = i + 1;
      const label = `Day ${num.toString().padStart(2, '0')}`;
      return { value: num.toString(), label };
    });
  }, []);

  const daysForDropdown = useMemo(() => {
    const existingDays = new Set(courses.map((c: ICourse) => c.courseDay));
    return availableDays.filter(d => !existingDays.has(d.label));
  }, [availableDays, courses]);

  // --- HANDLERS ---

  const handleOpenAddDialog = () => {
    setSelectedDayNum('');
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = (course: ICourse) => {
    const num = course.courseDay.replace(/\D/g, '');
    setSelectedDayNum(parseInt(num).toString());
    setSelectedCourseToEdit(course);
    setIsEditDialogOpen(true);
  };

  const handleSaveDay = async () => {
    if (!selectedDayNum) {
      toast.error('Please select a day');
      return;
    }

    const dayLabel = `Day ${selectedDayNum.padStart(2, '0')}`;

    // Check duplicates locally
    const exists = courses.some((c: ICourse) => c.courseDay === dayLabel);
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
      refetch(); // Force UI update
    } catch (err) {
      toast.error('Failed to create day');
      console.error(err);
    }
  };

  const handleUpdateDay = async () => {
    if (!selectedCourseToEdit || !selectedDayNum) return;

    const dayLabel = `Day ${selectedDayNum.padStart(2, '0')}`;
    const exists = courses.some((c: ICourse) => c.courseDay === dayLabel && c._id !== selectedCourseToEdit._id);

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
      refetch(); // Force UI update
    } catch (err) {
      toast.error('Failed to update day');
      console.error(err);
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
      refetch(); // Force UI update
    } catch (err) {
      toast.error('Failed to delete day');
      console.error(err);
    }
  };

  const handleToggleActive = async (course: ICourse) => {
    if (!course._id) return;
    try {
      const updatedStatus = !course.isActive;
      // Note: Since we use courses directly from data, optimistic updates require cache manipulation
      // or we just wait for the re-fetch. For better UX, we just call API and refetch.
      await updateCourse({ id: course._id, isActive: updatedStatus }).unwrap();
      refetch();
      toast.success(`${course.courseDay} ${updatedStatus ? 'activated' : 'deactivated'}`);
    } catch (err) {
      toast.error('Failed to update status');
      console.error(err);
    }
  };

  // Missing Handler from original code
  const handleEdit = (id: string) => {
    router.push(`/dashboard/course-builder/edit?id=${id}`);
  };

  const handlePreview = (id: string) => {
    window.open(`/dashboard/course-builder/preview-course?id=${id}`, '_blank');
  };

  const handleLiveLink = (day: string) => {
    window.open(`/courses/${courseCategory}/${day.replace(/\s+/g, '-').toLowerCase()}`, '_blank');
  };

  // --- RENDERING ---

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 pt-[90px] pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-500">
            <GraduationCap className="h-12 w-12 text-indigo-400 animate-bounce" />
            <div className="text-white text-xl font-semibold">Loading curriculum...</div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 pt-[90px] pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[50vh] gap-6">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Connection Error</h2>
            <p className="text-slate-400">Failed to load days for this course.</p>
          </div>
          <Button onClick={() => refetch()} variant="outline" className="gap-2 bg-white/5 text-white border-white/10 hover:bg-white/10">
            <RefreshCw className="h-4 w-4" /> Retry
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 pt-[90px] pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 animate-in slide-in-from-top-4 duration-500">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <GraduationCap className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">{formattedCategoryTitle}</h1>
                <p className="text-slate-400 text-sm flex items-center gap-2">
                  <span className="bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded text-xs font-mono">{courseCategory}</span>
                  <span>• Manage your curriculum days</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => refetch()}
              variant="outline"
              size="icon"
              className="bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-transform active:scale-95"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleOpenAddDialog}
              className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 gap-2 transition-transform active:scale-95"
            >
              <Plus className="h-4 w-4" />
              Add Day
            </Button>
          </div>
        </div>

        {/* Content Area */}
        {courses.length === 0 ? (
          <div className="animate-in fade-in zoom-in-95 duration-700 flex flex-col items-center justify-center min-h-[40vh] border-2 border-dashed border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm p-12">
            <div className="w-20 h-20 rounded-full bg-slate-900/50 flex items-center justify-center mb-6 ring-4 ring-indigo-500/20">
              <Calendar className="h-10 w-10 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No Days Created Yet</h2>
            <p className="text-slate-400 mb-8 text-center max-w-sm">
              Start building your <strong>{formattedCategoryTitle}</strong> course by adding Day 01.
            </p>
            <Button onClick={handleOpenAddDialog} variant="secondary" size="lg" className="gap-2">
              <Plus className="h-4 w-4" /> Create First Day
            </Button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-slate-300">
                <Layers className="h-5 w-5 text-indigo-400" />
                <h2 className="text-lg font-semibold">Course Schedule</h2>
                <span className="text-xs bg-white/10 px-2.5 py-0.5 rounded-full text-white font-mono">{courses.length} Days</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course: ICourse) => (
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
                  {/* Decorative Gradient Bar */}
                  <div
                    className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transition-opacity duration-300 ${course.isActive ? 'opacity-100' : 'opacity-30'}`}
                  />

                  <div className="p-5 flex-1 flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-lg flex items-center justify-center font-bold text-lg shadow-inner ${course.isActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}
                        >
                          {course.courseDay.replace(/\D/g, '')}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-100 truncate text-lg leading-tight" title={course.courseDay}>
                            {course.courseDay}
                          </h3>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">Content Module</p>
                        </div>
                      </div>
                      <Switch
                        checked={course.isActive}
                        onCheckedChange={() => handleToggleActive(course)}
                        className="data-[state=checked]:bg-emerald-500 shrink-0"
                      />
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-3 bg-white/5 border-t border-white/5 flex items-center justify-between gap-2">
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10"
                        onClick={() => handleOpenEditDialog(course)}
                        title="Edit Day"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10"
                        onClick={() => handleEdit(course._id)}
                        title="Build Content"
                      >
                        <BookOpen className="h-4 w-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10"
                        onClick={() => handlePreview(course._id)}
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10"
                        onClick={() => handleLiveLink(course.courseDay)}
                        title="Visit Live"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                      onClick={() => initiateDelete(course)}
                      title="Delete Day"
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

      {/* --- ADD DAY MODAL --- */}
      {isAddDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-indigo-400" />
                Add New Day
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAddDialogOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3 flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-full">
                  <Layers className="h-4 w-4 text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs text-indigo-300 font-semibold uppercase">Adding to Category</p>
                  <p className="text-sm text-white font-medium">{formattedCategoryTitle}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Select Day Number</Label>
                <select
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
                  value={selectedDayNum}
                  onChange={e => setSelectedDayNum(e.target.value)}
                >
                  <option value="" disabled>
                    Select a day...
                  </option>
                  {daysForDropdown.map(day => (
                    <option key={day.value} value={day.value} className="bg-slate-900 text-white py-1">
                      {day.label}
                    </option>
                  ))}
                  {daysForDropdown.length === 0 && <option disabled>All 100 days created!</option>}
                </select>
                <p className="text-xs text-slate-500">Only uncreated days are shown.</p>
              </div>
            </div>

            <div className="p-5 bg-white/5 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)} className="text-slate-400 hover:text-white">
                Cancel
              </Button>
              <Button onClick={handleSaveDay} disabled={!selectedDayNum || isAdding} className="bg-indigo-600 hover:bg-indigo-500 text-white min-w-[100px]">
                {isAdding ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Create Day'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT DAY MODAL --- */}
      {isEditDialogOpen && selectedCourseToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Edit className="h-4 w-4 text-blue-400" />
                Edit Day
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditDialogOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-slate-300">Change Day Number</Label>
                <select
                  className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                  value={selectedDayNum}
                  onChange={e => setSelectedDayNum(e.target.value)}
                >
                  <option value={selectedCourseToEdit.courseDay.replace(/\D/g, '')} className="bg-slate-800 font-bold">
                    {selectedCourseToEdit.courseDay} (Current)
                  </option>
                  {availableDays.map(day => {
                    const isTaken = courses.some((c: ICourse) => c.courseDay === day.label && c._id !== selectedCourseToEdit._id);
                    if (isTaken) return null;
                    return (
                      <option key={day.value} value={day.value} className="bg-slate-900 text-white">
                        {day.label}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="p-5 bg-white/5 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)} className="text-slate-400 hover:text-white">
                Cancel
              </Button>
              <Button onClick={handleUpdateDay} disabled={isUpdating} className="bg-blue-600 hover:bg-blue-500 text-white min-w-[100px]">
                {isUpdating ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION --- */}
      {isDeleteDialogOpen && courseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-red-500/20 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-red-500/5">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Delete Day?</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6">
              <p className="text-slate-300">
                Are you sure you want to delete <span className="font-bold text-white">{courseToDelete.courseDay}</span>?
              </p>
              <div className="mt-3 bg-red-950/30 border border-red-500/10 rounded-lg p-3 text-sm text-red-300/80">
                This will permanently remove the day and all associated content content blocks.
              </div>
            </div>

            <div className="p-5 bg-white/5 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} className="text-slate-400 hover:text-white">
                Cancel
              </Button>
              <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-500 text-white border-none shadow-lg shadow-red-500/20">
                Delete Day
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CourseBuilderPage;
