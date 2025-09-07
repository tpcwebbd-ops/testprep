import { withDB } from '@/app/api/utils/db';
import { IResponse } from '@/app/api/utils/jwt-verify';
import { connectRedis, getRedisData } from '@/app/api/utils/redis';
import Batch from './model';

// Helper to format responses
const formatResponse = (data: unknown, message: string, status: number) => ({
  data,
  message,
  status,
});

// CREATE Batch
export async function createBatch(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const batchData = await req.json();
      const newBatch = await Batch.create({
        ...batchData,
      });
      return formatResponse(newBatch, 'Batch created successfully', 201);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error; // Re-throw other errors to be handled by `withDB`
    }
  });
}

// GET single Batch by ID
export async function getBatchById(req: Request) {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'Batch ID is required', 400);

    const batch = await Batch.findById(id);
    if (!batch) return formatResponse(null, 'Batch not found', 404);

    return formatResponse(batch, 'Batch fetched successfully', 200);
  });
}

// GET all Batches with pagination
export async function getBatches(req: Request) {
  await connectRedis();
  const getValue = await getRedisData('batches');
  if (getValue) {
    const { batches, totalBatches, page, limit } = JSON.parse(getValue);
    return formatResponse(
      {
        batches: batches || [],
        total: totalBatches,
        page,
        limit,
      },
      'Batches fetched successfully',
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

      // Apply search filter only if a search query is provided
      if (searchQuery) {
        searchFilter = {
          $or: [{ batchName: { $regex: searchQuery, $options: 'i' } }, { 'mentorInfo.mentorName': { $regex: searchQuery, $options: 'i' } }],
        };
      }

      const batches = await Batch.find(searchFilter).sort({ updatedAt: -1, createdAt: -1 }).skip(skip).limit(limit);

      const totalBatches = await Batch.countDocuments(searchFilter);

      return formatResponse(
        {
          batches: batches || [],
          total: totalBatches,
          page,
          limit,
        },
        'Batches fetched successfully',
        200,
      );
    });
  }
}

// UPDATE single Batch by ID
export async function updateBatch(req: Request) {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      const updatedBatch = await Batch.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedBatch) return formatResponse(null, 'Batch not found', 404);
      return formatResponse(updatedBatch, 'Batch updated successfully', 200);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error; // Re-throw other errors to be handled by `withDB`
    }
  });
}

// BULK UPDATE Batches
export async function bulkUpdateBatches(req: Request) {
  return withDB(async () => {
    const updates = await req.json();
    const results = await Promise.allSettled(
      updates.map(({ id, updateData }: { id: string; updateData: Record<string, unknown> }) =>
        Batch.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        }),
      ),
    );

    const successfulUpdates = results.filter(r => r.status === 'fulfilled' && r.value).map(r => (r as PromiseFulfilledResult<typeof Batch>).value);
    const failedUpdates = results.filter(r => r.status === 'rejected' || !r.value).map((_, i) => updates[i].id);

    return formatResponse({ updated: successfulUpdates, failed: failedUpdates }, 'Bulk update completed', 200);
  });
}

// DELETE single Batch by ID
export async function deleteBatch(req: Request) {
  return withDB(async () => {
    const { id } = await req.json();
    const deletedBatch = await Batch.findByIdAndDelete(id);
    if (!deletedBatch) return formatResponse(deletedBatch, 'Batch not found', 404);
    return formatResponse({ deletedCount: 1 }, 'Batch deleted successfully', 200);
  });
}

// BULK DELETE Batches
export async function bulkDeleteBatches(req: Request) {
  return withDB(async () => {
    const { ids } = await req.json();
    const deletedIds: string[] = [];
    const invalidIds: string[] = [];

    for (const id of ids) {
      try {
        const batch = await Batch.findById(id);
        if (batch) {
          const deletedBatch = await Batch.findByIdAndDelete(id);
          if (deletedBatch) deletedIds.push(id);
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
