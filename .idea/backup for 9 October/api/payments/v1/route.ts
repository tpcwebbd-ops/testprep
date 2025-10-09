import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getPayments,
    createPayment,
    updatePayment,
    deletePayment,
    getPaymentById,
    bulkUpdatePayments,
    bulkDeletePayments,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Payments
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getPaymentById(req)
        : await getPayments(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Payment
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createPayment(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Payment
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdatePayments(req)
        : await updatePayment(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Payment
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeletePayments(req)
        : await deletePayment(req);

    return formatResponse(result.data, result.message, result.status);
}