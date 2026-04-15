Look at those code
api/my-course/v1/controller.ts
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
api/my-course/v1/model.ts
```
/*
|-----------------------------------------
| setting up Model for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Testprep , April, 2026
|-----------------------------------------
*/
import mongoose, { Schema } from 'mongoose';

const myCourseSchema = new Schema(
  {
    studentName: { type: String },
    studentEmail: { type: String },
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

export default mongoose.models.MyCourse || mongoose.model('MyCourse', myCourseSchema);

```

api/my-course/v1/route.ts
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
redux/myCoursesSlice.ts
```
/*
|-----------------------------------------
| setting up coursesSlice for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/
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


Now your task is generate those file if need updated. if there is no need to update then just write No Need to update.
my-courses/v1/controller.ts, 
my-courses/v1/model.ts, and 
my-courses/v1/route.ts
redux/myCoursesSlice.ts

