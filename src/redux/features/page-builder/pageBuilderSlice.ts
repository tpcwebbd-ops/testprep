import { apiSlice } from '@/redux/api/apiSlice';

export const pageBuilderApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getPageBuilder: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/api/page-builder/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypePageBuilder', id: 'LIST' }],
    }),
    getPageBuilderById: builder.query({
      query: id => `/api/page-builder/v1?id=${id}`,
    }),
    addPageBuilder: builder.mutation({
      query: newSection => ({
        url: '/api/page-builder/v1',
        method: 'POST',
        body: newSection,
      }),
      invalidatesTags: [{ type: 'tagTypePageBuilder' }],
    }),
    updatePageBuilder: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/page-builder/v1`,
        method: 'PUT',
        body: { id, ...data },
      }),
      invalidatesTags: [{ type: 'tagTypePageBuilder' }],
    }),
    deletePageBuilder: builder.mutation({
      query: ({ id }) => ({
        url: `/api/page-builder/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: [{ type: 'tagTypePageBuilder' }],
    }),
    bulkUpdatePageBuilder: builder.mutation({
      query: bulkData => ({
        url: `/api/page-builder/v1?bulk=true`,
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypePageBuilder' }],
    }),
    bulkDeletePageBuilder: builder.mutation({
      query: bulkData => ({
        url: `/api/page-builder/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypePageBuilder' }],
    }),
  }),
});

export const {
  useGetPageBuilderQuery,
  useGetPageBuilderByIdQuery,
  useAddPageBuilderMutation,
  useUpdatePageBuilderMutation,
  useDeletePageBuilderMutation,
  useBulkUpdatePageBuilderMutation,
  useBulkDeletePageBuilderMutation,
} = pageBuilderApi;
