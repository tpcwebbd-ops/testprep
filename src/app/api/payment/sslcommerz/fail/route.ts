import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/app/api/utils/mongoose';
import Enrollment from '@/app/api/enrollments/v1/model';

function getBaseUrl(req: NextRequest): string {
  const configured = process.env.NEXT_PUBLIC_BASE_URL;
  if (configured) return configured.replace(/\/$/, '');
  const { protocol, host } = req.nextUrl;
  return `${protocol}//${host}`;
}

function redirect303(url: string) {
  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(req: NextRequest) {
  const base = getBaseUrl(req);
  let tranId = '';

  try {
    const formData = await req.formData();
    tranId = (formData.get('tran_id') as string) || '';
    await connectDB();
    await Enrollment.findOneAndUpdate({ tranId }, { paymentStatus: 'failed' });
  } catch {
    // best-effort
  }

  return redirect303(`${base}/payment/fail?tran_id=${tranId}`);
}

export async function GET(req: NextRequest) {
  return redirect303(`${getBaseUrl(req)}/payment/fail`);
}
