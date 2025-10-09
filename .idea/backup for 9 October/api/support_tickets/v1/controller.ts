import { withDB } from '@/app/api/utils/db'
import { FilterQuery } from 'mongoose'

import Support_Ticket from './model'

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

// CREATE Support_Ticket
export async function createSupport_Ticket(req: Request): Promise<IResponse> {
    return withDB(async () => {
        try {
            const support_TicketData = await req.json()
            const newSupport_Ticket = await Support_Ticket.create({
                ...support_TicketData,
            })
            return formatResponse(
                newSupport_Ticket,
                'Support_Ticket created successfully',
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

// GET single Support_Ticket by ID
export async function getSupport_TicketById(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const id = new URL(req.url).searchParams.get('id')
        if (!id)
            return formatResponse(null, 'Support_Ticket ID is required', 400)

        const support_Ticket = await Support_Ticket.findById(id)
        if (!support_Ticket)
            return formatResponse(null, 'Support_Ticket not found', 404)

        return formatResponse(
            support_Ticket,
            'Support_Ticket fetched successfully',
            200
        )
    })
}

// GET all Support_Tickets with pagination and intelligent search
export async function getSupport_Tickets(req: Request): Promise<IResponse> {
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
                const stringFields = ["student_id","assigned_to_id ","title","description"];
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

        const support_Tickets = await Support_Ticket.find(searchFilter)
            .sort({ updatedAt: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const totalSupport_Tickets =
            await Support_Ticket.countDocuments(searchFilter)

        return formatResponse(
            {
                support_Tickets: support_Tickets || [],
                total: totalSupport_Tickets,
                page,
                limit,
            },
            'Support_Tickets fetched successfully',
            200
        )
    })
}

// UPDATE single Support_Ticket by ID
export async function updateSupport_Ticket(req: Request): Promise<IResponse> {
    return withDB(async () => {
        try {
            const { id, ...updateData } = await req.json()
            const updatedSupport_Ticket = await Support_Ticket.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            )

            if (!updatedSupport_Ticket)
                return formatResponse(null, 'Support_Ticket not found', 404)
            return formatResponse(
                updatedSupport_Ticket,
                'Support_Ticket updated successfully',
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

// BULK UPDATE Support_Tickets
export async function bulkUpdateSupport_Tickets(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const updates: { id: string; updateData: Record<string, unknown> }[] = await req.json()
        const results = await Promise.allSettled(
            updates.map(({ id, updateData }) =>
                Support_Ticket.findByIdAndUpdate(id, updateData, {
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

// DELETE single Support_Ticket by ID
export async function deleteSupport_Ticket(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const { id } = await req.json()
        const deletedSupport_Ticket = await Support_Ticket.findByIdAndDelete(id)
        if (!deletedSupport_Ticket)
            return formatResponse(
                null,
                'Support_Ticket not found',
                404
            )
        return formatResponse(
            { deletedCount: 1 },
            'Support_Ticket deleted successfully',
            200
        )
    })
}

// BULK DELETE Support_Tickets
export async function bulkDeleteSupport_Tickets(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const { ids }: { ids: string[] } = await req.json()
        const deletedIds: string[] = []
        const invalidIds: string[] = []

        for (const id of ids) {
            try {
                const doc = await Support_Ticket.findById(id)
                if (doc) {
                    const deletedDoc = await Support_Ticket.findByIdAndDelete(id)
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
