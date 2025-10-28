import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getProfiles,
    createProfile,
    updateProfile,
    deleteProfile,
    getProfileById,
    bulkUpdateProfiles,
    bulkDeleteProfiles,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Profiles
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getProfileById(req)
        : await getProfiles(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Profile
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createProfile(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Profile
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateProfiles(req)
        : await updateProfile(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Profile
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteProfiles(req)
        : await deleteProfile(req);

    return formatResponse(result.data, result.message, result.status);
}