'use client';

import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { signIn, useSession } from 'next-auth/react';
import { useState, Suspense } from 'react';
import { DefaultSession } from 'next-auth';
import { useSearchParams } from 'next/navigation';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
    } & DefaultSession['user'];
  }
}

// Create a separate component that uses useSearchParams
const GoogleAuthButtonContent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: sessionData } = useSession();

  const searchParams = useSearchParams();
  const callbackUrlPath = searchParams.get('callbackUrl');

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await signIn('google', {
        callbackUrl: callbackUrlPath || '/',
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        console.error('Sign in error:', result.error);
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError('Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {!sessionData?.user?.email ? (
        <>
          <motion.button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className={`mt-6 w-full cursor-pointer flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FcGoogle className="mr-2" />
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </motion.button>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </>
      ) : (
        <div>
          <p>Signed in as: {sessionData.user.email}</p>
        </div>
      )}
    </div>
  );
};

// Fallback component while the content is loading
const LoadingFallback = () => {
  return <div className="mt-6 w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-center">Loading...</div>;
};

// Main component with Suspense boundary
const GoogleAuthButton = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <GoogleAuthButtonContent />
    </Suspense>
  );
};

export default GoogleAuthButton;
