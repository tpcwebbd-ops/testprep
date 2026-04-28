# Facebook Pixel (Meta Pixel) — সম্পূর্ণ গাইড

## বর্তমান Implementation Status

| বিষয়                                | অবস্থা                   | ফাইল                                         | Branch                  |
| ------------------------------------ | ------------------------ | -------------------------------------------- | ----------------------- |
| FacebookPixel Component (base code)  | ✅ তৈরি                  | `src/components/facebook-pixel.tsx`          | `claude/fbp`            |
| FacebookPixelPageView (SPA tracking) | ✅ তৈরি                  | `src/components/facebook-pixel-pageview.tsx` | `claude/fbp`            |
| Unified Tracking Helpers             | ✅ তৈরি                  | `src/lib/tracking.ts`                        | `claude/fbp`            |
| Root Layout-এ FBP যোগ                | ⚠️ **main branch-এ নেই** | `src/app/layout.tsx`                         | main-এ merge দরকার      |
| Server-side Conversions API (CAPI)   | ✅ সম্পন্ন               | `src/lib/fb-capi.ts`                         | `claude/fbp` + worktree |

---

## ভূমিকা

Facebook Pixel (Meta Pixel) হলো একটি tracking code যা website-এ ব্যবহারকারীর আচরণ track করে এবং Facebook/Instagram বিজ্ঞাপনকে কার্যকর করে। এই প্রজেক্টে (TestPrep) Next.js App Router-এর সাথে integrate করা হয়েছে।

---

## Client-side Tracking vs Server-side Tracking

### Client-side Tracking (বর্তমানে implemented)

```
ব্যবহারকারীর Browser
    │
    │  fbq() JavaScript call
    ▼
Facebook/Meta Server
    │  IP address, cookies, browser fingerprint দিয়ে user match করে
    ▼
Ad Platform → Conversion record, audience তৈরি
```

**সুবিধা:**

- Setup সহজ, শুধু script বসালেই হয়
- Real-time event testing (Meta Events Manager-এ)
- Standard events (PageView, Purchase) built-in support

**অসুবিধা:**

- **Ad blocker block করে** — iOS/Android Safari ও block করে
- **iOS 14+ ATT (App Tracking Transparency)** — user permission না দিলে data পায় না
- Browser বন্ধ হলে event miss হয়
- Third-party cookie ব্যান হচ্ছে — accuracy কমছে
- Facebook report করে event কম দেখায়

### Server-side Tracking — Conversions API (CAPI) (✅ Implemented)

```
SSLCommerz Payment Validated
    │
    ▼
Next.js API Route (success/route.ts)
    │  sendCapiPurchase({ tranId, value, userData: { email, ip, ua, fbp, fbc } })
    │
    ▼  POST https://graph.facebook.com/v19.0/{pixel_id}/events
Facebook/Meta Graph API
    │
    ▼
Ad Platform → highly accurate conversion data (ad blocker bypass)
```

**সুবিধা:**

- Ad blocker bypass — server থেকে পাঠালে block হওয়ার সুযোগ নেই
- iOS 14+ ATT restriction-এর প্রভাব নেই
- Purchase event SSLCommerz validation-এর পরে পাঠানো হয় — 100% reliable
- First-party data — privacy law-এ নিরাপদ
- IP + UA + fbp + fbc → Facebook match rate উন্নত হয়
- PII (email) SHA-256 hashed — Meta-র requirement পূরণ হয়

**অসুবিধা:**

- `event_id` দিয়ে client + server event deduplicate করতে হয়
- `FB_ACCESS_TOKEN` সুরক্ষিত রাখতে হবে (server-only env var)

### Client + Server Combined (Best Practice)

```
Browser → fbq('track', 'Purchase', {...}, { eventID: 'evt-123' })
                                                    │ একই event_id
Server → CAPI POST with { event_id: 'evt-123' }    ┘

Facebook উভয় event receive করে কিন্তু event_id দিয়ে
শুধু একটি conversion count করে (no duplicate)
```

### কোনটা ব্যবহার করবেন?

