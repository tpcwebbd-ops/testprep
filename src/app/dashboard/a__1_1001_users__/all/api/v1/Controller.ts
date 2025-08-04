/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import { withDB } from '@/app/api/utils/db';

import User_3_000___ from './Model';
import { IResponse } from './jwt-verify';
import { connectRedis, getRedisData } from './redis';

// Helper to format responses
const formatResponse = (data: unknown, message: string, status: number) => ({ data, message, status });

// CREATE User_3_000___
export async function createUser_3_000___(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const user_4_000___Data = await req.json();
      const newUser_3_000___ = await User_3_000___.create({ ...user_4_000___Data });
      return formatResponse(newUser_3_000___, 'User_3_000___ created successfully', 201);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error; // Re-throw other errors to be handled by `withDB`
    }
  });
}

// GET single User_3_000___ by ID
export async function getUser_3_000___ById(req: Request) {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'User_3_000___ ID is required', 400);

    const user_4_000___ = await User_3_000___.findById(id);
    if (!user_4_000___) return formatResponse(null, 'User_3_000___ not found', 404);

    return formatResponse(user_4_000___, 'User_3_000___ fetched successfully', 200);
  });
}

// GET all Users_1_000___ with pagination
export async function getUsers_1_000___(req: Request) {
  await connectRedis();
  const getValue = await getRedisData('users_2_000___');
  if (getValue) {
    const { users_2_000___, totalUsers_1_000___, page, limit } = JSON.parse(getValue);
    return formatResponse({ users_2_000___: users_2_000___ || [], total: totalUsers_1_000___, page, limit }, 'Users_1_000___ fetched successfully', 200);
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

      const users_2_000___ = await User_3_000___.find(searchFilter).sort({ updatedAt: -1, createdAt: -1 }).skip(skip).limit(limit);

      const totalUsers_1_000___ = await User_3_000___.countDocuments(searchFilter);

      return formatResponse({ users_2_000___: users_2_000___ || [], total: totalUsers_1_000___, page, limit }, 'Users_1_000___ fetched successfully', 200);
    });
  }
}

// UPDATE single User_3_000___ by ID
export async function updateUser_3_000___(req: Request) {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      const updatedUser_3_000___ = await User_3_000___.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

      if (!updatedUser_3_000___) return formatResponse(null, 'User_3_000___ not found', 404);
      return formatResponse(updatedUser_3_000___, 'User_3_000___ updated successfully', 200);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error; // Re-throw other errors to be handled by `withDB`
    }
  });
}

// BULK UPDATE Users_1_000___
export async function bulkUpdateUsers_1_000___(req: Request) {
  return withDB(async () => {
    const updates = await req.json();
    const results = await Promise.allSettled(
      updates.map(({ id, updateData }: { id: string; updateData: Record<string, unknown> }) =>
        User_3_000___.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }),
      ),
    );

    const successfulUpdates = results.filter(r => r.status === 'fulfilled' && r.value).map(r => (r as PromiseFulfilledResult<typeof User_3_000___>).value);
    const failedUpdates = results.filter(r => r.status === 'rejected' || !r.value).map((_, i) => updates[i].id);

    return formatResponse({ updated: successfulUpdates, failed: failedUpdates }, 'Bulk update completed', 200);
  });
}

// DELETE single User_3_000___ by ID
export async function deleteUser_3_000___(req: Request) {
  return withDB(async () => {
    const { id } = await req.json();
    const deletedUser_3_000___ = await User_3_000___.findByIdAndDelete(id);
    if (!deletedUser_3_000___) return formatResponse(deletedUser_3_000___, 'User_3_000___ not found', 404);
    return formatResponse({ deletedCount: 1 }, 'User_3_000___ deleted successfully', 200);
  });
}

// BULK DELETE Users_1_000___
export async function bulkDeleteUsers_1_000___(req: Request) {
  return withDB(async () => {
    const { ids } = await req.json();
    const deletedIds: string[] = [];
    const invalidIds: string[] = [];

    for (const id of ids) {
      try {
        const user_4_000___ = await User_3_000___.findById(id);
        if (user_4_000___) {
          const deletedUser_3_000___ = await User_3_000___.findByIdAndDelete(id);
          if (deletedUser_3_000___) deletedIds.push(id);
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
