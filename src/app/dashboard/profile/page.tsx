'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Loader2, Eye, EyeOff, Lock, User, Mail, Camera, AlertCircle, CheckCircle } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import Image from 'next/image';

export default function ProfileEditingPage() {
  const router = useRouter();

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    avatar: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [revokeOtherSessions, setRevokeOtherSessions] = useState(true);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully!');
      setLoading(false);
    } catch (error) {
      toast.error('Failed to update profile');
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      toast.error('Password must be at least 8 characters');
      return;
    }

    setPasswordError('');
    setPasswordLoading(true);

    try {
      const { data, error } = await authClient.changePassword({
        newPassword: passwordData.newPassword,
        currentPassword: passwordData.currentPassword,
        revokeOtherSessions,
      });

      setPasswordLoading(false);

      if (error) {
        console.error('Change password error:', error);
        toast.error(error.message || 'Failed to change password');
        return;
      }

      toast.success('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      if (revokeOtherSessions) {
        toast.info('All other sessions have been logged out');
      }
    } catch (error) {
      console.error('Change password exception:', error);
      setPasswordLoading(false);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, avatar: reader.result as string });
        toast.success('Avatar updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 p-4">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20"></div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-4xl backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
      >
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <User className="text-white mb-4" size={48} />
            <h1 className="text-3xl font-bold text-white mb-2">Edit Profile</h1>
            <p className="text-white/80 text-sm text-center">Update your profile information and password</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="backdrop-blur-lg bg-white/5 rounded-xl p-6 border border-white/10"
            >
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <User size={20} />
                Profile Information
              </h2>

              <form onSubmit={handleProfileUpdate} className="space-y-5">
                <div className="flex flex-col items-center mb-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center overflow-hidden">
                      {profileData.avatar ? (
                        <Image src={profileData.avatar} alt="Avatar" width={96} height={96} className="w-full h-full object-cover" />
                      ) : (
                        <User className="text-white/60" size={40} />
                      )}
                    </div>
                    <label
                      htmlFor="avatar"
                      className="absolute bottom-0 right-0 bg-white text-purple-600 p-2 rounded-full cursor-pointer hover:bg-white/90 transition-all shadow-lg"
                    >
                      <Camera size={16} />
                    </label>
                    <input id="avatar" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="name" className="text-white font-medium text-sm">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={profileData.name}
                    onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                    required
                    disabled={loading}
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 text-white placeholder:text-white/50 focus:bg-white/25 focus:border-white/50 backdrop-blur-sm rounded-lg"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-white font-medium text-sm">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                    required
                    disabled={loading}
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 text-white placeholder:text-white/50 focus:bg-white/25 focus:border-white/50 backdrop-blur-sm rounded-lg"
                    placeholder="Enter your email"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-white text-purple-600 hover:bg-white/90 font-semibold rounded-lg shadow-lg flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Updating...
                    </>
                  ) : (
                    'Update Profile'
                  )}
                </button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="backdrop-blur-lg bg-white/5 rounded-xl p-6 border border-white/10"
            >
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Lock size={20} />
                Change Password
              </h2>

              <form onSubmit={handlePasswordChange} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="currentPassword" className="text-white font-medium text-sm">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      required
                      disabled={passwordLoading}
                      className="w-full px-4 py-2 pr-10 bg-white/20 border border-white/30 text-white placeholder:text-white/50 focus:bg-white/25 focus:border-white/50 backdrop-blur-sm rounded-lg"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                    >
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="newPassword" className="text-white font-medium text-sm">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={e => {
                        setPasswordData({ ...passwordData, newPassword: e.target.value });
                        if (passwordError) setPasswordError('');
                      }}
                      required
                      disabled={passwordLoading}
                      minLength={8}
                      className={`w-full px-4 py-2 pr-10 bg-white/20 border ${
                        passwordError && passwordData.newPassword ? 'border-red-400' : 'border-white/30'
                      } text-white placeholder:text-white/50 focus:bg-white/25 focus:border-white/50 backdrop-blur-sm rounded-lg`}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-white font-medium text-sm">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={e => {
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value });
                        if (passwordError) setPasswordError('');
                      }}
                      required
                      disabled={passwordLoading}
                      minLength={8}
                      className={`w-full px-4 py-2 pr-10 bg-white/20 border ${
                        passwordError && passwordData.confirmPassword ? 'border-red-400' : 'border-white/30'
                      } text-white placeholder:text-white/50 focus:bg-white/25 focus:border-white/50 backdrop-blur-sm rounded-lg`}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {passwordError && (
                    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-300 text-sm flex items-center gap-1">
                      <AlertCircle size={14} />
                      {passwordError}
                    </motion.p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="revokeOtherSessions"
                    checked={revokeOtherSessions}
                    onChange={e => setRevokeOtherSessions(e.target.checked)}
                    className="w-4 h-4 rounded accent-white"
                  />
                  <label htmlFor="revokeOtherSessions" className="text-white/90 text-sm cursor-pointer">
                    Log out from all other devices
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={passwordLoading || !!passwordError}
                  className="w-full py-2.5 bg-white text-purple-600 hover:bg-white/90 font-semibold rounded-lg shadow-lg flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {passwordLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Changing Password...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
