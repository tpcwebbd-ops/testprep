import { SessionDataType } from './ClientComponent';
import Image from 'next/image';

// UserProfileCard component that displays user information
export default function UserProfileCard({ userData }: { userData: SessionDataType }) {
  // Calculate days remaining until expiration
  const getDaysRemaining = () => {
    const today = new Date();
    const expiryDate = new Date(userData.expires);
    const timeDiff = expiryDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  // Format the expiry date
  const formatExpiryDate = () => {
    const date = new Date(userData.expires);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <div className="relative w-24 h-24 rounded">
        <div className="w-24 h-24 rounded-full object-cover border-3 border-blue-500 mb-6 overflow-hidden relative">
          <Image fill src={userData.user.image} alt={userData.user.name} />
        </div>
        <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-2 border-white" />
      </div>

      <h2 className="text-2xl font-bold text-gray-800">{userData.user.name}</h2>
      <p className="text-gray-600 mb-4">{userData.user.email}</p>

      <div className="w-full mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Account Status</span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Active</span>
        </div>

        <div className="flex justify-between items-center mt-3">
          <span className="text-gray-600">Subscription Expires</span>
          <span className="font-medium">{formatExpiryDate() || ''}</span>
        </div>

        <div className="mt-5 bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-800">
            <span className="font-bold">{getDaysRemaining() || ''}</span> days remaining in your subscription
          </p>
        </div>

        <button className="w-full mt-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">Manage Account</button>
      </div>
    </div>
  );
}
