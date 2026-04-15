/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/
import { FilterQuery } from 'mongoose';

import { withDB } from '@/app/api/utils/db';
import { formatResponse, IResponse } from '@/app/api/utils/utils';

import MyCourse from './model';

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

function isMongoError(error: unknown): error is MongoError {
  return error !== null && typeof error === 'object' && 'code' in error && typeof (error as MongoError).code === 'number';
}

export async function createMyCourse(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const myCourseData = await req.json();
      const newMyCourse = await MyCourse.create(myCourseData);
      return formatResponse(newMyCourse, 'MyCourse created successfully', 201);
    } catch (error: unknown) {
      if (isMongoError(error) && error.code === 11000) {
        return formatResponse(null, `Duplicate: ${JSON.stringify(error.keyValue)}`, 409);
      }
      throw error;
    }
  });
}

export async function getMyCourseById(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'ID is required', 400);
    const myCourse = await MyCourse.findById(id);
    if (!myCourse) return formatResponse(null, 'Not found', 404);
    return formatResponse(myCourse, 'Fetched successfully', 200);
  });
}

export async function getMyCourses(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '1000');
    const skip = (page - 1) * limit;
    const searchQuery = url.searchParams.get('q');
    let filter: FilterQuery<unknown> = {};

    if (searchQuery) {
      filter = {
        $or: [{ studentName: { $regex: searchQuery, $options: 'i' } }, { studentEmail: { $regex: searchQuery, $options: 'i' } }],
      };
    }

    const myCourses = await MyCourse.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit);
    const total = await MyCourse.countDocuments(filter);
    return formatResponse({ myCourses, total, page, limit }, 'Fetched successfully', 200);
  });
}

export async function getAllMyCourses(): Promise<IResponse> {
  return withDB(async () => {
    const page = parseInt('1');
    const limit = parseInt('1000');
    const skip = (page - 1) * limit;
    const filter: FilterQuery<unknown> = {};
    const myCourses = await MyCourse.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit);
    const total = await MyCourse.countDocuments(filter);
    return formatResponse({ myCourses, total, page, limit }, 'Fetched successfully', 200);
  });
}

export async function updateMyCourse(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      if (!id) return formatResponse(null, 'ID is required', 400);
      const updated = await MyCourse.findByIdAndUpdate(id, updateData, {
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

export async function deleteMyCourse(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { id } = await req.json();
    if (!id) return formatResponse(null, 'ID required', 400);
    const deleted = await MyCourse.findByIdAndDelete(id);
    if (!deleted) return formatResponse(null, 'Not found', 404);
    return formatResponse({ deletedCount: 1 }, 'Deleted successfully', 200);
  });
}
