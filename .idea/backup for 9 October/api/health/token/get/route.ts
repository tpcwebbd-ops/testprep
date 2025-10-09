import { createJwt, formatResponse, IResponse } from '../utils';

export async function POST(req: Request) {
  try {
    const result = await req.json();
    if (result.authType === 'google') {
      if (result.email) {
        const token = createJwt(result.email);
        return formatResponse(true, token, result.message || 'success', result.status || 210);
      } else {
        return formatResponse(false, '', 'Data not valid', result.status || 503);
      }
    }
  } catch (err) {
    console.log('err', err);
    const result: IResponse = { ok: false, data: [], message: 'some thing wrong', status: 502 };
    return formatResponse(false, result.data, result.message, result.status);
  }
}
