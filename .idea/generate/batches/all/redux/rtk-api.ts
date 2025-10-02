// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const batchesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBatches: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/generate/batches/all/api/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeBatches', id: 'LIST' }],
        }),
        getBatchesSummary: builder.query({
            query: ({ page, limit }) => {
                return `/generate/batches/all/api/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypeBatches', id: 'LIST' }],
        }),
        getBatchesById: builder.query({
            query: (id) => `/generate/batches/all/api/v1?id=${id}`,
        }),
        addBatches: builder.mutation({
            query: (newBatch) => ({
                url: '/generate/batches/all/api/v1',
                method: 'POST',
                body: newBatch,
            }),
            invalidatesTags: [{ type: 'tagTypeBatches' }],
        }),
        updateBatches: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/generate/batches/all/api/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeBatches' }],
        }),
        deleteBatches: builder.mutation({
            query: ({ id }) => ({
                url: `/generate/batches/all/api/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeBatches' }],
        }),
        bulkUpdateBatches: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/batches/all/api/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeBatches' }],
        }),
        bulkDeleteBatches: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/batches/all/api/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeBatches' }],
        }),
    }),
})

export const {
    useGetBatchesQuery,
    useGetBatchesSummaryQuery,
    useAddBatchesMutation,
    useUpdateBatchesMutation,
    useDeleteBatchesMutation,
    useBulkUpdateBatchesMutation,
    useBulkDeleteBatchesMutation,
    useGetBatchesByIdQuery,
} = batchesApi
