import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/app/api/utils/mongoose';
import Enrollment from '@/app/api/enrollments/v1/model';

const IS_SANDBOX = process.env.SSLCOMMERZ_SANDBOX !== 'false';
const VALIDATE_URL = IS_SANDBOX
  ? 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php'
  : 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php';

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
  let valId = '';
  let status = '';

  try {
    const formData = await req.formData();
    tranId = (formData.get('tran_id') as string) || '';
    valId = (formData.get('val_id') as string) || '';
    status = (formData.get('status') as string) || '';
  } catch {
    return redirect303(`${base}/payment/fail?reason=bad_request`);
  }

  if (status !== 'VALID' && status !== 'VALIDATED') {
    return redirect303(`${base}/payment/fail?tran_id=${tranId}&reason=invalid_status`);
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
      return redirect303(`${base}/payment/fail?tran_id=${tranId}&reason=validation_failed`);
    }

    await connectDB();
    await Enrollment.findOneAndUpdate(
      { tranId },
      { paymentStatus: 'completed', studentsStatus: 'running', sslValId: valId },
    );

    return redirect303(`${base}/payment/success?tran_id=${tranId}`);
  } catch (err) {
    console.error('SSLCommerz success handler error:', err);
    return redirect303(`${base}/payment/fail?tran_id=${tranId}&reason=server_error`);
  }
}

export async function GET(req: NextRequest) {
  return redirect303(`${getBaseUrl(req)}/payment/fail?reason=method_not_allowed`);
}
