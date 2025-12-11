import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getSidebars,
    createSidebar,
    updateSidebar,
    deleteSidebar,
    getSidebarById,
    bulkUpdateSidebars,
    bulkDeleteSidebars,
} from './controller';

import {
    formatResponse,
    IResponse,
} from '@/app/api/utils/jwt-verify';

export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getSidebarById(req)
        : await getSidebars(req);
    return formatResponse(result.data, result.message, result.status);
}

export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

    const result = await createSidebar(req);
    return formatResponse(result.data, result.message, result.status);
}

export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateSidebars(req)
        : await updateSidebar(req);

    return formatResponse(result.data, result.message, result.status);
}

export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteSidebars(req)
        : await deleteSidebar(req);

    return formatResponse(result.data, result.message, result.status);
}