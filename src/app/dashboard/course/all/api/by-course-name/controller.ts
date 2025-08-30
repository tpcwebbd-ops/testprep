/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import { withDB } from '@/app/api/utils/db';

import AllCourse from '../v1/model';
import { IResponse } from '../v1/jwt-verify';
import { connectRedis, getRedisData } from '../v1/redis';

// Helper to format responses
const formatResponse = (data: unknown, message: string, status: number) => ({
  data,
  message,
  status,
});

// GET all Courses with pagination
export async function getCourses(req: Request) {
  await connectRedis();
  const getValue = await getRedisData('courses');
  if (getValue) {
    const { courses, totalCourses, page, limit } = JSON.parse(getValue);
    return formatResponse(
      {
        courses: courses || [],
        total: totalCourses,
        page,
        limit,
      },
      'Courses fetched successfully',
      200,
    );
  } else {
    return withDB(async () => {
      const url = new URL(req.url);
      const page = parseInt(url.searchParams.get('page') || '1', 10);
      const limit = parseInt(url.searchParams.get('limit') || '10', 10);
      const skip = (page - 1) * limit;

      const coursename = url.searchParams.get('coursename')?.toLowerCase();

      let matchStage = {};

      if (coursename) {
        matchStage = {
          $expr: {
            $eq: [{ $toLower: '$courseName' }, coursename],
          },
        };
      }

      const courses = await AllCourse.find(matchStage).sort({ updatedAt: -1, createdAt: -1 }).skip(skip).limit(limit);

      const totalCourses = await AllCourse.countDocuments(matchStage);

      return formatResponse(
        {
          courses: courses || [],
          total: totalCourses,
          page,
          limit,
        },
        'Courses fetched successfully',
        200,
      );
    });
  }
}
