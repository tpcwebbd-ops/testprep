import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getCompany_Goals,
    createCompany_Goal,
    updateCompany_Goal,
    deleteCompany_Goal,
    getCompany_GoalById,
    bulkUpdateCompany_Goals,
    bulkDeleteCompany_Goals,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Company_Goals
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getCompany_GoalById(req)
        : await getCompany_Goals(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Company_Goal
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createCompany_Goal(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Company_Goal
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateCompany_Goals(req)
        : await updateCompany_Goal(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Company_Goal
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteCompany_Goals(req)
        : await deleteCompany_Goal(req);

    return formatResponse(result.data, result.message, result.status);
}