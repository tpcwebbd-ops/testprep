# PipraPay পেমেন্ট গেটওয়ে ইমপ্লিমেন্টেশন গাইড

এই গাইডটি TestPrep Next.js অ্যাপে PipraPay ব্যবহার করে কোর্স এনরোলমেন্ট পেমেন্ট নেওয়ার জন্য। PipraPay একটি self-hosted/open-source payment automation platform। তাদের pricing page অনুযায়ী platform fee, monthly fee, setup fee এবং PipraPay per-transaction fee নেই। তবে gateway/provider যেমন bKash, Nagad, SSLCommerz ইত্যাদির নিজস্ব চার্জ থাকতে পারে।

## অফিসিয়াল রেফারেন্স

- Pricing: https://piprapay.com/pricing
- Docs index: https://docs.piprapay.com/llms.txt
- Create Charge: https://docs.piprapay.com/reference/create-charge.md
- Verify Payment: https://docs.piprapay.com/reference/verify-payment.md
- Webhook Guide: https://docs.piprapay.com/reference/webhook-guides.md

## Flow

```text
ব্যবহারকারী
  |
  | কোর্স পেজ থেকে Enroll/Pay ক্লিক করে
  v
Next.js Frontend (/purchase বা /courses)
  |
  | POST /api/payment/piprapay/init
  v
Backend Init Route
  | 1. Enrollment তৈরি করে: paymentStatus=pending
  | 2. PipraPay /api/create-charge এ request পাঠায়
  | 3. pp_id এবং pp_url পায়
  | 4. Enrollment এ pp_id/tranId সেভ করে
  v
Frontend
  |
  | window.location.href = pp_url
  v
PipraPay Hosted Payment Page
  |
  | পেমেন্ট শেষে redirect_url বা cancel_url এ ফেরত পাঠায়
  v
Backend Return Route
  | 1. pp_id নিয়ে PipraPay /api/verify-payment call করে
  | 2. status === completed হলে enrollment completed/running করে
  | 3. না হলে failed/pending রাখে
  v
Frontend Result Page
```

## Environment Variables

`.env.local` এ যোগ করুন:

```env
PIPRAPAY_BASE_URL=https://sandbox.piprapay.com
PIPRAPAY_API_KEY=your_piprapay_api_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Production এ `PIPRAPAY_BASE_URL` আপনার live/self-hosted PipraPay URL হবে।

## Recommended Database Fields

`src/app/api/enrollments/v1/model.ts` এ SSLCommerz এর মতো extra field রাখা ভালো:

```ts
tranId: { type: String, default: null },
pipraPayId: { type: String, default: null },
pipraTransactionId: { type: String, default: null },
paymentGateway: { type: String, default: null },
```

এই প্রজেক্টে `tranId` আগে থেকেই আছে। চাইলে `tranId`-এ PipraPay `pp_id` রাখাও যায়, কিন্তু পরিষ্কার রাখার জন্য `pipraPayId` আলাদা রাখা ভালো।

## ধাপ ১: Helper তৈরি

ফাইল: `src/app/api/payment/piprapay/utils.ts`

```ts
import { NextRequest, NextResponse } from 'next/server';

export function getPipraPayConfig() {
  const baseUrl = process.env.PIPRAPAY_BASE_URL?.replace(/\/$/, '');
  const apiKey = process.env.PIPRAPAY_API_KEY;

  if (!baseUrl || !apiKey) {
    return null;
  }

  return { baseUrl, apiKey };
}

export function getBaseUrl(req: NextRequest) {
  const configured = process.env.NEXT_PUBLIC_BASE_URL;
  if (configured) return configured.replace(/\/$/, '');
  return `${req.nextUrl.protocol}//${req.nextUrl.host}`;
}

export function redirect303(url: string) {
  return NextResponse.redirect(url, { status: 303 });
}

