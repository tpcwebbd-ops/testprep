/**
 * Facebook Conversions API (CAPI) — server-side event tracking
 * Docs: https://developers.facebook.com/docs/marketing-api/conversions-api
 *
 * Required env vars:
 *   FB_PIXEL_ID      — numeric Pixel/Dataset ID
 *   FB_ACCESS_TOKEN  — System User access token from Meta Business Manager
 *
 * Deduplication:
 *   Pass the same event_id from both client fbq() and server CAPI.
 *   Facebook counts only one conversion even if both arrive.
 *
 *   Client:  fbq('track', 'Purchase', { value, currency }, { eventID: 'purchase-TXN-abc' })
 *   Server:  sendCapiPurchase({ tranId: 'TXN-abc', ... })
 *            → internally uses event_id = `purchase-${tranId}`
 */

import { createHash } from 'crypto';

const CAPI_URL = 'https://graph.facebook.com/v19.0';

// ── helpers ──────────────────────────────────────────────────────────────────

function sha256(value: string): string {
  return createHash('sha256').update(value.toLowerCase().trim()).digest('hex');
}

// ── types ─────────────────────────────────────────────────────────────────────

interface CapiUserData {
  email?: string;
  phone?: string;
  /** Client IP address — from request headers */
  clientIp?: string;
  /** User-Agent string — from request headers */
  userAgent?: string;
  /** fbp cookie value (_fbp) — for better match rate */
  fbp?: string;
  /** fbc cookie value (_fbc) — click ID, improves attribution */
  fbc?: string;
}

interface CapiCustomData {
  value?: number;
  currency?: string;
  content_ids?: string[];
  content_name?: string;
  content_type?: string;
  order_id?: string;
  [key: string]: unknown;
}

interface CapiEvent {
  event_name: string;
  event_time: number;
  event_id?: string;
  event_source_url?: string;
  action_source: 'website' | 'app' | 'email' | 'phone_call' | 'other';
  user_data: Record<string, unknown>;
  custom_data?: CapiCustomData;
}

// ── core send function ────────────────────────────────────────────────────────

/**
 * Send one or more events to Meta CAPI.
 * All PII (email, phone) is SHA-256 hashed before sending.
 */
export async function sendCapiEvents(events: CapiEvent[]): Promise<void> {
  const pixelId = process.env.FB_PIXEL_ID;
  const accessToken = process.env.FB_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    console.warn('FB CAPI: FB_PIXEL_ID or FB_ACCESS_TOKEN not set');
    return;
  }

  try {
    const res = await fetch(
      `${CAPI_URL}/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: events }),
      },
    );

    const body = await res.json();
    if (!res.ok) {
      console.error('FB CAPI error:', body);
    }
  } catch (err) {
    console.error('FB CAPI: fetch error', err);
  }
}

// ── user_data builder ─────────────────────────────────────────────────────────

function buildUserData(ud: CapiUserData): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (ud.email) result.em = [sha256(ud.email)];
  if (ud.phone) result.ph = [sha256(ud.phone)];
  if (ud.clientIp) result.client_ip_address = ud.clientIp;
  if (ud.userAgent) result.client_user_agent = ud.userAgent;
  if (ud.fbp) result.fbp = ud.fbp;
  if (ud.fbc) result.fbc = ud.fbc;
  return result;
}

// ── standard event helpers ────────────────────────────────────────────────────

/**
 * Fire a Purchase event server-side (call from SSLCommerz success callback).
 * Uses event_id = `purchase-${tranId}` — pass same ID to browser fbq() for deduplication.
 */
export async function sendCapiPurchase(opts: {
  tranId: string;
  value: number;
  currency?: string;
  userData: CapiUserData;
  sourceUrl?: string;
}): Promise<void> {
  const { tranId, value, currency = 'BDT', userData, sourceUrl } = opts;

  await sendCapiEvents([
    {
      event_name: 'Purchase',
      event_time: Math.floor(Date.now() / 1000),
      event_id: `purchase-${tranId}`,
      action_source: 'website',
      ...(sourceUrl && { event_source_url: sourceUrl }),
      user_data: buildUserData(userData),
      custom_data: {
        value,
        currency,
        order_id: tranId,
        content_type: 'product',
      },
    },
  ]);
}

/**
 * Fire an InitiateCheckout event server-side.
 */
export async function sendCapiInitiateCheckout(opts: {
  value: number;
  currency?: string;
  userData: CapiUserData;
  contentIds?: string[];
  sourceUrl?: string;
}): Promise<void> {
  const { value, currency = 'BDT', userData, contentIds, sourceUrl } = opts;

  await sendCapiEvents([
    {
      event_name: 'InitiateCheckout',
      event_time: Math.floor(Date.now() / 1000),
      event_id: `checkout-${Date.now()}`,
      action_source: 'website',
      ...(sourceUrl && { event_source_url: sourceUrl }),
      user_data: buildUserData(userData),
      custom_data: {
        value,
        currency,
        ...(contentIds && { content_ids: contentIds }),
      },
    },
  ]);
}

// ── request header helpers ────────────────────────────────────────────────────

/**
 * Extract user IP from Next.js request headers.
 * Checks x-forwarded-for (Vercel/CDN) then x-real-ip.
 */
export function getClientIp(headers: Headers): string | undefined {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return headers.get('x-real-ip') ?? undefined;
}

/**
 * Extract User-Agent from request headers.
 */
export function getUserAgent(headers: Headers): string | undefined {
  return headers.get('user-agent') ?? undefined;
}

/**
 * Extract _fbp and _fbc from Cookie header.
 */
export function getFbCookies(headers: Headers): { fbp?: string; fbc?: string } {
  const cookie = headers.get('cookie') ?? '';
  const fbp = cookie.match(/_fbp=([^;]+)/)?.[1];
  const fbc = cookie.match(/_fbc=([^;]+)/)?.[1];
  return { fbp, fbc };
}
