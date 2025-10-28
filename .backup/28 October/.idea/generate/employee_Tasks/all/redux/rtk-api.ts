// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice'

// Use absolute paths with leading slash to ensure consistent behavior
export const employee_TasksApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getEmployee_Tasks: builder.query({
            query: ({ page, limit, q }) => {
                let url = `/generate/employee_Tasks/all/api/v1?page=${page || 1}&limit=${limit || 10}`
                if (q) {
                    url += `&q=${encodeURIComponent(q)}`
                }
                return url
            },
            providesTags: [{ type: 'tagTypeEmployee_Tasks', id: 'LIST' }],
        }),
        getEmployee_TasksSummary: builder.query({
            query: ({ page, limit }) => {
                return `/generate/employee_Tasks/all/api/v1/summary?page=${page || 1}&limit=${limit || 10}`
            },
            providesTags: [{ type: 'tagTypeEmployee_Tasks', id: 'LIST' }],
        }),
        getEmployee_TasksById: builder.query({
            query: (id) => `/generate/employee_Tasks/all/api/v1?id=${id}`,
        }),
        addEmployee_Tasks: builder.mutation({
            query: (newEmployee_Task) => ({
                url: '/generate/employee_Tasks/all/api/v1',
                method: 'POST',
                body: newEmployee_Task,
            }),
            invalidatesTags: [{ type: 'tagTypeEmployee_Tasks' }],
        }),
        updateEmployee_Tasks: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/generate/employee_Tasks/all/api/v1`,
                method: 'PUT',
                body: { id: id, ...data },
            }),
            invalidatesTags: [{ type: 'tagTypeEmployee_Tasks' }],
        }),
        deleteEmployee_Tasks: builder.mutation({
            query: ({ id }) => ({
                url: `/generate/employee_Tasks/all/api/v1`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [{ type: 'tagTypeEmployee_Tasks' }],
        }),
        bulkUpdateEmployee_Tasks: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/employee_Tasks/all/api/v1?bulk=true`,
                method: 'PUT',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeEmployee_Tasks' }],
        }),
        bulkDeleteEmployee_Tasks: builder.mutation({
            query: (bulkData) => ({
                url: `/generate/employee_Tasks/all/api/v1?bulk=true`,
                method: 'DELETE',
                body: bulkData,
            }),
            invalidatesTags: [{ type: 'tagTypeEmployee_Tasks' }],
        }),
    }),
})

export const {
    useGetEmployee_TasksQuery,
    useGetEmployee_TasksSummaryQuery,
    useAddEmployee_TasksMutation,
    useUpdateEmployee_TasksMutation,
    useDeleteEmployee_TasksMutation,
    useBulkUpdateEmployee_TasksMutation,
    useBulkDeleteEmployee_TasksMutation,
    useGetEmployee_TasksByIdQuery,
} = employee_TasksApi
