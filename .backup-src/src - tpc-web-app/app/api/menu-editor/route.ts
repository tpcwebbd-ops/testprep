import { getMenu, updateMenu } from './controller';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type') || 'main-menu';
  return getMenu(type);
}

export async function POST(req: NextRequest) {
  return updateMenu(req);
}
