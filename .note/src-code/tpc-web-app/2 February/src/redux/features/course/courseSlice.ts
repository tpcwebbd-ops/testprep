import { apiSlice } from '@/redux/api/apiSlice';

export const courseBuilderApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCourses: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/api/course/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypeCourse', id: 'LIST' }],
    }),
    getCourseById: builder.query({
      query: id => `/api/course/v1?id=${id}`,
      providesTags: (result, error, id) => [{ type: 'tagTypeCourse', id }],
    }),
    addCourse: builder.mutation({
      query: newCourse => ({
        url: '/api/course/v1',
        method: 'POST',
        body: newCourse,
      }),
      invalidatesTags: [{ type: 'tagTypeCourse', id: 'LIST' }],
    }),
    updateCourse: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/course/v1`,
        method: 'PUT',
        body: { id, ...data },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'tagTypeCourse', id },
        { type: 'tagTypeCourse', id: 'LIST' },
      ],
    }),
    deleteCourse: builder.mutation({
      query: ({ id }) => ({
        url: `/api/course/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'tagTypeCourse', id },
        { type: 'tagTypeCourse', id: 'LIST' },
      ],
    }),
  }),
});

export const { useGetCoursesQuery, useGetCourseByIdQuery, useAddCourseMutation, useUpdateCourseMutation, useDeleteCourseMutation } = courseBuilderApi;
