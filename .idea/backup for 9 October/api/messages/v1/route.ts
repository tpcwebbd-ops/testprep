import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getMessages,
    createMessage,
    updateMessage,
    deleteMessage,
    getMessageById,
    bulkUpdateMessages,
    bulkDeleteMessages,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Messages
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getMessageById(req)
        : await getMessages(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Message
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createMessage(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Message
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateMessages(req)
        : await updateMessage(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Message
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteMessages(req)
        : await deleteMessage(req);

    return formatResponse(result.data, result.message, result.status);
}