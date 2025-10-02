// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const enrollmentsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getEnrollments: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/generate/enrollments/all/api/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeEnrollments', id: 'LIST' }],
        }),
        getEnrollmentsSummary: builder.query({
            query: ({ page, limit }) => {
                return `/generate/enrollments/all/api/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypeEnrollments', id: 'LIST' }],
        }),
        getEnrollmentsById: builder.query({
            query: (id) => `/generate/enrollments/all/api/v1?id=${id}`,
        }),
        addEnrollments: builder.mutation({
            query: (newEnrollment) => ({
                url: '/generate/enrollments/all/api/v1',
                method: 'POST',
                body: newEnrollment,
            }),
            invalidatesTags: [{ type: 'tagTypeEnrollments' }],
        }),
        updateEnrollments: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/generate/enrollments/all/api/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeEnrollments' }],
        }),
        deleteEnrollments: builder.mutation({
            query: ({ id }) => ({
                url: `/generate/enrollments/all/api/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeEnrollments' }],
        }),
        bulkUpdateEnrollments: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/enrollments/all/api/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeEnrollments' }],
        }),
        bulkDeleteEnrollments: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/enrollments/all/api/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeEnrollments' }],
        }),
    }),
})

export const {
    useGetEnrollmentsQuery,
    useGetEnrollmentsSummaryQuery,
    useAddEnrollmentsMutation,
    useUpdateEnrollmentsMutation,
    useDeleteEnrollmentsMutation,
    useBulkUpdateEnrollmentsMutation,
    useBulkDeleteEnrollmentsMutation,
    useGetEnrollmentsByIdQuery,
} = enrollmentsApi
