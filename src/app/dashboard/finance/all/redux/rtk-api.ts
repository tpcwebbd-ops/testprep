// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice';

// Use absolute paths with leading slash to ensure consistent behavior
export const financeApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getfinances: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/dashboard/finance/all/api/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypeFinance', id: 'LIST' }],
    }),
    getfinancesById: builder.query({
      query: id => `/dashboard/finance/all/api/v1?id=${id}`,
    }),
    addfinances: builder.mutation({
      query: newFinance => ({
        url: '/dashboard/finance/all/api/v1',
        method: 'POST',
        body: newFinance,
      }),
      invalidatesTags: [{ type: 'tagTypeFinance' }],
    }),
    updatefinances: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/dashboard/finance/all/api/v1`,
        method: 'PUT',
        body: { id: id, ...data },
      }),
      invalidatesTags: [{ type: 'tagTypeFinance' }],
    }),
    deletefinances: builder.mutation({
      query: ({ id }) => ({
        url: `/dashboard/finance/all/api/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: [{ type: 'tagTypeFinance' }],
    }),
    bulkUpdatefinances: builder.mutation({
      query: bulkData => ({
        url: `/dashboard/finance/all/api/v1?bulk=true`,
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeFinance' }],
    }),
    bulkDeletefinances: builder.mutation({
      query: bulkData => ({
        url: `/dashboard/finance/all/api/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeFinance' }],
    }),
  }),
});

export const {
  useGetfinancesQuery,
  useAddfinancesMutation,
  useUpdatefinancesMutation,
  useDeletefinancesMutation,
  useBulkUpdatefinancesMutation,
  useBulkDeletefinancesMutation,
  useGetfinancesByIdQuery,
} = financeApi;
