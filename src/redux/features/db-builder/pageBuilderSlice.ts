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
    getDbBuilderRecords: builder.query({
      query: pageId => `/api/db-builder/v1?resource=records&pageId=${encodeURIComponent(pageId)}`,
      providesTags: (result, error, pageId) => [{ type: 'tagTypeDbBuilder', id: `RECORDS-${pageId}` }],
    }),
    addDbBuilderRecord: builder.mutation({
      query: newRecord => ({
        url: '/api/db-builder/v1?resource=records',
        method: 'POST',
        body: newRecord,
      }),
      invalidatesTags: (result, error, { pageId }) => [{ type: 'tagTypeDbBuilder', id: `RECORDS-${pageId}` }],
    }),
    updateDbBuilderRecord: builder.mutation({
      query: ({ id, ...data }) => ({
        url: '/api/db-builder/v1?resource=records',
        method: 'PUT',
        body: { id, ...data },
      }),
      invalidatesTags: (result, error, { pageId }) => [{ type: 'tagTypeDbBuilder', id: `RECORDS-${pageId}` }],
    }),
    deleteDbBuilderRecord: builder.mutation({
      query: ({ id, pageId }) => ({
        url: '/api/db-builder/v1?resource=records',
        method: 'DELETE',
        body: { id, pageId },
      }),
      invalidatesTags: (result, error, { pageId }) => [{ type: 'tagTypeDbBuilder', id: `RECORDS-${pageId}` }],
    }),
    bulkUpdateDbBuilderRecords: builder.mutation({
      query: bulkData => ({
        url: '/api/db-builder/v1?resource=records&bulk=true',
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: (result, error, { pageId }) => [{ type: 'tagTypeDbBuilder', id: `RECORDS-${pageId}` }],
    }),
    bulkDeleteDbBuilderRecords: builder.mutation({
      query: bulkData => ({
        url: '/api/db-builder/v1?resource=records&bulk=true',
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: (result, error, { pageId }) => [{ type: 'tagTypeDbBuilder', id: `RECORDS-${pageId}` }],
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
  useGetDbBuilderRecordsQuery: useGetRecordsQuery,
  useAddDbBuilderRecordMutation: useAddRecordMutation,
  useUpdateDbBuilderRecordMutation: useUpdateRecordMutation,
  useDeleteDbBuilderRecordMutation: useDeleteRecordMutation,
  useBulkUpdateDbBuilderRecordsMutation: useBulkUpdateRecordsMutation,
  useBulkDeleteDbBuilderRecordsMutation: useBulkDeleteRecordsMutation,
} = dbBuilderApi;
