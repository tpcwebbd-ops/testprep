// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const media_sApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMedia_s: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/generate/media_s/all/api/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeMedia_s', id: 'LIST' }],
        }),
        getMedia_sSummary: builder.query({
            query: ({ page, limit }) => {
                return `/generate/media_s/all/api/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypeMedia_s', id: 'LIST' }],
        }),
        getMedia_sById: builder.query({
            query: (id) => `/generate/media_s/all/api/v1?id=${id}`,
        }),
        addMedia_s: builder.mutation({
            query: (newMedia) => ({
                url: '/generate/media_s/all/api/v1',
                method: 'POST',
                body: newMedia,
            }),
            invalidatesTags: [{ type: 'tagTypeMedia_s' }],
        }),
        updateMedia_s: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/generate/media_s/all/api/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeMedia_s' }],
        }),
        deleteMedia_s: builder.mutation({
            query: ({ id }) => ({
                url: `/generate/media_s/all/api/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeMedia_s' }],
        }),
        bulkUpdateMedia_s: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/media_s/all/api/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeMedia_s' }],
        }),
        bulkDeleteMedia_s: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/media_s/all/api/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeMedia_s' }],
        }),
    }),
})

export const {
    useGetMedia_sQuery,
    useGetMedia_sSummaryQuery,
    useAddMedia_sMutation,
    useUpdateMedia_sMutation,
    useDeleteMedia_sMutation,
    useBulkUpdateMedia_sMutation,
    useBulkDeleteMedia_sMutation,
    useGetMedia_sByIdQuery,
} = media_sApi
