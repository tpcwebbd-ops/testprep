// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const newsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getNews: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/api/news/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeNews', id: 'LIST' }],
        }),
        getNewsSummary: builder.query({
            query: ({ page, limit }) => {
                return `/api/news/v1?summary=true&page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypeNews', id: 'LIST' }],
        }),
        getNewsById: builder.query({
            query: (id) => `/api/news/v1?id=${id}`,
        }),
        addNews: builder.mutation({
            query: (newNews) => ({
                url: '/api/news/v1',
                method: 'POST',
                body: newNews,
            }),
            invalidatesTags: [{ type: 'tagTypeNews' }],
        }),
        updateNews: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/api/news/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeNews' }],
        }),
        deleteNews: builder.mutation({
            query: ({ id }) => ({
                url: `/api/news/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeNews' }],
        }),
        bulkUpdateNews: builder.mutation({
            query: (bulkData) => ({
                url: `/api/news/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeNews' }],
        }),
        bulkDeleteNews: builder.mutation({
            query: (bulkData) => ({
                url: `/api/news/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeNews' }],
        }),
    }),
})

export const {
    useGetNewsQuery,
    useGetNewsSummaryQuery,
    useAddNewsMutation,
    useUpdateNewsMutation,
    useDeleteNewsMutation,
    useBulkUpdateNewsMutation,
    useBulkDeleteNewsMutation,
    useGetNewsByIdQuery,
} = newsApi
