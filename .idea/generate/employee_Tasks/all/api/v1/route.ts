import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getEmployee_Tasks,
    createEmployee_Task,
    updateEmployee_Task,
    deleteEmployee_Task,
    getEmployee_TaskById,
    bulkUpdateEmployee_Tasks,
    bulkDeleteEmployee_Tasks,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Employee_Tasks
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getEmployee_TaskById(req)
        : await getEmployee_Tasks(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Employee_Task
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createEmployee_Task(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Employee_Task
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateEmployee_Tasks(req)
        : await updateEmployee_Task(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Employee_Task
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteEmployee_Tasks(req)
        : await deleteEmployee_Task(req);

    return formatResponse(result.data, result.message, result.status);
}