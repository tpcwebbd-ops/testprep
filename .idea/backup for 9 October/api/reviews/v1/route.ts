import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getReviews,
    createReview,
    updateReview,
    deleteReview,
    getReviewById,
    bulkUpdateReviews,
    bulkDeleteReviews,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Reviews
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getReviewById(req)
        : await getReviews(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Review
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createReview(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Review
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateReviews(req)
        : await updateReview(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Review
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteReviews(req)
        : await deleteReview(req);

    return formatResponse(result.data, result.message, result.status);
}