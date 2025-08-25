/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import { handleRateLimit } from './rate-limit';
import {
  getUsers_access,
  createUser_access,
  updateUser_access,
  deleteUser_access,
  getUser_accessById,
  bulkUpdateUsers_access,
  bulkDeleteUsers_access,
} from './controller';

// import { formatResponse, handleTokenVerify, IResponse } from './jwt-verify';
import { formatResponse, IResponse } from './jwt-verify';

// GET all Users_access
export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const id = new URL(req.url).searchParams.get('id');
  const result: IResponse = id ? await getUser_accessById(req) : await getUsers_access(req);
  return formatResponse(result.data, result.message, result.status);
}

// CREATE User_access
export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const result = await createUser_access(req);
  return formatResponse(result.data, result.message, result.status);
}

// UPDATE User_access
export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkUpdateUsers_access(req) : await updateUser_access(req);

  return formatResponse(result.data, result.message, result.status);
}

// DELETE User_access
export async function DELETE(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkDeleteUsers_access(req) : await deleteUser_access(req);

  return formatResponse(result.data, result.message, result.status);
}
