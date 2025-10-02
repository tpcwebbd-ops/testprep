import { withDB } from '@/app/api/utils/db'
import { FilterQuery } from 'mongoose'

import Employee_Task from './model'

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

// CREATE Employee_Task
export async function createEmployee_Task(req: Request): Promise<IResponse> {
    return withDB(async () => {
        try {
            const employee_TaskData = await req.json()
            const newEmployee_Task = await Employee_Task.create({
                ...employee_TaskData,
            })
            return formatResponse(
                newEmployee_Task,
                'Employee_Task created successfully',
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

// GET single Employee_Task by ID
export async function getEmployee_TaskById(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const id = new URL(req.url).searchParams.get('id')
        if (!id)
            return formatResponse(null, 'Employee_Task ID is required', 400)

        const employee_Task = await Employee_Task.findById(id)
        if (!employee_Task)
            return formatResponse(null, 'Employee_Task not found', 404)

        return formatResponse(
            employee_Task,
            'Employee_Task fetched successfully',
            200
        )
    })
}

// GET all Employee_Tasks with pagination and intelligent search
export async function getEmployee_Tasks(req: Request): Promise<IResponse> {
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
                const stringFields = ["title","description","assigned_to_id","assigned_by_id","checked_by_id"];
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

        const employee_Tasks = await Employee_Task.find(searchFilter)
            .sort({ updatedAt: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const totalEmployee_Tasks =
            await Employee_Task.countDocuments(searchFilter)

        return formatResponse(
            {
                employee_Tasks: employee_Tasks || [],
                total: totalEmployee_Tasks,
                page,
                limit,
            },
            'Employee_Tasks fetched successfully',
            200
        )
    })
}

// UPDATE single Employee_Task by ID
export async function updateEmployee_Task(req: Request): Promise<IResponse> {
    return withDB(async () => {
        try {
            const { id, ...updateData } = await req.json()
            const updatedEmployee_Task = await Employee_Task.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            )

            if (!updatedEmployee_Task)
                return formatResponse(null, 'Employee_Task not found', 404)
            return formatResponse(
                updatedEmployee_Task,
                'Employee_Task updated successfully',
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

// BULK UPDATE Employee_Tasks
export async function bulkUpdateEmployee_Tasks(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const updates: { id: string; updateData: Record<string, unknown> }[] = await req.json()
        const results = await Promise.allSettled(
            updates.map(({ id, updateData }) =>
                Employee_Task.findByIdAndUpdate(id, updateData, {
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

// DELETE single Employee_Task by ID
export async function deleteEmployee_Task(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const { id } = await req.json()
        const deletedEmployee_Task = await Employee_Task.findByIdAndDelete(id)
        if (!deletedEmployee_Task)
            return formatResponse(
                null,
                'Employee_Task not found',
                404
            )
        return formatResponse(
            { deletedCount: 1 },
            'Employee_Task deleted successfully',
            200
        )
    })
}

// BULK DELETE Employee_Tasks
export async function bulkDeleteEmployee_Tasks(req: Request): Promise<IResponse> {
    return withDB(async () => {
        const { ids }: { ids: string[] } = await req.json()
        const deletedIds: string[] = []
        const invalidIds: string[] = []

        for (const id of ids) {
            try {
                const doc = await Employee_Task.findById(id)
                if (doc) {
                    const deletedDoc = await Employee_Task.findByIdAndDelete(id)
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
