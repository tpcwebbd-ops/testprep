import { NextRequest } from 'next/server';
import { SessionController } from './controller';

export async function GET(req: NextRequest) {
  return SessionController.get(req);
}

export async function POST(req: NextRequest) {
  return SessionController.post(req);
}
