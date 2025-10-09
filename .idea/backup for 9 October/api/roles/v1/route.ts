import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getRoles,
    createRole,
    updateRole,
    deleteRole,
    getRoleById,
    bulkUpdateRoles,
    bulkDeleteRoles,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Roles
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getRoleById(req)
        : await getRoles(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Role
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createRole(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Role
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateRoles(req)
        : await updateRole(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Role
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteRoles(req)
        : await deleteRole(req);

    return formatResponse(result.data, result.message, result.status);
}