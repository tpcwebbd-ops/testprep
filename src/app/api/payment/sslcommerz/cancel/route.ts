import { redirect } from 'next/navigation';

export async function POST(req: Request) {
  const formData = await req.formData();
  const tranId = formData.get('tran_id') as string;
  redirect(`/payment/cancel?tran_id=${tranId}`);
}
