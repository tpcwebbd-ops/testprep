// import {
//   Settings,
//   FileText,
//   Info,
//   Wrench,
//   Phone,
//   HelpCircle,
//   Menu,
//   Lock,
//   ScrollText,
//   FileBadge,
//   ShieldCheck,
//   User,
//   Users,
//   FolderKanban,
//   FileSignature,
//   Sidebar,
//   User2,
// } from 'lucide-react';
// import { BsEnvelopeArrowUp } from 'react-icons/bs';

// export const getIconByIconName = (iName: string) => {
//   if (!iName) return null;
//   const key = iName.replace(/[^a-z0-9]/gi, '').toLowerCase();

//   const map: Record<string, React.ReactNode> = {
//     shieldcheck: <ShieldCheck size={18} />,
//     settings: <Settings size={18} />,
//     filesignature: <FileSignature size={18} />,
//     folderkanban: <FolderKanban size={18} />,
//     user: <User size={18} />,
//     users: <Users size={18} />,
//     filetext: <FileText size={18} />,
//     info: <Info size={18} />,
//     wrench: <Wrench size={18} />,
//     phone: <Phone size={18} />,
//     helpcircle: <HelpCircle size={18} />,
//     menu: <Menu size={18} />,
//     lock: <Lock size={18} />,
//     scrolltext: <ScrollText size={18} />,
//     filebadge: <FileBadge size={18} />,
//     user2: <User2 size={18} />,
//   };

//   return map[key] ?? <User2 size={18} />;
// };

// export interface IDefaultSidebarItem {
//   id: number;
//   name: string;
//   path: string;
//   icon: React.ReactNode;
//   children?: IDefaultSidebarItem[];
// }

// export const defaultDashboardSidebarData: IDefaultSidebarItem[] = [
//   {
//     id: 1,
//     name: 'Profile',
//     path: '/dashboard/profile',
//     icon: <User2 size={18} />,
//   },
//   {
//     id: 2,
//     name: 'Message',
//     path: '/dashboard/Message',
//     icon: <BsEnvelopeArrowUp size={18} />,
//   },
// ];
// export const defaultDashboardSidebarFullData: IDefaultSidebarItem[] = [
//   {
//     id: 1,
//     name: 'Access',
//     path: '/dashboard/access',
//     icon: <ShieldCheck size={18} />,
//     children: [
//       { id: 11, name: 'Access', path: '/dashboard/access/access', icon: <FolderKanban size={16} /> },
//       { id: 12, name: 'Role', path: '/dashboard/access/role', icon: <FileSignature size={16} /> },
//       { id: 122, name: 'Sidebar', path: '/dashboard/access/sidebar', icon: <Sidebar size={16} /> },
//       { id: 123, name: 'Menu Editor', path: '/dashboard/access/menu-editor', icon: <Menu size={16} /> },
//       { id: 13, name: 'Account', path: '/dashboard/access/account', icon: <User size={16} /> },
//       { id: 14, name: 'Users', path: '/dashboard/access/user', icon: <Users size={16} /> },
//       { id: 15, name: 'Session', path: '/dashboard/access/session', icon: <FileText size={16} /> },
//       { id: 16, name: 'Verification', path: '/dashboard/access/verification', icon: <ShieldCheck size={16} /> },
//     ],
//   },
//   {
//     id: 2,
//     name: 'Page Builder',
//     path: '/dashboard/page-builder',
//     icon: <Settings size={18} />,
//   },
// ];
