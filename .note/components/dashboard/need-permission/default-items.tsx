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
//   User2,
// } from 'lucide-react';

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
// ];
