'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import ContinueWithGoogleButton from '@/components/common/GoogleButton';

const RegistrationPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/verify');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500 p-4">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col md:flex-row backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl overflow-hidden w-full max-w-5xl border border-white/20"
      >
        {/* ===== Left Part (Visual/Info Section) ===== */}
        <div className="flex-1 flex flex-col items-center justify-center text-white p-8 relative">
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 6 }} className="text-6xl font-extrabold drop-shadow-md">
            ✨
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl md:text-4xl font-semibold mt-4 text-center"
          >
            Create Your Account
          </motion.h2>

          <p className="text-sm md:text-base mt-3 text-white/80 text-center max-w-sm leading-relaxed">
            Join our community and start your learning journey — it only takes a few seconds!
          </p>
        </div>

        {/* ===== Right Part (Form Section) ===== */}
        <div className="flex-1 bg-white/10 backdrop-blur-lg p-8 flex flex-col justify-center text-white">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6">Sign Up</h2>

          {/* --- Registration Form --- */}
          <form onSubmit={handleRegister} className="flex flex-col space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block mb-1 text-sm">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-white/60"
                placeholder="Enter your name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block mb-1 text-sm">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-white/60"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block mb-1 text-sm">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-white/60 pr-10"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-white/70 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block mb-1 text-sm">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-white/60 pr-10"
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-white/70 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* --- Register Button --- */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 mt-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 rounded-lg font-medium flex justify-center items-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Creating Account...
                </>
              ) : (
                'Register'
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
            <ContinueWithGoogleButton />
          </div>

          {/* --- Login Redirect --- */}
          <p className="text-center text-sm mt-6 text-white/80">
            Already have an account?{' '}
            <a href="/login" className="text-blue-300 hover:underline">
              Login
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegistrationPage;
