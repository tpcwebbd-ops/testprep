import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getQ_and_A_s,
    createQ_and_A,
    updateQ_and_A,
    deleteQ_and_A,
    getQ_and_AById,
    bulkUpdateQ_and_A_s,
    bulkDeleteQ_and_A_s,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Q_and_A_s
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getQ_and_AById(req)
        : await getQ_and_A_s(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Q_and_A
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createQ_and_A(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Q_and_A
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateQ_and_A_s(req)
        : await updateQ_and_A(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Q_and_A
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteQ_and_A_s(req)
        : await deleteQ_and_A(req);

    return formatResponse(result.data, result.message, result.status);
}