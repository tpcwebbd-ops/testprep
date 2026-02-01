import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getVerifications,
    createVerification,
    updateVerification,
    deleteVerification,
    getVerificationById,
    bulkUpdateVerifications,
    bulkDeleteVerifications,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Verifications
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getVerificationById(req)
        : await getVerifications(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Verification
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createVerification(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Verification
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateVerifications(req)
        : await updateVerification(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Verification
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteVerifications(req)
        : await deleteVerification(req);

    return formatResponse(result.data, result.message, result.status);
}