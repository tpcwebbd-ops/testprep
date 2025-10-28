import { NextRequest } from 'next/server';
import { UserController } from './controller';

export async function GET(req: NextRequest) {
  return UserController.get(req);
}

export async function POST(req: NextRequest) {
  return UserController.post(req);
}
