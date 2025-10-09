'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, MessageCircle, GraduationCap, Award, Users, BookOpen, Briefcase, Target, MessageSquare, Globe2, Headphones } from 'lucide-react';
import MainFooter from '@/components/common/MainFooter';

const Service = () => {
  interface IServiceData {
    id: number;
    name: string;
    path: string;
    icon: React.JSX.Element;
    childData?: {
      id: number;
      name: string;
      path: string;
      icon: React.JSX.Element;
      description: string;
    }[];
    description?: string;
  }

  const serviceData: IServiceData[] = [
    {
      id: 1,
      name: 'Language Training',
      path: '/services/language-training',
      icon: <GraduationCap />,
      childData: [
        {
          id: 11,
          name: 'IELTS Preparation',
          path: '/services/language-training/ielts',
          icon: <Award />,
          description:
            'Intensive IELTS courses designed to build mastery across Listening, Reading, Writing, and Speaking modules to achieve your target band score.',
        },
        {
          id: 12,
          name: 'Spoken English',
          path: '/services/language-training/spoken-english',
          icon: <Users />,
          description:
            'Practical communication sessions that develop fluency, pronunciation, and confidence for everyday conversations and professional settings.',
        },
        {
          id: 13,
          name: 'Academic English (School Level)',
          path: '/services/language-training/academic-english',
          icon: <BookOpen />,
          description: 'Tailored courses for students from Class 1 to 10 — focusing on grammar, comprehension, writing, and vocabulary enhancement.',
        },
      ],
    },
    {
      id: 2,
      name: 'Professional English',
      path: '/services/professional-english',
      icon: <Briefcase />,
      childData: [
        {
          id: 21,
          name: 'Corporate English Training',
          path: '/services/professional-english/corporate',
          icon: <Users />,
          description: 'Customized English programs for professionals to enhance business communication, presentation, and negotiation skills.',
        },
        {
          id: 22,
          name: 'Interview & CV Preparation',
          path: '/services/professional-english/interview',
          icon: <Target />,
          description: 'Learn to present yourself effectively through confident speaking and compelling resume writing for job interviews and promotions.',
        },
        {
          id: 23,
          name: 'Email & Report Writing',
          path: '/services/professional-english/email-writing',
          icon: <MessageSquare />,
          description: 'Master the art of professional writing — clear, polite, and effective emails and reports that reflect a high level of professionalism.',
        },
      ],
    },
    {
      id: 3,
      name: 'Online Learning Programs',
      path: '/services/online-learning',
      icon: <Globe2 />,
      description:
        'Access flexible, high-quality English learning from anywhere in the world. Join live interactive classes, practice tests, and feedback sessions online.',
    },
    {
      id: 4,
      name: 'One-on-One Mentoring',
      path: '/services/mentoring',
      icon: <Headphones />,
      description: 'Personalized coaching sessions designed to focus on your individual learning goals, weaknesses, and exam strategies with expert mentors.',
    },
    {
      id: 5,
      name: 'Workshops & Events',
      path: '/services/workshops',
      icon: <Award />,
      description: 'Interactive workshops, mock tests, and events that strengthen communication, leadership, and teamwork — essential for real-world success.',
    },
    {
      id: 6,
      name: 'Why Choose Our Services',
      path: '/services/why-choose-us',
      icon: <Target />,
      description: 'We combine modern learning tools, experienced instructors, and real-world practice to help every learner reach their full potential.',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100/40 to-purple-100/30 backdrop-blur-xl text-gray-800 p-6 pb-24 md:pb-6">
      {/* Page Title */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mt-10">
        <h1 className="text-4xl font-bold mb-2">Our Services</h1>
        <p className="text-gray-300 text-sm max-w-xl mx-auto">
          Explore our comprehensive English learning programs designed to help you achieve your personal and professional goals.
        </p>
      </motion.div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto">
        {serviceData.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl shadow-lg p-5 transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-blue-400 text-xl">{item.icon}</span>
              <h2 className="text-lg font-semibold">{item.name}</h2>
            </div>
            {item.description && <p className="text-sm text-gray-300">{item.description}</p>}
            {item.childData && (
              <ul className="mt-3 space-y-2">
                {item.childData.map(child => (
                  <li key={child.id} className="text-sm text-gray-400 hover:text-white transition-all">
                    <Link href={child.path}>• {child.name}</Link>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        ))}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full backdrop-blur-lg bg-white/10 border-t border-white/10 py-2 flex justify-around text-white">
        <Link href="/" className="flex flex-col items-center text-xs">
          <Home className="w-5 h-5 mb-1" />
          Home
        </Link>

        <a href="https://wa.me/8801XXXXXXXXX" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-xs">
          <MessageCircle className="w-5 h-5 mb-1 text-green-400" />
          WhatsApp
        </a>

        <Link href="/services" className="flex flex-col items-center text-xs">
          <GraduationCap className="w-5 h-5 mb-1 text-blue-400" />
          Services
        </Link>
      </div>
      <div className="w-full h-auto bg-slate-100">
        <MainFooter />
      </div>
    </div>
  );
};

export default Service;
