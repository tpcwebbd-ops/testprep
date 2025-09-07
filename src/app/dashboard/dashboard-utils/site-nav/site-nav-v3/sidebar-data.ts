/*
|-----------------------------------------
| setting up sidebar-data for the app
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, May, 2024
|-----------------------------------------
*/

import { Url } from 'url';
import { ReactNode } from 'react';
import {
  iconFaUserSecret,
  iconFiUsers,
  iconRiUserSettingsLine,
  iconBiCategory,
  iconRiUserSettingsFill,
  iconLucideBaggageClaim,
  iconPiShoppingBagOpenDuotone,
  iconFiShoppingBag,
  iconFaCartArrowDown,
  iconMdShoppingCartCheckout,
  iconTbTruckLoading,
  iconMdRemoveShoppingCart,
  iconTbShoppingCartPause,
  iconTbShoppingCartCopy,
  iconTbShoppingCartBolt,
  iconMdOutlinePermMedia,
  iconGoFileMedia,
  iconLuTrash,
  iconVscSettingsGear,
  iconTbAlignBoxLeftMiddle,
  iconHiBars3BottomLeft,
  iconRiHome6Line,
  iconIoInformationCircleOutline,
  iconRiContactsBook3Line,
  iconMdOutlinePrivacyTip,
  iconMdOutlinePolicy,
  iconFaUserSlash,
  iconFaUsers,
  iconTbUserStar,
  iconMdOutlineLaptopChromebook,
  iconDiGhostSmall,
  iconVscVmActive,
  iconBsTerminalDash,
  iconMdOutlineCloudDone,
  iconRiPassExpiredLine,
  iconImProfile,
} from '../site-nav-v3/side-nav-react-icons';

export type LINKTYPE = {
  name: string;
  link: Url | string;
  badge?: string;
  id?: string | number;
  icon?: ReactNode | string;
};

export type SIDEBARTYPE = {
  id?: string | number;
  name: string;
  icon?: ReactNode | null;
  content: Array<LINKTYPE>;
  isDropdown?: boolean;
  isActive?: boolean;
  link?: Url | string;
};

