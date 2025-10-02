import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getPosts_n,
    createPost_n,
    updatePost_n,
    deletePost_n,
    getPost_nById,
    bulkUpdatePosts_n,
    bulkDeletePosts_n,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Posts_n
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getPost_nById(req)
        : await getPosts_n(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Post_n
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createPost_n(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Post_n
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdatePosts_n(req)
        : await updatePost_n(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Post_n
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeletePosts_n(req)
        : await deletePost_n(req);

    return formatResponse(result.data, result.message, result.status);
}