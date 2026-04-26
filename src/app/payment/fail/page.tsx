'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, RefreshCw } from 'lucide-react';

function FailContent() {
  const params = useSearchParams();
  const tranId = params.get('tran_id');
  const reason = params.get('reason');

  return (
    <div className="max-w-lg mx-auto text-center py-24">
      <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-10">
        <XCircle className="w-12 h-12 text-red-400" />
      </div>

      <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Payment Failed</h1>
      <p className="text-zinc-400 text-lg mb-6 leading-relaxed">
        {reason === 'validation_failed'
          ? 'Payment could not be verified. Please contact support.'
          : 'Your payment was not completed. Please try again.'}
      </p>

      {tranId && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-7 py-4 mb-10 inline-block text-left">
          <p className="text-xs text-zinc-600 font-semibold uppercase tracking-widest mb-1">Transaction ID</p>
          <p className="text-white font-mono text-sm break-all">{tranId}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/purchase"
          className="inline-flex items-center gap-2 px-9 py-4 bg-amber-400 hover:bg-amber-300 text-zinc-900 font-black rounded-xl transition-all text-sm tracking-wide shadow-lg shadow-amber-400/10 hover:-translate-y-0.5"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
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

export default function PaymentFailPage() {
  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-zinc-500">Loading...</div>}>
        <FailContent />
      </Suspense>
    </main>
  );
}
