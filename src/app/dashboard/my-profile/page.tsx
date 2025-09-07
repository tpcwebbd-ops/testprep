/*
|-----------------------------------------
| Profile Component with Role Integration
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, September, 2025
|-----------------------------------------
*/

'use client';

import { motion } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiUser, FiMail, FiCalendar, FiLogOut, FiEdit3, FiSettings, FiShield, FiUserCheck, FiClock, FiActivity } from 'react-icons/fi';
import Image from 'next/image';

interface ApiUserData {
  _id: string;
  role: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  assignBy?: string;
  assignByEmail?: string;
}

interface ProfileData {
  name: string;
  email: string;
  image?: string;
  role: string;
  joinedDate: string;
  lastActive: string;
  assignedBy?: string;
  assignedByEmail?: string;
  userId: string;
}

const ProfileComponent = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
      return;
    }

    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/dashboard/access-management/all/api/v1/get-user-by-email?email=${session?.user?.email}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch user data');
        }

        const response = await res.json();

        if (response.status === 200 && response.data) {
          const apiData: ApiUserData = response.data;

          setProfileData({
            name: apiData.name || session.user?.name || 'Anonymous User',
            email: apiData.email || session.user?.email || '',
            image: session.user?.image || '',
            role: apiData.role || 'user',
            joinedDate: new Date(apiData.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            lastActive: new Date(apiData.updatedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            assignedBy: apiData.assignBy,
            assignedByEmail: apiData.assignByEmail,
            userId: apiData._id,
          });
        } else {
          // Fallback to session data if API fails
          setProfileData({
            name: session.user?.name || 'Anonymous User',
            email: session.user?.email || '',
            image: session.user?.image || '',
            role: 'user',
            joinedDate: new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            lastActive: 'Just now',
            userId: 'unknown',
          });
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setApiError('Failed to load profile data');

        // Fallback to session data
        setProfileData({
          name: session.user?.name || 'Anonymous User',
          email: session.user?.email || '',
          image: session.user?.image || '',
          role: 'user',
          joinedDate: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          lastActive: 'Just now',
          userId: 'unknown',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [session, status, router]);

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: '/login',
      redirect: true,
    });
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'moderator':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'editor':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'user':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return <FiShield className="w-4 h-4" />;
      case 'moderator':
        return <FiUserCheck className="w-4 h-4" />;
      case 'editor':
        return <FiEdit3 className="w-4 h-4" />;
      default:
        return <FiUser className="w-4 h-4" />;
    }
  };

  if (status === 'loading' || isLoading) {
    return <LoadingProfile />;
  }

  if (!session) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Profile</h1>
          <p className="text-gray-600 mt-2 text-lg">Manage your account information</p>
          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm"
            >
              {apiError} - Showing basic profile information
            </motion.div>
          )}
        </motion.div>

        {/* Main Profile Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Profile Header */}
          <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-12 sm:px-8 sm:py-16">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.8, delay: 0.3 }} className="relative">
              <div className="flex flex-col items-center">
                {/* Avatar */}
                <div className="relative mb-6">
                  <motion.div whileHover={{ scale: 1.05 }} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                    {profileData?.image ? (
                      <Image src={profileData.image} alt={profileData.name} width={128} height={128} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                        <FiUser className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                      </div>
                    )}
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <FiEdit3 className="w-4 h-4 text-indigo-600" />
                  </motion.button>
                </div>

                {/* Name and Role */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl sm:text-3xl font-bold text-white text-center mb-3"
                >
                  {profileData?.name}
                </motion.h2>

                {/* Role Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border mb-3 ${getRoleColor(profileData?.role || 'user')}`}
                >
                  {getRoleIcon(profileData?.role || 'user')}
                  <span className="ml-2 capitalize">{profileData?.role}</span>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-indigo-100 text-lg text-center"
                >
                  {profileData?.email}
                </motion.p>
              </div>
            </motion.div>
          </div>

          {/* Profile Content */}
          <div className="px-6 py-8 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Information */}
              <div className="lg:col-span-2">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <FiUser className="w-5 h-5 mr-2 text-indigo-600" />
                    Account Information
                  </h3>

                  <div className="space-y-4">
                    <InfoCard icon={<FiMail className="w-5 h-5" />} label="Email Address" value={profileData?.email || 'Not provided'} delay={0.7} />
                    <InfoCard
                      icon={<FiShield className="w-5 h-5" />}
                      label="Account Role"
                      value={profileData?.role ? profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1) : 'User'}
                      delay={0.75}
                    />
                    <InfoCard icon={<FiCalendar className="w-5 h-5" />} label="Member Since" value={profileData?.joinedDate || 'Unknown'} delay={0.8} />
                    <InfoCard icon={<FiActivity className="w-5 h-5" />} label="Last Updated" value={profileData?.lastActive || 'Unknown'} delay={0.85} />
                    {profileData?.assignedBy && (
                      <InfoCard
                        icon={<FiUserCheck className="w-5 h-5" />}
                        label="Assigned By"
                        value={`${profileData.assignedBy} (${profileData.assignedByEmail})`}
                        delay={0.9}
                      />
                    )}
                    <InfoCard icon={<FiUser className="w-5 h-5" />} label="User ID" value={profileData?.userId || 'Unknown'} delay={0.95} />
                  </div>
                </motion.div>
              </div>

              {/* Action Panel */}
              <div className="lg:col-span-1">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>

                  <div className="space-y-3">
                    <ActionButton icon={<FiEdit3 className="w-4 h-4" />} label="Edit Profile" onClick={() => console.log('Edit profile')} delay={1.0} />
                    <ActionButton icon={<FiSettings className="w-4 h-4" />} label="Settings" onClick={() => console.log('Settings')} delay={1.1} />
                    {profileData?.role === 'admin' && (
                      <ActionButton
                        icon={<FiShield className="w-4 h-4" />}
                        label="Admin Panel"
                        onClick={() => console.log('Admin panel')}
                        variant="admin"
                        delay={1.15}
                      />
                    )}
                    <ActionButton icon={<FiLogOut className="w-4 h-4" />} label="Sign Out" onClick={handleSignOut} variant="danger" delay={1.2} />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Info Card Component
interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  delay: number;
}

const InfoCard = ({ icon, label, value, delay }: InfoCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
  >
    <div className="text-indigo-600 mr-4">{icon}</div>
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-gray-900 font-medium break-words">{value}</p>
    </div>
  </motion.div>
);

// Action Button Component
interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger' | 'admin';
  delay: number;
}

const ActionButton = ({ icon, label, onClick, variant = 'default', delay }: ActionButtonProps) => {
  const baseClasses = 'w-full flex items-center justify-center px-4 py-3 rounded-xl font-medium transition-all duration-200';

  const getVariantClasses = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200';
      case 'admin':
        return 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200';
      default:
        return 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-indigo-300';
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${baseClasses} ${getVariantClasses()}`}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </motion.button>
  );
};

// Loading Component
const LoadingProfile = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-12 sm:px-8 sm:py-16">
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white border-t-transparent mb-6"
            />
            <div className="h-8 bg-white bg-opacity-20 rounded-lg w-48 mb-4 animate-pulse" />
            <div className="h-6 bg-white bg-opacity-20 rounded-lg w-24 mb-2 animate-pulse" />
            <div className="h-6 bg-white bg-opacity-20 rounded-lg w-64 animate-pulse" />
          </div>
        </div>
        <div className="px-6 py-8 sm:px-8">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </div>
);

export default ProfileComponent;
