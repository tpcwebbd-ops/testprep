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

import DbBuilder, { DbBuilderRecord } from './model';

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

function isMongoError(error: unknown): error is MongoError {
  return error !== null && typeof error === 'object' && 'code' in error && typeof (error as MongoError).code === 'number';
}

export async function createPage(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const pageData = await req.json();
      const newPage = await DbBuilder.create(pageData);

      return formatResponse(newPage, 'DB page created successfully', 201);
    } catch (error: unknown) {
      if (isMongoError(error) && error.code === 11000) {
        return formatResponse(null, `Duplicate: ${JSON.stringify(error.keyValue)}`, 409);
      }
      throw error;
    }
  });
}

export async function getPageById(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'ID is required', 400);

    const page = await DbBuilder.findById(id);
    if (!page) return formatResponse(null, 'Not found', 404);

    return formatResponse(page, 'Fetched successfully', 200);
  });
}

export async function getPages(req: Request): Promise<IResponse> {
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
          { pageName: { $regex: searchQuery, $options: 'i' } },
          { path: { $regex: searchQuery, $options: 'i' } },
          { 'content.key': { $regex: searchQuery, $options: 'i' } },
          { 'content.heading': { $regex: searchQuery, $options: 'i' } },
          { 'content.type': { $regex: searchQuery, $options: 'i' } },
        ],
      };
    }

    const pages = await DbBuilder.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit);

    const total = await DbBuilder.countDocuments(filter);

    return formatResponse({ pages, total, page, limit }, 'Fetched successfully', 200);
  });
}
export async function getAllPages(): Promise<IResponse> {
  return withDB(async () => {
    const page = parseInt('1');
    const limit = parseInt('1000');
    const skip = (page - 1) * limit;
    const filter: FilterQuery<unknown> = {};
    const pages = await DbBuilder.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit);

    const total = await DbBuilder.countDocuments(filter);

    return formatResponse({ pages, total, page, limit }, 'Fetched successfully', 200);
  });
}

export async function updatePage(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      if (!id) return formatResponse(null, 'ID is required', 400);

      const updated = await DbBuilder.findByIdAndUpdate(id, updateData, {
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

export async function deletePage(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { id } = await req.json();
    if (!id) return formatResponse(null, 'ID required', 400);

    const deleted = await DbBuilder.findByIdAndDelete(id);
    if (!deleted) return formatResponse(null, 'Not found', 404);
    await DbBuilderRecord.deleteMany({ pageId: id });

    return formatResponse({ deletedCount: 1 }, 'Deleted successfully', 200);
  });
}

export async function getRecords(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const url = new URL(req.url);
    const pageId = url.searchParams.get('pageId');
    if (!pageId) return formatResponse(null, 'Page ID is required', 400);

    const records = await DbBuilderRecord.find({ pageId }).sort({ createdAt: -1 });
    const total = await DbBuilderRecord.countDocuments({ pageId });

    return formatResponse({ records, total }, 'Fetched successfully', 200);
  });
}

export async function createRecord(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { pageId, values } = await req.json();
    if (!pageId) return formatResponse(null, 'Page ID is required', 400);

    const page = await DbBuilder.findById(pageId);
    if (!page) return formatResponse(null, 'Page not found', 404);

    const newRecord = await DbBuilderRecord.create({
      pageId,
      values: values || {},
    });

    return formatResponse(newRecord, 'Record created successfully', 201);
  });
}

export async function updateRecord(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { id, values } = await req.json();
    if (!id) return formatResponse(null, 'Record ID is required', 400);

    const updated = await DbBuilderRecord.findByIdAndUpdate(
      id,
      { values: values || {} },
      {
        new: true,
        runValidators: false,
      },
    );

    if (!updated) return formatResponse(null, 'Record not found', 404);

    return formatResponse(updated, 'Record updated successfully', 200);
  });
}

export async function bulkUpdateRecords(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { ids, fieldId, value } = await req.json();
    if (!Array.isArray(ids) || ids.length === 0) return formatResponse(null, 'Record IDs are required', 400);
    if (!fieldId) return formatResponse(null, 'Field ID is required', 400);

    const result = await DbBuilderRecord.updateMany({ _id: { $in: ids } }, { $set: { [`values.${fieldId}`]: value ?? '' } });

    return formatResponse({ modifiedCount: result.modifiedCount }, 'Records updated successfully', 200);
  });
}

export async function deleteRecord(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { id } = await req.json();
    if (!id) return formatResponse(null, 'Record ID is required', 400);

    const deleted = await DbBuilderRecord.findByIdAndDelete(id);
    if (!deleted) return formatResponse(null, 'Record not found', 404);

    return formatResponse({ deletedCount: 1 }, 'Record deleted successfully', 200);
  });
}

export async function bulkDeleteRecords(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { ids } = await req.json();
    if (!Array.isArray(ids) || ids.length === 0) return formatResponse(null, 'Record IDs are required', 400);

    const result = await DbBuilderRecord.deleteMany({ _id: { $in: ids } });

    return formatResponse({ deletedCount: result.deletedCount }, 'Records deleted successfully', 200);
  });
}