export async function verifyPipraPayment(ppId: string) {
  const config = getPipraPayConfig();
  if (!config) throw new Error('PipraPay config missing');

  const res = await fetch(`${config.baseUrl}/api/verify-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'MHS-PIPRAPAY-API-KEY': config.apiKey,
    },
    body: JSON.stringify({ pp_id: ppId }),
  });

  return res.json();
}
```

## ধাপ ২: Init Route

ফাইল: `src/app/api/payment/piprapay/init/route.ts`

PipraPay `create-charge` endpoint:

- Method: `POST`
- URL: `{PIPRAPAY_BASE_URL}/api/create-charge`
- Header: `mh-piprapay-api-key`
- Success response example: `{ status: true, pp_id, pp_url }`

```ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/api/utils/mongoose';
import Enrollment from '@/app/api/enrollments/v1/model';
import { getBaseUrl, getPipraPayConfig } from '../utils';

export async function POST(req: NextRequest) {
  try {
    const config = getPipraPayConfig();
    if (!config) {
      return NextResponse.json({ ok: false, message: 'PipraPay config missing' }, { status: 500 });
    }

    const body = await req.json();
    const {
      studentName,
      studentEmail,
      studentPhone,
      enrollCoursesIDS,
      realPrice,
      discountPrice,
      paymentAmount,
      couponCode,
    } = body;

    if (!studentName || !studentEmail || !studentPhone || !enrollCoursesIDS?.length || !paymentAmount) {
      return NextResponse.json({ ok: false, message: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    const base = getBaseUrl(req);

    const enrollment = await Enrollment.create({
      studentName,
      studentEmail,
      studentsStatus: 'pending',
      enrollCoursesIDS,
      realPrice,
      discountPrice,
      paymentAmount,
      paymentMethod: 'PipraPay',
      paymentGateway: 'PipraPay',
      couponCode: couponCode || null,
      checkedbyEmail: '',
      paymentStatus: 'pending',
    });

    const chargeRes = await fetch(`${config.baseUrl}/api/create-charge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'mh-piprapay-api-key': config.apiKey,
      },
      body: JSON.stringify({
        full_name: studentName,
        email_mobile: studentEmail,
        amount: String(paymentAmount),
        metadata: {
          enrollmentId: String(enrollment._id),
          courseIds: enrollCoursesIDS,
        },
        redirect_url: `${base}/api/payment/piprapay/return`,
        cancel_url: `${base}/api/payment/piprapay/cancel`,
        return_type: 'GET',
        webhook_url: `${base}/api/payment/piprapay/webhook`,
        currency: 'BDT',
      }),
    });

    const chargeData = await chargeRes.json();

    if (!chargeData?.status || !chargeData?.pp_id || !chargeData?.pp_url) {
      await Enrollment.findByIdAndDelete(enrollment._id);
      return NextResponse.json({ ok: false, message: chargeData?.message || 'PipraPay init failed' }, { status: 502 });
    }

    await Enrollment.findByIdAndUpdate(enrollment._id, {
      tranId: String(chargeData.pp_id),
      pipraPayId: String(chargeData.pp_id),
    });

    return NextResponse.json({
      ok: true,
      redirectUrl: chargeData.pp_url,
      ppId: String(chargeData.pp_id),
    });
  } catch (err) {
    console.error('PipraPay init error:', err);
    return NextResponse.json({ ok: false, message: 'Internal server error' }, { status: 500 });
  }
}
```

## ধাপ ৩: Return Route

ফাইল: `src/app/api/payment/piprapay/return/route.ts`

PipraPay docs অনুযায়ী successful payment শেষে `pp_id` ফেরত আসে এবং সেটি Verify Payment API দিয়ে যাচাই করতে হবে।

```ts
import { NextRequest } from 'next/server';
import connectDB from '@/app/api/utils/mongoose';
import Enrollment from '@/app/api/enrollments/v1/model';
import { getBaseUrl, redirect303, verifyPipraPayment } from '../utils';

export async function GET(req: NextRequest) {
  const base = getBaseUrl(req);
  const ppId = req.nextUrl.searchParams.get('pp_id') || req.nextUrl.searchParams.get('invoice_id') || '';

  if (!ppId) {
    return redirect303(`${base}/payment/fail?reason=missing_pp_id`);
  }

  try {
    const verified = await verifyPipraPayment(ppId);

    if (verified?.status !== 'completed') {
      return redirect303(`${base}/payment/fail?tran_id=${ppId}&reason=not_completed`);
    }

    await connectDB();
    await Enrollment.findOneAndUpdate(
      { $or: [{ pipraPayId: ppId }, { tranId: ppId }] },
      {
        paymentStatus: 'completed',
        studentsStatus: 'running',
        pipraTransactionId: verified.transaction_id || null,
      },
    );

    return redirect303(`${base}/payment/success?tran_id=${ppId}`);
  } catch (err) {
    console.error('PipraPay return error:', err);
    return redirect303(`${base}/payment/fail?tran_id=${ppId}&reason=server_error`);
  }
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const ppId = String(formData.get('pp_id') || formData.get('invoice_id') || '');
  const base = getBaseUrl(req);

  if (!ppId) {
    return redirect303(`${base}/payment/fail?reason=missing_pp_id`);
  }

  return redirect303(`${base}/api/payment/piprapay/return?pp_id=${encodeURIComponent(ppId)}`);
}
```

## ধাপ ৪: Cancel Route

ফাইল: `src/app/api/payment/piprapay/cancel/route.ts`

```ts
import { NextRequest } from 'next/server';
import connectDB from '@/app/api/utils/mongoose';
import Enrollment from '@/app/api/enrollments/v1/model';
import { getBaseUrl, redirect303 } from '../utils';

