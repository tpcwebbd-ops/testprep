/*
|-----------------------------------------
| setting up ApiSlice for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, February, 2024
|-----------------------------------------
*/

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const apiSlice = createApi({
  tagTypes: [
    'Header',
    'tagTypePosts',
    'tagTypeIELTS',
    'tagTypeSpoken',
    'tagTypeCourses',
    'tagTypeGAuthUsers',
    'tagTypeUser',
    'tagTypeUsers_access',
    'tagTypeUsers_admin_access',
    'tagTypeUsers_mentor_access',
    'tagTypeUsers_student_access',
    'tagTypeUsers_instructor_access',
    'tagTypeUsers_block_users_access',
    'tagTypeFinance',
    'tagTypeRoles',
    'tagTypeAccessManagements',
    'tagTypeAccounts',
    'tagTypeVerifications',
    'tagTypeSessions',
    'FooterSettings',
    'tagTypeSidebars',
    'tagTypeProfile',
    'tagTypePageBuilder',
    'tagTypeFormActions',
    'Footer',
    'tagTypeFormSubmission',
    'tagTypeCourse',
    'tagTypeResponseActions',
    'tagTypeDashboardBuilder',
    'tagTypeMedia',
  ],
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NODE_ENV === 'production' ? process.env.baseLiveURL : process.env.baseLocalURL,
    credentials: 'include', // Include credentials for cross-origin requests
    prepareHeaders: async (headers, {}) => {
      const localStorageToken = localStorage.getItem('token')?.replaceAll('"', '');
      const finalToken = localStorageToken;
      if (finalToken) {
        headers.set('authorization', `Bearer ${finalToken}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});