export const sidebarDataHome: SIDEBARTYPE[] = [
  {
    id: 10001,
    name: 'Users',
    icon: iconRiUserSettingsLine,
    content: [
      { id: 1000101, name: 'All', link: '/dashboard/users/all', icon: iconFiUsers },
      { id: 1000102, name: 'Admin', link: '/dashboard/users/admin', icon: iconFaUserSecret },
      { id: 1000103, name: 'Mentor', link: '/dashboard/users/mentor', icon: iconTbUserStar },
      { id: 1000104, name: 'Students', link: '/dashboard/users/students', icon: iconFaUsers },
      { id: 1000105, name: 'Instructor', link: '/dashboard/users/instructor', icon: iconRiUserSettingsLine },
      { id: 1000106, name: 'Block Users', link: '/dashboard/users/block-users', icon: iconFaUserSlash },
    ],
  },
  {
    id: 10002,
    name: 'Access Management',
    icon: iconRiUserSettingsFill,
    content: [
      { id: 1000201, name: 'All', link: '/dashboard/access-management/all', icon: iconFiUsers },
      { id: 1000202, name: 'Admin', link: '/dashboard/access-management/admin', icon: iconFaUserSecret },
      { id: 1000203, name: 'Mentor', link: '/dashboard/access-management/mentor', icon: iconTbUserStar },
      { id: 1000204, name: 'Students', link: '/dashboard/access-management/students', icon: iconFaUsers },
      { id: 1000205, name: 'Instructor', link: '/dashboard/access-management/instructor', icon: iconRiUserSettingsLine },
      { id: 1000206, name: 'Block Users', link: '/dashboard/access-management/block-users', icon: iconFaUserSlash },
    ],
  },
  {
    id: 10003,
    name: 'Course',
    icon: iconBiCategory,
    content: [
      { id: 1000301, name: 'All', link: '/dashboard/course/all', icon: iconBiCategory },
      { id: 1000302, name: 'IELTS', link: '/dashboard/course/ielts', icon: iconBiCategory },
      { id: 1000303, name: 'Spoken', link: '/dashboard/course/spoken', icon: iconBiCategory },
    ],
  },
  {
    id: 10004,
    name: 'Web Messages',
    icon: iconLucideBaggageClaim,
    content: [
      { id: 1000401, name: 'All', link: '/dashboard/web-message/all', icon: iconLucideBaggageClaim },
      { id: 1000402, name: 'Unread', link: '/dashboard/web-message/unread', icon: iconPiShoppingBagOpenDuotone },
      { id: 1000403, name: 'Read', link: '/dashboard/web-message/read', icon: iconFiShoppingBag },
      { id: 1000404, name: 'Important', link: '/dashboard/web-message/important', icon: iconFiShoppingBag },
      { id: 1000405, name: 'Trash', link: '/dashboard/web-message/trash', icon: iconFiShoppingBag },
    ],
  },
  {
    id: 10005,
    name: 'Finance',
    icon: iconFaCartArrowDown,
    content: [
      { id: 1000501, name: 'Overview', link: '/dashboard/finance/overview', icon: iconFaCartArrowDown },
      { id: 1000502, name: 'All', link: '/dashboard/finance/all', icon: iconFaCartArrowDown },
      { id: 1000503, name: 'Pending', link: '/dashboard/finance/pending', icon: iconMdShoppingCartCheckout },
      { id: 1000504, name: 'Processing', link: '/dashboard/finance/processing', icon: iconTbTruckLoading },
      { id: 1000505, name: 'Cancel', link: '/dashboard/finance/cancel', icon: iconMdRemoveShoppingCart },
      { id: 1000506, name: 'Holding', link: '/dashboard/finance/holding', icon: iconTbShoppingCartPause },
      { id: 1000507, name: 'Paid', link: '/dashboard/finance/paid', icon: iconTbShoppingCartCopy },
      { id: 1000508, name: 'Archive', link: '/dashboard/finance/archived', icon: iconTbShoppingCartBolt },
    ],
  },
  {
    id: 10006,
    name: 'Media',
    icon: iconMdOutlinePermMedia,
    content: [
      { id: 1000601, name: 'All', link: '/dashboard/media/all', icon: iconMdOutlinePermMedia },
      { id: 1000602, name: 'Active', link: '/dashboard/media/active', icon: iconGoFileMedia },
      { id: 1000603, name: 'Trash', link: '/dashboard/media/trash', icon: iconLuTrash },
    ],
  },
  {
    id: 10007,
    name: 'Site Setting',
    icon: iconVscSettingsGear,
    content: [
      { id: 1000701, name: 'Header', link: '/dashboard/site-setting/header', icon: iconTbAlignBoxLeftMiddle },
      { id: 1000702, name: 'Footer', link: '/dashboard/site-setting/footer', icon: iconHiBars3BottomLeft },
      { id: 1000703, name: 'Home', link: '/dashboard/site-setting/home', icon: iconRiHome6Line },
      { id: 1000704, name: 'Info', link: '/dashboard/site-setting/info', icon: iconIoInformationCircleOutline },
      { id: 1000705, name: 'Contact', link: '/dashboard/site-setting/contact', icon: iconRiContactsBook3Line },
      { id: 1000706, name: 'Privacy Policy', link: '/dashboard/site-setting/privacy-policy', icon: iconMdOutlinePrivacyTip },
      { id: 1000707, name: 'Terms and Condition', link: '/dashboard/site-setting/terms-and-condition', icon: iconMdOutlinePolicy },
    ],
  },
  {
    id: 10008,
    name: 'My Course',
    icon: iconMdOutlineLaptopChromebook,
    content: [
      { id: 1000801, name: 'All', link: '/dashboard/my-course/all', icon: iconDiGhostSmall },
      { id: 1000802, name: 'Active', link: '/dashboard/my-course/active', icon: iconVscVmActive },
      { id: 1000803, name: 'Inactive', link: '/dashboard/my-course/inactive', icon: iconBsTerminalDash },
      { id: 1000804, name: 'Finished', link: '/dashboard/my-course/finished', icon: iconMdOutlineCloudDone },
      { id: 1000805, name: 'Expired', link: '/dashboard/my-course/expired', icon: iconRiPassExpiredLine },
    ],
  },
  {
    id: 10009,
    name: 'My Profile',
    icon: iconImProfile,
    content: [{ id: 1000901, name: 'Profile', link: '/dashboard/my-profile', icon: iconImProfile }],
  },
];
