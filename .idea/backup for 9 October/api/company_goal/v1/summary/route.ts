import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { getCompany_GoalSummary } from './controller';
import {
    formatResponse,
    //    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET Company_Goal Summary
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

    //    const tokenResponse = handleTokenVerify(req);
    //    if (tokenResponse) return tokenResponse;

    const result: IResponse = await getCompany_GoalSummary(req);
    return formatResponse(result.data, result.message, result.status);
}