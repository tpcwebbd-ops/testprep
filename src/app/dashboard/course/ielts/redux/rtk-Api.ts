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
    getIELTSLectures: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/dashboard/course/ielts/api/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypeIELTS', id: 'LIST' }],
    }),
    getIELTSLecturesById: builder.query({
      query: id => `/dashboard/course/ielts/api/v1?id=${id}`,
    }),
    addIELTSLectures: builder.mutation({
      query: newCourses => ({
        url: '/dashboard/course/ielts/api/v1',
        method: 'POST',
        body: newCourses,
      }),
      invalidatesTags: [{ type: 'tagTypeIELTS' }],
    }),
    updateIELTSLectures: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/dashboard/course/ielts/api/v1`,
        method: 'PUT',
        body: { id: id, ...data },
      }),
      invalidatesTags: [{ type: 'tagTypeIELTS' }],
    }),
    deleteIELTSLectures: builder.mutation({
      query: ({ id }) => ({
        url: `/dashboard/course/ielts/api/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: [{ type: 'tagTypeIELTS' }],
    }),
    bulkUpdateIELTSLectures: builder.mutation({
      query: bulkData => ({
        url: `/dashboard/course/ielts/api/v1?bulk=true`,
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeIELTS' }],
    }),
    bulkDeleteIELTSLectures: builder.mutation({
      query: bulkData => ({
        url: `/dashboard/course/ielts/api/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeIELTS' }],
    }),
  }),
});

export const {
  useGetIELTSLecturesQuery,
  useAddIELTSLecturesMutation,
  useUpdateIELTSLecturesMutation,
  useDeleteIELTSLecturesMutation,
  useBulkUpdateIELTSLecturesMutation,
  useBulkDeleteIELTSLecturesMutation,
  useGetIELTSLecturesByIdQuery,
} = coursesApi;
