import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { getMediaSummary } from './controller';
import {
    formatResponse,
    //    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET Media Summary
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

    //    const tokenResponse = handleTokenVerify(req);
    //    if (tokenResponse) return tokenResponse;

    const result: IResponse = await getMediaSummary(req);
    return formatResponse(result.data, result.message, result.status);
}