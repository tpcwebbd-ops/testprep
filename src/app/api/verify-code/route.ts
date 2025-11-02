import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Verification from '../verification/v1/model';
import { formatResponse, IResponse } from '../utils/utils';

const MONGOOSE_URI = process.env.mongooseURI!;

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGOOSE_URI);
  }
}

export async function POST(req: Request): Promise<NextResponse<IResponse>> {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      const response = formatResponse(null, 'Email and code are required.', 400);
      return NextResponse.json(response, { status: response.status });
    }

    await connectDB();

    const record = await Verification.findOne({ email }).sort({ createdAt: -1 });

    if (!record) {
      const response = formatResponse(null, 'No verification record found for this email.', 404);
      return NextResponse.json(response, { status: response.status });
    }

    if (record.verified) {
      const response = formatResponse(null, 'Code already verified.', 200);
      return NextResponse.json(response, { status: response.status });
    }

    if (record.expiresAt < new Date()) {
      const response = formatResponse(null, 'Verification code expired.', 400);
      return NextResponse.json(response, { status: response.status });
    }

    if (record.code !== code) {
      const response = formatResponse(null, 'Invalid verification code.', 400);
      return NextResponse.json(response, { status: response.status });
    }

    // Mark as verified
    record.verified = true;
    await record.save();

    const response = formatResponse({ email: record.email }, 'Verification successful.', 200);
    return NextResponse.json(response, { status: response.status });
  } catch (error: unknown) {
    let response;
    if (error instanceof Error) {
      response = formatResponse(null, 'Invalid token', 400);
    } else {
      response = formatResponse(null, 'Unexpected error during verification', 500);
    }
    return NextResponse.json(response, { status: response.status });
  }
}
