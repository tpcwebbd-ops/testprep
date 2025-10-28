import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getRoles_Management_s,
    createRoles_Management,
    updateRoles_Management,
    deleteRoles_Management,
    getRoles_ManagementById,
    bulkUpdateRoles_Management_s,
    bulkDeleteRoles_Management_s,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Roles_Management_s
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getRoles_ManagementById(req)
        : await getRoles_Management_s(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Roles_Management
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createRoles_Management(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Roles_Management
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateRoles_Management_s(req)
        : await updateRoles_Management(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Roles_Management
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteRoles_Management_s(req)
        : await deleteRoles_Management(req);

    return formatResponse(result.data, result.message, result.status);
}