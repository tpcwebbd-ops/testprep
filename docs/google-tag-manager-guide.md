# Google Tag Manager (GTM) — সম্পূর্ণ গাইড

## বর্তমান Implementation Status

| বিষয় | অবস্থা | ফাইল | Branch |
|------|--------|------|--------|
| GTM Script (Root Layout) | ✅ সম্পন্ন | `src/app/layout.tsx` | `claude/gtm` |
| SPA Route Change Tracker | ✅ সম্পন্ন | `src/components/gtm-route-change.tsx` | `claude/gtm` |
| Client-side Event Helpers | ✅ সম্পন্ন | `src/lib/gtm.ts` | `claude/gtm` |
| Server-side GA4 Measurement Protocol | ✅ সম্পন্ন | `src/lib/ga4-mp.ts` | `claude/gtm` |
| Server-side GTM Container | ❌ করা হয়নি (infra দরকার) | — | — |

---

## ভূমিকা

Google Tag Manager হলো একটি tag management system। এটি ব্যবহার করে code পরিবর্তন না করেও website-এ নতুন tracking script যোগ করা, পুরনো script সরানো, এবং event tracking configure করা যায়। এই প্রজেক্টে (TestPrep) Next.js App Router-এর সাথে GTM integrate করা হয়েছে।

---

## Client-side Tracking vs Server-side Tracking

### Client-side Tracking (বর্তমানে implemented)

```
ব্যবহারকারীর Browser
    │
    │  JavaScript চলে (GTM script, dataLayer.push)
    ▼
Google Tag Manager (browser-এ)
    │
    ▼
Tracking Platforms (GA4, Google Ads, etc.)
```

**সুবিধা:**
- Setup সহজ, কম code লাগে
- Real-time debugging সহজ (GTM Preview mode)
- GTM UI থেকে code ছাড়াই tag manage করা যায়

**অসুবিধা:**
- Ad blocker block করতে পারে
- Browser বন্ধ হলে event হারিয়ে যায়
- Third-party cookie restrictions বাড়ছে
- Safari/Firefox ITP data সংকুচিত করে

### Server-side Tracking — GA4 Measurement Protocol (✅ implemented)

```
SSLCommerz Payment Validated
    │
    ▼
Next.js API Route (success/route.ts)
    │  sendGA4Purchase(clientId, tranId, value, 'BDT')
    │
    ▼  POST https://www.google-analytics.com/mp/collect
GA4 Measurement Protocol
    │
    ▼
GA4 → purchase event (ad blocker bypass হয়)
```

**সুবিধা:**
- Ad blocker bypass — server থেকে যায় তাই block হওয়ার সুযোগ নেই
- Purchase event payment validation-এর পর পাঠানো হয় — 100% accurate
- First-party data — GDPR/privacy আইনে ভালো অবস্থানে
- কেউ fake purchase event তৈরি করতে পারে না

**অসুবিধা:**
- শুধু `purchase` event server থেকে পাঠানো হয় (PageView, add_to_cart client-side)
- `client_id` browser cookie থেকে নিতে হয় — session stitching-এর জন্য জরুরি

### কোনটা ব্যবহার করবেন?

| পরিস্থিতি | সুপারিশ |
|-----------|---------|
| শুরুতে, ছোট project | Client-side যথেষ্ট |
| Purchase/Revenue tracking | Server-side (বেশি নির্ভরযোগ্য) |
| Ad blocker এড়াতে | Server-side |
| Marketing team tag manage করবে | Client-side GTM |

**এই প্রজেক্টের জন্য সুপারিশ:** Client-side GTM রাখুন, কিন্তু `purchase` event-টি Measurement Protocol দিয়ে server থেকেও পাঠান।

---

## কীভাবে কাজ করে — বর্তমান Flow

