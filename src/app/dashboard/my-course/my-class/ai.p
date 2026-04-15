Look at the code 
my-course/my-class/page.tsx
```
 
const Page = () => {
  return <main>Page</main>;
};
export default Page;

```
here is example of 

api/course/model.ts
```
 

import mongoose, { Schema } from 'mongoose';

const courseSchema = new Schema(
  {
    courseTitle: { type: String, required: true },
    courseDescription: { type: String },
    isActive: { type: Boolean },
    totalClass: { type: Number },
    totalAssignment: { type: Number },
    totalDuration: { type: String },
    totalMockTest: { type: Number },
    realPrice: { type: Number },
    discountPrice: { type: Number },
    challengeDay: { type: Number },
    totalLecture: { type: Number },
    lectureData: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: true, timestamps: true },
);

courseSchema.index({ courseTitle: 1 });
courseSchema.index({ discountPrice: 1 });

export default mongoose.models.Course || mongoose.model('Course', courseSchema);

```

api/course/controller.ts
```


import { FilterQuery } from 'mongoose';

import { withDB } from '@/app/api/utils/db';
import { formatResponse, IResponse } from '@/app/api/utils/utils';

import Course from './model';

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
      const newCourse = await Course.create(courseData);
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
    const course = await Course.findById(id);
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
        $or: [{ courseTitle: { $regex: searchQuery, $options: 'i' } }, { courseDescription: { $regex: searchQuery, $options: 'i' } }],
      };
    }

    const courses = await Course.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit);
    const total = await Course.countDocuments(filter);
    return formatResponse({ courses, total, page, limit }, 'Fetched successfully', 200);
  });
}

export async function getAllCourses(): Promise<IResponse> {
  return withDB(async () => {
    const page = parseInt('1');
    const limit = parseInt('1000');
    const skip = (page - 1) * limit;
    const filter: FilterQuery<unknown> = {};
    const courses = await Course.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit);
    const total = await Course.countDocuments(filter);
    return formatResponse({ courses, total, page, limit }, 'Fetched successfully', 200);
  });
}

export async function updateCourse(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      if (!id) return formatResponse(null, 'ID is required', 400);
      const updated = await Course.findByIdAndUpdate(id, updateData, {
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
    const deleted = await Course.findByIdAndDelete(id);
    if (!deleted) return formatResponse(null, 'Not found', 404);
    return formatResponse({ deletedCount: 1 }, 'Deleted successfully', 200);
  });
}

```

api/course/route.ts
```

import { revalidatePath } from 'next/cache';

import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { formatResponse, IResponse } from '@/app/api/utils/jwt-verify';
import { isUserHasAccessByRole, IWantAccess } from '@/app/api/utils/is-user-has-access-by-role';

import { getCourses, createCourse, updateCourse, deleteCourse, getCourseById } from './controller';

export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'courses',
      access: 'read',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const id = new URL(req.url).searchParams.get('id');
  const result: IResponse = id ? await getCourseById(req) : await getCourses(req);
  return formatResponse(result.data, result.message, result.status);
}

export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'courses',
      access: 'create',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const result = await createCourse(req);
  if (result.status === 200 || result.status === 201) {
    revalidatePath('/courses');
  }
  return formatResponse(result.data, result.message, result.status);
}

export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'courses',
      access: 'update',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const result = await updateCourse(req);
  if (result.status === 200) {
    revalidatePath('/courses');
  }
  return formatResponse(result.data, result.message, result.status);
}

export async function DELETE(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'courses',
      access: 'delete',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const result = await deleteCourse(req);
  if (result.status === 200) {
    revalidatePath('/courses');
  }
  return formatResponse(result.data, result.message, result.status);
}

```

