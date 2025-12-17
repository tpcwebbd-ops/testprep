Look at the example of Course Builder.

controller.ts
```
import { withDB } from '@/app/api/utils/db';
import CourseBuilder from './model';
import { formatResponse, IResponse } from '@/app/api/utils/utils';
import { FilterQuery } from 'mongoose';

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

function isMongoError(error: unknown): error is MongoError {
  return error !== null && typeof error === 'object' && 'code' in error && typeof (error as MongoError).code === 'number';
}

export async function createCourse(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const courseData = await req.json();
      const newCourse = await CourseBuilder.create(courseData);

      return formatResponse(newCourse, 'Course created successfully', 201);
    } catch (error: unknown) {
      if (isMongoError(error) && error.code === 11000) {
        return formatResponse(null, `Duplicate: ${JSON.stringify(error.keyValue)}`, 409);
      }
      throw error;
    }
  });
}

export async function getCourseById(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'ID is required', 400);

    const course = await CourseBuilder.findById(id);
    if (!course) return formatResponse(null, 'Not found', 404);

    return formatResponse(course, 'Fetched successfully', 200);
  });
}

export async function getCourses(req: Request): Promise<IResponse> {
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
          { courseName: { $regex: searchQuery, $options: 'i' } },
          { courseDay: { $regex: searchQuery, $options: 'i' } },
          { 'content.key': { $regex: searchQuery, $options: 'i' } },
          { 'content.heading': { $regex: searchQuery, $options: 'i' } },
          { 'content.type': { $regex: searchQuery, $options: 'i' } },
        ],
      };
    }

    const courses = await CourseBuilder.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit);
    const total = await CourseBuilder.countDocuments(filter);

    return formatResponse({ courses, total, page, limit }, 'Fetched successfully', 200);
  });
}

export async function updateCourse(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      if (!id) return formatResponse(null, 'ID is required', 400);

      const updated = await CourseBuilder.findByIdAndUpdate(id, updateData, {
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

export async function deleteCourse(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { id } = await req.json();
    if (!id) return formatResponse(null, 'ID required', 400);

    const deleted = await CourseBuilder.findByIdAndDelete(id);
    if (!deleted) return formatResponse(null, 'Not found', 404);

    return formatResponse({ deletedCount: 1 }, 'Deleted successfully', 200);
  });
}

```

model.ts
```
import mongoose, { Schema } from 'mongoose';

// Main course builder schema
const courseBuilderSchema = new Schema(
  {
    courseName: { type: String, required: true },
    courseDay: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    content: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: true, timestamps: true },
);

export default mongoose.models.CourseBuilder || mongoose.model('CourseBuilder', courseBuilderSchema);

```

route.ts
```
import { NextResponse } from 'next/server';
import { getCourses, createCourse, updateCourse, deleteCourse, getCourseById } from './controller';

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id');
  const result = id ? await getCourseById(req) : await getCourses(req);

  return NextResponse.json(result.data, { status: result.status, statusText: result.message });
}

export async function POST(req: Request) {
  const result = await createCourse(req);
  return NextResponse.json(result.data, { status: result.status, statusText: result.message });
}

export async function PUT(req: Request) {
  const result = await updateCourse(req);
  return NextResponse.json(result.data, { status: result.status, statusText: result.message });
}

export async function DELETE(req: Request) {
  const result = await deleteCourse(req);
  return NextResponse.json(result.data, { status: result.status, statusText: result.message });
}

```

