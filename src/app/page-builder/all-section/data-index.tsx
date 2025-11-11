import ClientSection1 from './section-1/Client';
import ClientSection2 from './section-2/Client';
import ClientSection3 from './section-3/Client';
import ClientSection4 from './section-4/Client';
import ClientSection5 from './section-5/Client';
import ClientSection6 from './section-6/Client';

import AdminSection1 from './section-1/Admin';
import AdminSection2 from './section-2/Admin';
import AdminSection3 from './section-3/Admin';
import AdminSection4 from './section-4/Admin';
import AdminSection5 from './section-5/Admin';
import AdminSection6 from './section-6/Admin';

import { defaultData as sectionData1 } from './section-1/data';
import { defaultData as sectionData2 } from './section-2/data';
import { defaultData as sectionData3 } from './section-3/data';
import { defaultData as sectionData4 } from './section-4/data';
import { defaultData as sectionData5 } from './section-5/data';
import { defaultData as sectionData6 } from './section-6/data';

export interface SectionData {
  id: number;
  title: string;
  adminPath: React.ReactNode;
  clientPath: React.ReactNode;
  isActive: boolean;
  picture: string;
}

export const initialSectionData: SectionData[] = [
  {
    id: 1,
    title: 'Section 1',
    adminPath: <AdminSection1 />,
    clientPath: <ClientSection1 />,
    isActive: true,
    picture: '/all-section/section-1.png',
  },
  {
    id: 2,
    title: 'Section 2',
    adminPath: <AdminSection2 />,
    clientPath: <ClientSection2 />,
    isActive: false,
    picture: '/all-section/section-2.png',
  },
  {
    id: 3,
    title: 'Section 3',
    adminPath: <AdminSection3 />,
    clientPath: <ClientSection3 />,
    isActive: false,
    picture: '/all-section/section-3.png',
  },
  {
    id: 4,
    title: 'Section 4',
    adminPath: <AdminSection4 />,
    clientPath: <ClientSection4 />,
    isActive: false,
    picture: '/all-section/section-4.png',
  },
  {
    id: 5,
    title: 'Section 5',
    adminPath: <AdminSection5 />,
    clientPath: <ClientSection5 />,
    isActive: false,
    picture: '/all-section/section-5.png',
  },
  {
    id: 6,
    title: 'Section 6',
    adminPath: <AdminSection6 />,
    clientPath: <ClientSection6 />,
    isActive: false,
    picture: '/all-section/section-6.png',
  },
];
