/*
|-----------------------------------------
| setting up Route for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { revalidatePath } from 'next/cache';

import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { formatResponse, IResponse } from '@/app/api/utils/jwt-verify';
import { isUserHasAccessByRole, IWantAccess } from '@/app/api/utils/is-user-has-access-by-role';

import { getEnrollments, createEnrollment, updateEnrollment, deleteEnrollment, getEnrollmentById } from './controller';

export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'enrollments',
      access: 'read',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const id = new URL(req.url).searchParams.get('id');
  const result: IResponse = id ? await getEnrollmentById(req) : await getEnrollments(req);
  return formatResponse(result.data, result.message, result.status);
}

export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'enrollments',
      access: 'create',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const result = await createEnrollment(req);
  if (result.status === 200 || result.status === 201) {
    revalidatePath('/enrollments');
  }
  return formatResponse(result.data, result.message, result.status);
}

export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'enrollments',
      access: 'update',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const result = await updateEnrollment(req);
  if (result.status === 200) {
    revalidatePath('/enrollments');
  }
  return formatResponse(result.data, result.message, result.status);
}

export async function DELETE(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'enrollments',
      access: 'delete',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const result = await deleteEnrollment(req);
  if (result.status === 200) {
    revalidatePath('/enrollments');
  }
  return formatResponse(result.data, result.message, result.status);
}
