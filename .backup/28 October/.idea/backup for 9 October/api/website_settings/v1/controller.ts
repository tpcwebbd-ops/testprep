import { withDB } from '@/app/api/utils/db'
import { FilterQuery } from 'mongoose'

import Website_Setting from './model'

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

// CREATE Website_Setting
export async function createWebsite_Setting(req: Request): Promise<IResponse> {
    return withDB(async () => {
        try {
            const website_SettingData = await req.json()
            const newWebsite_Setting = await Website_Setting.create({
                ...website_SettingData,
            })
            return formatResponse(
                newWebsite_Setting,
                'Website_Setting created successfully',
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

// GET single Website_Setting by ID
export async function getWebsite_SettingById(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const id = new URL(req.url).searchParams.get('id')
        if (!id)
            return formatResponse(null, 'Website_Setting ID is required', 400)

        const website_Setting = await Website_Setting.findById(id)
        if (!website_Setting)
            return formatResponse(null, 'Website_Setting not found', 404)

        return formatResponse(
            website_Setting,
            'Website_Setting fetched successfully',
            200
        )
    })
}

// GET all Website_Settings with pagination and intelligent search
export async function getWebsite_Settings(req: Request): Promise<IResponse> {
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
                const stringFields = ["Name","logourl","description","short description","mobileNumber","address","menu","footer"];
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

        const website_Settings = await Website_Setting.find(searchFilter)
            .sort({ updatedAt: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const totalWebsite_Settings =
            await Website_Setting.countDocuments(searchFilter)

        return formatResponse(
            {
                website_Settings: website_Settings || [],
                total: totalWebsite_Settings,
                page,
                limit,
            },
            'Website_Settings fetched successfully',
            200
        )
    })
}

// UPDATE single Website_Setting by ID
export async function updateWebsite_Setting(req: Request): Promise<IResponse> {
    return withDB(async () => {
        try {
            const { id, ...updateData } = await req.json()
            const updatedWebsite_Setting = await Website_Setting.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            )

            if (!updatedWebsite_Setting)
                return formatResponse(null, 'Website_Setting not found', 404)
            return formatResponse(
                updatedWebsite_Setting,
                'Website_Setting updated successfully',
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

// BULK UPDATE Website_Settings
export async function bulkUpdateWebsite_Settings(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const updates: { id: string; updateData: Record<string, unknown> }[] = await req.json()
        const results = await Promise.allSettled(
            updates.map(({ id, updateData }) =>
                Website_Setting.findByIdAndUpdate(id, updateData, {
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

// DELETE single Website_Setting by ID
export async function deleteWebsite_Setting(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const { id } = await req.json()
        const deletedWebsite_Setting = await Website_Setting.findByIdAndDelete(id)
        if (!deletedWebsite_Setting)
            return formatResponse(
                null,
                'Website_Setting not found',
                404
            )
        return formatResponse(
            { deletedCount: 1 },
            'Website_Setting deleted successfully',
            200
        )
    })
}

// BULK DELETE Website_Settings
export async function bulkDeleteWebsite_Settings(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const { ids }: { ids: string[] } = await req.json()
        const deletedIds: string[] = []
        const invalidIds: string[] = []

        for (const id of ids) {
            try {
                const doc = await Website_Setting.findById(id)
                if (doc) {
                    const deletedDoc = await Website_Setting.findByIdAndDelete(id)
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
