import { withDB } from '@/app/api/utils/db'
import { FilterQuery } from 'mongoose'

import Account from './model'

import { formatResponse, IResponse } from '@/app/api/utils/utils';

// CREATE Account
export async function createAccount(req: Request): Promise<IResponse> {
    return withDB(async () => {
        try {
            const accountData = await req.json()
            const newAccount = await Account.create({
                ...accountData,
            })
            return formatResponse(
                newAccount,
                'Account created successfully',
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

// GET single Account by ID
export async function getAccountById(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const id = new URL(req.url).searchParams.get('id')
        if (!id)
            return formatResponse(null, 'Account ID is required', 400)

        const account = await Account.findById(id)
        if (!account)
            return formatResponse(null, 'Account not found', 404)

        return formatResponse(
            account,
            'Account fetched successfully',
            200
        )
    })
}

// GET all Accounts with pagination and intelligent search
export async function getAccounts(req: Request): Promise<IResponse> {
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
                const stringFields = ["accountId","providerId","userId","accessToken","idToken","scope"];
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

        const accounts = await Account.find(searchFilter)
            .sort({ updatedAt: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const totalAccounts =
            await Account.countDocuments(searchFilter)

        return formatResponse(
            {
                accounts: accounts || [],
                total: totalAccounts,
                page,
                limit,
            },
            'Accounts fetched successfully',
            200
        )
    })
}

// UPDATE single Account by ID
export async function updateAccount(req: Request): Promise<IResponse> {
    return withDB(async () => {
        try {
            const { id, ...updateData } = await req.json()
            const updatedAccount = await Account.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            )

            if (!updatedAccount)
                return formatResponse(null, 'Account not found', 404)
            return formatResponse(
                updatedAccount,
                'Account updated successfully',
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

// BULK UPDATE Accounts
export async function bulkUpdateAccounts(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const updates: { id: string; updateData: Record<string, unknown> }[] = await req.json()
        const results = await Promise.allSettled(
            updates.map(({ id, updateData }) =>
                Account.findByIdAndUpdate(id, updateData, {
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

// DELETE single Account by ID
export async function deleteAccount(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const { id } = await req.json()
        const deletedAccount = await Account.findByIdAndDelete(id)
        if (!deletedAccount)
            return formatResponse(
                null,
                'Account not found',
                404
            )
        return formatResponse(
            { deletedCount: 1 },
            'Account deleted successfully',
            200
        )
    })
}

// BULK DELETE Accounts
export async function bulkDeleteAccounts(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const { ids }: { ids: string[] } = await req.json()
        const deletedIds: string[] = []
        const invalidIds: string[] = []

        for (const id of ids) {
            try {
                const doc = await Account.findById(id)
                if (doc) {
                    const deletedDoc = await Account.findByIdAndDelete(id)
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
