import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { getContent_ResourcSummary } from './controller';
import {
    formatResponse,
    //    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET Content_Resourc Summary
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

    //    const tokenResponse = handleTokenVerify(req);
    //    if (tokenResponse) return tokenResponse;

    const result: IResponse = await getContent_ResourcSummary(req);
    return formatResponse(result.data, result.message, result.status);
}