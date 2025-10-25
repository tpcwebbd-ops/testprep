// app/about/page.tsx
import React from 'react';
import { Suspense } from 'react';
import AboutClient from './AboutClient';
import { logger } from 'better-auth';

// ✅ TypeScript interfaces
export type ChildData = {
  id: number | string;
  name: string;
  path: string;
  icon?: string;
  image?: string;
  svg?: string;
  description?: string;
};

export type AboutItem = {
  id: number | string;
  name: string;
  path: string;
  icon?: string;
  image?: string;
  svg?: string;
  description?: string;
  childData?: ChildData[];
};

// ✅ Default fallback data (if API fails)
const defaultAboutData: AboutItem[] = [
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

// ✅ Fetch function (SSR-safe)
async function fetchAboutData(): Promise<AboutItem[]> {
  try {
    const res = await fetch(`${process.env.projectURL}/api/site-setting/about`);

    const resData = await res.json();
    const data = resData.data;
    if (!data || !Array.isArray(data) || data.length === 0) {
      logger.warn('⚠️ API returned no data, using fallback.');
      return defaultAboutData;
    }

    return data;
  } catch (error) {
    logger.error('❌ Error fetching /api/site-setting/about:', error);
    return defaultAboutData;
  }
}

// ✅ Main SSR Component
export default async function AboutPage() {
  const aboutData = await fetchAboutData();

  return (
    <Suspense fallback={<div className="text-center py-20 text-sky-300 animate-pulse">Loading About Page...</div>}>
      {/* Client-side visual component */}
      <AboutClient aboutData={aboutData} />
    </Suspense>
  );
}
