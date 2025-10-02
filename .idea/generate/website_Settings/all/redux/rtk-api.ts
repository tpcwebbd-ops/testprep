// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const website_SettingsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getWebsite_Settings: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/generate/website_Settings/all/api/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeWebsite_Settings', id: 'LIST' }],
        }),
        getWebsite_SettingsSummary: builder.query({
            query: ({ page, limit }) => {
                return `/generate/website_Settings/all/api/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypeWebsite_Settings', id: 'LIST' }],
        }),
        getWebsite_SettingsById: builder.query({
            query: (id) => `/generate/website_Settings/all/api/v1?id=${id}`,
        }),
        addWebsite_Settings: builder.mutation({
            query: (newWebsite_Setting) => ({
                url: '/generate/website_Settings/all/api/v1',
                method: 'POST',
                body: newWebsite_Setting,
            }),
            invalidatesTags: [{ type: 'tagTypeWebsite_Settings' }],
        }),
        updateWebsite_Settings: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/generate/website_Settings/all/api/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeWebsite_Settings' }],
        }),
        deleteWebsite_Settings: builder.mutation({
            query: ({ id }) => ({
                url: `/generate/website_Settings/all/api/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeWebsite_Settings' }],
        }),
        bulkUpdateWebsite_Settings: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/website_Settings/all/api/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeWebsite_Settings' }],
        }),
        bulkDeleteWebsite_Settings: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/website_Settings/all/api/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeWebsite_Settings' }],
        }),
    }),
})

export const {
    useGetWebsite_SettingsQuery,
    useGetWebsite_SettingsSummaryQuery,
    useAddWebsite_SettingsMutation,
    useUpdateWebsite_SettingsMutation,
    useDeleteWebsite_SettingsMutation,
    useBulkUpdateWebsite_SettingsMutation,
    useBulkDeleteWebsite_SettingsMutation,
    useGetWebsite_SettingsByIdQuery,
} = website_SettingsApi
