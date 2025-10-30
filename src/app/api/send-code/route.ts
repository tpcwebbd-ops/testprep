// app/api/send-code/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { formatResponse, IResponse } from '../utils/utils';

const GMAIL_USER = process.env.GMAIL_USER!;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD!;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
  throw new Error('Missing required environment variables: GMAIL_USER, GMAIL_APP_PASSWORD');
}

// ===== Configure Nodemailer Transporter =====
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
});

// ===== POST Handler =====
export async function POST(req: Request): Promise<NextResponse<IResponse>> {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      const response = formatResponse(null, 'Invalid email address.', 400);
      return NextResponse.json(response, { status: response.status });
    }

    // === Generate a 6-digit code ===
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // === Build Email HTML ===
    const mailOptions = {
      from: GMAIL_USER,
      to: email,
      subject: 'Your Password Reset Code 🔐',
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Password Reset Code</title>
      </head>
      <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);min-height:100vh;">
        <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
          <tr>
            <td align="center" style="padding:40px 20px;">
              <table role="presentation" style="width:100%;max-width:600px;background:#ffffff;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,0.15);overflow:hidden;">
                
                <!-- Header -->
                <tr>
                  <td style="padding:40px 30px;text-align:center;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);">
                    <div style="width:80px;height:80px;margin:0 auto 20px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;">
                      <svg width="40" height="40" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 
                        1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 
                        1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:600;">Password Reset Code</h1>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:40px 30px;text-align:center;">
                    <p style="color:#374151;font-size:16px;margin-bottom:20px;">Hey there 👋</p>
                    <p style="color:#6b7280;font-size:15px;margin-bottom:20px;">Use the verification code below to reset your password. It will expire in <strong>10 minutes</strong>.</p>
                    <div style="font-size:32px;font-weight:700;letter-spacing:8px;color:#4f46e5;margin:30px 0;">${code}</div>
                    <p style="color:#9ca3af;font-size:13px;margin-top:30px;">If you didn’t request this, you can safely ignore this email.</p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:20px;background:#f9fafb;text-align:center;color:#9ca3af;font-size:12px;">
                    &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
      `,
    };

    // === Send Email ===
    await transporter.sendMail(mailOptions);

    // You can also optionally store the code temporarily (Redis, DB, etc.)
    const response = formatResponse({ code }, 'Reset code sent successfully.', 200);
    return NextResponse.json(response, { status: response.status });
  } catch (error: unknown) {
    console.error('Error sending reset code:', error);

    const err = error as { code?: string; message?: string; keyValue?: Record<string, unknown> };
    let response: IResponse;

    if (err.code === 'EENVELOPE') {
      response = formatResponse(null, `Email delivery failed: ${err.message || 'Check recipient/sender.'}`, 400);
    } else if (err.code === 'EAUTH') {
      response = formatResponse(null, `Email server authentication failed. Please check GMAIL_APP_PASSWORD.`, 500);
    } else if (err.keyValue) {
      response = formatResponse(null, `Failed to send email: ${JSON.stringify(err.keyValue)}`, 500);
    } else {
      response = formatResponse(null, 'Unexpected internal server error.', 500);
    }

    return NextResponse.json(response, { status: response.status });
  }
}
