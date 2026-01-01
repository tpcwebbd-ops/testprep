import { NextResponse } from 'next/server';
import { getMedia, createMedia, updateMedia, deleteMedia, getMediaById } from './controller';

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id');
  const result = id ? await getMediaById(req) : await getMedia(req);

  return NextResponse.json(result.data, { status: result.status, statusText: result.message });
}

export async function POST(req: Request) {
  const result = await createMedia(req);
  return NextResponse.json(result.data, { status: result.status, statusText: result.message });
}

export async function PUT(req: Request) {
  const result = await updateMedia(req);
  return NextResponse.json(result.data, { status: result.status, statusText: result.message });
}

export async function DELETE(req: Request) {
  const result = await deleteMedia(req);
  return NextResponse.json(result.data, { status: result.status, statusText: result.message });
}
