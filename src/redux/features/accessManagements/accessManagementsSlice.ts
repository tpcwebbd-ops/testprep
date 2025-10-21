// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const accessManagementsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAccessManagements: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/api/accessManagements/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeAccessManagements', id: 'LIST' }],
        }),
        getAccessManagementsSummary: builder.query({
            query: ({ page, limit }) => {
                return `/api/accessManagements/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypeAccessManagements', id: 'LIST' }],
        }),
        getAccessManagementsById: builder.query({
            query: (id) => `/api/accessManagements/v1?id=${id}`,
        }),
        addAccessManagements: builder.mutation({
            query: (newAccessManagement) => ({
                url: '/api/accessManagements/v1',
                method: 'POST',
                body: newAccessManagement,
            }),
            invalidatesTags: [{ type: 'tagTypeAccessManagements' }],
        }),
        updateAccessManagements: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/api/accessManagements/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeAccessManagements' }],
        }),
        deleteAccessManagements: builder.mutation({
            query: ({ id }) => ({
                url: `/api/accessManagements/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeAccessManagements' }],
        }),
        bulkUpdateAccessManagements: builder.mutation({
            query: (bulkData) => ({
                url: `/api/accessManagements/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeAccessManagements' }],
        }),
        bulkDeleteAccessManagements: builder.mutation({
            query: (bulkData) => ({
                url: `/api/accessManagements/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeAccessManagements' }],
        }),
    }),
})

export const {
    useGetAccessManagementsQuery,
    useGetAccessManagementsSummaryQuery,
    useAddAccessManagementsMutation,
    useUpdateAccessManagementsMutation,
    useDeleteAccessManagementsMutation,
    useBulkUpdateAccessManagementsMutation,
    useBulkDeleteAccessManagementsMutation,
    useGetAccessManagementsByIdQuery,
} = accessManagementsApi
