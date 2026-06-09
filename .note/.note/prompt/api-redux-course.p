Look at the code 
course/model.ts
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

course/controller.ts
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

course/route.ts
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

and redux/courseSlice.ts
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

here is interface for my dashboard example.ts
```

```

Now your task is generate those file for example
1. example/model.ts
2. example/controller.ts
3. example/route.ts
4. redux/exampleSlice.ts