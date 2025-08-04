/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import { handleRateLimit } from './rate-limit';
import {
  getUsers_1_000___,
  createUser_3_000___,
  updateUser_3_000___,
  deleteUser_3_000___,
  getUser_3_000___ById,
  bulkUpdateUsers_1_000___,
  bulkDeleteUsers_1_000___,
} from './Controller';

// import { formatResponse, handleTokenVerify, IResponse } from './jwt-verify';
import { formatResponse, IResponse } from './jwt-verify';

// GET all Users_1_000___
export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const id = new URL(req.url).searchParams.get('id');
  const result: IResponse = id ? await getUser_3_000___ById(req) : await getUsers_1_000___(req);
  return formatResponse(result.data, result.message, result.status);
}

// CREATE User_3_000___
export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const result = await createUser_3_000___(req);
  return formatResponse(result.data, result.message, result.status);
}

// UPDATE User_3_000___
export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkUpdateUsers_1_000___(req) : await updateUser_3_000___(req);

  return formatResponse(result.data, result.message, result.status);
}

// DELETE User_3_000___
export async function DELETE(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkDeleteUsers_1_000___(req) : await deleteUser_3_000___(req);

  return formatResponse(result.data, result.message, result.status);
}
