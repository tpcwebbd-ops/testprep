// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const company_GoalsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCompany_Goals: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/generate/company_Goals/all/api/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeCompany_Goals', id: 'LIST' }],
        }),
        getCompany_GoalsSummary: builder.query({
            query: ({ page, limit }) => {
                return `/generate/company_Goals/all/api/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypeCompany_Goals', id: 'LIST' }],
        }),
        getCompany_GoalsById: builder.query({
            query: (id) => `/generate/company_Goals/all/api/v1?id=${id}`,
        }),
        addCompany_Goals: builder.mutation({
            query: (newCompany_Goal) => ({
                url: '/generate/company_Goals/all/api/v1',
                method: 'POST',
                body: newCompany_Goal,
            }),
            invalidatesTags: [{ type: 'tagTypeCompany_Goals' }],
        }),
        updateCompany_Goals: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/generate/company_Goals/all/api/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeCompany_Goals' }],
        }),
        deleteCompany_Goals: builder.mutation({
            query: ({ id }) => ({
                url: `/generate/company_Goals/all/api/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeCompany_Goals' }],
        }),
        bulkUpdateCompany_Goals: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/company_Goals/all/api/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeCompany_Goals' }],
        }),
        bulkDeleteCompany_Goals: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/company_Goals/all/api/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeCompany_Goals' }],
        }),
    }),
})

export const {
    useGetCompany_GoalsQuery,
    useGetCompany_GoalsSummaryQuery,
    useAddCompany_GoalsMutation,
    useUpdateCompany_GoalsMutation,
    useDeleteCompany_GoalsMutation,
    useBulkUpdateCompany_GoalsMutation,
    useBulkDeleteCompany_GoalsMutation,
    useGetCompany_GoalsByIdQuery,
} = company_GoalsApi
