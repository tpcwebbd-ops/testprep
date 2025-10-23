import { withDB } from '@/app/api/utils/db';
import About from './model';

interface IResponse {
  data: unknown;
  message: string;
  status: number;
  ok: boolean;
}

const formatResponse = (data: unknown, message: string, status: number): IResponse => ({
  data,
  message,
  status,
  ok: status >= 200 && status < 300,
});

// ✅ CREATE (POST)
export async function createAbout(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const aboutData = await req.json();

      // Accept both single or array
      const created = Array.isArray(aboutData) && aboutData.length > 0 ? await About.insertMany(aboutData) : await About.create(aboutData);

      return formatResponse(created, 'About data created successfully', 201);
    } catch (error: unknown) {
      const err = error as any;
      if (err.code === 11000) {
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      return formatResponse(null, err.message || 'Failed to create About data', 500);
    }
  });
}

// ✅ READ (GET)
export async function getAbout(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const id = new URL(req.url).searchParams.get('id');
      if (id) {
        const item = await About.findById(id);
        if (!item) return formatResponse([], 'No About item found', 200);
        return formatResponse(item, 'About item fetched successfully', 200);
      }

      const items = await About.find().sort({ createdAt: 1 });
      if (!items || items.length === 0) return formatResponse([], 'No About data found', 200);

      return formatResponse(items, 'All About items fetched successfully', 200);
    } catch (error: unknown) {
      return formatResponse(null, (error as Error).message || 'Failed to fetch About data', 500);
    }
  });
}

// ✅ UPDATE (PUT) – replace all About items
export async function updateAbout(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const aboutData = await req.json();

      if (!Array.isArray(aboutData) || aboutData.length === 0) {
        return formatResponse(null, 'Invalid or empty data array', 400);
      }

      // Replace entire collection with new data
      await About.deleteMany({});
      const updated = await About.insertMany(aboutData);

      return formatResponse(updated, 'About data updated successfully', 200);
    } catch (error: unknown) {
      const err = error as any;
      if (err.code === 11000) {
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      return formatResponse(null, err.message || 'Failed to update About data', 500);
    }
  });
}

// ✅ DELETE (optional)
export async function deleteAbout(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { _id } = await req.json();
      if (!_id) return formatResponse(null, 'Missing _id in request body', 400);

      const deleted = await About.findByIdAndDelete(_id);
      if (!deleted) return formatResponse(null, 'About item not found', 404);

      return formatResponse({ deletedCount: 1 }, 'About item deleted successfully', 200);
    } catch (error: unknown) {
      return formatResponse(null, (error as Error).message || 'Failed to delete About data', 500);
    }
  });
}
