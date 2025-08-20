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
    getSpokenLectures: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/dashboard/course/spoken/api/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypeSpoken', id: 'LIST' }],
    }),
    getSpokenLecturesById: builder.query({
      query: id => `/dashboard/course/spoken/api/v1?id=${id}`,
    }),
    addSpokenLectures: builder.mutation({
      query: newCourses => ({
        url: '/dashboard/course/spoken/api/v1',
        method: 'POST',
        body: newCourses,
      }),
      invalidatesTags: [{ type: 'tagTypeSpoken' }],
    }),
    updateSpokenLectures: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/dashboard/course/spoken/api/v1`,
        method: 'PUT',
        body: { id: id, ...data },
      }),
      invalidatesTags: [{ type: 'tagTypeSpoken' }],
    }),
    deleteSpokenLectures: builder.mutation({
      query: ({ id }) => ({
        url: `/dashboard/course/spoken/api/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: [{ type: 'tagTypeSpoken' }],
    }),
    bulkUpdateSpokenLectures: builder.mutation({
      query: bulkData => ({
        url: `/dashboard/course/spoken/api/v1?bulk=true`,
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeSpoken' }],
    }),
    bulkDeleteSpokenLectures: builder.mutation({
      query: bulkData => ({
        url: `/dashboard/course/spoken/api/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeSpoken' }],
    }),
  }),
});

export const {
  useGetSpokenLecturesQuery,
  useAddSpokenLecturesMutation,
  useUpdateSpokenLecturesMutation,
  useDeleteSpokenLecturesMutation,
  useBulkUpdateSpokenLecturesMutation,
  useBulkDeleteSpokenLecturesMutation,
  useGetSpokenLecturesByIdQuery,
} = coursesApi;