| পরিস্থিতি                             | সুপারিশ              |
| ------------------------------------- | -------------------- |
| শুরুতে, সীমিত budget                  | Client-side যথেষ্ট   |
| বিজ্ঞাপনে ব্যয় বেশি (৳৫০,০০০+/মাস)   | Client + Server CAPI |
| Purchase/Revenue এর accurate data চাই | Server CAPI অবশ্যই   |
| iOS user অনেক বেশি                    | Server CAPI দরকার    |

---

## কীভাবে কাজ করে — বর্তমান Flow

```
Page Load
    │
    │  <FacebookPixel pixelId="..." />
    ▼
next/script (afterInteractive) → fbevents.js load
    │
    │  fbq('init', pixelId) → Pixel initialize
    │  fbq('track', 'PageView') → প্রথম PageView
    ▼
Facebook Server → user record

Route পরিবর্তন হলে (SPA navigation):
    │
    │  FacebookPixelPageView component detect করে
    │  fbq('track', 'PageView')
    ▼
Facebook Server → নতুন page visit record
```

---

## Installation (ধাপে ধাপে)

### ধাপ ১: Environment Variable

`.env.local` ফাইলে:

```env
NEXT_PUBLIC_FB_PIXEL_ID=123456789012345
```

Pixel ID পাওয়া যাবে: **Meta Events Manager → Data Sources → Pixels**

### ধাপ ২: FacebookPixel Component

ফাইল: `src/components/facebook-pixel.tsx`

```typescript
'use client';

import Script from 'next/script';

export default function FacebookPixel({ pixelId }: { pixelId?: string }) {
  if (!pixelId) return null;

  return (
    <Script id="meta-pixel-base" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');`}
    </Script>
  );
}
```

**কেন `strategy="afterInteractive"`?**

| Strategy            | কখন load হয়                | Pixel-এর জন্য?          |
| ------------------- | --------------------------- | ----------------------- |
| `beforeInteractive` | Page interactive হওয়ার আগে | ❌ Performance নষ্ট করে |
| `afterInteractive`  | Page interactive হওয়ার পরে | ✅ সঠিক                 |
| `lazyOnload`        | সব শেষে                     | ⚠️ দেরিতে fire হয়      |

### ধাপ ৩: FacebookPixelPageView Component

ফাইল: `src/components/facebook-pixel-pageview.tsx`

```typescript
'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export default function FacebookPixelPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return; // initial PageView FacebookPixel component-এ হয়েছে
    }
    window.fbq?.('track', 'PageView');
  }, [pathname, searchParams]);

  return null;
}
```

### ধাপ ৪: Root Layout-এ যোগ করুন

ফাইল: `src/app/layout.tsx`

```typescript
import { Suspense } from 'react';
import FacebookPixel from '@/components/facebook-pixel';
import FacebookPixelPageView from '@/components/facebook-pixel-pageview';

export default async function RootLayout({ children }) {
  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

  return (
    <html lang="en">
      <body>
        {children}
        <FacebookPixel pixelId={pixelId} />
        <Suspense fallback={null}>
          <FacebookPixelPageView />
        </Suspense>
      </body>
    </html>
  );
}
```

> ⚠️ **এই পরিবর্তন `main` branch-এ এখনো নেই।** `claude/fbp` branch merge করতে হবে।

---

## Tracking Helper Functions

ফাইল: `src/lib/tracking.ts` (claude/fbp branch-এ আছে)

GTM এবং Facebook Pixel একসাথে fire করে:

```typescript
'use client';

import { sendGTMEvent } from '@next/third-parties/google';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackAddToCart(value: number, currency = 'BDT') {
  sendGTMEvent({ event: 'add_to_cart', value, currency });
  window.fbq?.('track', 'AddToCart', { value, currency });
}

export function trackPurchase(tranId: string, value: number, currency = 'BDT') {
  sendGTMEvent({ event: 'purchase', transaction_id: tranId, value, currency });
  window.fbq?.('track', 'Purchase', { value, currency });
}

export function trackEnrollmentStart(courseIds: string[]) {
  sendGTMEvent({ event: 'begin_checkout', course_ids: courseIds });
  window.fbq?.('track', 'InitiateCheckout');
}

