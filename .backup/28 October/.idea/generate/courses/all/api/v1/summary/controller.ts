import { withDB } from '@/app/api/utils/db';
import Course from '../model';

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

interface AggregationResult {
    _id: {
        month: number;
        year: number;
    };
    totalDuration_months: number;
    totalTotal_lectures: number;
}

export async function getCourseSummary(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const limit = parseInt(url.searchParams.get('limit') || '10', 10);

        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const [totalDocs, last24HoursDocs, monthlyStatsRaw] = await Promise.all([
            Course.countDocuments({}),
            Course.countDocuments({ createdAt: { $gte: twentyFourHoursAgo } }),
            Course.aggregate<AggregationResult>([
                {
                    $group: {
                        _id: {
                            month: { $month: '$createdAt' },
                            year: { $year: '$createdAt' },
                        },
                        totalDuration_months: { $sum: '$duration_months' },
                        totalTotal_lectures: { $sum: '$total_lectures' },
                    },
                },
                {
                    $sort: { '_id.year': -1, '_id.month': -1 },
                },
            ]),
        ]);

        const fullMonthlyTable = monthlyStatsRaw.map((stat) => {
            const date = new Date();
            date.setMonth(stat._id.month - 1);
            const monthName = date.toLocaleString('default', { month: 'long' });

            return {
                month: `${monthName} ${stat._id.year}`,
                totalDuration_months: stat.totalDuration_months || 0,
                totalTotal_lectures: stat.totalTotal_lectures || 0,
            };
        });

        const tableSummary = fullMonthlyTable.reduce(
            (acc, curr) => {
                acc.totalMonths += 1;
            acc.grandTotalDuration_months += curr.totalDuration_months;
            acc.grandTotalTotal_lectures += curr.totalTotal_lectures;
                return acc;
            },
            { totalMonths: 0, grandTotalDuration_months: 0, grandTotalTotal_lectures: 0, }
        );

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedMonthlyTable = fullMonthlyTable.slice(startIndex, endIndex);

        return formatResponse(
            {
                overall: {
                    totalRecords: totalDocs,
                    recordsLast24Hours: last24HoursDocs,
                },
                monthlyTable: paginatedMonthlyTable,
                tableSummary,
                pagination: {
                    currentPage: page,
                    limit,
                    totalMonths: fullMonthlyTable.length,
                    totalPages: Math.ceil(fullMonthlyTable.length / limit),
                },
            },
            'Summary fetched successfully',
            200
        );
    });
}