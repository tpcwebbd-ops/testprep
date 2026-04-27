# SSLCommerz পেমেন্ট গেটওয়ে — সম্পূর্ণ গাইড

## ভূমিকা

SSLCommerz বাংলাদেশের সবচেয়ে জনপ্রিয় পেমেন্ট গেটওয়ে। এটি Card, bKash, Nagad, Rocket, এবং ব্যাংক ট্রান্সফারসহ বিভিন্ন পেমেন্ট পদ্ধতি সমর্থন করে। এই প্রজেক্টে (TestPrep) SSLCommerz ব্যবহার করে কোর্স এনরোলমেন্টের পেমেন্ট নেওয়া হয়।

---

## কীভাবে কাজ করে — Flow চিত্র

```
ব্যবহারকারী
    │
    │  "Pay with SSLCommerz" ক্লিক করে
    ▼
Next.js Frontend (/purchase)
    │
    │  POST /api/payment/sslcommerz/init
    ▼
Backend Init Route
    │  ১. Enrollment তৈরি করে (status: pending)
    │  ২. SSLCommerz API-তে session তৈরির request পাঠায়
    │  ৩. SSLCommerz থেকে GatewayPageURL পায়
    │  ৪. Frontend-কে GatewayPageURL ফেরত দেয়
    ▼
Frontend → window.location.href = GatewayPageURL
    │
    ▼
SSLCommerz Hosted Payment Page
    │  ব্যবহারকারী পেমেন্ট করে (Card/bKash/Nagad ইত্যাদি)
    │
    ├── সফল হলে → POST /api/payment/sslcommerz/success
    ├── ব্যর্থ হলে → POST /api/payment/sslcommerz/fail
    └── বাতিল করলে → POST /api/payment/sslcommerz/cancel
         │
         ▼
    Backend Callback Route
         │  ১. val_id দিয়ে SSLCommerz Validation API-তে যাচাই করে
         │  ২. Enrollment update করে (status: completed/failed)
         │  ৩. 303 redirect পাঠায় frontend page-এ
         ▼
    Frontend Result Page (/payment/success বা /payment/fail)
```

---

## গুরুত্বপূর্ণ বিষয়: 303 Redirect কেন?

SSLCommerz callback-গুলো **POST request** হিসেবে আসে। কিন্তু frontend page শুধু GET request বোঝে।

- **307 redirect** → browser আবার POST পাঠায় → frontend 405 error দেয়  
- **303 redirect** → browser সবসময় GET দিয়ে follow করে → সঠিকভাবে কাজ করে

তাই সব callback route-এ `status: 303` ব্যবহার করা হয়েছে।

---

## Environment Variables

`.env.local` ফাইলে এই variables যোগ করতে হবে:

```env
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password
SSLCOMMERZ_SANDBOX=true
NEXT_PUBLIC_BASE_URL=https://testprep-bd.vercel.app
```

- **Sandbox mode**: `SSLCOMMERZ_SANDBOX=true` — test এর সময়
- **Production mode**: `SSLCOMMERZ_SANDBOX=false` — live করার সময়

---

## ধাপ ১ — Init Route তৈরি

ফাইল: `src/app/api/payment/sslcommerz/init/route.ts`

এই route-টি পেমেন্ট শুরু করে।

```typescript
// ব্যবহারকারীর তথ্য নিয়ে একটি pending enrollment তৈরি করে
const enrollment = await Enrollment.create({
  studentName,
  studentEmail,
  paymentStatus: 'pending',
  tranId,  // unique transaction ID
  ...
});

// SSLCommerz-এ session তৈরির request
const params = new URLSearchParams({
  store_id: process.env.SSLCOMMERZ_STORE_ID,
  store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,
  total_amount: String(paymentAmount),
  currency: 'BDT',
  tran_id: tranId,
  success_url: `${baseUrl}/api/payment/sslcommerz/success`,  // API route
  fail_url: `${baseUrl}/api/payment/sslcommerz/fail`,        // API route
  cancel_url: `${baseUrl}/api/payment/sslcommerz/cancel`,    // API route
  ipn_url: `${baseUrl}/api/payment/sslcommerz/ipn`,
  cus_name: studentName,
  cus_email: studentEmail,
  ...
});

// SSLCommerz API call
const response = await fetch(INIT_URL, { method: 'POST', body: params });
const data = await response.json();

// Frontend-কে GatewayPageURL ফেরত দেওয়া
return NextResponse.json({ ok: true, redirectUrl: data.GatewayPageURL });
```

**গুরুত্বপূর্ণ**: `success_url`, `fail_url`, `cancel_url` হবে **API route**, frontend page নয়।

---

## ধাপ ২ — Success Callback Route

ফাইল: `src/app/api/payment/sslcommerz/success/route.ts`

SSLCommerz পেমেন্ট সফল হলে এই route-এ POST পাঠায়।

