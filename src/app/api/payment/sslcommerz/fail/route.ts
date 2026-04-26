import { NextResponse } from 'next/server';
import connectDB from '@/app/api/utils/mongoose';
import Enrollment from '@/app/api/enrollments/v1/model';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function POST(req: Request) {
  const formData = await req.formData();
  const tranId = formData.get('tran_id') as string;

  try {
    await connectDB();
    await Enrollment.findOneAndUpdate({ tranId }, { paymentStatus: 'failed' });
  } catch {
    // best-effort
  }

  return NextResponse.redirect(`${BASE_URL}/payment/fail?tran_id=${tranId}`);
}
