import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function POST(req: Request) {
  const formData = await req.formData();
  const tranId = formData.get('tran_id') as string;
  return NextResponse.redirect(`${BASE_URL}/payment/cancel?tran_id=${tranId}`);
}
