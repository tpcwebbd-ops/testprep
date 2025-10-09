import { formatResponse, verifyJwt, IResponse } from '../utils';

export async function POST(req: Request) {
  try {
    const result = await req.json();
    if (result.authType === 'google') {
      const token = result.token;
      if (token) {
        const result = verifyJwt(token);
        if (result.isValid) {
          return formatResponse(true, 'token is valid', 'success', 200);
        } else {
          return formatResponse(false, null, 'token is expire', 432);
        }
      }
    }
  } catch (err) {
    console.log('err', err);
    const result: IResponse = { ok: false, data: [], message: 'some thing wrong', status: 502 };
    return formatResponse(false, result.data, result.message, result.status);
  }
}
