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