export async function GET(req: NextRequest) {
  const base = getBaseUrl(req);
  const ppId = req.nextUrl.searchParams.get('pp_id') || req.nextUrl.searchParams.get('invoice_id') || '';

  if (ppId) {
    await connectDB();
    await Enrollment.findOneAndUpdate(
      { $or: [{ pipraPayId: ppId }, { tranId: ppId }] },
      { paymentStatus: 'failed' },
    );
  }

  return redirect303(`${base}/payment/cancel?tran_id=${ppId}`);
}
```

## ধাপ ৫: Webhook Route

ফাইল: `src/app/api/payment/piprapay/webhook/route.ts`

PipraPay webhook JSON payload পাঠায়। Webhook পেলেই আবার Verify Payment API call করে double verification করা safest।

```ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/api/utils/mongoose';
import Enrollment from '@/app/api/enrollments/v1/model';
import { verifyPipraPayment } from '../utils';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const ppId = String(payload?.pp_id || '');

    if (!ppId) {
      return NextResponse.json({ ok: false, message: 'Missing pp_id' }, { status: 400 });
    }

    const verified = await verifyPipraPayment(ppId);

    if (verified?.status !== 'completed') {
      return NextResponse.json({ ok: true, ignored: true });
    }

    await connectDB();
    await Enrollment.findOneAndUpdate(
      { $or: [{ pipraPayId: ppId }, { tranId: ppId }] },
      {
        paymentStatus: 'completed',
        studentsStatus: 'running',
        pipraTransactionId: verified.transaction_id || payload.transaction_id || null,
      },
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('PipraPay webhook error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
```

## ধাপ ৬: Frontend থেকে Init Call

`src/app/purchase/page.tsx` বা `src/app/courses/page.tsx` থেকে:

```ts
const res = await fetch('/api/payment/piprapay/init', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    studentName,
    studentEmail,
    studentPhone,
    enrollCoursesIDS,
    realPrice,
    discountPrice,
    paymentAmount,
    couponCode,
  }),
});

const data = await res.json();

if (data.ok && data.redirectUrl) {
  window.location.href = data.redirectUrl;
}
```

## Important Notes

- API key কখনও frontend এ রাখবেন না।
- Payment success page এ শুধু URL parameter দেখে enrollment complete করবেন না; সবসময় Verify Payment API call করতে হবে।
- Webhook কে backup confirmation হিসেবে রাখুন।
- PipraPay docs এ `create-charge` header ছোট হাতের `mh-piprapay-api-key`, আর `verify-payment` এ `MHS-PIPRAPAY-API-KEY` দেখানো হয়েছে। Node/HTTP header case-insensitive হলেও docs অনুযায়ী ব্যবহার করা ভালো।
- `return_type: 'GET'` দিলে return route সহজ হয়। `POST` দিলে callback থেকে frontend result page এ redirect করতে `303` ব্যবহার করুন।

## API Endpoint Summary

| Endpoint | Method | কাজ |
|---|---:|---|
| `/api/payment/piprapay/init` | POST | Enrollment pending করে PipraPay payment তৈরি |
| `/api/payment/piprapay/return` | GET/POST | Payment return verify করে completed/failed করা |
| `/api/payment/piprapay/cancel` | GET | Cancel হলে enrollment failed করা |
| `/api/payment/piprapay/webhook` | POST | Server-to-server backup confirmation |

## Test Checklist

1. `.env.local` এ `PIPRAPAY_BASE_URL` এবং `PIPRAPAY_API_KEY` দিন।
2. Course purchase থেকে init API call হচ্ছে কিনা দেখুন।
3. Response এ `pp_url` আসছে কিনা দেখুন।
4. Payment শেষে `/api/payment/piprapay/return?pp_id=...` hit হচ্ছে কিনা দেখুন।
5. Verify Payment API response `status: completed` হলে enrollment `paymentStatus: completed` এবং `studentsStatus: running` হচ্ছে কিনা দেখুন।
6. Cancel করলে `/payment/cancel` page এ যাচ্ছে এবং enrollment failed হচ্ছে কিনা দেখুন।
