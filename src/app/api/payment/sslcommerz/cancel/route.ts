import { NextResponse, NextRequest } from 'next/server';

function getBaseUrl(req: NextRequest): string {
  const configured = process.env.NEXT_PUBLIC_BASE_URL;
  if (configured) return configured.replace(/\/$/, '');
  const { protocol, host } = req.nextUrl;
  return `${protocol}//${host}`;
}

export async function POST(req: NextRequest) {
  const base = getBaseUrl(req);
  let tranId = '';
  try {
    const formData = await req.formData();
    tranId = (formData.get('tran_id') as string) || '';
  } catch {
    // ignore
  }
  return NextResponse.redirect(`${base}/payment/cancel?tran_id=${tranId}`);
}

export async function GET(req: NextRequest) {
  const base = getBaseUrl(req);
  return NextResponse.redirect(`${base}/payment/cancel`);
}
