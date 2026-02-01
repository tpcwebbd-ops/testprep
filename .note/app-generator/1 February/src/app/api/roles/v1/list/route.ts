import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { getRoleNames } from './controller';
import { formatResponse } from '@/app/api/utils/jwt-verify';

// GET all role names (id + name)
export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // ✅ Fetch simplified list
  const result = await getRoleNames(req);

  return formatResponse(result.data, result.message, result.status);
}