```
ব্যবহারকারী
    │
    │  Page load
    ▼
Root Layout → <GoogleTagManager gtmId="GTM-XXXXXXX" />
    │  GTM script browser-এ load হয়
    │  GTM container থেকে configured tags আনে
    ▼
GTM Container (Google-এর server-এ hosted)
    │
    ├── All Pages trigger → GA4 Page View tag fire
    └── Custom Event trigger সেটআপ করলে → আরো tags fire

    [Route পরিবর্তন হলে]
    │
    ▼
GtmRouteChange Component
    │  usePathname() + useSearchParams() দিয়ে detect করে
    │  sendGTMEvent({ event: 'virtual_page_view', ... })
    ▼
GTM dataLayer → configured triggers match করে → tags fire
```

---

## Installation (ধাপে ধাপে)

### ধাপ ১: Package Install

```bash
npm install @next/third-parties@latest
```

### ধাপ ২: Environment Variable

`.env.local` ফাইলে:

```env
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

GTM container ID পাওয়া যাবে: **GTM Dashboard → Admin → Container Settings**

### ধাপ ৩: Root Layout

ফাইল: `src/app/layout.tsx`

```typescript
import { Suspense } from 'react';
import { GoogleTagManager } from '@next/third-parties/google';
import GtmRouteChange from '@/components/gtm-route-change';

export default async function RootLayout({ children }) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="en">
      {/* <html> এর ভেতরে, <body> র বাইরে বসাতে হবে */}
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      <body>
        {children}
        {/* useSearchParams ব্যবহার করে তাই Suspense জরুরি */}
        <Suspense fallback={null}>
          <GtmRouteChange />
        </Suspense>
      </body>
    </html>
  );
}
```

### ধাপ ৪: GtmRouteChange Component

ফাইল: `src/components/gtm-route-change.tsx`

```typescript
'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { sendGTMEvent } from '@next/third-parties/google';

export default function GtmRouteChange() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return; // initial PageView GTM নিজেই করে, duplicate এড়ানো
    }

    const query = searchParams.toString();
    const page = query ? `${pathname}?${query}` : pathname;

    sendGTMEvent({
      event: 'virtual_page_view',
      page_path: pathname,
      page_query: query,
      page_location: window.location.href,
      page_title: document.title,
      page,
    });
  }, [pathname, searchParams]);

  return null;
}
```

### ধাপ ৫: Event Helper Functions

ফাইল: `src/lib/gtm.ts`

```typescript
'use client';

import { sendGTMEvent } from '@next/third-parties/google';

export function gtmAddToCart(value: number, currency = 'BDT') {
  sendGTMEvent({ event: 'add_to_cart', value, currency });
}

export function gtmPurchase(tranId: string, value: number, currency = 'BDT') {
  sendGTMEvent({ event: 'purchase', transaction_id: tranId, value, currency });
}

export function gtmEnrollmentStart(courseIds: string[]) {
  sendGTMEvent({ event: 'begin_checkout', course_ids: courseIds });
}
```

**ব্যবহার:**

```typescript
import { gtmPurchase } from '@/lib/gtm';

// /payment/success page-এ
gtmPurchase('TXN-abc123', 1200);
```

---

## sendGTMEvent কীভাবে কাজ করে

```typescript
// এই দুটো একই:
sendGTMEvent({ event: 'add_to_cart', value: 1200 });

