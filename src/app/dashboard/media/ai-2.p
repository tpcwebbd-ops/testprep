Help to to write a proper prompt for media controller.
I have successfully implement NextJs Typescript and PWA in my application. Now I want to implement media controller in my dashboard. I want to store image in image bb, and Video, Document, and pdf in upload things. I will provide the components for upload in imageBB or uploadthing. 

here is project structure 
1. api/route.ts
2. api/model.ts
3. api/controller.ts 

4. redux/features/mideaSlice.ts 

5. app/dashboard/media/page.tsx
    i. at the top right side there is name Media and right side there are some Link named Videos, Images, Documents, Pdf
    ii. There all images will show in this page.
    iii. If there are more then 10 items then You have to use paginations. 

6. app/dashboard/media/video/page.tsx
    i. Only Video is shown with paginations if need.

7. app/dashboard/media/images/page.tsx
    i. Only Images is shown with paginations if need.

8. app/dashboard/media/documents/page.tsx
    i. Only Documents is shown with paginations if need.

9. app/dashboard/media/pdf/page.tsx
    i. Only PDF is shown with paginations if need.

10. app/dashboard/media/trash/page.tsx
    i. Only all Trash items are shown with paginations if need.
 


11. app/dashboard/media/example/video/page.tsx
    i. An example of Upload Video.

12. app/dashboard/media/example/images/page.tsx
    i. An example of Upload Images.
13. app/dashboard/media/example/documents/page.tsx
    i. An example of Upload Documents.
14. app/dashboard/media/example/pdf/page.tsx
    i. An example of Upload Pdf.


Now Your task is make those 14 page with those features. 

here are example of some code. 

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

model.ts 
```
import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    delete_url: {
      type: String,
      trim: true,
    },
    display_url: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    author_email: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'trash'],
      default: 'active',
    },
    contentType: {
      type: String,
      enum: ['video', 'image', 'pdf', 'docx'],
      default: 'image',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export default mongoose.models.Media || mongoose.model('Media', mediaSchema);

```

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

and here are reduxSlice.ts 
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


and here are page.tsx 
```
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
``` 

Now Your task is generate a proper prompt for generate those component for media controller.