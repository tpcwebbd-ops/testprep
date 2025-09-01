import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { getFinanceOverview } from './controller';
import { formatResponse, IResponse } from '@/app/api/utils/jwt-verify';

// GET Finance Overview
export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // You can add token verification here if this is a protected route
  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const result: IResponse = await getFinanceOverview();
  return formatResponse(result.data, result.message, result.status);
}
