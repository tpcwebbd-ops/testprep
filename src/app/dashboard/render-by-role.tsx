/*
|-----------------------------------------
| setting up RenderByRole for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, August, 2025
|-----------------------------------------
*/

'use client'; // This directive makes the component a Client Component

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const RenderByRole = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const sessionData = useSession();

  const router = useRouter();

  console.log('session Data : ', sessionData);

  const data = {
    name: sessionData.data?.user.name,
    email: sessionData.data?.user.email,
  };
  return <main>{children}</main>;
};
export default RenderByRole;
