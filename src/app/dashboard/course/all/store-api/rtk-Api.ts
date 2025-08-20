/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/
// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice';

// Use absolute paths with leading slash to ensure consistent behavior
export const coursesApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCourses: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/dashboard/course/all/api/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypeCourses', id: 'LIST' }],
    }),
    getCoursesById: builder.query({
      query: id => `/dashboard/course/all/api/v1?id=${id}`,
    }),
    addCourses: builder.mutation({
      query: newCourses => ({
        url: '/dashboard/course/all/api/v1',
        method: 'POST',
        body: newCourses,
      }),
      invalidatesTags: [{ type: 'tagTypeCourses' }],
    }),
    updateCourses: builder.mutation({
      query: ({ ...data }) => ({
        url: `/dashboard/course/all/api/v1`,
        method: 'PUT',
        body: { ...data },
      }),
      invalidatesTags: [{ type: 'tagTypeCourses' }],
    }),
    deleteCourses: builder.mutation({
      query: ({ id }) => ({
        url: `/dashboard/course/all/api/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: [{ type: 'tagTypeCourses' }],
    }),
    bulkUpdateCourses: builder.mutation({
      query: bulkData => ({
        url: `/dashboard/course/all/api/v1?bulk=true`,
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeCourses' }],
    }),
    bulkDeleteCourses: builder.mutation({
      query: bulkData => ({
        url: `/dashboard/course/all/api/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeCourses' }],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useAddCoursesMutation,
  useUpdateCoursesMutation,
  useDeleteCoursesMutation,
  useBulkUpdateCoursesMutation,
  useBulkDeleteCoursesMutation,
  useGetCoursesByIdQuery,
} = coursesApi;
