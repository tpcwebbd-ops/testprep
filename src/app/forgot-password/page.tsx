/*
|-----------------------------------------
| Forget Password Page with Code Verification
| @author: Toufiquer
|-----------------------------------------
*/

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, MailCheck, CheckCircle } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

const ForgetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ====== States ======
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'code' | 'password' | 'done'>('email');
  const [code, setCode] = useState('');
  const [serverCode, setServerCode] = useState(''); // For demo we store fake one
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // ====== Detect email param ======
  useEffect(() => {
    const paramEmail = searchParams.get('email');
    if (paramEmail) {
      setEmail(paramEmail);
      sendCode(paramEmail);
    }
  }, [searchParams]);

  // ====== Step 1: Send reset code ======
  const sendCode = async (targetEmail: string) => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail }),
      });

      if (!res.ok) throw new Error('Failed to send code');
      const data = await res.json();

      // For demo: assume server sends back code
      setServerCode(data.code || '123456');
      setStep('code');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // ====== Step 2: Verify Code ======
  const verifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === serverCode) {
      setStep('password');
      setError('');
    } else {
      setError('Invalid verification code. Please try again.');
    }
  };

  // ====== Step 3: Reset Password ======
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      // Simulate password update
      await new Promise(res => setTimeout(res, 1000));
      setStep('done');
    } catch {
      setError('Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  // ====== Step 0 (if no email param) ======
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    sendCode(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col md:flex-row backdrop-blur-2xl bg-white/10 rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl border border-white/20"
      >
        {/* ===== Left Side ===== */}
        <div className="flex-1 flex flex-col items-center justify-center text-white p-8 relative">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6 }}
            className="text-6xl font-extrabold tracking-tight drop-shadow-lg"
          >
            🔐
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl md:text-4xl font-semibold mt-4 text-center"
          >
            Forgot Your Password?
          </motion.h2>
          <p className="text-sm md:text-base mt-3 text-white/80 text-center max-w-sm">
            {step === 'email'
              ? 'Enter your email and we’ll send you a reset code.'
              : step === 'code'
                ? 'Check your inbox for the verification code.'
                : step === 'password'
                  ? 'Enter your new password below.'
                  : 'Your password has been successfully reset.'}
          </p>
        </div>

        {/* ===== Right Side ===== */}
        <div className="flex-1 bg-white/10 backdrop-blur-lg p-8 flex flex-col justify-center text-white">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6">
            {step === 'email' ? 'Request Reset Code' : step === 'code' ? 'Verify Code' : step === 'password' ? 'Set New Password' : 'Success 🎉'}
          </h2>

          {/* === STEP: Email Input === */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="flex flex-col space-y-4">
              <div>
                <label htmlFor="email" className="block mb-1 text-sm">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 mt-2 bg-gradient-to-r from-indigo-500 to-blue-500 hover:opacity-90 rounded-lg font-medium flex justify-center items-center gap-2 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Send Code'}
              </button>
            </form>
          )}

          {/* === STEP: Code Verification === */}
          {step === 'code' && (
            <form onSubmit={verifyCode} className="flex flex-col space-y-4">
              <label htmlFor="code" className="block mb-1 text-sm">
                Enter 6-digit Code
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                maxLength={6}
                placeholder="Enter your code"
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-300 tracking-widest text-center"
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-gradient-to-r from-indigo-500 to-blue-500 hover:opacity-90 rounded-lg font-medium flex justify-center items-center gap-2 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Verify Code'}
              </button>
            </form>
          )}

          {/* === STEP: Reset Password === */}
          {step === 'password' && (
            <form onSubmit={handlePasswordReset} className="flex flex-col space-y-4">
              <div>
                <label htmlFor="newPassword" className="block mb-1 text-sm">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block mb-1 text-sm">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 mt-2 bg-gradient-to-r from-indigo-500 to-blue-500 hover:opacity-90 rounded-lg font-medium flex justify-center items-center gap-2 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Reset Password'}
              </button>
            </form>
          )}

          {/* === STEP: Done === */}
          {step === 'done' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center text-center text-white"
            >
              <CheckCircle className="text-green-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold mb-2">Password Reset Successful!</h3>
              <p className="text-white/80 mb-4">You can now log in with your new password.</p>
              <a href="/login" className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg hover:opacity-90">
                Go to Login
              </a>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgetPassword;

/*

get parems from the url "/forgot-password?email=example.gmail.com"

if found email in parems then do this,\
1. fetch a post request for sending code in email there is url "/api/send-code"
2. render the div with a 6 digit code submit code. 
3. if the code is correct then render the div with a password input (new password and confirm password)

if there is no email in params then render the div with a email input.
after that do the first 1,2,3 steps.


*/
