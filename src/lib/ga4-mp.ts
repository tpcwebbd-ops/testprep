/**
 * GA4 Measurement Protocol — server-side event tracking
 * Docs: https://developers.google.com/analytics/devguides/collection/protocol/ga4
 *
 * Required env vars:
 *   GA4_MEASUREMENT_ID  — e.g. G-XXXXXXXXXX
 *   GA4_API_SECRET      — from GA4 Admin → Data Streams → Measurement Protocol API secrets
 */

const MP_ENDPOINT = 'https://www.google-analytics.com/mp/collect';

interface GA4EventParam {
  [key: string]: string | number | boolean | GA4Item[] | undefined;
}

interface GA4Item {
  item_id: string;
  item_name: string;
  price?: number;
  quantity?: number;
  currency?: string;
}

interface GA4Event {
  name: string;
  params?: GA4EventParam & { items?: GA4Item[] };
}

/**
 * Low-level: send one or more GA4 events server-side.
 * client_id must match the GA4 cookie (_ga) value from the browser.
 * session_id is optional but improves session stitching.
 */
export async function sendGA4Events(clientId: string, events: GA4Event[], sessionId?: string): Promise<void> {
  const measurementId = process.env.GA4_MEASUREMENT_ID;
  const apiSecret = process.env.GA4_API_SECRET;

  if (!measurementId || !apiSecret) {
    console.warn('GA4 MP: GA4_MEASUREMENT_ID or GA4_API_SECRET not set');
    return;
  }

  const url = `${MP_ENDPOINT}?measurement_id=${measurementId}&api_secret=${apiSecret}`;

  const payload: Record<string, unknown> = { client_id: clientId, events };
  if (sessionId) payload.session_id = sessionId;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error(`GA4 MP: HTTP ${res.status}`);
    }
  } catch (err) {
    console.error('GA4 MP: fetch error', err);
  }
}

/**
 * Fire a GA4 `purchase` event server-side (e.g. from SSLCommerz success callback).
 * Call this after payment is validated — never on button click.
 *
 * @param clientId   GA4 client_id from browser cookie (_ga)
 * @param tranId     Unique transaction ID (e.g. SSLCommerz tran_id)
 * @param value      Payment amount
 * @param currency   ISO currency code (default: BDT)
 * @param items      Course items (optional but recommended)
 * @param sessionId  GA4 session_id (optional)
 */
export async function sendGA4Purchase(
  clientId: string,
  tranId: string,
  value: number,
  currency = 'BDT',
  items: GA4Item[] = [],
  sessionId?: string,
): Promise<void> {
  await sendGA4Events(
    clientId,
    [
      {
        name: 'purchase',
        params: {
          transaction_id: tranId,
          value,
          currency,
          items,
        },
      },
    ],
    sessionId,
  );
}

/**
 * Fire a GA4 `begin_checkout` event server-side.
 */
export async function sendGA4BeginCheckout(clientId: string, value: number, currency = 'BDT', items: GA4Item[] = [], sessionId?: string): Promise<void> {
  await sendGA4Events(clientId, [{ name: 'begin_checkout', params: { value, currency, items } }], sessionId);
}

/**
 * Extract GA4 client_id from the _ga cookie string.
 * Browser sends _ga as "GA1.1.XXXXXXXXXX.XXXXXXXXXX" — we want "XXXXXXXXXX.XXXXXXXXXX".
 */
export function extractGA4ClientId(gaCookie: string | undefined): string {
  if (!gaCookie) return `fallback.${Date.now()}`;
  // _ga format: GA1.X.clientId (last two dot-segments)
  const parts = gaCookie.split('.');
  if (parts.length >= 4) return `${parts[2]}.${parts[3]}`;
  return gaCookie;
}
