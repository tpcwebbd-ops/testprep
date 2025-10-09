import { formatResponse, verifyJwt } from '../utils';

export const handleTokenVerify = (req: Request) => {
  const authorizationToken = req.headers.get('authorization');
  const token = authorizationToken?.split(' ')[1];
  if (!token) {
    return formatResponse(false, null, 'Please provide a token', 430);
  } else if (token) {
    const result = verifyJwt(token);
    if (result.isValid) {
      return null;
    } else {
      return formatResponse(false, null, 'token is expire', 432);
    }
  }
  return formatResponse(false, null, 'Please provide a valid token', 433);
};
