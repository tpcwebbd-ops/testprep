// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const usersApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/generate/users/all/api/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeUsers', id: 'LIST' }],
        }),
        getUsersSummary: builder.query({
            query: ({ page, limit }) => {
                return `/generate/users/all/api/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypeUsers', id: 'LIST' }],
        }),
        getUsersById: builder.query({
            query: (id) => `/generate/users/all/api/v1?id=${id}`,
        }),
        addUsers: builder.mutation({
            query: (newUser) => ({
                url: '/generate/users/all/api/v1',
                method: 'POST',
                body: newUser,
            }),
            invalidatesTags: [{ type: 'tagTypeUsers' }],
        }),
        updateUsers: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/generate/users/all/api/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeUsers' }],
        }),
        deleteUsers: builder.mutation({
            query: ({ id }) => ({
                url: `/generate/users/all/api/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeUsers' }],
        }),
        bulkUpdateUsers: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/users/all/api/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeUsers' }],
        }),
        bulkDeleteUsers: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/users/all/api/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeUsers' }],
        }),
    }),
})

export const {
    useGetUsersQuery,
    useGetUsersSummaryQuery,
    useAddUsersMutation,
    useUpdateUsersMutation,
    useDeleteUsersMutation,
    useBulkUpdateUsersMutation,
    useBulkDeleteUsersMutation,
    useGetUsersByIdQuery,
} = usersApi
