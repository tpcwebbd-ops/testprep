import { apiSlice } from '@/redux/api/apiSlice'; // Assuming this path is correct for your project
import { NavData, UpdateNavData } from './interface'; // Assuming interface.ts is in the same directory

export const headerApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getHeaderData: builder.query<NavData, void>({
      query: () => `/api/v1/header`, // Assuming your API endpoint for header data
      providesTags: [{ type: 'Header', id: 'SINGLE' }],
    }),
    updateHeaderData: builder.mutation<NavData, UpdateNavData>({
      query: data => ({
        url: `/api/v1/header`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: [{ type: 'Header', id: 'SINGLE' }],
    }),
  }),
});

export const { useGetHeaderDataQuery, useUpdateHeaderDataMutation } = headerApi;
