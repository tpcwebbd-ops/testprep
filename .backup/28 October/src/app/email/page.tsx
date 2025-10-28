'use client';

import { logger } from 'better-auth';
import React, { useState } from 'react';

export default function EmailVerificationForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('/api/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (res.ok) setStatus('sent');
      else setStatus(json.message || 'error');
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        logger.info(JSON.stringify(err));
      }
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 rounded-2xl shadow-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white">
      <h2 className="text-2xl font-semibold text-center mb-4">Email Verification</h2>

      <input
        type="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full p-3 rounded-md bg-white/20 focus:outline-none placeholder:text-white/70"
      />

      <button type="submit" className="mt-4 w-full py-2 rounded-md bg-blue-500/80 hover:bg-blue-600 transition-colors">
        Send Verification
      </button>

      <p className="mt-3 text-center text-sm text-white/80">{status === 'sending' ? 'Sending...' : status === 'sent' ? 'Check your inbox' : status}</p>
    </form>
  );
}
