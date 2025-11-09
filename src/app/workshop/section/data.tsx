import AdminSection1 from './all-section/section-1/Admin';
import ClientSection1 from './all-section/section-1/Client';
import AdminSection2 from './all-section/section-2/Admin';
import ClientSection2 from './all-section/section-2/Client';
import ClientSection3 from './all-section/section-3/Client';
import AdminSection3 from './all-section/section-3/Admin';
import AdminSection4 from './all-section/section-4/Admin';
import ClientSection4 from './all-section/section-4/Client';
import AdminSection5 from './all-section/section-5/Admin';
import ClientSection5 from './all-section/section-5/Client';
import AdminSection6 from './all-section/section-6/Admin';
import ClientSection6 from './all-section/section-6/Client';

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
