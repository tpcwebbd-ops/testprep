/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, August, 2025
|-----------------------------------------
*/

import { notFound } from 'next/navigation';

interface ApiResponse {
  data: { name: string; _id: string };
  message: string;
  status: number;
}

const DataDetails = async ({ data }: { data: { name: string; _id: string } }) => {
  console.log('data ', data);
  return (
    <div className="w-full flex flex-col md:p-4 p-1 gap-4">
      <div className="w-full hover:bg-slate-400 bg-slate-300 block p-1 border-1 border-slate-400 ">
        Name: {data?.name} <sup className="text-green-500">Done</sup>
      </div>
    </div>
  );
};

const getDataByTitle = async (title: string): Promise<ApiResponse> => {
  console.log('title : ', title);
  const updateTitle = title.replaceAll('-', ' ');
  const backendUrl = `http://localhost:3000/dashboard/course/all/api/by-course-name?coursename=${updateTitle}`;
  //dashboard/course/all/api/by-course-name?coursename=IELTS  301
  try {
    const res = await fetch(backendUrl, { next: { revalidate: 3600 } }); // 60 minutes (3600 seconds)
    const responseData: ApiResponse = await res.json();
    const data = responseData;
    if (!data) notFound();
    return data;
  } catch (error) {
    console.error('Failed to fetch Data:', error);
    return {
      data: { name: 'course', _id: '' },
      message: 'course not found',
      status: 405,
    };
  }
};

async function getData(title: string) {
  const data = getDataByTitle(title);
  if (!data) notFound();
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ title: string }> }) {
  const { title } = await params;
  const data = await getData(title);

  return {
    name: data?.data?.name,
  };
}

export default async function Page({ params }: { params: Promise<{ title: string }> }) {
  const { title } = await params;
  const data = await getData(title);
  return (
    <div className="py-12 flex flex-col w-full">
      <DataDetails data={data.data as { name: string; _id: string }} />
    </div>
  );
}
