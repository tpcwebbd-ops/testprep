// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const content_ResourcesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getContent_Resources: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/generate/content_Resources/all/api/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeContent_Resources', id: 'LIST' }],
        }),
        getContent_ResourcesSummary: builder.query({
            query: ({ page, limit }) => {
                return `/generate/content_Resources/all/api/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypeContent_Resources', id: 'LIST' }],
        }),
        getContent_ResourcesById: builder.query({
            query: (id) => `/generate/content_Resources/all/api/v1?id=${id}`,
        }),
        addContent_Resources: builder.mutation({
            query: (newContent_Resourc) => ({
                url: '/generate/content_Resources/all/api/v1',
                method: 'POST',
                body: newContent_Resourc,
            }),
            invalidatesTags: [{ type: 'tagTypeContent_Resources' }],
        }),
        updateContent_Resources: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/generate/content_Resources/all/api/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeContent_Resources' }],
        }),
        deleteContent_Resources: builder.mutation({
            query: ({ id }) => ({
                url: `/generate/content_Resources/all/api/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeContent_Resources' }],
        }),
        bulkUpdateContent_Resources: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/content_Resources/all/api/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeContent_Resources' }],
        }),
        bulkDeleteContent_Resources: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/content_Resources/all/api/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeContent_Resources' }],
        }),
    }),
})

export const {
    useGetContent_ResourcesQuery,
    useGetContent_ResourcesSummaryQuery,
    useAddContent_ResourcesMutation,
    useUpdateContent_ResourcesMutation,
    useDeleteContent_ResourcesMutation,
    useBulkUpdateContent_ResourcesMutation,
    useBulkDeleteContent_ResourcesMutation,
    useGetContent_ResourcesByIdQuery,
} = content_ResourcesApi
