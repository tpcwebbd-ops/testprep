'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

type Step = 'email' | 'code' | 'password';

export default function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setMounted(true);
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSendCode = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      console.log(' response : ', response);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Verification code sent to your email!');
      setStep('code');
    } catch {
      setError('Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      if (response.ok) {
        setSuccess('Code verified successfully!');
        setStep('password');
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch {
      setError('Failed to verify code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500 p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-20" />

      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />

      <Card
        className={`max-w-md w-full p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20 bg-white/10 backdrop-blur-xl transition-all duration-700 relative ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-white/5 pointer-events-none" />

        <div className="flex flex-col space-y-6 relative z-10">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg border border-white/30 mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg">
              {step === 'email' && 'Forgot Password?'}
              {step === 'code' && 'Verify Code'}
              {step === 'password' && 'Reset Password'}
            </h1>
            <p className="text-white/80 text-sm drop-shadow">
              {step === 'email' && 'Enter your email to receive a verification code'}
              {step === 'code' && 'Enter the code sent to your email'}
              {step === 'password' && 'Create a new password for your account'}
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/20 backdrop-blur-md border border-red-400/30 rounded-lg p-3 text-white text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 rounded-lg p-3 text-white text-sm">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {step === 'email' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white drop-shadow">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="pl-10 bg-white/20 backdrop-blur-md border-white/30 text-white placeholder:text-white/50 focus:bg-white/30 focus:border-white/50"
                  />
                </div>
              </div>

              <Button
                onClick={handleSendCode}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl border border-white/20 backdrop-blur-sm transition-all duration-300"
              >
                {loading ? 'Sending...' : 'Send Verification Code'}
                {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
              </Button>
            </div>
          )}

          {step === 'code' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium text-white drop-shadow">
                  Verification Code
                </label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  maxLength={6}
                  className="bg-white/20 backdrop-blur-md border-white/30 text-white placeholder:text-white/50 focus:bg-white/30 focus:border-white/50 text-center text-2xl tracking-widest"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep('email')}
                  variant="outline"
                  className="flex-1 border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white hover:text-white"
                >
                  Back
                </Button>
                <Button
                  onClick={handleVerifyCode}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl border border-white/20 backdrop-blur-sm"
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </Button>
              </div>
            </div>
          )}

          {step === 'password' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium text-white drop-shadow">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="pl-10 bg-white/20 backdrop-blur-md border-white/30 text-white placeholder:text-white/50 focus:bg-white/30 focus:border-white/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-white drop-shadow">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="pl-10 bg-white/20 backdrop-blur-md border-white/30 text-white placeholder:text-white/50 focus:bg-white/30 focus:border-white/50"
                  />
                </div>
              </div>

              <Button
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl border border-white/20 backdrop-blur-sm transition-all duration-300"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
                {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
              </Button>
            </div>
          )}

          <div className="text-center pt-4">
            <Link href="/login" className="text-sm text-white/80 hover:text-white transition-colors duration-200 drop-shadow">
              Remember your password? Sign in
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
