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
    getUsers_block_users_access: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/dashboard/access-management/block-users/api/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypeUsers_block_users_access', id: 'LIST' }],
    }),
    getUsers_block_users_accessById: builder.query({
      query: id => `/dashboard/access-management/block-users/api/v1?id=${id}`,
    }),
    addUsers_block_users_access: builder.mutation({
      query: newUsers_access => ({
        url: '/dashboard/access-management/block-users/api/v1',
        method: 'POST',
        body: newUsers_access,
      }),
      invalidatesTags: [{ type: 'tagTypeUsers_block_users_access' }],
    }),
    updateUsers_block_users_access: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/dashboard/access-management/block-users/api/v1`,
        method: 'PUT',
        body: { id: id, ...data },
      }),
      invalidatesTags: [{ type: 'tagTypeUsers_block_users_access' }],
    }),
    deleteUsers_block_users_access: builder.mutation({
      query: ({ id }) => ({
        url: `/dashboard/access-management/block-users/api/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: [{ type: 'tagTypeUsers_block_users_access' }],
    }),
    bulkUpdateUsers_block_users_access: builder.mutation({
      query: bulkData => ({
        url: `/dashboard/access-management/block-users/api/v1?bulk=true`,
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeUsers_block_users_access' }],
    }),
    bulkDeleteUsers_block_users_access: builder.mutation({
      query: bulkData => ({
        url: `/dashboard/access-management/block-users/api/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeUsers_block_users_access' }],
    }),
  }),
});

export const {
  useGetUsers_block_users_accessQuery,
  useAddUsers_block_users_accessMutation,
  useUpdateUsers_block_users_accessMutation,
  useDeleteUsers_block_users_accessMutation,
  useBulkUpdateUsers_block_users_accessMutation,
  useBulkDeleteUsers_block_users_accessMutation,
  useGetUsers_block_users_accessByIdQuery,
} = users_accessApi;
