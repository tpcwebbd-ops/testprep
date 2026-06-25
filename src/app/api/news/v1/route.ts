import { handleRateLimit } from '@/app/api/utils/rate-limit';
import {
    getNews,
    createNews,
    updateNews,
    deleteNews,
    getNewsById,
    getNewsSummary,
    bulkUpdateNews,
    bulkDeleteNews,
} from './controller';
import { isUserHasAccessByRole, IWantAccess } from '../../utils/is-user-has-access-by-role';
import {
    formatResponse,
//    handleTokenVerify,
    IResponse,
} from '@/app/api/utils/jwt-verify';

// GET all News
export async function GET(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

          const wantToAccess: IWantAccess = {
        db_name: 'news',
        access: 'read',
      };
      const isAccess = await isUserHasAccessByRole(wantToAccess);
      if (isAccess) return isAccess;

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const isSummary = url.searchParams.get('summary') === 'true';
    const result: IResponse = isSummary
        ? await getNewsSummary(req)
        : id
            ? await getNewsById(req)
            : await getNews(req);
    return formatResponse(result.data, result.message, result.status);
}

// CREATE News
export async function POST(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

      const wantToAccess: IWantAccess = {
        db_name: 'news',
        access: 'create',
      };
      const isAccess = await isUserHasAccessByRole(wantToAccess);
      if (isAccess) return isAccess;

    const result = await createNews(req);
    return formatResponse(result.data, result.message, result.status);
}

// UPDATE News
export async function PUT(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

      const wantToAccess: IWantAccess = {
        db_name: 'news',
        access: 'update',
      };
      const isAccess = await isUserHasAccessByRole(wantToAccess);
      if (isAccess) return isAccess;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkUpdateNews(req)
        : await updateNews(req);

    return formatResponse(result.data, result.message, result.status);
}

// DELETE News
export async function DELETE(req: Request) {
    const rateLimitResponse = handleRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

      const wantToAccess: IWantAccess = {
        db_name: 'news',
        access: 'delete',
      };
      const isAccess = await isUserHasAccessByRole(wantToAccess);
      if (isAccess) return isAccess;

    const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
    const result = isBulk
        ? await bulkDeleteNews(req)
        : await deleteNews(req);

    return formatResponse(result.data, result.message, result.status);
}
