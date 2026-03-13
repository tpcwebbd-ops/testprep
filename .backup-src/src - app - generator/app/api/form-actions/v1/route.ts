import { getFormActions, createFormAction, updateFormAction, deleteFormAction, getFormActionById } from './controller';
// import { formatResponse, IResponse } from '@/app/api/utils/utils';
import {
  formatResponse,
  //    handleTokenVerify,
  IResponse,
} from '@/app/api/utils/jwt-verify';
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id');
  const result: IResponse = id ? await getFormActionById(req) : await getFormActions(req);
  return formatResponse(result.data, result.message, result.status);
}

export async function POST(req: Request) {
  const result = await createFormAction(req);
  return formatResponse(result.data, result.message, result.status);
}

export async function PUT(req: Request) {
  const result = await updateFormAction(req);

  return formatResponse(result.data, result.message, result.status);
}

export async function DELETE(req: Request) {
  const result = await deleteFormAction(req);

  return formatResponse(result.data, result.message, result.status);
}
