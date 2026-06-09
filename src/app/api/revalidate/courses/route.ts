import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST() {
  revalidatePath('/courses');
  return NextResponse.json({ revalidated: true, path: '/courses' }, { status: 200 });
}
