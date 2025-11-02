import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import Verification from '../verification/v1/model';
import { formatResponse, IResponse } from '../utils/utils';

const GMAIL_USER = process.env.GMAIL_USER!;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD!;
const MONGOOSE_URI = process.env.mongooseURI!;

if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !MONGOOSE_URI) {
  throw new Error('Missing environment variables: GMAIL_USER, GMAIL_APP_PASSWORD, mongooseURI');
}

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGOOSE_URI);
  }
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
});

export async function POST(req: Request): Promise<NextResponse<IResponse>> {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      const response = formatResponse(null, 'Invalid email provided.', 400);
      return NextResponse.json(response, { status: response.status });
    }

    await connectDB();

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete existing previous codes
    await Verification.deleteMany({ email });

    // Save new verification record
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    await Verification.create({ email, code, expiresAt });

    // === Send Email ===
    const mailOptions = {
      from: GMAIL_USER,
      to: email,
      subject: 'Your Verification Code 🔐',
      html: `
      <div style="font-family:Arial,sans-serif;padding:30px;background:#f9fafb;">
        <div style="max-width:600px;margin:auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
          <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;text-align:center;padding:30px 20px;">
            <h1 style="margin:0;font-size:24px;">Your Verification Code</h1>
          </div>
          <div style="padding:40px;text-align:center;">
            <p style="font-size:16px;color:#374151;margin-bottom:20px;">Use the following code to verify your identity:</p>
            <div style="font-size:32px;font-weight:bold;letter-spacing:10px;color:#4f46e5;">${code}</div>
            <p style="margin-top:20px;color:#6b7280;">This code will expire in <strong>10 minutes</strong>.</p>
          </div>
          <div style="background:#f3f4f6;padding:20px;text-align:center;color:#9ca3af;font-size:13px;">
            If you didn't request this, you can safely ignore this email.
          </div>
        </div>
      </div>`,
    };

    await transporter.sendMail(mailOptions);

    const response = formatResponse({ email }, 'Verification code sent successfully.', 200);
    return NextResponse.json(response, { status: response.status });
  } catch (error: unknown) {
    console.error('Error sending verification code:', error);

    const err = error as { code?: string; message?: string };
    let response: IResponse;

    if (err.code === 'EENVELOPE') {
      response = formatResponse(null, `Email delivery failed: ${err.message}`, 400);
    } else if (err.code === 'EAUTH') {
      response = formatResponse(null, `Email authentication failed. Check credentials.`, 500);
    } else {
      response = formatResponse(null, 'Unexpected error while sending code.', 500);
    }

    return NextResponse.json(response, { status: response.status });
  }
}
