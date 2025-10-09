import { withDB } from '@/app/api/utils/db';
import Role from '../model';

interface IResponse {
    data: unknown
    message: string
    status: number
}

// Helper to format responses
const formatResponse = (data: unknown, message: string, status: number): IResponse => ({
    data,
    message,
    status,
})

export async function getRoleSummary(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const [totalDocs, last24HoursDocs] = await Promise.all([
            Role.countDocuments({}),
            Role.countDocuments({ createdAt: { $gte: twentyFourHoursAgo } }),
        ]);

        return formatResponse(
            {
                overall: {
                    totalRecords: totalDocs,
                    recordsLast24Hours: last24HoursDocs,
                },
                monthlyTable: [], // No numeric fields to aggregate
                tableSummary: { totalMonths: 0 },
                pagination: { currentPage: 1, limit: 10, totalMonths: 0, totalPages: 0 },
            },
            'Summary fetched successfully',
            200
        );
    });
}