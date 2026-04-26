import { redirect } from 'next/navigation';
import connectDB from '@/app/api/utils/mongoose';
import Enrollment from '@/app/api/enrollments/v1/model';

export async function POST(req: Request) {
  const formData = await req.formData();
  const tranId = formData.get('tran_id') as string;

  try {
    await connectDB();
    await Enrollment.findOneAndUpdate({ tranId }, { paymentStatus: 'failed' });
  } catch {
    // best-effort update
  }

  redirect(`/payment/fail?tran_id=${tranId}`);
}
