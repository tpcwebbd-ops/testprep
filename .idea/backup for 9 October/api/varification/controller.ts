import { NextRequest, NextResponse } from 'next/server';
import { VerificationService } from './service';

export const VerificationController = {
  async get(req: NextRequest) {
    const Verifications = await VerificationService.getAllVerifications();
    return NextResponse.json(Verifications);
  },

  async post(req: NextRequest) {
    const data = await req.json();
    const newVerification = await VerificationService.createVerification(data);
    return NextResponse.json(newVerification, { status: 201 });
  },
};
