/*
|-----------------------------------------
| setting up DbBuilderSlice for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { apiSlice } from '@/redux/api/apiSlice';

export const dbBuilderApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getDbBuilderPages: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/api/db-builder/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypeDbBuilder', id: 'LIST' }],
    }),
    getDbBuilderPageById: builder.query({
      query: id => `/api/db-builder/v1?id=${id}`,
      providesTags: (result, error, id) => [{ type: 'tagTypeDbBuilder', id }],
    }),
    addDbBuilderPage: builder.mutation({
      query: newPage => ({
        url: '/api/db-builder/v1',
        method: 'POST',
        body: newPage,
      }),
      invalidatesTags: [{ type: 'tagTypeDbBuilder', id: 'LIST' }],
    }),
    updateDbBuilderPage: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/db-builder/v1`,
        method: 'PUT',
        body: { id, ...data },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'tagTypeDbBuilder', id },
        { type: 'tagTypeDbBuilder', id: 'LIST' },
      ],
    }),
    deleteDbBuilderPage: builder.mutation({
      query: ({ id }) => ({
        url: `/api/db-builder/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'tagTypeDbBuilder', id },
        { type: 'tagTypeDbBuilder', id: 'LIST' },
      ],
    }),
    bulkUpdateDbBuilderPages: builder.mutation({
      query: bulkData => ({
        url: `/api/db-builder/v1?bulk=true`,
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeDbBuilder', id: 'LIST' }],
    }),
    bulkDeleteDbBuilderPages: builder.mutation({
      query: bulkData => ({
        url: `/api/db-builder/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeDbBuilder', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetDbBuilderPagesQuery: useGetPagesQuery,
  useGetDbBuilderPageByIdQuery: useGetPageByIdQuery,
  useAddDbBuilderPageMutation: useAddPageMutation,
  useUpdateDbBuilderPageMutation: useUpdatePageMutation,
  useDeleteDbBuilderPageMutation: useDeletePageMutation,
  useBulkUpdateDbBuilderPagesMutation: useBulkUpdatePagesMutation,
  useBulkDeleteDbBuilderPagesMutation: useBulkDeletePagesMutation,
} = dbBuilderApi;
