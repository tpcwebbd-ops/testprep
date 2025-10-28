import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getWebsite_Settings,
    createWebsite_Setting,
    updateWebsite_Setting,
    deleteWebsite_Setting,
    getWebsite_SettingById,
    bulkUpdateWebsite_Settings,
    bulkDeleteWebsite_Settings,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Website_Settings
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getWebsite_SettingById(req)
        : await getWebsite_Settings(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Website_Setting
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createWebsite_Setting(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Website_Setting
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateWebsite_Settings(req)
        : await updateWebsite_Setting(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Website_Setting
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteWebsite_Settings(req)
        : await deleteWebsite_Setting(req);

    return formatResponse(result.data, result.message, result.status);
}