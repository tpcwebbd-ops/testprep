Act as a webApp developer in NextJS with Typescript. PWA is already implement in this NextJS project. And you are using tailwindCss.


import { HelpCircle, MessageCircleQuestion, BookOpen, GraduationCap, Users, Briefcase, Clock, Globe2, Award } from 'lucide-react';

export const faqData = [
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
        description:
          'Yes! We provide both online and offline (in-person) classes to ensure flexibility for all learners.',
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
        description:
          'The IELTS course usually runs for 8–12 weeks depending on your current English level and desired band score.',
      },
      {
        id: 22,
        name: 'Do you conduct mock tests?',
        path: '/faq/ielts/mock-tests',
        icon: <Award />,
        description:
          'Yes, we conduct regular mock tests for Listening, Reading, Writing, and Speaking — following the official IELTS format.',
      },
      {
        id: 23,
        name: 'Are your trainers certified?',
        path: '/faq/ielts/trainers',
        icon: <Users />,
        description:
          'All our IELTS instructors are highly experienced and certified, with a strong record of helping students achieve their target scores.',
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
        description:
          'Our Spoken English course focuses on improving pronunciation, fluency, grammar usage, and real-life conversation confidence.',
      },
      {
        id: 32,
        name: 'Do you teach accent improvement?',
        path: '/faq/spoken-english/accent',
        icon: <MessageCircleQuestion />,
        description:
          'Yes! Accent training and pronunciation practice are included in the Spoken English course for all learners.',
      },
      {
        id: 33,
        name: 'Are classes interactive?',
        path: '/faq/spoken-english/interactive',
        icon: <BookOpen />,
        description:
          'Absolutely. We use role-play, group discussions, and live speaking sessions to make every class engaging and interactive.',
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
        description:
          'Our Professional English course includes business communication, presentation skills, email writing, and interview preparation.',
      },
      {
        id: 42,
        name: 'Is it suitable for corporate employees?',
        path: '/faq/professional-english/employees',
        icon: <Users />,
        description:
          'Yes! The program is ideal for executives, managers, and entrepreneurs who want to communicate confidently in professional settings.',
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
        description:
          'You can register online through our website or visit our centre directly. Our staff will guide you through the admission process.',
      },
      {
        id: 52,
        name: 'Do you offer trial classes?',
        path: '/faq/admissions/trial',
        icon: <Award />,
        description:
          'Yes, we offer one free trial class for new students so they can experience our teaching style before enrolling.',
      },
      {
        id: 53,
        name: 'How can I pay the course fees?',
        path: '/faq/admissions/payment',
        icon: <BookOpen />,
        description:
          'We accept payments via cash, mobile banking (bKash, Nagad), or online transfer. Installment options are also available.',
      },
    ],
  },
];



Now you have do generate a FAQ.tsx it has the following features.
 1. it is responsive for both mobile and desktop.
 2. add a little bit animation on transition div. 
 3. you have to design in one single component.
 4. you have to use glass-effect.

 in Desktop: it show the sidebar in left side. it have a toggle features. in sidebar at the top there is button for toggle.
 if there is  childData then it need to render in accordian. with collasp and view option.


 in mobile: there is 3 icon at the bottom.
    1. home (path: "/")
    2. WhatsApp icon 
    3. FAQ
