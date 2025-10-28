// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const postsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPosts: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/api/posts/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypePosts', id: 'LIST' }],
        }),
        getPostsSummary: builder.query({
            query: ({ page, limit }) => {
                return `/api/posts/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypePosts', id: 'LIST' }],
        }),
        getPostsById: builder.query({
            query: (id) => `/api/posts/v1?id=${id}`,
        }),
        addPosts: builder.mutation({
            query: (newPost) => ({
                url: '/api/posts/v1',
                method: 'POST',
                body: newPost,
            }),
            invalidatesTags: [{ type: 'tagTypePosts' }],
        }),
        updatePosts: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/api/posts/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypePosts' }],
        }),
        deletePosts: builder.mutation({
            query: ({ id }) => ({
                url: `/api/posts/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypePosts' }],
        }),
        bulkUpdatePosts: builder.mutation({
            query: (bulkData) => ({
                url: `/api/posts/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypePosts' }],
        }),
        bulkDeletePosts: builder.mutation({
            query: (bulkData) => ({
                url: `/api/posts/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypePosts' }],
        }),
    }),
})

export const {
    useGetPostsQuery,
    useGetPostsSummaryQuery,
    useAddPostsMutation,
    useUpdatePostsMutation,
    useDeletePostsMutation,
    useBulkUpdatePostsMutation,
    useBulkDeletePostsMutation,
    useGetPostsByIdQuery,
} = postsApi
