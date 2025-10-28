import { NextRequest } from 'next/server';
import { AccountController } from './controller';

export async function GET(req: NextRequest) {
  return AccountController.get(req);
}

export async function POST(req: NextRequest) {
  return AccountController.post(req);
}
