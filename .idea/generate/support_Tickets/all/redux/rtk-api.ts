// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const support_TicketsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSupport_Tickets: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/generate/support_Tickets/all/api/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeSupport_Tickets', id: 'LIST' }],
        }),
        getSupport_TicketsSummary: builder.query({
            query: ({ page, limit }) => {
                return `/generate/support_Tickets/all/api/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypeSupport_Tickets', id: 'LIST' }],
        }),
        getSupport_TicketsById: builder.query({
            query: (id) => `/generate/support_Tickets/all/api/v1?id=${id}`,
        }),
        addSupport_Tickets: builder.mutation({
            query: (newSupport_Ticket) => ({
                url: '/generate/support_Tickets/all/api/v1',
                method: 'POST',
                body: newSupport_Ticket,
            }),
            invalidatesTags: [{ type: 'tagTypeSupport_Tickets' }],
        }),
        updateSupport_Tickets: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/generate/support_Tickets/all/api/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeSupport_Tickets' }],
        }),
        deleteSupport_Tickets: builder.mutation({
            query: ({ id }) => ({
                url: `/generate/support_Tickets/all/api/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeSupport_Tickets' }],
        }),
        bulkUpdateSupport_Tickets: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/support_Tickets/all/api/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeSupport_Tickets' }],
        }),
        bulkDeleteSupport_Tickets: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/support_Tickets/all/api/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeSupport_Tickets' }],
        }),
    }),
})

export const {
    useGetSupport_TicketsQuery,
    useGetSupport_TicketsSummaryQuery,
    useAddSupport_TicketsMutation,
    useUpdateSupport_TicketsMutation,
    useDeleteSupport_TicketsMutation,
    useBulkUpdateSupport_TicketsMutation,
    useBulkDeleteSupport_TicketsMutation,
    useGetSupport_TicketsByIdQuery,
} = support_TicketsApi