```typescript
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const tranId = formData.get('tran_id');
  const valId = formData.get('val_id');
  const status = formData.get('status');

  // ১. Status যাচাই
  if (status !== 'VALID' && status !== 'VALIDATED') {
    return redirect303(`${base}/payment/fail?reason=invalid_status`);
  }

  // ২. SSLCommerz Validation API দিয়ে আবার যাচাই (double verification)
  const validateResponse = await fetch(`${VALIDATE_URL}?val_id=${valId}&...`);
  const validateData = await validateResponse.json();

  if (validateData.status !== 'VALID') {
    return redirect303(`${base}/payment/fail?reason=validation_failed`);
  }

  // ৩. Database update
  await Enrollment.findOneAndUpdate(
    { tranId },
    { paymentStatus: 'completed', studentsStatus: 'running', sslValId: valId }
  );

  // ৪. 303 redirect → frontend success page
  return redirect303(`${base}/payment/success?tran_id=${tranId}`);
}
```

---

## ধাপ ৩ — Fail ও Cancel Callback Routes

ফাইল: `src/app/api/payment/sslcommerz/fail/route.ts`  
ফাইল: `src/app/api/payment/sslcommerz/cancel/route.ts`

```typescript
// Fail route
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const tranId = formData.get('tran_id');

  // Enrollment fail হিসেবে mark করা
  await Enrollment.findOneAndUpdate({ tranId }, { paymentStatus: 'failed' });

  // 303 redirect → frontend fail page
  return redirect303(`${base}/payment/fail?tran_id=${tranId}`);
}
```

---

## ধাপ ৪ — IPN (Instant Payment Notification)

ফাইল: `src/app/api/payment/sslcommerz/ipn/route.ts`

IPN হলো backup system। যদি ব্যবহারকারীর browser redirect ব্যর্থ হয় (connection cut, browser বন্ধ), SSLCommerz সরাসরি server-এ IPN পাঠায়।

```typescript
export async function POST(req: NextRequest) {
  // success route-এর মতোই validation করে
  // কিন্তু redirect করে না, শুধু database update করে
  await Enrollment.findOneAndUpdate(
    { tranId },
    { paymentStatus: 'completed', sslValId: valId }
  );
  return NextResponse.json({ ok: true });
}
```

---

## ধাপ ৫ — Frontend Purchase Page আপডেট

ফাইল: `src/app/purchase/page.tsx`

আগে সরাসরি enrollment তৈরি হতো, এখন SSLCommerz-এ redirect করে।

```typescript
const handleSubmit = async (e) => {
  // Init API call
  const res = await fetch('/api/payment/sslcommerz/init', {
    method: 'POST',
    body: JSON.stringify({ studentName, studentEmail, paymentAmount, ... }),
  });
  const data = await res.json();

  // SSLCommerz hosted page-এ redirect
  if (data.ok && data.redirectUrl) {
    window.location.href = data.redirectUrl;
  }
};
```

---

## ধাপ ৬ — Enrollment Model আপডেট

ফাইল: `src/app/api/enrollments/v1/model.ts`

দুটি নতুন field যোগ করা হয়েছে:

```typescript
tranId: { type: String, default: null },   // SSLCommerz transaction ID
sslValId: { type: String, default: null }, // SSLCommerz validation ID
```

---

## Result Pages

| Route | কখন দেখায় |
|-------|-----------|
| `/payment/success` | পেমেন্ট সফল ও যাচাই সম্পন্ন |
| `/payment/fail` | পেমেন্ট ব্যর্থ বা যাচাই ব্যর্থ |
| `/payment/cancel` | ব্যবহারকারী পেমেন্ট বাতিল করেছে |

---

## Sandbox Test Cards

| Card Type | Number | OTP |
|-----------|--------|-----|
| VISA | `4111111111111111` | `111111` |
| MasterCard | `5111111111111111` | `111111` |
| AMEX | `371111111111111` | `111111` |

---

## API Endpoints সারসংক্ষেপ

| Endpoint | Method | উদ্দেশ্য |
|----------|--------|---------|
| `/api/payment/sslcommerz/init` | POST | পেমেন্ট session শুরু করে |
| `/api/payment/sslcommerz/success` | POST | সফল পেমেন্ট handle করে |
| `/api/payment/sslcommerz/fail` | POST | ব্যর্থ পেমেন্ট handle করে |
| `/api/payment/sslcommerz/cancel` | POST | বাতিল পেমেন্ট handle করে |
| `/api/payment/sslcommerz/ipn` | POST | Backup notification handle করে |

---

## Sandbox vs Production

| বিষয় | Sandbox | Production |
|------|---------|------------|
| Base URL | `sandbox.sslcommerz.com` | `securepay.sslcommerz.com` |
| Credentials | Test store ID/password | Live store ID/password |
| `SSLCOMMERZ_SANDBOX` | `true` | `false` |
| আসল টাকা কাটে? | না | হ্যাঁ |