redux/course/courseSlice.ts
```

import { apiSlice } from '@/redux/api/apiSlice';

export const coursesApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCourses: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/api/courses/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypeCourses' as const, id: 'LIST' }],
    }),
    getCourseById: builder.query({
      query: id => `/api/courses/v1?id=${id}`,
      providesTags: (result, error, id) => [{ type: 'tagTypeCourses' as const, id }],
    }),
    addCourse: builder.mutation({
      query: newCourse => ({
        url: '/api/courses/v1',
        method: 'POST',
        body: newCourse,
      }),
      invalidatesTags: [{ type: 'tagTypeCourses' as const, id: 'LIST' }],
    }),
    updateCourse: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/courses/v1`,
        method: 'PUT',
        body: { id, ...data },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'tagTypeCourses' as const, id },
        { type: 'tagTypeCourses' as const, id: 'LIST' },
      ],
    }),
    deleteCourse: builder.mutation({
      query: ({ id }) => ({
        url: `/api/courses/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'tagTypeCourses' as const, id },
        { type: 'tagTypeCourses' as const, id: 'LIST' },
      ],
    }),
    bulkUpdateCourses: builder.mutation({
      query: bulkData => ({
        url: `/api/courses/v1?bulk=true`,
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeCourses' as const, id: 'LIST' }],
    }),
    bulkDeleteCourses: builder.mutation({
      query: bulkData => ({
        url: `/api/courses/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeCourses' as const, id: 'LIST' }],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useBulkUpdateCoursesMutation,
  useBulkDeleteCoursesMutation,
} = coursesApi;

```
------------------------------------------------------------

api/my-course/model.ts
```

import mongoose, { Schema } from 'mongoose';

const myCourseSchema = new Schema(
  {
    studentName: { type: String },
    studentEmail: { type: String },
    courseId: { type: String, required: true },
    progress: { type: Number, default: 0 },
    enrolledAt: { type: Date, default: Date.now },
    attenDance: [
      {
        courseID: { type: String },
        data: [
          {
            ClassName: { type: String },
            status: { type: String, enum: ['complete', 'incomplete'], default: 'incomplete' },
            completeDate: { type: Date },
          },
        ],
      },
    ],
  },
  { _id: true, timestamps: true },
);

myCourseSchema.index({ studentEmail: 1 });
myCourseSchema.index({ studentName: 1 });
myCourseSchema.index({ courseId: 1 });

export default mongoose.models.MyCourse || mongoose.model('MyCourse', myCourseSchema);

```

api/my-course/controller.ts
```

import { FilterQuery } from 'mongoose';

import { withDB } from '@/app/api/utils/db';
import { formatResponse, IResponse } from '@/app/api/utils/utils';

import MyCourse from './model';

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

function isMongoError(error: unknown): error is MongoError {
  return error !== null && typeof error === 'object' && 'code' in error && typeof (error as MongoError).code === 'number';
}

export async function createMyCourse(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const myCourseData = await req.json();
      const newMyCourse = await MyCourse.create(myCourseData);
      return formatResponse(newMyCourse, 'MyCourse created successfully', 201);
    } catch (error: unknown) {
      if (isMongoError(error) && error.code === 11000) {
        return formatResponse(null, `Duplicate: ${JSON.stringify(error.keyValue)}`, 409);
      }
      throw error;
    }
  });
}

export async function getMyCourseById(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'ID is required', 400);
    const myCourse = await MyCourse.findById(id);
    if (!myCourse) return formatResponse(null, 'Not found', 404);
    return formatResponse(myCourse, 'Fetched successfully', 200);
  });
}

export async function getMyCourses(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '1000');
    const skip = (page - 1) * limit;
    const searchQuery = url.searchParams.get('q');
    let filter: FilterQuery<unknown> = {};

    if (searchQuery) {
      filter = {
        $or: [{ studentName: { $regex: searchQuery, $options: 'i' } }, { studentEmail: { $regex: searchQuery, $options: 'i' } }],
      };
    }

    const myCourses = await MyCourse.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit);
    const total = await MyCourse.countDocuments(filter);
    return formatResponse({ myCourses, total, page, limit }, 'Fetched successfully', 200);
  });
}

export async function getAllMyCourses(): Promise<IResponse> {
  return withDB(async () => {
    const page = parseInt('1');
    const limit = parseInt('1000');
    const skip = (page - 1) * limit;
    const filter: FilterQuery<unknown> = {};
    const myCourses = await MyCourse.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit);
    const total = await MyCourse.countDocuments(filter);
    return formatResponse({ myCourses, total, page, limit }, 'Fetched successfully', 200);
  });
}

export async function updateMyCourse(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      if (!id) return formatResponse(null, 'ID is required', 400);
      const updated = await MyCourse.findByIdAndUpdate(id, updateData, {
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

export async function deleteMyCourse(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { id } = await req.json();
    if (!id) return formatResponse(null, 'ID required', 400);
    const deleted = await MyCourse.findByIdAndDelete(id);
    if (!deleted) return formatResponse(null, 'Not found', 404);
    return formatResponse({ deletedCount: 1 }, 'Deleted successfully', 200);
  });
}

```

api/my-course/route.ts
```

import { revalidatePath } from 'next/cache';

import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { formatResponse, IResponse } from '@/app/api/utils/jwt-verify';
import { isUserHasAccessByRole, IWantAccess } from '@/app/api/utils/is-user-has-access-by-role';

import { getMyCourses, createMyCourse, updateMyCourse, deleteMyCourse, getMyCourseById } from './controller';

export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'my-course',
      access: 'read',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const id = new URL(req.url).searchParams.get('id');
  const result: IResponse = id ? await getMyCourseById(req) : await getMyCourses(req);
  return formatResponse(result.data, result.message, result.status);
}

