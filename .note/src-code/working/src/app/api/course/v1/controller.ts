import { withDB } from '@/app/api/utils/db';
import CourseBuilder from './model';
import { formatResponse, IResponse } from '@/app/api/utils/utils';
import { FilterQuery } from 'mongoose';

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

function isMongoError(error: unknown): error is MongoError {
  return error !== null && typeof error === 'object' && 'code' in error && typeof (error as MongoError).code === 'number';
}

export async function createCourse(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const courseData = await req.json();
      const newCourse = await CourseBuilder.create(courseData);

      return formatResponse(newCourse, 'Course created successfully', 201);
    } catch (error: unknown) {
      if (isMongoError(error) && error.code === 11000) {
        return formatResponse(null, `Duplicate: ${JSON.stringify(error.keyValue)}`, 409);
      }
      throw error;
    }
  });
}

export async function getCourseById(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'ID is required', 400);

    const course = await CourseBuilder.findById(id);
    if (!course) return formatResponse(null, 'Not found', 404);

    return formatResponse(course, 'Fetched successfully', 200);
  });
}

export async function getCourses(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '1000');
    const skip = (page - 1) * limit;

    const searchQuery = url.searchParams.get('q');
    let filter: FilterQuery<unknown> = {};

    if (searchQuery) {
      filter = {
        $or: [
          { courseName: { $regex: searchQuery, $options: 'i' } },
          { courseDay: { $regex: searchQuery, $options: 'i' } },
          { 'content.key': { $regex: searchQuery, $options: 'i' } },
          { 'content.heading': { $regex: searchQuery, $options: 'i' } },
          { 'content.type': { $regex: searchQuery, $options: 'i' } },
        ],
      };
    }

    const courses = await CourseBuilder.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit);
    const total = await CourseBuilder.countDocuments(filter);

    return formatResponse({ courses, total, page, limit }, 'Fetched successfully', 200);
  });
}

export async function updateCourse(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      if (!id) return formatResponse(null, 'ID is required', 400);

      const updated = await CourseBuilder.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: false,
      });

      if (!updated) return formatResponse(null, 'Not found', 404);

      return formatResponse(updated, 'Updated successfully', 200);
    } catch (error: unknown) {
      if (isMongoError(error) && error.code === 11000) {
        return formatResponse(null, `Duplicate: ${JSON.stringify(error.keyValue)}`, 409);
      }
      throw error;
    }
  });
}

export async function deleteCourse(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { id } = await req.json();
    if (!id) return formatResponse(null, 'ID required', 400);

    const deleted = await CourseBuilder.findByIdAndDelete(id);
    if (!deleted) return formatResponse(null, 'Not found', 404);

    return formatResponse({ deletedCount: 1 }, 'Deleted successfully', 200);
  });
}
