import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getContent_Resources,
    createContent_Resourc,
    updateContent_Resourc,
    deleteContent_Resourc,
    getContent_ResourcById,
    bulkUpdateContent_Resources,
    bulkDeleteContent_Resources,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Content_Resources
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getContent_ResourcById(req)
        : await getContent_Resources(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Content_Resourc
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createContent_Resourc(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Content_Resourc
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateContent_Resources(req)
        : await updateContent_Resourc(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Content_Resourc
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteContent_Resources(req)
        : await deleteContent_Resourc(req);

    return formatResponse(result.data, result.message, result.status);
}