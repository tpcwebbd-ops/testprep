Act as a webApp developer in NextJS with Typescript. PWA is already implement in this NextJS project. And you are using tailwindCss.


import { Globe2, BookOpen, Award, Users, Briefcase, Headphones, GraduationCap, Target, MessageSquare } from 'lucide-react';


export const serviceData = [
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
        description:
          'Tailored courses for students from Class 1 to 10 — focusing on grammar, comprehension, writing, and vocabulary enhancement.',
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
        description:
          'Customized English programs for professionals to enhance business communication, presentation, and negotiation skills.',
      },
      {
        id: 22,
        name: 'Interview & CV Preparation',
        path: '/services/professional-english/interview',
        icon: <Target />,
        description:
          'Learn to present yourself effectively through confident speaking and compelling resume writing for job interviews and promotions.',
      },
      {
        id: 23,
        name: 'Email & Report Writing',
        path: '/services/professional-english/email-writing',
        icon: <MessageSquare />,
        description:
          'Master the art of professional writing — clear, polite, and effective emails and reports that reflect a high level of professionalism.',
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
    description:
      'Personalized coaching sessions designed to focus on your individual learning goals, weaknesses, and exam strategies with expert mentors.',
  },
  {
    id: 5,
    name: 'Workshops & Events',
    path: '/services/workshops',
    icon: <Award />,
    description:
      'Interactive workshops, mock tests, and events that strengthen communication, leadership, and teamwork — essential for real-world success.',
  },
  {
    id: 6,
    name: 'Why Choose Our Services',
    path: '/services/why-choose-us',
    icon: <Target />,
    description:
      'We combine modern learning tools, experienced instructors, and real-world practice to help every learner reach their full potential.',
  },
];


Now you have do generate a Service.tsx it has the following features.
 1. it is responsive for both mobile and desktop.
 2. add a little bit animation on transition div. 
 3. you have to design in one single component.
 4. you have to use glass-effect.

 in Desktop: it show the sidebar in left side. it have a toggle features. in sidebar at the top there is button for toggle.
 if there is  childData then it need to render in accordian. with collasp and view option.


 in mobile: there is 3 icon at the bottom.
    1. home (path: "/")
    2. WhatsApp icon 
    3. Service
