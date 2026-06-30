/*
|-----------------------------------------
| setting up Route for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { revalidatePath } from 'next/cache';

import { formatResponse, IResponse } from '@/app/api/utils/jwt-verify';

import { handleRateLimit } from '../../utils/rate-limit';
import {
  getPages,
  createPage,
  updatePage,
  deletePage,
  getPageById,
  getRecords,
  createRecord,
  updateRecord,
  deleteRecord,
  bulkUpdateRecords,
  bulkDeleteRecords,
} from './controller';
import { isUserHasAccessByRole, IWantAccess } from '../../utils/is-user-has-access-by-role';

export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'db builder',
      access: 'read',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const resource = url.searchParams.get('resource');
  const result: IResponse = resource === 'records' ? await getRecords(req) : id ? await getPageById(req) : await getPages(req);

  return formatResponse(result.data, result.message, result.status);
}

export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'db builder',
      access: 'create',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const resource = new URL(req.url).searchParams.get('resource');
  const result = resource === 'records' ? await createRecord(req) : await createPage(req);

  if (result.status === 200 || result.status === 201) {
    revalidatePath('/db builder');
  }

  return formatResponse(result.data, result.message, result.status);
}

export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'db builder',
      access: 'update',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const url = new URL(req.url);
  const resource = url.searchParams.get('resource');
  const isBulk = url.searchParams.get('bulk') === 'true';
  const result = resource === 'records' ? (isBulk ? await bulkUpdateRecords(req) : await updateRecord(req)) : await updatePage(req);

  if (result.status === 200) {
    revalidatePath('/db builder');
  }

  return formatResponse(result.data, result.message, result.status);
}

export async function DELETE(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'db builder',
      access: 'delete',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const url = new URL(req.url);
  const resource = url.searchParams.get('resource');
  const isBulk = url.searchParams.get('bulk') === 'true';
  const result = resource === 'records' ? (isBulk ? await bulkDeleteRecords(req) : await deleteRecord(req)) : await deletePage(req);

  if (result.status === 200) {
    revalidatePath('/db builder');
  }

  return formatResponse(result.data, result.message, result.status);
}
