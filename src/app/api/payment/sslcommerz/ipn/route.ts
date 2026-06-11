import { NextResponse } from 'next/server';
import connectDB from '@/app/api/utils/mongoose';
import Enrollment from '@/app/api/enrollments/v1/model';
import { isSuccessfulSslStatus, validateSslPayment } from '../utils';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const tranId = formData.get('tran_id') as string;
    const valId = formData.get('val_id') as string;
    const status = formData.get('status') as string;

    if (!tranId || !valId || !isSuccessfulSslStatus(status)) {
      return NextResponse.json({ ok: false });
    }

    const valData = await validateSslPayment(valId);

    if (!isSuccessfulSslStatus(valData?.status)) {
      return NextResponse.json({ ok: false });
    }

    await connectDB();
    await Enrollment.findOneAndUpdate(
      { tranId },
      { paymentStatus: 'completed', studentsStatus: 'running', sslValId: valId },
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('IPN error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
