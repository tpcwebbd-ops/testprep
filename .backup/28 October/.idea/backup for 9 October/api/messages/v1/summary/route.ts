import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { getMessageSummary } from './controller';
import {
    formatResponse,
    //    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET Message Summary
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

    //    const tokenResponse = handleTokenVerify(req);
    //    if (tokenResponse) return tokenResponse;

    const result: IResponse = await getMessageSummary(req);
    return formatResponse(result.data, result.message, result.status);
}