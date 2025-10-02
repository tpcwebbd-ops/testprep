// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const messagesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMessages: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/generate/messages/all/api/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeMessages', id: 'LIST' }],
        }),
        getMessagesSummary: builder.query({
            query: ({ page, limit }) => {
                return `/generate/messages/all/api/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypeMessages', id: 'LIST' }],
        }),
        getMessagesById: builder.query({
            query: (id) => `/generate/messages/all/api/v1?id=${id}`,
        }),
        addMessages: builder.mutation({
            query: (newMessage) => ({
                url: '/generate/messages/all/api/v1',
                method: 'POST',
                body: newMessage,
            }),
            invalidatesTags: [{ type: 'tagTypeMessages' }],
        }),
        updateMessages: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/generate/messages/all/api/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeMessages' }],
        }),
        deleteMessages: builder.mutation({
            query: ({ id }) => ({
                url: `/generate/messages/all/api/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeMessages' }],
        }),
        bulkUpdateMessages: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/messages/all/api/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeMessages' }],
        }),
        bulkDeleteMessages: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/messages/all/api/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeMessages' }],
        }),
    }),
})

export const {
    useGetMessagesQuery,
    useGetMessagesSummaryQuery,
    useAddMessagesMutation,
    useUpdateMessagesMutation,
    useDeleteMessagesMutation,
    useBulkUpdateMessagesMutation,
    useBulkDeleteMessagesMutation,
    useGetMessagesByIdQuery,
} = messagesApi
