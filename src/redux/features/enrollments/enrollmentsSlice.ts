/*
|-----------------------------------------
| setting up coursesSlice for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

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
