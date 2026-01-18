import { NextResponse } from 'next/server';
import { getMedia, createMedia, updateMedia, deleteMedia, getMediaById } from './controller';
import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { isUserHasAccessByRole, IWantAccess } from '../../utils/is-user-has-access-by-role';

export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const wantToAccess: IWantAccess = {
  //   db_name: 'media',
  //   access: 'read',
  // };
  // const isAccess = await isUserHasAccessByRole(wantToAccess);
  // if (isAccess) return isAccess;

  const id = new URL(req.url).searchParams.get('id');
  const result = id ? await getMediaById(req) : await getMedia(req);

  return NextResponse.json(result.data, { status: result.status, statusText: result.message });
}

export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const wantToAccess: IWantAccess = {
  //   db_name: 'media',
  //   access: 'create',
  // };
  // const isAccess = await isUserHasAccessByRole(wantToAccess);
  // if (isAccess) return isAccess;

  const result = await createMedia(req);
  return NextResponse.json(result.data, { status: result.status, statusText: result.message });
}

export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const wantToAccess: IWantAccess = {
  //   db_name: 'media',
  //   access: 'update',
  // };
  // const isAccess = await isUserHasAccessByRole(wantToAccess);
  // if (isAccess) return isAccess;

  const result = await updateMedia(req);
  return NextResponse.json(result.data, { status: result.status, statusText: result.message });
}

export async function DELETE(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const wantToAccess: IWantAccess = {
  //   db_name: 'media',
  //   access: 'delete',
  // };
  // const isAccess = await isUserHasAccessByRole(wantToAccess);
  // if (isAccess) return isAccess;

  const result = await deleteMedia(req);
  return NextResponse.json(result.data, { status: result.status, statusText: result.message });
}