export function trackViewContent(courseId: string, value?: number, currency = 'BDT') {
  sendGTMEvent({ event: 'view_item', item_id: courseId, value, currency });
  window.fbq?.('track', 'ViewContent', { content_ids: [courseId], value, currency });
}
```

---

## Standard Events — কোনটা কখন fire করবেন

| Event              | Function                 | কোথায় fire করবেন                                  |
| ------------------ | ------------------------ | -------------------------------------------------- |
| `PageView`         | Auto                     | প্রতিটি route change-এ (automatic)                 |
| `ViewContent`      | `trackViewContent()`     | Course detail page                                 |
| `AddToCart`        | `trackAddToCart()`       | Course select করলে                                 |
| `InitiateCheckout` | `trackEnrollmentStart()` | Checkout button ক্লিক                              |
| `Purchase`         | `trackPurchase()`        | `/payment/success` page-এ (টাকা confirm হওয়ার পর) |

---

## গুরুত্বপূর্ণ নিয়ম

### ১. Purchase কখন fire করবেন

```typescript
// ❌ ভুল
<button onClick={() => trackPurchase(...)}>Pay Now</button>

// ✅ সঠিক — /payment/success page-এ, payment verified হওয়ার পর
useEffect(() => {
  trackPurchase(tranId, amount);
}, []);
```

### ২. Duplicate Pixel বসাবেন না

```
Code-এ Pixel আছে + GTM-এও Pixel tag আছে
= প্রতিটি event দুবার record হবে
= Conversion inflated দেখাবে
```

### ৩. value এবং currency সবসময় দিন

```typescript
// ❌
fbq('track', 'Purchase');

// ✅ — Facebook ROAS calculation-এর জন্য জরুরি
fbq('track', 'Purchase', { value: 1200, currency: 'BDT' });
```

---

## Server-side Conversions API (CAPI) — ✅ Implemented

ফাইল: `src/lib/fb-capi.ts` — `claude/fbp` branch ও `claude/quizzical-borg-51f67e` worktree

### Environment Variables

`.env.local` এবং Vercel dashboard-এ যোগ করুন:

```env
FB_PIXEL_ID=123456789012345
FB_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxx
```

`FB_ACCESS_TOKEN` পাওয়া যাবে:  
**Meta Business Manager → System Users → আপনার System User → Generate Token → ads_management + business_management**

> ⚠️ `FB_ACCESS_TOKEN` কখনো `NEXT_PUBLIC_` prefix দেবেন না — browser-এ expose হবে।

### মূল Functions

```typescript
// server-side purchase event (SSLCommerz success-এ call হয়)
sendCapiPurchase({ tranId, value, currency, userData, sourceUrl });

// server-side checkout initiation
sendCapiInitiateCheckout({ value, currency, userData, contentIds, sourceUrl });

// request header থেকে data extract করার helpers
getClientIp(headers); // x-forwarded-for / x-real-ip
getUserAgent(headers); // User-Agent string
getFbCookies(headers); // _fbp এবং _fbc cookies
```

### SSLCommerz Success Route-এ Integration

ফাইল: `src/app/api/payment/sslcommerz/success/route.ts`

```typescript
import { sendCapiPurchase, getClientIp, getUserAgent, getFbCookies } from '@/lib/fb-capi';

// Payment validated + DB updated হওয়ার পর:
const { fbp, fbc } = getFbCookies(req.headers);

await sendCapiPurchase({
  tranId,
  value: enrollment.paymentAmount,
  currency: 'BDT',
  userData: {
    email: enrollment.studentEmail, // SHA-256 হয় inside the function
    clientIp: getClientIp(req.headers),
    userAgent: getUserAgent(req.headers),
    fbp, // _fbp cookie — match rate বাড়ায়
    fbc, // _fbc cookie — click attribution উন্নত করে
  },
  sourceUrl: req.headers.get('referer') ?? undefined,
});
```

### SHA-256 Hashing

CAPI-তে PII (Personally Identifiable Information) hash করে পাঠাতে হয়। `fb-capi.ts` এটি internally করে:

```typescript
// আপনাকে manually hash করতে হবে না
// raw email দিলেই function SHA-256 hash করে পাঠাবে
userData: {
  email: 'user@example.com'; // ✅ — fb-capi.ts নিজেই hash করবে
}
```

### Deduplication — event_id

Client-side `fbq()` এবং server-side CAPI একই Purchase event-এর জন্য দুটো request পাঠায়। Facebook এদের deduplicate করে শুধু একটি conversion count করে।

```
Server CAPI:
  event_id = "purchase-TXN-abc123"

