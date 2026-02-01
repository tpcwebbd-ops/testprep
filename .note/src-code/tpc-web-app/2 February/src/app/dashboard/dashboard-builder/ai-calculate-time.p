Help me to calculate timeing

I am using mongoose and mongoDB.

here is my route.ts 
```
import { NextResponse } from 'next/server';
import { getDashboards, createDashboard, updateDashboard, deleteDashboard, getDashboardById } from './controller';

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id');
  const result = id ? await getDashboardById(req) : await getDashboards(req);

  return NextResponse.json(result.data, { status: result.status, statusText: result.message });
}

export async function POST(req: Request) {
  const result = await createDashboard(req);
  return NextResponse.json(result.data, { status: result.status, statusText: result.message });
}

export async function PUT(req: Request) {
  const result = await updateDashboard(req);
  return NextResponse.json(result.data, { status: result.status, statusText: result.message });
}

export async function DELETE(req: Request) {
  const result = await deleteDashboard(req);
  return NextResponse.json(result.data, { status: result.status, statusText: result.message });
}

```

model.ts 
```
import mongoose, { Schema } from 'mongoose';

const dashboardBuilderSchema = new Schema(
  {
    dashboardName: { type: String, required: true },
    dashboardPath: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    content: { type: Schema.Types.Mixed, default: {} },
    contentType: { type: Schema.Types.Mixed, default: {} },
    accessList: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: true, timestamps: true },
);

export default mongoose.models.DashboardBuilder || mongoose.model('DashboardBuilder', dashboardBuilderSchema);

```

and here is controller.ts 
```
import { withDB } from '@/app/api/utils/db';
import DashboardBuilder from './model';
import { formatResponse, IResponse } from '@/app/api/utils/utils';
import { FilterQuery } from 'mongoose';

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

function isMongoError(error: unknown): error is MongoError {
  return error !== null && typeof error === 'object' && 'code' in error && typeof (error as MongoError).code === 'number';
}

export async function createDashboard(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const dashboardData = await req.json();
      const newDashboard = await DashboardBuilder.create(dashboardData);

      return formatResponse(newDashboard, 'Dashboard created successfully', 201);
    } catch (error: unknown) {
      if (isMongoError(error) && error.code === 11000) {
        return formatResponse(null, `Duplicate: ${JSON.stringify(error.keyValue)}`, 409);
      }
      throw error;
    }
  });
}

export async function getDashboardById(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'ID is required', 400);

    const dashboard = await DashboardBuilder.findById(id);
    if (!dashboard) return formatResponse(null, 'Not found', 404);

    return formatResponse(dashboard, 'Fetched successfully', 200);
  });
}

export async function getDashboards(req: Request): Promise<IResponse> {
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
          { dashboardName: { $regex: searchQuery, $options: 'i' } },
          { dashboardPath: { $regex: searchQuery, $options: 'i' } },
          { 'content.key': { $regex: searchQuery, $options: 'i' } },
          { 'content.name': { $regex: searchQuery, $options: 'i' } },
        ],
      };
    }

    const dashboards = await DashboardBuilder.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit);
    const total = await DashboardBuilder.countDocuments(filter);

    return formatResponse({ dashboards, total, page, limit }, 'Fetched successfully', 200);
  });
}

export async function updateDashboard(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      if (!id) return formatResponse(null, 'ID is required', 400);

      const updated = await DashboardBuilder.findByIdAndUpdate(id, updateData, {
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

export async function deleteDashboard(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { id } = await req.json();
    if (!id) return formatResponse(null, 'ID required', 400);

    const deleted = await DashboardBuilder.findByIdAndDelete(id);
    if (!deleted) return formatResponse(null, 'Not found', 404);

    return formatResponse({ deletedCount: 1 }, 'Deleted successfully', 200);
  });
}

```

Look at the senerio and Give me Idea which is best and why.

In senerio A.
I will create 1000 Content, 1000 contentType, and 1000 accessList.
There are 500 User use this application and every minute they have 20 request. 
Then How much time it take to response. 

In senerio B. 
I will create 100 Content, 100 contentType, and 100 accessList. But I create 10 route, model, controller 
There are 500 User use this application and every minute they have 20 request. 
Then How much time it take to response. 

I deploy my NextJs project in vercel. and use mongoDB. 