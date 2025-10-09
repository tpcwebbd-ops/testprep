import { withDB } from '@/app/api/utils/db'
import { FilterQuery } from 'mongoose'

import Marketing_Lead from './model'

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

// CREATE Marketing_Lead
export async function createMarketing_Lead(req: Request): Promise<IResponse> {
    return withDB(async () => {
        try {
            const marketing_LeadData = await req.json()
            const newMarketing_Lead = await Marketing_Lead.create({
                ...marketing_LeadData,
            })
            return formatResponse(
                newMarketing_Lead,
                'Marketing_Lead created successfully',
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
            throw error // Re-throw other errors to be handled by `withDB`
        }
    })
}

// GET single Marketing_Lead by ID
export async function getMarketing_LeadById(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const id = new URL(req.url).searchParams.get('id')
        if (!id)
            return formatResponse(null, 'Marketing_Lead ID is required', 400)

        const marketing_Lead = await Marketing_Lead.findById(id)
        if (!marketing_Lead)
            return formatResponse(null, 'Marketing_Lead not found', 404)

        return formatResponse(
            marketing_Lead,
            'Marketing_Lead fetched successfully',
            200
        )
    })
}

// GET all Marketing_Leads with pagination and intelligent search
export async function getMarketing_Leads(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const url = new URL(req.url)
        const page = parseInt(url.searchParams.get('page') || '1', 10)
        const limit = parseInt(url.searchParams.get('limit') || '10', 10)
        const skip = (page - 1) * limit
        const searchQuery = url.searchParams.get('q')

        let searchFilter: FilterQuery<unknown> = {}

        if (searchQuery) {
            // Check for date range filter format first
            if (searchQuery.startsWith('createdAt:range:')) {
                const datePart = searchQuery.split(':')[2];
                const [startDateString, endDateString] = datePart.split('_');

                if (startDateString && endDateString) {
                    const startDate = new Date(startDateString);
                    const endDate = new Date(endDateString);
                    // To ensure the range is inclusive, set the time to the end of the day
                    endDate.setUTCHours(23, 59, 59, 999);

                    searchFilter = {
                        createdAt: {
                            $gte: startDate, // Greater than or equal to the start date
                            $lte: endDate,   // Less than or equal to the end date
                        },
                    };
                }
            } else {
                // Fallback to original generic search logic
                const orConditions: FilterQuery<unknown>[] = []

                // Add regex search conditions for all string-like fields
                const stringFields = ["full_name","phone_number","email","collected_by","notes"];
                stringFields.forEach(field => {
                    orConditions.push({ [field]: { $regex: searchQuery, $options: 'i' } });
                });

                // If the query is a valid number, add equality checks for all number fields
                const numericQuery = parseFloat(searchQuery);
                if (!isNaN(numericQuery)) {
                    const numberFields : string[]= [];
                    numberFields.forEach(field => {
                        orConditions.push({ [field]: numericQuery });
                    });
                }

                if (orConditions.length > 0) {
                    searchFilter = { $or: orConditions };
                }
            }
        }

        const marketing_Leads = await Marketing_Lead.find(searchFilter)
            .sort({ updatedAt: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const totalMarketing_Leads =
            await Marketing_Lead.countDocuments(searchFilter)

        return formatResponse(
            {
                marketing_Leads: marketing_Leads || [],
                total: totalMarketing_Leads,
                page,
                limit,
            },
            'Marketing_Leads fetched successfully',
            200
        )
    })
}

// UPDATE single Marketing_Lead by ID
export async function updateMarketing_Lead(req: Request): Promise<IResponse> {
    return withDB(async () => {
        try {
            const { id, ...updateData } = await req.json()
            const updatedMarketing_Lead = await Marketing_Lead.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            )

            if (!updatedMarketing_Lead)
                return formatResponse(null, 'Marketing_Lead not found', 404)
            return formatResponse(
                updatedMarketing_Lead,
                'Marketing_Lead updated successfully',
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
            throw error // Re-throw other errors to be handled by `withDB`
        }
    })
}

// BULK UPDATE Marketing_Leads
export async function bulkUpdateMarketing_Leads(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const updates: { id: string; updateData: Record<string, unknown> }[] = await req.json()
        const results = await Promise.allSettled(
            updates.map(({ id, updateData }) =>
                Marketing_Lead.findByIdAndUpdate(id, updateData, {
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

// DELETE single Marketing_Lead by ID
export async function deleteMarketing_Lead(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const { id } = await req.json()
        const deletedMarketing_Lead = await Marketing_Lead.findByIdAndDelete(id)
        if (!deletedMarketing_Lead)
            return formatResponse(
                null,
                'Marketing_Lead not found',
                404
            )
        return formatResponse(
            { deletedCount: 1 },
            'Marketing_Lead deleted successfully',
            200
        )
    })
}

// BULK DELETE Marketing_Leads
export async function bulkDeleteMarketing_Leads(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const { ids }: { ids: string[] } = await req.json()
        const deletedIds: string[] = []
        const invalidIds: string[] = []

        for (const id of ids) {
            try {
                const doc = await Marketing_Lead.findById(id)
                if (doc) {
                    const deletedDoc = await Marketing_Lead.findByIdAndDelete(id)
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
