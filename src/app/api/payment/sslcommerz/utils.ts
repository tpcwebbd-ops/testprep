import { NextRequest, NextResponse } from 'next/server';

export const IS_SANDBOX = process.env.SSLCOMMERZ_SANDBOX !== 'false';

export const INIT_URL = IS_SANDBOX
  ? 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
  : 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';

export const VALIDATE_URL = IS_SANDBOX
  ? 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php'
  : 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php';

export function getSslCredentials() {
  const storeId = process.env.SSLCOMMERZ_STORE_ID;
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;

  if (!storeId || !storePassword) {
    return null;
  }

  return { storeId, storePassword };
}

export function getBaseUrl(req: NextRequest): string {
  const configured = process.env.NEXT_PUBLIC_BASE_URL;
  if (configured) return configured.replace(/\/$/, '');
  const { protocol, host } = req.nextUrl;
  return `${protocol}//${host}`;
}

export function redirect303(url: string) {
  return NextResponse.redirect(url, { status: 303 });
}

export function isSuccessfulSslStatus(status: string | null | undefined) {
  return status === 'VALID' || status === 'VALIDATED';
}

export async function validateSslPayment(valId: string) {
  const credentials = getSslCredentials();
  if (!credentials) {
    throw new Error('SSLCommerz credentials are not configured');
  }

  const validateParams = new URLSearchParams({
    val_id: valId,
    store_id: credentials.storeId,
    store_passwd: credentials.storePassword,
    format: 'json',
  });

  const response = await fetch(`${VALIDATE_URL}?${validateParams}`);
  return response.json();
}
