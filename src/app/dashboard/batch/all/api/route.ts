import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { getBatches, createBatch, updateBatch, deleteBatch, getBatchById, bulkUpdateBatches, bulkDeleteBatches } from './controller';

// import { formatResponse, handleTokenVerify, IResponse } from './jwt-verify';
import { formatResponse, IResponse } from '@/app/api/utils/jwt-verify';

// GET all Batches
export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const id = new URL(req.url).searchParams.get('id');
  const result: IResponse = id ? await getBatchById(req) : await getBatches(req);
  return formatResponse(result.data, result.message, result.status);
}

// CREATE Batch
export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const result = await createBatch(req);
  return formatResponse(result.data, result.message, result.status);
}

// UPDATE Batch
export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkUpdateBatches(req) : await updateBatch(req);

  return formatResponse(result.data, result.message, result.status);
}

// DELETE Batch
export async function DELETE(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkDeleteBatches(req) : await deleteBatch(req);

  return formatResponse(result.data, result.message, result.status);
}
