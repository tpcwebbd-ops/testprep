import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { getFollow_UpSummary } from './controller';
import {
    formatResponse,
    //    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET Follow_Up Summary
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

    //    const tokenResponse = handleTokenVerify(req);
    //    if (tokenResponse) return tokenResponse;

    const result: IResponse = await getFollow_UpSummary(req);
    return formatResponse(result.data, result.message, result.status);
}