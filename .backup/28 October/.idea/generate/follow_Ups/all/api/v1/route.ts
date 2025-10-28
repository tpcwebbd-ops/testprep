import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getFollow_Ups,
    createFollow_Up,
    updateFollow_Up,
    deleteFollow_Up,
    getFollow_UpById,
    bulkUpdateFollow_Ups,
    bulkDeleteFollow_Ups,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Follow_Ups
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getFollow_UpById(req)
        : await getFollow_Ups(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Follow_Up
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createFollow_Up(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Follow_Up
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateFollow_Ups(req)
        : await updateFollow_Up(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Follow_Up
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteFollow_Ups(req)
        : await deleteFollow_Up(req);

    return formatResponse(result.data, result.message, result.status);
}