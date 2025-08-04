/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import { withDB } from '@/app/api/utils/db';

import GAuthUser from './Model';
import { IResponse } from './jwt-verify';
import { connectRedis, getRedisData } from './redis';

// Helper to format responses
const formatResponse = (data: unknown, message: string, status: number) => ({ data, message, status });

// CREATE GAuthUser
export async function createGAuthUser(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const gAuthUsersData = await req.json();
      const newGAuthUser = await GAuthUser.create({ ...gAuthUsersData });
      return formatResponse(newGAuthUser, 'GAuthUser created successfully', 201);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error; // Re-throw other errors to be handled by `withDB`
    }
  });
}

// GET single GAuthUser by ID
export async function getGAuthUserById(req: Request) {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'GAuthUser ID is required', 400);

    const gAuthUsers = await GAuthUser.findById(id);
    if (!gAuthUsers) return formatResponse(null, 'GAuthUser not found', 404);

    return formatResponse(gAuthUsers, 'GAuthUser fetched successfully', 200);
  });
}

// GET all GAuthUsers with pagination
export async function getGAuthUsers(req: Request) {
  await connectRedis();
  const getValue = await getRedisData('gAuthUsers');
  if (getValue) {
    const { gAuthUsers, totalGAuthUsers, page, limit } = JSON.parse(getValue);
    return formatResponse({ gAuthUsers: gAuthUsers || [], total: totalGAuthUsers, page, limit }, 'GAuthUsers fetched successfully', 200);
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
            { blockedBy: { $regex: searchQuery, $options: 'i' } },
            { userRole: { $regex: searchQuery, $options: 'i' } },
          ],
        };
      }

      const gAuthUsers = await GAuthUser.find(searchFilter).sort({ updatedAt: -1, createdAt: -1 }).skip(skip).limit(limit);

      const totalGAuthUsers = await GAuthUser.countDocuments(searchFilter);

      return formatResponse({ gAuthUsers: gAuthUsers || [], total: totalGAuthUsers, page, limit }, 'GAuthUsers fetched successfully', 200);
    });
  }
}

// UPDATE single GAuthUser by ID
export async function updateGAuthUser(req: Request) {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      const updatedGAuthUser = await GAuthUser.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

      if (!updatedGAuthUser) return formatResponse(null, 'GAuthUser not found', 404);
      return formatResponse(updatedGAuthUser, 'GAuthUser updated successfully', 200);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error; // Re-throw other errors to be handled by `withDB`
    }
  });
}

// BULK UPDATE GAuthUsers
export async function bulkUpdateGAuthUsers(req: Request) {
  return withDB(async () => {
    const updates = await req.json();
    const results = await Promise.allSettled(
      updates.map(({ id, updateData }: { id: string; updateData: Record<string, unknown> }) =>
        GAuthUser.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }),
      ),
    );

    const successfulUpdates = results.filter(r => r.status === 'fulfilled' && r.value).map(r => (r as PromiseFulfilledResult<typeof GAuthUser>).value);
    const failedUpdates = results.filter(r => r.status === 'rejected' || !r.value).map((_, i) => updates[i].id);

    return formatResponse({ updated: successfulUpdates, failed: failedUpdates }, 'Bulk update completed', 200);
  });
}

// DELETE single GAuthUser by ID
export async function deleteGAuthUser(req: Request) {
  return withDB(async () => {
    const { id } = await req.json();
    const deletedGAuthUser = await GAuthUser.findByIdAndDelete(id);
    if (!deletedGAuthUser) return formatResponse(deletedGAuthUser, 'GAuthUser not found', 404);
    return formatResponse({ deletedCount: 1 }, 'GAuthUser deleted successfully', 200);
  });
}

// BULK DELETE GAuthUsers
export async function bulkDeleteGAuthUsers(req: Request) {
  return withDB(async () => {
    const { ids } = await req.json();
    const deletedIds: string[] = [];
    const invalidIds: string[] = [];

    for (const id of ids) {
      try {
        const gAuthUsers = await GAuthUser.findById(id);
        if (gAuthUsers) {
          const deletedGAuthUser = await GAuthUser.findByIdAndDelete(id);
          if (deletedGAuthUser) deletedIds.push(id);
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
