// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const paymentsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPayments: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/generate/payments/all/api/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypePayments', id: 'LIST' }],
        }),
        getPaymentsSummary: builder.query({
            query: ({ page, limit }) => {
                return `/generate/payments/all/api/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypePayments', id: 'LIST' }],
        }),
        getPaymentsById: builder.query({
            query: (id) => `/generate/payments/all/api/v1?id=${id}`,
        }),
        addPayments: builder.mutation({
            query: (newPayment) => ({
                url: '/generate/payments/all/api/v1',
                method: 'POST',
                body: newPayment,
            }),
            invalidatesTags: [{ type: 'tagTypePayments' }],
        }),
        updatePayments: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/generate/payments/all/api/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypePayments' }],
        }),
        deletePayments: builder.mutation({
            query: ({ id }) => ({
                url: `/generate/payments/all/api/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypePayments' }],
        }),
        bulkUpdatePayments: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/payments/all/api/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypePayments' }],
        }),
        bulkDeletePayments: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/payments/all/api/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypePayments' }],
        }),
    }),
})

export const {
    useGetPaymentsQuery,
    useGetPaymentsSummaryQuery,
    useAddPaymentsMutation,
    useUpdatePaymentsMutation,
    useDeletePaymentsMutation,
    useBulkUpdatePaymentsMutation,
    useBulkDeletePaymentsMutation,
    useGetPaymentsByIdQuery,
} = paymentsApi
