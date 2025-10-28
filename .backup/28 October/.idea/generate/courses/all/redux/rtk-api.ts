// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const coursesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCourses: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/generate/courses/all/api/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeCourses', id: 'LIST' }],
        }),
        getCoursesSummary: builder.query({
            query: ({ page, limit }) => {
                return `/generate/courses/all/api/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypeCourses', id: 'LIST' }],
        }),
        getCoursesById: builder.query({
            query: (id) => `/generate/courses/all/api/v1?id=${id}`,
        }),
        addCourses: builder.mutation({
            query: (newCourse) => ({
                url: '/generate/courses/all/api/v1',
                method: 'POST',
                body: newCourse,
            }),
            invalidatesTags: [{ type: 'tagTypeCourses' }],
        }),
        updateCourses: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/generate/courses/all/api/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeCourses' }],
        }),
        deleteCourses: builder.mutation({
            query: ({ id }) => ({
                url: `/generate/courses/all/api/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeCourses' }],
        }),
        bulkUpdateCourses: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/courses/all/api/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeCourses' }],
        }),
        bulkDeleteCourses: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/courses/all/api/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeCourses' }],
        }),
    }),
})

export const {
    useGetCoursesQuery,
    useGetCoursesSummaryQuery,
    useAddCoursesMutation,
    useUpdateCoursesMutation,
    useDeleteCoursesMutation,
    useBulkUpdateCoursesMutation,
    useBulkDeleteCoursesMutation,
    useGetCoursesByIdQuery,
} = coursesApi
