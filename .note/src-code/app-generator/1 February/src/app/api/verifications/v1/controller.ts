import { withDB } from '@/app/api/utils/db'
import { FilterQuery } from 'mongoose'

import Verification from './model'

import { formatResponse, IResponse } from '@/app/api/utils/utils';

// CREATE Verification
export async function createVerification(req: Request): Promise<IResponse> {
    return withDB(async () => {
        try {
            const verificationData = await req.json()
            const newVerification = await Verification.create({
                ...verificationData,
            })
            return formatResponse(
                newVerification,
                'Verification created successfully',
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

// GET single Verification by ID
export async function getVerificationById(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const id = new URL(req.url).searchParams.get('id')
        if (!id)
            return formatResponse(null, 'Verification ID is required', 400)

        const verification = await Verification.findById(id)
        if (!verification)
            return formatResponse(null, 'Verification not found', 404)

        return formatResponse(
            verification,
            'Verification fetched successfully',
            200
        )
    })
}

// GET all Verifications with pagination and intelligent search
export async function getVerifications(req: Request): Promise<IResponse> {
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
                const stringFields = ["identifier ","value "];
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

        const verifications = await Verification.find(searchFilter)
            .sort({ updatedAt: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const totalVerifications =
            await Verification.countDocuments(searchFilter)

        return formatResponse(
            {
                verifications: verifications || [],
                total: totalVerifications,
                page,
                limit,
            },
            'Verifications fetched successfully',
            200
        )
    })
}

// UPDATE single Verification by ID
export async function updateVerification(req: Request): Promise<IResponse> {
    return withDB(async () => {
        try {
            const { id, ...updateData } = await req.json()
            const updatedVerification = await Verification.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            )

            if (!updatedVerification)
                return formatResponse(null, 'Verification not found', 404)
            return formatResponse(
                updatedVerification,
                'Verification updated successfully',
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

// BULK UPDATE Verifications
export async function bulkUpdateVerifications(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const updates: { id: string; updateData: Record<string, unknown> }[] = await req.json()
        const results = await Promise.allSettled(
            updates.map(({ id, updateData }) =>
                Verification.findByIdAndUpdate(id, updateData, {
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

// DELETE single Verification by ID
export async function deleteVerification(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const { id } = await req.json()
        const deletedVerification = await Verification.findByIdAndDelete(id)
        if (!deletedVerification)
            return formatResponse(
                null,
                'Verification not found',
                404
            )
        return formatResponse(
            { deletedCount: 1 },
            'Verification deleted successfully',
            200
        )
    })
}

// BULK DELETE Verifications
export async function bulkDeleteVerifications(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const { ids }: { ids: string[] } = await req.json()
        const deletedIds: string[] = []
        const invalidIds: string[] = []

        for (const id of ids) {
            try {
                const doc = await Verification.findById(id)
                if (doc) {
                    const deletedDoc = await Verification.findByIdAndDelete(id)
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
