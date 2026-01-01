import { apiSlice } from '@/redux/api/apiSlice';

export const mediaApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getMedias: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/api/media/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypeMedia', id: 'LIST' }],
    }),
    getMediaById: builder.query({
      query: id => `/api/media/v1?id=${id}`,
      providesTags: (result, error, id) => [{ type: 'tagTypeMedia', id }],
    }),
    addMedia: builder.mutation({
      query: newMedia => ({
        url: '/api/media/v1',
        method: 'POST',
        body: newMedia,
      }),
      invalidatesTags: [{ type: 'tagTypeMedia', id: 'LIST' }],
    }),
    updateMedia: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/media/v1`,
        method: 'PUT',
        body: { id, ...data },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'tagTypeMedia', id },
        { type: 'tagTypeMedia', id: 'LIST' },
      ],
    }),
    deleteMedia: builder.mutation({
      query: ({ id }) => ({
        url: `/api/media/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'tagTypeMedia', id },
        { type: 'tagTypeMedia', id: 'LIST' },
      ],
    }),
  }),
});

export const { useGetMediasQuery, useGetMediaByIdQuery, useAddMediaMutation, useUpdateMediaMutation, useDeleteMediaMutation } = mediaApi;
