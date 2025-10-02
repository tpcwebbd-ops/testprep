// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const follow_UpsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getFollow_Ups: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/generate/follow_Ups/all/api/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeFollow_Ups', id: 'LIST' }],
        }),
        getFollow_UpsSummary: builder.query({
            query: ({ page, limit }) => {
                return `/generate/follow_Ups/all/api/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypeFollow_Ups', id: 'LIST' }],
        }),
        getFollow_UpsById: builder.query({
            query: (id) => `/generate/follow_Ups/all/api/v1?id=${id}`,
        }),
        addFollow_Ups: builder.mutation({
            query: (newFollow_Up) => ({
                url: '/generate/follow_Ups/all/api/v1',
                method: 'POST',
                body: newFollow_Up,
            }),
            invalidatesTags: [{ type: 'tagTypeFollow_Ups' }],
        }),
        updateFollow_Ups: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/generate/follow_Ups/all/api/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeFollow_Ups' }],
        }),
        deleteFollow_Ups: builder.mutation({
            query: ({ id }) => ({
                url: `/generate/follow_Ups/all/api/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeFollow_Ups' }],
        }),
        bulkUpdateFollow_Ups: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/follow_Ups/all/api/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeFollow_Ups' }],
        }),
        bulkDeleteFollow_Ups: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/follow_Ups/all/api/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeFollow_Ups' }],
        }),
    }),
})

export const {
    useGetFollow_UpsQuery,
    useGetFollow_UpsSummaryQuery,
    useAddFollow_UpsMutation,
    useUpdateFollow_UpsMutation,
    useDeleteFollow_UpsMutation,
    useBulkUpdateFollow_UpsMutation,
    useBulkDeleteFollow_UpsMutation,
    useGetFollow_UpsByIdQuery,
} = follow_UpsApi
