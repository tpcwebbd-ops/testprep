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
export const users_2_000___Api = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUsers_1_000___: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/dashboard/a__1_1001_users__/all/api/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypeUsers_1_000___', id: 'LIST' }],
    }),
    getUsers_1_000___ById: builder.query({
      query: id => `/dashboard/a__1_1001_users__/all/api/v1?id=${id}`,
    }),
    addUsers_1_000___: builder.mutation({
      query: newUsers_1_000___ => ({
        url: '/dashboard/a__1_1001_users__/all/api/v1',
        method: 'POST',
        body: newUsers_1_000___,
      }),
      invalidatesTags: [{ type: 'tagTypeUsers_1_000___' }],
    }),
    updateUsers_1_000___: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/dashboard/a__1_1001_users__/all/api/v1`,
        method: 'PUT',
        body: { id: id, ...data },
      }),
      invalidatesTags: [{ type: 'tagTypeUsers_1_000___' }],
    }),
    deleteUsers_1_000___: builder.mutation({
      query: ({ id }) => ({
        url: `/dashboard/a__1_1001_users__/all/api/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: [{ type: 'tagTypeUsers_1_000___' }],
    }),
    bulkUpdateUsers_1_000___: builder.mutation({
      query: bulkData => ({
        url: `/dashboard/a__1_1001_users__/all/api/v1?bulk=true`,
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeUsers_1_000___' }],
    }),
    bulkDeleteUsers_1_000___: builder.mutation({
      query: bulkData => ({
        url: `/dashboard/a__1_1001_users__/all/api/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeUsers_1_000___' }],
    }),
  }),
});

export const {
  useGetUsers_1_000___Query,
  useAddUsers_1_000___Mutation,
  useUpdateUsers_1_000___Mutation,
  useDeleteUsers_1_000___Mutation,
  useBulkUpdateUsers_1_000___Mutation,
  useBulkDeleteUsers_1_000___Mutation,
  useGetUsers_1_000___ByIdQuery,
} = users_2_000___Api;
