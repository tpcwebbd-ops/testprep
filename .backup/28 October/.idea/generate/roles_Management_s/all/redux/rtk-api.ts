// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const roles_Management_sApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getRoles_Management_s: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/generate/roles_Management_s/all/api/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeRoles_Management_s', id: 'LIST' }],
        }),
        getRoles_Management_sSummary: builder.query({
            query: ({ page, limit }) => {
                return `/generate/roles_Management_s/all/api/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypeRoles_Management_s', id: 'LIST' }],
        }),
        getRoles_Management_sById: builder.query({
            query: (id) => `/generate/roles_Management_s/all/api/v1?id=${id}`,
        }),
        addRoles_Management_s: builder.mutation({
            query: (newRoles_Management) => ({
                url: '/generate/roles_Management_s/all/api/v1',
                method: 'POST',
                body: newRoles_Management,
            }),
            invalidatesTags: [{ type: 'tagTypeRoles_Management_s' }],
        }),
        updateRoles_Management_s: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/generate/roles_Management_s/all/api/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeRoles_Management_s' }],
        }),
        deleteRoles_Management_s: builder.mutation({
            query: ({ id }) => ({
                url: `/generate/roles_Management_s/all/api/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeRoles_Management_s' }],
        }),
        bulkUpdateRoles_Management_s: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/roles_Management_s/all/api/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeRoles_Management_s' }],
        }),
        bulkDeleteRoles_Management_s: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/roles_Management_s/all/api/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeRoles_Management_s' }],
        }),
    }),
})

export const {
    useGetRoles_Management_sQuery,
    useGetRoles_Management_sSummaryQuery,
    useAddRoles_Management_sMutation,
    useUpdateRoles_Management_sMutation,
    useDeleteRoles_Management_sMutation,
    useBulkUpdateRoles_Management_sMutation,
    useBulkDeleteRoles_Management_sMutation,
    useGetRoles_Management_sByIdQuery,
} = roles_Management_sApi
