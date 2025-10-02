import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getSubmissions,
    createSubmission,
    updateSubmission,
    deleteSubmission,
    getSubmissionById,
    bulkUpdateSubmissions,
    bulkDeleteSubmissions,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Submissions
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getSubmissionById(req)
        : await getSubmissions(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Submission
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createSubmission(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Submission
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateSubmissions(req)
        : await updateSubmission(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Submission
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteSubmissions(req)
        : await deleteSubmission(req);

    return formatResponse(result.data, result.message, result.status);
}