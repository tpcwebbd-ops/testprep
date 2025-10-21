import { withDB } from '@/app/api/utils/db';
import Role from '../model';
import { logger } from 'better-auth';

interface IResponse {
  data: unknown;
  message: string;
  status: number;
}

const formatResponse = (data: unknown, message: string, status: number): IResponse => ({
  data,
  message,
  status,
});

// ✅ Only return role names and IDs
export async function getRoleNames(req: Request): Promise<IResponse> {
  logger.info(JSON.stringify(req));
  return withDB(async () => {
    try {
      const roles = await Role.find({}, { _id: 1, name: 1 }).sort({ createdAt: -1 });

      const simplified = roles.map((r: { _id: string; name: string }) => ({
        id: r._id.toString(),
        name: r.name,
      }));

      return formatResponse(simplified, 'Role names fetched successfully', 200);
    } catch (error) {
      console.error('Error fetching role names:', error);
      return formatResponse(null, 'Failed to fetch role names', 500);
    }
  });
}
