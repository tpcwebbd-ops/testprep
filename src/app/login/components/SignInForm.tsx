'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const SignInForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setEmailError('');
    setPasswordError('');
    setFormError('');

    try {
      const formData: LoginFormData = {
        email,
        password,
      };

      const result = loginSchema.safeParse(formData);

      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        if (errors.email) setEmailError(errors.email[0]);
        if (errors.password) setPasswordError(errors.password[0]);
        setIsLoading(false);
        return;
      }

      if (email === 'error@test.com') {
        setFormError('Invalid credentials. Please try again.');
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.log(error);
      setFormError('An unexpected error occurred');
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
        {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button type="button" className="absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
            <span className="text-sm text-gray-500">{showPassword ? 'Hide' : 'Show'}</span>
          </button>
        </div>
        {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
      </div>

      {/* Forgot Password */}
      <div className="flex justify-end">
        <Link href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500">
          Forgot your password?
        </Link>
      </div>

      {/* Form Error */}
      {formError && <div className="text-center p-2 bg-red-50 text-red-600 text-sm rounded-md">{formError}</div>}

      {/* Sign In Button */}
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex cursor-pointer justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        disabled={isLoading}
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </motion.button>
    </form>
  );
};

export default SignInForm;
