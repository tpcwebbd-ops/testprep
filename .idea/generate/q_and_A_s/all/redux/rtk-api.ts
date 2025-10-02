// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const q_and_A_sApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getQ_and_A_s: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/generate/q_and_A_s/all/api/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeQ_and_A_s', id: 'LIST' }],
        }),
        getQ_and_A_sSummary: builder.query({
            query: ({ page, limit }) => {
                return `/generate/q_and_A_s/all/api/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypeQ_and_A_s', id: 'LIST' }],
        }),
        getQ_and_A_sById: builder.query({
            query: (id) => `/generate/q_and_A_s/all/api/v1?id=${id}`,
        }),
        addQ_and_A_s: builder.mutation({
            query: (newQ_and_A) => ({
                url: '/generate/q_and_A_s/all/api/v1',
                method: 'POST',
                body: newQ_and_A,
            }),
            invalidatesTags: [{ type: 'tagTypeQ_and_A_s' }],
        }),
        updateQ_and_A_s: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/generate/q_and_A_s/all/api/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeQ_and_A_s' }],
        }),
        deleteQ_and_A_s: builder.mutation({
            query: ({ id }) => ({
                url: `/generate/q_and_A_s/all/api/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeQ_and_A_s' }],
        }),
        bulkUpdateQ_and_A_s: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/q_and_A_s/all/api/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeQ_and_A_s' }],
        }),
        bulkDeleteQ_and_A_s: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/q_and_A_s/all/api/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeQ_and_A_s' }],
        }),
    }),
})

export const {
    useGetQ_and_A_sQuery,
    useGetQ_and_A_sSummaryQuery,
    useAddQ_and_A_sMutation,
    useUpdateQ_and_A_sMutation,
    useDeleteQ_and_A_sMutation,
    useBulkUpdateQ_and_A_sMutation,
    useBulkDeleteQ_and_A_sMutation,
    useGetQ_and_A_sByIdQuery,
} = q_and_A_sApi
