import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { formatResponse } from '../utils/utils';

const EMAIL_TOKEN_SECRET = process.env.EMAIL_TOKEN_SECRET!;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    const response = formatResponse(null, 'Missing token', 400);
    return NextResponse.json(response, { status: response.status });
  }

  try {
    const payload = jwt.verify(token, EMAIL_TOKEN_SECRET) as { email: string };
    const email = payload.email;

    // ✅ In production: mark verified in DB here

    // Option 1: Redirect to a pretty page
    // const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    // return NextResponse.redirect(`${BASE_URL}/verify-success?email=${encodeURIComponent(email)}`);

    // Option 2: Return JSON response
    const response = formatResponse({ email }, 'Email verified successfully', 200);
    return NextResponse.json(response, { status: response.status });
  } catch (error: unknown) {
    console.error('Error verifying token:', error);

    let response;

    // Check if it's a JWT error
    if (error instanceof jwt.JsonWebTokenError) {
      response = formatResponse(null, 'Invalid token', 400);
    } else if (error instanceof jwt.TokenExpiredError) {
      response = formatResponse(null, 'Token has expired', 400);
    } else {
      // Handle other potential errors
      const err = error as { code?: string | number; keyValue?: Record<string, unknown> };

      if (err.keyValue) {
        response = formatResponse(null, `Database error: ${JSON.stringify(err.keyValue)}`, 500);
      } else {
        // Generic fallback for unexpected errors
        response = formatResponse(null, 'An unexpected error occurred during verification', 500);
      }
    }

    return NextResponse.json(response, { status: response.status });
  }
}
