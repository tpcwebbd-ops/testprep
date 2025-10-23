'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';

type ChildData = {
  id: number | string;
  name: string;
  path: string;
  icon?: string;
  image?: string;
  svg?: string;
  description?: string;
};

type AboutItem = {
  id: number | string;
  name: string;
  path: string;
  icon?: string;
  image?: string;
  svg?: string;
  description?: string;
  childData?: ChildData[];
};

const aboutData: AboutItem[] = [
  {
    id: 1,
    name: 'Our Mission',
    path: '/about/mission',
    icon: '<Globe2 />',
    image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
    svg: '/svgs/mission.svg',
    description:
      'At TestPrep Centre, our mission is to empower ambitious students across Bangladesh to achieve global academic success. We strive to provide world-class test preparation, scholarship guidance, and mentorship to help our students secure fully funded opportunities at top universities in the USA, UK, and Canada.',
  },
  {
    id: 2,
    name: 'About Our Centre',
    path: '/about/centre',
    icon: '<BookOpen />',
    image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
    svg: '/svgs/centre.svg',
    description:
      'Founded with the vision to bridge the gap between Bangladeshi students and international education, TestPrep Centre offers comprehensive online and hybrid learning programs. Our experienced instructors and personalized learning system ensure that each student reaches their highest potential in IELTS, GRE, and GMAT preparation.',
  },
  {
    id: 3,
    name: 'Courses We Offer',
    path: '/about/courses',
    icon: '<GraduationCap />',
    image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
    svg: '/svgs/courses.svg',
    description:
      'We offer expertly designed online courses that prepare students to excel in standardized tests required for global admission and scholarships. Each course is structured for maximum flexibility and real results.',
    childData: [
      {
        id: '3.1',
        name: 'IELTS Preparation',
        path: '/courses/ielts',
        icon: '<BookOpen />',
        image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
        svg: '/svgs/ielts.svg',
        description:
          'Our IELTS course focuses on improving your listening, reading, writing, and speaking skills with intensive practice sessions and expert feedback to help you achieve your target band score.',
      },
      {
        id: '3.2',
        name: 'GRE Preparation',
        path: '/courses/gre',
        icon: '<BookOpen />',
        image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
        svg: '/svgs/gre.svg',
        description:
          'Get ready for graduate studies abroad with our GRE course. We provide comprehensive coverage of quantitative reasoning, verbal reasoning, and analytical writing — with proven strategies for high scores.',
      },
      {
        id: '3.3',
        name: 'GMAT Preparation',
        path: '/courses/gmat',
        icon: '<BookOpen />',
        image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
        svg: '/svgs/gmat.svg',
        description:
          'Designed for MBA aspirants, our GMAT course offers structured lessons, mock tests, and performance tracking to help you stand out in competitive business school applications.',
      },
    ],
  },
  {
    id: 4,
    name: 'Scholarship Support',
    path: '/about/scholarship-support',
    icon: '<Medal />',
    image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
    svg: '/svgs/scholarship.svg',
    description:
      'We go beyond test preparation by helping students craft strong Statements of Purpose (SOPs), recommendation letters, and scholarship essays. Our experts provide step-by-step guidance to find and apply for full-funding opportunities, including TA, GA, and research assistantships.',
  },
  {
    id: 5,
    name: 'Why Choose Us',
    path: '/about/why-choose-us',
    icon: '<Star />',
    image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
    svg: '/svgs/why-choose-us.svg',
    description:
      "With our proven success record and student-centered teaching approach, TestPrep Centre is trusted by learners nationwide. We combine expert mentorship, modern online tools, and data-driven learning insights to maximize each student's success rate in both tests and scholarship applications.",
  },
  {
    id: 6,
    name: 'Our Approach',
    path: '/about/our-approach',
    icon: '<Target />',
    image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
    svg: '/svgs/approach.svg',
    description:
      'Our teaching philosophy blends personalized mentorship with adaptive technology. Every course is data-driven — tracking progress, identifying weaknesses, and continuously improving performance through feedback and simulation-based learning.',
  },
  {
    id: 7,
    name: 'Contact & Location',
    path: '/about/contact',
    icon: '<MapPin />',
    image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
    svg: '/svgs/contact.svg',
    description:
      "TestPrep Centre is based in Bangladesh and proudly serves students nationwide through our online learning platform. Whether you're in Dhaka, Chittagong, or anywhere else, our instructors and counselors are available online to guide you toward your study abroad dream.",
    childData: [
      {
        id: '7.1',
        name: 'Head Office',
        path: '/contact/head-office',
        icon: '<Building2 />',
        image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
        svg: '/svgs/head-office.svg',
        description:
          'Our main office operates in Dhaka, providing both in-person and online counseling sessions for students preparing for their next academic journey abroad.',
      },
      {
        id: '7.2',
        name: 'Get in Touch',
        path: '/contact/get-in-touch',
        icon: '<Phone />',
        image: 'https://i.ibb.co.com/PGXYXwTq/img.jpg',
        svg: '/svgs/get-in-touch.svg',
        description:
          "Reach out to us anytime through our website or social channels for free counseling sessions and course information. We're here to help you every step of the way.",
      },
    ],
  },
];