Client fbq() — /payment/success page-এ:
  fbq('track', 'Purchase',
    { value: 1200, currency: 'BDT' },
    { eventID: 'purchase-TXN-abc123' }  ← same event_id
  );

Facebook: দুটো receive করে → event_id match → একটিই count করে ✅
```

### fb-capi.ts এর পূর্ণ Flow

```typescript
sendCapiPurchase({ tranId: 'TXN-abc', value: 1200, userData: { email, ip, ua, fbp, fbc } })
    │
    ├── email → sha256('user@example.com') → 'a665a4...'
    ├── event_id = 'purchase-TXN-abc'
    ├── event_time = Math.floor(Date.now() / 1000)
    │
    ▼
POST https://graph.facebook.com/v19.0/{FB_PIXEL_ID}/events?access_token={FB_ACCESS_TOKEN}
{
  data: [{
    event_name: 'Purchase',
    event_time: 1714123456,
    event_id: 'purchase-TXN-abc',
    action_source: 'website',
    user_data: { em: ['a665a4...'], client_ip_address: '...', client_user_agent: '...', fbp: '...', fbc: '...' },
    custom_data: { value: 1200, currency: 'BDT', order_id: 'TXN-abc' }
  }]
}
```

---

## Verify করুন

**Meta Events Manager-এ:**

1. Events Manager → আপনার Pixel
2. "Test Events" tab
3. Website visit করুন → events real-time দেখা যাবে

**Browser Console-এ:**

```javascript
// Pixel load হয়েছে কিনা check
console.log(typeof window.fbq); // "function" হলে load হয়েছে
```

---

## সারসংক্ষেপ

| ফাইল                                              | উদ্দেশ্য                              | Status                | Branch                  |
| ------------------------------------------------- | ------------------------------------- | --------------------- | ----------------------- |
| `src/components/facebook-pixel.tsx`               | Base Pixel code load                  | ✅                    | `claude/fbp`            |
| `src/components/facebook-pixel-pageview.tsx`      | SPA PageView tracking                 | ✅                    | `claude/fbp`            |
| `src/lib/tracking.ts`                             | GTM + FBP client-side unified helpers | ✅                    | `claude/fbp`            |
| `src/lib/fb-capi.ts`                              | Server-side Conversions API           | ✅                    | `claude/fbp` + worktree |
| `src/app/layout.tsx` — FBP added                  | FBP globally load                     | ⚠️ main-এ merge দরকার | `claude/fbp`            |
| `src/app/api/payment/sslcommerz/success/route.ts` | Server-side CAPI fire                 | ✅                    | worktree                |

## সব Env Vars একসাথে

```env
# Client-side (NEXT_PUBLIC_ — browser-এ দেখা যায়, তাই শুধু non-sensitive)
NEXT_PUBLIC_FB_PIXEL_ID=123456789012345

# Server-side only (NEXT_PUBLIC_ দেবেন না)
FB_PIXEL_ID=123456789012345
FB_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxx
```

## তিনটি Integration — সম্পূর্ণ Flow

```
SSLCommerz Payment Confirmed (server-validated)
    │
    ├── Server → sendCapiPurchase(...)
    │       └── Facebook CAPI (ad blocker bypass, iOS safe)
    │
    ├── Server → sendGA4Purchase(...)
    │       └── GA4 Measurement Protocol (ad blocker bypass)
    │
    ▼
303 Redirect → /payment/success?tran_id=TXN-abc
    │
    ▼
Browser /payment/success page
    │
    ├── trackPurchase('TXN-abc', 1200)  [client-side]
    │       ├── sendGTMEvent('purchase') → GTM → GA4 + Google Ads
    │       └── fbq('Purchase', {...}, { eventID: 'purchase-TXN-abc' })
    │               └── Facebook deduplicates with server CAPI ✅
    │
    └── Duplicate protection: event_id match করলে একটিই count হয়
```
