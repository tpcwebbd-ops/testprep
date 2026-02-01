import { NextResponse } from 'next/server';
import { getUsers, createUser, updateUser, deleteUser, getUserById } from './controller';
import { handleRateLimit } from '../../utils/rate-limit';

// ✅ Unified response handler
const formatResponse = (data: unknown, message: string, status: number) => {
  return NextResponse.json({ data, message }, { status });
};

// ✅ GET
export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const id = new URL(req.url).searchParams.get('id');
  const result = id ? await getUserById(req) : await getUsers(req);
  return formatResponse(result.data, result.message, result.status);
}

// ✅ POST
export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const result = await createUser(req);
  return formatResponse(result.data, result.message, result.status);
}

// ✅ PUT
export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const result = await updateUser(req);
  return formatResponse(result.data, result.message, result.status);
}

// ✅ DELETE
export async function DELETE(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const result = await deleteUser(req);
  return formatResponse(result.data, result.message, result.status);
}
