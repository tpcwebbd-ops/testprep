// import { handleRateLimit } from '@/api/utils/rate-limit'; // Adjust path as per your project structure
// import { handleTokenVerify, formatResponse, IResponse } from './jwt-verify'; // Adjust path as per your project structure
// import { formatResponse, IResponse } from './jwt-verify'; // Adjust path as per your project structure

import { formatResponse, IResponse } from '@/app/api/utils/utils';
import { getHeaderData, updateHeaderData } from '../controller'; // Assuming controller.ts is in the same directory
import { handleRateLimit } from '@/app/api/utils/rate-limit';

// GET Header Data
export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const result: IResponse = await getHeaderData(req);
  return formatResponse(result.data, result.message, result.status);
}

// UPDATE Header Data
export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const result = await updateHeaderData(req);
  return formatResponse(result.data, result.message, result.status);
}
