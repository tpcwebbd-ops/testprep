import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/app/api/utils/mongoose';
import Enrollment from '@/app/api/enrollments/v1/model';
import { sendCapiPurchase, getClientIp, getUserAgent, getFbCookies } from '@/lib/fb-capi';
import { sendGA4Purchase, extractGA4ClientId } from '@/lib/ga4-mp';

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

async function fireServerTracking(
  req: NextRequest,
  tranId: string,
  value: number,
  email: string,
  gaCookie: string | undefined,
): Promise<void> {
  const headers = req.headers;
  const { fbp, fbc } = getFbCookies(headers);

  // Run both in parallel — don't block the redirect
  await Promise.allSettled([
    sendCapiPurchase({
      tranId,
      value,
      currency: 'BDT',
      userData: {
        email,
        clientIp: getClientIp(headers),
        userAgent: getUserAgent(headers),
        fbp,
        fbc,
      },
      sourceUrl: req.headers.get('referer') ?? undefined,
    }),
    sendGA4Purchase(
      extractGA4ClientId(gaCookie),
      tranId,
      value,
      'BDT',
      [],
    ),
  ]);
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

    const enrollment = await Enrollment.findOneAndUpdate(
      { tranId },
      { paymentStatus: 'completed', studentsStatus: 'running', sslValId: valId },
      { new: true },
    );

    // Fire CAPI + GA4 server-side — non-blocking, best-effort
    if (enrollment) {
      const gaCookie = req.cookies.get('_ga')?.value;
      fireServerTracking(
        req,
        tranId,
        enrollment.paymentAmount ?? 0,
        enrollment.studentEmail ?? '',
        gaCookie,
      ).catch(err => console.error('Server tracking error:', err));
    }

    return redirect303(`${base}/payment/success?tran_id=${tranId}`);
  } catch (err) {
    console.error('SSLCommerz success handler error:', err);
    return redirect303(`${base}/payment/fail?tran_id=${tranId}&reason=server_error`);
  }
}

export async function GET(req: NextRequest) {
  return redirect303(`${getBaseUrl(req)}/payment/fail?reason=method_not_allowed`);
}
