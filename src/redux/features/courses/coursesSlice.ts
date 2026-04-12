/*
|-----------------------------------------
| setting up coursesSlice for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

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
