'use client'; // This directive makes the component a Client Component

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { useEffect } from 'react';

const NotAuthorized = () => {
  return <div className="flex items-center justify-center h-[40vh]">You are not authorized to view this page.</div>;
};

export default function AuthCheckingComponent({ redirectUrl = '/' as string, children = null as React.ReactNode | null }) {
  const sessionData = useSession();
  const { status } = sessionData || {};

  const router = useRouter();

  const data = {
    name: sessionData.data?.user.name,
    email: sessionData.data?.user.email,
  };
  if (data.email) {
    console.log('session auth : ', data);
  }

  useEffect(() => {
    if (status === 'loading') {
      return;
    }
    if (status === 'unauthenticated') {
      router.replace('/login?callbackUrl=' + redirectUrl);
    }
  }, [status, router, redirectUrl]);

  if (status === 'loading') {
    return <p>Loading session...</p>;
  }
  if (status === 'authenticated' && children) {
    return children;
  }

  return null;
}
