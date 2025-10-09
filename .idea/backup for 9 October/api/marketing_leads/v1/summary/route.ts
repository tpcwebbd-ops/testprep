import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { getMarketing_LeadSummary } from './controller';
import {
    formatResponse,
    //    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET Marketing_Lead Summary
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

    //    const tokenResponse = handleTokenVerify(req);
    //    if (tokenResponse) return tokenResponse;

    const result: IResponse = await getMarketing_LeadSummary(req);
    return formatResponse(result.data, result.message, result.status);
}