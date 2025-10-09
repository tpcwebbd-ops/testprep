/*
|-----------------------------------------
| About Page (No Sidebar)
| @author: Toufiquer Rahman
|-----------------------------------------
*/

'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Info, MessageCircle, Globe2, BookOpen, GraduationCap, Award, Users, Briefcase } from 'lucide-react';
import MainFooter from '@/components/common/MainFooter';

export default function About() {
  const aboutData = [
    {
      id: 1,
      name: 'Our Mission',
      path: '/about/mission',
      icon: <Globe2 />,
      description:
        'To empower learners of all ages with strong English communication skills, helping them achieve excellence in academics, career, and global opportunities.',
    },
    {
      id: 2,
      name: 'About Our Centre',
      path: '/about/centre',
      icon: <BookOpen />,
      description:
        'We are a leading English Centre dedicated to providing high-quality language education. Our programs are designed for school students, professionals, and test-takers who wish to excel in IELTS, Spoken English, and academic English.',
    },
    {
      id: 3,
      name: 'Courses We Offer',
      path: '/about/courses',
      icon: <GraduationCap />,
      childData: [
        {
          id: 31,
          name: 'IELTS Preparation',
          path: '/about/courses/ielts',
          icon: <Award />,
          description:
            'Comprehensive training focused on Listening, Reading, Writing, and Speaking — designed to help students achieve their target band score with confidence.',
        },
        {
          id: 32,
          name: 'Spoken English',
          path: '/about/courses/spoken-english',
          icon: <Users />,
          description: 'Interactive sessions that build fluency, pronunciation, and confidence in everyday and professional communication.',
        },
        {
          id: 33,
          name: 'Special English (Class 1–10)',
          path: '/about/courses/school-english',
          icon: <BookOpen />,
          description:
            'Custom English programs aligned with school syllabuses — designed to strengthen grammar, vocabulary, and writing skills for students from Class 1 to 10.',
        },
        {
          id: 34,
          name: 'English for Professionals',
          path: '/about/courses/professionals',
          icon: <Briefcase />,
          description: 'Professional English classes focused on workplace communication, email writing, presentation skills, and interview preparation.',
        },
      ],
    },
    {
      id: 4,
      name: 'Why Choose Us',
      path: '/about/why-choose-us',
      icon: <Award />,
      description:
        'Experienced instructors, personalized attention, interactive learning environment, and proven success in helping students achieve language mastery.',
    },
    {
      id: 5,
      name: 'Our Approach',
      path: '/about/approach',
      icon: <Users />,
      description:
        'We combine modern teaching techniques with real-life practice. Every class encourages participation, collaboration, and confidence-building in English usage.',
    },
    {
      id: 6,
      name: 'Contact & Location',
      path: '/about/contact',
      icon: <Globe2 />,
      description:
        'Located at a convenient and accessible place, our centre welcomes students and professionals. For inquiries or admissions, visit our contact page or reach out via phone or email.',
    },
  ];

  return (
    <>
      <main className="min-h-screen w-full bg-gradient-to-br from-blue-100/40 to-purple-100/30 backdrop-blur-xl text-gray-800 p-6 pb-24 md:pb-6">
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 transition-all duration-500">
          {aboutData.map(item => (
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
                    <div key={child.id} className="transition-all duration-300 hover:translate-x-1">
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

      {/* ✅ Fixed Mobile Bottom Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/30 backdrop-blur-2xl border-t border-white/40 flex justify-around items-center h-16 md:hidden shadow-lg">
        <Link href="/" className="flex flex-col items-center justify-center text-blue-700 hover:text-blue-900 transition">
          <Home size={22} />
          <span className="text-[10px] mt-1 font-medium">Home</span>
        </Link>

        <Link
          href="https://wa.me/your-whatsapp-number"
          target="_blank"
          className="flex flex-col items-center justify-center text-green-600 hover:text-green-800 transition"
        >
          <MessageCircle size={22} />
          <span className="text-[10px] mt-1 font-medium">Chat</span>
        </Link>

        <Link href="/about" className="flex flex-col items-center justify-center text-blue-700 hover:text-blue-900 transition">
          <Info size={22} />
          <span className="text-[10px] mt-1 font-medium">About</span>
        </Link>
      </nav>

      <MainFooter />
      <style jsx>{`
        .glassy {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
        }

        /* Smooth card animation */
        .card-enter {
          opacity: 0;
          transform: translateY(10px);
        }
        .card-enter-active {
          opacity: 1;
          transform: translateY(0);
          transition: all 0.4s ease;
        }

        /* Fix bottom nav for iPhones and safe areas */
        nav {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </>
  );
}
