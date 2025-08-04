/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import { handleRateLimit } from './rate-limit';
import {
  getGAuthUsers,
  createGAuthUser,
  updateGAuthUser,
  deleteGAuthUser,
  getGAuthUserById,
  bulkUpdateGAuthUsers,
  bulkDeleteGAuthUsers,
} from './Controller';

// import { formatResponse, handleTokenVerify, IResponse } from './jwt-verify';
import { formatResponse, IResponse } from './jwt-verify';

// GET all GAuthUsers
export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const id = new URL(req.url).searchParams.get('id');
  const result: IResponse = id ? await getGAuthUserById(req) : await getGAuthUsers(req);
  return formatResponse(result.data, result.message, result.status);
}

// CREATE GAuthUser
export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const result = await createGAuthUser(req);
  return formatResponse(result.data, result.message, result.status);
}

// UPDATE GAuthUser
export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkUpdateGAuthUsers(req) : await updateGAuthUser(req);

  return formatResponse(result.data, result.message, result.status);
}

// DELETE GAuthUser
export async function DELETE(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkDeleteGAuthUsers(req) : await deleteGAuthUser(req);

  return formatResponse(result.data, result.message, result.status);
}
