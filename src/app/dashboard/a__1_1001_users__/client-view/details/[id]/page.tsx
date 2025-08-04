/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const Page = () => {
  const [data, setData] = useState({ name: '' });
  const pathname = usePathname();
  const id = pathname.split('/')[5];

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const token = process.env.NEXT_PUBLIC_Token;
        if (!token) {
          console.error('Authentication token not found. Unable to fetch data.');
          return;
        }

        const url = `https://b-varse.vercel.app/dashboard/a__1_1001_users__/all/api/v1?id=${id}`;
        if (url) {
          try {
            const response = await fetch(url, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            const responseData = await response.json();
            setData(responseData?.data);
          } catch (error) {
            console.error('Failed to fetch data:', error);
          }
        }
      };
      fetchData();
    }
  }, [id]);
  return (
    <div className="w-full flex flex-col md:p-4 p-1 gap-4">
      <div className="w-full hover:bg-slate-400 bg-slate-300 block p-1 border-1 border-slate-400 ">
        Name: {data.name} <sup className="text-green-500">Done</sup>
      </div>
      <Link href="/dashboard/a__1_1001_users__/all" className="w-full hover:bg-slate-400 bg-slate-300 p-1 border-1 border-slate-400 ">
        Back to Home
      </Link>
    </div>
  );
};
export default Page;