courseSlice.ts 
```
import { apiSlice } from '@/redux/api/apiSlice';

export const courseBuilderApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCourses: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/api/course/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypeCourse', id: 'LIST' }],
    }),
    getCourseById: builder.query({
      query: id => `/api/course/v1?id=${id}`,
      providesTags: (result, error, id) => [{ type: 'tagTypeCourse', id }],
    }),
    addCourse: builder.mutation({
      query: newCourse => ({
        url: '/api/course/v1',
        method: 'POST',
        body: newCourse,
      }),
      invalidatesTags: [{ type: 'tagTypeCourse', id: 'LIST' }],
    }),
    updateCourse: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/course/v1`,
        method: 'PUT',
        body: { id, ...data },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'tagTypeCourse', id },
        { type: 'tagTypeCourse', id: 'LIST' },
      ],
    }),
    deleteCourse: builder.mutation({
      query: ({ id }) => ({
        url: `/api/course/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'tagTypeCourse', id },
        { type: 'tagTypeCourse', id: 'LIST' },
      ],
    }),
  }),
});

export const { useGetCoursesQuery, useGetCourseByIdQuery, useAddCourseMutation, useUpdateCourseMutation, useDeleteCourseMutation } = courseBuilderApi;

```

page.tsx
```
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
    const { courseDay, courseName } = course || {};
    console.log('courseDay : ', courseDay.replaceAll(' ', '-'));
    console.log('courseName : ', courseName);
    window.open(`/dashboard/course/${courseName}/edit?courseDay=${courseDay.replaceAll(' ', '-')}&courseName=${courseName}`, '_blank');
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
                      <Button size="sm" className="min-w-1" variant="outlineGlassy" onClick={() => handleOpenEditDialog(course)} title="Edit Day">
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button size="sm" className="min-w-1" variant="outlineGlassy" onClick={() => handleEdit(course._id)} title="Build Content">
                        <BookOpen className="h-4 w-4" />
                      </Button>

                      <Button size="sm" className="min-w-1" variant="outlineGlassy" onClick={() => handlePreview(course._id)} title="Preview">
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button size="sm" className="min-w-1" variant="outlineGlassy" onClick={() => handleLiveLink(course.courseDay)} title="Visit Live">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button size="sm" className="min-w-1" variant="outlineGlassy" onClick={() => initiateDelete(course)} title="Delete Day">
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

```

edit/page.tsx
```
'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Edit,
  GripVertical,
  Plus,
  Save,
  Trash2,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Layers,
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- IMPORT ONLY ASSIGNMENTS ---
import { AllAssignments, AllAssignmentsKeys } from '@/components/course/assignment/all-assignment-index/all-assignment-index';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

import { useGetCoursesQuery, useUpdateCourseMutation } from '@/redux/features/course/courseSlice';

// --- Types & Interfaces ---

type ItemType = 'assignment';

interface CourseContent {
  id: string;
  key: string;
  name: string;
  type: ItemType;
  heading?: string;
  data: unknown;
  [key: string]: unknown;
}

interface ICourse {
  _id: string;
  courseName: string;
  courseDay: string;
  content: CourseContent[];
  isActive: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COMPONENT_MAP: Record<string, { collection: any; keys: string[]; label: string; icon: any; color: string }> = {
  assignment: {
    collection: AllAssignments,
    keys: AllAssignmentsKeys,
    label: 'Assignment',
    icon: GraduationCap,
    color: 'text-emerald-400 from-emerald-500 to-green-500',
  },
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getTypeStyles = (type: ItemType) => {
  // Defaulting to Assignment Style
  return {
    border: 'border-emerald-500/30 hover:border-emerald-400/60',
    bg: 'bg-slate-900/40',
    badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    icon: 'text-emerald-400',
    glow: 'group-hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]',
  };
};

// --- Sortable Item Component ---

interface SortableItemProps {
  item: CourseContent;
  onEdit: (item: CourseContent) => void;
  onDelete: (item: CourseContent) => void;
  onOpenMoveDialog: (item: CourseContent) => void;
}

const SortableItem = ({ item, onEdit, onDelete, onOpenMoveDialog }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const mapEntry = COMPONENT_MAP[item.type];
  const config = mapEntry ? mapEntry.collection[item.key] : null;

  if (!mapEntry || !config) {
    return (
      <div ref={setNodeRef} style={style} className="p-4 border border-red-500/30 bg-red-500/10 rounded-xl flex items-center justify-between">
        <div className="text-red-400 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span>Unknown Component: {item.type || 'Undefined'}</span>
        </div>
        <Button onClick={() => onDelete(item)} size="sm" variant="destructive" className="h-8 w-8 p-0">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // Render the "Query" component as a preview in the list
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ComponentToRender = (config as any).query;

  const styles = getTypeStyles(item.type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group animate-in fade-in-50 slide-in-from-bottom-6 duration-700 ${isDragging ? 'opacity-40 scale-95 z-50' : 'z-0'}`}
    >
      <div
        className={`relative backdrop-blur-3xl shadow-xl transition-all duration-300 overflow-hidden rounded-xl border ${styles.border} ${styles.bg} ${styles.glow}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative">
          <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-4 z-20 border-b border-white/5 bg-black/20 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <button onClick={() => onOpenMoveDialog(item)} className="md:hidden p-2 rounded-full hover:bg-white/10 text-yellow-400 transition-all">
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                {...attributes}
                {...listeners}
                className={`cursor-grab active:cursor-grabbing p-1.5 rounded-lg hover:bg-white/10 transition-colors ${styles.icon}`}
              >
                <div className="w-full flex items-center justify-center">
                  <GripVertical className="h-5 w-5" />
                </div>
              </button>
              <div className="flex flex-col small text-slate-400">
                <span className="text-xs font-medium text-slate-200 tracking-wide truncate max-w-[200px] flex items-center gap-2">
                  {mapEntry.icon && <mapEntry.icon className="h-3 w-3 opacity-50" />}
                  {item.heading || item.key}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                onClick={() => onEdit(item)}
                size="sm"
                className="min-w-1 h-8 w-8 p-0 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-none"
              >
                <Edit className="h-4 w-4" />
              </Button>

              <Button
                onClick={() => onDelete(item)}
                size="sm"
                className="min-w-1 h-8 w-8 p-0 bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border-none"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="p-6 pt-16 text-slate-300 min-h-[100px]">
            {/* Render Preview (Query) with pointer-events disabled for list view interaction */}
            <div className="z-10 pointer-events-none select-none opacity-90 group-hover:opacity-100 transition-opacity relative">
              {/* Overlay to prevent interaction with quiz elements in list view */}
              <div className="absolute inset-0 z-50 bg-transparent" />
              {ComponentToRender && <ComponentToRender data={JSON.stringify(item.data)} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Editor Component ---

function EditCourseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 1. Get Params from URL
  const courseDayParam = searchParams.get('courseDay');
  const courseNameParam = searchParams.get('courseName');

  const normalizedDay = useMemo(() => courseDayParam?.replace(/-/g, ' ') || '', [courseDayParam]);
  const normalizedName = useMemo(() => courseNameParam || '', [courseNameParam]);

  // 2. Fetch Data
  const {
    data: coursesData,
    isLoading,
    error,
    refetch,
  } = useGetCoursesQuery({
    page: 1,
    limit: 1000,
    q: normalizedName,
  });

  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();

  // 3. Find the specific course
  const currentCourse = useMemo(() => {
    if (!coursesData?.courses) return undefined;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return coursesData.courses.find((c: any) => c.courseName === normalizedName && c.courseDay === normalizedDay) as ICourse | undefined;
  }, [coursesData, normalizedName, normalizedDay]);

  const [items, setItems] = useState<CourseContent[]>([]);

  // UI States
  const [editingItem, setEditingItem] = useState<CourseContent | null>(null);
  const [deletingItem, setDeletingItem] = useState<CourseContent | null>(null);
  const [movingItem, setMovingItem] = useState<CourseContent | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Modal State for Adding
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Task Bar Visibility
  const [isDockExpanded, setIsDockExpanded] = useState(true);

  // Pagination
  const [paginationPage, setPaginationPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // Sync Items
  useEffect(() => {
    if (currentCourse?.content) {
      setItems(Array.isArray(currentCourse.content) ? currentCourse.content : []);
    }
  }, [currentCourse]);

  // Reset pagination
  useEffect(() => {
    setPaginationPage(1);
  }, [isAddModalOpen]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // --- Handlers ---

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems(prevItems => {
        const oldIndex = prevItems.findIndex(item => item.id === active.id);
        const newIndex = prevItems.findIndex(item => item.id === over.id);
        return arrayMove(prevItems, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };

  const handleMoveUp = () => {
    if (!movingItem) return;
    const index = items.findIndex(item => item.id === movingItem.id);
    if (index > 0) setItems(prevItems => arrayMove(prevItems, index, index - 1));
  };

  const handleMoveDown = () => {
    if (!movingItem) return;
    const index = items.findIndex(item => item.id === movingItem.id);
    if (index < items.length - 1) setItems(prevItems => arrayMove(prevItems, index, index + 1));
  };

  const handleAddItem = (key: string) => {
    const type: ItemType = 'assignment';
    const mapEntry = COMPONENT_MAP[type];
    const config = mapEntry.collection[key];

    const newItem: CourseContent = {
      id: `${type}-${key}-${Date.now()}`,
      key: key,
      name: config.name || `${mapEntry.label} ${key}`,
      type: type,
      heading: `${mapEntry.label}: ${key.replace(/-/g, ' ')}`,
      data: config.data,
    };

    setItems([...items, newItem]);
    toast.success('Assignment added');

    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
    setIsAddModalOpen(false);
  };

  const onSubmitEdit = (updatedData: unknown) => {
    if (editingItem) setItems(items.map(item => (item.id === editingItem.id ? { ...item, data: updatedData } : item)));
    setEditingItem(null);
    toast.success('Assignment updated locally');
  };

  const handleConfirmDelete = () => {
    if (deletingItem) {
      setItems(items.filter(item => item.id !== deletingItem.id));
      setDeletingItem(null);
    }
  };

  const handleSubmitAll = async () => {
    if (!currentCourse?._id) {
      toast.error('Course context lost. Please reload.');
      return;
    }

    try {
      await updateCourse({
        id: currentCourse._id,
        content: items,
      }).unwrap();
      toast.success('All changes saved successfully!');
    } catch (err) {
      toast.error('Failed to save changes');
      console.error(err);
    }
  };

  // --- Render Loading / Not Found ---

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full animate-pulse" />
          <RefreshCw className="h-10 w-10 text-indigo-400 animate-spin relative z-10" />
        </div>
        <p className="text-slate-400 animate-pulse">Loading course data...</p>
      </div>
    );
  }

  if (error || (!isLoading && !currentCourse)) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/10 flex flex-col items-center text-center max-w-md backdrop-blur-sm">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Data Found</h2>
          <p className="text-slate-400 mb-6">
            We couldn&apos;t find <strong>{normalizedDay}</strong> in <strong>{normalizedName}</strong>. Please check the URL or return to the dashboard.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => router.back()} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              <ChevronLeft className="mr-2 h-4 w-4" /> Go Back
            </Button>
            <Button onClick={() => refetch()} variant="secondary">
              <RefreshCw className="mr-2 h-4 w-4" /> Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <main className="min-h-screen bg-slate-950 overflow-x-hidden selection:bg-indigo-500/30 font-sans pb-32">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-900/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-900/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light" />
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button size="icon" variant="ghost" className="text-slate-400 hover:text-white" onClick={() => router.back()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-emerald-400">{currentCourse?.courseDay}</span>
                <span className="text-slate-600">/</span>
                <span>{currentCourse?.courseName}</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs text-slate-500 font-mono hidden md:block">{items.length} Assignments</div>
          </div>
        </div>
      </div>

      {/* Drag & Drop List */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {items.length === 0 ? (
          <div className="animate-in zoom-in-95 duration-700 fade-in flex flex-col items-center justify-center min-h-[40vh] border-2 border-dashed border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm p-8 mt-10">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
              <BookOpen className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 text-center">No Assignments Yet</h2>
            <p className="text-slate-400 text-center max-w-md mb-8">This day has no content. Click &quot;Add Assignment&quot; below to start.</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map(s => s.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-5">
                {items.map(item => (
                  <SortableItem key={item.id} item={item} onEdit={setEditingItem} onDelete={setDeletingItem} onOpenMoveDialog={setMovingItem} />
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeId ? (
                <div className="backdrop-blur-xl shadow-2xl rounded-xl border border-emerald-500/30 bg-slate-900/90 p-4 flex items-center gap-4 transform scale-105 cursor-grabbing">
                  <GripVertical className="h-6 w-6 text-emerald-400" />
                  <span className="text-white font-medium text-lg">Moving Assignment...</span>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      {/* Task Bar (Floating Dock) */}
      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
        <div className="w-full max-w-4xl flex flex-col items-center relative">
          {/* Toggle Button */}
          <button
            onClick={() => setIsDockExpanded(!isDockExpanded)}
            className={`
              pointer-events-auto relative z-20 flex items-center justify-center gap-2 px-5 py-2 rounded-full 
              font-medium text-sm transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
              ${
                isDockExpanded
                  ? 'mb-[-20px] bg-slate-800 text-slate-400 opacity-0 translate-y-4'
                  : 'bg-slate-900 border border-white/10 text-slate-200 shadow-xl hover:scale-105 hover:bg-slate-800 hover:text-white translate-y-0'
              }
            `}
          >
            <Layers className="h-4 w-4 text-emerald-400" />
            <span>Open Tools</span>
            <ArrowUp className="h-3 w-3" />
          </button>

          {/* The Dock Bar */}
          <div
            className={`
              pointer-events-auto w-full relative z-10 overflow-hidden
              bg-slate-900/80 backdrop-blur-2xl border border-white/10 
              shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)]
              rounded-2xl
              transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
              ${isDockExpanded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none h-0'}
            `}
          >
            {/* Close Handle */}
            <div
              onClick={() => setIsDockExpanded(false)}
              className="absolute top-0 left-0 right-0 h-4 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors group"
            >
              <div className="w-12 h-1 rounded-full bg-slate-700 group-hover:bg-slate-500 transition-colors" />
            </div>

            <div className="flex items-center justify-between p-4 pt-6 h-24">
              {/* Add Button */}
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="h-12 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 px-6 rounded-xl font-semibold gap-2 transition-transform active:scale-95 group"
                >
                  <div className="p-1 rounded-full bg-white/20 group-hover:rotate-90 transition-transform duration-300">
                    <Plus className="h-4 w-4" />
                  </div>
                  Add Assignment
                </Button>

                <div className="h-8 w-px bg-white/10 hidden sm:block" />

                <div className="hidden sm:flex flex-col">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Status</span>
                  <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Editing
                  </span>
                </div>
              </div>

              {/* Save Controls */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setIsDockExpanded(false)}
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-xl text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <ChevronDown className="h-5 w-5" />
                </Button>

                <Button
                  onClick={handleSubmitAll}
                  disabled={isUpdating}
                  className={`
                    h-12 px-6 rounded-xl font-medium gap-2 transition-all border
                    ${
                      isUpdating
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20 hover:border-indigo-500/30'
                    }
                  `}
                >
                  {isUpdating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span className="hidden sm:inline">{isUpdating ? 'Saving...' : 'Save Changes'}</span>
                </Button>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* --- ASSIGNMENT SELECTION MODAL --- */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="p-0 overflow-hidden bg-slate-950/95 backdrop-blur-3xl border-white/10 shadow-2xl text-white gap-0 flex flex-col max-w-[90vw] min-w-[90vw] h-[85vh] mt-10">
          {(() => {
            const meta = COMPONENT_MAP.assignment;
            const dataSource = meta.keys;
            const totalItems = dataSource.length;
            const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
            const paginatedItems = dataSource.slice((paginationPage - 1) * ITEMS_PER_PAGE, paginationPage * ITEMS_PER_PAGE);

            return (
              <>
                <div className="shrink-0 flex flex-col bg-white/5 border-b border-white/10">
                  <div className="flex items-center justify-between p-6 pb-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${meta.color} shadow-lg`}>
                        <meta.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">Select {meta.label}</DialogTitle>
                        <p className="text-slate-400 text-sm mt-1">Choose a template to add to your course day.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <ScrollArea className="flex-1 min-h-0 w-full bg-black/20">
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                      {paginatedItems.map(key => {
                        const config = meta.collection[key];
                        // Use Query component for preview
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const PreviewComp = (config as any).query;

                        return (
                          <div
                            key={key}
                            className="group relative bg-slate-900 border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/50 hover:shadow-2xl transition-all duration-300 flex flex-col h-[300px]"
                          >
                            {/* Preview Area */}
                            <div className="relative flex-1 bg-black/40 overflow-hidden">
                              <div className="absolute inset-0 flex items-center justify-center p-4">
                                {/* Scaled down preview */}
                                <div className="w-[200%] h-[200%] origin-center scale-[0.4] pointer-events-none select-none flex items-start justify-center pt-10">
                                  {PreviewComp ? <PreviewComp data={JSON.stringify(config.data)} /> : <div className="text-slate-600">No Preview</div>}
                                </div>
                              </div>
                            </div>

                            {/* Action Area */}
                            <div className="p-4 bg-white/5 border-t border-white/5 flex items-center justify-between gap-2 relative z-10">
                              <h4 className="text-sm font-bold text-slate-200 truncate flex-1">{key}</h4>
                              <Button onClick={() => handleAddItem(key)} size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white">
                                <Plus className="mr-1 h-3 w-3" /> Add
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </ScrollArea>

                {totalPages > 1 && (
                  <div className="shrink-0 p-4 border-t border-white/10 bg-slate-900/50 backdrop-blur-md flex items-center justify-center gap-4 z-20">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setPaginationPage(p => Math.max(1, p - 1))}
                      disabled={paginationPage === 1}
                      className="rounded-full text-slate-400 hover:text-white"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <span className="text-sm font-mono text-slate-300">
                      {paginationPage} / {totalPages}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setPaginationPage(p => Math.min(totalPages, p + 1))}
                      disabled={paginationPage === totalPages}
                      className="rounded-full text-slate-400 hover:text-white"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Move Dialog */}
      <Dialog open={!!movingItem} onOpenChange={() => setMovingItem(null)}>
        <DialogContent className="bg-slate-900 border-white/10 text-white w-full max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">Move Assignment</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4">
            <Button onClick={handleMoveUp} className="h-12 text-lg bg-slate-800 hover:bg-slate-700 justify-start px-6">
              <ArrowUp className="mr-3 h-5 w-5 text-emerald-400" /> Move Up
            </Button>
            <Button onClick={handleMoveDown} className="h-12 text-lg bg-slate-800 hover:bg-slate-700 justify-start px-6">
              <ArrowDown className="mr-3 h-5 w-5 text-emerald-400" /> Move Down
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deletingItem} onOpenChange={() => setDeletingItem(null)}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-sm">
          <div className="flex flex-col items-center text-center p-2">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <DialogTitle className="text-xl font-bold mb-2">Remove Assignment?</DialogTitle>
            <p className="text-slate-400 mb-6 text-sm">
              Are you sure you want to remove <span className="text-white font-medium">{deletingItem?.heading}</span>?
            </p>
            <div className="flex gap-3 w-full">
              <Button onClick={() => setDeletingItem(null)} variant="ghost" className="flex-1 hover:bg-white/10 text-slate-400">
                Cancel
              </Button>
              <Button onClick={handleConfirmDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Content Modal */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-6xl h-[85vh] mt-10 p-0 bg-slate-900/95 backdrop-blur-xl border-white/10 text-white flex flex-col">
          <DialogHeader className="p-4 border-b border-white/10 bg-white/5 shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-emerald-400" /> Edit Assignment
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 w-full bg-black/20">
            {editingItem &&
              (() => {
                const meta = COMPONENT_MAP[editingItem.type];
                const config = meta.collection[editingItem.key];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const Mutation = (config as any).mutation;
                return Mutation ? (
                  // Pass stringified data to match typical mutation component expectation from previous examples
                  // And handle onSave which mirrors onSubmitEdit
                  <Mutation data={JSON.stringify(editingItem.data)} onSave={onSubmitEdit} />
                ) : (
                  <div className="p-20 text-center text-slate-500">No settings available.</div>
                );
              })()}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default function EditCourseDayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin" />
          </div>
        </div>
      }
    >
      <EditCourseContent />
    </Suspense>
  );
}

```

Now here is a Model for dashboardBuilder.
```
import mongoose, { Schema } from 'mongoose';

// Main dashboard builder schema
const dashboardBuilderSchema = new Schema(
  {
    dashboardName: { type: String, required: true },
    dashboardPath: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    content: { type: Schema.Types.Mixed, default: {} },
    contentType: { type: Schema.Types.Mixed, default: {} },
    accessList: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: true, timestamps: true },
);

export default mongoose.models.DashboardBuilder || mongoose.model('DashboardBuilder', dashboardBuilderSchema);

Now Your task is You have to generate controller.ts, model.ts, route.ts, dashboardBuilderSlice.ts, page.tsx, and edit/page.tsx same as course.