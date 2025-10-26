Act as a webApp developer in NextJS with Typescript. PWA is already implement in this NextJS project. And you are using tailwindCss.


import { Phone, Mail, MapPin, Clock, MessageCircle, Globe2, Building2, Users, Send } from 'lucide-react';

export const contactData = [
  {
    id: 1,
    name: 'Get in Touch',
    path: '/contact/get-in-touch',
    icon: <MessageCircle />,
    description:
      'We’re always here to help you! Reach out to us for course details, class schedules, or any questions about our English programs. Our support team will respond promptly to assist you.',
  },
  {
    id: 2,
    name: 'Contact Information',
    path: '/contact/information',
    icon: <Phone />,
    childData: [
      {
        id: 21,
        name: 'Phone',
        path: '/contact/information/phone',
        icon: <Phone />,
        description:
          '+880 1700-123456 (Main Office)\n+880 1800-654321 (Student Support)',
      },
      {
        id: 22,
        name: 'Email',
        path: '/contact/information/email',
        icon: <Mail />,
        description:
          'info@englishcentre.com\nsupport@englishcentre.com',
      },
      {
        id: 23,
        name: 'WhatsApp',
        path: '/contact/information/whatsapp',
        icon: <MessageCircle />,
        description:
          'Chat with us directly on WhatsApp: +880 1700-123456',
      },
    ],
  },
  {
    id: 3,
    name: 'Our Location',
    path: '/contact/location',
    icon: <MapPin />,
    description:
      'English Centre, 2nd Floor, Green Plaza, Dhanmondi, Dhaka – 1209, Bangladesh.\nEasily accessible via public transport and ride-sharing services.',
  },
  {
    id: 4,
    name: 'Office Hours',
    path: '/contact/hours',
    icon: <Clock />,
    description:
      'We’re open 6 days a week — visit or contact us during working hours.\n\n🕓 Sunday – Friday: 9:00 AM – 8:00 PM\n❌ Saturday: Closed',
  },
  {
    id: 5,
    name: 'Our Branches',
    path: '/contact/branches',
    icon: <Building2 />,
    childData: [
      {
        id: 51,
        name: 'Dhanmondi Branch',
        path: '/contact/branches/dhanmondi',
        icon: <MapPin />,
        description:
          'Our main campus offering IELTS, Spoken English, and Special English programs for all levels.',
      },
      {
        id: 52,
        name: 'Uttara Branch',
        path: '/contact/branches/uttara',
        icon: <MapPin />,
        description:
          'Conveniently located near Airport Road, specializing in professional English and corporate training.',
      },
    ],
  },
  {
    id: 6,
    name: 'Online Support',
    path: '/contact/online-support',
    icon: <Globe2 />,
    description:
      'No matter where you are, you can reach our team through email, WhatsApp, or website chat. We also provide online consultation for new admissions and placement tests.',
  },
  {
    id: 7,
    name: 'Contact Form',
    path: '/contact/form',
    icon: <Send />,
    description:
      'Fill out our contact form with your name, email, and message — and we’ll get back to you as soon as possible. Your feedback and inquiries are always welcome.',
  },
];


Now you have do generate a Contact.tsx it has the following features.
 1. it is responsive for both mobile and desktop.
 2. add a little bit animation on transition div. 
 3. you have to design in one single component.
 4. you have to use glass-effect.


 in mobile: there is 3 icon at the bottom.
    1. home (path: "/")
    2. WhatsApp icon 
    3. Contact
