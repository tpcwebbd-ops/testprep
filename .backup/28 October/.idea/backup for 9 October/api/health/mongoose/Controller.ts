import Docking from './Model';
import { IResponse, withDB } from './utils';

// Helper to format responses
const formatResponse = (ok: boolean, data: unknown, message: string, status: number) => ({ ok, data, message, status });

// CREATE Docking
export async function createDocking(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const dockingData = await req.json();
      const newDocking = await Docking.create({ ...dockingData });
      return formatResponse(true, newDocking, 'Docking created successfully', 201);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(false, null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error; // Re-throw other errors to be handled by `withDB`
    }
  });
}

// GET single Docking by ID
export async function getDockingById(req: Request) {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(false, null, 'Docking ID is required', 400);

    const docking = await Docking.findById(id);
    if (!docking) return formatResponse(false, null, 'Docking not found', 404);

    return formatResponse(true, docking, 'Docking fetched successfully', 200);
  });
}

// GET all Docking_s with pagination
export async function getDocking_s(req: Request) {
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

    const docking_s = await Docking.find(searchFilter).sort({ updatedAt: -1, createdAt: -1 }).skip(skip).limit(limit);

    const totalDocking_s = await Docking.countDocuments(searchFilter);

    return formatResponse(true, { docking_s: docking_s || [], total: totalDocking_s, page, limit }, 'Docking_s fetched successfully', 200);
  });
}

// UPDATE single Docking by ID

export async function updateDocking(req: Request) {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      const updatedDocking = await Docking.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

      if (!updatedDocking) return formatResponse(false, null, 'Docking not found', 404);
      return formatResponse(true, updatedDocking, 'Docking updated successfully', 200);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(false, null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error; // Re-throw other errors to be handled by `withDB`
    }
  });
}

// BULK UPDATE Docking_s
export async function bulkUpdateDocking_s(req: Request) {
  return withDB(async () => {
    const updates = await req.json();
    const results = await Promise.allSettled(
      updates.map(({ id, updateData }: { id: string; updateData: Record<string, unknown> }) =>
        Docking.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }),
      ),
    );

    const successfulUpdates = results.filter(r => r.status === 'fulfilled' && r.value).map(r => (r as PromiseFulfilledResult<typeof Docking>).value);
    const failedUpdates = results.filter(r => r.status === 'rejected' || !r.value).map((_, i) => updates[i].id);

    return formatResponse(true, { updated: successfulUpdates, failed: failedUpdates }, 'Bulk update completed', 200);
  });
}

// DELETE single Docking by ID
export async function deleteDocking(req: Request) {
  return withDB(async () => {
    const { id } = await req.json();
    const deletedDocking = await Docking.findByIdAndDelete(id);
    if (!deletedDocking) return formatResponse(false, deletedDocking, 'Docking not found', 404);
    return formatResponse(true, { deletedCount: 1 }, 'Docking deleted successfully', 200);
  });
}

// BULK DELETE Docking_s
export async function bulkDeleteDocking_s(req: Request) {
  return withDB(async () => {
    const { ids } = await req.json();
    const deletedIds: string[] = [];
    const invalidIds: string[] = [];

    for (const id of ids) {
      try {
        const docking = await Docking.findById(id);
        if (docking) {
          const deletedDocking = await Docking.findByIdAndDelete(id);
          if (deletedDocking) deletedIds.push(id);
        } else {
          invalidIds.push(id);
        }
      } catch {
        invalidIds.push(id);
      }
    }

    return formatResponse(true, { deleted: deletedIds.length, deletedIds, invalidIds }, 'Bulk delete operation completed', 200);
  });
}
