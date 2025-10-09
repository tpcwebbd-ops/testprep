import { NextRequest } from 'next/server';
import { VerificationController } from './controller';

export async function GET(req: NextRequest) {
  return VerificationController.get(req);
}

export async function POST(req: NextRequest) {
  return VerificationController.post(req);
}
