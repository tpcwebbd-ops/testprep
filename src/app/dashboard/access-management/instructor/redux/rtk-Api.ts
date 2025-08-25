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
    getUsers_instructor_access: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/dashboard/access-management/instructor/api/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypeUsers_instructor_access', id: 'LIST' }],
    }),
    getUsers_instructor_accessById: builder.query({
      query: id => `/dashboard/access-management/instructor/api/v1?id=${id}`,
    }),
    addUsers_instructor_access: builder.mutation({
      query: newUsers_access => ({
        url: '/dashboard/access-management/instructor/api/v1',
        method: 'POST',
        body: newUsers_access,
      }),
      invalidatesTags: [{ type: 'tagTypeUsers_instructor_access' }],
    }),
    updateUsers_instructor_access: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/dashboard/access-management/instructor/api/v1`,
        method: 'PUT',
        body: { id: id, ...data },
      }),
      invalidatesTags: [{ type: 'tagTypeUsers_instructor_access' }],
    }),
    deleteUsers_instructor_access: builder.mutation({
      query: ({ id }) => ({
        url: `/dashboard/access-management/instructor/api/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: [{ type: 'tagTypeUsers_instructor_access' }],
    }),
    bulkUpdateUsers_instructor_access: builder.mutation({
      query: bulkData => ({
        url: `/dashboard/access-management/instructor/api/v1?bulk=true`,
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeUsers_instructor_access' }],
    }),
    bulkDeleteUsers_instructor_access: builder.mutation({
      query: bulkData => ({
        url: `/dashboard/access-management/instructor/api/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeUsers_instructor_access' }],
    }),
  }),
});

export const {
  useGetUsers_instructor_accessQuery,
  useAddUsers_instructor_accessMutation,
  useUpdateUsers_instructor_accessMutation,
  useDeleteUsers_instructor_accessMutation,
  useBulkUpdateUsers_instructor_accessMutation,
  useBulkDeleteUsers_instructor_accessMutation,
  useGetUsers_instructor_accessByIdQuery,
} = users_accessApi;
