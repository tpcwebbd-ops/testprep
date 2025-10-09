import { getDocking_s, createDocking, updateDocking, deleteDocking, getDockingById, bulkUpdateDocking_s, bulkDeleteDocking_s } from './Controller';
import { formatResponse, IResponse } from './utils';

// GET all Docking_s
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id');
  const result: IResponse = id ? await getDockingById(req) : await getDocking_s(req);
  return formatResponse(result.ok, result.data, result.message, result.status);
}

// CREATE Docking
export async function POST(req: Request) {
  const result = await createDocking(req);
  return formatResponse(result.ok, result.data, result.message, result.status);
}

// UPDATE Docking
export async function PUT(req: Request) {
  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkUpdateDocking_s(req) : await updateDocking(req);

  return formatResponse(result.ok, result.data, result.message, result.status);
}

// DELETE Docking
export async function DELETE(req: Request) {
  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkDeleteDocking_s(req) : await deleteDocking(req);

  return formatResponse(result.ok, result.data, result.message, result.status);
}
