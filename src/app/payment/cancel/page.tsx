'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { Ban, RefreshCw } from 'lucide-react';

function CancelContent() {
  return (
    <div className="max-w-lg mx-auto text-center py-24">
      <div className="w-24 h-24 rounded-full bg-zinc-800/60 border border-zinc-700 flex items-center justify-center mx-auto mb-10">
        <Ban className="w-12 h-12 text-zinc-400" />
      </div>

      <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Payment Cancelled</h1>
      <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
        You cancelled the payment. Your enrollment has not been confirmed.
      </p>

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

export default function PaymentCancelPage() {
  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-zinc-500">Loading...</div>}>
        <CancelContent />
      </Suspense>
    </main>
  );
}
