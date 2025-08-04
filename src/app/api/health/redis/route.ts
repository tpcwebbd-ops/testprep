import { connectRedis, formatResponse, getRedisData, IResponse, setRedisData } from './utils';

// GET all Docking_s
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id');

  await connectRedis();
  const data = await getRedisData('docking_s');
  const result: IResponse = { ok: true, data: data, message: `success ${id}`, status: 200 };
  return formatResponse(result.ok, result.data, result.message, result.status);
}

// CREATE Docking
export async function POST(req: Request) {
  const id = new URL(req.url).searchParams.get('id');
  const reqData = await req.json();
  await connectRedis();
  const data = await setRedisData('docking_s', reqData);
  const result: IResponse = { ok: true, data: { data, reqData }, message: `success ${id}`, status: 200 };
  return formatResponse(result.ok, result.data, result.message, result.status);
}

// UPDATE Docking
export async function PUT(req: Request) {
  const id = new URL(req.url).searchParams.get('id');
  const reqData = await req.json();
  await connectRedis();
  const data = await setRedisData('docking_s', reqData);
  const result: IResponse = { ok: true, data: { data, reqData }, message: `success ${id}`, status: 200 };
  return formatResponse(result.ok, result.data, result.message, result.status);
}

// DELETE Docking
export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get('id');
  const reqData = await req.json();
  await connectRedis();
  const data = await setRedisData('docking_s', {});
  const result: IResponse = { ok: true, data: { data, reqData }, message: `success ${id}`, status: 200 };
  return formatResponse(result.ok, result.data, result.message, result.status);
}
