'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  MessageCircle,
  HelpCircle,
  MessageCircleQuestion,
  BookOpen,
  GraduationCap,
  Users,
  Briefcase,
  Clock,
  Globe2,
  Award,
  ChevronDown,
} from 'lucide-react';
import MainFooter from '@/components/common/MainFooter';

const FAQ = () => {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

  const toggleSection = (id: number) => {
    setActiveSection(activeSection === id ? null : id);
  };

  const toggleQuestion = (id: number) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  interface IFaqData {
    id: number;
    name: string;
    path: string;
    icon: React.JSX.Element;
    childData?: {
      id: number;
      name: string;
      path: string;
      icon: React.JSX.Element;
      description?: string;
    }[];
  }

  const faqData: IFaqData[] = [
    {
      id: 1,
      name: 'General Questions',
      path: '/faq/general',
      icon: <HelpCircle />,
      childData: [
        {
          id: 11,
          name: 'What courses do you offer?',
          path: '/faq/general/courses',
          icon: <BookOpen />,
          description:
            'We offer IELTS Preparation, Spoken English, Special English (for Classes 1–10), and English for Professionals. Each course is designed to match different learning needs and goals.',
        },
        {
          id: 12,
          name: 'Who can join your centre?',
          path: '/faq/general/eligibility',
          icon: <Users />,
          description:
            'Our programs are open to school students, college students, job seekers, and working professionals who wish to improve their English skills.',
        },
        {
          id: 13,
          name: 'Do you provide online classes?',
          path: '/faq/general/online',
          icon: <Globe2 />,
          description: 'Yes! We provide both online and offline (in-person) classes to ensure flexibility for all learners.',
        },
      ],
    },
    {
      id: 2,
      name: 'IELTS Related Questions',
      path: '/faq/ielts',
      icon: <GraduationCap />,
      childData: [
        {
          id: 21,
          name: 'How long is the IELTS course?',
          path: '/faq/ielts/duration',
          icon: <Clock />,
          description: 'The IELTS course usually runs for 8–12 weeks depending on your current English level and desired band score.',
        },
        {
          id: 22,
          name: 'Do you conduct mock tests?',
          path: '/faq/ielts/mock-tests',
          icon: <Award />,
          description: 'Yes, we conduct regular mock tests for Listening, Reading, Writing, and Speaking — following the official IELTS format.',
        },
        {
          id: 23,
          name: 'Are your trainers certified?',
          path: '/faq/ielts/trainers',
          icon: <Users />,
          description: 'All our IELTS instructors are highly experienced and certified, with a strong record of helping students achieve their target scores.',
        },
      ],
    },
    {
      id: 3,
      name: 'Spoken English Questions',
      path: '/faq/spoken-english',
      icon: <MessageCircleQuestion />,
      childData: [
        {
          id: 31,
          name: 'What is the focus of Spoken English classes?',
          path: '/faq/spoken-english/focus',
          icon: <Users />,
          description: 'Our Spoken English course focuses on improving pronunciation, fluency, grammar usage, and real-life conversation confidence.',
        },
        {
          id: 32,
          name: 'Do you teach accent improvement?',
          path: '/faq/spoken-english/accent',
          icon: <MessageCircleQuestion />,
          description: 'Yes! Accent training and pronunciation practice are included in the Spoken English course for all learners.',
        },
        {
          id: 33,
          name: 'Are classes interactive?',
          path: '/faq/spoken-english/interactive',
          icon: <BookOpen />,
          description: 'Absolutely. We use role-play, group discussions, and live speaking sessions to make every class engaging and interactive.',
        },
      ],
    },
    {
      id: 4,
      name: 'Professional English Questions',
      path: '/faq/professional-english',
      icon: <Briefcase />,
      childData: [
        {
          id: 41,
          name: 'What topics are covered in Professional English?',
          path: '/faq/professional-english/topics',
          icon: <BookOpen />,
          description: 'Our Professional English course includes business communication, presentation skills, email writing, and interview preparation.',
        },
        {
          id: 42,
          name: 'Is it suitable for corporate employees?',
          path: '/faq/professional-english/employees',
          icon: <Users />,
          description: 'Yes! The program is ideal for executives, managers, and entrepreneurs who want to communicate confidently in professional settings.',
        },
      ],
    },
    {
      id: 5,
      name: 'Admissions & Fees',
      path: '/faq/admissions',
      icon: <Clock />,
      childData: [
        {
          id: 51,
          name: 'How can I register for a course?',
          path: '/faq/admissions/register',
          icon: <Globe2 />,
          description: 'You can register online through our website or visit our centre directly. Our staff will guide you through the admission process.',
        },
        {
          id: 52,
          name: 'Do you offer trial classes?',
          path: '/faq/admissions/trial',
          icon: <Award />,
          description: 'Yes, we offer one free trial class for new students so they can experience our teaching style before enrolling.',
        },
        {
          id: 53,
          name: 'How can I pay the course fees?',
          path: '/faq/admissions/payment',
          icon: <BookOpen />,
          description: 'We accept payments via cash, mobile banking (bKash, Nagad), or online transfer. Installment options are also available.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-purple-200 text-gray-800 relative overflow-hidden">
      {/* Glass effect background */}
      <div className="absolute inset-0 backdrop-blur-md bg-white/30 z-0" />

      {/* Main Content */}
      <main className="flex-1 p-6 relative z-10">
        <div className="max-w-3xl mx-auto bg-white/40 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/20">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">Frequently Asked Questions</h1>

          {/* Accordion Sections */}
          {faqData.map(section => (
            <div key={section.id} className="mb-4 border border-white/30 rounded-xl bg-white/50 shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 text-left text-lg font-semibold hover:bg-white/70 transition-all"
              >
                <span className="flex items-center gap-2 text-blue-700">
                  {section.icon}
                  {section.name}
                </span>
                <ChevronDown className={`transition-transform duration-300 ${activeSection === section.id ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {activeSection === section.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 pb-4 space-y-3"
                  >
                    {section.childData?.map(child => (
                      <div key={child.id} className="border border-white/40 rounded-lg bg-white/40 overflow-hidden">
                        <button
                          onClick={() => toggleQuestion(child.id)}
                          className="flex items-center justify-between w-full text-left p-3 hover:bg-white/60 transition"
                        >
                          <span className="flex items-center gap-2 text-gray-800 text-base font-medium">
                            {child.icon}
                            {child.name}
                          </span>
                          <ChevronDown className={`transition-transform duration-300 ${activeQuestion === child.id ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {activeQuestion === child.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="px-3 pb-3 text-sm text-gray-700 leading-relaxed"
                            >
                              {child.description}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/30 backdrop-blur-md border-t border-white/40 flex md:hidden justify-around py-3 z-50">
        <Link href="/" className="flex flex-col items-center text-gray-700 hover:text-blue-600">
          <Home size={22} />
          <span className="text-xs">Home</span>
        </Link>
        <a
          href="https://wa.me/8801991075127"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center text-gray-700 hover:text-green-600"
        >
          <MessageCircle size={22} />
          <span className="text-xs">WhatsApp</span>
        </a>
        <a href="tel:+8801991075127" className="flex flex-col items-center text-gray-700 hover:text-blue-600">
          <HelpCircle size={22} />
          <span className="text-xs">Call</span>
        </a>
      </nav>
      <MainFooter />
    </div>
  );
};

export default FAQ;