window.dataLayer = window.dataLayer || [];
window.dataLayer.push({ event: 'add_to_cart', value: 1200 });
```

GTM এই event-এর `event` field দিয়ে Custom Event trigger match করে এবং সেই trigger-এ assigned tags fire করে।

---

## GTM Dashboard Configuration

Code বসানোর পরও GTM UI-তে কাজ করতে হবে।

### ১. Container Verify

GTM Dashboard → **Preview** → website visit → Tag Assistant-এ GTM দেখাবে

### ২. SPA Pageview Trigger তৈরি

**Custom Event Trigger:**
- Triggers → New → Trigger Type: **Custom Event**
- Event Name: `virtual_page_view`
- এই trigger দিয়ে GA4 Configuration Tag-এ "page_view" event পাঠান

### ৩. Business Event Tags

| dataLayer event | GTM Trigger | Tag action |
|----------------|-------------|------------|
| `virtual_page_view` | Custom Event | GA4 page_view |
| `add_to_cart` | Custom Event | GA4 add_to_cart |
| `purchase` | Custom Event | GA4 purchase + Google Ads conversion |
| `begin_checkout` | Custom Event | GA4 begin_checkout |

### ৪. Data Layer Variables তৈরি

GTM → Variables → New → Data Layer Variable:

| Variable Name | Data Layer Key | কোথায় ব্যবহার |
|--------------|----------------|---------------|
| `DLV - value` | `value` | Purchase tag-এ |
| `DLV - currency` | `currency` | Purchase tag-এ |
| `DLV - transaction_id` | `transaction_id` | Purchase tag-এ |
| `DLV - page_path` | `page_path` | GA4 event-এ |

### ৫. Publish

Preview-এ সব event ঠিকমতো fire হলে → **Submit → Publish**

---

## Server-side GA4 Measurement Protocol (✅ Implemented)

ফাইল: `src/lib/ga4-mp.ts` — `claude/gtm` branch

### Environment Variables

`.env.local` এবং Vercel dashboard-এ যোগ করুন:

```env
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=xxxxxxxxxxxxxxxxxxx
```

`GA4_API_SECRET` পাওয়া যাবে:  
**GA4 Admin → Data Streams → আপনার stream → Measurement Protocol API secrets → Create**

### মূল Functions

```typescript
// server-side purchase event
sendGA4Purchase(clientId, tranId, value, currency, items, sessionId)

// _ga cookie থেকে client_id বের করা
extractGA4ClientId(gaCookie)

// generic events
sendGA4Events(clientId, events, sessionId)
```

### SSLCommerz Success Route-এ Integration

ফাইল: `src/app/api/payment/sslcommerz/success/route.ts`

```typescript
import { sendGA4Purchase, extractGA4ClientId } from '@/lib/ga4-mp';

// Payment validated হওয়ার পর, DB update-এর পর:
const gaCookie = req.cookies.get('_ga')?.value;

await sendGA4Purchase(
  extractGA4ClientId(gaCookie),  // browser session-এর সাথে stitching
  tranId,
  enrollment.paymentAmount,
  'BDT',
);
```

### client_id কেন জরুরি?

```
Browser-এ _ga cookie = "GA1.1.1234567890.1234567890"
                               └─────────┬─────────┘
                               এই অংশটি client_id

extractGA4ClientId("GA1.1.1234567890.1234567890")
  → "1234567890.1234567890"
```

Server-side event-এ এই `client_id` না দিলে GA4 event-টি কোনো user-এর সাথে match করতে পারে না — conversion report ভুল দেখায়।

### Client + Server Combined Flow

```
Browser (client-side GTM)          Server (Measurement Protocol)
         │                                    │
         │ sendGTMEvent('purchase')            │ sendGA4Purchase(clientId, ...)
         │ → GTM dataLayer                    │ → GA4 directly
         │ → GA4 via GTM                      │
         │                                    │
         └──── same transaction_id ───────────┘
                GA4 deduplicates automatically
```

### GTM Server Container (ভবিষ্যত — করা হয়নি)

```
Browser → GTM Web Container → GTM Server Container (Cloud Run)
                               ├── GA4 Measurement Protocol
                               ├── Google Ads Conversion API
                               └── Meta CAPI
```

এটি আরো উন্নত setup — Cloud infra লাগে, এই প্রজেক্টে এখনো নেই।

---

## সারসংক্ষেপ

| ফাইল | উদ্দেশ্য | Status |
|------|---------|--------|
| `src/app/layout.tsx` | GTM script globally load | ✅ |
| `src/components/gtm-route-change.tsx` | SPA route change track | ✅ |
| `src/lib/gtm.ts` | Client-side event helpers | ✅ |
| `src/lib/ga4-mp.ts` | Server-side GA4 Measurement Protocol | ✅ |
| `src/app/api/payment/sslcommerz/success/route.ts` | Server-side purchase event fire | ✅ |
| GTM Server Container | Full server-side tag management | ❌ (infra দরকার) |
