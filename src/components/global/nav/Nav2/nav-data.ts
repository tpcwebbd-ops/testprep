/*
|-----------------------------------------
| setting up Data for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, May, 2024
|-----------------------------------------
*/
const navData = {
  baseInfo: {
    firstName: 'B',
    lastName: 'Varse',
  },
  about: {
    groupTitle: 'About',
    fullName: 'Beta Varse',
    description: ' The best service provider for your business growth.',
    links: [
      {
        id: 1,
        title: 'Introduction',
        url: '/',
        description: 'We are a group of people to solve your problems',
      },
      {
        id: 2,
        title: 'Installation',
        url: '/',
        description: 'We have more then three plan for your business',
      },
      {
        id: 3,
        title: 'Installation',
        url: '/',
        description: 'We have more then three plan for your business',
      },
    ],
  },
  services: {
    groupTitle: 'Services',
    data: [
      {
        title: 'Supports',
        href: '/',
        description: 'A modal dialog that interrupts the user with important content and expects a response.',
      },
      {
        title: 'Preview',
        href: '/',
        description: 'For sighted users to preview content available behind a link.',
      },
      {
        title: 'Indicator',
        href: '/',
        description: 'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
      },
      {
        title: 'Content',
        href: '/',
        description: 'Visually or semantically separates content.',
      },
      {
        title: 'Tabs',
        href: '/',
        description: 'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
      },
      {
        title: 'Information',
        href: '/',
        description: 'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
      },
    ],
  },
  othersLink: [
    { id: 2, title: 'Top Sells', url: '/top-sells' },
    { id: 3, title: 'Contact', url: '/contact' },
  ],
};
export default navData;
