import { NextResponse } from 'next/server';
import { getCourses, createCourse, updateCourse, deleteCourse, getCourseById } from './controller';

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id');
  const result = id ? await getCourseById(req) : await getCourses(req);

  return NextResponse.json(result.data, { status: result.status, statusText: result.message });
}

export async function POST(req: Request) {
  const result = await createCourse(req);
  return NextResponse.json(result.data, { status: result.status, statusText: result.message });
}

export async function PUT(req: Request) {
  const result = await updateCourse(req);
  return NextResponse.json(result.data, { status: result.status, statusText: result.message });
}

export async function DELETE(req: Request) {
  const result = await deleteCourse(req);
  return NextResponse.json(result.data, { status: result.status, statusText: result.message });
}
