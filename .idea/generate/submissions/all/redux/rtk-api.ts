// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const submissionsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSubmissions: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/generate/submissions/all/api/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeSubmissions', id: 'LIST' }],
        }),
        getSubmissionsSummary: builder.query({
            query: ({ page, limit }) => {
                return `/generate/submissions/all/api/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypeSubmissions', id: 'LIST' }],
        }),
        getSubmissionsById: builder.query({
            query: (id) => `/generate/submissions/all/api/v1?id=${id}`,
        }),
        addSubmissions: builder.mutation({
            query: (newSubmission) => ({
                url: '/generate/submissions/all/api/v1',
                method: 'POST',
                body: newSubmission,
            }),
            invalidatesTags: [{ type: 'tagTypeSubmissions' }],
        }),
        updateSubmissions: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/generate/submissions/all/api/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeSubmissions' }],
        }),
        deleteSubmissions: builder.mutation({
            query: ({ id }) => ({
                url: `/generate/submissions/all/api/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeSubmissions' }],
        }),
        bulkUpdateSubmissions: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/submissions/all/api/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeSubmissions' }],
        }),
        bulkDeleteSubmissions: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/submissions/all/api/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeSubmissions' }],
        }),
    }),
})

export const {
    useGetSubmissionsQuery,
    useGetSubmissionsSummaryQuery,
    useAddSubmissionsMutation,
    useUpdateSubmissionsMutation,
    useDeleteSubmissionsMutation,
    useBulkUpdateSubmissionsMutation,
    useBulkDeleteSubmissionsMutation,
    useGetSubmissionsByIdQuery,
} = submissionsApi
