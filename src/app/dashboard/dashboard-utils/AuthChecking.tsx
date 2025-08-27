'use client'; // This directive makes the component a Client Component

import LoadingComponent from '@/components/common/Loading';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';

import { useEffect } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useGetUsers_accessQuery } from '../access-management/all/redux/rtk-Api';
import { accessPathByUsers } from '../access-management/users-access-role';

export default function AuthCheckingComponent({ redirectUrl = '/' as string, children = null as React.ReactNode | null }) {
  const sessionData = useSession();
  const { status } = sessionData || {};

  const path = usePathname();
  const currentPathName = path.split('/')[2] || path.split('/')[1] || path.split('/')[0] || '';
  console.log('currentPathName : ', currentPathName);
  const router = useRouter();

  const {
    data: getResponseData,
    isSuccess,
    isLoading,
  } = useGetUsers_accessQuery(
    { q: sessionData.data?.user?.email, page: 1, limit: 1 },
    {
      selectFromResult: ({ data, isSuccess, status, error, isLoading }) => ({
        data,
        isSuccess,
        status: 'status' in (error || {}) ? (error as FetchBaseQueryError).status : status, // Extract HTTP status code
        error,
        isLoading,
      }),
    },
  );
  useEffect(() => {
    if (status === 'loading') {
      return;
    }
    if (status === 'unauthenticated') {
      router.replace('/login?callbackUrl=' + redirectUrl);
    }
  }, [status, router, redirectUrl]);

  if (status === 'loading') {
    return <LoadingSkeleton />;
  }
  const isAccessByRole = (currRole: string, currPath: string) => {
    let result = false;
    accessPathByUsers.forEach(item => {
      if (currRole === item.role) {
        const isExist = item.accessPathName.map(c => c.toLowerCase()).includes(currPath?.toLowerCase() || '');
        console.log(' is Exist : ', isExist);
        if (isExist) {
          result = true;
        } else {
          result = false;
        }
      }
    });
    console.log(' currRole : ', currRole);
    console.log(' currPath : ', currPath);
    return result;
  };
  if (status === 'authenticated' && children) {
    // return children;
    if (isLoading) {
      return <LoadingSkeleton />;
    }

    if (isSuccess) {
      const userRole = getResponseData?.data?.users_access[0]?.role;

      if (userRole === 'blocked') {
        router.replace('/blocked');
      } else {
        const accessrole = ['admin', 'moderator', 'instructor', 'mentor', 'user', 'student'];
        if (accessrole.includes(userRole) && isAccessByRole(userRole, currentPathName)) {
          return children;
        } else {
          router.replace('/unauthorized');
        }
      }
    }
    return <LoadingComponent />;
  }

  return <LoadingComponent />;
}
