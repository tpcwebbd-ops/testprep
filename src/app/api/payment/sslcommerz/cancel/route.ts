import { NextRequest } from 'next/server';
import connectDB from '@/app/api/utils/mongoose';
import Enrollment from '@/app/api/enrollments/v1/model';
import { getBaseUrl, redirect303 } from '../utils';

export async function POST(req: NextRequest) {
  const base = getBaseUrl(req);
  let tranId = '';
  try {
    const formData = await req.formData();
    tranId = (formData.get('tran_id') as string) || '';
    if (tranId) {
      await connectDB();
      await Enrollment.findOneAndUpdate({ tranId }, { paymentStatus: 'failed' });
    }
  } catch {
    // ignore
  }
  return redirect303(`${base}/payment/cancel?tran_id=${tranId}`);
}

export async function GET(req: NextRequest) {
  return redirect303(`${getBaseUrl(req)}/payment/cancel`);
}
