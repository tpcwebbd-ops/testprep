Act as a webApp developer in NextJS with Typescript. PWA is already implement in this NextJS project. And you are using tailwindCss.


import { ShieldCheck, Lock, UserCheck, FileText, Globe2, Mail, Database, Bell, Handshake } from 'lucide-react';

export const privacyPolicyData = [
  {
    id: 1,
    name: 'Introduction',
    path: '/privacy/introduction',
    icon: <ShieldCheck />,
    description:
      'Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website or enroll in our English programs.',
  },
  {
    id: 2,
    name: 'Information We Collect',
    path: '/privacy/information-we-collect',
    icon: <Database />,
    childData: [
      {
        id: 21,
        name: 'Personal Information',
        path: '/privacy/information-we-collect/personal',
        icon: <UserCheck />,
        description:
          'We collect details such as your name, phone number, email address, and academic background when you register for a course or contact us.',
      },
      {
        id: 22,
        name: 'Usage Data',
        path: '/privacy/information-we-collect/usage',
        icon: <Globe2 />,
        description:
          'We automatically collect information like your device type, browser, and pages visited to improve website performance and user experience.',
      },
      {
        id: 23,
        name: 'Cookies & Tracking',
        path: '/privacy/information-we-collect/cookies',
        icon: <FileText />,
        description:
          'We use cookies to remember your preferences and enhance navigation. You can disable cookies in your browser settings if you prefer.',
      },
    ],
  },
  {
    id: 3,
    name: 'How We Use Your Information',
    path: '/privacy/how-we-use',
    icon: <Lock />,
    childData: [
      {
        id: 31,
        name: 'Service Improvement',
        path: '/privacy/how-we-use/improvement',
        icon: <ShieldCheck />,
        description:
          'We use your data to personalize your learning experience, improve our courses, and communicate important updates.',
      },
      {
        id: 32,
        name: 'Communication',
        path: '/privacy/how-we-use/communication',
        icon: <Mail />,
        description:
          'We may contact you via email, phone, or SMS for course updates, feedback requests, or marketing communications (only with your consent).',
      },
      {
        id: 33,
        name: 'Analytics',
        path: '/privacy/how-we-use/analytics',
        icon: <Database />,
        description:
          'Anonymous data may be used for analytical purposes to help us understand user behavior and improve website performance.',
      },
    ],
  },
  {
    id: 4,
    name: 'Data Protection & Security',
    path: '/privacy/data-protection',
    icon: <ShieldCheck />,
    description:
      'We take appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.',
  },
  {
    id: 5,
    name: 'Third-Party Services',
    path: '/privacy/third-party',
    icon: <Handshake />,
    description:
      'We may use third-party tools (like analytics or payment processors) that follow strict privacy standards. We do not sell or rent your personal data to others.',
  },
  {
    id: 6,
    name: 'User Rights',
    path: '/privacy/rights',
    icon: <UserCheck />,
    childData: [
      {
        id: 61,
        name: 'Access & Correction',
        path: '/privacy/rights/access',
        icon: <FileText />,
        description:
          'You can request access to your personal data and ask for corrections if any information is inaccurate or outdated.',
      },
      {
        id: 62,
        name: 'Data Deletion',
        path: '/privacy/rights/deletion',
        icon: <Lock />,
        description:
          'You have the right to request deletion of your personal information from our records, subject to applicable legal requirements.',
      },
      {
        id: 63,
        name: 'Withdraw Consent',
        path: '/privacy/rights/withdraw',
        icon: <Bell />,
        description:
          'If you previously agreed to receive communications from us, you can withdraw your consent anytime by contacting our support team.',
      },
    ],
  },
  {
    id: 7,
    name: 'Policy Updates',
    path: '/privacy/updates',
    icon: <FileText />,
    description:
      'We may update this Privacy Policy from time to time. The latest version will always be available on this page with the updated date.',
  },
  {
    id: 8,
    name: 'Contact Information',
    path: '/privacy/contact',
    icon: <Mail />,
    description:
      'If you have any questions or concerns regarding this Privacy Policy, please contact us via email or through our contact page.',
  },
];



Now you have do generate a PrivacyAndPolicy.tsx it has the following features.
 1. it is responsive for both mobile and desktop.
 2. add a little bit animation on transition div. 
 3. you have to design in one single component.
 4. you have to use glass-effect.

 in Desktop: it show the sidebar in left side. it have a toggle features. in sidebar at the top there is button for toggle.
 if there is  childData then it need to render in accordian. with collasp and view option.


 in mobile: there is 3 icon at the bottom.
    1. home (path: "/")
    2. WhatsApp icon 
    3. PrivacyAndPolicy
