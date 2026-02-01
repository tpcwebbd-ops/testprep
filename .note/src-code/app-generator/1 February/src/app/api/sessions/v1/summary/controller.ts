import { withDB } from '@/app/api/utils/db';
import Session from '../model';

import { formatResponse, IResponse } from '@/app/api/utils/utils';
import { logger } from 'better-auth';

export async function getSessionSummary(req: Request): Promise<IResponse> {
    logger.info(JSON.stringify(req))
    return withDB(async () => {
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const [totalDocs, last24HoursDocs] = await Promise.all([
            Session.countDocuments({}),
            Session.countDocuments({ createdAt: { $gte: twentyFourHoursAgo } }),
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