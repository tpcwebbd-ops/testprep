import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getLectures,
    createLecture,
    updateLecture,
    deleteLecture,
    getLectureById,
    bulkUpdateLectures,
    bulkDeleteLectures,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Lectures
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getLectureById(req)
        : await getLectures(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Lecture
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createLecture(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Lecture
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateLectures(req)
        : await updateLecture(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Lecture
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteLectures(req)
        : await deleteLecture(req);

    return formatResponse(result.data, result.message, result.status);
}