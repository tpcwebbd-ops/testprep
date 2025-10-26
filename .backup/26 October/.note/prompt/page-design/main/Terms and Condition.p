Act as a webApp developer in NextJS with Typescript. PWA is already implement in this NextJS project. And you are using tailwindCss.


import { FileText, ShieldCheck, Handshake, Scale, AlertTriangle, UserCheck, Globe2, BookOpen, Mail } from 'lucide-react';

export const termsAndConditionsData = [
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
        description:
          'Students must complete the registration form and provide accurate information. Enrollment is confirmed only after payment is received.',
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
        description:
          'The Centre reserves the right to modify class schedules, instructors, or course content to maintain quality and relevance.',
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
    description:
      'These Terms are governed by the laws of Bangladesh. Any disputes shall be resolved under the jurisdiction of local courts.',
  },
  {
    id: 11,
    name: 'Contact Information',
    path: '/terms/contact',
    icon: <Mail />,
    description:
      'For questions or concerns regarding these Terms and Conditions, please contact us through our contact page or via email.',
  },
];


Now you have do generate a TermsAndCondition.tsx it has the following features.
 1. it is responsive for both mobile and desktop.
 2. add a little bit animation on transition div. 
 3. you have to design in one single component.
 4. you have to use glass-effect.

 in Desktop: it show the sidebar in left side. it have a toggle features. in sidebar at the top there is button for toggle.
 if there is  childData then it need to render in accordian. with collasp and view option.


 in mobile: there is 3 icon at the bottom.
    1. home (path: "/")
    2. WhatsApp icon 
    3. TermsAndCondition
