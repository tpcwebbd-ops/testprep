'use client';

import React from 'react';
import { motion } from 'framer-motion';
// import Link from 'next/link';
import ContinuousSvgAnimation from './ContinuousSvgAnimationProps';
import GoogleAuthButton from '@/app/auth/components/GoogleAuthButton';

// import SignInForm from './components/SignInForm';

const SignInPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full">
      {/* Left Column - SVG/Art Section */}
      <motion.div
        className="w-full md:w-2/5 flex items-center justify-center border-r-1 border-slate-2--"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <ContinuousSvgAnimation />
      </motion.div>

      {/* Right Column - Sign-in Form */}
      <div className="w-full md:w-3/5 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Welcome Back</h1>

            {/* <SignInForm /> */}

            {/* OR Separator */}
            {/* <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div> */}

            <GoogleAuthButton />

            {/* Sign Up Link */}
            {/* <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don&lsquo;t have an account?
                <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign up
                </Link>
              </p>
            </div> */}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
