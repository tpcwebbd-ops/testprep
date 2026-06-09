import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/app/api/utils/mongoose';
import Enrollment from '@/app/api/enrollments/v1/model';

export async function GET(req: NextRequest) {
  const tranId = req.nextUrl.searchParams.get('tran_id');

  if (!tranId) {
    return NextResponse.json({ ok: false, message: 'tran_id is required' }, { status: 400 });
  }

  try {
    await connectDB();
    const enrollment = await Enrollment.findOne({ tranId }).select(
      'paymentStatus paymentAmount studentName studentEmail enrollCoursesIDS studentsStatus tranId createdAt',
    );

    if (!enrollment) {
      return NextResponse.json({ ok: false, message: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: enrollment }, { status: 200 });
  } catch (err) {
    console.error('Payment status check error:', err);
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}
