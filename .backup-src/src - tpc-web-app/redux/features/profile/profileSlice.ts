// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice';

// Use absolute paths with leading slash to ensure consistent behavior
export const profileApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProfileByUserId: builder.query({
      query: userId => `/api/profile?userId=${userId}`,
      providesTags: [{ type: 'tagTypeProfile', id: 'DETAIL' }],
    }),
    getProfileById: builder.query({
      query: id => `/api/profile?id=${id}`,
      providesTags: [{ type: 'tagTypeProfile', id: 'DETAIL' }],
    }),
    createProfile: builder.mutation({
      query: newProfile => ({
        url: '/api/profile',
        method: 'POST',
        body: newProfile,
      }),
      invalidatesTags: [{ type: 'tagTypeProfile' }],
    }),
    updateProfile: builder.mutation({
      query: ({ userId, ...data }) => ({
        url: '/api/profile',
        method: 'PUT',
        body: { userId, ...data },
      }),
      invalidatesTags: [{ type: 'tagTypeProfile' }],
    }),
    deleteProfile: builder.mutation({
      query: ({ userId }) => ({
        url: '/api/profile',
        method: 'DELETE',
        body: { userId },
      }),
      invalidatesTags: [{ type: 'tagTypeProfile' }],
    }),
  }),
});

export const {
  useGetProfileByUserIdQuery,
  useGetProfileByIdQuery,
  useCreateProfileMutation,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
} = profileApi;
