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
    getUsers_admin_access: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/dashboard/access-management/admin/api/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypeUsers_admin_access', id: 'LIST' }],
    }),
    getUsers_admin_accessById: builder.query({
      query: id => `/dashboard/access-management/admin/api/v1?id=${id}`,
    }),
    addUsers_admin_access: builder.mutation({
      query: newUsers_access => ({
        url: '/dashboard/access-management/admin/api/v1',
        method: 'POST',
        body: newUsers_access,
      }),
      invalidatesTags: [{ type: 'tagTypeUsers_admin_access' }],
    }),
    updateUsers_admin_access: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/dashboard/access-management/admin/api/v1`,
        method: 'PUT',
        body: { id: id, ...data },
      }),
      invalidatesTags: [{ type: 'tagTypeUsers_admin_access' }],
    }),
    deleteUsers_admin_access: builder.mutation({
      query: ({ id }) => ({
        url: `/dashboard/access-management/admin/api/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: [{ type: 'tagTypeUsers_admin_access' }],
    }),
    bulkUpdateUsers_admin_access: builder.mutation({
      query: bulkData => ({
        url: `/dashboard/access-management/admin/api/v1?bulk=true`,
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeUsers_admin_access' }],
    }),
    bulkDeleteUsers_admin_access: builder.mutation({
      query: bulkData => ({
        url: `/dashboard/access-management/admin/api/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeUsers_admin_access' }],
    }),
  }),
});

export const {
  useGetUsers_admin_accessQuery,
  useAddUsers_admin_accessMutation,
  useUpdateUsers_admin_accessMutation,
  useDeleteUsers_admin_accessMutation,
  useBulkUpdateUsers_admin_accessMutation,
  useBulkDeleteUsers_admin_accessMutation,
  useGetUsers_admin_accessByIdQuery,
} = users_accessApi;
