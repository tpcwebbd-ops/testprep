'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import ContinueWithGoogleButton from '@/components/common/GoogleButton';
import { signIn } from '@/lib/auth-client';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col md:flex-row backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl border border-white/20"
      >
        {/* ===== Left Side (Visual Section) ===== */}
        <div className="flex-1 flex flex-col items-center justify-center text-white p-8 relative">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="text-6xl font-extrabold tracking-tight drop-shadow-md"
          >
            🔐
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl md:text-4xl font-semibold mt-4 text-center"
          >
            Welcome Back
          </motion.h2>
          <p className="text-sm md:text-base mt-3 text-white/80 text-center max-w-sm leading-relaxed">
            Securely access your account and manage your data effortlessly.
          </p>
        </div>

        {/* ===== Right Side (Form Section) ===== */}
        <div className="flex-1 bg-white/10 backdrop-blur-lg p-8 flex flex-col justify-center text-white">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6">Login to Your Account</h2>

          {/* --- Login Form --- */}
          <form onSubmit={handleLogin} className="flex flex-col space-y-4">
            <div>
              <label htmlFor="email" className="block mb-1 text-sm">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-white/60"
                placeholder="Enter your email"
              />
            </div>

            {/* === Password Input with Toggle === */}
            <label htmlFor="password" className="block mb-1 text-sm">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-white/60 pr-10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-white/70 hover:text-white"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* --- Login Button --- */}
            <button
              type="submit"
              onClick={async () => {
                await signIn.email(
                  {
                    email,
                    password,
                  },
                  {
                    onRequest: ctx => {
                      setLoading(true);
                    },
                    onResponse: ctx => {
                      setLoading(false);
                    },
                  },
                );
              }}
              disabled={loading}
              className="w-full py-2 mt-4 bg-gradient-to-r from-indigo-500 to-blue-500 hover:opacity-90 rounded-lg font-medium flex justify-center items-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* --- OR Divider --- */}
          <div className="flex items-center justify-center my-6">
            <div className="w-1/5 border-t border-white/30"></div>
            <span className="mx-3 text-sm text-white/70">OR</span>
            <div className="w-1/5 border-t border-white/30"></div>
          </div>

          {/* --- Google Login Button --- */}
          <div className="flex justify-center">
            <ContinueWithGoogleButton
              onClick={async () => {
                await signIn.social(
                  {
                    provider: 'google',
                    callbackURL: '/dashboard',
                  },
                  {
                    onRequest: ctx => {
                      setLoading(true);
                    },
                    onResponse: ctx => {
                      setLoading(false);
                    },
                  },
                );
              }}
            />
          </div>

          {/* --- Redirect to Sign Up --- */}
          <p className="text-center text-sm mt-6 text-white/80">
            Don’t have an account?{' '}
            <a href="/registration" className="text-blue-300 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
