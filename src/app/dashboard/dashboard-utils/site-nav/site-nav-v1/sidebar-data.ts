/*
|-----------------------------------------
| setting up sidebar-data for the app
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, May, 2024
|-----------------------------------------
*/
import { Url } from 'url';
import { ReactNode } from 'react';

export type LINKTYPE = {
  name: string;
  link: Url | string;
  badge?: string;
  id?: string | number;
  icon?: ReactNode | string;
};

export type SIDEBARTYPE = {
  name: string;
  icon?: ReactNode | null;
  content: Array<LINKTYPE>;
  isDropdown?: boolean;
  isActive?: boolean;
  link?: Url | string;
};
import {
  iconBiPieChartAlt,
  iconAiOutlineShoppingCart,
  iconIoCallOutline,
  iconBsClipboard,
  iconBsChatLeft,
  iconHiOutlineMail,
  iconBsBookmark,
  iconMdOutlineViewKanban,
  iconIoShareSocialOutline,
  iconFiCompass,
  iconBsQuestionCircle,
  iconBsGlobe2,
  iconMdOutlineManageAccounts,
  iconMdOutlineCategory,
  iconBsCartPlus,
  iconBiCategory,
  iconTbDeviceAnalytics,
  iconBsCalendar4Event,
  iconMdOutlineEventAvailable,
  iconCiLocationArrow1,
  iconMdEdit,
  iconAiOutlineExclamationCircle,
  iconBsTrash,
} from './side-nav-react-icons';

export const sidebarDataHome: SIDEBARTYPE = {
  name: 'Home',
  icon: iconBiPieChartAlt,
  content: [
    { icon: iconMdOutlineManageAccounts, name: 'E commerce', link: '#', id: 1 },
    { icon: iconMdOutlineManageAccounts, name: 'Marketing', link: '#', id: 2 },
    {
      icon: iconMdOutlineManageAccounts,
      name: 'CRM',
      link: '#',
      badge: 'NEW',
      id: 3,
    },
    {
      icon: iconMdOutlineManageAccounts,
      name: 'Social feed',
      link: '#',
      id: 4,
    },
  ],
};
export const sidebarDataECommerce: SIDEBARTYPE = {
  name: 'E commerce',
  icon: iconAiOutlineShoppingCart,
  content: [
    {
      icon: iconBsCartPlus,
      name: 'Product management',
      link: '/dashboard/product-management',
      id: 1,
    },
    {
      icon: iconBiCategory,
      name: 'Category',
      link: '/dashboard/product-management/category',
      id: 2,
    },
    {
      icon: iconMdOutlineCategory,
      name: 'Sub Category',
      link: '/dashboard/product-management/sub-category',
      id: 3,
    },
    {
      icon: iconMdOutlineManageAccounts,
      name: 'Orders',
      link: '/dashboard/orders',
      id: 4,
    },
  ],
};
export const sidebarDataCRM: SIDEBARTYPE = {
  name: 'CRM',
  icon: iconIoCallOutline,
  content: [
    {
      name: 'Customers',
      link: '/dashboard/customers',
      id: 1,
      icon: iconMdOutlineManageAccounts,
    },
    {
      name: 'Analytics',
      link: '/dashboard/analytics',
      id: 2,
      icon: iconTbDeviceAnalytics,
    },
  ],
  isActive: true,
};
export const sidebarDataProjectManagement: SIDEBARTYPE = {
  name: 'Project management',
  icon: iconBsClipboard,
  content: [],
};
export const sidebarDataProjectChat: SIDEBARTYPE = {
  name: 'Chat',
  icon: iconBsChatLeft,
  content: [],
  isDropdown: false,
};
export const sidebarDataProjectEmail: SIDEBARTYPE = {
  name: 'Email',
  icon: iconHiOutlineMail,
  content: [
    { id: 1, name: 'Inbox', link: '/dashboard/inbox', icon: iconHiOutlineMail },
    {
      id: 2,
      name: 'Sent',
      link: '/dashboard/inbox',
      icon: iconCiLocationArrow1,
    },
    { id: 3, name: 'Draft', link: '/dashboard/inbox', icon: iconMdEdit },
    {
      id: 4,
      name: 'Spam',
      link: '/dashboard/inbox',
      icon: iconAiOutlineExclamationCircle,
    },
    { id: 5, name: 'Trash', link: '/dashboard/inbox', icon: iconBsTrash },
  ],
};
export const sidebarDataProjectEvents: SIDEBARTYPE = {
  name: 'Events',
  icon: iconBsBookmark,
  content: [
    {
      name: 'Create an event',
      link: '/create-an-event',
      id: 2,
      icon: iconMdOutlineEventAvailable,
    },
    {
      name: 'Event Details',
      link: '/event-details',
      id: 2,
      icon: iconBsCalendar4Event,
    },
  ],
};
export const sidebarDataProjectKanban: SIDEBARTYPE = {
  name: 'Kanban',
  icon: iconMdOutlineViewKanban,
  content: [],
  isActive: true,
};
export const sidebarDataProjectSocial: SIDEBARTYPE = {
  name: 'Social',
  icon: iconIoShareSocialOutline,
  content: [],
};
export const sidebarDataProjectCalendar: SIDEBARTYPE = {
  name: 'Calendar',
  icon: iconAiOutlineShoppingCart,
  content: [],
};
export const sidebarDataProjectStarter: SIDEBARTYPE = {
  name: 'Starter',
  icon: iconFiCompass,
  content: [],
  isDropdown: false,
  link: '/#',
};
export const sidebarDataProjectFaq: SIDEBARTYPE = {
  name: 'Faq',
  icon: iconBsQuestionCircle,
  content: [],
  isActive: true,
  link: '/faq',
};
export const sidebarDataProjectLoading: SIDEBARTYPE = {
  name: 'Loading',
  icon: iconBsGlobe2,
  content: [
    { name: 'Dashboard', link: '/dashboard', id: 1 },
    { name: 'Product management', link: '#', id: 2 },
    { name: 'CRM', link: '#', badge: 'NEW', id: 3 },
    { name: 'Social feed', link: '#', id: 4 },
  ],
  isActive: true,
};
