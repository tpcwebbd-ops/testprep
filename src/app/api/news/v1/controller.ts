import { withDB } from '@/app/api/utils/db'
import { FilterQuery } from 'mongoose'

import News from './model'

import { formatResponse, IResponse } from '@/app/api/utils/utils';

interface AggregationResult {
    _id: {
        month: number;
        year: number;
    };
    totalAge: number;
    totalAmount: number;
}

// CREATE News
export async function createNews(req: Request): Promise<IResponse> {
    return withDB(async () => {
        try {
            const newsData = await req.json()
            const newNews = await News.create({
                ...newsData,
            })
            return formatResponse(
                newNews,
                'News created successfully',
                201
            )
        } catch (error: unknown) {
            if ((error as { code?: number }).code === 11000) {
                const err = error as { keyValue?: Record<string, unknown> }
                return formatResponse(
                    null,
                    `Duplicate key error: ${JSON.stringify(err.keyValue)}`,
                    400
                )
            }
            throw error
        }
    })
}

// GET single News by ID
export async function getNewsById(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const id = new URL(req.url).searchParams.get('id')
        if (!id)
            return formatResponse(null, 'News ID is required', 400)

        const news = await News.findById(id)
        if (!news)
            return formatResponse(null, 'News not found', 404)

        return formatResponse(
            news,
            'News fetched successfully',
            200
        )
    })
}

// GET all News with pagination and intelligent search
export async function getNews(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const url = new URL(req.url)
        const page = parseInt(url.searchParams.get('page') || '1', 10)
        const limit = parseInt(url.searchParams.get('limit') || '10', 10)
        const skip = (page - 1) * limit
        const searchQuery = url.searchParams.get('q')

        let searchFilter: FilterQuery<unknown> = {}

        if (searchQuery) {
            if (searchQuery.startsWith('createdAt:range:')) {
                const datePart = searchQuery.split(':')[2];
                const [startDateString, endDateString] = datePart.split('_');

                if (startDateString && endDateString) {
                    const startDate = new Date(startDateString);
                    const endDate = new Date(endDateString);
                    endDate.setUTCHours(23, 59, 59, 999);

                    searchFilter = {
                        createdAt: {
                            $gte: startDate,
                            $lte: endDate,
                        },
                    };
                }
            } else {
                const orConditions: FilterQuery<unknown>[] = []

                const stringFields = ["title","email","description","number","profile","test","complexValue.id","complexValue.title","complexValue.parent.id","complexValue.parent.title","complexValue.parent.child.id","complexValue.parent.child.title","complexValue.parent.child.child","complexValue.parent.child.note","complexValue.parent.note","complexValue.note"];
                stringFields.forEach(field => {
                    orConditions.push({ [field]: { $regex: searchQuery, $options: 'i' } });
                });

                const numericQuery = parseFloat(searchQuery);
                if (!isNaN(numericQuery)) {
                    const numberFields : string[]= ["age","amount"];
                    numberFields.forEach(field => {
                        orConditions.push({ [field]: numericQuery });
                    });
                }

                if (orConditions.length > 0) {
                    searchFilter = { $or: orConditions };
                }
            }
        }

        const news = await News.find(searchFilter)
            .sort({ updatedAt: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const totalNews =
            await News.countDocuments(searchFilter)

        return formatResponse(
            {
                news: news || [],
                total: totalNews,
                page,
                limit,
            },
            'News fetched successfully',
            200
        )
    })
}

// GET News summary
export async function getNewsSummary(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const limit = parseInt(url.searchParams.get('limit') || '10', 10);

        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const [totalDocs, last24HoursDocs, monthlyStatsRaw] = await Promise.all([
            News.countDocuments({}),
            News.countDocuments({ createdAt: { $gte: twentyFourHoursAgo } }),
            News.aggregate<AggregationResult>([
                {
                    $group: {
                        _id: {
                            month: { $month: '$createdAt' },
                            year: { $year: '$createdAt' },
                        },
                        totalAge: { $sum: '$age' },
                        totalAmount: { $sum: '$amount' },
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
                totalAge: stat.totalAge || 0,
                totalAmount: stat.totalAmount || 0,
            };
        });

        const tableSummary = fullMonthlyTable.reduce(
            (acc, curr) => {
                acc.totalMonths += 1;
                acc.grandTotalAge += curr.totalAge;
                acc.grandTotalAmount += curr.totalAmount;
                return acc;
            },
            { totalMonths: 0, grandTotalAge: 0, grandTotalAmount: 0, }
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

// UPDATE single News by ID
export async function updateNews(req: Request): Promise<IResponse> {
    return withDB(async () => {
        try {
            const { id, ...updateData } = await req.json()
            const updatedNews = await News.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            )

            if (!updatedNews)
                return formatResponse(null, 'News not found', 404)
            return formatResponse(
                updatedNews,
                'News updated successfully',
                200
            )
        } catch (error: unknown) {
            if ((error as { code?: number }).code === 11000) {
                const err = error as { keyValue?: Record<string, unknown> }
                return formatResponse(
                    null,
                    `Duplicate key error: ${JSON.stringify(err.keyValue)}`,
                    400
                )
            }
            throw error
        }
    })
}

// BULK UPDATE News
export async function bulkUpdateNews(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const updates: { id: string; updateData: Record<string, unknown> }[] = await req.json()
        const results = await Promise.allSettled(
            updates.map(({ id, updateData }) =>
                News.findByIdAndUpdate(id, updateData, {
                    new: true,
                    runValidators: true,
                })
            )
        )

        const successfulUpdates = results
            .filter((r): r is PromiseFulfilledResult<unknown> => r.status === 'fulfilled' && r.value)
            .map((r) => r.value)
            
        const failedUpdates = results
            .map((r, i) => (r.status === 'rejected' || !('value' in r && r.value) ? updates[i].id : null))
            .filter((id): id is string => id !== null)

        return formatResponse(
            { updated: successfulUpdates, failed: failedUpdates },
            'Bulk update completed',
            200
        )
    })
}

// DELETE single News by ID
export async function deleteNews(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const { id } = await req.json()
        const deletedNews = await News.findByIdAndDelete(id)
        if (!deletedNews)
            return formatResponse(
                null,
                'News not found',
                404
            )
        return formatResponse(
            { deletedCount: 1 },
            'News deleted successfully',
            200
        )
    })
}

// BULK DELETE News
export async function bulkDeleteNews(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const { ids }: { ids: string[] } = await req.json()
        const deletedIds: string[] = []
        const invalidIds: string[] = []

        for (const id of ids) {
            try {
                const doc = await News.findById(id)
                if (doc) {
                    const deletedDoc = await News.findByIdAndDelete(id)
                    if (deletedDoc) {
                        deletedIds.push(id)
                    }
                } else {
                    invalidIds.push(id)
                }
            } catch {
                invalidIds.push(id)
            }
        }

        return formatResponse(
            { deleted: deletedIds.length, deletedIds, invalidIds },
            'Bulk delete operation completed',
            200
        )
    })
}
