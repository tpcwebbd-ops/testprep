/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: testprep-webapp, October, 2025
|-----------------------------------------
*/

'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Menu, X, Home, Info, MessageCircle, Users, Globe2, Award, Briefcase, BookOpen, GraduationCap, Link } from 'lucide-react';

export default function About() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleAccordion = (id: number) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

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
      <div className="flex min-h-screen w-full bg-gradient-to-br from-blue-100/40 to-purple-100/30 backdrop-blur-xl text-gray-800 relative pb-20 md:pb-0">
        {/* Sidebar */}
        <aside
          className={`hidden md:flex flex-col glassy h-screen transition-all duration-500 ease-in-out ${
            isSidebarOpen ? 'w-72' : 'w-20'
          } fixed left-0 top-0 p-4 bg-white/20 backdrop-blur-xl border-r border-white/30 shadow-lg`}
        >
          {/* Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition mb-6 flex items-center justify-center"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Sidebar Items */}
          <div className="overflow-y-auto custom-scroll flex-1">
            {aboutData.map(item => (
              <div key={item.id} className="mb-2">
                <button
                  onClick={() => (item.childData ? toggleAccordion(item.id) : null)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition ${activeAccordion === item.id ? 'bg-white/20' : ''}`}
                >
                  <span className="text-blue-600">{item.icon}</span>
                  {isSidebarOpen && <span className="text-sm font-semibold">{item.name}</span>}
                  {item.childData && isSidebarOpen && (
                    <span className="ml-auto">{activeAccordion === item.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
                  )}
                </button>

                {/* Accordion Content */}
                {item.childData && activeAccordion === item.id && isSidebarOpen && (
                  <div className="pl-10 mt-1 space-y-2">
                    {item.childData.map(child => (
                      <Link href={child.path} key={child.id} className="block text-sm hover:text-blue-700 transition">
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-500 ease-in-out p-6 md:ml-${isSidebarOpen ? '72' : '20'} pb-24 md:pb-0`}>
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
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

        {/* Mobile Sidebar */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-40 md:hidden">
            <div className="absolute left-0 top-0 h-full w-3/4 bg-white/30 backdrop-blur-2xl p-4 shadow-lg animate-slideIn">
              <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 bg-white/30 rounded-lg mb-6">
                <X size={20} />
              </button>

              <div className="overflow-y-auto">
                {aboutData.map(item => (
                  <div key={item.id} className="mb-2">
                    <button
                      onClick={() => (item.childData ? toggleAccordion(item.id) : null)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/20 transition ${
                        activeAccordion === item.id ? 'bg-white/20' : ''
                      }`}
                    >
                      <span className="text-blue-600">{item.icon}</span>
                      <span className="text-sm font-semibold">{item.name}</span>
                      {item.childData && <span className="ml-auto">{activeAccordion === item.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>}
                    </button>

                    {item.childData && activeAccordion === item.id && (
                      <div className="pl-10 mt-1 space-y-2">
                        {item.childData.map(child => (
                          <Link href={child.path} key={child.id} className="block text-sm hover:text-blue-700 transition">
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

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

        <button onClick={() => setIsMobileSidebarOpen(true)} className="flex flex-col items-center justify-center text-blue-700 hover:text-blue-900 transition">
          <Info size={22} />
          <span className="text-[10px] mt-1 font-medium">About</span>
        </button>
      </nav>

      <style jsx>{`
        .glassy {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
        }

        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.4s ease forwards;
        }

        /* Fix bottom nav for iPhones and safe areas */
        nav {
          padding-bottom: env(safe-area-inset-bottom);
        }

        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
      `}</style>
    </>
  );
}
