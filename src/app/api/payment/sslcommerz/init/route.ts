import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import connectDB from '@/app/api/utils/mongoose';
import Enrollment from '@/app/api/enrollments/v1/model';

const IS_SANDBOX = process.env.SSLCOMMERZ_SANDBOX !== 'false';
const INIT_URL = IS_SANDBOX
  ? 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
  : 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      studentName,
      studentEmail,
      enrollCoursesIDS,
      realPrice,
      discountPrice,
      paymentAmount,
      couponCode,
    } = body;

    if (!studentName || !studentEmail || !enrollCoursesIDS?.length || !paymentAmount) {
      return NextResponse.json({ ok: false, message: 'Missing required fields' }, { status: 400 });
    }

    const tranId = `TXN-${uuidv4()}`;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const enrollment = await Enrollment.create({
      studentName,
      studentEmail,
      studentsStatus: 'pending',
      enrollCoursesIDS,
      realPrice,
      discountPrice,
      paymentAmount,
      paymentMethod: 'SSLCommerz',
      couponCode: couponCode || null,
      checkedbyEmail: '',
      paymentStatus: 'pending',
      tranId,
    });

    const params = new URLSearchParams({
      store_id: process.env.SSLCOMMERZ_STORE_ID || '',
      store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD || '',
      total_amount: String(paymentAmount),
      currency: 'BDT',
      tran_id: tranId,
      success_url: `${baseUrl}/api/payment/sslcommerz/success`,
      fail_url: `${baseUrl}/api/payment/sslcommerz/fail`,
      cancel_url: `${baseUrl}/api/payment/sslcommerz/cancel`,
      ipn_url: `${baseUrl}/api/payment/sslcommerz/ipn`,
      cus_name: studentName,
      cus_email: studentEmail,
      cus_add1: 'Dhaka',
      cus_city: 'Dhaka',
      cus_country: 'Bangladesh',
      cus_phone: '01700000000',
      shipping_method: 'NO',
      product_name: 'Course Enrollment',
      product_category: 'Education',
      product_profile: 'non-physical-goods',
    });

    const sslRes = await fetch(INIT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const sslData = await sslRes.json();

    if (sslData?.status !== 'SUCCESS') {
      await Enrollment.findByIdAndDelete(enrollment._id);
      return NextResponse.json({ ok: false, message: sslData?.failedreason || 'SSL Commerz init failed' }, { status: 502 });
    }

    return NextResponse.json({ ok: true, redirectUrl: sslData.GatewayPageURL, tranId });
  } catch (err) {
    console.error('SSL Commerz init error:', err);
    return NextResponse.json({ ok: false, message: 'Internal server error' }, { status: 500 });
  }
}
