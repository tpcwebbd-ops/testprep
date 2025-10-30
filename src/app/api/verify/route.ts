import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../user/v1/model';
import { formatResponse } from '../utils/utils';

const EMAIL_TOKEN_SECRET = process.env.EMAIL_TOKEN_SECRET!;
const MONGOOSE_URI = process.env.mongooseURI!;

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGOOSE_URI);
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  const emailQuery = searchParams.get('email');

  try {
    await connectDB();

    if (token) {
      try {
        const payload = jwt.verify(token, EMAIL_TOKEN_SECRET) as { email: string };
        const email = payload.email;

        const updatedUser = await User.findOneAndUpdate({ email }, { $set: { emailVerified: true } }, { new: true });

        if (!updatedUser) {
          const response = formatResponse(null, 'Email not found', 404);
          return NextResponse.json(response, { status: response.status });
        }

        const response = formatResponse({ email: updatedUser.email }, 'Email verified successfully', 200);
        return NextResponse.json(response, { status: response.status });
      } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
          const response = formatResponse(null, 'Token has expired', 400);
          return NextResponse.json(response, { status: response.status });
        } else if (err instanceof jwt.JsonWebTokenError) {
          const response = formatResponse(null, 'Invalid token', 400);
          return NextResponse.json(response, { status: response.status });
        }
        const response = formatResponse(null, 'Token verification error', 500);
        return NextResponse.json(response, { status: response.status });
      }
    }

    if (emailQuery) {
      const user = await User.findOne({ email: emailQuery });

      if (!user) {
        const response = formatResponse(null, 'Email not found', 404);
        return NextResponse.json(response, { status: response.status });
      }

      if (!user.emailVerified) {
        const response = formatResponse({ email: user.email }, 'Email not verify', 200);
        return NextResponse.json(response, { status: response.status });
      }

      const response = formatResponse({ email: user.email }, 'Email verify', 200);
      return NextResponse.json(response, { status: response.status });
    }

    const response = formatResponse(null, 'Missing token or email', 400);
    return NextResponse.json(response, { status: response.status });
  } catch (error: unknown) {
    let response;
    if (error instanceof jwt.JsonWebTokenError) {
      response = formatResponse(null, 'Invalid token', 400);
    } else if (error instanceof jwt.TokenExpiredError) {
      response = formatResponse(null, 'Token has expired', 400);
    } else {
      response = formatResponse(null, 'Unexpected error during verification', 500);
    }
    return NextResponse.json(response, { status: response.status });
  }
}
