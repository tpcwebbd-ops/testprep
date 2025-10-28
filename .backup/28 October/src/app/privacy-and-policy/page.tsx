'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, MessageCircle, Lock, ChevronDown, ShieldCheck, FileText, Globe2, Mail, Database, Bell, Handshake, UserCheck } from 'lucide-react';
import MainFooter from '@/components/common/MainFooter';

const PrivacyAndPolicy = () => {
  const [activeId, setActiveId] = useState<number | null>(null);

  const toggleAccordion = (id: number) => {
    setActiveId(activeId === id ? null : id);
  };
  interface IPrivacyPolicyData {
    id: number;
    name: string;
    path: string;
    icon: React.JSX.Element;
    description?: string;
    childData?: {
      id: number;
      name: string;
      path: string;
      icon: React.JSX.Element;
      description?: string;
    }[];
  }
  const privacyPolicyData: IPrivacyPolicyData[] = [
    {
      id: 1,
      name: 'Introduction',
      path: '/privacy/introduction',
      icon: <ShieldCheck />,
      description:
        'Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website or enroll in our English programs.',
    },
    {
      id: 2,
      name: 'Information We Collect',
      path: '/privacy/information-we-collect',
      icon: <Database />,
      childData: [
        {
          id: 21,
          name: 'Personal Information',
          path: '/privacy/information-we-collect/personal',
          icon: <UserCheck />,
          description:
            'We collect details such as your name, phone number, email address, and academic background when you register for a course or contact us.',
        },
        {
          id: 22,
          name: 'Usage Data',
          path: '/privacy/information-we-collect/usage',
          icon: <Globe2 />,
          description:
            'We automatically collect information like your device type, browser, and pages visited to improve website performance and user experience.',
        },
        {
          id: 23,
          name: 'Cookies & Tracking',
          path: '/privacy/information-we-collect/cookies',
          icon: <FileText />,
          description: 'We use cookies to remember your preferences and enhance navigation. You can disable cookies in your browser settings if you prefer.',
        },
      ],
    },
    {
      id: 3,
      name: 'How We Use Your Information',
      path: '/privacy/how-we-use',
      icon: <Lock />,
      childData: [
        {
          id: 31,
          name: 'Service Improvement',
          path: '/privacy/how-we-use/improvement',
          icon: <ShieldCheck />,
          description: 'We use your data to personalize your learning experience, improve our courses, and communicate important updates.',
        },
        {
          id: 32,
          name: 'Communication',
          path: '/privacy/how-we-use/communication',
          icon: <Mail />,
          description:
            'We may contact you via email, phone, or SMS for course updates, feedback requests, or marketing communications (only with your consent).',
        },
        {
          id: 33,
          name: 'Analytics',
          path: '/privacy/how-we-use/analytics',
          icon: <Database />,
          description: 'Anonymous data may be used for analytical purposes to help us understand user behavior and improve website performance.',
        },
      ],
    },
    {
      id: 4,
      name: 'Data Protection & Security',
      path: '/privacy/data-protection',
      icon: <ShieldCheck />,
      description: 'We take appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.',
    },
    {
      id: 5,
      name: 'Third-Party Services',
      path: '/privacy/third-party',
      icon: <Handshake />,
      description:
        'We may use third-party tools (like analytics or payment processors) that follow strict privacy standards. We do not sell or rent your personal data to others.',
    },
    {
      id: 6,
      name: 'User Rights',
      path: '/privacy/rights',
      icon: <UserCheck />,
      childData: [
        {
          id: 61,
          name: 'Access & Correction',
          path: '/privacy/rights/access',
          icon: <FileText />,
          description: 'You can request access to your personal data and ask for corrections if any information is inaccurate or outdated.',
        },
        {
          id: 62,
          name: 'Data Deletion',
          path: '/privacy/rights/deletion',
          icon: <Lock />,
          description: 'You have the right to request deletion of your personal information from our records, subject to applicable legal requirements.',
        },
        {
          id: 63,
          name: 'Withdraw Consent',
          path: '/privacy/rights/withdraw',
          icon: <Bell />,
          description: 'If you previously agreed to receive communications from us, you can withdraw your consent anytime by contacting our support team.',
        },
      ],
    },
    {
      id: 7,
      name: 'Policy Updates',
      path: '/privacy/updates',
      icon: <FileText />,
      description: 'We may update this Privacy Policy from time to time. The latest version will always be available on this page with the updated date.',
    },
    {
      id: 8,
      name: 'Contact Information',
      path: '/privacy/contact',
      icon: <Mail />,
      description: 'If you have any questions or concerns regarding this Privacy Policy, please contact us via email or through our contact page.',
    },
  ];
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-lg z-0" />

      {/* ===== MAIN CONTENT ===== */}
      <main className="relative z-10 flex-1 p-6 md:p-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl font-semibold mb-6 flex items-center gap-3"
        >
          <ShieldCheck className="w-7 h-7 text-green-400" />
          Privacy & Policy
        </motion.h1>

        <div className="max-w-4xl mx-auto space-y-4">
          {privacyPolicyData.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() => toggleAccordion(item.id)}
                className="w-full flex justify-between items-center px-5 py-4 text-left hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-green-400">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </div>
                {item.childData && (
                  <motion.div animate={{ rotate: activeId === item.id ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="w-5 h-5 text-gray-300" />
                  </motion.div>
                )}
              </button>

              {/* Description or Accordion */}
              <AnimatePresence>
                {activeId === item.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-5 space-y-3"
                  >
                    {item.description && <p className="text-gray-300 text-sm">{item.description}</p>}

                    {item.childData &&
                      item.childData.map(child => (
                        <div key={child.id} className="mt-2 border-t border-white/10 pt-3">
                          <h3 className="flex items-center gap-2 text-base font-medium text-blue-300">
                            {child.icon}
                            {child.name}
                          </h3>
                          <p className="text-gray-400 text-sm mt-1">{child.description}</p>
                        </div>
                      ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </main>

      {/* ===== MOBILE BOTTOM NAV ===== */}
      <div className="md:hidden fixed bottom-0 left-0 w-full backdrop-blur-lg bg-white/10 border-t border-white/10 py-2 flex justify-around text-white z-50">
        <Link href="/" className="flex flex-col items-center text-xs">
          <Home className="w-5 h-5 mb-1" />
          Home
        </Link>

        <a href="tel:+8801991075127" className="flex flex-col items-center text-xs">
          <MessageCircle className="w-5 h-5 mb-1 text-green-400" />
          Call
        </a>

        <Link href="/privacy" className="flex flex-col items-center text-xs">
          <Lock className="w-5 h-5 mb-1 text-blue-400" />
          Privacy
        </Link>
      </div>
      <div className="w-full h-auto bg-slate-100">
        <MainFooter />
      </div>
    </div>
  );
};

export default PrivacyAndPolicy;
