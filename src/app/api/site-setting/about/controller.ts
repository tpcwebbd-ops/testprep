import { withDB } from '@/app/api/utils/db';
import { FilterQuery } from 'mongoose';
import About from './model';

interface IResponse {
  data: unknown;
  message: string;
  status: number;
}

// Helper to format responses
const formatResponse = (data: unknown, message: string, status: number): IResponse => ({
  data,
  message,
  status,
});

// ✅ CREATE
export async function createAbout(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const aboutData = await req.json();
      const newAbout = await About.create({ ...aboutData });
      return formatResponse(newAbout, 'About data created successfully', 201);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error;
    }
  });
}

// ✅ READ (Single or All)
export async function getAbout(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');

    if (id) {
      const aboutItem = await About.findById(id);
      if (!aboutItem) return formatResponse(null, 'About item not found', 404);
      return formatResponse(aboutItem, 'About item fetched successfully', 200);
    }

    const aboutItems = await About.find().sort({ createdAt: -1 });
    return formatResponse(aboutItems, 'All About items fetched successfully', 200);
  });
}

// ✅ SEARCH + PAGINATION (Optional)
export async function getAboutPaginated(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;
    const searchQuery = url.searchParams.get('q');

    let filter: FilterQuery<unknown> = {};

    if (searchQuery) {
      const orConditions: FilterQuery<unknown>[] = [];
      const stringFields = ['name', 'path', 'description'];

      stringFields.forEach(field => {
        orConditions.push({ [field]: { $regex: searchQuery, $options: 'i' } });
      });

      if (orConditions.length > 0) filter = { $or: orConditions };
    }

    const aboutItems = await About.find(filter).sort({ updatedAt: -1, createdAt: -1 }).skip(skip).limit(limit);

    const total = await About.countDocuments(filter);

    return formatResponse({ aboutItems, total, page, limit }, 'About items fetched successfully', 200);
  });
}

// ✅ UPDATE
export async function updateAbout(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { _id, ...updateData } = await req.json();
      const updated = await About.findByIdAndUpdate(_id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updated) return formatResponse(null, 'About item not found', 404);
      return formatResponse(updated, 'About data updated successfully', 200);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error;
    }
  });
}

// ✅ BULK UPDATE (optional)
export async function bulkUpdateAbout(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const updates: { _id: string; updateData: Record<string, unknown> }[] = await req.json();

    const results = await Promise.allSettled(
      updates.map(({ _id, updateData }) => About.findByIdAndUpdate(_id, updateData, { new: true, runValidators: true })),
    );

    const successful = results.filter((r): r is PromiseFulfilledResult<unknown> => r.status === 'fulfilled' && r.value).map(r => r.value);

    const failed = results
      .map((r, i) => (r.status === 'rejected' || !('value' in r && r.value) ? updates[i]._id : null))
      .filter((id): id is string => id !== null);

    return formatResponse({ updated: successful, failed }, 'Bulk update completed', 200);
  });
}

// ✅ DELETE
export async function deleteAbout(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { _id } = await req.json();
    const deleted = await About.findByIdAndDelete(_id);
    if (!deleted) return formatResponse(null, 'About item not found', 404);
    return formatResponse({ deletedCount: 1 }, 'About item deleted successfully', 200);
  });
}

// ✅ BULK DELETE
export async function bulkDeleteAbout(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { ids }: { ids: string[] } = await req.json();
    const deletedIds: string[] = [];
    const invalidIds: string[] = [];

    for (const id of ids) {
      try {
        const doc = await About.findById(id);
        if (doc) {
          const deletedDoc = await About.findByIdAndDelete(id);
          if (deletedDoc) deletedIds.push(id);
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
