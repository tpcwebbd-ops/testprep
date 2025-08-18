/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import { handleRateLimit } from './rate-limit';
import { getCourses, createCourse, updateCourse, deleteCourse, getCourseById, bulkUpdateCourses, bulkDeleteCourses } from './controller';

// import { formatResponse, handleTokenVerify, IResponse } from './jwt-verify';
import { formatResponse, IResponse } from './jwt-verify';

// GET all Courses
export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const id = new URL(req.url).searchParams.get('id');
  const result: IResponse = id ? await getCourseById(req) : await getCourses(req);
  return formatResponse(result.data, result.message, result.status);
}

// CREATE Course
export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const result = await createCourse(req);
  return formatResponse(result.data, result.message, result.status);
}

// UPDATE Course
export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkUpdateCourses(req) : await updateCourse(req);

  return formatResponse(result.data, result.message, result.status);
}

// DELETE Course
export async function DELETE(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  // const tokenResponse = handleTokenVerify(req);
  // if (tokenResponse) return tokenResponse;

  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkDeleteCourses(req) : await deleteCourse(req);

  return formatResponse(result.data, result.message, result.status);
}
