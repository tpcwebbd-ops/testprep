/*
|-----------------------------------------
| setting up sidebar-data for the app
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, May, 2024
|-----------------------------------------
*/
import { Url } from 'url';
import { ReactNode } from 'react';
import { iconBiPieChartAlt } from './side-nav-react-icons';

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

export const sidebarDataHome: SIDEBARTYPE = {
  name: 'Home',
  icon: iconBiPieChartAlt,
  content: [
    { icon: iconBiPieChartAlt, name: 'E commerce', link: '#', id: 1 },
    { icon: iconBiPieChartAlt, name: 'Marketing', link: '#', id: 2 },
    {
      icon: iconBiPieChartAlt,
      name: 'CRM',
      link: '#',
      badge: 'NEW',
      id: 3,
    },
    {
      icon: iconBiPieChartAlt,
      name: 'Social feed',
      link: '#',
      id: 4,
    },
  ],
};
