import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getAccessManagements,
    createAccessManagement,
    updateAccessManagement,
    deleteAccessManagement,
    getAccessManagementById,
    bulkUpdateAccessManagements,
    bulkDeleteAccessManagements,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all AccessManagements
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getAccessManagementById(req)
        : await getAccessManagements(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE AccessManagement
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createAccessManagement(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE AccessManagement
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateAccessManagements(req)
        : await updateAccessManagement(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE AccessManagement
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteAccessManagements(req)
        : await deleteAccessManagement(req);

    return formatResponse(result.data, result.message, result.status);
}