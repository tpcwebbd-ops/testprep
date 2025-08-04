/*
|-----------------------------------------
| setting up LogInDashboardButton for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: tecmart-template, May, 2025
|-----------------------------------------
*/

'use client';

import { Button } from '@/components/ui/button';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { IoIosLogOut } from 'react-icons/io';

const LogInDashboardButton = () => {
  const { data: sessionData } = useSession();
  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };
  return (
    <main>
      {sessionData?.user?.email ? (
        <div className="flex items-center justify-center gap-8">
          <Link href="/dashboard">Dashboard</Link>
          <Button onClick={handleLogout} className="cursor-pointer hover:bg-transparent hover:text-red-500" variant="outline" size="sm">
            Logout
            <IoIosLogOut />
          </Button>
        </div>
      ) : (
        <Link href="/login" className="flex items-center justify-center gap-8">
          Login
        </Link>
      )}
    </main>
  );
};
export default LogInDashboardButton;
