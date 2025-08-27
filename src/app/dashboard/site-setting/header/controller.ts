import { withDB } from '@/app/api/utils/db'; // Adjust path as per your project structure
// import { IResponse } from './jwt-verify'; // Adjust path as per your project structure (assuming jwt-verify.ts exists)
import Header from './model'; // Assuming model.ts is in the same directory
import { NavData } from './interface';
// import { connectRedis, getRedisData, setRedisData } from './redis'; // Assuming redis.ts exists for caching
import { IResponse } from '@/app/api/utils/utils';
import { connectRedis, getRedisData, setRedisData } from '@/app/api/utils/redis';

// Helper to format responses
const formatResponse = (data: unknown, message: string, status: number) => ({
  data,
  message,
  status,
});

// GET Header Data
export async function getHeaderData(req: Request): Promise<IResponse> {
  await connectRedis();
  const cachedData = await getRedisData('headerData');
  if (cachedData) {
    return formatResponse(JSON.parse(cachedData), 'Header data fetched from cache successfully', 200);
  } else {
    return withDB(async () => {
      const header = await Header.findOne(); // Assuming there's only one header data document
      if (!header) {
        // If no header data exists, you might want to create a default one or return a specific message
        return formatResponse(null, 'Header data not found', 404);
      }
      await setRedisData('headerData', JSON.stringify(header));
      return formatResponse(header, 'Header data fetched successfully', 200);
    });
  }
}

// UPDATE Header Data
export async function updateHeaderData(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const updateData: NavData = await req.json();

      // Find and update the single header document. If it doesn't exist, create it.
      const updatedHeader = await Header.findOneAndUpdate({}, updateData, { new: true, upsert: true, runValidators: true });

      if (!updatedHeader) {
        return formatResponse(null, 'Failed to update header data', 500);
      }
      // Invalidate cache after update
      await connectRedis();
      await setRedisData('headerData', JSON.stringify(updatedHeader));
      return formatResponse(updatedHeader, 'Header data updated successfully', 200);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error; // Re-throw other errors to be handled by `withDB`
    }
  });
}
