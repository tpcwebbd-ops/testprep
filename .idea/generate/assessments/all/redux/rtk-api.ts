// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const assessmentsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAssessments: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/generate/assessments/all/api/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeAssessments', id: 'LIST' }],
        }),
        getAssessmentsSummary: builder.query({
            query: ({ page, limit }) => {
                return `/generate/assessments/all/api/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypeAssessments', id: 'LIST' }],
        }),
        getAssessmentsById: builder.query({
            query: (id) => `/generate/assessments/all/api/v1?id=${id}`,
        }),
        addAssessments: builder.mutation({
            query: (newAssessment) => ({
                url: '/generate/assessments/all/api/v1',
                method: 'POST',
                body: newAssessment,
            }),
            invalidatesTags: [{ type: 'tagTypeAssessments' }],
        }),
        updateAssessments: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/generate/assessments/all/api/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeAssessments' }],
        }),
        deleteAssessments: builder.mutation({
            query: ({ id }) => ({
                url: `/generate/assessments/all/api/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeAssessments' }],
        }),
        bulkUpdateAssessments: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/assessments/all/api/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeAssessments' }],
        }),
        bulkDeleteAssessments: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/assessments/all/api/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeAssessments' }],
        }),
    }),
})

export const {
    useGetAssessmentsQuery,
    useGetAssessmentsSummaryQuery,
    useAddAssessmentsMutation,
    useUpdateAssessmentsMutation,
    useDeleteAssessmentsMutation,
    useBulkUpdateAssessmentsMutation,
    useBulkDeleteAssessmentsMutation,
    useGetAssessmentsByIdQuery,
} = assessmentsApi
