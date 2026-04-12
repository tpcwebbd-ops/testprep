Look at those code 
/api/page-builder/v1/route.ts
```
/*
|-----------------------------------------
| setting up Route for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { revalidatePath } from 'next/cache';

import { formatResponse, IResponse } from '@/app/api/utils/jwt-verify';

import { handleRateLimit } from '../../utils/rate-limit';
import { getPages, createPage, updatePage, deletePage, getPageById } from './controller';
import { isUserHasAccessByRole, IWantAccess } from '../../utils/is-user-has-access-by-role';

export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'page builder',
      access: 'read',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const id = new URL(req.url).searchParams.get('id');
  const result: IResponse = id ? await getPageById(req) : await getPages(req);

  return formatResponse(result.data, result.message, result.status);
}

export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'page builder',
      access: 'create',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const result = await createPage(req);

  if (result.status === 200 || result.status === 201) {
    revalidatePath('/page builder');
  }

  return formatResponse(result.data, result.message, result.status);
}

export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'page builder',
      access: 'update',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const result = await updatePage(req);

  if (result.status === 200) {
    revalidatePath('/page builder');
  }

  return formatResponse(result.data, result.message, result.status);
}

export async function DELETE(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;
  if (process.env.AuthorizationEnable === 'true') {
    const wantToAccess: IWantAccess = {
      db_name: 'page builder',
      access: 'delete',
    };
    const isAccess = await isUserHasAccessByRole(wantToAccess);
    if (isAccess) return isAccess;
  }
  const result = await deletePage(req);

  if (result.status === 200) {
    revalidatePath('/page builder');
  }

  return formatResponse(result.data, result.message, result.status);
}

```
/api/page-builder/v1/model.ts
```
/*
|-----------------------------------------
| setting up Model for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import mongoose, { Schema } from 'mongoose';

const pageContentSchema = new Schema(
  {
    id: { type: String, required: true },
    key: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['section', 'form', 'button', 'title', 'description', 'paragraph', 'sliders', 'tagSliders', 'logoSliders', 'gellery'],
    },
    heading: { type: String, required: true },
    path: { type: String, required: true },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false, timestamps: false },
);

const pageBuilderSchema = new Schema(
  {
    pageName: { type: String, required: true },
    path: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    content: { type: [pageContentSchema], default: [] },
  },
  { _id: true, timestamps: true },
);

pageBuilderSchema.index({ path: 1 });
pageBuilderSchema.index({ isActive: 1 });
pageBuilderSchema.index({ 'content.type': 1 });

export default mongoose.models.PageBuilder || mongoose.model('PageBuilder', pageBuilderSchema);

```
/api/page-builder/v1/controller.ts
```
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

import PageBuilder from './model';

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
      const newPage = await PageBuilder.create(pageData);

      return formatResponse(newPage, 'Page created successfully', 201);
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

    const page = await PageBuilder.findById(id);
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

    const pages = await PageBuilder.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit);

    const total = await PageBuilder.countDocuments(filter);

    return formatResponse({ pages, total, page, limit }, 'Fetched successfully', 200);
  });
}
export async function getAllPages(): Promise<IResponse> {
  return withDB(async () => {
    const page = parseInt('1');
    const limit = parseInt('1000');
    const skip = (page - 1) * limit;
    const filter: FilterQuery<unknown> = {};
    const pages = await PageBuilder.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit);

    const total = await PageBuilder.countDocuments(filter);

    return formatResponse({ pages, total, page, limit }, 'Fetched successfully', 200);
  });
}

export async function updatePage(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      if (!id) return formatResponse(null, 'ID is required', 400);

      const updated = await PageBuilder.findByIdAndUpdate(id, updateData, {
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

    const deleted = await PageBuilder.findByIdAndDelete(id);
    if (!deleted) return formatResponse(null, 'Not found', 404);

    return formatResponse({ deletedCount: 1 }, 'Deleted successfully', 200);
  });
}

```

Instructions.
1. here is my model
        - course title { type: String}
        - course description { type: String}
        - total class { type: Number}
        - total assignment { type: Number}
        - total duration { type: String}
        - total mock test { type: Number}
        - real price { type: Number}
        - discount price { type: Number}
        - challenge day { type: Number}
        - total lecture { type: Number}
        - lecture Data   { type: Schema.Types.Mixed, default: {} },

now your task is generate those file with the following instructions.
generate those files
1. /api/courses/route.ts
2. /api/courses/model.ts
3. /api/courses/controller.ts


