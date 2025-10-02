import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getAssessments,
    createAssessment,
    updateAssessment,
    deleteAssessment,
    getAssessmentById,
    bulkUpdateAssessments,
    bulkDeleteAssessments,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Assessments
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getAssessmentById(req)
        : await getAssessments(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Assessment
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createAssessment(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Assessment
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateAssessments(req)
        : await updateAssessment(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Assessment
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteAssessments(req)
        : await deleteAssessment(req);

    return formatResponse(result.data, result.message, result.status);
}