/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import { withDB } from '@/app/api/utils/db';

import Course from './model';
import { IResponse } from './jwt-verify';
import { connectRedis, getRedisData } from './redis';

// Helper to format responses
const formatResponse = (data: unknown, message: string, status: number) => ({
  data,
  message,
  status,
});

// CREATE Course
export async function createCourse(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const courseData = await req.json();
      const newCourse = await Course.create({
        ...courseData,
      });
      return formatResponse(newCourse, 'Course created successfully', 201);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error; // Re-throw other errors to be handled by `withDB`
    }
  });
}

// GET single Course by ID
export async function getCourseById(req: Request) {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'Course ID is required', 400);

    const course = await Course.findById(id);
    if (!course) return formatResponse(null, 'Course not found', 404);

    return formatResponse(course, 'Course fetched successfully', 200);
  });
}

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

      const searchQuery = url.searchParams.get('q');

      let searchFilter = {};

      // Apply search filter only if search query is provided
      if (searchQuery) {
        searchFilter = {
          $or: [
            { name: { $regex: searchQuery, $options: 'i' } },
            { email: { $regex: searchQuery, $options: 'i' } },
            { alias: { $regex: searchQuery, $options: 'i' } },
          ],
        };
      }

      const courses = await Course.find(searchFilter).sort({ updatedAt: -1, createdAt: -1 }).skip(skip).limit(limit);

      const totalCourses = await Course.countDocuments(searchFilter);

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

// UPDATE single Course by ID
export async function updateCourse(req: Request) {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      const updatedCourse = await Course.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

      if (!updatedCourse) return formatResponse(null, 'Course not found', 404);
      return formatResponse(updatedCourse, 'Course updated successfully', 200);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error; // Re-throw other errors to be handled by `withDB`
    }
  });
}

// BULK UPDATE Courses
export async function bulkUpdateCourses(req: Request) {
  return withDB(async () => {
    const updates = await req.json();
    const results = await Promise.allSettled(
      updates.map(({ id, updateData }: { id: string; updateData: Record<string, unknown> }) =>
        Course.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        }),
      ),
    );

    const successfulUpdates = results.filter(r => r.status === 'fulfilled' && r.value).map(r => (r as PromiseFulfilledResult<typeof Course>).value);
    const failedUpdates = results.filter(r => r.status === 'rejected' || !r.value).map((_, i) => updates[i].id);

    return formatResponse({ updated: successfulUpdates, failed: failedUpdates }, 'Bulk update completed', 200);
  });
}

// DELETE single Course by ID
export async function deleteCourse(req: Request) {
  return withDB(async () => {
    const { id } = await req.json();
    const deletedCourse = await Course.findByIdAndDelete(id);
    if (!deletedCourse) return formatResponse(deletedCourse, 'Course not found', 404);
    return formatResponse({ deletedCount: 1 }, 'Course deleted successfully', 200);
  });
}

// BULK DELETE Courses
export async function bulkDeleteCourses(req: Request) {
  return withDB(async () => {
    const { ids } = await req.json();
    const deletedIds: string[] = [];
    const invalidIds: string[] = [];

    for (const id of ids) {
      try {
        const course = await Course.findById(id);
        if (course) {
          const deletedCourse = await Course.findByIdAndDelete(id);
          if (deletedCourse) deletedIds.push(id);
        } else {
          invalidIds.push(id);
        }
      } catch {
        invalidIds.push(id);
      }
    }

    return formatResponse({ deleted: deletedIds.length, deletedIds, invalidIds }, 'Bulk delete operation completed', 200);
  });
}
