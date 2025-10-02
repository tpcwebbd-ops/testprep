import { withDB } from '@/app/api/utils/db';
import Review from '../model';

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
    totalRating: number;
}

export async function getReviewSummary(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const limit = parseInt(url.searchParams.get('limit') || '10', 10);

        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const [totalDocs, last24HoursDocs, monthlyStatsRaw] = await Promise.all([
            Review.countDocuments({}),
            Review.countDocuments({ createdAt: { $gte: twentyFourHoursAgo } }),
            Review.aggregate<AggregationResult>([
                {
                    $group: {
                        _id: {
                            month: { $month: '$createdAt' },
                            year: { $year: '$createdAt' },
                        },
                        totalRating: { $sum: '$rating' },
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
                totalRating: stat.totalRating || 0,
            };
        });

        const tableSummary = fullMonthlyTable.reduce(
            (acc, curr) => {
                acc.totalMonths += 1;
            acc.grandTotalRating += curr.totalRating;
                return acc;
            },
            { totalMonths: 0, grandTotalRating: 0, }
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