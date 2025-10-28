// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const attendance_sApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAttendance_s: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/generate/attendance_s/all/api/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeAttendance_s', id: 'LIST' }],
        }),
        getAttendance_sSummary: builder.query({
            query: ({ page, limit }) => {
                return `/generate/attendance_s/all/api/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypeAttendance_s', id: 'LIST' }],
        }),
        getAttendance_sById: builder.query({
            query: (id) => `/generate/attendance_s/all/api/v1?id=${id}`,
        }),
        addAttendance_s: builder.mutation({
            query: (newAttendance) => ({
                url: '/generate/attendance_s/all/api/v1',
                method: 'POST',
                body: newAttendance,
            }),
            invalidatesTags: [{ type: 'tagTypeAttendance_s' }],
        }),
        updateAttendance_s: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/generate/attendance_s/all/api/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeAttendance_s' }],
        }),
        deleteAttendance_s: builder.mutation({
            query: ({ id }) => ({
                url: `/generate/attendance_s/all/api/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeAttendance_s' }],
        }),
        bulkUpdateAttendance_s: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/attendance_s/all/api/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeAttendance_s' }],
        }),
        bulkDeleteAttendance_s: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/attendance_s/all/api/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeAttendance_s' }],
        }),
    }),
})

export const {
    useGetAttendance_sQuery,
    useGetAttendance_sSummaryQuery,
    useAddAttendance_sMutation,
    useUpdateAttendance_sMutation,
    useDeleteAttendance_sMutation,
    useBulkUpdateAttendance_sMutation,
    useBulkDeleteAttendance_sMutation,
    useGetAttendance_sByIdQuery,
} = attendance_sApi
