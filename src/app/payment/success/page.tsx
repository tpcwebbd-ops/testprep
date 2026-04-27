'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Clock, ArrowRight, Loader2 } from 'lucide-react';

interface EnrollmentData {
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentAmount?: number;
  studentName?: string;
  studentEmail?: string;
  tranId?: string;
  createdAt?: string;
}

function SuccessContent() {
  const params = useSearchParams();
  const tranId = params.get('tran_id');

  const [status, setStatus] = useState<'loading' | 'success' | 'pending' | 'failed' | 'not_found' | 'error'>('loading');
  const [enrollment, setEnrollment] = useState<EnrollmentData | null>(null);

  useEffect(() => {
    if (!tranId) {
      setStatus('error');
      return;
    }

    fetch(`/api/payment/status?tran_id=${encodeURIComponent(tranId)}`)
      .then(res => res.json())
      .then(json => {
        if (!json.ok) {
          setStatus('not_found');
          return;
        }
        const data: EnrollmentData = json.data;
        setEnrollment(data);
        if (data.paymentStatus === 'completed') setStatus('success');
        else if (data.paymentStatus === 'pending') setStatus('pending');
        else setStatus('failed');
      })
      .catch(() => setStatus('error'));
  }, [tranId]);

  if (status === 'loading') {
    return (
      <div className="max-w-lg mx-auto text-center py-24">
        <Loader2 className="w-12 h-12 text-zinc-400 animate-spin mx-auto mb-6" />
        <p className="text-zinc-400 text-lg">Verifying your payment…</p>
      </div>
    );
  }

  if (status === 'not_found' || status === 'error') {
    return (
      <div className="max-w-lg mx-auto text-center py-24">
        <div className="w-24 h-24 rounded-full bg-red-400/10 border border-red-400/30 flex items-center justify-center mx-auto mb-10">
          <XCircle className="w-12 h-12 text-red-400" />
        </div>
        <h1 className="text-4xl font-black text-white mb-4 tracking-tight">
          {status === 'not_found' ? 'Transaction Not Found' : 'Verification Failed'}
        </h1>
        <p className="text-zinc-400 text-lg mb-10">
          {status === 'not_found'
            ? 'We could not find a transaction with this ID.'
            : 'Something went wrong while verifying your payment. Please contact support.'}
        </p>
        {tranId && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-7 py-4 mb-10 inline-block text-left">
            <p className="text-xs text-zinc-600 font-semibold uppercase tracking-widest mb-1">Transaction ID</p>
            <p className="text-white font-mono text-sm break-all">{tranId}</p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-9 py-4 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white font-bold rounded-xl transition-all text-sm"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="max-w-lg mx-auto text-center py-24">
        <div className="w-24 h-24 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto mb-10">
          <Clock className="w-12 h-12 text-amber-400" />
        </div>
        <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Payment Pending</h1>
        <p className="text-zinc-400 text-lg mb-6 leading-relaxed">Your payment is being processed. Enrollment will be activated once confirmed.</p>
        {tranId && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-7 py-4 mb-10 inline-block text-left">
            <p className="text-xs text-zinc-600 font-semibold uppercase tracking-widest mb-1">Transaction ID</p>
            <p className="text-white font-mono text-sm break-all">{tranId}</p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-9 py-4 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white font-bold rounded-xl transition-all text-sm"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="max-w-lg mx-auto text-center py-24">
        <div className="w-24 h-24 rounded-full bg-red-400/10 border border-red-400/30 flex items-center justify-center mx-auto mb-10">
          <XCircle className="w-12 h-12 text-red-400" />
        </div>
        <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Payment Failed</h1>
        <p className="text-zinc-400 text-lg mb-6 leading-relaxed">
          Your payment could not be completed. Status: <span className="text-red-400 font-semibold capitalize">{enrollment?.paymentStatus}</span>
        </p>
        {tranId && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-7 py-4 mb-10 inline-block text-left">
            <p className="text-xs text-zinc-600 font-semibold uppercase tracking-widest mb-1">Transaction ID</p>
            <p className="text-white font-mono text-sm break-all">{tranId}</p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-9 py-4 bg-amber-400 hover:bg-amber-300 text-zinc-900 font-black rounded-xl transition-all text-sm tracking-wide shadow-lg shadow-amber-400/10 hover:-translate-y-0.5"
          >
            Try Again
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-9 py-4 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white font-bold rounded-xl transition-all text-sm"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  // success
  return (
    <div className="max-w-lg mx-auto text-center py-24">
      <div className="w-24 h-24 rounded-full bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center mx-auto mb-10">
        <CheckCircle className="w-12 h-12 text-emerald-400" />
      </div>

      <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Payment Successful</h1>
      <p className="text-zinc-400 text-lg mb-6 leading-relaxed">Your payment has been confirmed and enrollment is now active.</p>

      {enrollment && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-7 py-5 mb-10 text-left space-y-3">
          {enrollment.tranId && (
            <div>
              <p className="text-xs text-zinc-600 font-semibold uppercase tracking-widest mb-1">Transaction ID</p>
              <p className="text-white font-mono text-sm break-all">{enrollment.tranId}</p>
            </div>
          )}
          {enrollment.studentName && (
            <div>
              <p className="text-xs text-zinc-600 font-semibold uppercase tracking-widest mb-1">Student</p>
              <p className="text-white text-sm">{enrollment.studentName}</p>
            </div>
          )}
          {enrollment.paymentAmount != null && (
            <div>
              <p className="text-xs text-zinc-600 font-semibold uppercase tracking-widest mb-1">Amount Paid</p>
              <p className="text-emerald-400 font-bold text-sm">৳{enrollment.paymentAmount}</p>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 px-9 py-4 bg-amber-400 hover:bg-amber-300 text-zinc-900 font-black rounded-xl transition-all text-sm tracking-wide shadow-lg shadow-amber-400/10 hover:-translate-y-0.5"
        >
          Explore Courses
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-9 py-4 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white font-bold rounded-xl transition-all text-sm hover:-translate-y-0.5"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-zinc-500 flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Loading…</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
