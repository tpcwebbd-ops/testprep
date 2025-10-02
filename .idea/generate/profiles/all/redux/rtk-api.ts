// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const profilesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProfiles: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/generate/profiles/all/api/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeProfiles', id: 'LIST' }],
        }),
        getProfilesSummary: builder.query({
            query: ({ page, limit }) => {
                return `/generate/profiles/all/api/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypeProfiles', id: 'LIST' }],
        }),
        getProfilesById: builder.query({
            query: (id) => `/generate/profiles/all/api/v1?id=${id}`,
        }),
        addProfiles: builder.mutation({
            query: (newProfile) => ({
                url: '/generate/profiles/all/api/v1',
                method: 'POST',
                body: newProfile,
            }),
            invalidatesTags: [{ type: 'tagTypeProfiles' }],
        }),
        updateProfiles: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/generate/profiles/all/api/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeProfiles' }],
        }),
        deleteProfiles: builder.mutation({
            query: ({ id }) => ({
                url: `/generate/profiles/all/api/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeProfiles' }],
        }),
        bulkUpdateProfiles: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/profiles/all/api/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeProfiles' }],
        }),
        bulkDeleteProfiles: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/profiles/all/api/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeProfiles' }],
        }),
    }),
})

export const {
    useGetProfilesQuery,
    useGetProfilesSummaryQuery,
    useAddProfilesMutation,
    useUpdateProfilesMutation,
    useDeleteProfilesMutation,
    useBulkUpdateProfilesMutation,
    useBulkDeleteProfilesMutation,
    useGetProfilesByIdQuery,
} = profilesApi
