// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const lecturesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getLectures: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/generate/lectures/all/api/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeLectures', id: 'LIST' }],
        }),
        getLecturesSummary: builder.query({
            query: ({ page, limit }) => {
                return `/generate/lectures/all/api/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypeLectures', id: 'LIST' }],
        }),
        getLecturesById: builder.query({
            query: (id) => `/generate/lectures/all/api/v1?id=${id}`,
        }),
        addLectures: builder.mutation({
            query: (newLecture) => ({
                url: '/generate/lectures/all/api/v1',
                method: 'POST',
                body: newLecture,
            }),
            invalidatesTags: [{ type: 'tagTypeLectures' }],
        }),
        updateLectures: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/generate/lectures/all/api/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeLectures' }],
        }),
        deleteLectures: builder.mutation({
            query: ({ id }) => ({
                url: `/generate/lectures/all/api/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeLectures' }],
        }),
        bulkUpdateLectures: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/lectures/all/api/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeLectures' }],
        }),
        bulkDeleteLectures: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/lectures/all/api/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeLectures' }],
        }),
    }),
})

export const {
    useGetLecturesQuery,
    useGetLecturesSummaryQuery,
    useAddLecturesMutation,
    useUpdateLecturesMutation,
    useDeleteLecturesMutation,
    useBulkUpdateLecturesMutation,
    useBulkDeleteLecturesMutation,
    useGetLecturesByIdQuery,
} = lecturesApi