const DefaultSVG: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0ea5e9" />
      </linearGradient>
    </defs>
    <rect width="200" height="200" rx="24" fill="url(#grad1)" opacity="0.2" />
    <circle cx="100" cy="100" r="60" fill="none" stroke="#38bdf8" strokeWidth="3" opacity="0.6" />
    <circle cx="100" cy="100" r="40" fill="none" stroke="#0ea5e9" strokeWidth="2" opacity="0.8" />
  </svg>
);

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  item: AboutItem | ChildData;
}> = ({ isOpen, onClose, item }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-sky-950 via-blue-900 to-sky-950 rounded-3xl shadow-2xl border-2 border-sky-400/40 animate-scaleIn"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-red-500/30 hover:bg-red-500/50 text-white transition-all duration-300 hover:scale-110 hover:rotate-90 border border-red-400/50"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 md:p-8 lg:p-12">
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6 lg:gap-8 mb-6 md:mb-7 lg:mb-8">
            <div className="flex-shrink-0 w-full md:w-40 lg:w-48 h-40 md:h-40 lg:h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-sky-400/30">
              {item.image ? <Image src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <DefaultSVG className="w-full h-full" />}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-300 mb-3 md:mb-4">
                {item.name}
              </h2>
              <div className="inline-block px-4 py-2 rounded-full bg-sky-400/20 border border-sky-400/40 text-sky-200 text-sm font-semibold">
                Detailed Information
              </div>
            </div>
          </div>

          <div className="prose prose-invert max-w-none mb-6 md:mb-7 lg:mb-8">
            <p className="text-sky-50 leading-relaxed text-base md:text-lg">{item.description}</p>
          </div>

          {'childData' in item && item.childData && (
            <div className="mt-6 md:mt-8 lg:mt-10">
              <h3 className="text-xl md:text-2xl font-bold text-sky-200 mb-4 md:mb-5 lg:mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-gradient-to-b from-sky-400 to-blue-500 rounded-full"></span>
                Related Topics
              </h3>
              <div className="grid gap-4 md:gap-5 lg:gap-6">
                {item.childData.map(child => (
                  <div
                    key={child.id}
                    className="group p-4 md:p-5 lg:p-6 rounded-2xl bg-gradient-to-r from-sky-900/40 to-blue-900/40 border-2 border-sky-400/20 hover:border-sky-400/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-sky-500/20"
                  >
                    <div className="flex flex-col md:flex-row gap-4 md:gap-5 lg:gap-6 items-start">
                      <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 border-sky-400/30">
                        {child.image ? (
                          <Image src={child.image} alt={child.name} className="w-full h-full object-cover" />
                        ) : (
                          <DefaultSVG className="w-full h-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg md:text-xl font-bold text-sky-100 mb-2 md:mb-3 group-hover:text-sky-200 transition-colors">{child.name}</h4>
                        <p className="text-sky-200/80 leading-relaxed">{child.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AboutCard: React.FC<{ item: AboutItem; index: number }> = ({ item, index }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isEven = index % 2 === 0;

  return (
    <>
      <article
        className="group relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-sky-900/30 via-blue-900/20 to-sky-900/30 backdrop-blur-xl border-2 border-sky-400/30 hover:border-sky-400/60 transition-all duration-700 hover:shadow-2xl hover:shadow-sky-500/30 cursor-pointer animate-slideIn"
        style={{ animationDelay: `${index * 150}ms` }}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/0 via-blue-500/5 to-sky-500/0 group-hover:from-sky-500/10 group-hover:via-blue-500/10 group-hover:to-sky-500/10 transition-all duration-700" />

        <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-0`}>
          <div className="relative w-full md:w-1/2 h-64 md:h-80 lg:h-96 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-600/20 to-blue-600/20 z-10 group-hover:opacity-0 transition-opacity duration-500" />
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sky-800 to-blue-900">
                <DefaultSVG className="w-48 h-48 opacity-50" />
              </div>
            )}
            <div className="absolute top-6 left-6 z-20">
              <div className="px-4 py-2 rounded-full bg-sky-500/90 backdrop-blur-sm text-white font-bold text-sm shadow-lg border border-sky-300/50">
                #{index + 1}
              </div>
            </div>
          </div>

          <div className="relative z-10 w-full md:w-1/2 p-4 md:p-6 lg:p-10 flex flex-col justify-center">
            <div className="mb-4 md:mb-5 lg:mb-6">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-300 to-sky-200 mb-2 md:mb-3 lg:mb-4 group-hover:scale-105 transition-transform duration-300">
                {item.name}
              </h3>
              {item.childData && (
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <div className="px-2 md:px-3 py-1 rounded-full bg-sky-400/20 border border-sky-400/40 text-sky-300 text-xs font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></span>
                    {item.childData.length} sub-topics
                  </div>
                </div>
              )}
            </div>

            <p className="text-sky-100 leading-relaxed text-sm md:text-base lg:text-lg mb-4 md:mb-6 lg:mb-8 line-clamp-5">{item.description}</p>

            <div className="flex items-center gap-3 text-sky-300 group-hover:text-sky-200 transition-colors duration-300">
              <span className="text-sm font-semibold uppercase tracking-wider">Explore Details</span>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-sky-400 to-transparent"></div>
              <svg
                className="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </div>
      </article>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} item={item} />
    </>
  );
};

const FloatingShape: React.FC<{ delay: number; duration: number; x: string; y: string }> = ({ delay, duration, x, y }) => (
  <div
    className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-sky-400/10 to-blue-500/10 blur-3xl animate-float"
    style={{
      left: x,
      top: y,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
    }}
  />
);

const AboutPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen py-6 px-2 md:py-8 md:px-4 lg:py-10 lg:px-8 bg-gradient-to-br from-slate-950 via-sky-950 to-blue-950 relative overflow-hidden">
      <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20" style={{ backgroundImage: "url('/bg/bg.PNG')" }} />

      <FloatingShape delay={0} duration={20} x="10%" y="10%" />
      <FloatingShape delay={2} duration={25} x="80%" y="20%" />
      <FloatingShape delay={4} duration={22} x="20%" y="70%" />
      <FloatingShape delay={6} duration={28} x="70%" y="80%" />

      <section className="relative z-10 mx-auto max-w-7xl">
        <div className={`text-center mb-8 md:mb-12 lg:mb-16 transition-all duration-700 ${scrolled ? 'opacity-90 scale-98' : 'opacity-100 scale-100'}`}>
          <div className="inline-block mb-3 md:mb-4 lg:mb-6 px-4 md:px-5 lg:px-6 py-2 md:py-2.5 lg:py-3 rounded-full bg-sky-500/20 border-2 border-sky-400/40 backdrop-blur-sm animate-pulse shadow-lg shadow-sky-500/20">
            <span className="text-sky-300 text-xs md:text-sm font-bold uppercase tracking-wider">Welcome to TestPrep Centre</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-200 to-sky-300 drop-shadow-2xl mb-3 md:mb-4 lg:mb-6 animate-fadeIn leading-tight px-2">
            About TestPrep Centre
          </h1>
          <p
            className="mt-3 md:mt-4 lg:mt-6 text-sm md:text-base lg:text-xl text-sky-200 max-w-4xl mx-auto leading-relaxed animate-fadeIn px-2 md:px-4"
            style={{ animationDelay: '300ms' }}
          >
            Empowering Bangladeshi students for global academic success through world-class test preparation, scholarship guidance, and personalized mentorship
            for a brighter future.
          </p>
        </div>

        <div className="space-y-4 md:space-y-6 lg:space-y-10">
          {aboutData.map((item, index) => (
            <AboutCard key={item.id} item={item} index={index} />
          ))}
        </div>

        <div className="mt-10 md:mt-14 lg:mt-20 flex justify-center animate-fadeIn" style={{ animationDelay: '1s' }}>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group px-6 md:px-8 lg:px-10 py-3 md:py-4 lg:py-5 rounded-2xl text-base md:text-lg font-bold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-2xl shadow-sky-500/50 hover:shadow-sky-500/70 transition-all duration-500 hover:scale-105 flex items-center gap-3 md:gap-4 border-2 border-sky-300/30"
          >
            <span>Ready to Start Your Journey?</span>
            <svg
              className="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-30px) translateX(20px);
          }
          50% {
            transform: translateY(20px) translateX(-20px);
          }
          75% {
            transform: translateY(-10px) translateX(30px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
          opacity: 0;
        }

        .animate-slideIn {
          animation: slideIn 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out forwards;
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .line-clamp-5 {
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .scale-98 {
          transform: scale(0.98);
        }
      `}</style>
    </main>
  );
};

export default AboutPage;
