import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getMarketing_Leads,
    createMarketing_Lead,
    updateMarketing_Lead,
    deleteMarketing_Lead,
    getMarketing_LeadById,
    bulkUpdateMarketing_Leads,
    bulkDeleteMarketing_Leads,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Marketing_Leads
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getMarketing_LeadById(req)
        : await getMarketing_Leads(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Marketing_Lead
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createMarketing_Lead(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Marketing_Lead
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateMarketing_Leads(req)
        : await updateMarketing_Lead(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Marketing_Lead
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteMarketing_Leads(req)
        : await deleteMarketing_Lead(req);

    return formatResponse(result.data, result.message, result.status);
}