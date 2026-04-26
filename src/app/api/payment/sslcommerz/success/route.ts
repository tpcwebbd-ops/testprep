import { redirect } from 'next/navigation';
import connectDB from '@/app/api/utils/mongoose';
import Enrollment from '@/app/api/enrollments/v1/model';

const IS_SANDBOX = process.env.SSLCOMMERZ_SANDBOX !== 'false';
const VALIDATE_URL = IS_SANDBOX
  ? 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php'
  : 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php';

export async function POST(req: Request) {
  const formData = await req.formData();
  const tranId = formData.get('tran_id') as string;
  const valId = formData.get('val_id') as string;
  const status = formData.get('status') as string;

  if (status !== 'VALID' && status !== 'VALIDATED') {
    redirect(`/payment/fail?tran_id=${tranId}&reason=invalid_status`);
  }

  try {
    const validateParams = new URLSearchParams({
      val_id: valId,
      store_id: process.env.SSLCOMMERZ_STORE_ID || '',
      store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD || '',
      format: 'json',
    });

    const valRes = await fetch(`${VALIDATE_URL}?${validateParams}`);
    const valData = await valRes.json();

    if (valData?.status !== 'VALID' && valData?.status !== 'VALIDATED') {
      redirect(`/payment/fail?tran_id=${tranId}&reason=validation_failed`);
    }

    await connectDB();
    await Enrollment.findOneAndUpdate(
      { tranId },
      {
        paymentStatus: 'completed',
        studentsStatus: 'running',
        sslValId: valId,
      },
    );

    redirect(`/payment/success?tran_id=${tranId}`);
  } catch {
    redirect(`/payment/fail?tran_id=${tranId}&reason=server_error`);
  }
}
