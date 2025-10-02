// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const posts_nApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPosts_n: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/generate/posts_n/all/api/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypePosts_n', id: 'LIST' }],
        }),
        getPosts_nSummary: builder.query({
            query: ({ page, limit }) => {
                return `/generate/posts_n/all/api/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypePosts_n', id: 'LIST' }],
        }),
        getPosts_nById: builder.query({
            query: (id) => `/generate/posts_n/all/api/v1?id=${id}`,
        }),
        addPosts_n: builder.mutation({
            query: (newPost_n) => ({
                url: '/generate/posts_n/all/api/v1',
                method: 'POST',
                body: newPost_n,
            }),
            invalidatesTags: [{ type: 'tagTypePosts_n' }],
        }),
        updatePosts_n: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/generate/posts_n/all/api/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypePosts_n' }],
        }),
        deletePosts_n: builder.mutation({
            query: ({ id }) => ({
                url: `/generate/posts_n/all/api/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypePosts_n' }],
        }),
        bulkUpdatePosts_n: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/posts_n/all/api/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypePosts_n' }],
        }),
        bulkDeletePosts_n: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/posts_n/all/api/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypePosts_n' }],
        }),
    }),
})

export const {
    useGetPosts_nQuery,
    useGetPosts_nSummaryQuery,
    useAddPosts_nMutation,
    useUpdatePosts_nMutation,
    useDeletePosts_nMutation,
    useBulkUpdatePosts_nMutation,
    useBulkDeletePosts_nMutation,
    useGetPosts_nByIdQuery,
} = posts_nApi
