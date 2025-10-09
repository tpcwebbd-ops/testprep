'use client';

import React from 'react';
import { Home, MessageCircle, FileText, ShieldCheck, Handshake, Scale, AlertTriangle, UserCheck, Globe2, BookOpen, Mail } from 'lucide-react';
import Link from 'next/link';
import MainFooter from '@/components/common/MainFooter';

export default function TermsAndCondition() {
  interface ITermsAndConditionsData {
    id: number;
    name: string;
    path: string;
    description?: string;
    icon: React.JSX.Element;
    childData?: {
      id: number;
      name: string;
      path: string;
      icon: React.JSX.Element;
      description?: string;
    }[];
  }

  const termsAndConditionsData: ITermsAndConditionsData[] = [
    {
      id: 1,
      name: 'Introduction',
      path: '/terms/introduction',
      icon: <FileText />,
      description:
        'These Terms and Conditions govern your use of our website and services. By accessing or enrolling in our English programs, you agree to these terms.',
    },
    {
      id: 2,
      name: 'Eligibility',
      path: '/terms/eligibility',
      icon: <UserCheck />,
      description:
        'Our courses are open to students, professionals, and learners who meet the age and skill requirements for each program. Parents or guardians must provide consent for minors under 18.',
    },
    {
      id: 3,
      name: 'Enrollment & Payment',
      path: '/terms/enrollment',
      icon: <Handshake />,
      childData: [
        {
          id: 31,
          name: 'Registration Process',
          path: '/terms/enrollment/registration',
          icon: <BookOpen />,
          description: 'Students must complete the registration form and provide accurate information. Enrollment is confirmed only after payment is received.',
        },
        {
          id: 32,
          name: 'Payment Policy',
          path: '/terms/enrollment/payment-policy',
          icon: <Scale />,
          description:
            'All fees are payable in advance and are non-transferable. Refunds are provided only under specific conditions mentioned in our refund policy.',
        },
        {
          id: 33,
          name: 'Course Changes',
          path: '/terms/enrollment/course-change',
          icon: <ShieldCheck />,
          description: 'The Centre reserves the right to modify class schedules, instructors, or course content to maintain quality and relevance.',
        },
      ],
    },
    {
      id: 4,
      name: 'Code of Conduct',
      path: '/terms/code-of-conduct',
      icon: <ShieldCheck />,
      description:
        'Students are expected to maintain discipline, respect peers and instructors, and adhere to the rules of the Centre. Misconduct may lead to suspension or termination of enrollment.',
    },
    {
      id: 5,
      name: 'Intellectual Property',
      path: '/terms/intellectual-property',
      icon: <BookOpen />,
      description:
        'All learning materials, videos, and course content are the property of the Centre. Unauthorized copying, sharing, or reproduction is strictly prohibited.',
    },
    {
      id: 6,
      name: 'Limitation of Liability',
      path: '/terms/limitation-of-liability',
      icon: <AlertTriangle />,
      description:
        'While we strive to provide the best learning experience, the Centre is not responsible for indirect or incidental losses arising from course participation or website usage.',
    },
    {
      id: 7,
      name: 'Privacy & Data Protection',
      path: '/terms/privacy',
      icon: <ShieldCheck />,
      description:
        'We handle all personal information according to our Privacy Policy. By using our services, you consent to our data practices described therein.',
    },
    {
      id: 8,
      name: 'Termination of Service',
      path: '/terms/termination',
      icon: <AlertTriangle />,
      description:
        'The Centre reserves the right to terminate access to services for violations of these terms or inappropriate behavior without prior notice.',
    },
    {
      id: 9,
      name: 'Amendments',
      path: '/terms/amendments',
      icon: <Scale />,
      description:
        'We may revise or update these Terms and Conditions from time to time. Continued use of our services constitutes acceptance of the revised terms.',
    },
    {
      id: 10,
      name: 'Governing Law',
      path: '/terms/governing-law',
      icon: <Globe2 />,
      description: 'These Terms are governed by the laws of Bangladesh. Any disputes shall be resolved under the jurisdiction of local courts.',
    },
    {
      id: 11,
      name: 'Contact Information',
      path: '/terms/contact',
      icon: <Mail />,
      description: 'For questions or concerns regarding these Terms and Conditions, please contact us through our contact page or via email.',
    },
  ];

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50/40 to-purple-100/30 backdrop-blur-xl text-gray-800">
        {/* ===== Main Content ===== */}
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Terms and Conditions</h1>

          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 pb-24">
            {termsAndConditionsData.map(item => (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-white/30 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-transform transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-3 text-blue-600">
                  {item.icon}
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                </div>
                <p className="text-sm text-gray-700">{item.description}</p>

                {item.childData && (
                  <div className="mt-4 pl-4 border-l-2 border-blue-300 space-y-2">
                    {item.childData.map(child => (
                      <div key={child.id}>
                        <h4 className="text-base font-semibold flex items-center gap-2 text-blue-700">
                          {child.icon}
                          {child.name}
                        </h4>
                        <p className="text-sm text-gray-700 pl-6">{child.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>

        {/* ===== Main Footer (desktop only) ===== */}
      </div>
      <MainFooter />
      {/* ===== Mobile Bottom Navbar ===== */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-t border-white/40 flex justify-around items-center h-16 md:hidden shadow-lg">
        <Link href="/" className="flex flex-col items-center justify-center text-blue-700 hover:text-blue-900 transition">
          <Home size={22} />
          <span className="text-[10px] mt-1 font-medium">Home</span>
        </Link>

        <Link
          href="https://wa.me/8801991075127"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center text-green-600 hover:text-green-800 transition"
        >
          <MessageCircle size={22} />
          <span className="text-[10px] mt-1 font-medium">Chat</span>
        </Link>

        <Link href="/terms" className="flex flex-col items-center justify-center text-blue-700 hover:text-blue-900 transition">
          <FileText size={22} />
          <span className="text-[10px] mt-1 font-medium">Terms</span>
        </Link>
      </nav>
    </>
  );
}
