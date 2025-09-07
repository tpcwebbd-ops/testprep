import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { formatResponse, IResponse } from '@/app/api/utils/jwt-verify';
import { getUserByEmail } from './controller';

export async function GET(req: Request) {
  // Handle rate limiting to prevent abuse
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // Call the controller function to fetch the user by email
  const result: IResponse = await getUserByEmail(req);

  // Format and return the final response
  return formatResponse(result.data, result.message, result.status);
}
