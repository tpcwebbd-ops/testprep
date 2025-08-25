/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import { withDB } from '@/app/api/utils/db';

import User_access from './model';
import { IResponse } from './jwt-verify';
import { connectRedis, getRedisData } from './redis';

// Helper to format responses
const formatResponse = (data: unknown, message: string, status: number) => ({
  data,
  message,
  status,
});

// CREATE User_access
export async function createUser_access(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const user_accessData = await req.json();
      const newUser_access = await User_access.create({
        ...user_accessData,
      });
      return formatResponse(newUser_access, 'User_access created successfully', 201);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error; // Re-throw other errors to be handled by `withDB`
    }
  });
}

// GET single User_access by ID
export async function getUser_accessById(req: Request) {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'User_access ID is required', 400);

    const user_access = await User_access.findById(id);
    if (!user_access) return formatResponse(null, 'User_access not found', 404);

    return formatResponse(user_access, 'User_access fetched successfully', 200);
  });
}

// GET all Users_access with pagination
export async function getUsers_access(req: Request) {
  await connectRedis();
  const getValue = await getRedisData('users_access');
  if (getValue) {
    const { users_access, totalUsers_access, page, limit } = JSON.parse(getValue);
    return formatResponse(
      {
        users_access: users_access || [],
        total: totalUsers_access,
        page,
        limit,
      },
      'Users_access fetched successfully',
      200,
    );
  } else {
    return withDB(async () => {
      const url = new URL(req.url);
      const page = parseInt(url.searchParams.get('page') || '1', 10);
      const limit = parseInt(url.searchParams.get('limit') || '10', 10);
      const skip = (page - 1) * limit;

      const searchQuery = url.searchParams.get('q');

      // Always filter by role: 'block'
      let searchFilter: { [key: string]: unknown } = { role: 'block' };

      // Apply search filter only if search query is provided
      if (searchQuery) {
        searchFilter = {
          $or: [{ name: { $regex: searchQuery, $options: 'i' } }, { email: { $regex: searchQuery, $options: 'i' } }],
        };
      }

      const users_access = await User_access.find(searchFilter).sort({ updatedAt: -1, createdAt: -1 }).skip(skip).limit(limit);

      const totalUsers_access = await User_access.countDocuments(searchFilter);

      return formatResponse(
        {
          users_access: users_access || [],
          total: totalUsers_access,
          page,
          limit,
        },
        'Users_access fetched successfully',
        200,
      );
    });
  }
}

// UPDATE single User_access by ID
export async function updateUser_access(req: Request) {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      const updatedUser_access = await User_access.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

      if (!updatedUser_access) return formatResponse(null, 'User_access not found', 404);
      return formatResponse(updatedUser_access, 'User_access updated successfully', 200);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error; // Re-throw other errors to be handled by `withDB`
    }
  });
}

// BULK UPDATE Users_access
export async function bulkUpdateUsers_access(req: Request) {
  return withDB(async () => {
    const updates = await req.json();
    const results = await Promise.allSettled(
      updates.map(({ id, updateData }: { id: string; updateData: Record<string, unknown> }) =>
        User_access.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        }),
      ),
    );

    const successfulUpdates = results.filter(r => r.status === 'fulfilled' && r.value).map(r => (r as PromiseFulfilledResult<typeof User_access>).value);
    const failedUpdates = results.filter(r => r.status === 'rejected' || !r.value).map((_, i) => updates[i].id);

    return formatResponse({ updated: successfulUpdates, failed: failedUpdates }, 'Bulk update completed', 200);
  });
}

// DELETE single User_access by ID
export async function deleteUser_access(req: Request) {
  return withDB(async () => {
    const { id } = await req.json();
    const deletedUser_access = await User_access.findByIdAndDelete(id);
    if (!deletedUser_access) return formatResponse(deletedUser_access, 'User_access not found', 404);
    return formatResponse({ deletedCount: 1 }, 'User_access deleted successfully', 200);
  });
}

// BULK DELETE Users_access
export async function bulkDeleteUsers_access(req: Request) {
  return withDB(async () => {
    const { ids } = await req.json();
    const deletedIds: string[] = [];
    const invalidIds: string[] = [];

    for (const id of ids) {
      try {
        const user_access = await User_access.findById(id);
        if (user_access) {
          const deletedUser_access = await User_access.findByIdAndDelete(id);
          if (deletedUser_access) deletedIds.push(id);
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
