/*
|-----------------------------------------
| setting up ServerComponent for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: tecmart-template, May, 2025
|-----------------------------------------
*/

import { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import UserProfileCard from './UserProfileCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export type SessionDataType = {
  user: {
    name: string;
    email: string;
    image: string;
  };
  expires: string;
};

const ServerComponent = async () => {
  const data = { title: 'Component Title' };

  // Fetch session on the server
  const authOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ],
  };

  const sessionData = await getServerSession(authOptions);

  // No need for loading state in server components
  const renderData = <p>Status: {sessionData ? 'authenticated' : 'unauthenticated'}</p>;

  return (
    <main className="min-w-[400px] min-h-[200px] flex items-center justify-start flex-col border-1 pb-12">
      <p className="border-b-1 w-full text-center p-2">Server Component</p>
      <div className="w-full flex flex-col gap-4 items-center justify-center">
        <h2>{data.title}</h2>
        <div>{renderData}</div>
        {sessionData?.user?.email && (
          <>
            <UserProfileCard userData={sessionData as SessionDataType} />

            {/* Links are used instead of client-side handlers in server components */}
            <Link href="/api/auth/signout">
              <Button className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors min-w-[220px] cursor-pointer">Logout</Button>
            </Link>
          </>
        )}
      </div>
    </main>
  );
};

export default ServerComponent;
