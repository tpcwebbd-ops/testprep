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
  iconTbUserShare,
  iconTbUserSquareRounded,
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
      { id: 1000103, name: 'Product Manager', link: '/dashboard/users/product-manager', icon: iconTbUserSquareRounded },
      { id: 1000104, name: 'Order Manager', link: '/dashboard/users/order-manager', icon: iconTbUserShare },
    ],
  },
  {
    id: 10002,
    name: 'Access Management',
    icon: iconRiUserSettingsFill,
    content: [
      { id: 1000201, name: 'All', link: '/dashboard/access-management/all', icon: iconFiUsers },
      { id: 1000202, name: 'Admin', link: '/dashboard/access-management/admin', icon: iconFaUserSecret },
      { id: 1000203, name: 'Product Manager', link: '/dashboard/access-management/product-manager', icon: iconTbUserSquareRounded },
      { id: 1000204, name: 'Order Manager', link: '/dashboard/access-management/order-manager', icon: iconTbUserShare },
      { id: 1000205, name: 'Block Users', link: '/dashboard/access-management/block-users', icon: iconTbUserShare },
    ],
  },
  {
    id: 10003,
    name: 'Category',
    icon: iconBiCategory,
    content: [{ id: 1000301, name: 'All', link: '/dashboard/category/all', icon: iconBiCategory }],
  },
  {
    id: 10004,
    name: 'Products',
    icon: iconLucideBaggageClaim,
    content: [
      { id: 1000401, name: 'All', link: '/dashboard/products/all', icon: iconLucideBaggageClaim },
      { id: 1000402, name: 'Digital', link: '/dashboard/products/digital', icon: iconPiShoppingBagOpenDuotone },
      { id: 1000403, name: 'Physical', link: '/dashboard/products/physical', icon: iconFiShoppingBag },
    ],
  },
  {
    id: 10005,
    name: 'Orders',
    icon: iconFaCartArrowDown,
    content: [
      { id: 1000501, name: 'All', link: '/dashboard/orders/all', icon: iconFaCartArrowDown },
      { id: 1000502, name: 'Pending', link: '/dashboard/orders/pending', icon: iconMdShoppingCartCheckout },
      { id: 1000503, name: 'Processing', link: '/dashboard/orders/processing', icon: iconTbTruckLoading },
      { id: 1000504, name: 'Cancel', link: '/dashboard/orders/cancel', icon: iconMdRemoveShoppingCart },
      { id: 1000505, name: 'Holding', link: '/dashboard/orders/holding', icon: iconTbShoppingCartPause },
      { id: 1000506, name: 'Delivered', link: '/dashboard/orders/delivered', icon: iconTbShoppingCartCopy },
      { id: 1000507, name: 'Shipped', link: '/dashboard/orders/shipped', icon: iconTbShoppingCartBolt },
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
];
