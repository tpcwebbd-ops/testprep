import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    getAccountById,
    bulkUpdateAccounts,
    bulkDeleteAccounts,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Accounts
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getAccountById(req)
        : await getAccounts(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Account
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createAccount(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Account
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateAccounts(req)
        : await updateAccount(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Account
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteAccounts(req)
        : await deleteAccount(req);

    return formatResponse(result.data, result.message, result.status);
}