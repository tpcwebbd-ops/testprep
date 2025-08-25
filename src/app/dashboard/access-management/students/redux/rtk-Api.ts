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
export const users_accessApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUsers_student_access: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/dashboard/access-management/students/api/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypeUsers_student_access', id: 'LIST' }],
    }),
    getUsers_student_accessById: builder.query({
      query: id => `/dashboard/access-management/students/api/v1?id=${id}`,
    }),
    addUsers_student_access: builder.mutation({
      query: newUsers_access => ({
        url: '/dashboard/access-management/students/api/v1',
        method: 'POST',
        body: newUsers_access,
      }),
      invalidatesTags: [{ type: 'tagTypeUsers_student_access' }],
    }),
    updateUsers_student_access: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/dashboard/access-management/students/api/v1`,
        method: 'PUT',
        body: { id: id, ...data },
      }),
      invalidatesTags: [{ type: 'tagTypeUsers_student_access' }],
    }),
    deleteUsers_student_access: builder.mutation({
      query: ({ id }) => ({
        url: `/dashboard/access-management/students/api/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: [{ type: 'tagTypeUsers_student_access' }],
    }),
    bulkUpdateUsers_student_access: builder.mutation({
      query: bulkData => ({
        url: `/dashboard/access-management/students/api/v1?bulk=true`,
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeUsers_student_access' }],
    }),
    bulkDeleteUsers_student_access: builder.mutation({
      query: bulkData => ({
        url: `/dashboard/access-management/students/api/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeUsers_student_access' }],
    }),
  }),
});

export const {
  useGetUsers_student_accessQuery,
  useAddUsers_student_accessMutation,
  useUpdateUsers_student_accessMutation,
  useDeleteUsers_student_accessMutation,
  useBulkUpdateUsers_student_accessMutation,
  useBulkDeleteUsers_student_accessMutation,
  useGetUsers_student_accessByIdQuery,
} = users_accessApi;
