import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { getRoles, createRole, updateRole, deleteRole, getRoleById, bulkUpdateRoles, bulkDeleteRoles } from './controller';

import { formatResponse, IResponse } from '@/app/api/utils/jwt-verify';
import { isUserHasAccessByRole, IWantAccess } from '@/app/api/utils/is-user-has-access-by-role';

// GET all Roles
export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const wantToAccess: IWantAccess = {
    db_name: 'role',
    access: 'read',
  };
  const isAccess = await isUserHasAccessByRole(wantToAccess);
  if (isAccess) return isAccess;

  const id = new URL(req.url).searchParams.get('id');
  const result: IResponse = id ? await getRoleById(req) : await getRoles(req);
  return formatResponse(result.data, result.message, result.status);
}

// CREATE Role
export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const wantToAccess: IWantAccess = {
    db_name: 'role',
    access: 'create',
  };
  const isAccess = await isUserHasAccessByRole(wantToAccess);
  if (isAccess) return isAccess;

  const result = await createRole(req);
  return formatResponse(result.data, result.message, result.status);
}

// UPDATE Role
export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const wantToAccess: IWantAccess = {
    db_name: 'role',
    access: 'update',
  };
  const isAccess = await isUserHasAccessByRole(wantToAccess);
  if (isAccess) return isAccess;

  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkUpdateRoles(req) : await updateRole(req);

  return formatResponse(result.data, result.message, result.status);
}

// DELETE Role
export async function DELETE(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const wantToAccess: IWantAccess = {
    db_name: 'role',
    access: 'delete',
  };
  const isAccess = await isUserHasAccessByRole(wantToAccess);
  if (isAccess) return isAccess;

  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkDeleteRoles(req) : await deleteRole(req);

  return formatResponse(result.data, result.message, result.status);
}
