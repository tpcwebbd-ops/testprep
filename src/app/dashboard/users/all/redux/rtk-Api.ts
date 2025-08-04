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
export const gAuthUsersApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getGAuthUsers: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/dashboard/users/all/api/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypeGAuthUsers', id: 'LIST' }],
    }),
    getGAuthUsersById: builder.query({
      query: id => `/dashboard/users/all/api/v1?id=${id}`,
    }),
    addGAuthUsers: builder.mutation({
      query: newGAuthUsers => ({
        url: '/dashboard/users/all/api/v1',
        method: 'POST',
        body: newGAuthUsers,
      }),
      invalidatesTags: [{ type: 'tagTypeGAuthUsers' }],
    }),
    updateGAuthUsers: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/dashboard/users/all/api/v1`,
        method: 'PUT',
        body: { id: id, ...data },
      }),
      invalidatesTags: [{ type: 'tagTypeGAuthUsers' }],
    }),
    deleteGAuthUsers: builder.mutation({
      query: ({ id }) => ({
        url: `/dashboard/users/all/api/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: [{ type: 'tagTypeGAuthUsers' }],
    }),
    bulkUpdateGAuthUsers: builder.mutation({
      query: bulkData => ({
        url: `/dashboard/users/all/api/v1?bulk=true`,
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeGAuthUsers' }],
    }),
    bulkDeleteGAuthUsers: builder.mutation({
      query: bulkData => ({
        url: `/dashboard/users/all/api/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeGAuthUsers' }],
    }),
  }),
});

export const {
  useGetGAuthUsersQuery,
  useAddGAuthUsersMutation,
  useUpdateGAuthUsersMutation,
  useDeleteGAuthUsersMutation,
  useBulkUpdateGAuthUsersMutation,
  useBulkDeleteGAuthUsersMutation,
  useGetGAuthUsersByIdQuery,
} = gAuthUsersApi;
