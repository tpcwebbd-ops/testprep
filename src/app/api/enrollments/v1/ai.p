Look at the course/controller.ts
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
course/model.ts
```
import mongoose, { Schema } from 'mongoose';

const myCourseSchema = new Schema(
  {
    studentName: { type: String },
    studentEmail: { type: String },
    enrollmentDate: { type: Date, default: Date.now },
    enrollCoursesID: [
      {
        courseID: { type: String },
        enrollmentDate: { type: Date, default: Date.now },
      },
    ],
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
course/route.ts
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

and here is example of redux/courseSlice.ts
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

here is example of interface of enrollments 
```
    "studentName": "string",
    "studentEmail": "email",
    "enrollmentDate": "date",
    "enrollCoursesIDS": string[],
    "realPrice": "number",
    "discountPrice": "number",
    "paymentAmount": "number",
    "paymentMethod": "string",
    "couponCode": "string",
    "checkedbyEmail": "email",
    "paymentStatus": "string"
```

Now yoru task is generate those file
enrollments/controller.ts
enrollments/model.ts
enrollments/route.ts
redux/enrollmentsSlice.ts 