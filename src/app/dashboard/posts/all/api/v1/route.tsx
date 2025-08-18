import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getPosts,
    createPost,
    updatePost,
    deletePost,
    getPostById,
    bulkUpdatePosts,
    bulkDeletePosts,
} from './controller';

import {
    formatResponse,
    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Posts
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

    const tokenResponse = handleTokenVerify(req);
    if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getPostById(req)
        : await getPosts(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Post
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

    const tokenResponse = handleTokenVerify(req);
    if (tokenResponse) return tokenResponse;

    const result = await createPost(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Post
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

    const tokenResponse = handleTokenVerify(req);
    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdatePosts(req)
        : await updatePost(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Post
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

    const tokenResponse = handleTokenVerify(req);
    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeletePosts(req)
        : await deletePost(req);

    return formatResponse(result.data, result.message, result.status);
}