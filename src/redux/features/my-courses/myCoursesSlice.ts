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
