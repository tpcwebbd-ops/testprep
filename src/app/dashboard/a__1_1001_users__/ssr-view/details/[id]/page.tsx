/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import { notFound } from 'next/navigation';

import HomeButton from './HomeButton';

interface ApiResponse {
  data: { name: string; _id: string };
  message: string;
  status: number;
}

const DataDetails = async ({ data }: { data: { name: string; _id: string } }) => {
  return (
    <div className="w-full flex flex-col md:p-4 p-1 gap-4">
      <div className="w-full hover:bg-slate-400 bg-slate-300 block p-1 border-1 border-slate-400 ">
        Name: {data?.name} <sup className="text-green-500">Done</sup>
      </div>
      <HomeButton />
    </div>
  );
};

const getDataById = async (id: string): Promise<ApiResponse> => {
  const backendUrl = `https://b-varse.vercel.app/dashboard/a__1_1001_users__/all/api/v1?id=${id}`;

  try {
    const res = await fetch(backendUrl, { next: { revalidate: 3600 } }); // 60 minutes (3600 seconds)
    const responseData: ApiResponse = await res.json();
    const data = responseData;
    if (!data) notFound();
    return data;
  } catch (error) {
    console.error('Failed to fetch Data:', error);
    return {
      data: { name: 'User_3_000___', _id: '' },
      message: 'User_3_000___ fetched successfully',
      status: 200,
    };
  }
};

async function getData(id: string) {
  const data = getDataById(id);
  if (!data) notFound();
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getData(id);

  return {
    name: data?.data?.name,
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getData(id);
  return (
    <div className="py-12 flex flex-col w-full">
      <DataDetails data={data.data as { name: string; _id: string }} />
    </div>
  );
}
