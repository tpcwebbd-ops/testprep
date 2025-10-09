import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getMedia_s,
    createMedia,
    updateMedia,
    deleteMedia,
    getMediaById,
    bulkUpdateMedia_s,
    bulkDeleteMedia_s,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Media_s
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getMediaById(req)
        : await getMedia_s(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Media
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createMedia(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Media
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateMedia_s(req)
        : await updateMedia(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Media
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteMedia_s(req)
        : await deleteMedia(req);

    return formatResponse(result.data, result.message, result.status);
}