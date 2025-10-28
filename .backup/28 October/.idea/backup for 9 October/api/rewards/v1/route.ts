import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getRewards,
    createReward,
    updateReward,
    deleteReward,
    getRewardById,
    bulkUpdateRewards,
    bulkDeleteRewards,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Rewards
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getRewardById(req)
        : await getRewards(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Reward
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createReward(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Reward
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateRewards(req)
        : await updateReward(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Reward
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteRewards(req)
        : await deleteReward(req);

    return formatResponse(result.data, result.message, result.status);
}