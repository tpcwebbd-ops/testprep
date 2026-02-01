import { NextResponse } from 'next/server';
import { getDashboards, createDashboard, updateDashboard, deleteDashboard, getDashboardById } from './controller';

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id');
  const result = id ? await getDashboardById(req) : await getDashboards(req);

  return NextResponse.json(result.data, { status: result.status, statusText: result.message });
}

export async function POST(req: Request) {
  const result = await createDashboard(req);
  return NextResponse.json(result.data, { status: result.status, statusText: result.message });
}

export async function PUT(req: Request) {
  const result = await updateDashboard(req);
  return NextResponse.json(result.data, { status: result.status, statusText: result.message });
}

export async function DELETE(req: Request) {
  const result = await deleteDashboard(req);
  return NextResponse.json(result.data, { status: result.status, statusText: result.message });
}
