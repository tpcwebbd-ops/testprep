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
