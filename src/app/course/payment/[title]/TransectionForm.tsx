/*
|-----------------------------------------
| setting up TransectionForm for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, August, 2025
|-----------------------------------------
*/

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for redirection
import { Course } from './page';
import { CheckCircle, CreditCard, Shield, Banknote, Smartphone, Loader2 } from 'lucide-react';

// An array of payment methods for easier management
const paymentMethods = [
  { id: 'visa', name: 'Visa', icon: 'https://cdn.worldvectorlogo.com/logos/visa-4.svg' },
  { id: 'mastercard', name: 'Mastercard', icon: 'https://cdn.worldvectorlogo.com/logos/mastercard-7.svg' },
  { id: 'amex', name: 'American Express', icon: 'https://cdn.worldvectorlogo.com/logos/american-express-1.svg' },
  { id: 'bkash', name: 'bKash', icon: 'https://cdn.worldvectorlogo.com/logos/bkash.svg' },
  { id: 'nagad', name: 'Nagad', icon: 'https://cdn.worldvectorlogo.com/logos/nagad-1.svg' },
  { id: 'rocket', name: 'Rocket', icon: 'https://images.seeklogo.com/logo-png/31/1/dutch-bangla-rocket-logo-png_seeklogo-317692.png' },
];

const TransactionForm: React.FC<{ course: Course; setPaymentStep: (step: 'payment' | 'success') => void }> = ({ course, setPaymentStep }) => {
  const router = useRouter(); // Initialize the router
  const [transactionId, setTransactionId] = useState<string>(''); // Default to empty
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isPaying, setIsPaying] = useState<boolean>(false); // State for the "Pay Now" loading
  const [selectedPayment, setSelectedPayment] = useState<string>('visa'); // Default selection

  const handleTransactionChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setTransactionId(value);
  };

  // This function simulates the payment process
  const handlePayNow = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    setIsPaying(true);

    // 2. Show a loading state for 3 seconds
    setTimeout(() => {
      // 3. After 3 seconds, fill the input with a 10-digit random number
      const randomTxId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      setTransactionId(randomTxId);

      // Set the parent component's state to success
      setPaymentStep('success');
      setIsPaying(false);
    }, 3000);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <CreditCard className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Payment</h2>
        <p className="text-gray-600">Select a payment method or enter your transaction ID</p>
      </div>

      <form className="space-y-6">
        {/* Course Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
          <h3 className="font-semibold text-gray-900 mb-3">Course Summary</h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700">{course.courseName}</span>
            <span className="font-bold text-gray-900">৳{course.coursePrice?.toLocaleString()}</span>
          </div>
          <div className="text-sm text-gray-600">Duration: {course.courseDuration || 'Flexible'}</div>
        </div>

        {/* Start of New Payment Method Selection */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 shadow-inner">
          <h3 className="font-semibold text-gray-900 mb-4 text-lg">Select Payment Method</h3>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {paymentMethods.map(method => (
              <div
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
                className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 ease-in-out group hover:shadow-lg hover:-translate-y-1 ${
                  selectedPayment === method.id ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 bg-white/50'
                }`}
              >
                <img src={method.icon} alt={method.name} className="h-8 mx-auto grayscale group-hover:grayscale-0 transition-all duration-300" />
                {selectedPayment === method.id && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-center text-xs text-gray-500 space-x-4">
            <div className="flex items-center space-x-1.5">
              <CreditCard className="w-4 h-4" />
              <span>Cards</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Smartphone className="w-4 h-4" />
              <span>Mobile Banking</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Banknote className="w-4 h-4" />
              <span>Internet Banking</span>
            </div>
          </div>
        </div>
        {/* End of New Payment Method Selection */}

        {/* Pay Now Button */}
        <div>
          <button
            onClick={handlePayNow}
            disabled={isPaying}
            className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isPaying ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay Now ৳${course.coursePrice?.toLocaleString()}`
            )}
          </button>
        </div>

        <div className="relative flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-sm">Or enter manually</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Transaction ID Input */}
        <div className="space-y-2">
          <label htmlFor="transactionId" className="block text-sm font-semibold text-gray-900">
            Transaction ID *
          </label>
          <div className="relative">
            <input
              type="text"
              id="transactionId"
              value={transactionId}
              onChange={handleTransactionChange}
              placeholder="e.g., 1234567890"
              className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-lg font-mono tracking-wider bg-white/80 backdrop-blur-sm"
              maxLength={20}
              disabled={isPaying}
            />
            {/* 4. Input field success popup */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {transactionId.length > 7 && <CheckCircle className="w-6 h-6 text-green-500 animate-pulse" />}
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Enter your transaction code</span>
            <span className={`font-medium ${transactionId.length > 7 ? 'text-green-600' : 'text-gray-400'}`}>{transactionId.length}/20</span>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-green-600" />
            <div>
              <div className="font-semibold text-green-900">Secure Transaction</div>
              <div className="text-sm text-green-700">Your payment information is protected with 256-bit SSL encryption</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
