import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { getSidebars, createSidebar, updateSidebar, deleteSidebar, getSidebarById, bulkUpdateSidebars, bulkDeleteSidebars } from './controller';

import { formatResponse, IResponse } from '@/app/api/utils/jwt-verify';
import { isUserHasAccessByRole, IWantAccess } from '../../utils/is-user-has-access-by-role';

export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const wantToAccess: IWantAccess = {
    db_name: 'sidebar',
    access: 'read',
  };
  const isAccess = await isUserHasAccessByRole(wantToAccess);
  if (isAccess) return isAccess;

  const id = new URL(req.url).searchParams.get('id');
  const result: IResponse = id ? await getSidebarById(req) : await getSidebars(req);
  return formatResponse(result.data, result.message, result.status);
}

export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const wantToAccess: IWantAccess = {
    db_name: 'sidebar',
    access: 'create',
  };
  const isAccess = await isUserHasAccessByRole(wantToAccess);
  if (isAccess) return isAccess;

  const result = await createSidebar(req);
  return formatResponse(result.data, result.message, result.status);
}

export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);

  if (rateLimitResponse) return rateLimitResponse;
  const wantToAccess: IWantAccess = {
    db_name: 'sidebar',
    access: 'update',
  };
  const isAccess = await isUserHasAccessByRole(wantToAccess);
  if (isAccess) return isAccess;

  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkUpdateSidebars(req) : await updateSidebar(req);

  return formatResponse(result.data, result.message, result.status);
}

export async function DELETE(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const wantToAccess: IWantAccess = {
    db_name: 'sidebar',
    access: 'delete',
  };
  const isAccess = await isUserHasAccessByRole(wantToAccess);
  if (isAccess) return isAccess;

  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkDeleteSidebars(req) : await deleteSidebar(req);

  return formatResponse(result.data, result.message, result.status);
}
