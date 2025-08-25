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
    getUsers_mentor_access: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/dashboard/access-management/mentor/api/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypeUsers_mentor_access', id: 'LIST' }],
    }),
    getUsers_mentor_accessById: builder.query({
      query: id => `/dashboard/access-management/mentor/api/v1?id=${id}`,
    }),
    addUsers_mentor_access: builder.mutation({
      query: newUsers_access => ({
        url: '/dashboard/access-management/mentor/api/v1',
        method: 'POST',
        body: newUsers_access,
      }),
      invalidatesTags: [{ type: 'tagTypeUsers_mentor_access' }],
    }),
    updateUsers_mentor_access: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/dashboard/access-management/mentor/api/v1`,
        method: 'PUT',
        body: { id: id, ...data },
      }),
      invalidatesTags: [{ type: 'tagTypeUsers_mentor_access' }],
    }),
    deleteUsers_mentor_access: builder.mutation({
      query: ({ id }) => ({
        url: `/dashboard/access-management/mentor/api/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: [{ type: 'tagTypeUsers_mentor_access' }],
    }),
    bulkUpdateUsers_mentor_access: builder.mutation({
      query: bulkData => ({
        url: `/dashboard/access-management/mentor/api/v1?bulk=true`,
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeUsers_mentor_access' }],
    }),
    bulkDeleteUsers_mentor_access: builder.mutation({
      query: bulkData => ({
        url: `/dashboard/access-management/mentor/api/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeUsers_mentor_access' }],
    }),
  }),
});

export const {
  useGetUsers_mentor_accessQuery,
  useAddUsers_mentor_accessMutation,
  useUpdateUsers_mentor_accessMutation,
  useDeleteUsers_mentor_accessMutation,
  useBulkUpdateUsers_mentor_accessMutation,
  useBulkDeleteUsers_mentor_accessMutation,
  useGetUsers_mentor_accessByIdQuery,
} = users_accessApi;