export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'my-course',
      access: 'create',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const result = await createMyCourse(req);
  if (result.status === 200 || result.status === 201) {
    revalidatePath('/my-courses');
  }
  return formatResponse(result.data, result.message, result.status);
}

export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'my-course',
      access: 'update',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const result = await updateMyCourse(req);
  if (result.status === 200) {
    revalidatePath('/my-courses');
  }
  return formatResponse(result.data, result.message, result.status);
}

export async function DELETE(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'my-course',
      access: 'delete',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const result = await deleteMyCourse(req);
  if (result.status === 200) {
    revalidatePath('/my-courses');
  }
  return formatResponse(result.data, result.message, result.status);
}

```

redux/my-course/myCourseSlice.ts
```
import { apiSlice } from '@/redux/api/apiSlice';

export const myCoursesApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getMyCourses: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/api/my-courses/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypeMyCourses' as const, id: 'LIST' }],
    }),
    getMyCourseById: builder.query({
      query: id => `/api/my-courses/v1?id=${id}`,
      providesTags: (result, error, id) => [{ type: 'tagTypeMyCourses' as const, id }],
    }),
    addMyCourse: builder.mutation({
      query: newMyCourse => ({
        url: '/api/my-courses/v1',
        method: 'POST',
        body: newMyCourse,
      }),
      invalidatesTags: [{ type: 'tagTypeMyCourses' as const, id: 'LIST' }],
    }),
    updateMyCourse: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/my-courses/v1`,
        method: 'PUT',
        body: { id, ...data },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'tagTypeMyCourses' as const, id },
        { type: 'tagTypeMyCourses' as const, id: 'LIST' },
      ],
    }),
    deleteMyCourse: builder.mutation({
      query: ({ id }) => ({
        url: `/api/my-courses/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'tagTypeMyCourses' as const, id },
        { type: 'tagTypeMyCourses' as const, id: 'LIST' },
      ],
    }),
    bulkUpdateMyCourses: builder.mutation({
      query: bulkData => ({
        url: `/api/my-courses/v1?bulk=true`,
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeMyCourses' as const, id: 'LIST' }],
    }),
    bulkDeleteMyCourses: builder.mutation({
      query: bulkData => ({
        url: `/api/my-courses/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeMyCourses' as const, id: 'LIST' }],
    }),
  }),
});

export const {
  useGetMyCoursesQuery,
  useGetMyCourseByIdQuery,
  useAddMyCourseMutation,
  useUpdateMyCourseMutation,
  useDeleteMyCourseMutation,
  useBulkUpdateMyCoursesMutation,
  useBulkDeleteMyCoursesMutation,
} = myCoursesApi;

```
------------------------------------------------------------

api/enrollments/model.ts
```
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

api/enrollments/controller.ts
```

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

api/enrollments/route.ts
```

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

redux/enrollments/enrollmentsSlice.ts
```


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
------------------------------------------------------------
here is url example = "/dashboard/my-course/my-class?courseId=69df5a53d9c17d29d836ed83"


Now your task is update my-course/my-class/page.tsx with the following instructions. 

1. fetch the course by courseId throw redux.
2. fetch 

1. At the top left side of the page there is a summery box for View progress. current status, complete class, remain class.
2. and in right side there is a toggle switch named Game mod = on or off.
3. if game mode is on then it show one by one. 
   ## Gaming Mode 
    - at the top there is a circle box named Start here.
    - then below the circle there is another circle box with class Name. 
    - if complete then it show with green and check mark.
    - if not complete then it will block.
    - only one circle box is enable.
    - each circle box is exable one by one.
    - start box will display first attenDance of this course. 
    - then second box have second day. 
    - if some one will not complete those box on that day then the box color is red. but not block.
    ## Normal Mode.
      - this mode display square Box with a Grid layer. 
      - there is a select options for Grid box 
        -- Single line.
        -- 2*2 
        -- 3*3 
4. When I Click a class then it will open a pop-up.[full height and full weight]
5. Inside this pop up. students can see video, notice, take MCA, and submit assignment.

