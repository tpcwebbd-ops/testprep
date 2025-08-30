import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { getFinances, createFinance, updateFinance, deleteFinance, getFinanceById, bulkUpdateFinances, bulkDeleteFinances } from './controller';

import { formatResponse, IResponse } from '@/app/api/utils/jwt-verify';

// GET all Finances
export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const id = new URL(req.url).searchParams.get('id');
  const result: IResponse = id ? await getFinanceById(req) : await getFinances(req);
  return formatResponse(result.data, result.message, result.status);
}

// CREATE Finance
export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const result = await createFinance(req);
  return formatResponse(result.data, result.message, result.status);
}

// UPDATE Finance
export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkUpdateFinances(req) : await updateFinance(req);

  return formatResponse(result.data, result.message, result.status);
}

// DELETE Finance
export async function DELETE(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkDeleteFinances(req) : await deleteFinance(req);

  return formatResponse(result.data, result.message, result.status);
}
