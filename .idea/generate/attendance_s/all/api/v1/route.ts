import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getAttendance_s,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    getAttendanceById,
    bulkUpdateAttendance_s,
    bulkDeleteAttendance_s,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Attendance_s
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getAttendanceById(req)
        : await getAttendance_s(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Attendance
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createAttendance(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Attendance
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateAttendance_s(req)
        : await updateAttendance(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Attendance
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteAttendance_s(req)
        : await deleteAttendance(req);

    return formatResponse(result.data, result.message, result.status);
}