// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const rewardsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getRewards: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/generate/rewards/all/api/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeRewards', id: 'LIST' }],
        }),
        getRewardsSummary: builder.query({
            query: ({ page, limit }) => {
                return `/generate/rewards/all/api/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypeRewards', id: 'LIST' }],
        }),
        getRewardsById: builder.query({
            query: (id) => `/generate/rewards/all/api/v1?id=${id}`,
        }),
        addRewards: builder.mutation({
            query: (newReward) => ({
                url: '/generate/rewards/all/api/v1',
                method: 'POST',
                body: newReward,
            }),
            invalidatesTags: [{ type: 'tagTypeRewards' }],
        }),
        updateRewards: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/generate/rewards/all/api/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeRewards' }],
        }),
        deleteRewards: builder.mutation({
            query: ({ id }) => ({
                url: `/generate/rewards/all/api/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeRewards' }],
        }),
        bulkUpdateRewards: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/rewards/all/api/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeRewards' }],
        }),
        bulkDeleteRewards: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/rewards/all/api/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeRewards' }],
        }),
    }),
})

export const {
    useGetRewardsQuery,
    useGetRewardsSummaryQuery,
    useAddRewardsMutation,
    useUpdateRewardsMutation,
    useDeleteRewardsMutation,
    useBulkUpdateRewardsMutation,
    useBulkDeleteRewardsMutation,
    useGetRewardsByIdQuery,
} = rewardsApi
