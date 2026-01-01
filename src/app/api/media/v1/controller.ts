import { withDB } from '@/app/api/utils/db';
import Media from './model';
import { formatResponse, IResponse } from '@/app/api/utils/utils';
import { FilterQuery } from 'mongoose';

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

function isMongoError(error: unknown): error is MongoError {
  return error !== null && typeof error === 'object' && 'code' in error && typeof (error as MongoError).code === 'number';
}

export async function createMedia(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const mediaData = await req.json();
      const newMidia = await Media.create(mediaData);

      return formatResponse(newMidia, 'Media created successfully', 201);
    } catch (error: unknown) {
      if (isMongoError(error) && error.code === 11000) {
        return formatResponse(null, `Duplicate: ${JSON.stringify(error.keyValue)}`, 409);
      }
      throw error;
    }
  });
}

export async function getMediaById(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'ID is required', 400);

    const media = await Media.findById(id);
    if (!media) return formatResponse(null, 'Not found', 404);

    return formatResponse(media, 'Fetched successfully', 200);
  });
}

export async function getMedia(req: Request): Promise<IResponse> {
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
          { contentType: { $regex: searchQuery, $options: 'i' } },
          { status: { $regex: searchQuery, $options: 'i' } },
          { url: { $regex: searchQuery, $options: 'i' } },
          { display_url: { $regex: searchQuery, $options: 'i' } },
        ],
      };
    }

    const data = await Media.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit);
    const total = await Media.countDocuments(filter);

    return formatResponse({ data, total, page, limit }, 'Fetched successfully', 200);
  });
}

export async function updateMedia(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      if (!id) return formatResponse(null, 'ID is required', 400);

      const updated = await Media.findByIdAndUpdate(id, updateData, {
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

export async function deleteMedia(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { id } = await req.json();
    if (!id) return formatResponse(null, 'ID required', 400);

    const deleted = await Media.findByIdAndDelete(id);
    if (!deleted) return formatResponse(null, 'Not found', 404);

    return formatResponse({ deletedCount: 1 }, 'Deleted successfully', 200);
  });
}
