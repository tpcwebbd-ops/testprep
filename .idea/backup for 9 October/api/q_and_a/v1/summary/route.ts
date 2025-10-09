import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { getQ_and_ASummary } from './controller';
import {
    formatResponse,
    //    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET Q_and_A Summary
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

    //    const tokenResponse = handleTokenVerify(req);
    //    if (tokenResponse) return tokenResponse;

    const result: IResponse = await getQ_and_ASummary(req);
    return formatResponse(result.data, result.message, result.status);
}