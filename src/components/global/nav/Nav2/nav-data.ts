/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, May, 2024
|-----------------------------------------
*/
const navData = {
  baseInfo: {
    firstName: 'Test',
    lastName: 'Prep',
  },
  about: {
    groupTitle: 'About',
    fullName: 'TestPrep Center',
    description:
      'Achieve your desired IELTS band score and master the English language with guidance from Sharif Russel, a senior and highly regarded instructor.',
    links: [
      {
        id: 1,
        title: 'Course Details',
        url: '/',
        description: 'Strategies to find the best course and university that match your academic profile.',
      },
      {
        id: 2,
        title: 'Funding Options',
        url: '/',
        description: 'Learn about scholarships, fellowships, and self-funding options.',
      },
      {
        id: 3,
        title: 'IELTS Preparation',
        url: '/',
        description: 'Effective tips and tricks for all four IELTS modules: Reading, Writing, Listening, and Speaking.',
      },
    ],
  },
  services: {
    groupTitle: 'Services',
    data: [
      {
        title: 'Application Process',
        href: '/',
        description: 'Guidance on writing a strong Statement of Purpose (SOP) and Letter of Recommendation (LOR).',
      },
      {
        title: 'Visa Support',
        href: '/',
        description: 'Comprehensive guidance on preparing for visa interviews and all necessary documentation.',
      },
      {
        title: 'Free Seminars',
        href: '/',
        description: 'Join our free seminars for a complete guide to studying abroad and acing the IELTS exam.',
      },
      {
        title: 'Academic Requirements',
        href: '/',
        description: 'Understand how to apply to the best universities based on your academic results and IELTS score.',
      },
      {
        title: 'Advanced Opportunities',
        href: '/',
        description: 'Information on Graduate, Teaching, and Research Assistantships (GA, TA, RA) and fellowships to fully fund your studies.',
      },
      {
        title: 'Expert Instruction',
        href: '/',
        description: 'Receive the best instruction and guidance from our experienced instructors to ensure your success.',
      },
    ],
  },
  othersLink: [
    { id: 2, title: 'Seminars', url: '/seminars' },
    { id: 3, title: 'Contact', url: '/contact' },
  ],
};
export default navData;
