'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, X, AlertCircle } from 'lucide-react';

// ======================
// ✅ Wrapper Component
// ======================
const VerifyAccountPage = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <VerifyAccount />
    </Suspense>
  );
};

// Optional: Simple loading component
const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 text-white">
    <Loader2 className="animate-spin mb-4" size={40} />
    <p>Loading verification page...</p>
  </div>
);

// ======================
// ✅ Main Verify Component
// ======================
const VerifyAccount = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<'loading' | 'verified' | 'error' | 'resend' | 'manual'>('manual');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendDone, setResendDone] = useState(false);

  // 1️⃣ Handle query params (token/email)
  useEffect(() => {
    const token = searchParams.get('token');
    const emailParam = searchParams.get('email');

    if (token || emailParam) {
      verifyFromQuery(token, emailParam);
    }
  }, [searchParams]);

  // 2️⃣ API Call to /api/verify
  const verifyFromQuery = async (token: string | null, emailParam: string | null) => {
    try {
      setStatus('loading');
      const url = token ? `/api/verify?token=${token}` : `/api/verify?email=${emailParam}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.ok && data.status === 200) {
        setStatus('verified');
        setMessage(data.message);
        setEmail(data.data?.email || '');
        setTimeout(() => router.push('/dashboard'), 2000);
      } else {
        if (data.message === 'Email not found') {
          setStatus('error');
          setMessage('Email not found. Please register first.');
        } else if (data.message === 'Email not verify') {
          setStatus('error');
          setMessage('Please check your email and verify it.');
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed.');
        }
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  // 3️⃣ Manual Verification
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setStatus('verified');
      setMessage('Account verified manually.');
      setTimeout(() => router.push('/dashboard'), 2000);
    }, 1500);
  };

  // 4️⃣ Resend Code
  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setResending(true);

    setTimeout(() => {
      setResending(false);
      setResendDone(true);
      setTimeout(() => {
        setShowModal(false);
        setResendDone(false);
        setEmail('');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col md:flex-row backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl border border-white/20"
      >
        {/* ===== Left Side ===== */}
        <div className="flex-1 flex flex-col items-center justify-center text-white p-8 relative overflow-hidden">
          <motion.div
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ repeat: Infinity, duration: 6 }}
            className="text-6xl font-extrabold tracking-tight drop-shadow-md"
          >
            ✉️
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl md:text-4xl font-semibold mt-4 text-center"
          >
            Verify Your Account
          </motion.h2>
          <p className="text-sm md:text-base mt-3 text-white/80 text-center max-w-sm">
            {status === 'loading'
              ? 'Checking verification status...'
              : 'We’ve sent a verification code to your email. Enter it below or use the automatic link.'}
          </p>
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 h-28 w-28 bg-white/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ repeat: Infinity, duration: 4 }}
          />
        </div>

        {/* ===== Right Side ===== */}
        <div className="flex-1 bg-white/10 backdrop-blur-lg p-8 flex flex-col justify-center text-white">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6">Account Verification</h2>

          {/* ===== States ===== */}
          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-white mb-4" size={40} />
              <p>Verifying your account...</p>
            </div>
          )}

          {status === 'verified' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center text-center"
            >
              <CheckCircle className="text-green-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold mb-2">Account Verified!</h3>
              <p className="text-white/80 mb-4">{message}</p>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center text-center"
            >
              <AlertCircle className="text-red-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold mb-2">Verification Failed</h3>
              <p className="text-white/80 mb-4">{message}</p>
              <button onClick={() => router.push('/registration')} className="px-6 py-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg hover:opacity-90">
                Go to Registration
              </button>
            </motion.div>
          )}

          {status === 'manual' && (
            <>
              <form onSubmit={handleVerify} className="flex flex-col space-y-4">
                <div>
                  <label htmlFor="code" className="block mb-1 text-sm">
                    Verification Code
                  </label>
                  <input
                    id="code"
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    required
                    maxLength={6}
                    className="w-full px-4 py-2 text-center tracking-widest text-lg rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-white/60"
                    placeholder="Enter 6-digit code"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 mt-4 bg-gradient-to-r from-indigo-500 to-blue-500 hover:opacity-90 rounded-lg font-medium flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} /> Verifying...
                    </>
                  ) : (
                    'Verify Account'
                  )}
                </button>
              </form>

              <p className="text-center text-sm mt-6 text-white/80">
                Didn’t receive the code?{' '}
                <button type="button" onClick={() => setShowModal(true)} className="text-blue-300 hover:underline">
                  Resend Code
                </button>
              </p>
            </>
          )}
        </div>
      </motion.div>

      {/* ===== Modal ===== */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white/10 backdrop-blur-2xl p-6 rounded-xl shadow-xl border border-white/20 w-[90%] max-w-md text-white"
            >
              <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-white/80 hover:text-white">
                <X size={20} />
              </button>

              <h3 className="text-xl font-semibold mb-4 text-center">Resend Verification Code</h3>

              {!resendDone ? (
                <form onSubmit={handleResend} className="flex flex-col space-y-4">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <button
                    type="submit"
                    disabled={resending}
                    className="w-full py-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg font-medium flex justify-center items-center gap-2"
                  >
                    {resending ? (
                      <>
                        <Loader2 className="animate-spin" size={18} /> Sending...
                      </>
                    ) : (
                      'Send Code'
                    )}
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center text-center text-white"
                >
                  <CheckCircle className="text-green-400 mb-3" size={48} />
                  <p>Verification code sent successfully!</p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VerifyAccountPage;

/*

Now design a forgot-password page. it will do the following instruction. 

1. it will check parems is there is email or not. if found then use it default email. then there is a field for email and a button for send a code. we will get a code (we will work on later in backend). 

2. after sending code there is box for submit the code. after submiting the code it will fetch a post request to verify the code in url '/verify-code', if the code is valid then it will render a password setup component with New Password and confirm Password. else it will show an error.

3. after setting new password, it will redirect to login page.

*/ 