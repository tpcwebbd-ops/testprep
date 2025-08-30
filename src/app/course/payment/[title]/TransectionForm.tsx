/*
|-----------------------------------------
| setting up TransectionForm for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, August, 2025
|-----------------------------------------
*/

import { useState } from 'react';
import { Course } from './page';
import { CheckCircle, CreditCard, Shield } from 'lucide-react';

const TransactionForm: React.FC<{ course: Course; setPaymentStep: (step: 'payment' | 'success') => void }> = ({ course, setPaymentStep }) => {
  const [transactionId, setTransactionId] = useState<string>('1234567');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleTransactionChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setTransactionId(value);

    // Invoke function when more than 7 characters are entered
    if (value.length > 7) {
      handleTransactionSubmit(value);
    }
  };

  const handleTransactionSubmit = (txId: string): void => {
    setIsProcessing(true);
    // TODO: Implement your transaction validation logic here
    console.log('Transaction ID submitted:', txId);

    setPaymentStep('success');
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      // You can add your validation logic here
    }, 2000);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <CreditCard className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Payment</h2>
        <p className="text-gray-600">Enter your transaction ID to verify payment</p>
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
              placeholder="1234567"
              className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-lg font-mono tracking-wider bg-white/80 backdrop-blur-sm"
              maxLength={20}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {transactionId.length > 7 && <CheckCircle className="w-6 h-6 text-green-500 animate-pulse" />}
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Enter 7+ digit transaction code</span>
            <span className={`font-medium ${transactionId.length > 7 ? 'text-green-600' : 'text-gray-400'}`}>{transactionId.length}/20</span>
          </div>
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-blue-700 font-medium">Processing transaction...</span>
          </div>
        )}

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
