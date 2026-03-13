import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getSessions,
    createSession,
    updateSession,
    deleteSession,
    getSessionById,
    bulkUpdateSessions,
    bulkDeleteSessions,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Sessions
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getSessionById(req)
        : await getSessions(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Session
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createSession(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Session
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateSessions(req)
        : await updateSession(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Session
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteSessions(req)
        : await deleteSession(req);

    return formatResponse(result.data, result.message, result.status);
}