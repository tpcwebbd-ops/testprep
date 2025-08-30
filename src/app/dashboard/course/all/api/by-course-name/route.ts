/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import { handleRateLimit } from '../v1/rate-limit';
import { getCourses } from './controller';

// import { formatResponse, handleTokenVerify, IResponse } from './jwt-verify';
import { formatResponse, IResponse } from '../v1/jwt-verify';

// GET all Courses
export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const result: IResponse = await getCourses(req);
  return formatResponse(result.data, result.message, result.status);
  // return formatResponse('result.data', 'result.message', 200);
}
