// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const rolesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getRoles: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/generate/roles/all/api/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeRoles', id: 'LIST' }],
        }),
        getRolesSummary: builder.query({
            query: ({ page, limit }) => {
                return `/generate/roles/all/api/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypeRoles', id: 'LIST' }],
        }),
        getRolesById: builder.query({
            query: (id) => `/generate/roles/all/api/v1?id=${id}`,
        }),
        addRoles: builder.mutation({
            query: (newRole) => ({
                url: '/generate/roles/all/api/v1',
                method: 'POST',
                body: newRole,
            }),
            invalidatesTags: [{ type: 'tagTypeRoles' }],
        }),
        updateRoles: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/generate/roles/all/api/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeRoles' }],
        }),
        deleteRoles: builder.mutation({
            query: ({ id }) => ({
                url: `/generate/roles/all/api/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeRoles' }],
        }),
        bulkUpdateRoles: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/roles/all/api/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeRoles' }],
        }),
        bulkDeleteRoles: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/roles/all/api/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeRoles' }],
        }),
    }),
})

export const {
    useGetRolesQuery,
    useGetRolesSummaryQuery,
    useAddRolesMutation,
    useUpdateRolesMutation,
    useDeleteRolesMutation,
    useBulkUpdateRolesMutation,
    useBulkDeleteRolesMutation,
    useGetRolesByIdQuery,
} = rolesApi
