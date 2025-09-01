/*
|-----------------------------------------
| setting up PaymentGateway for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, August, 2025
|-----------------------------------------
*/

'use client';

import { useState } from 'react';
import { Course } from './page';
import TransactionForm from './TransectionForm';
import { CreditCard, Shield, CheckCircle, Lock, Star, Users, Award } from 'lucide-react';

// Main Payment Component
const PaymentGateway: React.FC<{ course: Course }> = ({ course }) => {
  const [paymentStep, setPaymentStep] = useState<'payment' | 'success'>('payment');

  // This will be set to 'success' when payment is complete
  // For demo purposes, you can uncomment the line below to test the success state
  // const [paymentStep, setPaymentStep] = React.useState<'payment' | 'success'>('success');

  // Animated Background Component
  const PaymentAnimatedBackground: React.FC = () => {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50"></div>

        {/* Floating Payment Icons */}
        <div className="absolute top-20 left-16 w-16 h-16 bg-green-200/30 rounded-full animate-float delay-0 flex items-center justify-center">
          <CreditCard className="w-8 h-8 text-green-500/50" />
        </div>
        <div className="absolute top-60 right-24 w-20 h-20 bg-blue-200/30 rounded-full animate-float delay-1000 flex items-center justify-center">
          <Shield className="w-10 h-10 text-blue-500/50" />
        </div>
        <div className="absolute bottom-32 left-1/3 w-14 h-14 bg-purple-200/30 rounded-full animate-float delay-2000 flex items-center justify-center">
          <Lock className="w-7 h-7 text-purple-500/50" />
        </div>
        <div className="absolute bottom-60 right-1/4 w-18 h-18 bg-emerald-200/30 rounded-full animate-float delay-500 flex items-center justify-center">
          <CheckCircle className="w-9 h-9 text-emerald-500/50" />
        </div>

        {/* Geometric Shapes */}
        <div className="absolute top-1/4 left-3/4 w-12 h-12 bg-gradient-to-br from-blue-300/20 to-purple-300/20 rotate-45 animate-pulse delay-300"></div>
        <div className="absolute top-3/4 right-1/3 w-8 h-8 bg-gradient-to-br from-green-300/20 to-blue-300/20 rotate-12 animate-pulse delay-700"></div>

        {/* Moving Gradients */}
        <div
          className="absolute -top-48 -right-48 w-96 h-96 bg-gradient-to-r from-emerald-400/10 to-blue-400/10 rounded-full animate-spin"
          style={{ animationDuration: '25s' }}
        ></div>
        <div
          className="absolute -bottom-48 -left-48 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full animate-spin"
          style={{ animationDuration: '30s', animationDirection: 'reverse' }}
        ></div>
      </div>
    );
  };

  // Payment Success Component
  const PaymentSuccess: React.FC = () => {
    return (
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-4xl font-bold text-gray-900 mb-4">Payment Done!</h2>
        <p className="text-xl text-gray-600 mb-8">Your enrollment has been successfully processed</p>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 mb-8">
          <h3 className="font-semibold text-green-900 mb-3">What happens next?</h3>
          <div className="space-y-2 text-left">
            <div className="flex items-center space-x-3 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span>Access to course materials within 24 hours</span>
            </div>
            <div className="flex items-center space-x-3 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span>Welcome email with login credentials</span>
            </div>
            <div className="flex items-center space-x-3 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span>Live class schedule notification</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => (window.location.href = '/my-class')}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Go to My Class
        </button>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen">
      <PaymentAnimatedBackground />

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Secure Payment Gateway
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">Complete your enrollment with our secure and trusted payment system</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {paymentStep === 'payment' ? (
            <div className="flex items-center justify-center gap-12">
              {/* Right Column - Transaction Form */}
              <div className="space-y-8">
                <TransactionForm course={course} setPaymentStep={setPaymentStep} />

                {/* Trust Indicators */}
                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Why Choose Us?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="text-gray-700">4.9/5 Student Rating</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-blue-500" />
                      <span className="text-gray-700">10,000+ Students</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-purple-500" />
                      <span className="text-gray-700">Certified Instructors</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Money Back Guarantee</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Payment Success View */
            <div className="max-w-2xl mx-auto">
              <PaymentSuccess />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default PaymentGateway;
