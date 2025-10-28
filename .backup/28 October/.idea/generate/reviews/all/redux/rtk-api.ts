// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const reviewsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getReviews: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/generate/reviews/all/api/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeReviews', id: 'LIST' }],
        }),
        getReviewsSummary: builder.query({
            query: ({ page, limit }) => {
                return `/generate/reviews/all/api/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypeReviews', id: 'LIST' }],
        }),
        getReviewsById: builder.query({
            query: (id) => `/generate/reviews/all/api/v1?id=${id}`,
        }),
        addReviews: builder.mutation({
            query: (newReview) => ({
                url: '/generate/reviews/all/api/v1',
                method: 'POST',
                body: newReview,
            }),
            invalidatesTags: [{ type: 'tagTypeReviews' }],
        }),
        updateReviews: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/generate/reviews/all/api/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeReviews' }],
        }),
        deleteReviews: builder.mutation({
            query: ({ id }) => ({
                url: `/generate/reviews/all/api/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeReviews' }],
        }),
        bulkUpdateReviews: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/reviews/all/api/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeReviews' }],
        }),
        bulkDeleteReviews: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/reviews/all/api/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeReviews' }],
        }),
    }),
})

export const {
    useGetReviewsQuery,
    useGetReviewsSummaryQuery,
    useAddReviewsMutation,
    useUpdateReviewsMutation,
    useDeleteReviewsMutation,
    useBulkUpdateReviewsMutation,
    useBulkDeleteReviewsMutation,
    useGetReviewsByIdQuery,
} = reviewsApi
