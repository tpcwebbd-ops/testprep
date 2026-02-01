import { apiSlice } from '@/redux/api/apiSlice';

export const dashboardBuilderApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getDashboards: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/api/dashboard-builder/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypeDashboardBuilder', id: 'LIST' }],
    }),
    getDashboardById: builder.query({
      query: id => `/api/dashboard-builder/v1?id=${id}`,
      providesTags: (result, error, id) => [{ type: 'tagTypeDashboardBuilder', id }],
    }),
    addDashboard: builder.mutation({
      query: newDashboard => ({
        url: '/api/dashboard-builder/v1',
        method: 'POST',
        body: newDashboard,
      }),
      invalidatesTags: [{ type: 'tagTypeDashboardBuilder', id: 'LIST' }],
    }),
    updateDashboard: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/dashboard-builder/v1`,
        method: 'PUT',
        body: { id, ...data },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'tagTypeDashboardBuilder', id },
        { type: 'tagTypeDashboardBuilder', id: 'LIST' },
      ],
    }),
    deleteDashboard: builder.mutation({
      query: ({ id }) => ({
        url: `/api/dashboard-builder/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'tagTypeDashboardBuilder', id },
        { type: 'tagTypeDashboardBuilder', id: 'LIST' },
      ],
    }),
  }),
});

export const { useGetDashboardsQuery, useGetDashboardByIdQuery, useAddDashboardMutation, useUpdateDashboardMutation, useDeleteDashboardMutation } =
  dashboardBuilderApi;
