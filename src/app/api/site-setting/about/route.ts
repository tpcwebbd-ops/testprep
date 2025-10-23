import { NextResponse } from 'next/server';
import { getAbout, createAbout, updateAbout, deleteAbout } from './controller';
import { handleRateLimit } from '../../utils/rate-limit';

const formatResponse = (data: unknown, message: string, status: number) => {
  return NextResponse.json({ data, message }, { status });
};

// ✅ GET
export async function GET(req: Request) {
  const limit = handleRateLimit(req);
  if (limit) return limit;
  const result = await getAbout(req);
  return formatResponse(result.data, result.message, result.status);
}

// ✅ POST
export async function POST(req: Request) {
  const limit = handleRateLimit(req);
  if (limit) return limit;
  const result = await createAbout(req);
  return formatResponse(result.data, result.message, result.status);
}

// ✅ PUT
export async function PUT(req: Request) {
  const limit = handleRateLimit(req);
  if (limit) return limit;
  const result = await updateAbout(req);
  return formatResponse(result.data, result.message, result.status);
}

// ✅ DELETE
export async function DELETE(req: Request) {
  const limit = handleRateLimit(req);
  if (limit) return limit;
  const result = await deleteAbout(req);
  return formatResponse(result.data, result.message, result.status);
}
