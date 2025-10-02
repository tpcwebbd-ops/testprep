// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const marketing_LeadsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMarketing_Leads: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/generate/marketing_Leads/all/api/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeMarketing_Leads', id: 'LIST' }],
        }),
        getMarketing_LeadsSummary: builder.query({
            query: ({ page, limit }) => {
                return `/generate/marketing_Leads/all/api/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypeMarketing_Leads', id: 'LIST' }],
        }),
        getMarketing_LeadsById: builder.query({
            query: (id) => `/generate/marketing_Leads/all/api/v1?id=${id}`,
        }),
        addMarketing_Leads: builder.mutation({
            query: (newMarketing_Lead) => ({
                url: '/generate/marketing_Leads/all/api/v1',
                method: 'POST',
                body: newMarketing_Lead,
            }),
            invalidatesTags: [{ type: 'tagTypeMarketing_Leads' }],
        }),
        updateMarketing_Leads: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/generate/marketing_Leads/all/api/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeMarketing_Leads' }],
        }),
        deleteMarketing_Leads: builder.mutation({
            query: ({ id }) => ({
                url: `/generate/marketing_Leads/all/api/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeMarketing_Leads' }],
        }),
        bulkUpdateMarketing_Leads: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/marketing_Leads/all/api/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeMarketing_Leads' }],
        }),
        bulkDeleteMarketing_Leads: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/marketing_Leads/all/api/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeMarketing_Leads' }],
        }),
    }),
})

export const {
    useGetMarketing_LeadsQuery,
    useGetMarketing_LeadsSummaryQuery,
    useAddMarketing_LeadsMutation,
    useUpdateMarketing_LeadsMutation,
    useDeleteMarketing_LeadsMutation,
    useBulkUpdateMarketing_LeadsMutation,
    useBulkDeleteMarketing_LeadsMutation,
    useGetMarketing_LeadsByIdQuery,
} = marketing_LeadsApi
