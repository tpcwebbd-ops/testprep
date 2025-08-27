'use client'; // This directive makes the component a Client Component

import LoadingComponent from '@/components/common/Loading';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { useEffect } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useGetUsers_accessQuery } from '../access-management/all/redux/rtk-Api';

export default function AuthCheckingComponent({ redirectUrl = '/' as string, children = null as React.ReactNode | null }) {
  const sessionData = useSession();
  const { status } = sessionData || {};

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
  if (status === 'authenticated' && children) {
    if (isLoading) {
      return <LoadingSkeleton />;
    }

    if (isSuccess) {
      const isBlock = getResponseData?.data?.users_access[0]?.role === 'blocked';
      console.log('is block : ', isBlock);

      if (isBlock) {
        router.replace('/blocked');
      } else {
        return children;
      }
    }
    return <LoadingComponent />;
  }

  return <LoadingComponent />;
}
