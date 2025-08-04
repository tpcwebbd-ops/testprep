/*
|-----------------------------------------
| setting up ClientComponent for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: tecmart-template, May, 2025
|-----------------------------------------
*/

'use client';

import { signOut, useSession } from 'next-auth/react';
import UserProfileCard from './UserProfileCard';
import { Button } from '@/components/ui/button';

export type SessionDataType = {
  user: {
    name: string;
    email: string;
    image: string;
  };
  expires: string;
};

const ClientComponent = () => {
  const data = { title: ' Component Title' };
  const { data: sessionData, status } = useSession();
  let renderData = <div>First Render</div>;
  if (status === 'loading') {
    renderData = <p>Loading session...</p>;
  }
  if (status !== 'loading') {
    renderData = <p>Status : {status}</p>;
  }
  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <main className="min-w-[400px] min-h-[200px] flex items-center justify-start flex-col border-1 pb-12">
      <p className="border-b-1 w-full text-center p-2">Client Component</p>
      <div className="w-full flex flex-col gap-4 items-center justify-center">
        <h2>{data.title}</h2>
        <div>{renderData}</div>
        {sessionData?.user?.email && (
          <>
            <UserProfileCard userData={sessionData as SessionDataType} />

            <Button
              onClick={handleLogout}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors min-w-[220px] cursor-pointer"
            >
              Logout
            </Button>
          </>
        )}
      </div>
    </main>
  );
};
export default ClientComponent;
