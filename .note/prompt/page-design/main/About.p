Act as a webApp developer in NextJS with Typescript. PWA is already implement in this NextJS project. And you are using tailwindCss.


import { BookOpen, GraduationCap, Briefcase, Users, Globe2, Award } from 'lucide-react'

export const aboutData = [
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
        description:
          'Interactive sessions that build fluency, pronunciation, and confidence in everyday and professional communication.',
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
        description:
          'Professional English classes focused on workplace communication, email writing, presentation skills, and interview preparation.',
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
]


Now you have do generate a About.tsx it has the following features.
 1. it is responsive for both mobile and desktop.
 2. add a little bit animation on transition div. 
 3. you have to design in one single component.
 4. you have to use glass-effect.

 in Desktop: it show the sidebar in left side. it have a toggle features. in sidebar at the top there is button for toggle.
 if there is  childData then it need to render in accordian. with collasp and view option.


 in mobile: there is 3 icon at the bottom.
    1. home (path: "/")
    2. WhatsApp icon 
    3. About
