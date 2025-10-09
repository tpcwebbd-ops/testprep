import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getSupport_Tickets,
    createSupport_Ticket,
    updateSupport_Ticket,
    deleteSupport_Ticket,
    getSupport_TicketById,
    bulkUpdateSupport_Tickets,
    bulkDeleteSupport_Tickets,
} from './controller';

import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all Support_Tickets
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//   if (tokenResponse) return tokenResponse;

    const id = new URL(req.url).searchParams.get('id');
    const result: IResponse = id
        ? await getSupport_TicketById(req)
        : await getSupport_Tickets(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE Support_Ticket
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const result = await createSupport_Ticket(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE Support_Ticket
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateSupport_Tickets(req)
        : await updateSupport_Ticket(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE Support_Ticket
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

//    const tokenResponse = handleTokenVerify(req);
//    if (tokenResponse) return tokenResponse;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteSupport_Tickets(req)
        : await deleteSupport_Ticket(req);

    return formatResponse(result.data, result.message, result.status);
}