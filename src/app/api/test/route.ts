import { formatResponse } from '@/app/api/utils/jwt-verify';
import { isUserHasAccess, IWantAccess } from '../utils/is-user-has-access';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: Request) {
  const wantToAccess: IWantAccess = {
    db_name: 'user',
    access: 'create',
  };

  const result = await isUserHasAccess(wantToAccess);

  return formatResponse(result, 'Server is running', 200);
}
