import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { getWebsite_SettingSummary } from './controller';
import {
    formatResponse,
    //    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET Website_Setting Summary
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

    //    const tokenResponse = handleTokenVerify(req);
    //    if (tokenResponse) return tokenResponse;

    const result: IResponse = await getWebsite_SettingSummary(req);
    return formatResponse(result.data, result.message, result.status);
}