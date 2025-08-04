/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

'use client';

import { useEffect, useState } from 'react';

import CustomLInk from './CustomButton';

const Page = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const token = process.env.NEXT_PUBLIC_Token;
      if (!token) {
        console.error('Authentication token not found. Unable to fetch data.');
        return;
      }
      const url = 'https://b-varse.vercel.app/dashboard/a__1_1001_users__/all/api/v1?page=1&limit=4';

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const responseData = await response.json();
        setData(responseData?.data?.users_2_000___);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);
  return (
    <main className="w-full flex flex-col gap-2 p-1 md:p-4">
      {data?.map((i: { name: string; _id: string }, idx: number) => (
        <div key={idx + i?.name}>
          <CustomLInk name={i.name} url={`/dashboard/a__1_1001_users__/client-view/details/${i._id}`} />
        </div>
      ))}
    </main>
  );
};
export default Page;
